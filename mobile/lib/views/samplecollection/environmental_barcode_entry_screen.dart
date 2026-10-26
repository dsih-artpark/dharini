import 'dart:typed_data';

import 'package:design_system/design_system.dart';
import 'package:es_client/es_client.dart';
import 'package:es_platform_mobile/hooks/barcode_validator.dart';
import 'package:es_platform_mobile/hooks/visit_draft.dart';
import 'package:es_platform_mobile/hooks/resume_marker.dart';
import 'package:es_platform_mobile/utils/barcode_utils.dart';
import 'package:es_platform_mobile/utils/extensions/index.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:collection/collection.dart';

import '../../constants/sample_units.dart';
import '../sites/widgets/dropdown.dart';
import '../visits/environmental_questions_config.dart';
import 'package:es_platform_mobile/widgets/image_preview_dialog.dart';
import 'package:es_platform_mobile/utils/image_picker_helper.dart';
import 'environmental_metadata_screen.dart';
import 'models/sample_data.dart';
import 'widgets/animal_metadata_card.dart';

enum BarcodeEntryMode {
  bulkGenerate,
  continuousScan,
}

enum _FlattenedItemType {
  animalCard,
  header,
  modeTabs,
  bulkPrefix,
  bulkInfo,
  scanArea,
  scanInfo,
  sampleRow,
  spacing,
  addMoreButton,
}

/// Opens the barcode scanner and returns every barcode the collector accepted.
///
/// [maxCount] above 1 keeps the scanner open for a continuous session;
/// [existing] lets a caller omit a row's own barcode so re-scanning it is not
/// read as a duplicate.
typedef OpenScanner = Future<List<String>> Function({
  List<String>? existing,
  int maxCount,
  int alreadyScanned,
  int? totalCount,
  String? sampleType,
});

class _FlattenedItem {
  final int groupIndex;
  final int? sampleIndex;
  final _FlattenedItemType type;
  final bool isFirst;
  final bool isLast;

  _FlattenedItem({
    required this.groupIndex,
    this.sampleIndex,
    required this.type,
    this.isFirst = false,
    this.isLast = false,
  });

  _FlattenedItem copyWith({bool? isFirst, bool? isLast}) {
    return _FlattenedItem(
      groupIndex: groupIndex,
      sampleIndex: sampleIndex,
      type: type,
      isFirst: isFirst ?? this.isFirst,
      isLast: isLast ?? this.isLast,
    );
  }
}

// Per-sample state
class EnvSampleItemState {
  String barcode;
  num? quantity;
  String? unit;
  List<String> replicateBarcodes;
  Map<String, dynamic> metadata;
  String comments;
  List<String> photos;

  EnvSampleItemState({
    this.barcode = '',
    this.quantity,
    this.unit,
    this.replicateBarcodes = const [],
    this.metadata = const {},
    this.comments = '',
    this.photos = const [],
  });

  EnvSampleItemState copyWith({
    String? barcode,
    num? quantity,
    String? unit,
    List<String>? replicateBarcodes,
    Map<String, dynamic>? metadata,
    String? comments,
    List<String>? photos,
  }) {
    return EnvSampleItemState(
      barcode: barcode ?? this.barcode,
      quantity: quantity ?? this.quantity,
      unit: unit ?? this.unit,
      replicateBarcodes: replicateBarcodes ?? this.replicateBarcodes,
      metadata: metadata ?? this.metadata,
      comments: comments ?? this.comments,
      photos: photos ?? this.photos,
    );
  }
}

// Per-type-group state
class SampleGroupState {
  final SampleTypeCount typeCount;
  BarcodeEntryMode mode;
  String bulkPrefix;
  List<EnvSampleItemState> samples;

  SampleGroupState({
    required this.typeCount,
    this.mode = BarcodeEntryMode.bulkGenerate,
    this.bulkPrefix = '',
    List<EnvSampleItemState>? samples,
  }) : samples = samples ??
            List.generate(typeCount.count, (_) => EnvSampleItemState());
}

/// Generic barcode entry screen — works for both Environmental and Clinical flows.
/// Clinical samples additionally show animal metadata fields in single-entry mode.
class EnvironmentalBarcodeEntryScreen extends HookWidget {
  final String visitId;
  final UpdateVisitDto updateVisitDto;
  final VisitResponseData visitDetails;
  final List<SampleTypeCount> selectedSamples;

  // Routing context — forwarded to NextActionScreen
  final String? collectionType;
  final String? currentFlow;
  final bool isBothFlow;
  final List<String> completedFlows;

  // Samples from previous steps (e.g. clinical samples when doing Both flow)
  final List<SampleData> existingSamples;

  // Clinical metadata (animal tag, species, breed) to attach to each sample
  final Map<String, dynamic>? clinicalMetadata;
  final bool isNewAnimal;

  bool get isClinical => currentFlow == 'Clinical';

