import 'package:flutter/material.dart';

/// Base class for creating decorations in the app
/// Handles common styling properties like colors, borders, shadows etc.
class BaseDecoration {
  const BaseDecoration({
    this.backgroundColor,
    this.foregroundColor,
    this.border,
    this.borderRadius,
    this.shadows,
    this.shape = BoxShape.rectangle,
    this.gradient,
    this.padding,
    this.hasError = false,
  });

  /// Background color of the decorated widget
  final Color? backgroundColor;

  /// Foreground/content color
  final Color? foregroundColor;

  /// Border styling
  final Border? border;

  /// Border radius for rounded corners
  final BorderRadius? borderRadius;

  /// List of shadows to apply
  final List<BoxShadow>? shadows;

  /// Shape of the decoration (rectangle/circle)
  final BoxShape shape;

  /// Optional gradient background
  final Gradient? gradient;

  /// Padding around the decorated content
  final EdgeInsets? padding;

  /// Whether the decorated widget is in error state
  final bool hasError;

  /// Creates a copy of this decoration with the given fields replaced
  BaseDecoration copyWith({
    Color? backgroundColor,
    Color? foregroundColor,
    Border? border,
    BorderRadius? borderRadius,
    List<BoxShadow>? shadows,
    BoxShape? shape,
    Gradient? gradient,
    EdgeInsets? padding,
    bool? hasError,
  }) =>
      BaseDecoration(
        backgroundColor: backgroundColor ?? this.backgroundColor,
        foregroundColor: foregroundColor ?? this.foregroundColor,
        border: border ?? this.border,
        borderRadius: borderRadius ?? this.borderRadius,
        shadows: shadows ?? this.shadows,
        shape: shape ?? this.shape,
        gradient: gradient ?? this.gradient,
        padding: padding ?? this.padding,
        hasError: hasError ?? this.hasError,
      );

  /// Merges this decoration with another
  /// The other decoration's non-null properties take precedence
  BaseDecoration merge(BaseDecoration? other) {
    if (other == null) return this;

    return BaseDecoration(
      backgroundColor: other.backgroundColor ?? backgroundColor,
      foregroundColor: other.foregroundColor ?? foregroundColor,
      border: other.border ?? border,
      borderRadius: other.borderRadius ?? borderRadius,
      shadows: other.shadows ?? shadows,
      shape: other.shape,
      gradient: other.gradient ?? gradient,
      padding: other.padding ?? padding,
      hasError: other.hasError,
    );
  }
}
