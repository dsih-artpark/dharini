import 'package:flutter/material.dart';
import '../theme/corners.dart';
import '../theme/spacing.dart';
import 'base.dart';

class BorderedListDecoration extends BaseDecoration {
  const BorderedListDecoration({
    super.backgroundColor,
    super.foregroundColor,
    super.border,
    super.borderRadius,
    super.padding,
    super.gradient,
    super.shadows,
    super.shape,
    super.hasError,
    this.dividerColor,
    this.dividerThickness = 1.0,
    this.itemPadding,
  });

  /// Color of the separator between items
  final Color? dividerColor;

  /// Thickness of the separator line
  final double dividerThickness;

  /// Padding for individual list items
  final EdgeInsets? itemPadding;

  @override
  BorderedListDecoration copyWith({
    Color? backgroundColor,
    Color? foregroundColor,
    Border? border,
    BorderRadius? borderRadius,
    EdgeInsets? padding,
    Gradient? gradient,
    List<BoxShadow>? shadows,
    BoxShape? shape,
    bool? hasError,
    Color? dividerColor,
    double? dividerThickness,
    EdgeInsets? itemPadding,
  }) =>
      BorderedListDecoration(
        backgroundColor: backgroundColor ?? this.backgroundColor,
        foregroundColor: foregroundColor ?? this.foregroundColor,
        border: border ?? this.border,
        borderRadius: borderRadius ?? this.borderRadius,
        padding: padding ?? this.padding,
        gradient: gradient ?? this.gradient,
        shadows: shadows ?? this.shadows,
        shape: shape ?? this.shape,
        hasError: hasError ?? this.hasError,
        dividerColor: dividerColor ?? this.dividerColor,
        dividerThickness: dividerThickness ?? this.dividerThickness,
        itemPadding: itemPadding ?? this.itemPadding,
      );
}

class BorderedList extends StatelessWidget {
  const BorderedList({
    required this.children,
    super.key,
    this.decoration,
  });

  final List<Widget> children;
  final BorderedListDecoration? decoration;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);

    final BorderedListDecoration effectiveDecoration =
        (decoration ?? const BorderedListDecoration()).copyWith(
      backgroundColor: decoration?.backgroundColor ?? Colors.transparent,
      foregroundColor:
          decoration?.foregroundColor ?? theme.textTheme.bodyMedium?.color,
      border: decoration?.border ??
          Border.all(
            color: theme.colorScheme.outline,
          ),
      borderRadius: decoration?.borderRadius ?? Corners.borderMd,
      padding: decoration?.padding ?? EdgeInsets.zero,
      dividerColor: decoration?.dividerColor ?? theme.colorScheme.outline,
      itemPadding: decoration?.itemPadding ?? Spacing.p(3),
    );

    return Container(
      decoration: BoxDecoration(
        color: effectiveDecoration.backgroundColor,
        border: effectiveDecoration.border,
        borderRadius: effectiveDecoration.borderRadius,
      ),
      padding: effectiveDecoration.padding,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          for (int i = 0; i < children.length; i++) ...<Widget>[
            Padding(
              padding: effectiveDecoration.itemPadding!,
              child: children[i],
            ),
            if (i < children.length - 1)
              Divider(
                height: effectiveDecoration.dividerThickness,
                thickness: effectiveDecoration.dividerThickness,
                color: effectiveDecoration.dividerColor,
              ),
          ],
        ],
      ),
    );
  }
}