  const EnvironmentalBarcodeEntryScreen({
    Key? key,
    required this.visitId,
    required this.updateVisitDto,
    required this.visitDetails,
    required this.selectedSamples,
    this.collectionType,
    this.currentFlow,
    this.isBothFlow = false,
    this.completedFlows = const [],
    this.existingSamples = const [],
    this.clinicalMetadata,
    this.isNewAnimal = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final groups = useState<List<SampleGroupState>>(
      selectedSamples.map((stc) => SampleGroupState(typeCount: stc)).toList(),
    );

    final barcodeValidator = useBarcodeValidator();
    final restoredSamplesState = useState<List<SampleData>>([]);

    // Integrating draft saving and pre-population
    final draftController = useVisitDraft(visitId, initialStepIndex: 5);
    useResumeMarker(
      draft: draftController,
      route: '/EnvironmentalBarcodeEntryScreen',
      stepIndex: 5,
      buildArgs: () => <String, dynamic>{
        'selectedSamples': selectedSamples.map((s) => s.toJson()).toList(),
        'collectionType': collectionType,
        'currentFlow': currentFlow,
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
        if (data['samples'] != null && restoredSamplesState.value.isEmpty) {
          try {
            final rawList = data['samples'] as List;
            restoredSamplesState.value = rawList
                .map((e) =>
                    SampleData.fromJson(Map<String, dynamic>.from(e as Map)))
                .toList();
            print(
                '[EnvironmentalBarcodeEntryScreen] Restored ${restoredSamplesState.value.length} fallback samples from draft.');
          } catch (e) {
            print(
                '[EnvironmentalBarcodeEntryScreen] Error restoring samples fallback: $e');
          }
        }
        final draftKey = 'sampleGroups_${currentFlow ?? "Environmental"}';
        if (!isNewAnimal && data[draftKey] != null) {
          try {
            final rawGroups = data[draftKey] as List;
            final restoredGroups = rawGroups.map((rg) {
              final map = Map<String, dynamic>.from(rg as Map);
              final typeCount = SampleTypeCount.fromJson(
                  Map<String, dynamic>.from(map['typeCount'] as Map));
              final mode = BarcodeEntryMode.values.firstWhere(
                (m) => m.name == map['mode'] as String,
                orElse: () => BarcodeEntryMode.bulkGenerate,
              );
              final bulkPrefix = map['bulkPrefix'] as String? ?? '';
              final samplesList = (map['samples'] as List).map((s) {
                final smap = Map<String, dynamic>.from(s as Map);
                return EnvSampleItemState(
                  barcode: smap['barcode'] as String? ?? '',
                  quantity: smap['quantity'] as num?,
                  unit: smap['unit'] as String?,
                  replicateBarcodes: List<String>.from(
                      smap['replicateBarcodes'] as List? ?? []),
                  metadata:
                      Map<String, dynamic>.from(smap['metadata'] as Map? ?? {}),
                  comments: smap['comments'] as String? ?? '',
                  photos: List<String>.from(smap['photos'] as List? ?? []),
                );
              }).toList();
              return SampleGroupState(
                typeCount: typeCount,
                mode: mode,
                bulkPrefix: bulkPrefix,
                samples: samplesList,
              );
            }).toList();

            // Union restored groups with the incoming selection, keyed by
            // sampleId. Restored groups (already-committed types) are always
            // kept with their entered data; a brand-new empty group is added
            // only for an incoming type that has no restored group. This makes
            // back->forward navigation non-destructive and never double-counts.
            final mergedGroups = <SampleGroupState>[];
            for (final rg in restoredGroups) {
              final incoming = selectedSamples.firstWhereOrNull(
                (stc) => stc.sampleId == rg.typeCount.sampleId,
              );
              if (incoming != null) {
                // Type is also in the incoming selection — re-size to the
                // requested count, preserving entered samples where present.
                final newSamples =
                    List<EnvSampleItemState>.generate(incoming.count, (i) {
                  if (i < rg.samples.length) return rg.samples[i];
                  return EnvSampleItemState();
                });
                mergedGroups.add(SampleGroupState(
                  typeCount: incoming,
                  mode: rg.mode,
                  bulkPrefix: rg.bulkPrefix,
                  samples: newSamples,
                ));
              } else {
                // Committed earlier and not re-selected — keep exactly as-is.
                mergedGroups.add(rg);
              }
            }
            for (final stc in selectedSamples) {
              final exists =
                  mergedGroups.any((g) => g.typeCount.sampleId == stc.sampleId);
              if (!exists) {
                mergedGroups.add(SampleGroupState(typeCount: stc));
              }
            }

            groups.value = mergedGroups;
            print(
                '[EnvironmentalBarcodeEntryScreen] Unioned restored groups with selection (${mergedGroups.length} groups).');
          } catch (e) {
            print(
                '[EnvironmentalBarcodeEntryScreen] Error restoring groups from draft: $e');
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
      if (!hasRestored.value) return null;
      if (draftController.draft != null) {
        final currentData =
            Map<String, dynamic>.from(draftController.draft!.stepData);
        final draftKey = 'sampleGroups_${currentFlow ?? "Environmental"}';
        currentData[draftKey] = groups.value
            .map((g) => {
                  'typeCount': g.typeCount.toJson(),
                  'mode': g.mode.name,
                  'bulkPrefix': g.bulkPrefix,
                  'samples': g.samples
                      .map((s) => {
                            'barcode': s.barcode,
                            'quantity': s.quantity,
                            'unit': s.unit,
                            'replicateBarcodes': s.replicateBarcodes,
                            'metadata': s.metadata,
                            'comments': s.comments,
                            'photos': s.photos,
                          })
                      .toList(),
                })
            .toList();
        draftController.updateDraft(currentData, 5);
      }
      return null;
    }, [hasRestored.value, groups.value]);

    // Tracks which sample types have already had metadata collected.
    // Seeded from the DTO so that metadata from the initial flow is recognized.
    Map<String, Map<String, dynamic>> _seedEnvMetadata() {
      if (isClinical) return <String, Map<String, dynamic>>{};
      final rawMeta = updateVisitDto.environmentalQuestionnaireData?.value;
      if (rawMeta is! Map) return <String, Map<String, dynamic>>{};
      final entries =
          rawMeta.entries.where((e) => e.value is Map).map((e) => MapEntry(
                e.key as String,
                Map<String, dynamic>.from(e.value as Map),
              ));
      return Map<String, Map<String, dynamic>>.fromEntries(entries);
    }

    final collectedEnvMetadata =
        useState<Map<String, Map<String, dynamic>>>(_seedEnvMetadata());

    // Memoize derivative stats to avoid O(N) work on every rebuild.
    final stats = useMemoized(() {
      int samplesWithoutBarcode = 0;
      int totalAssigned = 0;
      int totalExpected = 0;
      final allBarcodes = <String>{};

      for (final g in groups.value) {
        totalExpected += g.typeCount.count;
        for (final s in g.samples) {
          if (s.barcode.isEmpty) {
            samplesWithoutBarcode++;
          } else {
            totalAssigned++;
            allBarcodes.add(s.barcode);
          }
          for (final r in s.replicateBarcodes) {
            if (r.isEmpty) {
              samplesWithoutBarcode++;
            } else {
              totalAssigned++;
              allBarcodes.add(r);
            }
          }
        }
      }
      return (
        samplesWithoutBarcode: samplesWithoutBarcode,
        totalAssigned: totalAssigned,
        totalExpected: totalExpected,
        allBarcodes: allBarcodes,
      );
    }, [groups.value]);

    final samplesWithoutBarcode = stats.samplesWithoutBarcode;
    final totalAssigned = stats.totalAssigned;
    final totalExpected = stats.totalExpected;
    final allBarcodes = stats.allBarcodes;

    // ── Helpers ────────────────────────────────────────────────────────────

    void updateGroup(int groupIndex, SampleGroupState updated) {
      final newGroups = List<SampleGroupState>.from(groups.value);
      newGroups[groupIndex] = updated;
      groups.value = newGroups;
    }

    void updateSample(
        int groupIndex, int sampleIndex, EnvSampleItemState updated) {
      final g = groups.value[groupIndex];
      final newSamples = List<EnvSampleItemState>.from(g.samples);
      newSamples[sampleIndex] = updated;
      updateGroup(
          groupIndex,
          SampleGroupState(
            typeCount: g.typeCount,
            mode: g.mode,
            bulkPrefix: g.bulkPrefix,
            samples: newSamples,
          ));
    }

    Future<List<String>> openScanner({
      List<String>? existing,
      int maxCount = 1,
      int alreadyScanned = 0,
      int? totalCount,
      String? sampleType,
    }) async {
      final result =
          await context.push<List<String>>('/BarcodeScannerScreen', extra: {
        'visitId': visitId,
        'existingBarcodes': existing ?? allBarcodes.toList(),
        'maxCount': maxCount,
        'alreadyScanned': alreadyScanned,
        'totalCount': totalCount,
        'sampleType': sampleType,
      });
      return result ?? const <String>[];
    }

    Future<void> handleBulkGenerate(int groupIndex) async {
      FocusScope.of(context).unfocus();
      final group = groups.value[groupIndex];
      if (group.bulkPrefix.isEmpty) return;

      final newBarcodes = BarcodeUtils.generateSequence(
        group.bulkPrefix,
        group.samples.length,
      );
      final newSamples = group.samples
          .asMap()
          .entries
          .map((e) => e.value.copyWith(barcode: newBarcodes[e.key]))
          .toList();

      final existingBarcodes = <String>{};
      for (final s in existingSamples) {
        if (s.barcode.isNotEmpty) existingBarcodes.add(s.barcode);
      }

      // Get barcodes from other groups (excluding the group being generated)
      final otherGroupsBarcodes = <String>{};
      for (int i = 0; i < groups.value.length; i++) {
        if (i == groupIndex) continue;
        final g = groups.value[i];
        for (final s in g.samples) {
          if (s.barcode.isNotEmpty) otherGroupsBarcodes.add(s.barcode);
          for (final r in s.replicateBarcodes) {
            if (r.isNotEmpty) otherGroupsBarcodes.add(r);
          }
        }
      }

      final duplicate = newBarcodes.firstWhere(
        (b) => existingBarcodes.contains(b) || otherGroupsBarcodes.contains(b),
        orElse: () => '',
      );

      if (duplicate.isNotEmpty) {
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text(
                  'Duplicate found: A barcode or prefix matches an already existing one. All barcodes must be unique.'),
              backgroundColor: Colors.red,
            ),
          );
        }
        return;
      }

      // Validate each generated barcode against the DB batch-wise
      final error = await barcodeValidator.validateBatch(newBarcodes);
      if (error != null) {
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(error),
              backgroundColor: Colors.red,
            ),
          );
        }
        return;
      }

      updateGroup(
          groupIndex,
          SampleGroupState(
            typeCount: group.typeCount,
            mode: group.mode,
            bulkPrefix: group.bulkPrefix,
            samples: newSamples,
          ));
    }

    // Flattened items for ListView.builder virtualization
    final listItems = useMemoized(() {
      final items = <_FlattenedItem>[];
      // Clinical flow only: show the animal this batch belongs to at the top.
      if (isClinical &&
          clinicalMetadata != null &&
          clinicalMetadata!.isNotEmpty) {
        items.add(_FlattenedItem(
            groupIndex: -2, type: _FlattenedItemType.animalCard));
      }
      for (int gIdx = 0; gIdx < groups.value.length; gIdx++) {
        final group = groups.value[gIdx];
        items.add(_FlattenedItem(
            groupIndex: gIdx, type: _FlattenedItemType.header, isFirst: true));
        items.add(_FlattenedItem(
            groupIndex: gIdx, type: _FlattenedItemType.modeTabs));

        if (group.mode == BarcodeEntryMode.bulkGenerate) {
          items.add(_FlattenedItem(
              groupIndex: gIdx, type: _FlattenedItemType.bulkPrefix));
          final generated =
              group.samples.where((s) => s.barcode.isNotEmpty).length;
          if (generated > 0) {
            items.add(_FlattenedItem(
                groupIndex: gIdx, type: _FlattenedItemType.bulkInfo));
            for (int sIdx = 0; sIdx < group.samples.length; sIdx++) {
              if (group.samples[sIdx].barcode.isNotEmpty) {
                items.add(_FlattenedItem(
                  groupIndex: gIdx,
                  sampleIndex: sIdx,
                  type: _FlattenedItemType.sampleRow,
                ));
              }
            }
          } else {
            items.add(_FlattenedItem(
                groupIndex: gIdx,
                type: _FlattenedItemType.bulkInfo,
                isLast: true));
          }
        } else {
          // Continuous Scan
          final scanned =
              group.samples.where((s) => s.barcode.isNotEmpty).length;
          final remaining = group.typeCount.count - scanned;
          if (remaining > 0) {
            items.add(_FlattenedItem(
                groupIndex: gIdx, type: _FlattenedItemType.scanArea));
          }
          if (scanned > 0) {
            items.add(_FlattenedItem(
                groupIndex: gIdx, type: _FlattenedItemType.scanInfo));
            for (int sIdx = 0; sIdx < group.samples.length; sIdx++) {
              if (group.samples[sIdx].barcode.isNotEmpty) {
                items.add(_FlattenedItem(
                  groupIndex: gIdx,
                  sampleIndex: sIdx,
                  type: _FlattenedItemType.sampleRow,
                ));
              }
            }
          }
        }

        // Add spacing and ensure last item of group marked isLast
        if (items.isNotEmpty && items.last.groupIndex == gIdx) {
          items.last = items.last.copyWith(isLast: true);
        }
        items.add(
            _FlattenedItem(groupIndex: gIdx, type: _FlattenedItemType.spacing));
      }
      items.add(_FlattenedItem(
          groupIndex: -1, type: _FlattenedItemType.addMoreButton));
      return items;
    }, [groups.value]);

    // ── Build ───────────────────────────────────────────────────────────────

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.white,
        elevation: 0,
        leading: const BackButton(color: AppColors.textStrong),
        title: Text(
          isClinical
              ? 'Clinical Sample Barcodes'
              : 'Environmental Sample Barcodes',
          style: AppTypography.textTheme.bodyB2SemiBold.copyWith(
            color: AppColors.textStrong,
          ),
        ),
      ),
      bottomNavigationBar: _BottomBar(
        totalAssigned: totalAssigned,
        totalExpected: totalExpected,
        onProceed: () async {
          if (samplesWithoutBarcode > 0) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(
                  samplesWithoutBarcode == 1
                      ? '1 sample is missing a barcode. Please complete all entries to continue.'
                      : '$samplesWithoutBarcode samples are missing barcodes. Please complete all entries to continue.',
                  style: AppTypography.textTheme.bodyB3SemiBold
                      .copyWith(color: AppColors.white),
                ),
                backgroundColor: Colors.red,
                behavior: SnackBarBehavior.floating,
                margin: const EdgeInsets.all(16),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8)),
              ),
            );
            return;
          }

          // Gather all entered barcodes on this screen to validate uniqueness
          final allEnteredBarcodes = <String>[];
          for (final s in existingSamples) {
            if (s.barcode.isNotEmpty) {
              allEnteredBarcodes.add(s.barcode);
            }
          }
          for (final g in groups.value) {
            for (final s in g.samples) {
              if (s.barcode.isNotEmpty) {
                allEnteredBarcodes.add(s.barcode);
              }
              for (final r in s.replicateBarcodes) {
                if (r.isNotEmpty) {
                  allEnteredBarcodes.add(r);
                }
              }
            }
          }

          // Find any duplicates
          final seenBarcodes = <String>{};
          final duplicateBarcodes = <String>{};
          for (final bc in allEnteredBarcodes) {
            if (seenBarcodes.contains(bc)) {
              duplicateBarcodes.add(bc);
            } else {
              seenBarcodes.add(bc);
            }
          }

          if (duplicateBarcodes.isNotEmpty) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(
                  'Duplicate barcodes found: ${duplicateBarcodes.join(", ")}. All barcodes must be unique to proceed.',
                  style: AppTypography.textTheme.bodyB3SemiBold
                      .copyWith(color: AppColors.white),
                ),
                backgroundColor: Colors.red,
                behavior: SnackBarBehavior.floating,
                margin: const EdgeInsets.all(16),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8)),
              ),
            );
            return;
          }

          final allSampleData = <SampleData>[];
          for (final g in groups.value) {
            for (final s in g.samples) {
              if (s.barcode.isEmpty) continue;

              final sampleMeta = <String, dynamic>{};
              if (clinicalMetadata != null && clinicalMetadata!.isNotEmpty) {
                sampleMeta['animalMetadata'] = clinicalMetadata;
              }
              if (s.metadata.isNotEmpty) {
                sampleMeta.addAll(s.metadata);
              }

              allSampleData.add(SampleData(
                sampleType: g.typeCount.sampleId,
                sampleName: g.typeCount.type,
                barcode: s.barcode,
                originalSampleBarcode: s.barcode,
                replicates: s.replicateBarcodes.isNotEmpty
                    ? 'available'
                    : 'not collected',
                photos: List<String>.from(s.photos),
                diseases: const [],
                comments: s.comments,
                quantity: s.quantity,
                unit: s.unit,
                metadata: sampleMeta.isNotEmpty ? sampleMeta : null,
              ));
              for (final r in s.replicateBarcodes.where((r) => r.isNotEmpty)) {
                allSampleData.add(SampleData(
                  sampleType: g.typeCount.sampleId,
                  sampleName: g.typeCount.type,
                  barcode: r,
                  originalSampleBarcode: s.barcode,
                  replicates: 'not collected',
                  photos: List<String>.from(s.photos),
                  diseases: const [],
                  comments: s.comments,
                  quantity: s.quantity,
                  unit: s.unit,
                  metadata: sampleMeta.isNotEmpty ? sampleMeta : null,
                ));
              }
            }
          }

          final activeExisting = existingSamples.isNotEmpty
              ? existingSamples
              : restoredSamplesState.value;
          final combined = [...activeExisting, ...allSampleData];

          print(
              '[EnvironmentalBarcodeEntryScreen] Proceed clicked. Saving barcodes and group state immediately.');
          if (draftController.draft != null) {
            final currentData =
                Map<String, dynamic>.from(draftController.draft!.stepData);
            final draftKey = 'sampleGroups_${currentFlow ?? "Environmental"}';
            currentData[draftKey] = groups.value
                .map((g) => {
                      'typeCount': g.typeCount.toJson(),
                      'mode': g.mode.name,
                      'bulkPrefix': g.bulkPrefix,
                      'samples': g.samples
                          .map((s) => {
                                'barcode': s.barcode,
                                'quantity': s.quantity,
                                'unit': s.unit,
                                'replicateBarcodes': s.replicateBarcodes,
                                'metadata': s.metadata,
                                'comments': s.comments,
                                'photos': s.photos,
                              })
                          .toList(),
                    })
                .toList();

            // Save combined samples list to draft so it survives app crashes/restarts
            currentData['samples'] = combined.map((s) => s.toJson()).toList();

            await draftController.updateDraftImmediate(currentData, 5);
            print(
                '[EnvironmentalBarcodeEntryScreen] Immediate draft save completed successfully!');
          }

          if (context.mounted) {
            context.push('/NextActionScreen', extra: {
              'visitId': visitId,
              'updateVisitDto': updateVisitDto,
              'visitDetails': visitDetails,
              'collectionType':
                  collectionType ?? (isClinical ? 'Clinical' : 'Environmental'),
              'currentFlow':
                  currentFlow ?? (isClinical ? 'Clinical' : 'Environmental'),
              'isBothFlow': isBothFlow,
              'completedFlows': completedFlows,
              'existingSamples': combined,
            });
          }
        },
      ),
      body: GestureDetector(
        onTap: () => FocusScope.of(context).unfocus(),
        behavior: HitTestBehavior.opaque,
        child: ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: listItems.length,
          itemBuilder: (context, index) {
            final item = listItems[index];

            if (item.type == _FlattenedItemType.spacing) {
              return const SizedBox(height: 20);
            }

            if (item.type == _FlattenedItemType.animalCard) {
              return AnimalMetadataCard(metadata: clinicalMetadata);
            }

            if (item.type == _FlattenedItemType.addMoreButton) {
              return _AddMoreButton(
                visitId: visitId,
                updateVisitDto: updateVisitDto,
                visitDetails: visitDetails,
                isClinical: isClinical,
                collectionType: collectionType,
                isBothFlow: isBothFlow,
                completedFlows: completedFlows,
                groups: groups,
                collectedEnvMetadata: collectedEnvMetadata,
              );
            }

            final group = groups.value[item.groupIndex];

            switch (item.type) {
              case _FlattenedItemType.header:
                return _GroupHeaderWidget(
                  group: group,
                  isFirst: true,
                  isLast: item.isLast,
                );
              case _FlattenedItemType.modeTabs:
                return _ModeTabsWidget(
                  group: group,
                  isLast: item.isLast,
                  onModeChanged: (mode) => updateGroup(
                    item.groupIndex,
                    SampleGroupState(
                      typeCount: group.typeCount,
                      mode: mode,
                      bulkPrefix: group.bulkPrefix,
                      samples: group.samples,
                    ),
                  ),
                );
              case _FlattenedItemType.bulkPrefix:
                return _BulkPrefixWidget(
                  group: group,
                  isLast: item.isLast,
                  onPrefixChanged: (val) {
                    final newGroups = List<SampleGroupState>.from(groups.value);
                    newGroups[item.groupIndex].bulkPrefix = val;
                    groups.value = newGroups;
                  },
                  onGenerate: () => handleBulkGenerate(item.groupIndex),
                );
              case _FlattenedItemType.bulkInfo:
              case _FlattenedItemType.scanInfo:
                final count =
                    group.samples.where((s) => s.barcode.isNotEmpty).length;
                return _InfoBoxWidget(
                  isLast: item.isLast,
                  text: count > 0
                      ? (item.type == _FlattenedItemType.bulkInfo
                          ? '$count barcodes generated — enter quantity & unit per sample'
                          : (group.typeCount.count == count
                              ? 'All $count barcodes scanned ✓ — enter quantity & unit per sample'
                              : '$count / ${group.typeCount.count} barcodes scanned — enter quantity & unit per sample'))
                      : 'Enter a prefix and tap Generate to auto-fill barcodes for all ${group.typeCount.count} samples.',
                );
              case _FlattenedItemType.scanArea:
                final scanned =
                    group.samples.where((s) => s.barcode.isNotEmpty).length;
                final remaining = group.typeCount.count - scanned;
                return _ScanAreaWidget(
                  isLast: item.isLast,
                  remaining: remaining,
                  allBarcodes: allBarcodes,
                  onSampleScanned: (idx, bc) => updateSample(item.groupIndex,
                      idx, group.samples[idx].copyWith(barcode: bc)),
                  openScanner: openScanner,
                  group: group,
                );
              case _FlattenedItemType.sampleRow:
                final sample = group.samples[item.sampleIndex!];
                return _CardItemWrapper(
                  isLast: item.isLast,
                  child: Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: _SampleRow(
                      key: ValueKey(
                          'sample-${item.groupIndex}-${item.sampleIndex}'),
                      sampleIndex: item.sampleIndex!,
                      sample: sample,
                      allBarcodes: allBarcodes,
                      showBarcodeField: true,
                      barcodeReadOnly: true,
                      onChanged: (updated) => updateSample(
                          item.groupIndex, item.sampleIndex!, updated),
                      openScanner: openScanner,
                          onDelete: (si) {
                        final g = groups.value[item.groupIndex];
                        final newSamples =
                            List<EnvSampleItemState>.from(g.samples)
                              ..removeAt(si);
                        final updatedTypeCount = SampleTypeCount(
                          type: g.typeCount.type,
                          count: g.typeCount.count - 1,
                          sampleId: g.typeCount.sampleId,
                          emojiIcon: g.typeCount.emojiIcon,
                        );
                        if (newSamples.isEmpty) {
                          final newGroups =
                              List<SampleGroupState>.from(groups.value)
                                ..removeAt(item.groupIndex);
                          groups.value = newGroups;
                          if (newGroups.isEmpty) context.pop();
                        } else {
                          updateGroup(
                              item.groupIndex,
                              SampleGroupState(
                                typeCount: updatedTypeCount,
                                mode: g.mode,
                                bulkPrefix: g.bulkPrefix,
                                samples: newSamples,
                              ));
                        }
                      },
                    ),
                  ),
                );
              default:
                return const SizedBox.shrink();
            }
          },
        ),
      ),
    );
  }
}

