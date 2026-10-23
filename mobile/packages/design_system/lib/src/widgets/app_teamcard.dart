import 'package:flutter/material.dart';

import '../../design_system.dart';

class StatCard extends StatelessWidget {
  const StatCard({
    required this.value,
    required this.label,
    required this.icon,
    super.key,
    this.backgroundColor = const Color(0xFFEAE7DC), // Default beige color
  });
  final String value;
  final String label;
  final IconData icon;
  final Color backgroundColor;

  @override
  Widget build(BuildContext context) => Container(
    height: MediaQuery.of(context).size.height*.2,
    width: MediaQuery.of(context).size.width*.2,
        padding: Spacing.p(4),
        decoration: BoxDecoration(
          color: backgroundColor,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            // Icon container
            Container(
              padding:  Spacing.p(2),
              decoration: BoxDecoration(
                color: AppColors.white,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Icon(
                icon,
                size: 20,
                color: AppColors.labletestblack,
              ),
            ),
            SizedBox(
              height: Spacing.space(2),
            ),
            // Value
            Text(
              value,
              style: Theme.of(context)
                  .textTheme
                  .labelMedium
                  ?.copyWith(color: AppColors.labletestgrey),
            ),
            SizedBox(
              height: Spacing.space(2),
            ),
            // Label
            Text(
              label.toUpperCase(),
              style: Theme.of(context)
                  .textTheme
                  .labelLarge
                  ?.copyWith(color: AppColors.labletestgrey),
            ),
          ],
        ),
      );
}
