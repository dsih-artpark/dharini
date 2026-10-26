// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'sample_type_response_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const SampleTypeResponseDataStatusEnum
    _$sampleTypeResponseDataStatusEnum_active =
    const SampleTypeResponseDataStatusEnum._('active');
const SampleTypeResponseDataStatusEnum
    _$sampleTypeResponseDataStatusEnum_inactive =
    const SampleTypeResponseDataStatusEnum._('inactive');
const SampleTypeResponseDataStatusEnum
    _$sampleTypeResponseDataStatusEnum_deleted =
    const SampleTypeResponseDataStatusEnum._('deleted');
const SampleTypeResponseDataStatusEnum
    _$sampleTypeResponseDataStatusEnum_unknownDefaultOpenApi =
    const SampleTypeResponseDataStatusEnum._('unknownDefaultOpenApi');

SampleTypeResponseDataStatusEnum _$sampleTypeResponseDataStatusEnumValueOf(
    String name) {
  switch (name) {
    case 'active':
      return _$sampleTypeResponseDataStatusEnum_active;
    case 'inactive':
      return _$sampleTypeResponseDataStatusEnum_inactive;
    case 'deleted':
      return _$sampleTypeResponseDataStatusEnum_deleted;
    case 'unknownDefaultOpenApi':
      return _$sampleTypeResponseDataStatusEnum_unknownDefaultOpenApi;
    default:
      return _$sampleTypeResponseDataStatusEnum_unknownDefaultOpenApi;
  }
}

final BuiltSet<SampleTypeResponseDataStatusEnum>
    _$sampleTypeResponseDataStatusEnumValues = BuiltSet<
        SampleTypeResponseDataStatusEnum>(const <SampleTypeResponseDataStatusEnum>[
  _$sampleTypeResponseDataStatusEnum_active,
  _$sampleTypeResponseDataStatusEnum_inactive,
  _$sampleTypeResponseDataStatusEnum_deleted,
  _$sampleTypeResponseDataStatusEnum_unknownDefaultOpenApi,
]);

Serializer<SampleTypeResponseDataStatusEnum>
    _$sampleTypeResponseDataStatusEnumSerializer =
    _$SampleTypeResponseDataStatusEnumSerializer();

class _$SampleTypeResponseDataStatusEnumSerializer
    implements PrimitiveSerializer<SampleTypeResponseDataStatusEnum> {
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
  final Iterable<Type> types = const <Type>[SampleTypeResponseDataStatusEnum];
  @override
  final String wireName = 'SampleTypeResponseDataStatusEnum';

  @override
  Object serialize(
          Serializers serializers, SampleTypeResponseDataStatusEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  SampleTypeResponseDataStatusEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      SampleTypeResponseDataStatusEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$SampleTypeResponseData extends SampleTypeResponseData {
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
  final SampleTypeResponseDataStatusEnum status;
  @override
  final DateTime createdAt;
  @override
  final DateTime updatedAt;

  factory _$SampleTypeResponseData(
          [void Function(SampleTypeResponseDataBuilder)? updates]) =>
      (SampleTypeResponseDataBuilder()..update(updates))._build();

  _$SampleTypeResponseData._(
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
  SampleTypeResponseData rebuild(
          void Function(SampleTypeResponseDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  SampleTypeResponseDataBuilder toBuilder() =>
      SampleTypeResponseDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is SampleTypeResponseData &&
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
    return (newBuiltValueToStringHelper(r'SampleTypeResponseData')
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

class SampleTypeResponseDataBuilder
    implements Builder<SampleTypeResponseData, SampleTypeResponseDataBuilder> {
  _$SampleTypeResponseData? _$v;

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

  SampleTypeResponseDataStatusEnum? _status;
  SampleTypeResponseDataStatusEnum? get status => _$this._status;
  set status(SampleTypeResponseDataStatusEnum? status) =>
      _$this._status = status;

  DateTime? _createdAt;
  DateTime? get createdAt => _$this._createdAt;
  set createdAt(DateTime? createdAt) => _$this._createdAt = createdAt;

  DateTime? _updatedAt;
  DateTime? get updatedAt => _$this._updatedAt;
  set updatedAt(DateTime? updatedAt) => _$this._updatedAt = updatedAt;

  SampleTypeResponseDataBuilder() {
    SampleTypeResponseData._defaults(this);
  }

  SampleTypeResponseDataBuilder get _$this {
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
  void replace(SampleTypeResponseData other) {
    _$v = other as _$SampleTypeResponseData;
  }

  @override
  void update(void Function(SampleTypeResponseDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  SampleTypeResponseData build() => _build();

  _$SampleTypeResponseData _build() {
    _$SampleTypeResponseData _$result;
    try {
      _$result = _$v ??
          _$SampleTypeResponseData._(
            emojiIcon: emojiIcon,
            diseaseShortNames: _diseaseShortNames?.build(),
            surveillanceType: _surveillanceType?.build(),
            id: BuiltValueNullFieldError.checkNotNull(
                id, r'SampleTypeResponseData', 'id'),
            name: BuiltValueNullFieldError.checkNotNull(
                name, r'SampleTypeResponseData', 'name'),
            status: BuiltValueNullFieldError.checkNotNull(
                status, r'SampleTypeResponseData', 'status'),
            createdAt: BuiltValueNullFieldError.checkNotNull(
                createdAt, r'SampleTypeResponseData', 'createdAt'),
            updatedAt: BuiltValueNullFieldError.checkNotNull(
                updatedAt, r'SampleTypeResponseData', 'updatedAt'),
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
            r'SampleTypeResponseData', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
