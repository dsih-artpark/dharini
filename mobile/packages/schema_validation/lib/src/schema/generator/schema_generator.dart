import 'package:analyzer/dart/constant/value.dart';
import 'package:analyzer/dart/element/element.dart';
import 'package:build/build.dart';
import 'package:source_gen/source_gen.dart';

import '../../core/validatable.dart';

/// Generator for schemas
class SchemaGenerator extends GeneratorForAnnotation<GenerateSchema> {
  @override
  String generateForAnnotatedElement(
    Element element,
    ConstantReader annotation,
    BuildStep buildStep,
  ) {
    if (element is! ClassElement) {
      throw InvalidGenerationSourceError(
        'Schema generation is only supported for classes.',
        element: element,
      );
    }

    final String className = element.name;
    final String schemaName = '${className.toLowerCase()}Schema';

    // Find the factory constructor
    final ConstructorElement constructor = element.constructors
            .where(
              (ConstructorElement c) => c.isFactory && !c.name.startsWith('_'),
            )
            .firstOrNull ??
        element.constructors.first;

    final List<ParameterElement> parameters = constructor.parameters;
    final List<DartObject?> validations = parameters.map((ParameterElement p) {
      try {
        final ElementAnnotation annotation = p.metadata.firstWhere(
          (ElementAnnotation m) =>
              m
                  .computeConstantValue()
                  ?.type
                  ?.getDisplayString(withNullability: false) ==
              'Validate',
        );
        return annotation.computeConstantValue();
      } catch (_) {
        return null;
      }
    }).toList();

    final StringBuffer buffer = StringBuffer();
    buffer.writeln('// Generated code - do not modify by hand');
    buffer.writeln();
    buffer.writeln();

    // Generate schema
    buffer.writeln('final $schemaName = schema.object()');

    for (int i = 0; i < parameters.length; i++) {
      final ParameterElement param = parameters[i];
      final DartObject? validation = validations[i];

      if (validation == null) continue;

      buffer.write("  .field('${param.name}', schema");

      // Add type-specific validation
      switch (param.type.getDisplayString(withNullability: false)) {
        case 'String':
          buffer.write('.string()');
          final String? pattern =
              validation.getField('pattern')?.toStringValue();
          if (pattern != null) {
            buffer.write('.withPattern($pattern)');
          }
        case 'int':
        case 'double':
        case 'num':
          buffer.write('.number()');
          final bool? isInteger =
              validation.getField('isInteger')?.toBoolValue();
          if (isInteger == true) {
            buffer.write('.withInteger()');
          }
        case 'bool':
          buffer.write('.boolean()');
        case 'DateTime':
          buffer.write('.string()'); // DateTime is validated as string
        default:
          if (param.type.toString().startsWith('List')) {
            buffer.write('.list()');
          } else {
            buffer.write('.string()'); // Default to string for unknown types
          }
      }

      // Add common validations
      final bool? required = validation.getField('required')?.toBoolValue();
      if (required == true) {
        buffer.write('.withRequired()');
      }

      final int? minLength = validation.getField('minLength')?.toIntValue();
      if (minLength != null) {
        buffer.write('.withMinLength($minLength)');
      }

      final int? maxLength = validation.getField('maxLength')?.toIntValue();
      if (maxLength != null) {
        buffer.write('.withMaxLength($maxLength)');
      }

      buffer.writeln(')');
    }

    buffer.writeln(';');

    return buffer.toString();
  }
}

Builder schemaBuilder(BuilderOptions options) =>
    SharedPartBuilder(<Generator>[SchemaGenerator()], 'schema');
