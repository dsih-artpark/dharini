import 'package:design_system/design_system.dart';
import 'package:es_client/es_client.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import 'models/sample_data.dart';
import 'package:es_platform_mobile/hooks/visit_draft.dart';
import 'package:es_platform_mobile/hooks/resume_marker.dart';

class CollectionTypeScreen extends HookWidget {
  final String visitId;
  final UpdateVisitDto updateVisitDto;
  final VisitResponseData visitDetails;
  final List<SampleData> existingSamples;

  const CollectionTypeScreen({
    Key? key,
    required this.visitId,
    required this.updateVisitDto,
    required this.visitDetails,
    this.existingSamples = const [],
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final collectionType = useState<String?>(null);
    final startWith = useState<String?>(null);

    final draftController = useVisitDraft(visitId, initialStepIndex: 3);
    useResumeMarker(
      draft: draftController,
      route: '/CollectionTypeScreen',
      stepIndex: 3,
      buildArgs: () => <String, dynamic>{},
    );
    final hasRestored = useState<bool>(false);

    // RESTORE STATE FROM DRAFT
    useEffect(() {
      final draft = draftController.draft;
      if (draft != null && draft.stepData.isNotEmpty && !hasRestored.value) {
        final data = draft.stepData;
        if (data['collectionType'] != null) {
          collectionType.value = data['collectionType'] as String?;
        }
        if (data['startWith'] != null) {
          startWith.value = data['startWith'] as String?;
        }
        hasRestored.value = true;
      } else if (draft != null && draft.stepData.isEmpty) {
        hasRestored.value = true;
      }
      return null;
    }, [draftController.draft]);

    // AUTO-SAVE ON CHANGES – merge with existing stepData to preserve earlier keys
    // like updateVisitDto that were saved by AddVisitDetails / GuidelineSampleCollection.
    useEffect(() {
      if (!hasRestored.value) return null;
      if (draftController.draft != null) {
        // Start from existing stepData so we never drop keys from prior steps.
        final currentData =
            Map<String, dynamic>.from(draftController.draft!.stepData);
        currentData['collectionType'] = collectionType.value;
        currentData['startWith'] = startWith.value;
        draftController.updateDraft(currentData, 3);
      }
      return null;
    }, [hasRestored.value, collectionType.value, startWith.value]);

    final canProceed = collectionType.value != null &&
        (collectionType.value != 'Both' || startWith.value != null);

    void handleProceed() async {
      if (!canProceed) return;

      final startingFlow = collectionType.value == 'Both'
          ? startWith.value
          : collectionType.value;

      if (draftController.draft != null) {
        final currentData =
            Map<String, dynamic>.from(draftController.draft!.stepData);
        currentData['collectionType'] = collectionType.value;
        currentData['startWith'] = startWith.value;
        await draftController.updateDraftImmediate(currentData, 3);
      }

      if (context.mounted) {
        if (startingFlow == 'Environmental') {
          context.push('/SampleSelectionScreen', extra: {
            'visitId': visitId,
            'updateVisitDto': updateVisitDto,
            'visitDetails': visitDetails,
            'flowType': 'Environmental',
            'collectionType': collectionType.value,
            'currentFlow': startingFlow,
            'isBothFlow': collectionType.value == 'Both',
            'completedFlows': <String>[],
            'existingSamples': existingSamples,
          });
        } else {
          context.push('/ClinicalMetadataScreen', extra: {
            'visitId': visitId,
            'updateVisitDto': updateVisitDto,
            'visitDetails': visitDetails,
            'collectionType': collectionType.value,
            'isBothFlow': collectionType.value == 'Both',
            'completedFlows': <String>[],
            'existingSamples': existingSamples,
          });
        }
      }
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.textStrong),
          onPressed: () => context.pop(),
        ),
        backgroundColor: AppColors.white,
        elevation: 0,
        title: Text(
          'Sample Collection',
          style: AppTypography.textTheme.bodyB2SemiBold.copyWith(
            color: AppColors.textStrong,
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
              Text(
                'What are you collecting?',
                style: AppTypography.textTheme.headingH3.copyWith(
                  color: AppColors.textStrong,
                ),
              ),
              const SizedBox(height: 16),
              _buildRadioOption(
                title: 'Clinical samples',
                value: 'Clinical',
                groupValue: collectionType.value,
                onChanged: (val) {
                  collectionType.value = val;
                  startWith.value = null; // Reset
                },
              ),
              const SizedBox(height: 12),
              _buildRadioOption(
                title: 'Environmental samples',
                value: 'Environmental',
                groupValue: collectionType.value,
                onChanged: (val) {
                  collectionType.value = val;
                  startWith.value = null; // Reset
                },
              ),
              const SizedBox(height: 12),
              _buildRadioOption(
                title: 'Both',
                value: 'Both',
                groupValue: collectionType.value,
                onChanged: (val) => collectionType.value = val,
              ),
              if (collectionType.value == 'Both') ...[
                const SizedBox(height: 32),
                Text(
                  'What do you want to start with?',
                  style: AppTypography.textTheme.headingH3.copyWith(
                    color: AppColors.textStrong,
                  ),
                ),
                const SizedBox(height: 16),
                _buildRadioOption(
                  title: 'Clinical samples',
                  value: 'Clinical',
                  groupValue: startWith.value,
                  onChanged: (val) => startWith.value = val,
                ),
                const SizedBox(height: 12),
                _buildRadioOption(
                  title: 'Environmental samples',
                  value: 'Environmental',
                  groupValue: startWith.value,
                  onChanged: (val) => startWith.value = val,
                ),
              ],
              const Spacer(),
              ElevatedButton(
                onPressed: canProceed ? handleProceed : null,
                style: ElevatedButton.styleFrom(
                  backgroundColor: canProceed
                      ? AppColors.primaryLight
                      : AppColors.strokeMedium,
                  disabledBackgroundColor: AppColors.strokeMedium,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: Text(
                  'Proceed',
                  style: AppTypography.textTheme.bodyB2SemiBold.copyWith(
                    color: canProceed ? AppColors.white : AppColors.textWeak,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRadioOption({
    required String title,
    required String value,
    required String? groupValue,
    required ValueChanged<String?> onChanged,
  }) {
    final isSelected = value == groupValue;
    return InkWell(
      onTap: () => onChanged(value),
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          border: Border.all(
            color: isSelected ? AppColors.primaryLight : AppColors.strokeMedium,
            width: isSelected ? 2 : 1,
          ),
          borderRadius: BorderRadius.circular(8),
          color: isSelected
              ? AppColors.primaryLight.withOpacity(0.05)
              : AppColors.white,
        ),
        child: Row(
          children: [
            Radio<String>(
              value: value,
              groupValue: groupValue,
              onChanged: onChanged,
              activeColor: AppColors.primaryLight,
            ),
            const SizedBox(width: 8),
            Text(
              title,
              style: AppTypography.textTheme.bodyB2Medium.copyWith(
                color: AppColors.textStrong,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
