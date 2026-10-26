import 'package:flutter/material.dart';

import '../../design_system.dart';

class SiteCountCard extends StatelessWidget {
  const SiteCountCard({
    required this.totalSites,
    super.key,
    this.sites = const <String>['Cattle Farm', 'Wetland', 'Poultry Farm'],
  });

  final int totalSites;
  final List<String> sites;

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: AppColors.backgroundLight,
          borderRadius: BorderRadius.circular(0),
          boxShadow: <BoxShadow>[
            BoxShadow(
              // ignore: deprecated_member_use
              color: Colors.grey.withOpacity(0.2),
              spreadRadius: 1,
              blurRadius: 4,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                Padding(
                  padding: const EdgeInsets.all(8),
                  child: Text(
                    '$totalSites',
                    style: AppTypography.textTheme.headingH1.copyWith(
                      color: AppColors.textStrong,
                      fontSize: 24,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                Padding(
                  padding: Spacing.pr(6),
                  child: const Icon(
                    Icons.location_on_outlined,
                    color: Colors.black,
                    size: 28,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              'TOTAL SITES',
              style: AppTypography.textTheme.labelMRegular.copyWith(
                color: AppColors.textStrong,
              ),
            ),
            const SizedBox(height: 8),
            const Divider(
              color: AppColors.borderLight,
            ),
            Wrap(
              spacing: 8,
              runSpacing: 4,
              children: <Widget>[
                ...sites.map(_buildSiteChip),
                _buildSiteChip('+4'),
              ],
            ),
          ],
        ),
      );

  Widget _buildSiteChip(String label) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.borderLight),
        ),
        child: Text(
          label,
          style: AppTypography.textTheme.bodyB4Regular.copyWith(
            color: AppColors.textStrong,
          ),
        ),
      );
}
