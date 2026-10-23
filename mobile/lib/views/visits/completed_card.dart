import 'package:design_system/design_system.dart';
import 'package:es_platform_mobile/utils/configs/constants.dart';
import 'package:es_platform_mobile/widgets/round_badge.dart';
import 'package:flutter/material.dart';

class CompletedCard extends StatelessWidget {
  const CompletedCard({
    required this.farmName,
    required this.farmType,
    required this.siteCode,
    required this.visitDate,
    required this.sampleCount,
    required this.sampleTypes,
    this.onDownload,
    this.round,
    super.key,
  });
  final String farmName;
  final String farmType;
  final String siteCode;
  final DateTime visitDate;
  final num sampleCount;
  final List<String> sampleTypes;
  final VoidCallback? onDownload;
  final num? round;

  @override
  Widget build(BuildContext context) => Card(
        color: AppColors.white,
        elevation: 0,
        margin: EdgeInsets.zero,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.zero, // No border radius
        ),
        child: SizedBox(
          child: Stack(
            children: <Widget>[
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Padding(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: <Widget>[
                              Row(
                                children: <Widget>[
                                  Flexible(
                                    child: Text(
                                      farmName,
                                      style: AppTypography
                                          .textTheme.bodyB1SemiBold
                                          .copyWith(
                                        color: AppColors.textStrong,
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                  if (round != null) ...<Widget>[
                                    const SizedBox(width: 8),
                                    RoundBadge(round: round),
                                  ],
                                ],
                              ),
                              const SizedBox(height: 4),
                              Text(
                                farmType.toUpperCase(),
                                style: AppTypography.textTheme.labelMMedium
                                    .copyWith(
                                  color: AppColors.textWeak,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 56), // Space for action icons
                      ],
                    ),
                  ),
                  const SizedBox(height: 8),
                  Padding(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: Row(
                      children: <Widget>[
                        Container(
                          height: 16,
                          width: 16,
                          decoration: const BoxDecoration(
                            image: DecorationImage(
                              image: AssetImage(
                                Assets.testTubeLine,
                              ),
                              fit: BoxFit.contain,
                            ),
                          ),
                        ),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            '$sampleCount Samples   |   ${sampleTypes.isNotEmpty ? sampleTypes.first + (sampleTypes.length > 1 ? ' +${sampleTypes.length - 1}' : '') : 'No Sample'} ',
                            style:
                                AppTypography.textTheme.bodyB4Medium.copyWith(
                              color: AppColors.textWeak,
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Divider(
                    height: 1,
                    color: AppColors.strokeWeak,
                  ),
                ],
              ),
              Positioned(
                right: 8,
                top: 0,
                bottom: 0,
                child: Center(
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      if (onDownload != null)
                        IconButton(
                          icon: const Icon(
                            Icons.file_download_outlined,
                            size: 24,
                            color: AppColors.primaryLight,
                          ),
                          onPressed: onDownload,
                        ),
                      const SizedBox(width: 2),
                      Icon(
                        Icons.arrow_forward_ios,
                        size: 14,
                        color: AppColors.iconActive,
                      ),
                      const SizedBox(width: 8),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      );
}
