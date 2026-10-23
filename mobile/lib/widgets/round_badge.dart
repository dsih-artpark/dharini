import 'package:design_system/design_system.dart';
import 'package:flutter/material.dart';

/// Small blue pill showing the surveillance round for a visit (e.g. "Round 3").
/// Renders nothing when [round] is null, so callers can pass an unknown round
/// unconditionally without guarding.
class RoundBadge extends StatelessWidget {
  final num? round;

  const RoundBadge({super.key, required this.round});

  @override
  Widget build(BuildContext context) {
    final value = round;
    if (value == null) return const SizedBox.shrink();

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: AppColors.primaryLight.withValues(alpha: 0.10),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: AppColors.primaryLight.withValues(alpha: 0.20),
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          const Icon(Icons.refresh, size: 12, color: AppColors.primaryLight),
          const SizedBox(width: 4),
          Text(
            'Round ${value.toInt()}',
            style: AppTypography.textTheme.bodyB4Medium.copyWith(
              color: AppColors.primaryLight,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
