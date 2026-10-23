import 'package:flutter/material.dart';
import '../theme/corners.dart';
import '../theme/spacing.dart';
import '../widgets/app_progress.dart';

enum StepStatus {
  complete,
  incomplete,
  error,
}

class StepperItem {
  const StepperItem({
    required this.title,
    this.icon,
    this.status = StepStatus.incomplete,
    this.errorMessage,
  });
  final Widget? icon;
  final String title;
  final StepStatus status;
  final String? errorMessage;

  StepperItem copyWith({
    Widget? icon,
    String? title,
    StepStatus? status,
    String? errorMessage,
  }) =>
      StepperItem(
        icon: icon ?? this.icon,
        title: title ?? this.title,
        status: status ?? this.status,
        errorMessage: errorMessage ?? this.errorMessage,
      );
}

typedef StepLabelBuilder = String Function(int current, int total);

class CustomStepper extends StatelessWidget {
  const CustomStepper({
    required this.steps,
    required this.currentStep,
    super.key,
    this.showProgressBar = false,
    this.stepLabelBuilder,
    this.progressColor,
    this.backgroundColor,
    this.defaultIconBuilder,
    this.iconSize = 40.0,
  });

  final List<StepperItem> steps;
  final int currentStep;
  final bool showProgressBar;
  final StepLabelBuilder? stepLabelBuilder;
  final Color? progressColor;
  final Color? backgroundColor;
  final Widget Function(StepperItem step)? defaultIconBuilder;
  final double iconSize;

  Color _getIconBackgroundColor(BuildContext context, StepStatus status) {
    final ThemeData theme = Theme.of(context);
    switch (status) {
      case StepStatus.complete:
        return theme.colorScheme.primary;
      case StepStatus.error:
        return theme.colorScheme.error.withOpacity(0.1);
      case StepStatus.incomplete:
        return theme.colorScheme.surfaceContainerHighest;
    }
  }

  Color _getIconColor(BuildContext context, StepStatus status) {
    final ThemeData theme = Theme.of(context);
    switch (status) {
      case StepStatus.complete:
        return theme.colorScheme.onPrimary;
      case StepStatus.error:
        return theme.colorScheme.error;
      case StepStatus.incomplete:
        return theme.colorScheme.onSurfaceVariant;
    }
  }

  IconData _getDefaultIcon(StepStatus status) {
    switch (status) {
      case StepStatus.complete:
        return Icons.check_rounded;
      case StepStatus.error:
        return Icons.error_outline_rounded;
      case StepStatus.incomplete:
        return Icons.circle_outlined;
    }
  }

  Widget _buildIcon(BuildContext context, StepperItem step) {
    if (step.icon != null) return step.icon!;

    if (defaultIconBuilder != null) {
      return defaultIconBuilder!(step);
    }

    return CircleAvatar(
      radius: iconSize / 2,
      backgroundColor: _getIconBackgroundColor(context, step.status),
      child: Icon(
        _getDefaultIcon(step.status),
        color: _getIconColor(context, step.status),
        size: iconSize * 0.5,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final StepperItem currentItem = steps[currentStep];

    // Get colors from theme
    final Color effectiveProgressColor =
        progressColor ?? theme.colorScheme.primary;
    final Color effectiveBackgroundColor =
        backgroundColor ?? theme.colorScheme.surfaceContainerHighest;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        if (showProgressBar) ...<Widget>[
          Progress(
            value: (currentStep + 1) / steps.length,
            color: effectiveProgressColor,
            backgroundColor: effectiveBackgroundColor,
            height: Spacing.space(1),
            borderRadius: Corners.borderFull,
          ),
        ],
        SizedBox(height: Spacing.space(4)),
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            SizedBox(width: Spacing.space(3)),
            _buildIcon(context, currentItem),
          ],
        ),
        SizedBox(height: Spacing.space(3)),
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            SizedBox(width: Spacing.space(3)),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Text(
                    stepLabelBuilder?.call(currentStep + 1, steps.length) ??
                        'Step ${currentStep + 1} of ${steps.length}',
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: theme.colorScheme.onSurface.withOpacity(0.7),
                    ),
                  ),
                  SizedBox(height: Spacing.space(1)),
                  Text(
                    currentItem.title,
                    style: theme.textTheme.headlineLarge,
                  ),
                  if (currentItem.errorMessage != null &&
                      currentItem.status == StepStatus.error) ...<Widget>[
                    SizedBox(height: Spacing.space(1)),
                    Text(
                      currentItem.errorMessage!,
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: theme.colorScheme.error,
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ],
    );
  }
}
