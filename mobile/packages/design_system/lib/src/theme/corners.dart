import 'package:flutter/material.dart';

class Corners {
  Corners._();

  /// Base unit of 4px following your spacing unit
  static const double _unit = 4;

  /// Extra small radius - 4px
  static const double xs = _unit;

  /// Small radius - 8px
  static const double sm = _unit * 2;

  /// Medium radius - 12px
  static const double md = _unit * 3;

  /// Large radius - 16px
  static const double lg = _unit * 4;

  /// Extra large radius - 24px
  static const double xl = _unit * 6;

  /// Full radius - 9999px (for pill shapes)
  static const double full = 9999;

  /// Zero radius - 0px (for squared corners)
  static const double none = 0;

  /// BorderRadius convenience getters
  static BorderRadius get borderXs => BorderRadius.circular(xs);
  static BorderRadius get borderSm => BorderRadius.circular(sm);
  static BorderRadius get borderMd => BorderRadius.circular(md);
  static BorderRadius get borderLg => BorderRadius.circular(lg);
  static BorderRadius get borderXl => BorderRadius.circular(xl);
  static BorderRadius get borderFull => BorderRadius.circular(full);
  static BorderRadius get borderNone => BorderRadius.circular(none);

  /// Individual corner radius helpers
  static BorderRadius topLeft(double radius) =>
      BorderRadius.only(topLeft: Radius.circular(radius));
  static BorderRadius topRight(double radius) =>
      BorderRadius.only(topRight: Radius.circular(radius));
  static BorderRadius bottomLeft(double radius) =>
      BorderRadius.only(bottomLeft: Radius.circular(radius));
  static BorderRadius bottomRight(double radius) =>
      BorderRadius.only(bottomRight: Radius.circular(radius));

  /// Top corners radius helper
  static BorderRadius top(double radius) => BorderRadius.only(
        topLeft: Radius.circular(radius),
        topRight: Radius.circular(radius),
      );

  /// Bottom corners radius helper
  static BorderRadius bottom(double radius) => BorderRadius.only(
        bottomLeft: Radius.circular(radius),
        bottomRight: Radius.circular(radius),
      );

  /// Left corners radius helper
  static BorderRadius left(double radius) => BorderRadius.only(
        topLeft: Radius.circular(radius),
        bottomLeft: Radius.circular(radius),
      );

  /// Right corners radius helper
  static BorderRadius right(double radius) => BorderRadius.only(
        topRight: Radius.circular(radius),
        bottomRight: Radius.circular(radius),
      );
}
