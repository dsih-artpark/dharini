import 'package:design_system/design_system.dart';
import 'package:es_platform_mobile/utils/disease_site_config.dart';
import 'package:es_platform_mobile/widgets/in_progress_badge.dart';
import 'package:es_platform_mobile/widgets/rescheduled_badge.dart';
import 'package:es_platform_mobile/widgets/round_badge.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

/// Unified premium card for upcoming / pending visits, used on both the Home
/// carousel and the Visits "Pending" list. Shows the site, its type + code,
/// location, scheduled date·time, the surveillance round (when known) and an
/// in-progress badge for resumable drafts. A colored left accent rail signals
/// status: brand blue normally, amber when the visit has a resumable draft.
class VisitCard extends StatelessWidget {
  const VisitCard({
    required this.farmName,
    required this.farmType,
    required this.siteCode,
    required this.location,
    required this.scheduledAt,
    this.round,
    this.isInProgress = false,
    this.isRescheduled = false,
    this.onTap,
    super.key,
  });

  final String farmName;
  final String farmType;
  final String siteCode;
  final String location;
  final DateTime scheduledAt;

  /// Sequential round for this visit's site; badge hidden when null.
  final num? round;

  /// When true, an incomplete saved draft exists — shows the in-progress badge
  /// and tints the accent rail amber.
  final bool isInProgress;

  /// When true, indicates the visit has been rescheduled.
  final bool isRescheduled;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final accentColor =
        isInProgress ? AppColors.warningDark : AppColors.primaryLight;
    final dateLabel = DateFormat('d MMM').format(scheduledAt);

    final subtitle = <String>[
      if (farmType.isNotEmpty) formatFarmType(farmType),
      if (siteCode.isNotEmpty) 'SITE $siteCode',
    ].join('  ·  ').toUpperCase();

    return Container(
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.strokeWeak),
        boxShadow: <BoxShadow>[
          BoxShadow(
            color: AppColors.textStrong.withValues(alpha: 0.06),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          child: IntrinsicHeight(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: <Widget>[
                // Left accent rail.
                Container(width: 4, color: accentColor),
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: <Widget>[
                        // Title row: farm name + round badge + rescheduled badge.
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: <Widget>[
                            Expanded(
                              child: Text(
                                farmName,
                                style: AppTypography.textTheme.bodyB1SemiBold
                                    .copyWith(color: AppColors.textStrong),
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
                        if (subtitle.isNotEmpty) ...<Widget>[
                          const SizedBox(height: 4),
                          Text(
                            subtitle,
                            style: AppTypography.textTheme.labelMMedium
                                .copyWith(color: AppColors.textWeak),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                        const SizedBox(height: 12),
                        // Footer: location + scheduled date·time.
                        Row(
                          children: <Widget>[
                            const Icon(Icons.location_on_outlined,
                                size: 16, color: AppColors.primaryLight),
                            const SizedBox(width: 4),
                            Expanded(
                              child: Text(
                                location.isEmpty ? '—' : location,
                                style: AppTypography.textTheme.bodyB4Medium
                                    .copyWith(color: AppColors.textWeak),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            const SizedBox(width: 8),
                            const Icon(Icons.schedule,
                                size: 16, color: AppColors.textWeak),
                            const SizedBox(width: 4),
                            Text(
                              '$dateLabel',
                              style: AppTypography.textTheme.bodyB4Medium
                                  .copyWith(color: AppColors.textWeak),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                        if (isInProgress) ...<Widget>[
                          const SizedBox(height: 12),
                          const InProgressBadge(),
                        ],
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
