//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'test_result_type.g.dart';

class TestResultType extends EnumClass {

  @BuiltValueEnumConst(wireName: r'pending')
  static const TestResultType pending = _$pending;
  @BuiltValueEnumConst(wireName: r'positive')
  static const TestResultType positive = _$positive;
  @BuiltValueEnumConst(wireName: r'negative')
  static const TestResultType negative = _$negative;
  @BuiltValueEnumConst(wireName: r'unclear')
  static const TestResultType unclear = _$unclear;
  @BuiltValueEnumConst(wireName: r'unknown_default_open_api', fallback: true)
  static const TestResultType unknownDefaultOpenApi = _$unknownDefaultOpenApi;

  static Serializer<TestResultType> get serializer => _$testResultTypeSerializer;

  const TestResultType._(String name): super(name);

  static BuiltSet<TestResultType> get values => _$values;
  static TestResultType valueOf(String name) => _$valueOf(name);
}

/// Optionally, enum_class can generate a mixin to go with your enum for use
/// with Angular. It exposes your enum constants as getters. So, if you mix it
/// in to your Dart component class, the values become available to the
/// corresponding Angular template.
///
/// Trigger mixin generation by writing a line like this one next to your enum.
abstract class TestResultTypeMixin = Object with _$TestResultTypeMixin;