// ── Bottom bar ─────────────────────────────────────────────────────────────────

class _BottomBar extends StatelessWidget {
  final int totalAssigned;
  final int totalExpected;
  final VoidCallback onProceed;

  const _BottomBar({
    required this.totalAssigned,
    required this.totalExpected,
    required this.onProceed,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
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
            color: Colors.black.withOpacity(0.08),
            blurRadius: 8,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: AppButton(
        onPressed: totalExpected == 0 ? null : onProceed,
        child: const Text('Save & Continue'),
      ),
    );
  }
}

// ── Flattened UI Components ──────────────────────────────────────────────────

class _AddMoreButton extends StatelessWidget {
  final String visitId;
  final UpdateVisitDto updateVisitDto;
  final VisitResponseData visitDetails;
  final bool isClinical;
  final String? collectionType;
  final bool isBothFlow;
  final List<String> completedFlows;
  final ValueNotifier<List<SampleGroupState>> groups;

  /// Tracks which sample types already have collected metadata so we don't
  /// ask again. Updated in-place when new metadata is collected.
  final ValueNotifier<Map<String, Map<String, dynamic>>> collectedEnvMetadata;

  const _AddMoreButton({
    required this.visitId,
    required this.updateVisitDto,
    required this.visitDetails,
    required this.isClinical,
    this.collectionType,
    required this.isBothFlow,
    required this.completedFlows,
    required this.groups,
    required this.collectedEnvMetadata,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        OutlinedButton.icon(
          onPressed: () async {
            final existingSummary = groups.value
                .map((g) => SampleTypeCount(
                      type: g.typeCount.type,
                      count: g.typeCount.count,
                      sampleId: g.typeCount.sampleId,
                      emojiIcon: g.typeCount.emojiIcon,
                    ))
                .toList();

            // Step 1: let the user pick additional sample types/counts.
            final selectedResult = await context.push<List<SampleTypeCount>>(
              '/SampleSelectionScreen',
              extra: {
                'visitId': visitId,
                'updateVisitDto': updateVisitDto,
                'visitDetails': visitDetails,
                'flowType': isClinical ? 'Clinical' : 'Environmental',
                'addMore': true,
                'existingSamplesSummary': existingSummary,
                'collectionType': collectionType,
                'isBothFlow': isBothFlow,
                'completedFlows': completedFlows,
              },
            );

            if (selectedResult == null || selectedResult.isEmpty) return;

            // Step 2 (environmental only): check which newly-selected types
            // need metadata questions and haven't been answered yet.
            List<SampleTypeCount> finalSamples = selectedResult;
            Map<String, Map<String, dynamic>> newMetadata = {};

            if (!isClinical) {
              // Use the stateful map — this is kept up-to-date across every
              // add-more round, unlike the immutable DTO field.
              final existingMetadata = collectedEnvMetadata.value;

              // Find types that have questions but no existing metadata.
              final typesNeedingMeta = selectedResult.where((stc) {
                if (existingMetadata.containsKey(stc.type)) return false;
                return getEnvironmentalQuestions(stc.type).isNotEmpty;
              }).toList();

              if (typesNeedingMeta.isNotEmpty) {
                // Step 3: push metadata screen in add-more mode.
                final metaResult =
                    await context.push<EnvironmentalMetadataResult>(
                  '/EnvironmentalMetadataScreen',
                  extra: {
                    'selectedSamples': typesNeedingMeta,
                    'visitId': visitId,
                    'updateVisitDto': updateVisitDto,
                    'visitDetails': visitDetails,
                    'collectionType': collectionType,
                    'isBothFlow': isBothFlow,
                    'completedFlows': completedFlows,
                    'addMore': true,
                    'existingMetadata': existingMetadata,
                  },
                );

                if (metaResult != null && metaResult.metadata.isNotEmpty) {
                  newMetadata = metaResult.metadata;
                  // Persist newly collected metadata into the stateful map so
                  // subsequent add-more rounds won't ask again.
                  collectedEnvMetadata.value = {
                    ...collectedEnvMetadata.value,
                    ...newMetadata,
                  };
                }
              }
            }

            // Step 4: merge new samples into the groups state.
            final newGroups = List<SampleGroupState>.from(groups.value);
            for (final stc in finalSamples) {
              final existingIdx = newGroups
                  .indexWhere((g) => g.typeCount.sampleId == stc.sampleId);
              if (existingIdx != -1) {
                final existing = newGroups[existingIdx];
                newGroups[existingIdx] = SampleGroupState(
                  typeCount: SampleTypeCount(
                    type: existing.typeCount.type,
                    count: existing.typeCount.count + stc.count,
                    sampleId: existing.typeCount.sampleId,
                    emojiIcon: existing.typeCount.emojiIcon,
                  ),
                  mode: existing.mode,
                  bulkPrefix: existing.bulkPrefix,
                  samples: [
                    ...existing.samples,
                    ...List.generate(stc.count, (_) => EnvSampleItemState()),
                  ],
                );
              } else {
                newGroups.add(SampleGroupState(typeCount: stc));
              }
            }
            groups.value = newGroups;

            // Step 5 (environmental only): persist any newly collected
            // metadata back into the DTO via a snackbar-less silent merge.
            // (The DTO is immutable/built_value so just notify the user
            //  that metadata was saved — full persistence happens on Submit.)
            if (!isClinical && newMetadata.isNotEmpty) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                    'Metadata saved for ${newMetadata.keys.join(', ')}.',
                    style: AppTypography.textTheme.bodyB3SemiBold
                        .copyWith(color: AppColors.white),
                  ),
                  backgroundColor: AppColors.primaryLight,
                  behavior: SnackBarBehavior.floating,
                  margin: const EdgeInsets.all(16),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8)),
                  duration: const Duration(seconds: 2),
                ),
              );
            }
          },
          icon: const Icon(Icons.add, color: AppColors.textStrong, size: 20),
          label: Text(
            'Add More Samples',
            style: AppTypography.textTheme.bodyB2SemiBold
                .copyWith(color: AppColors.textStrong),
          ),
          style: OutlinedButton.styleFrom(
            minimumSize: const Size.fromHeight(48),
            side: const BorderSide(color: AppColors.strokeWeak),
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          ),
        ),
        const SizedBox(height: 8),
      ],
    );
  }
}

