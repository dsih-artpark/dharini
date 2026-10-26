import 'package:flutter/material.dart';
import '../theme/corners.dart';
import '../theme/spacing.dart';
import 'base.dart';

class LabeledDividerDecoration extends BaseDecoration {
  const LabeledDividerDecoration({
    super.backgroundColor,
    super.foregroundColor,
    super.border,
    super.borderRadius,
    super.padding,
    super.gradient,
    super.shadows,
    super.shape,
    super.hasError,
    this.labelStyle,
    this.labelPadding,
    this.dividerColor,
    this.dividerThickness = 1.0,
    this.labelBackgroundColor,
    this.labelBorder,
    this.labelBorderRadius,
  });

  /// Text style for the label
  final TextStyle? labelStyle;

  /// Padding around the label
  final EdgeInsets? labelPadding;

  /// Color of the divider lines
  final Color? dividerColor;

  /// Thickness of the divider lines
  final double dividerThickness;

  /// Background color for the label container
  final Color? labelBackgroundColor;

  /// Border for the label container
  final Border? labelBorder;

  /// Border radius for the label container
  final BorderRadius? labelBorderRadius;

  @override
  LabeledDividerDecoration copyWith({
    Color? backgroundColor,
    Color? foregroundColor,
    Border? border,
    BorderRadius? borderRadius,
    EdgeInsets? padding,
    Gradient? gradient,
    List<BoxShadow>? shadows,
    BoxShape? shape,
    bool? hasError,
    TextStyle? labelStyle,
    EdgeInsets? labelPadding,
    Color? dividerColor,
    double? dividerThickness,
    Color? labelBackgroundColor,
    Border? labelBorder,
    BorderRadius? labelBorderRadius,
  }) =>
      LabeledDividerDecoration(
        backgroundColor: backgroundColor ?? this.backgroundColor,
        foregroundColor: foregroundColor ?? this.foregroundColor,
        border: border ?? this.border,
        borderRadius: borderRadius ?? this.borderRadius,
        padding: padding ?? this.padding,
        gradient: gradient ?? this.gradient,
        shadows: shadows ?? this.shadows,
        shape: shape ?? this.shape,
        hasError: hasError ?? this.hasError,
        labelStyle: labelStyle ?? this.labelStyle,
        labelPadding: labelPadding ?? this.labelPadding,
        dividerColor: dividerColor ?? this.dividerColor,
        dividerThickness: dividerThickness ?? this.dividerThickness,
        labelBackgroundColor: labelBackgroundColor ?? this.labelBackgroundColor,
        labelBorder: labelBorder ?? this.labelBorder,
        labelBorderRadius: labelBorderRadius ?? this.labelBorderRadius,
      );
}

class LabeledDivider extends StatelessWidget {
  const LabeledDivider({
    required this.label,
    super.key,
    this.decoration,
  });

  final Widget label;
  final LabeledDividerDecoration? decoration;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);

    final LabeledDividerDecoration effectiveDecoration =
        (decoration ?? const LabeledDividerDecoration()).copyWith(
      labelStyle: decoration?.labelStyle ??
          theme.textTheme.labelSmall
              ?.copyWith(color: theme.colorScheme.onSurface),
      labelPadding: decoration?.labelPadding ?? Spacing.px(2),
      dividerColor: decoration?.dividerColor ?? theme.colorScheme.outline,
      labelBackgroundColor:
          decoration?.labelBackgroundColor ?? Colors.transparent,
      labelBorder: decoration?.labelBorder ??
          Border.all(
            color: theme.colorScheme.outline,
          ),
      labelBorderRadius:
          decoration?.labelBorderRadius ?? BorderRadius.circular(Corners.lg),
    );

    return Row(
      children: <Widget>[
        Expanded(
          child: Divider(
            color: effectiveDecoration.dividerColor,
            thickness: effectiveDecoration.dividerThickness,
          ),
        ),
        Container(
          padding: effectiveDecoration.labelPadding,
          decoration: BoxDecoration(
            color: effectiveDecoration.labelBackgroundColor,
            border: effectiveDecoration.labelBorder,
            borderRadius: effectiveDecoration.labelBorderRadius,
          ),
          child: DefaultTextStyle(
            style: effectiveDecoration.labelStyle!,
            child: label,
          ),
        ),
        Expanded(
          child: Divider(
            color: effectiveDecoration.dividerColor,
            thickness: effectiveDecoration.dividerThickness,
          ),
        ),
      ],
    );
  }
}
