import 'package:barrel_files_annotation/barrel_files_annotation.dart';

import '../../validators/validation_error.dart';
import '../../validators/validation_result.dart';
import '../base_schema.dart';

@includeInBarrelFile
class ObjectSchema extends Schema<Map<String, dynamic>> {
  const ObjectSchema({
    this.fields = const <String, Schema>{},
    this.isRequired = false,
    this.requiredMessage,
    this.requiredFields = const <String>[],
  });
  final SchemaMap fields;
  final bool isRequired;
  final String? requiredMessage;
  final List<String> requiredFields;

  @override
  ObjectSchema copyWith({
    SchemaMap? fields,
    bool? required,
    String? requiredMessage,
    List<String>? requiredFields,
  }) =>
      ObjectSchema(
        fields: fields ?? this.fields,
        isRequired: required ?? isRequired,
        requiredMessage: requiredMessage ?? this.requiredMessage,
        requiredFields: requiredFields ?? this.requiredFields,
      );

  @override
  ValidationResult validate(Map<String, dynamic>? value) {
    if (value == null) {
      if (isRequired) {
        return ValidationResult.error(
          requiredMessage ?? 'This field is required',
          value: value,
        );
      }
      return ValidationResult.valid();
    }

    final List<ValidationError> errors = <ValidationError>[];

    // Validate required fields
    for (final String field in requiredFields) {
      if (!value.containsKey(field) || value[field] == null) {
        errors.add(
          ValidationError(
            'Field is required',
            field: field,
            value: value[field],
          ),
        );
      }
    }

    // Validate fields with schemas
    for (final MapEntry<String, Schema> entry in fields.entries) {
      final String fieldName = entry.key;
      final Schema fieldSchema = entry.value;
      final fieldValue = value[fieldName];

      final ValidationResult fieldResult = fieldSchema.validate(fieldValue);
      if (!fieldResult.isValid) {
        errors.addAll(
          fieldResult.errors.map(
            (ValidationError e) => ValidationError(
              e.message,
              field: fieldName + (e.field != null ? '.${e.field}' : ''),
              value: e.value,
            ),
          ),
        );
      }
    }

    return ValidationResult(errors: errors, isValid: errors.isEmpty);
  }

  /// Add a field schema to this object schema
  ObjectSchema field(String name, Schema schema) => ObjectSchema(
        fields: <String, Schema>{...fields, name: schema},
        isRequired: isRequired,
        requiredMessage: requiredMessage,
        requiredFields: requiredFields,
      );

  /// Mark fields as required
  ObjectSchema markRequired(List<String> fields) => ObjectSchema(
        fields: this.fields,
        isRequired: true,
        requiredMessage: requiredMessage,
        requiredFields: <String>[...requiredFields, ...fields],
      );
}
