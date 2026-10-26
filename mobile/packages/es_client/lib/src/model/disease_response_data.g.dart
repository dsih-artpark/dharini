// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'disease_response_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const DiseaseResponseDataStatusEnum _$diseaseResponseDataStatusEnum_active =
    const DiseaseResponseDataStatusEnum._('active');
const DiseaseResponseDataStatusEnum _$diseaseResponseDataStatusEnum_inactive =
    const DiseaseResponseDataStatusEnum._('inactive');
const DiseaseResponseDataStatusEnum _$diseaseResponseDataStatusEnum_deleted =
    const DiseaseResponseDataStatusEnum._('deleted');
const DiseaseResponseDataStatusEnum
    _$diseaseResponseDataStatusEnum_unknownDefaultOpenApi =
    const DiseaseResponseDataStatusEnum._('unknownDefaultOpenApi');

DiseaseResponseDataStatusEnum _$diseaseResponseDataStatusEnumValueOf(
    String name) {
  switch (name) {
    case 'active':
      return _$diseaseResponseDataStatusEnum_active;
    case 'inactive':
      return _$diseaseResponseDataStatusEnum_inactive;
    case 'deleted':
      return _$diseaseResponseDataStatusEnum_deleted;
    case 'unknownDefaultOpenApi':
      return _$diseaseResponseDataStatusEnum_unknownDefaultOpenApi;
    default:
      return _$diseaseResponseDataStatusEnum_unknownDefaultOpenApi;
  }
}

final BuiltSet<DiseaseResponseDataStatusEnum>
    _$diseaseResponseDataStatusEnumValues = BuiltSet<
        DiseaseResponseDataStatusEnum>(const <DiseaseResponseDataStatusEnum>[
  _$diseaseResponseDataStatusEnum_active,
  _$diseaseResponseDataStatusEnum_inactive,
  _$diseaseResponseDataStatusEnum_deleted,
  _$diseaseResponseDataStatusEnum_unknownDefaultOpenApi,
]);

Serializer<DiseaseResponseDataStatusEnum>
    _$diseaseResponseDataStatusEnumSerializer =
    _$DiseaseResponseDataStatusEnumSerializer();

class _$DiseaseResponseDataStatusEnumSerializer
    implements PrimitiveSerializer<DiseaseResponseDataStatusEnum> {
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
  final Iterable<Type> types = const <Type>[DiseaseResponseDataStatusEnum];
  @override
  final String wireName = 'DiseaseResponseDataStatusEnum';

  @override
  Object serialize(
          Serializers serializers, DiseaseResponseDataStatusEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  DiseaseResponseDataStatusEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      DiseaseResponseDataStatusEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$DiseaseResponseData extends DiseaseResponseData {
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
  final DiseaseResponseDataStatusEnum? status;

  factory _$DiseaseResponseData(
          [void Function(DiseaseResponseDataBuilder)? updates]) =>
      (DiseaseResponseDataBuilder()..update(updates))._build();

  _$DiseaseResponseData._(
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
  DiseaseResponseData rebuild(
          void Function(DiseaseResponseDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  DiseaseResponseDataBuilder toBuilder() =>
      DiseaseResponseDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is DiseaseResponseData &&
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
    return (newBuiltValueToStringHelper(r'DiseaseResponseData')
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

class DiseaseResponseDataBuilder
    implements Builder<DiseaseResponseData, DiseaseResponseDataBuilder> {
  _$DiseaseResponseData? _$v;

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

  DiseaseResponseDataStatusEnum? _status;
  DiseaseResponseDataStatusEnum? get status => _$this._status;
  set status(DiseaseResponseDataStatusEnum? status) => _$this._status = status;

  DiseaseResponseDataBuilder() {
    DiseaseResponseData._defaults(this);
  }

  DiseaseResponseDataBuilder get _$this {
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
  void replace(DiseaseResponseData other) {
    _$v = other as _$DiseaseResponseData;
  }

  @override
  void update(void Function(DiseaseResponseDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  DiseaseResponseData build() => _build();

  _$DiseaseResponseData _build() {
    final _$result = _$v ??
        _$DiseaseResponseData._(
          id: BuiltValueNullFieldError.checkNotNull(
              id, r'DiseaseResponseData', 'id'),
          code: BuiltValueNullFieldError.checkNotNull(
              code, r'DiseaseResponseData', 'code'),
          name: BuiltValueNullFieldError.checkNotNull(
              name, r'DiseaseResponseData', 'name'),
          shortName: BuiltValueNullFieldError.checkNotNull(
              shortName, r'DiseaseResponseData', 'shortName'),
          index: BuiltValueNullFieldError.checkNotNull(
              index, r'DiseaseResponseData', 'index'),
          createdAt: BuiltValueNullFieldError.checkNotNull(
              createdAt, r'DiseaseResponseData', 'createdAt'),
          updatedAt: BuiltValueNullFieldError.checkNotNull(
              updatedAt, r'DiseaseResponseData', 'updatedAt'),
          status: status,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
