import 'package:design_system/design_system.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'nearby_site_card.dart';

class NearbySites extends StatelessWidget {
  const NearbySites({
    required this.onSiteSelected,
    this.selectedSite,
    super.key,
  });
  final void Function(String) onSiteSelected;
  final String? selectedSite;

  @override
  Widget build(BuildContext context) => SizedBox(
        width: double.infinity,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Padding(
              padding: const EdgeInsets.all(16),
              child: Text(
                'Nearby Sites',
                style: AppTypography.textTheme.displayMedium,
              ),
            ),
            ListView(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              children: <Widget>[
                NearbySiteCard(
                  title: 'Anjaneya Farms',
                  subtitle: 'Cattle Farm',
                  distance: '150 m away',
                  siteId: 'anjaneya_farms',
                  groupValue: selectedSite,
                  onChanged: (String? value) {
                    onSiteSelected(value!);
                    context.push('/site-details');
                  },
                ),
                NearbySiteCard(
                  title: 'Krishi Farms',
                  subtitle: 'Cattle Farm',
                  distance: '230 m away',
                  siteId: 'krishi_farms',
                  groupValue: selectedSite,
                  onChanged: (String? value) {
                    onSiteSelected(value!);
                    context.push('/site-details');
                  },
                ),
                InkWell(
                  onTap: () => context.push('/site-details'),
                  child: NearbySiteCard(
                    title: 'Gopal Farms',
                    subtitle: 'Cattle Farm',
                    distance: '1 Km away',
                    siteId: 'gopal_farms',
                    groupValue: selectedSite,
                    onChanged: (String? value) => onSiteSelected(value!),
                  ),
                ),
                TextButton(
                  onPressed: () {
                    context.push('/pending-visits');
                  },
                  child: Text(
                    'View Pending Visits',
                    style: AppTypography.textTheme.bodyMedium?.copyWith(
                      color: AppColors.primaryLight,
                    ),
                  ),
                ),
              ],
            ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: SizedBox(
                width: double.infinity,
                child: AppButton(
                  onPressed: () {
                    //context.push('/AddvisitDetails');
                    // if (selectedSite != null) {
                    //   // Navigate or handle selection
                    // }
                  },
                  child: const Text('Select Site'),
                ),
              ),
            ),
          ],
        ),
      );
}
