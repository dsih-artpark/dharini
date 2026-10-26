import 'package:flutter/material.dart';
import '../theme/corners.dart';
import '../theme/spacing.dart';
import 'base.dart';

class BorderCardDecoration extends BaseDecoration {
  const BorderCardDecoration({
    super.backgroundColor,
    super.foregroundColor,
    super.border,
    super.borderRadius,
    super.padding,
    super.gradient,
    super.shadows,
    super.shape,
    super.hasError,
    this.titleStyle,
    this.titlePadding,
    this.contentPadding,
    this.titleBackgroundColor,
    this.contentBackgroundColor,
    this.titleBorderColor,
  });

  /// Style for the card title
  final TextStyle? titleStyle;

  /// Padding around the title
  final EdgeInsets? titlePadding;

  /// Padding around the content
  final EdgeInsets? contentPadding;

  /// Background color for title section
  final Color? titleBackgroundColor;

  /// Background color for content section
  final Color? contentBackgroundColor;

  /// Border color for title bottom border
  final Color? titleBorderColor;

  @override
  BorderCardDecoration copyWith({
    Color? backgroundColor,
    Color? foregroundColor,
    Border? border,
    BorderRadius? borderRadius,
    EdgeInsets? padding,
    Gradient? gradient,
    List<BoxShadow>? shadows,
    BoxShape? shape,
    bool? hasError,
    TextStyle? titleStyle,
    EdgeInsets? titlePadding,
    EdgeInsets? contentPadding,
    Color? titleBackgroundColor,
    Color? contentBackgroundColor,
    Color? titleBorderColor,
  }) =>
      BorderCardDecoration(
        backgroundColor: backgroundColor ?? this.backgroundColor,
        foregroundColor: foregroundColor ?? this.foregroundColor,
        border: border ?? this.border,
        borderRadius: borderRadius ?? this.borderRadius,
        padding: padding ?? this.padding,
        gradient: gradient ?? this.gradient,
        shadows: shadows ?? this.shadows,
        shape: shape ?? this.shape,
        hasError: hasError ?? this.hasError,
        titleStyle: titleStyle ?? this.titleStyle,
        titlePadding: titlePadding ?? this.titlePadding,
        contentPadding: contentPadding ?? this.contentPadding,
        titleBackgroundColor: titleBackgroundColor ?? this.titleBackgroundColor,
        contentBackgroundColor:
            contentBackgroundColor ?? this.contentBackgroundColor,
        titleBorderColor: titleBorderColor ?? this.titleBorderColor,
      );
}

class BorderCard extends StatelessWidget {
  const BorderCard({
    required this.child,
    super.key,
    this.title,
    this.decoration,
  });

  final Widget? title;
  final Widget child;
  final BorderCardDecoration? decoration;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);

    final BorderCardDecoration effectiveDecoration =
        (decoration ?? const BorderCardDecoration()).copyWith(
      backgroundColor: decoration?.backgroundColor ?? Colors.transparent,
      foregroundColor:
          decoration?.foregroundColor ?? theme.textTheme.bodyMedium?.color,
      border: decoration?.border ??
          Border.all(
            color: theme.colorScheme.outline,
          ),
      borderRadius: decoration?.borderRadius ?? Corners.borderMd,
      titleStyle: decoration?.titleStyle ?? theme.textTheme.titleMedium,
      titlePadding: decoration?.titlePadding ?? Spacing.p(4),
      contentPadding: decoration?.contentPadding ?? Spacing.p(4),
      titleBackgroundColor:
          decoration?.titleBackgroundColor ?? Colors.transparent,
      contentBackgroundColor:
          decoration?.contentBackgroundColor ?? Colors.transparent,
      titleBorderColor:
          decoration?.titleBorderColor ?? theme.colorScheme.outline,
    );

    return Container(
      decoration: BoxDecoration(
        color: effectiveDecoration.backgroundColor,
        border: effectiveDecoration.border,
        borderRadius: effectiveDecoration.borderRadius,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: <Widget>[
          if (title != null) ...<Widget>[
            Container(
              padding: effectiveDecoration.titlePadding,
              decoration: BoxDecoration(
                color: effectiveDecoration.titleBackgroundColor,
                border: Border(
                  bottom: BorderSide(
                    color: effectiveDecoration.titleBorderColor!,
                  ),
                ),
                borderRadius: effectiveDecoration.borderRadius?.copyWith(
                  bottomLeft: Radius.zero,
                  bottomRight: Radius.zero,
                ),
              ),
              child: DefaultTextStyle(
                style: effectiveDecoration.titleStyle!,
                child: title!,
              ),
            ),
          ],
          Container(
            padding: effectiveDecoration.contentPadding,
            decoration: BoxDecoration(
              color: effectiveDecoration.contentBackgroundColor,
              borderRadius: title != null
                  ? effectiveDecoration.borderRadius?.copyWith(
                      topLeft: Radius.zero,
                      topRight: Radius.zero,
                    )
                  : effectiveDecoration.borderRadius,
            ),
            child: child,
          ),
        ],
      ),
    );
  }
}
