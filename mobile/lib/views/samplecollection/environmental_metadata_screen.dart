import 'package:built_value/json_object.dart';
import 'package:design_system/design_system.dart';
import 'package:es_client/es_client.dart';
import 'package:es_platform_mobile/utils/hive_serialization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import '../../hooks/visit_draft.dart';
import '../../hooks/resume_marker.dart';

import '../visits/widgets/question_renderer.dart';
import '../visits/disease_questions_config.dart';
import '../visits/environmental_questions_config.dart';
import 'models/sample_data.dart';

/// Result returned when [EnvironmentalMetadataScreen] is used in add-more mode.
class EnvironmentalMetadataResult {
  final List<SampleTypeCount> samples;
  final Map<String, Map<String, dynamic>> metadata;

  const EnvironmentalMetadataResult({
    required this.samples,
    required this.metadata,
  });
}

class EnvironmentalMetadataScreen extends HookWidget {
  final String visitId;
  final UpdateVisitDto updateVisitDto;
  final VisitResponseData visitDetails;
  final List<SampleTypeCount> selectedSamples;
  final String? collectionType;
  final bool isBothFlow;
  final List<String> completedFlows;
  final List<SampleData> existingSamples;
  final Map<String, dynamic>? clinicalMetadata;

  /// When true the screen pops with an [EnvironmentalMetadataResult] instead
  /// of pushing to the barcode-entry screen. Use this for the "Add More Samples"
  /// flow inside [EnvironmentalBarcodeEntryScreen].
  final bool addMore;

  /// Already-collected metadata for all sample types. Questions for types
  /// present in this map will be skipped (pre-answered) when [addMore] is true.
  final Map<String, Map<String, dynamic>> existingMetadata;

  const EnvironmentalMetadataScreen({
    Key? key,
    required this.visitId,
    required this.updateVisitDto,
    required this.visitDetails,
    required this.selectedSamples,
    this.collectionType,
    this.isBothFlow = false,
    this.completedFlows = const [],
    this.existingSamples = const [],
    this.clinicalMetadata,
    this.addMore = false,
    this.existingMetadata = const {},
  }) : super(key: key);

  /// Build question map — skip types that already have metadata (add-more mode).
  Map<String, Map<String, QuestionConfig>> _buildQuestionMap() {
    final Map<String, Map<String, QuestionConfig>> sectionQuestions = {};

    for (final sample in selectedSamples) {
      // In add-more mode skip types whose metadata was already collected.
      if (addMore && existingMetadata.containsKey(sample.type)) continue;

      final codes = getEnvironmentalQuestions(sample.type);
      if (codes.isEmpty) continue;

      final questions = <String, QuestionConfig>{};
      for (final code in codes) {
        if (environmentalQuestionRegistry.containsKey(code)) {
          questions[code] = environmentalQuestionRegistry[code]!;
        }
      }

      if (questions.isNotEmpty) {
        sectionQuestions[sample.type] = questions;
      }
    }
    return sectionQuestions;
  }

