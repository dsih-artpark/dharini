import 'package:barrel_files_annotation/barrel_files_annotation.dart';

import '../schema/base_schema.dart';
import '../validators/validation_result.dart';

/// Base mixin for any class that requires validation
@includeInBarrelFile
mixin Validatable {
  /// Get the schema for this instance
  Schema get schema;

  /// Validate the instance
  ValidationResult validate() => schema.validate(toJson());

  /// Convert instance to JSON for validation
  Map<String, dynamic> toJson();
}

/// Annotation to generate schema for a class
@includeInBarrelFile
class GenerateSchema {
  const GenerateSchema();
}

/// Annotation for field validation rules
@includeInBarrelFile
class Validate {
  const Validate({
    this.required = false,
    this.pattern,
    this.minLength,
    this.maxLength,
    this.min,
    this.max,
    this.isInteger,
    this.oneOf,
    this.message,
  });
  final bool required;
  final String? pattern;
  final int? minLength;
  final int? maxLength;
  final num? min;
  final num? max;
  final bool? isInteger;
  final List<dynamic>? oneOf;
  final String? message;
}

/// Extension to add validation methods to Freezed unions or any other type
@includeInBarrelFile
extension TypeValidation<T> on T {
  ValidationResult validateMap(Map<Type, Schema> schemas) {
    final Schema? schema = schemas[runtimeType];
    if (schema == null) {
      return ValidationResult.error(
        'No schema defined for type $runtimeType',
        value: this,
      );
    }
    return schema.validate(this);
  }
}