class _CardItemWrapper extends StatelessWidget {
  final bool isLast;
  final Widget child;

  const _CardItemWrapper({required this.isLast, required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.white,
        border: const Border(
          left: BorderSide(color: AppColors.strokeWeak),
          right: BorderSide(color: AppColors.strokeWeak),
        ),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        children: [
          child,
          if (isLast)
            Container(
              height: 16,
              decoration: const BoxDecoration(
                color: AppColors.white,
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(12),
                  bottomRight: Radius.circular(12),
                ),
                border: Border(
                  bottom: BorderSide(color: AppColors.strokeWeak),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class _GroupHeaderWidget extends StatelessWidget {
  final SampleGroupState group;
  final bool isFirst;
  final bool isLast;

  const _GroupHeaderWidget({
    required this.group,
    required this.isFirst,
    required this.isLast,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: isFirst
            ? const BorderRadius.only(
                topLeft: Radius.circular(12), topRight: Radius.circular(12))
            : null,
        border: Border.all(color: AppColors.strokeWeak),
      ),
      child: Row(
        children: [
          Text(group.typeCount.emojiIcon ?? '🧪',
              style: const TextStyle(fontSize: 24)),
          const SizedBox(width: 8),
          Expanded(
            child: Text(group.typeCount.type,
                style: AppTypography.textTheme.bodyB2SemiBold),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
            decoration: BoxDecoration(
              color: AppColors.primaryLight.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              '× ${group.typeCount.count}',
              style: AppTypography.textTheme.bodyB4Medium
                  .copyWith(color: AppColors.primaryLight),
            ),
          ),
        ],
      ),
    );
  }
}

class _ModeTabsWidget extends StatelessWidget {
  final SampleGroupState group;
  final bool isLast;
  final ValueChanged<BarcodeEntryMode> onModeChanged;

  const _ModeTabsWidget({
    required this.group,
    required this.isLast,
    required this.onModeChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: const BoxDecoration(
        color: AppColors.white,
        border: Border(
          left: BorderSide(color: AppColors.strokeWeak),
          right: BorderSide(color: AppColors.strokeWeak),
        ),
      ),
      child: Column(
        children: [
          // Two modes share the width evenly. No horizontal scroll view here:
          // inside one the Row would get unbounded width and Expanded would
          // have no free space to divide.
          Row(
            children: [
              Expanded(
                child: _ModeChip(
                  title: 'Bulk Generate',
                  icon: Icons.flash_on,
                  isSelected: group.mode == BarcodeEntryMode.bulkGenerate,
                  onTap: () => onModeChanged(BarcodeEntryMode.bulkGenerate),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _ModeChip(
                  title: 'Continuous Scan',
                  icon: Icons.document_scanner_outlined,
                  isSelected: group.mode == BarcodeEntryMode.continuousScan,
                  onTap: () => onModeChanged(BarcodeEntryMode.continuousScan),
                ),
              ),
            ],
          ),
          if (isLast) const SizedBox(height: 16),
        ],
      ),
    );
  }
}

class _BulkPrefixWidget extends StatelessWidget {
  final SampleGroupState group;
  final bool isLast;
  final ValueChanged<String> onPrefixChanged;
  final Future<void> Function() onGenerate;

  const _BulkPrefixWidget({
    required this.group,
    required this.isLast,
    required this.onPrefixChanged,
    required this.onGenerate,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: const BoxDecoration(
        color: AppColors.white,
        border: Border(
          left: BorderSide(color: AppColors.strokeWeak),
          right: BorderSide(color: AppColors.strokeWeak),
        ),
      ),
      child: Row(
        children: [
          Expanded(
            child: TextFormField(
              initialValue: group.bulkPrefix,
              decoration: InputDecoration(
                hintText: 'Enter prefix  e.g. BMM001',
                hintStyle: AppTypography.textTheme.bodyB3Regular
                    .copyWith(color: AppColors.textWeak),
                filled: true,
                fillColor: AppColors.white,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: const BorderSide(color: AppColors.strokeWeak),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: const BorderSide(color: AppColors.strokeWeak),
                ),
                contentPadding:
                    const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              ),
              onChanged: onPrefixChanged,
            ),
          ),
          const SizedBox(width: 10),
          ElevatedButton.icon(
            onPressed: onGenerate,
            icon: const Icon(Icons.flash_on, size: 16, color: AppColors.white),
            label: const Text('Generate'),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primaryLight,
              foregroundColor: AppColors.white,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8)),
            ),
          ),
        ],
      ),
    );
  }
}

class _InfoBoxWidget extends StatelessWidget {
  final bool isLast;
  final String text;

  const _InfoBoxWidget({required this.isLast, required this.text});

  @override
  Widget build(BuildContext context) {
    final bool isInstruction = text.contains('tap Generate');
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: const BoxDecoration(
        color: AppColors.white,
        border: Border(
          left: BorderSide(color: AppColors.strokeWeak),
          right: BorderSide(color: AppColors.strokeWeak),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (isInstruction)
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.strokeWeak.withOpacity(0.2),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                children: [
                  const Icon(Icons.info_outline,
                      size: 16, color: AppColors.textWeak),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      text,
                      style: AppTypography.textTheme.bodyB3Regular
                          .copyWith(color: AppColors.textWeak),
                    ),
                  ),
                ],
              ),
            )
          else
            Text(
              text,
              style: AppTypography.textTheme.bodyB3Regular
                  .copyWith(color: AppColors.textWeak),
            ),
          if (isLast) const SizedBox(height: 16),
        ],
      ),
    );
  }
}

