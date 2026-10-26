import 'package:barrel_files_annotation/barrel_files_annotation.dart';

import '../../validators/validation_error.dart';
import '../../validators/validation_result.dart';
import '../base_schema.dart';

@includeInBarrelFile
class ListSchema<T> extends Schema<List<T>> {
  const ListSchema({
    this.itemSchema,
    this.minLength,
    this.maxLength,
    this.required = false,
    this.requiredMessage,
    this.minLengthMessage,
    this.maxLengthMessage,
  });
  final Schema<T>? itemSchema;
  final int? minLength;
  final int? maxLength;
  final bool required;
  final String? requiredMessage;
  final String? minLengthMessage;
  final String? maxLengthMessage;

  @override
  ListSchema<T> copyWith({
    Schema<T>? itemSchema,
    int? minLength,
    int? maxLength,
    bool? required,
    String? requiredMessage,
    String? minLengthMessage,
    String? maxLengthMessage,
  }) =>
      ListSchema<T>(
        itemSchema: itemSchema ?? this.itemSchema,
        minLength: minLength ?? this.minLength,
        maxLength: maxLength ?? this.maxLength,
        required: required ?? this.required,
        requiredMessage: requiredMessage ?? this.requiredMessage,
        minLengthMessage: minLengthMessage ?? this.minLengthMessage,
        maxLengthMessage: maxLengthMessage ?? this.maxLengthMessage,
      );

  @override
  ValidationResult validate(List<T>? value) {
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
          minLengthMessage ?? 'Must have at least $minLength items',
          value: value,
        ),
      );
    }

    if (maxLength != null && value.length > maxLength!) {
      errors.add(
        ValidationError(
          maxLengthMessage ?? 'Must have at most $maxLength items',
          value: value,
        ),
      );
    }

    if (itemSchema != null) {
      for (int i = 0; i < value.length; i++) {
        final ValidationResult itemResult = itemSchema!.validate(value[i]);
        if (!itemResult.isValid) {
          errors.addAll(
            itemResult.errors.map(
              (ValidationError e) => ValidationError(
                e.message,
                field: '[$i]${e.field != null ? '.${e.field}' : ''}',
                value: e.value,
              ),
            ),
          );
        }
      }
    }

    return ValidationResult(errors: errors, isValid: errors.isEmpty);
  }
}
