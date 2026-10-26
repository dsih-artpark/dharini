// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'sample_status.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const SampleStatus _$pending = const SampleStatus._('pending');
const SampleStatus _$pickedUp = const SampleStatus._('pickedUp');
const SampleStatus _$received = const SampleStatus._('received');
const SampleStatus _$preProcessed = const SampleStatus._('preProcessed');
const SampleStatus _$virusIsolation = const SampleStatus._('virusIsolation');
const SampleStatus _$extracted = const SampleStatus._('extracted');
const SampleStatus _$tested = const SampleStatus._('tested');
const SampleStatus _$rejected = const SampleStatus._('rejected');
const SampleStatus _$testReportGenerated =
    const SampleStatus._('testReportGenerated');
const SampleStatus _$unknownDefaultOpenApi =
    const SampleStatus._('unknownDefaultOpenApi');

SampleStatus _$valueOf(String name) {
  switch (name) {
    case 'pending':
      return _$pending;
    case 'pickedUp':
      return _$pickedUp;
    case 'received':
      return _$received;
    case 'preProcessed':
      return _$preProcessed;
    case 'virusIsolation':
      return _$virusIsolation;
    case 'extracted':
      return _$extracted;
    case 'tested':
      return _$tested;
    case 'rejected':
      return _$rejected;
    case 'testReportGenerated':
      return _$testReportGenerated;
    case 'unknownDefaultOpenApi':
      return _$unknownDefaultOpenApi;
    default:
      return _$unknownDefaultOpenApi;
  }
}

final BuiltSet<SampleStatus> _$values =
    BuiltSet<SampleStatus>(const <SampleStatus>[
  _$pending,
  _$pickedUp,
  _$received,
  _$preProcessed,
  _$virusIsolation,
  _$extracted,
  _$tested,
  _$rejected,
  _$testReportGenerated,
  _$unknownDefaultOpenApi,
]);

class _$SampleStatusMeta {
  const _$SampleStatusMeta();
  SampleStatus get pending => _$pending;
  SampleStatus get pickedUp => _$pickedUp;
  SampleStatus get received => _$received;
  SampleStatus get preProcessed => _$preProcessed;
  SampleStatus get virusIsolation => _$virusIsolation;
  SampleStatus get extracted => _$extracted;
  SampleStatus get tested => _$tested;
  SampleStatus get rejected => _$rejected;
  SampleStatus get testReportGenerated => _$testReportGenerated;
  SampleStatus get unknownDefaultOpenApi => _$unknownDefaultOpenApi;
  SampleStatus valueOf(String name) => _$valueOf(name);
  BuiltSet<SampleStatus> get values => _$values;
}

abstract class _$SampleStatusMixin {
  // ignore: non_constant_identifier_names
  _$SampleStatusMeta get SampleStatus => const _$SampleStatusMeta();
}

Serializer<SampleStatus> _$sampleStatusSerializer = _$SampleStatusSerializer();

class _$SampleStatusSerializer implements PrimitiveSerializer<SampleStatus> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'pending': 'pending',
    'pickedUp': 'picked-up',
    'received': 'received',
    'preProcessed': 'pre-processed',
    'virusIsolation': 'virus-isolation',
    'extracted': 'extracted',
    'tested': 'tested',
    'rejected': 'rejected',
    'testReportGenerated': 'test-report-generated',
    'unknownDefaultOpenApi': 'unknown_default_open_api',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'pending': 'pending',
    'picked-up': 'pickedUp',
    'received': 'received',
    'pre-processed': 'preProcessed',
    'virus-isolation': 'virusIsolation',
    'extracted': 'extracted',
    'tested': 'tested',
    'rejected': 'rejected',
    'test-report-generated': 'testReportGenerated',
    'unknown_default_open_api': 'unknownDefaultOpenApi',
  };

  @override
  final Iterable<Type> types = const <Type>[SampleStatus];
  @override
  final String wireName = 'SampleStatus';

  @override
  Object serialize(Serializers serializers, SampleStatus object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  SampleStatus deserialize(Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      SampleStatus.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
