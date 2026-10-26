import 'dart:convert';
import 'dart:math';

import 'package:design_system/design_system.dart';
import 'package:es_client/es_client.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import '../../hooks/visit_draft.dart';
import '../../hooks/resume_marker.dart';
import '../../hooks/animal_metadata.dart';

import '../sites/widgets/dropdown.dart';
import '../visits/disease_questions_config.dart';
import '../visits/widgets/question_renderer.dart';
import 'models/animal_metadata_model.dart';
import 'models/sample_data.dart';

/// Sentinel value used in the animal-picker dropdown to mean "start a fresh
/// animal entry". Kept as a non-UUID constant so it cannot collide with a real
/// AnimalMetadata id.
const String _kNewAnimalSentinel = '__new_animal__';

/// Module-level RNG — instantiated once, avoids overhead of creating a new
/// Random() instance on every ID generation call.
final _rng = Random();

/// Mints a fresh `localAnimalId` and assigns it to [answers] in-place.
/// Format: `animal_<microseconds>_<6-digit random>`.
void _initLocalAnimalId(ValueNotifier<Map<String, dynamic>> answers) {
  final ts = DateTime.now().microsecondsSinceEpoch;
  final rnd = _rng.nextInt(999999);
  final newId = 'animal_${ts}_$rnd';
  answers.value = {...answers.value, 'localAnimalId': newId};
  print('[ClinicalMetadataScreen] Minted localAnimalId: $newId');
}

/// Screen shown before clinical sample selection.
/// Presents per-sample metadata questions (animal tag ID, species, breed, etc.)
/// sourced from [sampleDiseaseQuestions] in disease_questions_config.dart.
/// When existing animals for the site are available they are shown as
/// selectable cards so the user can skip re-entering metadata.
class ClinicalMetadataScreen extends HookWidget {
  final String visitId;
  final UpdateVisitDto updateVisitDto;
  final VisitResponseData visitDetails;
  final String? collectionType;
  final bool isBothFlow;
  final List<String> completedFlows;
  final List<SampleData> existingSamples;
  final bool isNewAnimal;

  const ClinicalMetadataScreen({
    Key? key,
    required this.visitId,
    required this.updateVisitDto,
    required this.visitDetails,
    this.collectionType,
    this.isBothFlow = false,
    this.completedFlows = const [],
    this.existingSamples = const [],
    this.isNewAnimal = false,
  }) : super(key: key);

  /// Extract disease short names from the updateVisitDto.suspectDiseaseData
  List<String> _getSelectedDiseaseShortNames() {
    final suspectData = updateVisitDto.suspectDiseaseData;
    if (suspectData == null || suspectData.isEmpty) return [];

    final shortNames = <String>[];
    for (final jsonStr in suspectData) {
      try {
        final decoded = jsonDecode(jsonStr) as Map<String, dynamic>;
        final shortName = decoded['shortName'] as String?;
        if (shortName != null && shortName.isNotEmpty) {
          shortNames.add(shortName);
        }
      } catch (_) {}
    }
    return shortNames;
  }

  /// Build the combined question map from sampleDiseaseQuestions for all
  /// selected diseases, keyed by question code.
  Map<String, QuestionConfig> _buildQuestionMap(
      List<String> diseaseShortNames) {
    final questions = <String, QuestionConfig>{};
    for (final shortName in diseaseShortNames) {
      final codes = getSampleQuestions(shortName, visitDetails.site.farmType);
      for (final code in codes) {
        if (questionRegistry.containsKey(code) &&
            !questions.containsKey(code)) {
          questions[code] = questionRegistry[code]!;
        }
      }
    }
    return questions;
  }

