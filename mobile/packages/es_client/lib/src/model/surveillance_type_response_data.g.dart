// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'surveillance_type_response_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const SurveillanceTypeResponseDataStatusEnum
    _$surveillanceTypeResponseDataStatusEnum_active =
    const SurveillanceTypeResponseDataStatusEnum._('active');
const SurveillanceTypeResponseDataStatusEnum
    _$surveillanceTypeResponseDataStatusEnum_inactive =
    const SurveillanceTypeResponseDataStatusEnum._('inactive');
const SurveillanceTypeResponseDataStatusEnum
    _$surveillanceTypeResponseDataStatusEnum_deleted =
    const SurveillanceTypeResponseDataStatusEnum._('deleted');
const SurveillanceTypeResponseDataStatusEnum
    _$surveillanceTypeResponseDataStatusEnum_unknownDefaultOpenApi =
    const SurveillanceTypeResponseDataStatusEnum._('unknownDefaultOpenApi');

SurveillanceTypeResponseDataStatusEnum
    _$surveillanceTypeResponseDataStatusEnumValueOf(String name) {
  switch (name) {
    case 'active':
      return _$surveillanceTypeResponseDataStatusEnum_active;
    case 'inactive':
      return _$surveillanceTypeResponseDataStatusEnum_inactive;
    case 'deleted':
      return _$surveillanceTypeResponseDataStatusEnum_deleted;
    case 'unknownDefaultOpenApi':
      return _$surveillanceTypeResponseDataStatusEnum_unknownDefaultOpenApi;
    default:
      return _$surveillanceTypeResponseDataStatusEnum_unknownDefaultOpenApi;
  }
}

final BuiltSet<SurveillanceTypeResponseDataStatusEnum>
    _$surveillanceTypeResponseDataStatusEnumValues = BuiltSet<
        SurveillanceTypeResponseDataStatusEnum>(const <SurveillanceTypeResponseDataStatusEnum>[
  _$surveillanceTypeResponseDataStatusEnum_active,
  _$surveillanceTypeResponseDataStatusEnum_inactive,
  _$surveillanceTypeResponseDataStatusEnum_deleted,
  _$surveillanceTypeResponseDataStatusEnum_unknownDefaultOpenApi,
]);

Serializer<SurveillanceTypeResponseDataStatusEnum>
    _$surveillanceTypeResponseDataStatusEnumSerializer =
    _$SurveillanceTypeResponseDataStatusEnumSerializer();

class _$SurveillanceTypeResponseDataStatusEnumSerializer
    implements PrimitiveSerializer<SurveillanceTypeResponseDataStatusEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'active': 'active',
    'inactive': 'inactive',
    'deleted': 'deleted',
    'unknownDefaultOpenApi': 'unknown_default_open_api',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'active': 'active',
    'inactive': 'inactive',
    'deleted': 'deleted',
    'unknown_default_open_api': 'unknownDefaultOpenApi',
  };

  @override
  final Iterable<Type> types = const <Type>[
    SurveillanceTypeResponseDataStatusEnum
  ];
  @override
  final String wireName = 'SurveillanceTypeResponseDataStatusEnum';

  @override
  Object serialize(Serializers serializers,
          SurveillanceTypeResponseDataStatusEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  SurveillanceTypeResponseDataStatusEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      SurveillanceTypeResponseDataStatusEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$SurveillanceTypeResponseData extends SurveillanceTypeResponseData {
  @override
  final String id;
  @override
  final String name;
  @override
  final SurveillanceTypeResponseDataStatusEnum status;
  @override
  final DateTime createdAt;
  @override
  final DateTime updatedAt;

  factory _$SurveillanceTypeResponseData(
          [void Function(SurveillanceTypeResponseDataBuilder)? updates]) =>
      (SurveillanceTypeResponseDataBuilder()..update(updates))._build();

  _$SurveillanceTypeResponseData._(
      {required this.id,
      required this.name,
      required this.status,
      required this.createdAt,
      required this.updatedAt})
      : super._();
  @override
  SurveillanceTypeResponseData rebuild(
          void Function(SurveillanceTypeResponseDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  SurveillanceTypeResponseDataBuilder toBuilder() =>
      SurveillanceTypeResponseDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is SurveillanceTypeResponseData &&
        id == other.id &&
        name == other.name &&
        status == other.status &&
        createdAt == other.createdAt &&
        updatedAt == other.updatedAt;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, name.hashCode);
    _$hash = $jc(_$hash, status.hashCode);
    _$hash = $jc(_$hash, createdAt.hashCode);
    _$hash = $jc(_$hash, updatedAt.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'SurveillanceTypeResponseData')
          ..add('id', id)
          ..add('name', name)
          ..add('status', status)
          ..add('createdAt', createdAt)
          ..add('updatedAt', updatedAt))
        .toString();
  }
}

class SurveillanceTypeResponseDataBuilder
    implements
        Builder<SurveillanceTypeResponseData,
            SurveillanceTypeResponseDataBuilder> {
  _$SurveillanceTypeResponseData? _$v;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  SurveillanceTypeResponseDataStatusEnum? _status;
  SurveillanceTypeResponseDataStatusEnum? get status => _$this._status;
  set status(SurveillanceTypeResponseDataStatusEnum? status) =>
      _$this._status = status;

  DateTime? _createdAt;
  DateTime? get createdAt => _$this._createdAt;
  set createdAt(DateTime? createdAt) => _$this._createdAt = createdAt;

  DateTime? _updatedAt;
  DateTime? get updatedAt => _$this._updatedAt;
  set updatedAt(DateTime? updatedAt) => _$this._updatedAt = updatedAt;

  SurveillanceTypeResponseDataBuilder() {
    SurveillanceTypeResponseData._defaults(this);
  }

  SurveillanceTypeResponseDataBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _name = $v.name;
      _status = $v.status;
      _createdAt = $v.createdAt;
      _updatedAt = $v.updatedAt;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(SurveillanceTypeResponseData other) {
    _$v = other as _$SurveillanceTypeResponseData;
  }

  @override
  void update(void Function(SurveillanceTypeResponseDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  SurveillanceTypeResponseData build() => _build();

  _$SurveillanceTypeResponseData _build() {
    final _$result = _$v ??
        _$SurveillanceTypeResponseData._(
          id: BuiltValueNullFieldError.checkNotNull(
              id, r'SurveillanceTypeResponseData', 'id'),
          name: BuiltValueNullFieldError.checkNotNull(
              name, r'SurveillanceTypeResponseData', 'name'),
          status: BuiltValueNullFieldError.checkNotNull(
              status, r'SurveillanceTypeResponseData', 'status'),
          createdAt: BuiltValueNullFieldError.checkNotNull(
              createdAt, r'SurveillanceTypeResponseData', 'createdAt'),
          updatedAt: BuiltValueNullFieldError.checkNotNull(
              updatedAt, r'SurveillanceTypeResponseData', 'updatedAt'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
