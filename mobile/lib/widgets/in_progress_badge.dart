import 'package:design_system/design_system.dart';
import 'package:flutter/material.dart';

/// Small amber pill shown on a visit card when an incomplete draft exists for
/// that visit — signalling it can be resumed, as opposed to a brand-new visit
/// that has no saved progress.
class InProgressBadge extends StatelessWidget {
  final String label;

  const InProgressBadge({super.key, this.label = 'In Progress'});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: AppColors.warningLight,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.warningDark),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.history_toggle_off,
              size: 12, color: AppColors.onWarningLight),
          const SizedBox(width: 4),
          Text(
            label,
            style: AppTypography.textTheme.bodyB4Medium.copyWith(
              color: AppColors.onWarningLight,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
