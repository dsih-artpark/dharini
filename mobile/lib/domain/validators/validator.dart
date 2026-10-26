// ignore_for_file: one_member_abstracts

abstract class Validator<T> {
  ValidationResult validate(T input);
}

class ValidationResult {
  const ValidationResult({
    required this.isValid,
    this.errors = const <String>[],
  });
  final bool isValid;
  final List<String> errors;
}
