// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'site_type.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const SiteType _$private = const SiteType._('private');
const SiteType _$government = const SiteType._('government');
const SiteType _$corporate = const SiteType._('corporate');
const SiteType _$unknownDefaultOpenApi =
    const SiteType._('unknownDefaultOpenApi');

SiteType _$valueOf(String name) {
  switch (name) {
    case 'private':
      return _$private;
    case 'government':
      return _$government;
    case 'corporate':
      return _$corporate;
    case 'unknownDefaultOpenApi':
      return _$unknownDefaultOpenApi;
    default:
      return _$unknownDefaultOpenApi;
  }
}

final BuiltSet<SiteType> _$values = BuiltSet<SiteType>(const <SiteType>[
  _$private,
  _$government,
  _$corporate,
  _$unknownDefaultOpenApi,
]);

class _$SiteTypeMeta {
  const _$SiteTypeMeta();
  SiteType get private => _$private;
  SiteType get government => _$government;
  SiteType get corporate => _$corporate;
  SiteType get unknownDefaultOpenApi => _$unknownDefaultOpenApi;
  SiteType valueOf(String name) => _$valueOf(name);
  BuiltSet<SiteType> get values => _$values;
}

abstract class _$SiteTypeMixin {
  // ignore: non_constant_identifier_names
  _$SiteTypeMeta get SiteType => const _$SiteTypeMeta();
}

Serializer<SiteType> _$siteTypeSerializer = _$SiteTypeSerializer();

class _$SiteTypeSerializer implements PrimitiveSerializer<SiteType> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'private': 'private',
    'government': 'government',
    'corporate': 'corporate',
    'unknownDefaultOpenApi': 'unknown_default_open_api',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'private': 'private',
    'government': 'government',
    'corporate': 'corporate',
    'unknown_default_open_api': 'unknownDefaultOpenApi',
  };

  @override
  final Iterable<Type> types = const <Type>[SiteType];
  @override
  final String wireName = 'SiteType';

  @override
  Object serialize(Serializers serializers, SiteType object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  SiteType deserialize(Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      SiteType.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