class _ScanAreaWidget extends StatelessWidget {
  final SampleGroupState group;
  final int remaining;
  final Set<String> allBarcodes;
  final void Function(int, String) onSampleScanned;
  final OpenScanner openScanner;
  final bool isLast;

  const _ScanAreaWidget({
    required this.group,
    required this.remaining,
    required this.allBarcodes,
    required this.onSampleScanned,
    required this.openScanner,
    required this.isLast,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: const BoxDecoration(
        color: AppColors.white,
        border: Border(
          left: BorderSide(color: AppColors.strokeWeak),
          right: BorderSide(color: AppColors.strokeWeak),
        ),
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(vertical: 28),
            decoration: BoxDecoration(
              color: AppColors.strokeWeak.withOpacity(0.2),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.strokeWeak),
            ),
            child: Center(
              child: Column(
                children: [
                  const Icon(Icons.qr_code_scanner,
                      size: 44, color: AppColors.textWeak),
                  const SizedBox(height: 12),
                  Text('Continuous Scan Mode',
                      style: AppTypography.textTheme.bodyB2SemiBold
                          .copyWith(color: AppColors.textStrong)),
                  const SizedBox(height: 4),
                  Text(
                      'Scan $remaining more barcode${remaining > 1 ? 's' : ''}',
                      style: AppTypography.textTheme.bodyB4Medium
                          .copyWith(color: AppColors.textWeak)),
                  const SizedBox(height: 16),
                  ElevatedButton.icon(
                    onPressed: () async {
                      final emptyIndices = <int>[];
                      for (int i = 0; i < group.samples.length; i++) {
                        if (group.samples[i].barcode.isEmpty) {
                          emptyIndices.add(i);
                        }
                      }
                      if (emptyIndices.isEmpty) return;

                      // One session fills every empty row. The scanner runs the
                      // duplicate and project-DB checks itself, so nothing is
                      // re-validated here.
                      final scanned = await openScanner(
                        maxCount: emptyIndices.length,
                        alreadyScanned:
                            group.samples.length - emptyIndices.length,
                        totalCount: group.samples.length,
                        sampleType: group.typeCount.type,
                      );

                      for (int i = 0;
                          i < scanned.length && i < emptyIndices.length;
                          i++) {
                        onSampleScanned(emptyIndices[i], scanned[i]);
                        allBarcodes.add(scanned[i]);
                      }
                    },
                    label: const Text('Start Scanning'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primaryLight,
                      foregroundColor: AppColors.white,
                      padding: const EdgeInsets.symmetric(
                          horizontal: 24, vertical: 12),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8)),
                    ),
                  ),
                ],
              ),
            ),
          ),
          if (isLast) const SizedBox(height: 16),
        ],
      ),
    );
  }
}