  @override
  Widget build(BuildContext context) {
    final siteId = visitDetails.site.id;
    final answers = useState<Map<String, dynamic>>({});
    final restoredSamplesState = useState<List<SampleData>>([]);

    // Whether user has explicitly chosen an existing animal from the cards.
    // When true the metadata form is hidden — the selectedAnimalMetadataId in
    // answers is all the backend needs.
    final selectedExistingAnimal = useState<AnimalMetadataModel?>(null);

    // Integrating draft saving and pre-population
    final draftController = useVisitDraft(visitId, initialStepIndex: 4);
    useResumeMarker(
      draft: draftController,
      route: '/ClinicalMetadataScreen',
      stepIndex: 4,
      buildArgs: () => <String, dynamic>{
        'collectionType': collectionType,
        'isBothFlow': isBothFlow,
        'completedFlows': completedFlows,
        'isNewAnimal': isNewAnimal,
      },
    );
    final hasRestored = useState<bool>(false);

    // Fetch existing animals for this site (non-blocking — returns [] on error)
    final animalsQuery = useAnimalMetadataBySite(siteId);
    final existingAnimals = animalsQuery.data ?? const <AnimalMetadataModel>[];
    // Show the picker spinner only when we do not have any cached/loaded data
    // to display (data is null or empty) and a fetch is currently in progress.
    final isAnimalsLoading = (animalsQuery.data == null || animalsQuery.data!.isEmpty) &&
        (animalsQuery.isLoading || animalsQuery.isFetching);

    // Consolidate ID generation + draft restoration into one effect to avoid
    // race conditions between two separate effects mutating `answers.value`.
    useEffect(() {
      final draft = draftController.draft;
      if (draft != null && !hasRestored.value) {
        final data = draft.stepData;
        if (data.isNotEmpty &&
            !isNewAnimal &&
            data['clinicalMetadata'] != null) {
          try {
            final restored =
                Map<String, dynamic>.from(data['clinicalMetadata'] as Map);
            // Preserve existing localAnimalId from draft, or mint a fresh one
            if (restored['localAnimalId'] == null ||
                (restored['localAnimalId'] as String).isEmpty) {
              final ts = DateTime.now().microsecondsSinceEpoch;
              final rnd = _rng.nextInt(999999);
              restored['localAnimalId'] = 'animal_${ts}_$rnd';
            }
            answers.value = restored;
            print(
                '[ClinicalMetadataScreen] Successfully restored answers (localAnimalId: ${restored['localAnimalId']})');
          } catch (e) {
            print(
                '[ClinicalMetadataScreen] Error parsing clinicalMetadata: $e');
            _initLocalAnimalId(answers);
          }
        } else {
          // isNewAnimal == true, empty draft, or no existing metadata → mint a fresh ID
          if (isNewAnimal) {
            print(
                '[ClinicalMetadataScreen] isNewAnimal=true: starting fresh with new localAnimalId.');
          }
          _initLocalAnimalId(answers);
        }

        if (data['samples'] != null && restoredSamplesState.value.isEmpty) {
          try {
            final rawList = data['samples'] as List;
            restoredSamplesState.value = rawList
                .map((e) =>
                    SampleData.fromJson(Map<String, dynamic>.from(e as Map)))
                .toList();
            print(
                '[ClinicalMetadataScreen] Restored ${restoredSamplesState.value.length} samples from draft.');
          } catch (e) {
            print('[ClinicalMetadataScreen] Error restoring samples: $e');
          }
        }

        hasRestored.value = true;
      }
      // NOTE: deliberately no `draft == null` branch here. On the first build
      // useVisitDraft is still loading (draft == null); minting a fresh ID and
      // setting hasRestored=true at that point would permanently skip the real
      // restore once the draft loads. useVisitDraft always resolves to a
      // non-null draft (loaded or a fresh empty one), so the branch above
      // handles both restore and fresh-mint correctly once it arrives.
      return null;
    }, [draftController.draft]);

    // AUTO-SAVE ON CHANGES
    useEffect(() {
      if (!hasRestored.value) return null;
      if (draftController.draft != null) {
        final currentData =
            Map<String, dynamic>.from(draftController.draft!.stepData);
        currentData['clinicalMetadata'] = answers.value;
        draftController.updateDraft(currentData, 4);
      }
      return null;
    }, [hasRestored.value, answers.value]);

    final diseaseShortNames = _getSelectedDiseaseShortNames();
    final questions = _buildQuestionMap(diseaseShortNames);
    final hasQuestions = questions.isNotEmpty;

    // True when the user picked an existing animal — form is skipped
    final isExistingSelected = selectedExistingAnimal.value != null;

    void handleProceed({bool replace = false}) async {
      print(
          '[ClinicalMetadataScreen] Proceed clicked. Saving answers immediately: ${answers.value}');
      if (draftController.draft != null) {
        final currentData =
            Map<String, dynamic>.from(draftController.draft!.stepData);
        currentData['clinicalMetadata'] = answers.value;
        await draftController.updateDraftImmediate(currentData, 4);
        print(
            '[ClinicalMetadataScreen] Immediate draft save completed successfully!');
      }

      final activeSamples = existingSamples.isNotEmpty
          ? existingSamples
          : restoredSamplesState.value;

      final extra = {
        'visitId': visitId,
        'updateVisitDto': updateVisitDto,
        'visitDetails': visitDetails,
        'flowType': 'Clinical',
        'collectionType': collectionType ?? 'Clinical',
        'isBothFlow': isBothFlow,
        'completedFlows': completedFlows,
        'clinicalMetadata': answers.value,
        'existingSamples': activeSamples,
        'isNewAnimal': isNewAnimal,
      };

      if (context.mounted) {
        if (replace) {
          context.pushReplacement('/SampleSelectionScreen', extra: extra);
        } else {
          context.push('/SampleSelectionScreen', extra: extra);
        }
      }
    }

    // If there are no sample-level questions for the selected diseases,
    // skip straight to clinical sample selection.
    useEffect(() {
      if (!hasQuestions) {
        WidgetsBinding.instance.addPostFrameCallback((_) {
          handleProceed(replace: true);
        });
      }
      return null;
    }, []);

    if (!hasQuestions) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: const BackButton(color: AppColors.textStrong),
        title: Text(
          'Animal/Bird Metadata',
          style: AppTypography.textTheme.bodyB2SemiBold.copyWith(
            color: AppColors.textStrong,
          ),
        ),
        centerTitle: true,
      ),
      bottomNavigationBar: Container(
        padding: EdgeInsets.only(
          left: 16,
          right: 16,
          bottom: MediaQuery.of(context).padding.bottom + 16,
          top: 16,
        ),
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.1),
              blurRadius: 4,
              offset: const Offset(0, -2),
            ),
          ],
        ),
        child: AppButton(
          onPressed: handleProceed,
          child: Text(isExistingSelected
              ? 'Use Selected Animal'
              : 'Continue to Sample Selection'),
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Existing Animal Picker (dropdown) ─────────────────────────
            // Always shown (with "+ Add new animal" as the default) so the
            // collector can either reuse a previously recorded animal at this
            // site or start a fresh entry. Loads silently — if the device is
            // offline or no animals have ever been recorded, the dropdown
            // simply shows only the "Add new animal" option.
            _AnimalPicker(
              animals: existingAnimals,
              isLoading: isAnimalsLoading,
              selectedId: selectedExistingAnimal.value?.id,
              onSelected: (animal) {
                if (animal == null) {
                  // User chose "Add new animal" — clear selection and mint a
                  // fresh localAnimalId so the new entry is dedup-safe inside
                  // this submission batch.
                  selectedExistingAnimal.value = null;
                  _initLocalAnimalId(answers);
                } else {
                  selectedExistingAnimal.value = animal;
                  answers.value = animal.toSelectedAnswers();
                }
              },
            ),

            // ── Manual metadata form (hidden when existing animal selected) ──
            if (!isExistingSelected) ...[
              // Info banner
              Container(
                width: double.infinity,
                color: AppColors.primaryLight.withValues(alpha: 0.06),
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    const Icon(Icons.info_outline,
                        size: 20, color: AppColors.primaryLight),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        existingAnimals.isEmpty
                            ? 'Add animal/bird details to attach to all samples from this collection.'
                            : 'Enter details for a new animal/bird below.',
                        style: AppTypography.textTheme.bodyB3Regular.copyWith(
                          color: AppColors.textStrong,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 8),

              // Disease sections with their questions
              ...diseaseShortNames.map((shortName) {
                final codes =
                    getSampleQuestions(shortName, visitDetails.site.farmType);
                final diseaseQuestions = <String, QuestionConfig>{};
                for (final code in codes) {
                  if (questionRegistry.containsKey(code)) {
                    diseaseQuestions[code] = questionRegistry[code]!;
                  }
                }
                if (diseaseQuestions.isEmpty) return const SizedBox.shrink();

                return Container(
                  width: double.infinity,
                  color: Colors.white,
                  margin: const EdgeInsets.only(bottom: 8),
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '$shortName — Metadata',
                        style: AppTypography.textTheme.headingH3.copyWith(
                          color: AppColors.textStrong,
                        ),
                      ),
                      const SizedBox(height: 16),
                      DiseaseQuestionsForm(
                        disease: shortName,
                        questions: diseaseQuestions,
                        answers: answers.value,
                        onAnswerChanged: (key, value) {
                          final updated =
                              Map<String, dynamic>.from(answers.value);
                          if (value == null ||
                              (value is String && value.trim().isEmpty)) {
                            updated.remove(key);
                          } else {
                            updated[key] = value;
                          }
                          answers.value = updated;
                        },
                      ),
                    ],
                  ),
                );
              }),
            ],

            // ── Selected animal confirmation banner ─────────────────────
            if (isExistingSelected)
              _SelectedAnimalBanner(
                animal: selectedExistingAnimal.value!,
                onClear: () {
                  selectedExistingAnimal.value = null;
                  _initLocalAnimalId(answers);
                },
              ),
          ],
        ),
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Private widgets
// ═══════════════════════════════════════════════════════════════════════════

