import 'package:design_system/design_system.dart';
import 'package:flutter/material.dart';

import 'nearby_sites.dart';

class SiteSelection extends StatelessWidget {
  const SiteSelection({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
        backgroundColor: AppColors.backgroundLight,
        appBar: AppBar(
          backgroundColor: AppColors.white,
          title: Text(
            'Select Site',
            style: AppTypography.textTheme.headlineMedium,
          ),
          centerTitle: true,
          elevation: 0,
        ),
        body: Column(
          children: <Widget>[
            // Map section - takes all available space between app bar and nearby sites
            Expanded(
              child: Container(
                width: double.infinity,
                color: AppColors.surfaceLight,
                alignment: Alignment.center,
                child: Text(
                  'Map View',
                  style: AppTypography.textTheme.bodyLarge,
                ),
              ),
            ),

            // Nearby sites section
            Container(
              decoration: const BoxDecoration(
                color: AppColors.white,
                borderRadius: BorderRadius.vertical(
                  top: Radius.circular(16),
                ),
              ),
              child: NearbySites(
                onSiteSelected: (String siteId) {
                  // Handle site selection
                },
              ),
            ),
          ],
        ),
      );
}
