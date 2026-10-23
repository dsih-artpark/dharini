import 'package:flutter/material.dart';

import '../theme/colors.dart';
import '../theme/spacing.dart';
import '../theme/typography.dart';

enum ButtonVariant {
  filled, // Default solid background
  tonal, // Filled with more subtle background
  outline, // Outlined style
  text, // Text only
  icon, // Icon button
  fab, // Floating action button
  fabIcon // Floating action icon button
}

enum ButtonSize {
  sm, // Small
  md, // Medium (default)
  lg, // Large
  fab // FAB specific size
}

class AppButton extends StatefulWidget {
  const AppButton({
    required this.child,
    super.key,
    this.variant = ButtonVariant.filled,
    this.size = ButtonSize.md,
    this.onPressed,
    this.disabled = false,
    this.isLoading = false,
    this.icon,
    this.width,
    this.height,
    this.color,
    this.backgroundColor,
    this.borderRadius,
    this.elevation,
    this.padding,
    this.alignment = Alignment.center,
    this.loadingIndicatorSize,
    this.loadingIndicatorColor,
  });

  final Widget child;
  final ButtonVariant variant;
  final ButtonSize size;
  final VoidCallback? onPressed;
  final bool disabled;
  final bool isLoading;
  final Widget? icon;
  final double? width;
  final double? height;
  final Color? color;
  final Color? backgroundColor;
  final BorderRadius? borderRadius;
  final double? elevation;
  final EdgeInsetsGeometry? padding;
  final AlignmentGeometry alignment;
  final double? loadingIndicatorSize;
  final Color? loadingIndicatorColor;

  @override
  State<AppButton> createState() => _AppButtonState();
}

class _AppButtonState extends State<AppButton> {
  bool _pressed = false;

  // ignore: unused_field
  bool _hovered = false;

  // Get default colors based on variant
  ColorScheme _getColors(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    return theme.colorScheme;
  }

  // Get size dimensions
  Map<String, double> _getSizeDimensions() {
    switch (widget.size) {
      case ButtonSize.sm:
        return <String, double>{
          'height': Spacing.space(8), // 32
          'padding': Spacing.space(4), // 16
        };
      case ButtonSize.lg:
        return <String, double>{
          'height': Spacing.space(12), // 48
          'padding': Spacing.space(6), // 24
        };
      case ButtonSize.fab:
        return <String, double>{
          'height': Spacing.space(14), // 56
          'padding': Spacing.space(4), // 16
        };
      case ButtonSize.md:
        return <String, double>{
          'height': Spacing.space(10), // 40
          'padding': Spacing.space(5), // 20
        };
    }
  }

  // Get loading indicator size based on button size
  double _getLoadingIndicatorSize() {
    if (widget.loadingIndicatorSize != null)
      return widget.loadingIndicatorSize!;

    switch (widget.size) {
      case ButtonSize.sm:
        return 16.0;
      case ButtonSize.lg:
        return 24.0;
      case ButtonSize.fab:
        return 24.0;
      case ButtonSize.md:
        return 20.0;
    }
  }

  // Get border radius based on variant and size
  BorderRadius _getBorderRadius() {
    if (widget.borderRadius != null) return widget.borderRadius!;

    switch (widget.variant) {
      case ButtonVariant.icon:
        return BorderRadius.circular(999); // 28
      case ButtonVariant.fabIcon:
        return BorderRadius.circular(Spacing.space(8)); // 20
      case ButtonVariant.filled:
      case ButtonVariant.tonal:
      case ButtonVariant.outline:
      case ButtonVariant.text:
      case ButtonVariant.fab:
        return BorderRadius.circular(Spacing.space(2)); // 20
    }
  }

  // Get background color
  Color _getBackgroundColor(ColorScheme colors) {
    if (widget.disabled || widget.isLoading)
      return colors.onSurface.withOpacity(0.12);

    if (widget.backgroundColor != null) return widget.backgroundColor!;

    switch (widget.variant) {
      case ButtonVariant.filled:
        return colors.primary;
      case ButtonVariant.tonal:
        return colors.surfaceBright;
      case ButtonVariant.fabIcon:
        return AppColors.labletestblack;
      case ButtonVariant.fab:
      case ButtonVariant.outline:
      case ButtonVariant.text:
      case ButtonVariant.icon:
        return Colors.transparent;
    }
  }

