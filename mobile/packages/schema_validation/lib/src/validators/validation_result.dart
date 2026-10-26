import 'package:barrel_files_annotation/barrel_files_annotation.dart';
import 'validation_error.dart';

@includeInBarrelFile
class ValidationResult {
  const ValidationResult({
    this.errors = const <ValidationError>[],
    this.isValid = true,
  });

  factory ValidationResult.valid() => const ValidationResult();

  factory ValidationResult.error(
    String message, {
    String? field,
    dynamic value,
  }) =>
      ValidationResult(
        errors: <ValidationError>[
          ValidationError(message, field: field, value: value),
        ],
        isValid: false,
      );
  final List<ValidationError> errors;
  final bool isValid;

  ValidationResult merge(ValidationResult other) => ValidationResult(
        errors: <ValidationError>[...errors, ...other.errors],
        isValid: isValid && other.isValid,
      );
}
