import 'package:barrel_files_annotation/barrel_files_annotation.dart';

import '../validators/validation_error.dart';
import '../validators/validation_result.dart';

/// Base class for all schema validators
@includeInBarrelFile
abstract class Schema<T> {
  const Schema();

  ValidationResult validate(T? value);

  bool isValid(T? value) => validate(value).isValid;

  List<ValidationError> getErrors(T? value) => validate(value).errors;

  /// Makes the field required
  Schema<T> withRequired([String? message]) =>
      copyWith(required: true, requiredMessage: message);

  /// Creates a copy of the schema with updated properties
  Schema<T> copyWith({
    bool? required,
    String? requiredMessage,
  });
}

@includeInBarrelFile
typedef SchemaMap = Map<String, Schema>;