  // Get foreground/text color
  Color _getForegroundColor(ColorScheme colors) {
    if (widget.disabled) return colors.onSurface.withOpacity(0.38);

    if (widget.color != null) return widget.color!;

    switch (widget.variant) {
      case ButtonVariant.filled:
        return colors.onPrimary;
      case ButtonVariant.tonal:
        return colors.onSurface;
      case ButtonVariant.fabIcon:
        return colors.onInverseSurface;
      case ButtonVariant.outline:
      case ButtonVariant.text:
      case ButtonVariant.icon:
        return colors.primary;
      case ButtonVariant.fab:
        return colors.onPrimaryContainer;
    }
  }

  // Get elevation
  double _getElevation() {
    if (widget.elevation != null) return widget.elevation!;

    switch (widget.variant) {
      case ButtonVariant.fab:
      case ButtonVariant.fabIcon:
        return _pressed ? 8 : 6;
      case ButtonVariant.filled:
      case ButtonVariant.tonal:
        return _pressed ? 2 : 1;
      case ButtonVariant.outline:
      case ButtonVariant.text:
      case ButtonVariant.icon:
        return 0;
    }
  }

  // Build the button's child content
  Widget _buildChild(ColorScheme colors) {
    final Color foregroundColor = _getForegroundColor(colors);

    if (widget.isLoading) {
      return SizedBox(
        height: _getLoadingIndicatorSize(),
        width: _getLoadingIndicatorSize(),
        child: CircularProgressIndicator(
          strokeWidth: 2.5,
          valueColor: AlwaysStoppedAnimation<Color>(
            widget.loadingIndicatorColor ?? foregroundColor,
          ),
        ),
      );
    }

    Widget content = DefaultTextStyle(
      style: widget.size == ButtonSize.sm
          ? AppTypography.textTheme.bodySmall!.copyWith(
              color: foregroundColor,
              fontWeight: FontWeight.w500,
            )
          : AppTypography.textTheme.bodyMedium!.copyWith(
              color: foregroundColor,
              fontWeight: FontWeight.w500,
            ),
      child: IconTheme(
        data: IconThemeData(
          color: foregroundColor,
          size: widget.size == ButtonSize.sm ? 18 : 24,
        ),
        child: widget.child,
      ),
    );

    if (widget.icon != null) {
      content = Row(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          widget.icon!,
          SizedBox(width: Spacing.space(2)), // 8
          content,
        ],
      );
    }

    return content;
  }

  @override
  Widget build(BuildContext context) {
    final ColorScheme colors = _getColors(context);
    final Map<String, double> sizeDimensions = _getSizeDimensions();

    return Material(
      color: _getBackgroundColor(colors),
      elevation: _getElevation(),
      borderRadius: _getBorderRadius(),
      child: InkWell(
        onTap: (widget.disabled || widget.isLoading) ? null : widget.onPressed,
        onTapDown: (widget.disabled || widget.isLoading)
            ? null
            : (_) => setState(() => _pressed = true),
        onTapUp: (widget.disabled || widget.isLoading)
            ? null
            : (_) => setState(() => _pressed = false),
        onTapCancel: (widget.disabled || widget.isLoading)
            ? null
            : () => setState(() => _pressed = false),
        onHover: (bool value) => setState(() => _hovered = value),
        borderRadius: _getBorderRadius(),
        child: Container(
          width: widget.width,
          height: widget.height ?? sizeDimensions['height'],
          padding: widget.padding ??
              EdgeInsets.symmetric(
                horizontal: sizeDimensions['padding']!,
              ),
          alignment: widget.alignment,
          decoration: widget.variant == ButtonVariant.outline
              ? BoxDecoration(
                  border: Border.all(
                    color: (widget.disabled || widget.isLoading)
                        ? colors.onSurface.withOpacity(0.12)
                        : colors.outline,
                  ),
                  borderRadius: _getBorderRadius(),
                )
              : null,
          child: _buildChild(colors),
        ),
      ),
    );
  }
}
