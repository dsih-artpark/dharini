/// Common validation messages
mixin ValidationMessages {
  /// Required field message
  static const String required = 'This field is required';

  /// Invalid email message
  static const String email = 'Invalid email address';

  /// Invalid phone number message
  static const String phone = 'Invalid phone number';

  /// Invalid URL message
  static const String url = 'Invalid URL';

  /// Invalid password message
  static const String password =
      'Password must be at least 8 characters and contain at least one letter and one number';

  /// Invalid UUID message
  static const String uuid = 'Invalid UUID';

  /// Invalid IPv4 address message
  static const String ipv4 = 'Invalid IPv4 address';

  /// Invalid date format message
  static const String date = 'Invalid date format (YYYY-MM-DD)';

  /// Invalid time format message
  static const String time = 'Invalid time format (HH:mm:ss)';

  /// Invalid datetime format message
  static const String datetime = 'Invalid datetime format (ISO 8601)';

  /// Minimum length validation message
  static String minLength(int length) => 'Must be at least $length characters';

  /// Maximum length validation message
  static String maxLength(int length) => 'Must be at most $length characters';

  /// Minimum value validation message
  static String min(num value) => 'Must be at least $value';

  /// Maximum value validation message
  static String max(num value) => 'Must be at most $value';

  /// One of validation message
  static String oneOf(List<dynamic> values) =>
      'Must be one of: ${values.join(", ")}';

  /// Pattern match validation message
  static String matches(String pattern) => 'Must match pattern: $pattern';
}