// ── Sample Row (shared by Bulk + Single) ──────────────────────────────────────

class _SampleRow extends StatelessWidget {
  final int sampleIndex;
  final EnvSampleItemState sample;

  /// All currently-assigned barcodes across every group (primary + replicates).
  final Set<String> allBarcodes;
  final bool showBarcodeField;
  final bool barcodeReadOnly;
  final void Function(EnvSampleItemState) onChanged;
  final OpenScanner openScanner;
  final void Function(int)? onDelete;


  const _SampleRow({
    Key? key,
    required this.sampleIndex,
    required this.sample,
    required this.allBarcodes,
    required this.showBarcodeField,
    required this.barcodeReadOnly,
    required this.onChanged,
    required this.openScanner,
    this.onDelete,
  }) : super(key: key);

  static List<CustomDropdownOption<String>> get _unitOptions => kSampleUnits
      .map((u) => CustomDropdownOption<String>(id: u.value, label: u.label))
      .toList();

  void _pickImages(BuildContext context) {
    ImagePickerHelper.showImageSourceDialog(
      context,
      onImagesSelected: (images) {
        final newPhotos = [
          ...sample.photos,
          ...images.map((img) => img.path),
        ];
        onChanged(sample.copyWith(photos: newPhotos));
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(
          color: sample.barcode.isNotEmpty
              ? AppColors.primaryLight.withOpacity(0.3)
              : AppColors.strokeWeak,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ── Label ──
          Row(
            children: [
              Container(
                width: 24,
                height: 24,
                decoration: BoxDecoration(
                  color: sample.barcode.isNotEmpty
                      ? AppColors.primaryLight
                      : AppColors.strokeWeak,
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: Text(
                    '${sampleIndex + 1}',
                    style: AppTypography.textTheme.bodyB4Medium.copyWith(
                      color: sample.barcode.isNotEmpty
                          ? AppColors.white
                          : AppColors.textWeak,
                      fontSize: 11,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Text(
                'Sample ${sampleIndex + 1}',
                style: AppTypography.textTheme.bodyB3Medium,
              ),
              if (sample.barcode.isNotEmpty) ...[
                const Spacer(),
                Icon(Icons.check_circle,
                    size: 16, color: AppColors.primaryLight),
                const SizedBox(width: 8),
              ] else
                const Spacer(),
              if (onDelete != null)
                IconButton(
                  icon: const Icon(Icons.delete_outline,
                      size: 20, color: Colors.red),
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(),
                  onPressed: () => onDelete!(sampleIndex),
                ),
            ],
          ),
          const SizedBox(height: 12),

          // ── Barcode ──
          if (showBarcodeField) ...[
            Row(
              children: [
                // Prominent Scan button (50% width)
                Expanded(
                  child: GestureDetector(
                    onTap: () async {
                      // Omit this row's own barcode so re-scanning the label
                      // already on the tube is not read as a duplicate.
                      final scanned = await openScanner(
                        existing: allBarcodes
                            .where((b) => b != sample.barcode)
                            .toList(),
                      );
                      if (scanned.isNotEmpty) {
                        onChanged(sample.copyWith(barcode: scanned.first));
                      }
                    },
                    child: Container(
                      height: 48,
                      decoration: BoxDecoration(
                        color: AppColors.primaryLight,
                        borderRadius: BorderRadius.circular(8),
                        boxShadow: [
                          BoxShadow(
                            color:
                                AppColors.primaryLight.withValues(alpha: 0.3),
                            blurRadius: 6,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.qr_code_scanner,
                              color: AppColors.white, size: 22),
                          const SizedBox(width: 8),
                          Text(
                            'Scan',
                            style: AppTypography.textTheme.bodyB3SemiBold
                                .copyWith(color: AppColors.white),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                // Barcode text field (50% width)
                Expanded(
                  child: TextFormField(
                    key: ValueKey('bc-$sampleIndex-${sample.barcode}'),
                    initialValue: sample.barcode,
                    readOnly: barcodeReadOnly,
                    decoration: InputDecoration(
                      hintText: 'Barcode',
                      hintStyle: AppTypography.textTheme.bodyB3Regular
                          .copyWith(color: AppColors.textWeak),
                      filled: true,
                      fillColor: barcodeReadOnly
                          ? AppColors.background
                          : AppColors.white,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                        borderSide: BorderSide.none,
                      ),
                      contentPadding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 14),
                    ),
                    style: AppTypography.textTheme.bodyB3Regular
                        .copyWith(color: AppColors.textStrong),
                    onChanged: (val) =>
                        onChanged(sample.copyWith(barcode: val)),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
          ],

          // ── Quantity & Unit ──
          Row(
            children: [
              Expanded(
                flex: 3,
                child: TextFormField(
                  key: ValueKey('qty-$sampleIndex'),
                  initialValue: sample.quantity?.toString(),
                  keyboardType:
                      const TextInputType.numberWithOptions(decimal: true),
                  decoration: InputDecoration(
                    hintText: 'Quantity',
                    hintStyle: AppTypography.textTheme.bodyB3Regular
                        .copyWith(color: AppColors.textWeak),
                    filled: true,
                    fillColor: AppColors.white,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: const BorderSide(color: AppColors.strokeWeak),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: const BorderSide(color: AppColors.strokeWeak),
                    ),
                    contentPadding: const EdgeInsets.symmetric(
                        horizontal: 12, vertical: 10),
                  ),
                  onChanged: (val) =>
                      onChanged(sample.copyWith(quantity: num.tryParse(val))),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                flex: 4,
                child: CustomDropdown<String>(
                  label: '',
                  hintText: 'Unit',
                  value: sample.unit,
                  options: _unitOptions,
                  onChanged: (val) => onChanged(sample.copyWith(unit: val)),
                ),
              ),
            ],
          ),

          // ── Replicates ──
          if (sample.replicateBarcodes.isNotEmpty) ...[
            const SizedBox(height: 10),
            Text('Replicates:',
                style: AppTypography.textTheme.bodyB4Medium
                    .copyWith(color: AppColors.textWeak)),
            const SizedBox(height: 6),
            Wrap(
              spacing: 6,
              runSpacing: 6,
              children: sample.replicateBarcodes
                  .asMap()
                  .entries
                  .map((re) => Chip(
                        label: Text(re.value,
                            style: AppTypography.textTheme.bodyB4Regular),
                        backgroundColor:
                            AppColors.primaryLight.withOpacity(0.08),
                        side: BorderSide.none,
                        deleteIcon: const Icon(Icons.close, size: 13),
                        onDeleted: () {
                          final newReps =
                              List<String>.from(sample.replicateBarcodes)
                                ..removeAt(re.key);
                          onChanged(
                              sample.copyWith(replicateBarcodes: newReps));
                        },
                      ))
                  .toList(),
            ),
          ],

          const SizedBox(height: 8),

          // ── Add Replicate ──
          TextButton.icon(
            onPressed: () async {
              // A replicate is always a new barcode, so every known one is a
              // duplicate. The scanner handles both checks.
              final scanned = await openScanner();
              if (scanned.isNotEmpty) {
                final newReps = [...sample.replicateBarcodes, scanned.first];
                onChanged(sample.copyWith(replicateBarcodes: newReps));
              }
            },
            icon:
                const Icon(Icons.add, size: 16, color: AppColors.primaryLight),
            label: Text(
              'Add Replicate',
              style: AppTypography.textTheme.bodyB3Medium
                  .copyWith(color: AppColors.primaryLight),
            ),
            style: TextButton.styleFrom(padding: EdgeInsets.zero),
          ),

          // ── Photos ──
          const Divider(height: 16),
          if (sample.photos.isNotEmpty) ...[
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: sample.photos.asMap().entries.map((entry) {
                return Stack(
                  children: [
                    GestureDetector(
                      onTap: () => ImagePreviewDialog.show(context,
                          imageFile: XFile(entry.value)),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: FutureBuilder<Uint8List>(
                          future: XFile(entry.value).readAsBytes(),
                          builder: (context, snapshot) {
                            if (snapshot.hasData) {
                              return Image.memory(
                                snapshot.data!,
                                width: 64,
                                height: 64,
                                fit: BoxFit.cover,
                              );
                            }
                            return Container(
                              width: 64,
                              height: 64,
                              decoration: BoxDecoration(
                                color: AppColors.strokeWeak.withOpacity(0.3),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Icon(Icons.broken_image,
                                  size: 24, color: AppColors.textWeak),
                            );
                          },
                        ),
                      ),
                    ),
                    Positioned(
                      top: 0,
                      right: 0,
                      child: GestureDetector(
                        onTap: () {
                          final updated = List<String>.from(sample.photos)
                            ..removeAt(entry.key);
                          onChanged(sample.copyWith(photos: updated));
                        },
                        child: Container(
                          width: 20,
                          height: 20,
                          decoration: const BoxDecoration(
                            color: Colors.red,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.close,
                              size: 12, color: Colors.white),
                        ),
                      ),
                    ),
                  ],
                );
              }).toList(),
            ),
            const SizedBox(height: 8),
          ],
          TextButton.icon(
            onPressed: () => _pickImages(context),
            icon: const Icon(Icons.add_a_photo,
                size: 16, color: AppColors.primaryLight),
            label: Text(
              sample.photos.isEmpty ? 'Add Photos' : 'Add More Photos',
              style: AppTypography.textTheme.bodyB3Medium
                  .copyWith(color: AppColors.primaryLight),
            ),
            style: TextButton.styleFrom(padding: EdgeInsets.zero),
          ),

          // ── Comments ──
          const SizedBox(height: 4),
          TextFormField(
            key: ValueKey('comment-$sampleIndex'),
            initialValue: sample.comments,
            maxLines: 2,
            decoration: InputDecoration(
              hintText: 'Add comments (optional)',
              hintStyle: AppTypography.textTheme.bodyB3Regular
                  .copyWith(color: AppColors.textWeak),
              filled: true,
              fillColor: AppColors.white,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
                borderSide: const BorderSide(color: AppColors.strokeWeak),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
                borderSide: const BorderSide(color: AppColors.strokeWeak),
              ),
              contentPadding:
                  const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            ),
            onChanged: (val) => onChanged(sample.copyWith(comments: val)),
          ),
        ],
      ),
    );
  }
}
// ── Mode chip ─────────────────────────────────────────────────────────────────

class _ModeChip extends StatelessWidget {
  final String title;
  final IconData icon;
  final bool isSelected;
  final VoidCallback onTap;

  const _ModeChip({
    required this.title,
    required this.icon,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected
              ? AppColors.primaryLight
              : AppColors.strokeWeak.withOpacity(0.3),
          borderRadius: BorderRadius.circular(20),
        ),
        // The chip is stretched by an Expanded parent, so the content centres
        // itself within it rather than shrink-wrapping. Flexible keeps the
        // longer label from overflowing on narrow screens.
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon,
                size: 14,
                color: isSelected ? AppColors.white : AppColors.textWeak),
            const SizedBox(width: 5),
            Flexible(
              child: Text(
                title,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: AppTypography.textTheme.bodyB4Medium.copyWith(
                  color: isSelected ? AppColors.white : AppColors.textWeak,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
