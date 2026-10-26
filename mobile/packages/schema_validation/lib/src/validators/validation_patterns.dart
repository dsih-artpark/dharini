import 'package:barrel_files_annotation/barrel_files_annotation.dart';

/// Common regex patterns for validation
@includeInBarrelFile
mixin ValidationPatterns {
  /// Email validation pattern
  static const String email =
      r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$';

  /// Phone number validation pattern (E.164 format)
  static const String phone = r'^\+?[1-9]\d{1,14}$';

  /// URL validation pattern
  static const String url =
      r'^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$';

  /// Password validation pattern (min 8 chars, at least one letter and one number)
  static const String password = r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$';

  /// UUID v4 validation pattern
  static const String uuid =
      r'^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';

  /// IPv4 address validation pattern
  static const String ipv4 =
      r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$';

  /// Date validation pattern (YYYY-MM-DD)
  static const String date =
      r'^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$';

  /// Time validation pattern (HH:mm:ss)
  static const String time = r'^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$';

  /// ISO 8601 datetime validation pattern
  static const String datetime =
      r'^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?$';
}

/// Extension methods for string validation
extension StringValidationX on String {
  bool get isEmail => RegExp(ValidationPatterns.email).hasMatch(this);
  bool get isPhone => RegExp(ValidationPatterns.phone).hasMatch(this);
  bool get isUrl => RegExp(ValidationPatterns.url).hasMatch(this);
  bool get isPassword => RegExp(ValidationPatterns.password).hasMatch(this);
  bool get isUuid => RegExp(ValidationPatterns.uuid).hasMatch(this);
  bool get isIpv4 => RegExp(ValidationPatterns.ipv4).hasMatch(this);
  bool get isDate => RegExp(ValidationPatterns.date).hasMatch(this);
  bool get isTime => RegExp(ValidationPatterns.time).hasMatch(this);
  bool get isDateTime => RegExp(ValidationPatterns.datetime).hasMatch(this);
}