/// Dropdown picker that lets the collector either reuse a previously-recorded
/// animal from this site or start a fresh entry. Designed to work offline:
/// when the device can't reach the API, the dropdown silently falls back to
/// "Add new animal" only — no broken state, no error UI.
class _AnimalPicker extends StatelessWidget {
  final List<AnimalMetadataModel> animals;
  final bool isLoading;
  final String? selectedId;

  /// Called with the selected animal, or `null` when the user picks
  /// "+ Add new animal".
  final ValueChanged<AnimalMetadataModel?> onSelected;

  const _AnimalPicker({
    required this.animals,
    required this.isLoading,
    required this.selectedId,
    required this.onSelected,
  });

  /// Build a one-line label for a dropdown row.
  /// Format: `<emoji> Tag XYZ123 · Species · 3y 2m`
  String _buildLabel(AnimalMetadataModel a) {
    final parts = <String>[];
    final emoji = a.speciesEmoji ?? '🐾';
    if (a.primaryId.isNotEmpty) {
      parts.add(a.primaryId);
    } else if (a.speciesName != null) {
      parts.add(a.speciesName!);
    } else {
      parts.add('Unknown');
    }
    if (a.primaryId.isNotEmpty && a.speciesName != null) {
      parts.add(a.speciesName!);
    }
    if (a.ageLabel.isNotEmpty) parts.add(a.ageLabel);
    if (a.gender != null && a.gender!.isNotEmpty) parts.add(a.gender!);
    return '$emoji  ${parts.join(' · ')}';
  }

