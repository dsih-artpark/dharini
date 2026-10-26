import 'package:design_system/design_system.dart';
import 'package:es_platform_mobile/utils/configs/constants.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../home/past_visit_card.dart';

class PendingVisits extends StatelessWidget {
  const PendingVisits({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
        backgroundColor: AppColors.backgroundLight,
        appBar: AppBar(
          backgroundColor: AppColors.white,
          title: Text(
            'Pending Visits',
            style: AppTypography.textTheme.headlineMedium,
          ),
          centerTitle: true,
          elevation: 0,
        ),
        body: Stack(
          children: <Widget>[
            // Main content - Scrollable list of visits
            Padding(
              padding: const EdgeInsets.fromLTRB(
                16,
                16,
                16,
                180,
              ), // Bottom padding for the fixed card
              child: ListView(
                children: <Widget>[
                  InkWell(
                    onTap: () => context.push('/collection-details'),
                    child: PastVisitCard(
                      farmName: 'Anjaneya Farms',
                      farmType: 'CATTLE FARM',
                      siteCode: '43',
                      visitScheduledDate: DateTime.now(),
                      visitedDate: DateTime.now(),
                      sampleCount: 5,
                      sampleTypes: const <String>['Blood', 'Urine'],
                    ),
                  ),
                  const SizedBox(height: 16),
                  InkWell(
                    onTap: () => context.push('/collection-details'),
                    child: PastVisitCard(
                      farmName: 'Balaji Milk Cooperation',
                      farmType: 'CATTLE FARM',
                      siteCode: '24',
                      visitScheduledDate: DateTime.now(),
                      visitedDate: DateTime.now(),
                      sampleCount: 3,
                      sampleTypes: const <String>['Blood'],
                    ),
                  ),
                  const SizedBox(height: 16),
                  InkWell(
                    onTap: () => context.push('/collection-details'),
                    child: PastVisitCard(
                      farmName: 'Nandani Poultry',
                      farmType: 'POULTRY FARM',
                      siteCode: '32',
                      visitScheduledDate: DateTime.now(),
                      visitedDate: DateTime.now(),
                      sampleCount: 4,
                      sampleTypes: const <String>['Blood', 'Feed'],
                    ),
                  ),
                ],
              ),
            ),

            // Fixed bottom card
            Positioned(
              left: 0,
              right: 0,
              bottom: 0,
              child: Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: AppColors.successbatchbg,
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(24),
                  ),
                  boxShadow: <BoxShadow>[
                    BoxShadow(
                      color: Colors.black.withOpacity(0.1),
                      blurRadius: 10,
                      offset: const Offset(0, -5),
                    ),
                  ],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Row(
                      children: <Widget>[
                        Container(
                          height: 24,
                          width: 24,
                          decoration: const BoxDecoration(
                            image: DecorationImage(
                              image: AssetImage(
                                Assets.testTubeLine,
                              ),
                              fit: BoxFit.contain,
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Text(
                          'Create a new site',
                          style: AppTypography.textTheme.displaySmall,
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Text(
                      "If you can't find your assigned site on the list, you can create new one.",
                      style: AppTypography.textTheme.bodySmall?.copyWith(
                        color: Colors.grey[600],
                      ),
                    ),
                    const SizedBox(height: 24),
                    SizedBox(
                      width: double.infinity,
                      child: AppButton(
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: <Widget>[
                            const Icon(Icons.add_location_outlined, size: 20),
                            SizedBox(width: Spacing.space(1)),
                            const Text('Create Site'),
                          ],
                        ),
                        onPressed: () => context.push('/create-site'),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      );
}
