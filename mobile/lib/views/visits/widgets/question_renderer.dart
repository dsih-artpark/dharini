import 'package:design_system/design_system.dart';
import 'package:es_platform_mobile/views/sites/widgets/dropdown.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:es_platform_mobile/views/visits/disease_questions_config.dart';
import 'package:es_platform_mobile/views/visits/widgets/species_herd_list_field.dart';
import 'package:es_platform_mobile/hooks/species.dart';
import 'package:es_platform_mobile/utils/species_filter.dart';

class DiseaseQuestionsForm extends StatelessWidget {
  final Map<String, QuestionConfig> questions;
  final Map<String, dynamic> answers;
  final Function(String key, dynamic value) onAnswerChanged;
  final String? disease;

  const DiseaseQuestionsForm({
    required this.questions,
    required this.answers,
    required this.onAnswerChanged,
    this.disease,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: questions.entries.map((entry) {
        final key = entry.key;
        final question = entry.value;

        if (question.showIf != null && !question.showIf!(answers)) {
          return const SizedBox.shrink();
        }

        return Padding(
          padding: const EdgeInsets.only(bottom: 16.0),
          child: _QuestionField(
            questionKey: key,
            question: question,
            answer: answers[key],
            onAnswerChanged: onAnswerChanged,
            disease: disease,
          ),
        );
      }).toList(),
    );
  }
}

class _QuestionField extends HookWidget {
  final String questionKey;
  final QuestionConfig question;
  final dynamic answer;
  final Function(String key, dynamic value) onAnswerChanged;
  final String? disease;

  const _QuestionField({
    required this.questionKey,
    required this.question,
    this.answer,
    required this.onAnswerChanged,
    this.disease,
  });