  @override
  Widget build(BuildContext context) {
    final options = <CustomDropdownOption<String>>[
      const CustomDropdownOption(
          id: _kNewAnimalSentinel, label: 'Choose Animal ID'),
      ...animals.map(
        (a) => CustomDropdownOption(id: a.id, label: _buildLabel(a)),
      ),
    ];

    // The dropdown's "value" is the selected animal ID, or the sentinel if
    // the user has chosen to add a new one.
    final value = selectedId ?? _kNewAnimalSentinel;

    return Container(
      width: double.infinity,
      color: Colors.white,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.pets, size: 18, color: AppColors.primaryLight),
              const SizedBox(width: 8),
              Text(
                'Existing Animal/Bird Metadata',
                style: AppTypography.textTheme.bodyB2SemiBold.copyWith(
                  color: AppColors.textStrong,
                ),
              ),
              if (animals.isNotEmpty && !isLoading) ...[
                const SizedBox(width: 6),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: AppColors.primaryLight.withValues(alpha: 0.08),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    '${animals.length} recorded',
                    style: AppTypography.textTheme.bodyB4Regular.copyWith(
                      color: AppColors.primaryLight,
                    ),
                  ),
                ),
              ],
            ],
          ),
          const SizedBox(height: 8),
          CustomDropdown<String>(
            label: '',
            hintText: 'Choose an animal',
            // Show the spinner whenever a refresh is in flight so a stale list
            // is never displayed under the dropdown while fresh data loads.
            isLoading: isLoading,
            value: value,
            options: options,
            onChanged: (id) {
              if (id == null || id == _kNewAnimalSentinel) {
                onSelected(null);
                return;
              }
              // Look up the picked animal — guarded firstWhere so a stale id
              // (e.g. row deleted in another session) silently falls back to
              // a fresh-animal entry rather than crashing the form.
              AnimalMetadataModel? picked;
              for (final a in animals) {
                if (a.id == id) {
                  picked = a;
                  break;
                }
              }
              onSelected(picked);
            },
          ),
          if (animals.isEmpty && !isLoading)
            Padding(
              padding: const EdgeInsets.only(top: 6),
              child: Text(
                'No animals recorded yet at this site — fill the form below to register the first one.',
                style: AppTypography.textTheme.bodyB4Regular.copyWith(
                  color: AppColors.textWeak,
                ),
              ),
            ),
        ],
      ),
    );
  }
}

