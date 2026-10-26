import 'package:es_client/es_client.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../models/visit_draft.dart';
import '../views/samplecollection/models/sample_data.dart';
import 'hive_serialization.dart';

class VisitFlowResumer {
  /// Restores the correct screen in the multi-step visit flow and pushes it via
  /// GoRouter, using the navigation marker (`resumeRoute` + `resumeArgs`)
  /// written by each flow screen through `useResumeMarker`.
  ///
  /// Screens before the marker exists (AddVisitDetails, Guidelines) fall back to
  /// the coarse `stepIndex` mapping.
  static void resumeVisitFlow(
    BuildContext context,
    VisitDraft draft,
    VisitResponseData visitDetails,
  ) {
    final data = draft.stepData;
    final resumeRoute = data['resumeRoute'] as String?;

    print(
        '[VisitFlowResumer] Resuming visitId: ${draft.visitId} resumeRoute: $resumeRoute stepIndex: ${draft.stepIndex}');

    // Shared reconstructed values.
    UpdateVisitDto? updateVisitDto;
    if (data['updateVisitDto'] != null) {
      updateVisitDto = HiveSerialization.deserializeBuiltValue(
        UpdateVisitDto.serializer,
        data['updateVisitDto'],
      );
    }
    final List<SampleData> samples = _deserializeSampleList(data['samples']);
    final Map<String, dynamic>? clinicalMetadata =
        HiveSerialization.normalizeMap(data['clinicalMetadata']);
    final Map<String, dynamic> resumeArgs =
        HiveSerialization.normalizeMap(data['resumeArgs']) ??
            <String, dynamic>{};

    // No marker yet (or DTO missing) → fall back to step-index handling for the
    // pre-collection screens.
    if (resumeRoute == null || updateVisitDto == null) {
      _resumeByStepIndex(context, draft, visitDetails, updateVisitDto);
      return;
    }

    // Base extra shared by most flow routes.
    final base = <String, dynamic>{
      'visitId': draft.visitId,
      'updateVisitDto': updateVisitDto,
      'visitDetails': visitDetails,
      'existingSamples': samples,
    };

    List<String> flows() =>
        (resumeArgs['completedFlows'] as List?)?.cast<String>() ?? <String>[];
    List<SampleTypeCount> selected() =>
        parseSelectedSamples(resumeArgs['selectedSamples']);

    switch (resumeRoute) {
      case '/CollectionTypeScreen':
        context.push('/CollectionTypeScreen', extra: base);
        return;

      case '/ClinicalMetadataScreen':
        context.push('/ClinicalMetadataScreen', extra: {
          ...base,
          'collectionType': resumeArgs['collectionType'],
          'isBothFlow': resumeArgs['isBothFlow'] ?? false,
          'completedFlows': flows(),
          'isNewAnimal': resumeArgs['isNewAnimal'] ?? false,
        });
        return;

      case '/SampleSelectionScreen':
        context.push('/SampleSelectionScreen', extra: {
          ...base,
          'flowType': resumeArgs['flowType'] ?? 'Environmental',
          'collectionType': resumeArgs['collectionType'],
          'isBothFlow': resumeArgs['isBothFlow'] ?? false,
          'completedFlows': flows(),
          'clinicalMetadata': clinicalMetadata,
          'isNewAnimal': resumeArgs['isNewAnimal'] ?? false,
        });
        return;

      case '/EnvironmentalMetadataScreen':
        context.push('/EnvironmentalMetadataScreen', extra: {
          ...base,
          'selectedSamples': selected(),
          'collectionType': resumeArgs['collectionType'],
          'isBothFlow': resumeArgs['isBothFlow'] ?? false,
          'completedFlows': flows(),
          'clinicalMetadata': clinicalMetadata,
        });
        return;

      case '/EnvironmentalBarcodeEntryScreen':
        context.push('/EnvironmentalBarcodeEntryScreen', extra: {
          ...base,
          'selectedSamples': selected(),
          'collectionType': resumeArgs['collectionType'],
          'currentFlow': resumeArgs['currentFlow'],
          'isBothFlow': resumeArgs['isBothFlow'] ?? false,
          'completedFlows': flows(),
          'clinicalMetadata': clinicalMetadata,
          'isNewAnimal': resumeArgs['isNewAnimal'] ?? false,
        });
        return;

      case '/NextActionScreen':
        context.push('/NextActionScreen', extra: {
          ...base,
          'collectionType': resumeArgs['collectionType'],
          'currentFlow': resumeArgs['currentFlow'],
          'isBothFlow': resumeArgs['isBothFlow'] ?? false,
          'completedFlows': flows(),
        });
        return;

      case '/ReviewVisitDetails':
        context.push('/ReviewVisitDetails', extra: {
          'visitId': draft.visitId,
          'updateVisitDto': updateVisitDto,
          'visitDetails': visitDetails,
          'samples': samples,
        });
        return;

      default:
        _resumeByStepIndex(context, draft, visitDetails, updateVisitDto);
    }
  }

  /// Public so it can be unit-tested. Deserializes a
  /// `resumeArgs['selectedSamples']` value (a list of `SampleTypeCount.toJson()`
  /// maps) back into typed objects.
  static List<SampleTypeCount> parseSelectedSamples(dynamic raw) {
    if (raw is! List) return [];
    return raw
        .map((e) => SampleTypeCount.fromJson(
            HiveSerialization.normalizeMap(e) ?? <String, dynamic>{}))
        .toList();
  }

  // ── Fallback for the pre-collection screens (no marker yet) ───────────────

  static void _resumeByStepIndex(
    BuildContext context,
    VisitDraft draft,
    VisitResponseData visitDetails,
    UpdateVisitDto? updateVisitDto,
  ) {
    final stepIndex = draft.stepIndex;

    // Step 2: Guidelines (updateVisitDto ready).
    if (stepIndex == 2 && updateVisitDto != null) {
      context.push('/GuidelineSampleCollection', extra: {
        'visitId': draft.visitId,
        'updateVisitDto': updateVisitDto,
        'visitDetails': visitDetails,
      });
      return;
    }

    // Step 1 or anything else without a usable DTO → AddVisitDetails.
    context.push('/AddvisitDetails', extra: <String, dynamic>{
      'visitDetails': visitDetails,
    });
  }

  static List<SampleData> _deserializeSampleList(dynamic raw) {
    if (raw == null) return [];
    try {
      return (raw as List)
          .map((e) => SampleData.fromJson(
              HiveSerialization.normalizeMap(e) ?? <String, dynamic>{}))
          .toList();
    } catch (e) {
      print('[VisitFlowResumer] Error deserializing sample list: $e');
      return [];
    }
  }
}