  @override
  Widget build(BuildContext context) {
    // answers.value structure: { "Drinking Water": { "sourceOfDrinkingWater": "Tap" } }
    final answers = useState<Map<String, Map<String, dynamic>>>({});
    final restoredSamplesState = useState<List<SampleData>>([]);

    // Integrating draft saving and pre-population
    final draftController = useVisitDraft(visitId, initialStepIndex: 4);
    useResumeMarker(
      draft: draftController,
      route: '/EnvironmentalMetadataScreen',
      stepIndex: 4,
      buildArgs: () => <String, dynamic>{
        'selectedSamples': selectedSamples.map((s) => s.toJson()).toList(),
        'collectionType': collectionType,
        'isBothFlow': isBothFlow,
        'completedFlows': completedFlows,
      },
    );
    final hasRestored = useState<bool>(false);

    // RESTORE STATE FROM DRAFT
    useEffect(() {
      final draft = draftController.draft;
      if (draft != null && draft.stepData.isNotEmpty && !hasRestored.value) {
        final data = draft.stepData;
        if (data['environmentalMetadata'] != null) {
          try {
            answers.value = (data['environmentalMetadata'] as Map).map(
              (k, v) =>
                  MapEntry(k.toString(), Map<String, dynamic>.from(v as Map)),
            );
            print(
                '[EnvironmentalMetadataScreen] Successfully restored answers: ${answers.value}');
          } catch (e) {
            print(
                '[EnvironmentalMetadataScreen] Error parsing environmentalMetadata: $e');
          }
        }
        if (data['samples'] != null && restoredSamplesState.value.isEmpty) {
          try {
            final rawList = data['samples'] as List;
            restoredSamplesState.value = rawList.map((e) => SampleData.fromJson(Map<String, dynamic>.from(e as Map))).toList();
            print('[EnvironmentalMetadataScreen] Restored ${restoredSamplesState.value.length} samples from draft.');
          } catch (e) {
            print('[EnvironmentalMetadataScreen] Error restoring samples fallback: $e');
          }
        }
        hasRestored.value = true;
      } else if (draft != null && draft.stepData.isEmpty) {
        hasRestored.value = true;
      }
      return null;
    }, [draftController.draft]);

    // AUTO-SAVE ON CHANGES
    useEffect(() {
      if (!hasRestored.value || addMore) return null;
      if (draftController.draft != null) {
        final currentData =
            Map<String, dynamic>.from(draftController.draft!.stepData);
        currentData['environmentalMetadata'] = answers.value;
        draftController.updateDraft(currentData, 4);
      }
      return null;
    }, [hasRestored.value, answers.value]);
    final sectionQuestions = _buildQuestionMap();
    final hasQuestions = sectionQuestions.isNotEmpty;

    void handleProceed({bool replace = false}) async {
      if (addMore) {
        // Merge previously-collected metadata with newly answered questions.
        final merged = <String, Map<String, dynamic>>{
          ...existingMetadata,
          ...answers.value,
        };
        context.pop(EnvironmentalMetadataResult(
          samples: selectedSamples,
          metadata: merged,
        ));
        return;
      }

      print(
          '[EnvironmentalMetadataScreen] Proceed clicked. Saving answers immediately: ${answers.value}');
      final updatedDtoBuilder = updateVisitDto.toBuilder();
      if (answers.value.isNotEmpty) {
        updatedDtoBuilder.environmentalQuestionnaireData =
            JsonObject(answers.value);
      }
      final updatedDto = updatedDtoBuilder.build();

      if (draftController.draft != null) {
        final currentData =
            Map<String, dynamic>.from(draftController.draft!.stepData);
        currentData['environmentalMetadata'] = answers.value;
        final serialized = HiveSerialization.serializeBuiltValue(
          UpdateVisitDto.serializer,
          updatedDto,
        );
        if (serialized != null) {
          currentData['updateVisitDto'] = serialized;
        }
        await draftController.updateDraftImmediate(currentData, 4);
        print(
            '[EnvironmentalMetadataScreen] Immediate draft save completed successfully!');
      }

      final activeSamples = existingSamples.isNotEmpty ? existingSamples : restoredSamplesState.value;

      final extra = {
        'selectedSamples': selectedSamples,
        'visitId': visitId,
        'updateVisitDto': updatedDto,
        'visitDetails': visitDetails,
        'collectionType': collectionType ?? 'Environmental',
        'isBothFlow': isBothFlow,
        'completedFlows': completedFlows,
        'existingSamples': activeSamples,
        'clinicalMetadata': clinicalMetadata,
      };

      if (context.mounted) {
        if (replace) {
          context.pushReplacement('/EnvironmentalBarcodeEntryScreen',
              extra: extra);
        } else {
          context.push('/EnvironmentalBarcodeEntryScreen', extra: extra);
        }
      }
    }

    // Skip straight through if no new questions need answering.
    useEffect(() {
      if (!hasQuestions) {
        WidgetsBinding.instance.addPostFrameCallback((_) {
          handleProceed(replace: !addMore);
        });
      }
      return null;
    }, [hasQuestions]);

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
          'Environmental Data',
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
              color: Colors.black.withOpacity(0.1),
              blurRadius: 4,
              offset: const Offset(0, -2),
            ),
          ],
        ),
        child: AppButton(
          onPressed: handleProceed,
          child: Text(addMore ? 'Confirm' : 'Continue to Barcode Entry'),
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Info banner
            Container(
              width: double.infinity,
              color: AppColors.primaryLight.withOpacity(0.06),
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  const Icon(Icons.info_outline,
                      size: 20, color: AppColors.primaryLight),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'Sample Details (Optional)',
                      style: AppTypography.textTheme.bodyB3Regular.copyWith(
                        color: AppColors.textStrong,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 8),

            // Type sections with their questions
            ...sectionQuestions.entries.map((entry) {
              final typeName = entry.key;
              final questions = entry.value;

              return Container(
                width: double.infinity,
                color: Colors.white,
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      typeName,
                      style: AppTypography.textTheme.headingH3.copyWith(
                        color: AppColors.textStrong,
                      ),
                    ),
                    const SizedBox(height: 16),
                    DiseaseQuestionsForm(
                      questions: questions,
                      answers: answers.value[typeName] ?? {},
                      onAnswerChanged: (key, value) {
                        final updated = Map<String, Map<String, dynamic>>.from(
                            answers.value);
                        final sectorAnswers =
                            Map<String, dynamic>.from(updated[typeName] ?? {});

                        if (value == null ||
                            (value is String && value.trim().isEmpty)) {
                          sectorAnswers.remove(key);
                        } else {
                          sectorAnswers[key] = value;
                        }

                        if (sectorAnswers.isEmpty) {
                          updated.remove(typeName);
                        } else {
                          updated[typeName] = sectorAnswers;
                        }

                        answers.value = updated;
                      },
                    ),
                  ],
                ),
              );
            }),
          ],
        ),
      ),
    );
  }
}
