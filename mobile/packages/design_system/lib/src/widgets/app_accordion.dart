import 'package:flutter/material.dart';

import '../theme/colors.dart';
import '../theme/spacing.dart';
import '../theme/typography.dart';

class AppAccordion extends StatelessWidget {
  const AppAccordion({
    required this.title,
    required this.itemCount,
    required this.child,
    this.initiallyExpanded = false,
    super.key,
  });

  final String title;
  final int itemCount;
  final Widget child;
  final bool initiallyExpanded;

  @override
  Widget build(BuildContext context) => ExpansionTile(
        title: Row(
          children: <Widget>[
            Text(
              title,
              style: AppTypography.textTheme.bodyMedium,
            ),
            SizedBox(width: Spacing.space(2)),
            Container(
              padding: Spacing.pxy(4, 2),
              decoration: BoxDecoration(
                color: AppColors.surfaceLight,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                '$itemCount Visits',
                style: AppTypography.textTheme.labelLarge?.copyWith(
                  color: AppColors.primaryLight,
                ),
              ),
            ),
          ],
        ),
        initiallyExpanded: initiallyExpanded,
        backgroundColor: AppColors.white,
        children: <Widget>[
          ColoredBox(
            color: AppColors.white,
            child: child,
          ),
        ],
      );
}