/// Shown at the bottom when an existing animal has been confirmed, summarising
/// which animal will be used and offering a quick way to clear the selection.
class _SelectedAnimalBanner extends StatelessWidget {
  final AnimalMetadataModel animal;
  final VoidCallback onClear;

  const _SelectedAnimalBanner({
    required this.animal,
    required this.onClear,
  });

  @override
  Widget build(BuildContext context) {
    final details = <MapEntry<String, String>>[
      if (animal.animalTagId != null && animal.animalTagId!.isNotEmpty)
        MapEntry('Animal Tag ID', animal.animalTagId!),
      if (animal.birdId != null && animal.birdId!.isNotEmpty)
        MapEntry('Bird ID', animal.birdId!),
      if (animal.breed != null && animal.breed!.isNotEmpty)
        MapEntry('Breed', animal.breed!),
      if (animal.gender != null && animal.gender!.isNotEmpty)
        MapEntry('Gender', animal.gender!),
      if (animal.ageLabel.isNotEmpty) MapEntry('Age', animal.ageLabel),
      if (animal.vaccinationStage != null &&
          animal.vaccinationStage!.isNotEmpty)
        MapEntry('Vaccination', animal.vaccinationStage!),
      MapEntry('Fever Observed', animal.feverObserved ? 'Yes' : 'No'),
    ];

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: AppColors.primaryLight.withValues(alpha: 0.15),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: AppColors.primaryLight.withValues(alpha: 0.08),
                  shape: BoxShape.circle,
                ),
                child: Text(
                  animal.speciesEmoji ?? '🐾',
                  style: const TextStyle(fontSize: 24),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      animal.speciesName ?? 'Selected Animal',
                      style: AppTypography.textTheme.bodyB1SemiBold.copyWith(
                        color: AppColors.textStrong,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Reusing registered site metadata',
                      style: AppTypography.textTheme.bodyB4Regular.copyWith(
                        color: AppColors.textWeak,
                      ),
                    ),
                  ],
                ),
              ),
              IconButton(
                icon: const Icon(Icons.close, size: 18),
                color: AppColors.textWeak,
                onPressed: onClear,
                style: IconButton.styleFrom(
                  backgroundColor: AppColors.strokeWeak.withValues(alpha: 0.6),
                  padding: const EdgeInsets.all(8),
                  minimumSize: Size.zero,
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
                tooltip: 'Deselect animal',
              ),
            ],
          ),
          const SizedBox(height: 14),
          const Divider(
            height: 1,
            thickness: 1,
            color: AppColors.strokeWeak,
          ),
          const SizedBox(height: 14),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: 10,
              mainAxisSpacing: 10,
              childAspectRatio: 2.8,
            ),
            itemCount: details.length,
            itemBuilder: (context, index) {
              final detail = details[index];
              final isFeverAlert =
                  detail.key == 'Fever Observed' && detail.value == 'Yes';

              return Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: isFeverAlert
                      ? AppColors.semanticsRed10.withValues(alpha: 0.5)
                      : AppColors.background.withValues(alpha: 0.5),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: isFeverAlert
                        ? AppColors.semanticsRed20.withValues(alpha: 0.5)
                        : AppColors.strokeWeak,
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      detail.key,
                      style: AppTypography.textTheme.bodyB4Regular.copyWith(
                        color: isFeverAlert
                            ? AppColors.semanticsRed30
                            : AppColors.textWeak,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      detail.value,
                      style: AppTypography.textTheme.bodyB3Medium.copyWith(
                        color: isFeverAlert
                            ? AppColors.semanticsRed30
                            : AppColors.textStrong,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
