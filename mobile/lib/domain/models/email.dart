class Email {
  factory Email(String input) {
    if (!_isValid(input)) {
      throw ArgumentError('Invalid email format');
    }
    return Email._(input);
  }
  Email._(this.value);

  final String value;

  static bool _isValid(String input) =>
      RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(input);
}
