import 'package:es_platform_mobile/widgets/rescheduled_badge.dart';
import 'package:es_platform_mobile/widgets/round_badge.dart';
import 'package:flutter/material.dart';
import 'package:design_system/design_system.dart';

class VisitsOverdueVisitCard extends StatelessWidget {
  const VisitsOverdueVisitCard({
    required this.farmName,
    required this.farmType,
    required this.location,
    required this.daysOverdue,
    this.onSkipPressed,
    this.onRevistPressed,
    this.round,
    this.isRescheduled = false,
    super.key,
  });

  final String farmName;
  final String farmType;
  final String location;
  final int daysOverdue;
  final VoidCallback? onSkipPressed;
  final VoidCallback? onRevistPressed;
  final num? round;
  final bool isRescheduled;

  @override
  Widget build(BuildContext context) => Card(
        color: Colors.white,
        elevation: 1,
        margin: const EdgeInsets.only(left: 4, right: 16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
          side: BorderSide(color: AppColors.borderLight),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              // Overdue banner
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: AppColors.semanticsRed10,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  daysOverdue == 0
                      ? 'TODAY'
                      : daysOverdue > 1
                          ? '$daysOverdue DAYS OVERDUE'
                          : '$daysOverdue DAY OVERDUE',
                  style: AppTypography.textTheme.labelCapsMedium.copyWith(
                    color: AppColors.semanticsRed30,
                  ),
                ),
              ),

              const SizedBox(height: 8),

              // Farm name
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Expanded(
                    child: Text(
                      farmName,
                      style: AppTypography.textTheme.bodyB1SemiBold.copyWith(
                        color: AppColors.textStrong,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  if (isRescheduled) ...<Widget>[
                    const SizedBox(width: 8),
                    const RescheduledBadge(),
                  ],
                  if (round != null) ...<Widget>[
                    const SizedBox(width: 8),
                    RoundBadge(round: round),
                  ],
                ],
              ),
              const SizedBox(height: 8),

              // Location and farm type
              Row(
                children: [
                  Icon(
                    Icons.location_on_outlined,
                    color: AppColors.textWeak,
                    size: 20,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    '$location | ',
                    style: AppTypography.textTheme.bodyB4Medium.copyWith(
                      color: AppColors.textWeak,
                    ),
                  ),
                  Text(
                    farmType,
                    style: AppTypography.textTheme.bodyB4Medium.copyWith(
                      color: AppColors.textWeak,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              Row(
                children: [
                  Expanded(
                    child: TextButton(
                      onPressed: onRevistPressed,
                      style: TextButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        backgroundColor: AppColors.buttonTonalBgDefault,
                        side: const BorderSide(
                            color: Color(0xFF4169E1), width: 1),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(4),
                        ),
                      ),
                      child: Text(
                        'Revisit',
                        style: AppTypography.textTheme.buttonSmall.copyWith(
                          color: AppColors.buttonTextActive,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: TextButton(
                      onPressed: onSkipPressed,
                      style: TextButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        backgroundColor: AppColors.semanticsYellow10,
                        side: const BorderSide(
                            color: AppColors.semanticsYellow10, width: 1),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(4),
                        ),
                      ),
                      child: Text(
                        'Mark as Skipped',
                        style: AppTypography.textTheme.buttonSmall.copyWith(
                          color: AppColors.semanticsYellow30,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      );
}
