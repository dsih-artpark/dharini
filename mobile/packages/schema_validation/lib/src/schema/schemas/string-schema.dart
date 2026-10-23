import 'package:barrel_files_annotation/barrel_files_annotation.dart';

import '../../validators/validation_error.dart';
import '../../validators/validation_result.dart';
import '../base_schema.dart';

@includeInBarrelFile
class StringSchema extends Schema<String> {
  const StringSchema({
    this.minLength,
    this.maxLength,
    this.pattern,
    this.required = false,
    this.requiredMessage,
    this.minLengthMessage,
    this.maxLengthMessage,
    this.patternMessage,
  });
  final int? minLength;
  final int? maxLength;
  final String? pattern;
  final bool required;
  final String? requiredMessage;
  final String? minLengthMessage;
  final String? maxLengthMessage;
  final String? patternMessage;

  @override
  StringSchema copyWith({
    int? minLength,
    int? maxLength,
    String? pattern,
    bool? required,
    String? requiredMessage,
    String? minLengthMessage,
    String? maxLengthMessage,
    String? patternMessage,
  }) =>
      StringSchema(
        minLength: minLength ?? this.minLength,
        maxLength: maxLength ?? this.maxLength,
        pattern: pattern ?? this.pattern,
        required: required ?? this.required,
        requiredMessage: requiredMessage ?? this.requiredMessage,
        minLengthMessage: minLengthMessage ?? this.minLengthMessage,
        maxLengthMessage: maxLengthMessage ?? this.maxLengthMessage,
        patternMessage: patternMessage ?? this.patternMessage,
      );

  StringSchema withPattern(String pattern, [String? message]) =>
      copyWith(pattern: pattern, patternMessage: message);

  StringSchema withMinLength(int length, [String? message]) =>
      copyWith(minLength: length, minLengthMessage: message);

  StringSchema withMaxLength(int length, [String? message]) =>
      copyWith(maxLength: length, maxLengthMessage: message);

  @override
  StringSchema withRequired([String? message]) =>
      copyWith(required: true, requiredMessage: message);

  @override
  ValidationResult validate(String? value) {
    if (value == null || value.isEmpty) {
      if (required) {
        return ValidationResult.error(
          requiredMessage ?? 'This field is required',
          value: value,
        );
      }
      return ValidationResult.valid();
    }

    final List<ValidationError> errors = <ValidationError>[];

    if (minLength != null && value.length < minLength!) {
      errors.add(
        ValidationError(
          minLengthMessage ?? 'Must be at least $minLength characters',
          value: value,
        ),
      );
    }

    if (maxLength != null && value.length > maxLength!) {
      errors.add(
        ValidationError(
          maxLengthMessage ?? 'Must be at most $maxLength characters',
          value: value,
        ),
      );
    }

    if (pattern != null && !RegExp(pattern!).hasMatch(value)) {
      errors.add(
        ValidationError(
          patternMessage ?? 'Does not match required pattern',
          value: value,
        ),
      );
    }

    return ValidationResult(errors: errors, isValid: errors.isEmpty);
  }
}