  @override
  Widget build(BuildContext context) {
    switch (question.type) {
      case QuestionType.text:
      case QuestionType.number:
        final controller =
            useTextEditingController(text: answer?.toString() ?? '');

        // Update controller if answer changes externally
        useEffect(() {
          final newText = answer?.toString() ?? '';
          if (controller.text != newText) {
            controller.text = newText;
          }
          return null;
        }, [answer]);

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              question.label,
              style: AppTypography.textTheme.bodyB2Medium.copyWith(
                color: AppColors.textStrong,
              ),
            ),
            const SizedBox(height: 8),
            TextFormField(
              controller: controller,
              readOnly: question.isReadOnly,
              keyboardType: question.type == QuestionType.number
                  ? TextInputType.number
                  : TextInputType.text,
              inputFormatters: question.type == QuestionType.number
                  ? [FilteringTextInputFormatter.digitsOnly]
                  : [],
              onChanged: (value) {
                if (question.type == QuestionType.number) {
                  onAnswerChanged(questionKey, int.tryParse(value));
                } else {
                  onAnswerChanged(questionKey, value);
                }
              },
              decoration: InputDecoration(
                border: const OutlineInputBorder(),
                fillColor: question.isReadOnly ? AppColors.fillWeak : null,
                filled: question.isReadOnly,
              ),
            ),
          ],
        );

      case QuestionType.speciesHerdList:
        return SpeciesHerdListWidget(
          value: (answer as List?)?.cast<Map<String, dynamic>>(),
          disease: disease,
          onChanged: (newList) {
            onAnswerChanged(questionKey, newList);

            // Auto-calculate totalAnimalsAtSite
            int total = 0;
            for (var item in newList) {
              total += (item['herdSize'] as int?) ?? 0;
            }
            onAnswerChanged('totalAnimalsAtSite', total);
          },
        );

      case QuestionType.dropdown:
        return CustomDropdown<String>(
          label: question.label,
          value: answer as String?,
          options: question.options ?? [],
          onChanged: (value) => onAnswerChanged(questionKey, value),
        );

      case QuestionType.speciesDropdown:
        final speciesQuery = useSpecies();
        final speciesList = speciesQuery.data ?? [];
        final selected = answer as String?;

        // Only offer species applicable to this disease section, plus the one
        // already chosen so it stays visible. Never clear the answer here: it
        // is shared with the other disease sections on the screen (FMD and LSD
        // both use `species`), so a species this section doesn't offer may be
        // valid for another one, and a species missing from a stale cached
        // list may still be valid on the server.
        final applicable = filterSpeciesByDisease(speciesList, disease);
        final options = [
          ...applicable,
          if (selected != null && !applicable.any((s) => s.id == selected))
            ...speciesList.where((s) => s.id == selected),
        ]
            .map((s) => CustomDropdownOption<String>(id: s.id, label: s.name))
            .toList();

        return CustomDropdown<String>(
          label: question.label,
          value: selected,
          options: options,
          onChanged: (value) => onAnswerChanged(questionKey, value),
          isLoading: speciesQuery.isLoading,
        );

      case QuestionType.radio:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              question.label,
              style: AppTypography.textTheme.bodyB2Medium.copyWith(
                color: AppColors.textStrong,
              ),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Radio<bool>(
                  value: true,
                  groupValue: answer as bool?,
                  onChanged: (value) => onAnswerChanged(questionKey, value),
                ),
                Text(
                  'Yes',
                  style: AppTypography.textTheme.bodyB2Regular.copyWith(
                    color: AppColors.textStrong,
                  ),
                ),
                const SizedBox(width: 16),
                Radio<bool>(
                  value: false,
                  groupValue: answer as bool?,
                  onChanged: (value) => onAnswerChanged(questionKey, value),
                ),
                Text(
                  'No',
                  style: AppTypography.textTheme.bodyB2Regular.copyWith(
                    color: AppColors.textStrong,
                  ),
                ),
              ],
            ),
          ],
        );

      case QuestionType.date:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              question.label,
              style: AppTypography.textTheme.bodyB2Medium.copyWith(
                color: AppColors.textStrong,
              ),
            ),
            const SizedBox(height: 8),
            OutlinedButton(
              onPressed: () async {
                final now = DateTime.now();
                final picked = await showDatePicker(
                  context: context,
                  initialDate: now,
                  firstDate: DateTime(now.year - 5),
                  lastDate: DateTime(now.year + 1),
                );
                if (picked != null) {
                  final formatted =
                      '${picked.year.toString().padLeft(4, '0')}-${picked.month.toString().padLeft(2, '0')}-${picked.day.toString().padLeft(2, '0')}';
                  onAnswerChanged(questionKey, formatted);
                }
              },
              child: Text(
                answer?.toString() ?? 'Select date',
                style: TextStyle(
                  color: answer != null
                      ? AppColors.textStrong
                      : AppColors.textWeak,
                ),
              ),
            ),
          ],
        );

      case QuestionType.checkbox:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              question.label,
              style: AppTypography.textTheme.bodyB2Medium.copyWith(
                color: AppColors.textStrong,
              ),
            ),
            const SizedBox(height: 8),
            if (question.checkboxOptions != null)
              Column(
                children: question.checkboxOptions!.map((option) {
                  final selectedOptions = (answer as List<dynamic>?)
                          ?.map((e) => e.toString())
                          .toList() ??
                      [];
                  final isChecked = selectedOptions.contains(option);

                  return CheckboxListTile(
                    value: isChecked,
                    onChanged: (value) {
                      final updated = List<String>.from(selectedOptions);
                      if (value == true) {
                        if (!updated.contains(option)) {
                          updated.add(option);
                        }
                      } else {
                        updated.remove(option);
                      }
                      onAnswerChanged(questionKey, updated);
                    },
                    title: Text(
                      option,
                      style: AppTypography.textTheme.bodyB2Regular.copyWith(
                        color: AppColors.textStrong,
                      ),
                    ),
                    controlAffinity: ListTileControlAffinity.leading,
                    contentPadding: EdgeInsets.zero,
                  );
                }).toList(),
              ),
          ],
        );

      case QuestionType.multiSelectDropdown:
        final selectedOptions =
            (answer as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [];
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              question.label,
              style: AppTypography.textTheme.bodyB2Medium.copyWith(
                color: AppColors.textStrong,
              ),
            ),
            const SizedBox(height: 8),
            GestureDetector(
              onTap: () {
                if (question.checkboxOptions == null) return;
                _showMultiSelectBottomSheet(
                  context,
                  title: question.label,
                  options: question.checkboxOptions!,
                  selectedOptions: selectedOptions,
                  onChanged: (updated) {
                    onAnswerChanged(questionKey, updated);
                  },
                );
              },
              child: InputDecorator(
                decoration: InputDecoration(
                  border: const OutlineInputBorder(),
                  contentPadding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                  hintText: 'Select options',
                  hintStyle: AppTypography.textTheme.bodyB3Regular.copyWith(
                    color: AppColors.textWeak,
                  ),
                  suffixIcon: const Icon(Icons.arrow_drop_down),
                ),
                isEmpty: selectedOptions.isEmpty,
                child: selectedOptions.isEmpty
                    ? null
                    : Wrap(
                        spacing: 6,
                        runSpacing: 4,
                        children: selectedOptions.map((opt) {
                          return Chip(
                            label: Text(opt,
                                style: AppTypography.textTheme.bodyB4Medium),
                            backgroundColor:
                                AppColors.primaryLight.withOpacity(0.1),
                            side: BorderSide.none,
                            deleteIcon: const Icon(Icons.close, size: 14),
                            onDeleted: () {
                              final updated = List<String>.from(selectedOptions)
                                ..remove(opt);
                              onAnswerChanged(questionKey, updated);
                            },
                            materialTapTargetSize:
                                MaterialTapTargetSize.shrinkWrap,
                            visualDensity: VisualDensity.compact,
                          );
                        }).toList(),
                      ),
              ),
            ),
          ],
        );

      case QuestionType.toggle:
        return Container(
          padding: const EdgeInsets.symmetric(vertical: 4),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  question.label,
                  style: AppTypography.textTheme.bodyB2Medium.copyWith(
                    color: AppColors.textStrong,
                  ),
                ),
              ),
              Switch(
                value: answer == true,
                onChanged: (value) => onAnswerChanged(questionKey, value),
                activeColor: AppColors.primaryLight,
              ),
            ],
          ),
        );
    }
  }

  void _showMultiSelectBottomSheet(
    BuildContext context, {
    required String title,
    required List<String> options,
    required List<String> selectedOptions,
    required ValueChanged<List<String>> onChanged,
  }) {
    // Use a local copy so taps are immediately reflected
    final localSelected = List<String>.from(selectedOptions);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (ctx, setLocalState) {
            return SafeArea(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          title,
                          style: AppTypography.textTheme.bodyB2SemiBold
                              .copyWith(color: AppColors.textStrong),
                        ),
                        TextButton(
                          onPressed: () {
                            onChanged(localSelected);
                            Navigator.pop(ctx);
                          },
                          child: const Text('Done'),
                        ),
                      ],
                    ),
                    const Divider(),
                    ...options.map((option) {
                      final isChecked = localSelected.contains(option);
                      return CheckboxListTile(
                        value: isChecked,
                        onChanged: (value) {
                          setLocalState(() {
                            if (value == true) {
                              if (!localSelected.contains(option)) {
                                localSelected.add(option);
                              }
                            } else {
                              localSelected.remove(option);
                            }
                          });
                          onChanged(localSelected);
                        },
                        title: Text(
                          option,
                          style: AppTypography.textTheme.bodyB2Regular.copyWith(
                            color: AppColors.textStrong,
                          ),
                        ),
                        controlAffinity: ListTileControlAffinity.leading,
                        contentPadding: EdgeInsets.zero,
                      );
                    }),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }
}
