// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'role_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const RoleResponseStatusEnum _$roleResponseStatusEnum_active =
    const RoleResponseStatusEnum._('active');
const RoleResponseStatusEnum _$roleResponseStatusEnum_inactive =
    const RoleResponseStatusEnum._('inactive');
const RoleResponseStatusEnum _$roleResponseStatusEnum_deleted =
    const RoleResponseStatusEnum._('deleted');
const RoleResponseStatusEnum _$roleResponseStatusEnum_unknownDefaultOpenApi =
    const RoleResponseStatusEnum._('unknownDefaultOpenApi');

RoleResponseStatusEnum _$roleResponseStatusEnumValueOf(String name) {
  switch (name) {
    case 'active':
      return _$roleResponseStatusEnum_active;
    case 'inactive':
      return _$roleResponseStatusEnum_inactive;
    case 'deleted':
      return _$roleResponseStatusEnum_deleted;
    case 'unknownDefaultOpenApi':
      return _$roleResponseStatusEnum_unknownDefaultOpenApi;
    default:
      return _$roleResponseStatusEnum_unknownDefaultOpenApi;
  }
}

final BuiltSet<RoleResponseStatusEnum> _$roleResponseStatusEnumValues =
    BuiltSet<RoleResponseStatusEnum>(const <RoleResponseStatusEnum>[
  _$roleResponseStatusEnum_active,
  _$roleResponseStatusEnum_inactive,
  _$roleResponseStatusEnum_deleted,
  _$roleResponseStatusEnum_unknownDefaultOpenApi,
]);

Serializer<RoleResponseStatusEnum> _$roleResponseStatusEnumSerializer =
    _$RoleResponseStatusEnumSerializer();

class _$RoleResponseStatusEnumSerializer
    implements PrimitiveSerializer<RoleResponseStatusEnum> {
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
  final Iterable<Type> types = const <Type>[RoleResponseStatusEnum];
  @override
  final String wireName = 'RoleResponseStatusEnum';

  @override
  Object serialize(Serializers serializers, RoleResponseStatusEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  RoleResponseStatusEnum deserialize(Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      RoleResponseStatusEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$RoleResponse extends RoleResponse {
  @override
  final String id;
  @override
  final String name;
  @override
  final String scope;
  @override
  final String type;
  @override
  final RoleResponseStatusEnum status;
  @override
  final DateTime createdAt;
  @override
  final DateTime updatedAt;

  factory _$RoleResponse([void Function(RoleResponseBuilder)? updates]) =>
      (RoleResponseBuilder()..update(updates))._build();

  _$RoleResponse._(
      {required this.id,
      required this.name,
      required this.scope,
      required this.type,
      required this.status,
      required this.createdAt,
      required this.updatedAt})
      : super._();
  @override
  RoleResponse rebuild(void Function(RoleResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  RoleResponseBuilder toBuilder() => RoleResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is RoleResponse &&
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
    return (newBuiltValueToStringHelper(r'RoleResponse')
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

class RoleResponseBuilder
    implements Builder<RoleResponse, RoleResponseBuilder> {
  _$RoleResponse? _$v;

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

  RoleResponseStatusEnum? _status;
  RoleResponseStatusEnum? get status => _$this._status;
  set status(RoleResponseStatusEnum? status) => _$this._status = status;

  DateTime? _createdAt;
  DateTime? get createdAt => _$this._createdAt;
  set createdAt(DateTime? createdAt) => _$this._createdAt = createdAt;

  DateTime? _updatedAt;
  DateTime? get updatedAt => _$this._updatedAt;
  set updatedAt(DateTime? updatedAt) => _$this._updatedAt = updatedAt;

  RoleResponseBuilder() {
    RoleResponse._defaults(this);
  }

  RoleResponseBuilder get _$this {
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
  void replace(RoleResponse other) {
    _$v = other as _$RoleResponse;
  }

  @override
  void update(void Function(RoleResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  RoleResponse build() => _build();

  _$RoleResponse _build() {
    final _$result = _$v ??
        _$RoleResponse._(
          id: BuiltValueNullFieldError.checkNotNull(id, r'RoleResponse', 'id'),
          name: BuiltValueNullFieldError.checkNotNull(
              name, r'RoleResponse', 'name'),
          scope: BuiltValueNullFieldError.checkNotNull(
              scope, r'RoleResponse', 'scope'),
          type: BuiltValueNullFieldError.checkNotNull(
              type, r'RoleResponse', 'type'),
          status: BuiltValueNullFieldError.checkNotNull(
              status, r'RoleResponse', 'status'),
          createdAt: BuiltValueNullFieldError.checkNotNull(
              createdAt, r'RoleResponse', 'createdAt'),
          updatedAt: BuiltValueNullFieldError.checkNotNull(
              updatedAt, r'RoleResponse', 'updatedAt'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
