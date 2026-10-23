import 'package:flutter/material.dart';

class Spacing {
  Spacing._();

  /// Base unit of 4px
  static const double _unit = 4;

  /// Get spacing value based on multiplier (2-8)
  static double space(int multiplier) => _unit * multiplier;

  /// Padding helpers with multiplier support
  static EdgeInsets p([int? multiplier]) =>
      EdgeInsets.all(multiplier != null ? space(multiplier) : _unit);
  static EdgeInsets px([int? multiplier]) => EdgeInsets.symmetric(
        horizontal: multiplier != null ? space(multiplier) : _unit,
      );
  static EdgeInsets py([int? multiplier]) => EdgeInsets.symmetric(
        vertical: multiplier != null ? space(multiplier) : _unit,
      );
  static EdgeInsets pt([int? multiplier]) =>
      EdgeInsets.only(top: multiplier != null ? space(multiplier) : _unit);
  static EdgeInsets pr([int? multiplier]) =>
      EdgeInsets.only(right: multiplier != null ? space(multiplier) : _unit);
  static EdgeInsets pb([int? multiplier]) =>
      EdgeInsets.only(bottom: multiplier != null ? space(multiplier) : _unit);
  static EdgeInsets pl([int? multiplier]) =>
      EdgeInsets.only(left: multiplier != null ? space(multiplier) : _unit);

  /// Padding helper with separate vertical and horizontal multipliers
  static EdgeInsets pxy(int horizontal, int vertical) => EdgeInsets.symmetric(
        horizontal: space(horizontal),
        vertical: space(vertical),
      );

  /// Margin helpers with multiplier support
  static EdgeInsets m([int? multiplier]) =>
      EdgeInsets.all(multiplier != null ? space(multiplier) : _unit);
  static EdgeInsets mx([int? multiplier]) => EdgeInsets.symmetric(
        horizontal: multiplier != null ? space(multiplier) : _unit,
      );
  static EdgeInsets my([int? multiplier]) => EdgeInsets.symmetric(
        vertical: multiplier != null ? space(multiplier) : _unit,
      );
  static EdgeInsets mt([int? multiplier]) =>
      EdgeInsets.only(top: multiplier != null ? space(multiplier) : _unit);
  static EdgeInsets mr([int? multiplier]) =>
      EdgeInsets.only(right: multiplier != null ? space(multiplier) : _unit);
  static EdgeInsets mb([int? multiplier]) =>
      EdgeInsets.only(bottom: multiplier != null ? space(multiplier) : _unit);
  static EdgeInsets ml([int? multiplier]) =>
      EdgeInsets.only(left: multiplier != null ? space(multiplier) : _unit);

  /// Margin helper with separate vertical and horizontal multipliers
  static EdgeInsets mxy(int horizontal, int vertical) => EdgeInsets.symmetric(
        horizontal: space(horizontal),
        vertical: space(vertical),
      );
}
