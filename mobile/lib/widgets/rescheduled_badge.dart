import 'package:design_system/design_system.dart';
import 'package:flutter/material.dart';

/// Small blue pill shown on a visit card when the visit has been rescheduled.
class RescheduledBadge extends StatelessWidget {
  final String label;

  const RescheduledBadge({super.key, this.label = 'Rescheduled'});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: const Color(0xFFE1EFFE),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: const Color(0xFF1A56DB).withValues(alpha: 0.25),
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          const Icon(
            Icons.event_repeat,
            size: 12,
            color: Color(0xFF1A56DB),
          ),
          const SizedBox(width: 4),
          Text(
            label,
            style: AppTypography.textTheme.bodyB4Medium.copyWith(
              color: const Color(0xFF1A56DB),
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
