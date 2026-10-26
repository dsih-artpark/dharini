import 'package:flutter/material.dart';
import '../theme/colors.dart';
import '../theme/typography.dart';

class AppCard extends StatelessWidget {
  const AppCard({
    required this.title,
    required this.subtitle,
    required this.actionLabel,
    required this.onActionPressed,
    this.icon,
    super.key,
  });

  final String title;
  final String subtitle;
  final String actionLabel;
  final VoidCallback onActionPressed;
  final IconData? icon;

  @override
  Widget build(BuildContext context) => Container(
        margin: const EdgeInsets.symmetric(vertical: 8),
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.borderLight),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text(
                title,
                style: AppTypography.textTheme.displaySmall,
              ),
              const SizedBox(height: 8),
              Text(
                subtitle,
                style: AppTypography.textTheme.bodySmall,
              ),
              const SizedBox(height: 16),
              TextButton.icon(
                onPressed: onActionPressed,
                icon: Icon(icon ?? Icons.arrow_forward),
                label: Text(
                  actionLabel,
                  style: AppTypography.textTheme.bodySmall?.copyWith(
                    color: AppColors.primaryLight,
                  ),
                ),
              ),
            ],
          ),
        ),
      );
}
