// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'disease.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const DiseaseStatusEnum _$diseaseStatusEnum_active =
    const DiseaseStatusEnum._('active');
const DiseaseStatusEnum _$diseaseStatusEnum_inactive =
    const DiseaseStatusEnum._('inactive');
const DiseaseStatusEnum _$diseaseStatusEnum_deleted =
    const DiseaseStatusEnum._('deleted');
const DiseaseStatusEnum _$diseaseStatusEnum_unknownDefaultOpenApi =
    const DiseaseStatusEnum._('unknownDefaultOpenApi');

DiseaseStatusEnum _$diseaseStatusEnumValueOf(String name) {
  switch (name) {
    case 'active':
      return _$diseaseStatusEnum_active;
    case 'inactive':
      return _$diseaseStatusEnum_inactive;
    case 'deleted':
      return _$diseaseStatusEnum_deleted;
    case 'unknownDefaultOpenApi':
      return _$diseaseStatusEnum_unknownDefaultOpenApi;
    default:
      return _$diseaseStatusEnum_unknownDefaultOpenApi;
  }
}

final BuiltSet<DiseaseStatusEnum> _$diseaseStatusEnumValues =
    BuiltSet<DiseaseStatusEnum>(const <DiseaseStatusEnum>[
  _$diseaseStatusEnum_active,
  _$diseaseStatusEnum_inactive,
  _$diseaseStatusEnum_deleted,
  _$diseaseStatusEnum_unknownDefaultOpenApi,
]);

Serializer<DiseaseStatusEnum> _$diseaseStatusEnumSerializer =
    _$DiseaseStatusEnumSerializer();

class _$DiseaseStatusEnumSerializer
    implements PrimitiveSerializer<DiseaseStatusEnum> {
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
  final Iterable<Type> types = const <Type>[DiseaseStatusEnum];
  @override
  final String wireName = 'DiseaseStatusEnum';

  @override
  Object serialize(Serializers serializers, DiseaseStatusEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  DiseaseStatusEnum deserialize(Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      DiseaseStatusEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$Disease extends Disease {
  @override
  final String id;
  @override
  final String code;
  @override
  final String name;
  @override
  final String shortName;
  @override
  final num index;
  @override
  final DateTime createdAt;
  @override
  final DateTime updatedAt;
  @override
  final DiseaseStatusEnum? status;

  factory _$Disease([void Function(DiseaseBuilder)? updates]) =>
      (DiseaseBuilder()..update(updates))._build();

  _$Disease._(
      {required this.id,
      required this.code,
      required this.name,
      required this.shortName,
      required this.index,
      required this.createdAt,
      required this.updatedAt,
      this.status})
      : super._();
  @override
  Disease rebuild(void Function(DiseaseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  DiseaseBuilder toBuilder() => DiseaseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is Disease &&
        id == other.id &&
        code == other.code &&
        name == other.name &&
        shortName == other.shortName &&
        index == other.index &&
        createdAt == other.createdAt &&
        updatedAt == other.updatedAt &&
        status == other.status;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, code.hashCode);
    _$hash = $jc(_$hash, name.hashCode);
    _$hash = $jc(_$hash, shortName.hashCode);
    _$hash = $jc(_$hash, index.hashCode);
    _$hash = $jc(_$hash, createdAt.hashCode);
    _$hash = $jc(_$hash, updatedAt.hashCode);
    _$hash = $jc(_$hash, status.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'Disease')
          ..add('id', id)
          ..add('code', code)
          ..add('name', name)
          ..add('shortName', shortName)
          ..add('index', index)
          ..add('createdAt', createdAt)
          ..add('updatedAt', updatedAt)
          ..add('status', status))
        .toString();
  }
}

class DiseaseBuilder implements Builder<Disease, DiseaseBuilder> {
  _$Disease? _$v;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  String? _code;
  String? get code => _$this._code;
  set code(String? code) => _$this._code = code;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  String? _shortName;
  String? get shortName => _$this._shortName;
  set shortName(String? shortName) => _$this._shortName = shortName;

  num? _index;
  num? get index => _$this._index;
  set index(num? index) => _$this._index = index;

  DateTime? _createdAt;
  DateTime? get createdAt => _$this._createdAt;
  set createdAt(DateTime? createdAt) => _$this._createdAt = createdAt;

  DateTime? _updatedAt;
  DateTime? get updatedAt => _$this._updatedAt;
  set updatedAt(DateTime? updatedAt) => _$this._updatedAt = updatedAt;

  DiseaseStatusEnum? _status;
  DiseaseStatusEnum? get status => _$this._status;
  set status(DiseaseStatusEnum? status) => _$this._status = status;

  DiseaseBuilder() {
    Disease._defaults(this);
  }

  DiseaseBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _code = $v.code;
      _name = $v.name;
      _shortName = $v.shortName;
      _index = $v.index;
      _createdAt = $v.createdAt;
      _updatedAt = $v.updatedAt;
      _status = $v.status;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(Disease other) {
    _$v = other as _$Disease;
  }

  @override
  void update(void Function(DiseaseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  Disease build() => _build();

  _$Disease _build() {
    final _$result = _$v ??
        _$Disease._(
          id: BuiltValueNullFieldError.checkNotNull(id, r'Disease', 'id'),
          code: BuiltValueNullFieldError.checkNotNull(code, r'Disease', 'code'),
          name: BuiltValueNullFieldError.checkNotNull(name, r'Disease', 'name'),
          shortName: BuiltValueNullFieldError.checkNotNull(
              shortName, r'Disease', 'shortName'),
          index:
              BuiltValueNullFieldError.checkNotNull(index, r'Disease', 'index'),
          createdAt: BuiltValueNullFieldError.checkNotNull(
              createdAt, r'Disease', 'createdAt'),
          updatedAt: BuiltValueNullFieldError.checkNotNull(
              updatedAt, r'Disease', 'updatedAt'),
          status: status,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
