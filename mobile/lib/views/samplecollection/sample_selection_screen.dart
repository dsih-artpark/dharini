import 'package:design_system/design_system.dart';
import 'package:es_client/es_client.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';

import '../../hooks/auth.dart';
import '../../hooks/visit_draft.dart';
import '../../hooks/resume_marker.dart';
import '../../utils/disease_utils.dart';
import 'models/sample_data.dart';
import 'widgets/animal_metadata_card.dart';
import 'widgets/sample_count_stepper.dart';

/// Unified sample selection screen for both Environmental and Clinical flows.
/// The [flowType] controls the title and which sample types are shown.
class SampleSelectionScreen extends HookWidget {
  final String visitId;
  final UpdateVisitDto updateVisitDto;
  final VisitResponseData visitDetails;

  /// 'Environmental' or 'Clinical'
  final String flowType;

  // ── Clinical-specific params ──
  final String? collectionType;
  final bool isBothFlow;
  final List<String> completedFlows;
  final Map<String, dynamic>? clinicalMetadata;

  // ── Add-more mode ──
  final bool addMore;
  final List<SampleTypeCount> existingSamplesSummary;

  // Samples accumulated from previous steps
  final List<SampleData> existingSamples;
  final bool isNewAnimal;

  const SampleSelectionScreen({
    Key? key,
    required this.visitId,
    required this.updateVisitDto,
    required this.visitDetails,
    this.flowType = 'Environmental',
    this.collectionType,
    this.isBothFlow = false,
    this.completedFlows = const [],
    this.clinicalMetadata,
    this.addMore = false,
    this.existingSamplesSummary = const [],
    this.existingSamples = const [],
    this.isNewAnimal = false,
  }) : super(key: key);

  bool get _isClinical => flowType == 'Clinical';

