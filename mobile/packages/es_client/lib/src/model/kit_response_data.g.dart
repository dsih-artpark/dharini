// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'kit_response_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const KitResponseDataStatusEnum _$kitResponseDataStatusEnum_active =
    const KitResponseDataStatusEnum._('active');
const KitResponseDataStatusEnum _$kitResponseDataStatusEnum_inactive =
    const KitResponseDataStatusEnum._('inactive');
const KitResponseDataStatusEnum _$kitResponseDataStatusEnum_deleted =
    const KitResponseDataStatusEnum._('deleted');
const KitResponseDataStatusEnum
    _$kitResponseDataStatusEnum_unknownDefaultOpenApi =
    const KitResponseDataStatusEnum._('unknownDefaultOpenApi');

KitResponseDataStatusEnum _$kitResponseDataStatusEnumValueOf(String name) {
  switch (name) {
    case 'active':
      return _$kitResponseDataStatusEnum_active;
    case 'inactive':
      return _$kitResponseDataStatusEnum_inactive;
    case 'deleted':
      return _$kitResponseDataStatusEnum_deleted;
    case 'unknownDefaultOpenApi':
      return _$kitResponseDataStatusEnum_unknownDefaultOpenApi;
    default:
      return _$kitResponseDataStatusEnum_unknownDefaultOpenApi;
  }
}

final BuiltSet<KitResponseDataStatusEnum> _$kitResponseDataStatusEnumValues =
    BuiltSet<KitResponseDataStatusEnum>(const <KitResponseDataStatusEnum>[
  _$kitResponseDataStatusEnum_active,
  _$kitResponseDataStatusEnum_inactive,
  _$kitResponseDataStatusEnum_deleted,
  _$kitResponseDataStatusEnum_unknownDefaultOpenApi,
]);

Serializer<KitResponseDataStatusEnum> _$kitResponseDataStatusEnumSerializer =
    _$KitResponseDataStatusEnumSerializer();

class _$KitResponseDataStatusEnumSerializer
    implements PrimitiveSerializer<KitResponseDataStatusEnum> {
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
  final Iterable<Type> types = const <Type>[KitResponseDataStatusEnum];
  @override
  final String wireName = 'KitResponseDataStatusEnum';

  @override
  Object serialize(Serializers serializers, KitResponseDataStatusEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  KitResponseDataStatusEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      KitResponseDataStatusEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$KitResponseData extends KitResponseData {
  @override
  final String id;
  @override
  final String name;
  @override
  final KitResponseDataStatusEnum status;
  @override
  final DateTime createdAt;
  @override
  final DateTime updatedAt;

  factory _$KitResponseData([void Function(KitResponseDataBuilder)? updates]) =>
      (KitResponseDataBuilder()..update(updates))._build();

  _$KitResponseData._(
      {required this.id,
      required this.name,
      required this.status,
      required this.createdAt,
      required this.updatedAt})
      : super._();
  @override
  KitResponseData rebuild(void Function(KitResponseDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  KitResponseDataBuilder toBuilder() => KitResponseDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is KitResponseData &&
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
    return (newBuiltValueToStringHelper(r'KitResponseData')
          ..add('id', id)
          ..add('name', name)
          ..add('status', status)
          ..add('createdAt', createdAt)
          ..add('updatedAt', updatedAt))
        .toString();
  }
}

class KitResponseDataBuilder
    implements Builder<KitResponseData, KitResponseDataBuilder> {
  _$KitResponseData? _$v;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  KitResponseDataStatusEnum? _status;
  KitResponseDataStatusEnum? get status => _$this._status;
  set status(KitResponseDataStatusEnum? status) => _$this._status = status;

  DateTime? _createdAt;
  DateTime? get createdAt => _$this._createdAt;
  set createdAt(DateTime? createdAt) => _$this._createdAt = createdAt;

  DateTime? _updatedAt;
  DateTime? get updatedAt => _$this._updatedAt;
  set updatedAt(DateTime? updatedAt) => _$this._updatedAt = updatedAt;

  KitResponseDataBuilder() {
    KitResponseData._defaults(this);
  }

  KitResponseDataBuilder get _$this {
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
  void replace(KitResponseData other) {
    _$v = other as _$KitResponseData;
  }

  @override
  void update(void Function(KitResponseDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  KitResponseData build() => _build();

  _$KitResponseData _build() {
    final _$result = _$v ??
        _$KitResponseData._(
          id: BuiltValueNullFieldError.checkNotNull(
              id, r'KitResponseData', 'id'),
          name: BuiltValueNullFieldError.checkNotNull(
              name, r'KitResponseData', 'name'),
          status: BuiltValueNullFieldError.checkNotNull(
              status, r'KitResponseData', 'status'),
          createdAt: BuiltValueNullFieldError.checkNotNull(
              createdAt, r'KitResponseData', 'createdAt'),
          updatedAt: BuiltValueNullFieldError.checkNotNull(
              updatedAt, r'KitResponseData', 'updatedAt'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
