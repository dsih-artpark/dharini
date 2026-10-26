// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'visit_status.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const VisitStatus _$upcoming = const VisitStatus._('upcoming');
const VisitStatus _$overdue = const VisitStatus._('overdue');
const VisitStatus _$skipped = const VisitStatus._('skipped');
const VisitStatus _$completed = const VisitStatus._('completed');
const VisitStatus _$unknownDefaultOpenApi =
    const VisitStatus._('unknownDefaultOpenApi');

VisitStatus _$valueOf(String name) {
  switch (name) {
    case 'upcoming':
      return _$upcoming;
    case 'overdue':
      return _$overdue;
    case 'skipped':
      return _$skipped;
    case 'completed':
      return _$completed;
    case 'unknownDefaultOpenApi':
      return _$unknownDefaultOpenApi;
    default:
      return _$unknownDefaultOpenApi;
  }
}

final BuiltSet<VisitStatus> _$values =
    BuiltSet<VisitStatus>(const <VisitStatus>[
  _$upcoming,
  _$overdue,
  _$skipped,
  _$completed,
  _$unknownDefaultOpenApi,
]);

class _$VisitStatusMeta {
  const _$VisitStatusMeta();
  VisitStatus get upcoming => _$upcoming;
  VisitStatus get overdue => _$overdue;
  VisitStatus get skipped => _$skipped;
  VisitStatus get completed => _$completed;
  VisitStatus get unknownDefaultOpenApi => _$unknownDefaultOpenApi;
  VisitStatus valueOf(String name) => _$valueOf(name);
  BuiltSet<VisitStatus> get values => _$values;
}

abstract class _$VisitStatusMixin {
  // ignore: non_constant_identifier_names
  _$VisitStatusMeta get VisitStatus => const _$VisitStatusMeta();
}

Serializer<VisitStatus> _$visitStatusSerializer = _$VisitStatusSerializer();

class _$VisitStatusSerializer implements PrimitiveSerializer<VisitStatus> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'upcoming': 'upcoming',
    'overdue': 'overdue',
    'skipped': 'skipped',
    'completed': 'completed',
    'unknownDefaultOpenApi': 'unknown_default_open_api',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'upcoming': 'upcoming',
    'overdue': 'overdue',
    'skipped': 'skipped',
    'completed': 'completed',
    'unknown_default_open_api': 'unknownDefaultOpenApi',
  };

  @override
  final Iterable<Type> types = const <Type>[VisitStatus];
  @override
  final String wireName = 'VisitStatus';

  @override
  Object serialize(Serializers serializers, VisitStatus object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  VisitStatus deserialize(Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      VisitStatus.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