  @override
  Widget build(BuildContext context) {
    final sampleTypes = useSampleType();
    final selectedSamples = useState<Map<String, int>>({});
    final restoredSamplesState = useState<List<SampleData>>([]);

    // Types already taken into the barcode/detail step for this flow. Shown as
    // read-only chips on top and excluded from the selectable list so they are
    // never re-selected / double-counted (Feature 2).
    final committedSamples = useState<List<SampleTypeCount>>([]);

    // Integrating draft saving and pre-population
    final draftController = useVisitDraft(visitId, initialStepIndex: 4);
    useResumeMarker(
      draft: draftController,
      route: '/SampleSelectionScreen',
      stepIndex: 4,
      buildArgs: () => <String, dynamic>{
        'flowType': flowType,
        'collectionType': collectionType,
        'isBothFlow': isBothFlow,
        'completedFlows': completedFlows,
        'isNewAnimal': isNewAnimal,
      },
    );
    final hasRestored = useState<bool>(false);

    // RESTORE STATE FROM DRAFT
    useEffect(() {
      final draft = draftController.draft;
      if (draft != null && draft.stepData.isNotEmpty && !hasRestored.value) {
        final data = draft.stepData;
        final draftKey = 'selectedSamples_$flowType';

        // Parse already-committed types (carried into barcode entry) for chips.
        // Only relevant outside addMore mode (addMore uses existingSamplesSummary).
        final groupsKey = 'sampleGroups_$flowType';
        final parsedCommitted = <SampleTypeCount>[];
        if (!addMore && data[groupsKey] is List) {
          for (final rg in (data[groupsKey] as List)) {
            try {
              final map = Map<String, dynamic>.from(rg as Map);
              parsedCommitted.add(SampleTypeCount.fromJson(
                  Map<String, dynamic>.from(map['typeCount'] as Map)));
            } catch (e) {
              print('[SampleSelectionScreen] Error parsing committed group: $e');
            }
          }
          committedSamples.value = parsedCommitted;
        }

        if (addMore) {
          print(
              '[SampleSelectionScreen] addMore: starting with empty selection.');
        } else if (parsedCommitted.isNotEmpty) {
          // Returning after committing types -> empty selection; committed types
          // are chips and excluded from the list (no double count).
          print(
              '[SampleSelectionScreen] ${parsedCommitted.length} committed type(s) present; starting empty selection.');
        } else if (!isNewAnimal && data[draftKey] != null) {
          try {
            selectedSamples.value = Map<String, int>.from(
              (data[draftKey] as Map)
                  .map((k, v) => MapEntry(k.toString(), v as int)),
            );
            print(
                '[SampleSelectionScreen] Restored selectedSamples: ${selectedSamples.value}');
          } catch (e) {
            print('[SampleSelectionScreen] Error restoring selectedSamples: $e');
          }
        } else if (isNewAnimal) {
          print(
              '[SampleSelectionScreen] isNewAnimal: skipping selectedSamples restoration.');
        }

        if (data['samples'] != null && restoredSamplesState.value.isEmpty) {
          try {
            final rawList = data['samples'] as List;
            restoredSamplesState.value = rawList
                .map((e) =>
                    SampleData.fromJson(Map<String, dynamic>.from(e as Map)))
                .toList();
          } catch (e) {
            print('[SampleSelectionScreen] Error restoring samples fallback: $e');
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
        final draftKey = 'selectedSamples_$flowType';
        currentData[draftKey] = selectedSamples.value;
        draftController.updateDraft(currentData, 4);
      }
      return null;
    }, [hasRestored.value, selectedSamples.value]);

    void updateSampleCount(String sampleId, int count) {
      if (count > 0) {
        selectedSamples.value = {...selectedSamples.value, sampleId: count};
      } else {
        final newMap = Map<String, int>.from(selectedSamples.value);
        newMap.remove(sampleId);
        selectedSamples.value = newMap;
      }
    }

    final totalSamples =
        selectedSamples.value.values.fold(0, (sum, count) => sum + count);

    // Filter sample types by flowType and active diseases
    final activeDiseases = DiseaseUtils.extractActiveDiseases(
        updateVisitDto.suspectDiseaseData?.toList());

    final filteredTypes = sampleTypes.data?.where((type) {
      final stName = type.surveillanceType?.name.toLowerCase() ?? '';
      if (stName.isEmpty) return true;

      // Filter by applicable diseases if disease list exists and at least one is selected
      if (activeDiseases.isNotEmpty &&
          type.diseaseShortNames != null &&
          type.diseaseShortNames!.isNotEmpty) {
        final matchesDisease =
            type.diseaseShortNames!.any((d) => activeDiseases.contains(d));
        if (!matchesDisease) return false;
      }

      if (_isClinical) return stName.contains('clinical');
      return stName.contains('environmental') || stName.contains('env');
    }).toList();

    // Chips to show on top + ids to hide from the selectable list (Feature 2).
    final chipsSamples =
        addMore ? existingSamplesSummary : committedSamples.value;
    // Already-added (committed) samples are part of this flow's total even
    // though they're excluded from `selectedSamples` to avoid double-saving.
    // Include their count so the bottom total reflects everything collected.
    final alreadyAddedCount =
        chipsSamples.fold<int>(0, (sum, stc) => sum + stc.count);
    final displayTotalSamples = totalSamples + alreadyAddedCount;
    final committedIds = addMore
        ? <String>{}
        : committedSamples.value.map((s) => s.sampleId).toSet();
    final selectableTypes =
        filteredTypes?.where((t) => !committedIds.contains(t.id)).toList();
    final canProceed = totalSamples > 0 ||
        (!addMore && committedSamples.value.isNotEmpty);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: const BackButton(color: AppColors.textStrong),
        title: Text(
          '${_isClinical ? 'Clinical' : 'Environmental'} Samples',
          style: AppTypography.textTheme.bodyB2SemiBold.copyWith(
            color: AppColors.textStrong,
          ),
        ),
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
          onPressed: !canProceed
              ? null
              : () async {
                  final samples = selectedSamples.value.entries.map((e) {
                    final sampleType = sampleTypes.data?.firstWhere(
                      (type) => type.id == e.key,
                      orElse: () => throw Exception('Sample type not found'),
                    );
                    if (sampleType == null) {
                      throw Exception('Sample type not found');
                    }
                    return SampleTypeCount(
                      type: sampleType.name,
                      count: e.value,
                      sampleId: e.key,
                      emojiIcon: sampleType.emojiIcon,
                    );
                  }).toList();

                  if (addMore) {
                    context.pop(samples);
                  } else {
                    print(
                        '[SampleSelectionScreen] Proceed clicked. Saving chosen sample counts immediately: ${selectedSamples.value}');
                    if (draftController.draft != null) {
                      final currentData = Map<String, dynamic>.from(
                          draftController.draft!.stepData);
                      final draftKey = 'selectedSamples_$flowType';
                      currentData[draftKey] = selectedSamples.value;
                      await draftController.updateDraftImmediate(
                          currentData, 4);
                      print(
                          '[SampleSelectionScreen] Immediate draft save completed successfully!');
                    }

                    if (context.mounted) {
                      final route = _isClinical
                          ? '/EnvironmentalBarcodeEntryScreen'
                          : '/EnvironmentalMetadataScreen';

                      final activeSamples = existingSamples.isNotEmpty ? existingSamples : restoredSamplesState.value;

                      context.push(route, extra: {
                        'selectedSamples': samples,
                        'visitId': visitId,
                        'updateVisitDto': updateVisitDto,
                        'visitDetails': visitDetails,
                        'existingSamples': activeSamples,
                        'collectionType': collectionType,
                        'currentFlow': flowType,
                        'isBothFlow': isBothFlow,
                        'completedFlows': completedFlows,
                        'clinicalMetadata': clinicalMetadata,
                        'isNewAnimal': isNewAnimal,
                      });
                    }
                  }
                },
          child: const Text('Proceed'),
        ),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Read-only reminder of which animal these clinical samples
              // belong to. Clinical flow only; self-hides when no animal
              // metadata is present (incl. resume — the resumer restores
              // clinicalMetadata from the draft).
              if (_isClinical) AnimalMetadataCard(metadata: clinicalMetadata),
              // ── Already-added chips ──
              if (chipsSamples.isNotEmpty) ...[
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: AppColors.primaryLight.withOpacity(0.04),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                        color: AppColors.primaryLight.withOpacity(0.15)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Icon(Icons.inventory_2_outlined,
                              size: 16, color: AppColors.primaryLight),
                          const SizedBox(width: 6),
                          Text(
                            'Already added samples',
                            style:
                                AppTypography.textTheme.bodyB3Medium.copyWith(
                              color: AppColors.primaryLight,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: chipsSamples
                            .map((stc) => Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 10, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(20),
                                    border:
                                        Border.all(color: AppColors.strokeWeak),
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Text(
                                        chipsSamples
                                                .firstWhere((element) =>
                                                    element.type == stc.type)
                                                .emojiIcon ??
                                            '🧪',
                                        style: TextStyle(fontSize: 14),
                                      ),
                                      const SizedBox(width: 6),
                                      Text(
                                        '${stc.type} \u00d7 ${stc.count}',
                                        style: AppTypography
                                            .textTheme.bodyB4Medium
                                            .copyWith(
                                                color: AppColors.textStrong),
                                      ),
                                    ],
                                  ),
                                ))
                            .toList(),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
              ],

              Text(
                'Select types and enter count per type',
                style: AppTypography.textTheme.bodyB2Regular.copyWith(
                  color: AppColors.textWeak,
                ),
              ),
              const SizedBox(height: 24),

              // ── Loading / Error / List ──
              if (sampleTypes.isLoading)
                const Center(child: CircularProgressIndicator())
              else if (sampleTypes.error != null)
                Center(
                  child: Text(
                    'Failed to load sample types',
                    style: AppTypography.textTheme.bodyB2Regular.copyWith(
                      color: AppColors.errorLight,
                    ),
                  ),
                )
              else if (selectableTypes != null &&
                  selectableTypes.isEmpty &&
                  committedSamples.value.isNotEmpty)
                Center(
                  child: Text(
                    'All sample types have already been added.',
                    style: AppTypography.textTheme.bodyB2Regular.copyWith(
                      color: AppColors.textWeak,
                    ),
                  ),
                )
              else if (selectableTypes == null || selectableTypes.isEmpty)
                Center(
                  child: Text(
                    'No ${_isClinical ? 'clinical' : 'environmental'} sample types available',
                    style: AppTypography.textTheme.bodyB2Regular.copyWith(
                      color: AppColors.textWeak,
                    ),
                  ),
                )
              else
                ...selectableTypes.map((type) {
                  final count = selectedSamples.value[type.id] ?? 0;
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: count > 0
                            ? AppColors.primaryLight.withOpacity(0.04)
                            : AppColors.white,
                        border: Border.all(
                          color: count > 0
                              ? AppColors.primaryLight
                              : AppColors.strokeWeak,
                          width: count > 0 ? 1.5 : 1,
                        ),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        children: [
                          Text(
                            type.emojiIcon ?? '🧪',
                            style: const TextStyle(fontSize: 24),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  type.name,
                                  style: AppTypography.textTheme.bodyB2SemiBold
                                      .copyWith(
                                    color: AppColors.textStrong,
                                  ),
                                ),
                                if (type.surveillanceType != null)
                                  Text(
                                    type.surveillanceType!.name,
                                    style: AppTypography.textTheme.bodyB4Regular
                                        .copyWith(
                                      color: AppColors.textWeak,
                                    ),
                                  ),
                              ],
                            ),
                          ),
                          SampleCountStepper(
                            count: count,
                            onChanged: (value) =>
                                updateSampleCount(type.id, value),
                          ),
                        ],
                      ),
                    ),
                  );
                }).toList(),

              const SizedBox(height: 24),

              // Total Samples Box
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: AppColors.primaryLight.withOpacity(0.06),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                      color: AppColors.primaryLight.withOpacity(0.2)),
                ),
                child: Column(
                  children: [
                    Text(
                      'Total Samples Selected',
                      style: AppTypography.textTheme.bodyB2Regular.copyWith(
                        color: AppColors.textWeak,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      displayTotalSamples.toString(),
                      style: AppTypography.textTheme.headingH1.copyWith(
                        color: AppColors.primaryDark,
                        fontSize: 40,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
