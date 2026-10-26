class Phone {
  factory Phone(String input) {
    if (!_isValid(input)) {
      throw ArgumentError('Invalid phone format');
    }
    return Phone._(input);
  }
  Phone._(this.value);

  final String value;

  static bool _isValid(String input) =>
      RegExp(r'^\+?[\d\s-]{8,}$').hasMatch(input);
}
