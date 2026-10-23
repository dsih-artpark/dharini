import 'package:barrel_files_annotation/barrel_files_annotation.dart';

import '../../validators/validation_error.dart';
import '../../validators/validation_result.dart';
import '../base_schema.dart';

@includeInBarrelFile
class NumberSchema extends Schema<num> {
  const NumberSchema({
    this.min,
    this.max,
    this.required = false,
    this.integer = false,
    this.requiredMessage,
    this.minMessage,
    this.maxMessage,
    this.integerMessage,
  });
  final num? min;
  final num? max;
  final bool required;
  final bool integer;
  final String? requiredMessage;
  final String? minMessage;
  final String? maxMessage;
  final String? integerMessage;

  @override
  NumberSchema copyWith({
    num? min,
    num? max,
    bool? required,
    bool? integer,
    String? requiredMessage,
    String? minMessage,
    String? maxMessage,
    String? integerMessage,
  }) =>
      NumberSchema(
        min: min ?? this.min,
        max: max ?? this.max,
        required: required ?? this.required,
        integer: integer ?? this.integer,
        requiredMessage: requiredMessage ?? this.requiredMessage,
        minMessage: minMessage ?? this.minMessage,
        maxMessage: maxMessage ?? this.maxMessage,
        integerMessage: integerMessage ?? this.integerMessage,
      );

  @override
  ValidationResult validate(num? value) {
    if (value == null) {
      if (required) {
        return ValidationResult.error(
          requiredMessage ?? 'This field is required',
          value: value,
        );
      }
      return ValidationResult.valid();
    }

    final List<ValidationError> errors = <ValidationError>[];

    if (min != null && value < min!) {
      errors.add(
        ValidationError(
          minMessage ?? 'Must be at least $min',
          value: value,
        ),
      );
    }

    if (max != null && value > max!) {
      errors.add(
        ValidationError(
          maxMessage ?? 'Must be at most $max',
          value: value,
        ),
      );
    }

    if (integer && value != value.toInt()) {
      errors.add(
        ValidationError(
          integerMessage ?? 'Must be an integer',
          value: value,
        ),
      );
    }

    return ValidationResult(errors: errors, isValid: errors.isEmpty);
  }
}
