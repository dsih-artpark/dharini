// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'role_response_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const RoleResponseDataStatusEnum _$roleResponseDataStatusEnum_active =
    const RoleResponseDataStatusEnum._('active');
const RoleResponseDataStatusEnum _$roleResponseDataStatusEnum_inactive =
    const RoleResponseDataStatusEnum._('inactive');
const RoleResponseDataStatusEnum _$roleResponseDataStatusEnum_deleted =
    const RoleResponseDataStatusEnum._('deleted');
const RoleResponseDataStatusEnum
    _$roleResponseDataStatusEnum_unknownDefaultOpenApi =
    const RoleResponseDataStatusEnum._('unknownDefaultOpenApi');

RoleResponseDataStatusEnum _$roleResponseDataStatusEnumValueOf(String name) {
  switch (name) {
    case 'active':
      return _$roleResponseDataStatusEnum_active;
    case 'inactive':
      return _$roleResponseDataStatusEnum_inactive;
    case 'deleted':
      return _$roleResponseDataStatusEnum_deleted;
    case 'unknownDefaultOpenApi':
      return _$roleResponseDataStatusEnum_unknownDefaultOpenApi;
    default:
      return _$roleResponseDataStatusEnum_unknownDefaultOpenApi;
  }
}

final BuiltSet<RoleResponseDataStatusEnum> _$roleResponseDataStatusEnumValues =
    BuiltSet<RoleResponseDataStatusEnum>(const <RoleResponseDataStatusEnum>[
  _$roleResponseDataStatusEnum_active,
  _$roleResponseDataStatusEnum_inactive,
  _$roleResponseDataStatusEnum_deleted,
  _$roleResponseDataStatusEnum_unknownDefaultOpenApi,
]);

Serializer<RoleResponseDataStatusEnum> _$roleResponseDataStatusEnumSerializer =
    _$RoleResponseDataStatusEnumSerializer();

class _$RoleResponseDataStatusEnumSerializer
    implements PrimitiveSerializer<RoleResponseDataStatusEnum> {
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
  final Iterable<Type> types = const <Type>[RoleResponseDataStatusEnum];
  @override
  final String wireName = 'RoleResponseDataStatusEnum';

  @override
  Object serialize(Serializers serializers, RoleResponseDataStatusEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  RoleResponseDataStatusEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      RoleResponseDataStatusEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$RoleResponseData extends RoleResponseData {
  @override
  final String id;
  @override
  final String name;
  @override
  final String scope;
  @override
  final String type;
  @override
  final RoleResponseDataStatusEnum status;
  @override
  final DateTime createdAt;
  @override
  final DateTime updatedAt;

  factory _$RoleResponseData(
          [void Function(RoleResponseDataBuilder)? updates]) =>
      (RoleResponseDataBuilder()..update(updates))._build();

  _$RoleResponseData._(
      {required this.id,
      required this.name,
      required this.scope,
      required this.type,
      required this.status,
      required this.createdAt,
      required this.updatedAt})
      : super._();
  @override
  RoleResponseData rebuild(void Function(RoleResponseDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  RoleResponseDataBuilder toBuilder() =>
      RoleResponseDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is RoleResponseData &&
        id == other.id &&
        name == other.name &&
        scope == other.scope &&
        type == other.type &&
        status == other.status &&
        createdAt == other.createdAt &&
        updatedAt == other.updatedAt;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, name.hashCode);
    _$hash = $jc(_$hash, scope.hashCode);
    _$hash = $jc(_$hash, type.hashCode);
    _$hash = $jc(_$hash, status.hashCode);
    _$hash = $jc(_$hash, createdAt.hashCode);
    _$hash = $jc(_$hash, updatedAt.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'RoleResponseData')
          ..add('id', id)
          ..add('name', name)
          ..add('scope', scope)
          ..add('type', type)
          ..add('status', status)
          ..add('createdAt', createdAt)
          ..add('updatedAt', updatedAt))
        .toString();
  }
}

class RoleResponseDataBuilder
    implements Builder<RoleResponseData, RoleResponseDataBuilder> {
  _$RoleResponseData? _$v;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  String? _scope;
  String? get scope => _$this._scope;
  set scope(String? scope) => _$this._scope = scope;

  String? _type;
  String? get type => _$this._type;
  set type(String? type) => _$this._type = type;

  RoleResponseDataStatusEnum? _status;
  RoleResponseDataStatusEnum? get status => _$this._status;
  set status(RoleResponseDataStatusEnum? status) => _$this._status = status;

  DateTime? _createdAt;
  DateTime? get createdAt => _$this._createdAt;
  set createdAt(DateTime? createdAt) => _$this._createdAt = createdAt;

  DateTime? _updatedAt;
  DateTime? get updatedAt => _$this._updatedAt;
  set updatedAt(DateTime? updatedAt) => _$this._updatedAt = updatedAt;

  RoleResponseDataBuilder() {
    RoleResponseData._defaults(this);
  }

  RoleResponseDataBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _name = $v.name;
      _scope = $v.scope;
      _type = $v.type;
      _status = $v.status;
      _createdAt = $v.createdAt;
      _updatedAt = $v.updatedAt;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(RoleResponseData other) {
    _$v = other as _$RoleResponseData;
  }

  @override
  void update(void Function(RoleResponseDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  RoleResponseData build() => _build();

  _$RoleResponseData _build() {
    final _$result = _$v ??
        _$RoleResponseData._(
          id: BuiltValueNullFieldError.checkNotNull(
              id, r'RoleResponseData', 'id'),
          name: BuiltValueNullFieldError.checkNotNull(
              name, r'RoleResponseData', 'name'),
          scope: BuiltValueNullFieldError.checkNotNull(
              scope, r'RoleResponseData', 'scope'),
          type: BuiltValueNullFieldError.checkNotNull(
              type, r'RoleResponseData', 'type'),
          status: BuiltValueNullFieldError.checkNotNull(
              status, r'RoleResponseData', 'status'),
          createdAt: BuiltValueNullFieldError.checkNotNull(
              createdAt, r'RoleResponseData', 'createdAt'),
          updatedAt: BuiltValueNullFieldError.checkNotNull(
              updatedAt, r'RoleResponseData', 'updatedAt'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
