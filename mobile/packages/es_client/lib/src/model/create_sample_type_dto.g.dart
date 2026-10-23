// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_sample_type_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const CreateSampleTypeDtoStatusEnum _$createSampleTypeDtoStatusEnum_active =
    const CreateSampleTypeDtoStatusEnum._('active');
const CreateSampleTypeDtoStatusEnum _$createSampleTypeDtoStatusEnum_inactive =
    const CreateSampleTypeDtoStatusEnum._('inactive');
const CreateSampleTypeDtoStatusEnum _$createSampleTypeDtoStatusEnum_deleted =
    const CreateSampleTypeDtoStatusEnum._('deleted');
const CreateSampleTypeDtoStatusEnum
    _$createSampleTypeDtoStatusEnum_unknownDefaultOpenApi =
    const CreateSampleTypeDtoStatusEnum._('unknownDefaultOpenApi');

CreateSampleTypeDtoStatusEnum _$createSampleTypeDtoStatusEnumValueOf(
    String name) {
  switch (name) {
    case 'active':
      return _$createSampleTypeDtoStatusEnum_active;
    case 'inactive':
      return _$createSampleTypeDtoStatusEnum_inactive;
    case 'deleted':
      return _$createSampleTypeDtoStatusEnum_deleted;
    case 'unknownDefaultOpenApi':
      return _$createSampleTypeDtoStatusEnum_unknownDefaultOpenApi;
    default:
      return _$createSampleTypeDtoStatusEnum_unknownDefaultOpenApi;
  }
}

final BuiltSet<CreateSampleTypeDtoStatusEnum>
    _$createSampleTypeDtoStatusEnumValues = BuiltSet<
        CreateSampleTypeDtoStatusEnum>(const <CreateSampleTypeDtoStatusEnum>[
  _$createSampleTypeDtoStatusEnum_active,
  _$createSampleTypeDtoStatusEnum_inactive,
  _$createSampleTypeDtoStatusEnum_deleted,
  _$createSampleTypeDtoStatusEnum_unknownDefaultOpenApi,
]);

Serializer<CreateSampleTypeDtoStatusEnum>
    _$createSampleTypeDtoStatusEnumSerializer =
    _$CreateSampleTypeDtoStatusEnumSerializer();

class _$CreateSampleTypeDtoStatusEnumSerializer
    implements PrimitiveSerializer<CreateSampleTypeDtoStatusEnum> {
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
  final Iterable<Type> types = const <Type>[CreateSampleTypeDtoStatusEnum];
  @override
  final String wireName = 'CreateSampleTypeDtoStatusEnum';

  @override
  Object serialize(
          Serializers serializers, CreateSampleTypeDtoStatusEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  CreateSampleTypeDtoStatusEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      CreateSampleTypeDtoStatusEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$CreateSampleTypeDto extends CreateSampleTypeDto {
  @override
  final String name;
  @override
  final JsonObject surveillanceType;
  @override
  final String? emojiIcon;
  @override
  final String? abbreviation;
  @override
  final BuiltList<String>? diseaseShortNames;
  @override
  final CreateSampleTypeDtoStatusEnum? status;

  factory _$CreateSampleTypeDto(
          [void Function(CreateSampleTypeDtoBuilder)? updates]) =>
      (CreateSampleTypeDtoBuilder()..update(updates))._build();

  _$CreateSampleTypeDto._(
      {required this.name,
      required this.surveillanceType,
      this.emojiIcon,
      this.abbreviation,
      this.diseaseShortNames,
      this.status})
      : super._();
  @override
  CreateSampleTypeDto rebuild(
          void Function(CreateSampleTypeDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  CreateSampleTypeDtoBuilder toBuilder() =>
      CreateSampleTypeDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is CreateSampleTypeDto &&
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
    return (newBuiltValueToStringHelper(r'CreateSampleTypeDto')
          ..add('name', name)
          ..add('surveillanceType', surveillanceType)
          ..add('emojiIcon', emojiIcon)
          ..add('abbreviation', abbreviation)
          ..add('diseaseShortNames', diseaseShortNames)
          ..add('status', status))
        .toString();
  }
}

class CreateSampleTypeDtoBuilder
    implements Builder<CreateSampleTypeDto, CreateSampleTypeDtoBuilder> {
  _$CreateSampleTypeDto? _$v;

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

  CreateSampleTypeDtoStatusEnum? _status;
  CreateSampleTypeDtoStatusEnum? get status => _$this._status;
  set status(CreateSampleTypeDtoStatusEnum? status) => _$this._status = status;

  CreateSampleTypeDtoBuilder() {
    CreateSampleTypeDto._defaults(this);
  }

  CreateSampleTypeDtoBuilder get _$this {
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
  void replace(CreateSampleTypeDto other) {
    _$v = other as _$CreateSampleTypeDto;
  }

  @override
  void update(void Function(CreateSampleTypeDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  CreateSampleTypeDto build() => _build();

  _$CreateSampleTypeDto _build() {
    _$CreateSampleTypeDto _$result;
    try {
      _$result = _$v ??
          _$CreateSampleTypeDto._(
            name: BuiltValueNullFieldError.checkNotNull(
                name, r'CreateSampleTypeDto', 'name'),
            surveillanceType: BuiltValueNullFieldError.checkNotNull(
                surveillanceType, r'CreateSampleTypeDto', 'surveillanceType'),
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
            r'CreateSampleTypeDto', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
