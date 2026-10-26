import 'package:flutter/material.dart';

import '../theme/corners.dart';
import '../theme/spacing.dart';

enum BadgeVariant {
  primary,
  secondary,
  outline,
  destructive,
}

class AppBadge extends StatefulWidget {
  const AppBadge({
    required this.child,
    super.key,
    this.onPressed,
    this.padding,
  }) : variant = BadgeVariant.primary;

  const AppBadge.secondary({
    required this.child,
    super.key,
    this.onPressed,
    this.padding,
  }) : variant = BadgeVariant.secondary;

  const AppBadge.outline({
    required this.child,
    super.key,
    this.onPressed,
    this.padding,
  }) : variant = BadgeVariant.outline;

  const AppBadge.destructive({
    required this.child,
    super.key,
    this.onPressed,
    this.padding,
  }) : variant = BadgeVariant.destructive;

  final BadgeVariant variant;
  final Widget child;
  final VoidCallback? onPressed;
  final EdgeInsets? padding;

  @override
  State<AppBadge> createState() => _AppBadgeState();
}

class _AppBadgeState extends State<AppBadge> {
  bool isHovered = false;

  Color _getBackgroundColor(ColorScheme colors) {
    if (isHovered) {
      return switch (widget.variant) {
        BadgeVariant.primary => colors.primary.withOpacity(0.8),
        BadgeVariant.secondary => colors.secondary.withOpacity(0.8),
        BadgeVariant.outline => colors.surface.withOpacity(0.8),
        BadgeVariant.destructive => colors.error.withOpacity(0.8),
      };
    }

    return switch (widget.variant) {
      BadgeVariant.primary => colors.primary,
      BadgeVariant.secondary => colors.secondary,
      BadgeVariant.outline => colors.surface,
      BadgeVariant.destructive => colors.error,
    };
  }

  Color _getForegroundColor(ColorScheme colors) => switch (widget.variant) {
        BadgeVariant.primary => colors.onPrimary,
        BadgeVariant.secondary => colors.onSecondary,
        BadgeVariant.outline => colors.onSurface,
        BadgeVariant.destructive => colors.onError,
      };

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colors = theme.colorScheme;

    return MouseRegion(
      onEnter: (_) => setState(() => isHovered = true),
      onExit: (_) => setState(() => isHovered = false),
      child: GestureDetector(
        onTap: widget.onPressed,
        child: Container(
          padding: widget.padding ?? Spacing.pxy(3, 1),
          decoration: BoxDecoration(
            color: _getBackgroundColor(colors),
            borderRadius: Corners.borderFull,
            border: widget.variant == BadgeVariant.outline
                ? Border.all(color: colors.outline)
                : null,
          ),
          child: DefaultTextStyle(
            style: theme.textTheme.labelSmall!.copyWith(
              color: _getForegroundColor(colors),
              fontWeight: FontWeight.w600,
            ),
            textAlign: TextAlign.center,
            child: widget.child,
          ),
        ),
      ),
    );
  }
}
