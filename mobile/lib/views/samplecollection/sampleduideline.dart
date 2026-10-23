import 'package:design_system/design_system.dart';
import 'package:es_client/es_client.dart';
import 'package:es_platform_mobile/utils/configs/constants.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:es_platform_mobile/hooks/visit_draft.dart';
import 'package:es_platform_mobile/utils/hive_serialization.dart';

import '../../utils/extensions/go_router.dart';

class GuidelineSampleCollection extends StatelessWidget {
  final String visitId;
  final UpdateVisitDto updateVisitDto;
  final VisitResponseData visitDetails;

  const GuidelineSampleCollection({
    super.key,
    required this.visitId,
    required this.updateVisitDto,
    required this.visitDetails,
  });

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    return Scaffold(
      backgroundColor: const Color(0xFFE8E6DD),
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(
          56,
        ),
        child: Container(
          padding: EdgeInsets.only(top: MediaQuery.of(context).padding.top),
          color: const Color(0xFFE8E6DD),
          child: Theme(
            data: Theme.of(context).copyWith(
              textTheme: Theme.of(context).textTheme.copyWith(
                    bodyLarge: AppTypography.textTheme.bodyB2SemiBold.copyWith(
                      color: AppColors.textStrong,
                    ),
                  ),
            ),
            child: const HeaderNavigation(
              backgroundColor: Color(0xFFE8E6DD),
              title: '',
              prefix: BackButton(),
            ),
          ),
        ),
      ),
      body: SafeArea(
        child: Stack(
          children: <Widget>[
            SingleChildScrollView(
              child: Column(
                children: <Widget>[
                  Card(
                    color: AppColors.white,
                    margin: const EdgeInsets.only(top: 4, left: 32, right: 32),
                    elevation: 2,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.only(
                        left: 20,
                        right: 20,
                        bottom: 20,
                        top: 20,
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          Text(
                            'Guidelines for Sample Collection',
                            style: AppTypography.textTheme.headingH3
                                .copyWith(color: AppColors.textStrong),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'To ensure that the collection is safe and efficient, follow these tips:',
                            style: AppTypography.textTheme.bodyB3Regular
                                .copyWith(color: AppColors.textWeak),
                          ),
                          const SizedBox(height: 16),
                          const Divider(
                            height: 1,
                            color: AppColors.strokeWeak,
                          ),
                          const SizedBox(height: 16),
                          ...buildGuidelines(context),
                        ],
                      ),
                    ),
                  ),
                  Container(
                    height: screenHeight * 0.25,
                    width: double.infinity,
                    decoration: const BoxDecoration(
                      image: DecorationImage(
                        alignment: Alignment.bottomCenter,
                        image: AssetImage(Assets.guidelineGraphics),
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  // Add padding at the bottom to account for the proceed button
                  SizedBox(height: 80),
                ],
              ),
            ),
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  boxShadow: [
                    BoxShadow(
                      // ignore: deprecated_member_use
                      color: Colors.black.withOpacity(0.05),
                      blurRadius: 10,
                      offset: const Offset(0, -5),
                    ),
                  ],
                ),
                child: ProceedButton(
                  visitId: visitId,
                  updateVisitDto: updateVisitDto,
                  visitDetails: visitDetails,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  List<Widget> buildGuidelines(BuildContext context) {
    final List<String> guidelines = <String>[
      'Use sterile swabs for collecting samples from mucosal surfaces (e.g., nasal, oral, rectal).',
      'Collect fresh fecal samples in clean, leak-proof containers.',
      'Wear appropriate PPE, such as gloves, masks, and gowns, to protect yourself and the animals.',
      "Label each sample with the animal's identification number, date, time of collection, and the type of sample collected.",
      'Collect samples immediately during a disease outbreak to facilitate rapid diagnosis and intervention.',
    ];

    return guidelines
        .map(
          (String guideline) => Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Container(
                  height: 16,
                  width: 16,
                  decoration: const BoxDecoration(
                    image: DecorationImage(
                      image: AssetImage(
                        Assets.checkmarkIcon,
                      ),
                      fit: BoxFit.contain,
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    guideline,
                    style: AppTypography.textTheme.bodyB3Regular
                        .copyWith(color: AppColors.textWeak),
                  ),
                ),
              ],
            ),
          ),
        )
        .toList();
  }
}

class ProceedButton extends HookWidget {
  final String visitId;
  final UpdateVisitDto updateVisitDto;
  final VisitResponseData visitDetails;

  const ProceedButton({
    super.key,
    required this.visitId,
    required this.updateVisitDto,
    required this.visitDetails,
  });

  @override
  Widget build(BuildContext context) {
    // initialStepIndex: 2 advances the draft from step 1 → 2 on first save.
    final draftController = useVisitDraft(visitId, initialStepIndex: 2);
    final hasMarkedStep = useRef<bool>(false);

    // Mark the draft at step 2 once on mount (non-looping).
    // The updateVisitDto is already in the draft from AddVisitDetails.
    useEffect(() {
      if (draftController.draft != null && !hasMarkedStep.value) {
        hasMarkedStep.value = true;
        final currentData =
            Map<String, dynamic>.from(draftController.draft!.stepData);
        // Ensure updateVisitDto is present (it may already be; upsert is safe).
        final serialized = HiveSerialization.serializeBuiltValue(
          UpdateVisitDto.serializer,
          updateVisitDto,
        );
        if (serialized != null) {
          currentData['updateVisitDto'] = serialized;
        }
        draftController.updateDraftImmediate(currentData, 2);
      }
      return null;
    }, [draftController.draft]);

    return SizedBox(
      width: double.infinity,
      child: AppButton(
        size: ButtonSize.lg,
        child: Text(
          'Proceed',
          style: AppTypography.textTheme.buttonLarge.copyWith(
            color: AppColors.white,
          ),
        ),
        isLoading: false,
        onPressed: () async {
          // Ensure the draft is at step 2 with the dto before leaving.
          if (draftController.draft != null) {
            final currentData =
                Map<String, dynamic>.from(draftController.draft!.stepData);
            final serialized = HiveSerialization.serializeBuiltValue(
              UpdateVisitDto.serializer,
              updateVisitDto,
            );
            if (serialized != null) {
              currentData['updateVisitDto'] = serialized;
            }
            await draftController.updateDraftImmediate(currentData, 2);
          }
          if (context.mounted) {
            context.push('/CollectionTypeScreen', extra: {
              'visitId': visitId,
              'updateVisitDto': updateVisitDto,
              'visitDetails': visitDetails,
            });
          }
        },
      ),
    );
  }
}
