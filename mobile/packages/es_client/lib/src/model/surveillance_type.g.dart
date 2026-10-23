// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'surveillance_type.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const SurveillanceTypeStatusEnum _$surveillanceTypeStatusEnum_active =
    const SurveillanceTypeStatusEnum._('active');
const SurveillanceTypeStatusEnum _$surveillanceTypeStatusEnum_inactive =
    const SurveillanceTypeStatusEnum._('inactive');
const SurveillanceTypeStatusEnum _$surveillanceTypeStatusEnum_deleted =
    const SurveillanceTypeStatusEnum._('deleted');
const SurveillanceTypeStatusEnum
    _$surveillanceTypeStatusEnum_unknownDefaultOpenApi =
    const SurveillanceTypeStatusEnum._('unknownDefaultOpenApi');

SurveillanceTypeStatusEnum _$surveillanceTypeStatusEnumValueOf(String name) {
  switch (name) {
    case 'active':
      return _$surveillanceTypeStatusEnum_active;
    case 'inactive':
      return _$surveillanceTypeStatusEnum_inactive;
    case 'deleted':
      return _$surveillanceTypeStatusEnum_deleted;
    case 'unknownDefaultOpenApi':
      return _$surveillanceTypeStatusEnum_unknownDefaultOpenApi;
    default:
      return _$surveillanceTypeStatusEnum_unknownDefaultOpenApi;
  }
}

final BuiltSet<SurveillanceTypeStatusEnum> _$surveillanceTypeStatusEnumValues =
    BuiltSet<SurveillanceTypeStatusEnum>(const <SurveillanceTypeStatusEnum>[
  _$surveillanceTypeStatusEnum_active,
  _$surveillanceTypeStatusEnum_inactive,
  _$surveillanceTypeStatusEnum_deleted,
  _$surveillanceTypeStatusEnum_unknownDefaultOpenApi,
]);

Serializer<SurveillanceTypeStatusEnum> _$surveillanceTypeStatusEnumSerializer =
    _$SurveillanceTypeStatusEnumSerializer();

class _$SurveillanceTypeStatusEnumSerializer
    implements PrimitiveSerializer<SurveillanceTypeStatusEnum> {
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
  final Iterable<Type> types = const <Type>[SurveillanceTypeStatusEnum];
  @override
  final String wireName = 'SurveillanceTypeStatusEnum';

  @override
  Object serialize(Serializers serializers, SurveillanceTypeStatusEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  SurveillanceTypeStatusEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      SurveillanceTypeStatusEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$SurveillanceType extends SurveillanceType {
  @override
  final String id;
  @override
  final String name;
  @override
  final SurveillanceTypeStatusEnum status;
  @override
  final DateTime createdAt;
  @override
  final DateTime updatedAt;

  factory _$SurveillanceType(
          [void Function(SurveillanceTypeBuilder)? updates]) =>
      (SurveillanceTypeBuilder()..update(updates))._build();

  _$SurveillanceType._(
      {required this.id,
      required this.name,
      required this.status,
      required this.createdAt,
      required this.updatedAt})
      : super._();
  @override
  SurveillanceType rebuild(void Function(SurveillanceTypeBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  SurveillanceTypeBuilder toBuilder() =>
      SurveillanceTypeBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is SurveillanceType &&
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
    return (newBuiltValueToStringHelper(r'SurveillanceType')
          ..add('id', id)
          ..add('name', name)
          ..add('status', status)
          ..add('createdAt', createdAt)
          ..add('updatedAt', updatedAt))
        .toString();
  }
}

class SurveillanceTypeBuilder
    implements Builder<SurveillanceType, SurveillanceTypeBuilder> {
  _$SurveillanceType? _$v;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  SurveillanceTypeStatusEnum? _status;
  SurveillanceTypeStatusEnum? get status => _$this._status;
  set status(SurveillanceTypeStatusEnum? status) => _$this._status = status;

  DateTime? _createdAt;
  DateTime? get createdAt => _$this._createdAt;
  set createdAt(DateTime? createdAt) => _$this._createdAt = createdAt;

  DateTime? _updatedAt;
  DateTime? get updatedAt => _$this._updatedAt;
  set updatedAt(DateTime? updatedAt) => _$this._updatedAt = updatedAt;

  SurveillanceTypeBuilder() {
    SurveillanceType._defaults(this);
  }

  SurveillanceTypeBuilder get _$this {
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
  void replace(SurveillanceType other) {
    _$v = other as _$SurveillanceType;
  }

  @override
  void update(void Function(SurveillanceTypeBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  SurveillanceType build() => _build();

  _$SurveillanceType _build() {
    final _$result = _$v ??
        _$SurveillanceType._(
          id: BuiltValueNullFieldError.checkNotNull(
              id, r'SurveillanceType', 'id'),
          name: BuiltValueNullFieldError.checkNotNull(
              name, r'SurveillanceType', 'name'),
          status: BuiltValueNullFieldError.checkNotNull(
              status, r'SurveillanceType', 'status'),
          createdAt: BuiltValueNullFieldError.checkNotNull(
              createdAt, r'SurveillanceType', 'createdAt'),
          updatedAt: BuiltValueNullFieldError.checkNotNull(
              updatedAt, r'SurveillanceType', 'updatedAt'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
