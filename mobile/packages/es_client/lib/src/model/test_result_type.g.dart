// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'test_result_type.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const TestResultType _$pending = const TestResultType._('pending');
const TestResultType _$positive = const TestResultType._('positive');
const TestResultType _$negative = const TestResultType._('negative');
const TestResultType _$unclear = const TestResultType._('unclear');
const TestResultType _$unknownDefaultOpenApi =
    const TestResultType._('unknownDefaultOpenApi');

TestResultType _$valueOf(String name) {
  switch (name) {
    case 'pending':
      return _$pending;
    case 'positive':
      return _$positive;
    case 'negative':
      return _$negative;
    case 'unclear':
      return _$unclear;
    case 'unknownDefaultOpenApi':
      return _$unknownDefaultOpenApi;
    default:
      return _$unknownDefaultOpenApi;
  }
}

final BuiltSet<TestResultType> _$values =
    BuiltSet<TestResultType>(const <TestResultType>[
  _$pending,
  _$positive,
  _$negative,
  _$unclear,
  _$unknownDefaultOpenApi,
]);

class _$TestResultTypeMeta {
  const _$TestResultTypeMeta();
  TestResultType get pending => _$pending;
  TestResultType get positive => _$positive;
  TestResultType get negative => _$negative;
  TestResultType get unclear => _$unclear;
  TestResultType get unknownDefaultOpenApi => _$unknownDefaultOpenApi;
  TestResultType valueOf(String name) => _$valueOf(name);
  BuiltSet<TestResultType> get values => _$values;
}

abstract class _$TestResultTypeMixin {
  // ignore: non_constant_identifier_names
  _$TestResultTypeMeta get TestResultType => const _$TestResultTypeMeta();
}

Serializer<TestResultType> _$testResultTypeSerializer =
    _$TestResultTypeSerializer();

class _$TestResultTypeSerializer
    implements PrimitiveSerializer<TestResultType> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'pending': 'pending',
    'positive': 'positive',
    'negative': 'negative',
    'unclear': 'unclear',
    'unknownDefaultOpenApi': 'unknown_default_open_api',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'pending': 'pending',
    'positive': 'positive',
    'negative': 'negative',
    'unclear': 'unclear',
    'unknown_default_open_api': 'unknownDefaultOpenApi',
  };

  @override
  final Iterable<Type> types = const <Type>[TestResultType];
  @override
  final String wireName = 'TestResultType';

  @override
  Object serialize(Serializers serializers, TestResultType object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  TestResultType deserialize(Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      TestResultType.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
