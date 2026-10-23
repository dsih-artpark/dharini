// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'sample_type.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const SampleTypeStatusEnum _$sampleTypeStatusEnum_active =
    const SampleTypeStatusEnum._('active');
const SampleTypeStatusEnum _$sampleTypeStatusEnum_inactive =
    const SampleTypeStatusEnum._('inactive');
const SampleTypeStatusEnum _$sampleTypeStatusEnum_deleted =
    const SampleTypeStatusEnum._('deleted');
const SampleTypeStatusEnum _$sampleTypeStatusEnum_unknownDefaultOpenApi =
    const SampleTypeStatusEnum._('unknownDefaultOpenApi');

SampleTypeStatusEnum _$sampleTypeStatusEnumValueOf(String name) {
  switch (name) {
    case 'active':
      return _$sampleTypeStatusEnum_active;
    case 'inactive':
      return _$sampleTypeStatusEnum_inactive;
    case 'deleted':
      return _$sampleTypeStatusEnum_deleted;
    case 'unknownDefaultOpenApi':
      return _$sampleTypeStatusEnum_unknownDefaultOpenApi;
    default:
      return _$sampleTypeStatusEnum_unknownDefaultOpenApi;
  }
}

final BuiltSet<SampleTypeStatusEnum> _$sampleTypeStatusEnumValues =
    BuiltSet<SampleTypeStatusEnum>(const <SampleTypeStatusEnum>[
  _$sampleTypeStatusEnum_active,
  _$sampleTypeStatusEnum_inactive,
  _$sampleTypeStatusEnum_deleted,
  _$sampleTypeStatusEnum_unknownDefaultOpenApi,
]);

Serializer<SampleTypeStatusEnum> _$sampleTypeStatusEnumSerializer =
    _$SampleTypeStatusEnumSerializer();

class _$SampleTypeStatusEnumSerializer
    implements PrimitiveSerializer<SampleTypeStatusEnum> {
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
  final Iterable<Type> types = const <Type>[SampleTypeStatusEnum];
  @override
  final String wireName = 'SampleTypeStatusEnum';

  @override
  Object serialize(Serializers serializers, SampleTypeStatusEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  SampleTypeStatusEnum deserialize(Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      SampleTypeStatusEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$SampleType extends SampleType {
  @override
  final String? emojiIcon;
  @override
  final BuiltList<String>? diseaseShortNames;
  @override
  final SurveillanceType? surveillanceType;
  @override
  final String id;
  @override
  final String name;
  @override
  final SampleTypeStatusEnum status;
  @override
  final DateTime createdAt;
  @override
  final DateTime updatedAt;

  factory _$SampleType([void Function(SampleTypeBuilder)? updates]) =>
      (SampleTypeBuilder()..update(updates))._build();

  _$SampleType._(
      {this.emojiIcon,
      this.diseaseShortNames,
      this.surveillanceType,
      required this.id,
      required this.name,
      required this.status,
      required this.createdAt,
      required this.updatedAt})
      : super._();
  @override
  SampleType rebuild(void Function(SampleTypeBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  SampleTypeBuilder toBuilder() => SampleTypeBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is SampleType &&
        emojiIcon == other.emojiIcon &&
        diseaseShortNames == other.diseaseShortNames &&
        surveillanceType == other.surveillanceType &&
        id == other.id &&
        name == other.name &&
        status == other.status &&
        createdAt == other.createdAt &&
        updatedAt == other.updatedAt;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, emojiIcon.hashCode);
    _$hash = $jc(_$hash, diseaseShortNames.hashCode);
    _$hash = $jc(_$hash, surveillanceType.hashCode);
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
    return (newBuiltValueToStringHelper(r'SampleType')
          ..add('emojiIcon', emojiIcon)
          ..add('diseaseShortNames', diseaseShortNames)
          ..add('surveillanceType', surveillanceType)
          ..add('id', id)
          ..add('name', name)
          ..add('status', status)
          ..add('createdAt', createdAt)
          ..add('updatedAt', updatedAt))
        .toString();
  }
}

class SampleTypeBuilder implements Builder<SampleType, SampleTypeBuilder> {
  _$SampleType? _$v;

  String? _emojiIcon;
  String? get emojiIcon => _$this._emojiIcon;
  set emojiIcon(String? emojiIcon) => _$this._emojiIcon = emojiIcon;

  ListBuilder<String>? _diseaseShortNames;
  ListBuilder<String> get diseaseShortNames =>
      _$this._diseaseShortNames ??= ListBuilder<String>();
  set diseaseShortNames(ListBuilder<String>? diseaseShortNames) =>
      _$this._diseaseShortNames = diseaseShortNames;

  SurveillanceTypeBuilder? _surveillanceType;
  SurveillanceTypeBuilder get surveillanceType =>
      _$this._surveillanceType ??= SurveillanceTypeBuilder();
  set surveillanceType(SurveillanceTypeBuilder? surveillanceType) =>
      _$this._surveillanceType = surveillanceType;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  SampleTypeStatusEnum? _status;
  SampleTypeStatusEnum? get status => _$this._status;
  set status(SampleTypeStatusEnum? status) => _$this._status = status;

  DateTime? _createdAt;
  DateTime? get createdAt => _$this._createdAt;
  set createdAt(DateTime? createdAt) => _$this._createdAt = createdAt;

  DateTime? _updatedAt;
  DateTime? get updatedAt => _$this._updatedAt;
  set updatedAt(DateTime? updatedAt) => _$this._updatedAt = updatedAt;

  SampleTypeBuilder() {
    SampleType._defaults(this);
  }

  SampleTypeBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _emojiIcon = $v.emojiIcon;
      _diseaseShortNames = $v.diseaseShortNames?.toBuilder();
      _surveillanceType = $v.surveillanceType?.toBuilder();
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
  void replace(SampleType other) {
    _$v = other as _$SampleType;
  }

  @override
  void update(void Function(SampleTypeBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  SampleType build() => _build();

  _$SampleType _build() {
    _$SampleType _$result;
    try {
      _$result = _$v ??
          _$SampleType._(
            emojiIcon: emojiIcon,
            diseaseShortNames: _diseaseShortNames?.build(),
            surveillanceType: _surveillanceType?.build(),
            id: BuiltValueNullFieldError.checkNotNull(id, r'SampleType', 'id'),
            name: BuiltValueNullFieldError.checkNotNull(
                name, r'SampleType', 'name'),
            status: BuiltValueNullFieldError.checkNotNull(
                status, r'SampleType', 'status'),
            createdAt: BuiltValueNullFieldError.checkNotNull(
                createdAt, r'SampleType', 'createdAt'),
            updatedAt: BuiltValueNullFieldError.checkNotNull(
                updatedAt, r'SampleType', 'updatedAt'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'diseaseShortNames';
        _diseaseShortNames?.build();
        _$failedField = 'surveillanceType';
        _surveillanceType?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'SampleType', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
