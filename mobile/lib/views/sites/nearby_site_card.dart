import 'package:design_system/design_system.dart';
import 'package:flutter/material.dart';

class NearbySiteCard extends StatelessWidget {
  const NearbySiteCard({
    required this.title,
    required this.subtitle,
    required this.distance,
    required this.siteId,
    required this.groupValue,
    required this.onChanged,
    super.key,
  });
  final String title;
  final String subtitle;
  final String distance;
  final String siteId;
  final String? groupValue;
  final ValueChanged<String?> onChanged;

  @override
  Widget build(BuildContext context) => Card(
        margin: const EdgeInsets.only(bottom: 8),
        color: AppColors.white,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
          side: const BorderSide(color: AppColors.borderLight),
        ),
        child: RadioListTile<String>(
          value: siteId,
          groupValue: groupValue,
          onChanged: onChanged,
          title: Text(
            title,
            style: AppTypography.textTheme.bodyMedium,
          ),
          subtitle: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget>[
              Text(
                subtitle,
                style: AppTypography.textTheme.bodySmall?.copyWith(
                  color: AppColors.labletestgrey,
                ),
              ),
              Text(
                distance,
                style: AppTypography.textTheme.bodySmall?.copyWith(
                  color: AppColors.labletestgrey,
                ),
              ),
            ],
          ),
        ),
      );
}
