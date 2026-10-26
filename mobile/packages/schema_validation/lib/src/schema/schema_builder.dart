import 'package:barrel_files_annotation/barrel_files_annotation.dart';

import 'schemas/list_schema.dart';
import 'schemas/number_schema.dart';
import 'schemas/object_schema.dart';
import 'schemas/string-schema.dart';

/// A builder class to create schemas with a fluent API
@includeInBarrelFile
class SchemaBuilder {
  const SchemaBuilder();

  StringSchema string() => const StringSchema();

  NumberSchema number() => const NumberSchema();

  ListSchema<T> list<T>() => ListSchema<T>();

  ObjectSchema object() => const ObjectSchema();
}

/// Global instance of SchemaBuilder for easy access
@includeInBarrelFile
const SchemaBuilder schema = SchemaBuilder();
