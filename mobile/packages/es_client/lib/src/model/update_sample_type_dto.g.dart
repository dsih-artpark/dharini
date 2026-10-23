// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_sample_type_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const UpdateSampleTypeDtoStatusEnum _$updateSampleTypeDtoStatusEnum_active =
    const UpdateSampleTypeDtoStatusEnum._('active');
const UpdateSampleTypeDtoStatusEnum _$updateSampleTypeDtoStatusEnum_inactive =
    const UpdateSampleTypeDtoStatusEnum._('inactive');
const UpdateSampleTypeDtoStatusEnum _$updateSampleTypeDtoStatusEnum_deleted =
    const UpdateSampleTypeDtoStatusEnum._('deleted');
const UpdateSampleTypeDtoStatusEnum
    _$updateSampleTypeDtoStatusEnum_unknownDefaultOpenApi =
    const UpdateSampleTypeDtoStatusEnum._('unknownDefaultOpenApi');

UpdateSampleTypeDtoStatusEnum _$updateSampleTypeDtoStatusEnumValueOf(
    String name) {
  switch (name) {
    case 'active':
      return _$updateSampleTypeDtoStatusEnum_active;
    case 'inactive':
      return _$updateSampleTypeDtoStatusEnum_inactive;
    case 'deleted':
      return _$updateSampleTypeDtoStatusEnum_deleted;
    case 'unknownDefaultOpenApi':
      return _$updateSampleTypeDtoStatusEnum_unknownDefaultOpenApi;
    default:
      return _$updateSampleTypeDtoStatusEnum_unknownDefaultOpenApi;
  }
}

final BuiltSet<UpdateSampleTypeDtoStatusEnum>
    _$updateSampleTypeDtoStatusEnumValues = BuiltSet<
        UpdateSampleTypeDtoStatusEnum>(const <UpdateSampleTypeDtoStatusEnum>[
  _$updateSampleTypeDtoStatusEnum_active,
  _$updateSampleTypeDtoStatusEnum_inactive,
  _$updateSampleTypeDtoStatusEnum_deleted,
  _$updateSampleTypeDtoStatusEnum_unknownDefaultOpenApi,
]);

Serializer<UpdateSampleTypeDtoStatusEnum>
    _$updateSampleTypeDtoStatusEnumSerializer =
    _$UpdateSampleTypeDtoStatusEnumSerializer();

class _$UpdateSampleTypeDtoStatusEnumSerializer
    implements PrimitiveSerializer<UpdateSampleTypeDtoStatusEnum> {
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
  final Iterable<Type> types = const <Type>[UpdateSampleTypeDtoStatusEnum];
  @override
  final String wireName = 'UpdateSampleTypeDtoStatusEnum';

  @override
  Object serialize(
          Serializers serializers, UpdateSampleTypeDtoStatusEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  UpdateSampleTypeDtoStatusEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      UpdateSampleTypeDtoStatusEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$UpdateSampleTypeDto extends UpdateSampleTypeDto {
  @override
  final String? name;
  @override
  final JsonObject? surveillanceType;
  @override
  final String? emojiIcon;
  @override
  final String? abbreviation;
  @override
  final BuiltList<String>? diseaseShortNames;
  @override
  final UpdateSampleTypeDtoStatusEnum? status;

  factory _$UpdateSampleTypeDto(
          [void Function(UpdateSampleTypeDtoBuilder)? updates]) =>
      (UpdateSampleTypeDtoBuilder()..update(updates))._build();

  _$UpdateSampleTypeDto._(
      {this.name,
      this.surveillanceType,
      this.emojiIcon,
      this.abbreviation,
      this.diseaseShortNames,
      this.status})
      : super._();
  @override
  UpdateSampleTypeDto rebuild(
          void Function(UpdateSampleTypeDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UpdateSampleTypeDtoBuilder toBuilder() =>
      UpdateSampleTypeDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UpdateSampleTypeDto &&
        name == other.name &&
        surveillanceType == other.surveillanceType &&
        emojiIcon == other.emojiIcon &&
        abbreviation == other.abbreviation &&
        diseaseShortNames == other.diseaseShortNames &&
        status == other.status;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, name.hashCode);
    _$hash = $jc(_$hash, surveillanceType.hashCode);
    _$hash = $jc(_$hash, emojiIcon.hashCode);
    _$hash = $jc(_$hash, abbreviation.hashCode);
    _$hash = $jc(_$hash, diseaseShortNames.hashCode);
    _$hash = $jc(_$hash, status.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'UpdateSampleTypeDto')
          ..add('name', name)
          ..add('surveillanceType', surveillanceType)
          ..add('emojiIcon', emojiIcon)
          ..add('abbreviation', abbreviation)
          ..add('diseaseShortNames', diseaseShortNames)
          ..add('status', status))
        .toString();
  }
}

class UpdateSampleTypeDtoBuilder
    implements Builder<UpdateSampleTypeDto, UpdateSampleTypeDtoBuilder> {
  _$UpdateSampleTypeDto? _$v;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  JsonObject? _surveillanceType;
  JsonObject? get surveillanceType => _$this._surveillanceType;
  set surveillanceType(JsonObject? surveillanceType) =>
      _$this._surveillanceType = surveillanceType;

  String? _emojiIcon;
  String? get emojiIcon => _$this._emojiIcon;
  set emojiIcon(String? emojiIcon) => _$this._emojiIcon = emojiIcon;

  String? _abbreviation;
  String? get abbreviation => _$this._abbreviation;
  set abbreviation(String? abbreviation) => _$this._abbreviation = abbreviation;

  ListBuilder<String>? _diseaseShortNames;
  ListBuilder<String> get diseaseShortNames =>
      _$this._diseaseShortNames ??= ListBuilder<String>();
  set diseaseShortNames(ListBuilder<String>? diseaseShortNames) =>
      _$this._diseaseShortNames = diseaseShortNames;

  UpdateSampleTypeDtoStatusEnum? _status;
  UpdateSampleTypeDtoStatusEnum? get status => _$this._status;
  set status(UpdateSampleTypeDtoStatusEnum? status) => _$this._status = status;

  UpdateSampleTypeDtoBuilder() {
    UpdateSampleTypeDto._defaults(this);
  }

  UpdateSampleTypeDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _name = $v.name;
      _surveillanceType = $v.surveillanceType;
      _emojiIcon = $v.emojiIcon;
      _abbreviation = $v.abbreviation;
      _diseaseShortNames = $v.diseaseShortNames?.toBuilder();
      _status = $v.status;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(UpdateSampleTypeDto other) {
    _$v = other as _$UpdateSampleTypeDto;
  }

  @override
  void update(void Function(UpdateSampleTypeDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UpdateSampleTypeDto build() => _build();

  _$UpdateSampleTypeDto _build() {
    _$UpdateSampleTypeDto _$result;
    try {
      _$result = _$v ??
          _$UpdateSampleTypeDto._(
            name: name,
            surveillanceType: surveillanceType,
            emojiIcon: emojiIcon,
            abbreviation: abbreviation,
            diseaseShortNames: _diseaseShortNames?.build(),
            status: status,
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'diseaseShortNames';
        _diseaseShortNames?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'UpdateSampleTypeDto', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
