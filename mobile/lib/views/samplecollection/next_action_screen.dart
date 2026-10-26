import 'package:design_system/design_system.dart';
import 'package:es_client/es_client.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import 'models/sample_data.dart';
import '../../hooks/visit_draft.dart';
import '../../hooks/resume_marker.dart';

class NextActionScreen extends HookWidget {
  final String visitId;
  final UpdateVisitDto updateVisitDto;
  final VisitResponseData visitDetails;
  final String? collectionType;
  final String? currentFlow;
  final bool isBothFlow;
  final List<String> completedFlows;
  final List<SampleData> existingSamples;

  const NextActionScreen({
    Key? key,
    required this.visitId,
    required this.updateVisitDto,
    required this.visitDetails,
    this.collectionType,
    this.currentFlow,
    this.isBothFlow = false,
    this.completedFlows = const [],
    this.existingSamples = const [],
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final draftController = useVisitDraft(visitId, initialStepIndex: 5);
    useResumeMarker(
      draft: draftController,
      route: '/NextActionScreen',
      stepIndex: 5,
      buildArgs: () => <String, dynamic>{
        'collectionType': collectionType,
        'currentFlow': currentFlow,
        'isBothFlow': isBothFlow,
        'completedFlows': completedFlows,
      },
    );

    void handleAddAnother() async {
      print(
          '[NextActionScreen] Add another animal clicked. Clearing transient flow keys from draft...');
      if (draftController.draft != null) {
        final currentData =
            Map<String, dynamic>.from(draftController.draft!.stepData);
        // Clear metadata, selection counts, and barcode states for Clinical/Environmental to start fresh
        currentData.remove('clinicalMetadata');
        currentData.remove('selectedSamples_Clinical');
        currentData.remove('selectedSamples_Environmental');
        currentData.remove('sampleGroups_Clinical');
        currentData.remove('sampleGroups_Environmental');
        currentData.remove('environmentalMetadata');

        // Ensure accumulated samples are stored in the draft so they survive app restarts
        currentData['samples'] =
            existingSamples.map((s) => s.toJson()).toList();

        await draftController.updateDraftImmediate(currentData, 5);
        print(
            '[NextActionScreen] Transient flow keys cleared successfully in draft!');
      }

      if (context.mounted) {
        if (currentFlow == 'Environmental') {
          context.push('/SampleSelectionScreen', extra: {
            'visitId': visitId,
            'updateVisitDto': updateVisitDto,
            'visitDetails': visitDetails,
            'flowType': currentFlow,
            'collectionType': collectionType,
            'currentFlow': currentFlow,
            'isBothFlow': isBothFlow,
            'completedFlows': completedFlows,
            'existingSamples': existingSamples,
          });
        } else {
          context.push('/ClinicalMetadataScreen', extra: {
            'visitId': visitId,
            'updateVisitDto': updateVisitDto,
            'visitDetails': visitDetails,
            'collectionType': collectionType,
            'isBothFlow': isBothFlow,
            'completedFlows': completedFlows,
            'existingSamples': existingSamples,
            'isNewAnimal': true,
          });
        }
      }
    }

    void handleContinueToNextFlow() async {
      final nextFlow = currentFlow == 'Clinical' ? 'Environmental' : 'Clinical';
      final nextCompletedFlows = [...completedFlows, currentFlow!];

      print(
          '[NextActionScreen] Continue to next flow clicked. Clearing transient keys...');
      if (draftController.draft != null) {
        final currentData =
            Map<String, dynamic>.from(draftController.draft!.stepData);
        // Clear metadata, selections and barcodes for next flow
        currentData.remove('clinicalMetadata');
        currentData.remove('selectedSamples_Clinical');
        currentData.remove('selectedSamples_Environmental');
        currentData.remove('sampleGroups_Clinical');
        currentData.remove('sampleGroups_Environmental');
        currentData.remove('environmentalMetadata');

        // Save accumulated samples
        currentData['samples'] =
            existingSamples.map((s) => s.toJson()).toList();

        await draftController.updateDraftImmediate(currentData, 5);
        print(
            '[NextActionScreen] Transient keys cleared successfully in draft!');
      }

      if (nextFlow == 'Environmental') {
        context.push('/SampleSelectionScreen', extra: {
          'visitId': visitId,
          'updateVisitDto': updateVisitDto,
          'visitDetails': visitDetails,
          'flowType': nextFlow,
          'collectionType': collectionType,
          'currentFlow': nextFlow,
          'isBothFlow': isBothFlow,
          'completedFlows': nextCompletedFlows,
          'existingSamples': existingSamples,
        });
      } else {
        context.push('/ClinicalMetadataScreen', extra: {
          'visitId': visitId,
          'updateVisitDto': updateVisitDto,
          'visitDetails': visitDetails,
          'collectionType': collectionType,
          'isBothFlow': isBothFlow,
          'completedFlows': nextCompletedFlows,
          'existingSamples': existingSamples,
        });
      }
    }

    void handleSubmit() async {
      print(
          '[NextActionScreen] Submit clicked. Saving accumulated samples immediately...');
      if (draftController.draft != null) {
        final currentData =
            Map<String, dynamic>.from(draftController.draft!.stepData);
        currentData['samples'] =
            existingSamples.map((s) => s.toJson()).toList();
        await draftController.updateDraftImmediate(currentData, 6);
        print(
            '[NextActionScreen] Immediate draft save of samples completed successfully!');
      }

      if (context.mounted) {
        context.push('/ReviewVisitDetails', extra: {
          'visitId': visitId,
          'updateVisitDto': updateVisitDto,
          'visitDetails': visitDetails,
          'samples': existingSamples,
        });
      }
    }

    final isClinical = currentFlow == 'Clinical';
    final hasNextFlow = isBothFlow &&
        !completedFlows
            .contains(currentFlow == 'Clinical' ? 'Environmental' : 'Clinical');

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        leading: const SizedBox.shrink(),
        backgroundColor: AppColors.white,
        elevation: 0,
        title: Text(
          'Sample Added Successfully',
          style: AppTypography.textTheme.bodyB2SemiBold.copyWith(
            color: AppColors.onSuccessLight,
          ),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 32),
              Center(
                child: Container(
                  width: 80,
                  height: 80,
                  decoration: const BoxDecoration(
                    color: AppColors.successLight,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.check,
                    color: AppColors.onSuccessLight,
                    size: 40,
                  ),
                ),
              ),
              const SizedBox(height: 24),
              Text(
                'Sample collected and saved locally.',
                textAlign: TextAlign.center,
                style: AppTypography.textTheme.bodyB2Regular.copyWith(
                  color: AppColors.textStrong,
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'Total samples collected: ${existingSamples.length}',
                textAlign: TextAlign.center,
                style: AppTypography.textTheme.bodyB1SemiBold.copyWith(
                  color: AppColors.textStrong,
                ),
              ),
              const Spacer(),
              if (isClinical)
                OutlinedButton(
                  onPressed: handleAddAnother,
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppColors.primaryLight,
                    side: const BorderSide(color: AppColors.primaryLight),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: Text(
                    'Add another animal (Clinical)',
                    style: AppTypography.textTheme.bodyB2SemiBold,
                  ),
                ),
              const SizedBox(height: 16),
              if (hasNextFlow)
                ElevatedButton(
                  onPressed: handleContinueToNextFlow,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primaryLight,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: Text(
                    isClinical
                        ? 'Continue to Environmental'
                        : 'Continue to Clinical',
                    style: AppTypography.textTheme.bodyB2SemiBold.copyWith(
                      color: AppColors.white,
                    ),
                  ),
                )
              else
                ElevatedButton(
                  onPressed: handleSubmit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primaryLight,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: Text(
                    'Review Visit',
                    style: AppTypography.textTheme.bodyB2SemiBold.copyWith(
                      color: AppColors.white,
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
