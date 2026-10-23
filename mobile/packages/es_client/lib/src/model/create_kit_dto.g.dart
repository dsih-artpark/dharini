// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_kit_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const CreateKitDtoStatusEnum _$createKitDtoStatusEnum_active =
    const CreateKitDtoStatusEnum._('active');
const CreateKitDtoStatusEnum _$createKitDtoStatusEnum_inactive =
    const CreateKitDtoStatusEnum._('inactive');
const CreateKitDtoStatusEnum _$createKitDtoStatusEnum_deleted =
    const CreateKitDtoStatusEnum._('deleted');
const CreateKitDtoStatusEnum _$createKitDtoStatusEnum_unknownDefaultOpenApi =
    const CreateKitDtoStatusEnum._('unknownDefaultOpenApi');

CreateKitDtoStatusEnum _$createKitDtoStatusEnumValueOf(String name) {
  switch (name) {
    case 'active':
      return _$createKitDtoStatusEnum_active;
    case 'inactive':
      return _$createKitDtoStatusEnum_inactive;
    case 'deleted':
      return _$createKitDtoStatusEnum_deleted;
    case 'unknownDefaultOpenApi':
      return _$createKitDtoStatusEnum_unknownDefaultOpenApi;
    default:
      return _$createKitDtoStatusEnum_unknownDefaultOpenApi;
  }
}

final BuiltSet<CreateKitDtoStatusEnum> _$createKitDtoStatusEnumValues =
    BuiltSet<CreateKitDtoStatusEnum>(const <CreateKitDtoStatusEnum>[
  _$createKitDtoStatusEnum_active,
  _$createKitDtoStatusEnum_inactive,
  _$createKitDtoStatusEnum_deleted,
  _$createKitDtoStatusEnum_unknownDefaultOpenApi,
]);

Serializer<CreateKitDtoStatusEnum> _$createKitDtoStatusEnumSerializer =
    _$CreateKitDtoStatusEnumSerializer();

class _$CreateKitDtoStatusEnumSerializer
    implements PrimitiveSerializer<CreateKitDtoStatusEnum> {
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
  final Iterable<Type> types = const <Type>[CreateKitDtoStatusEnum];
  @override
  final String wireName = 'CreateKitDtoStatusEnum';

  @override
  Object serialize(Serializers serializers, CreateKitDtoStatusEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  CreateKitDtoStatusEnum deserialize(Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      CreateKitDtoStatusEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$CreateKitDto extends CreateKitDto {
  @override
  final String name;
  @override
  final CreateKitDtoStatusEnum? status;

  factory _$CreateKitDto([void Function(CreateKitDtoBuilder)? updates]) =>
      (CreateKitDtoBuilder()..update(updates))._build();

  _$CreateKitDto._({required this.name, this.status}) : super._();
  @override
  CreateKitDto rebuild(void Function(CreateKitDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  CreateKitDtoBuilder toBuilder() => CreateKitDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is CreateKitDto &&
        name == other.name &&
        status == other.status;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, name.hashCode);
    _$hash = $jc(_$hash, status.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'CreateKitDto')
          ..add('name', name)
          ..add('status', status))
        .toString();
  }
}

class CreateKitDtoBuilder
    implements Builder<CreateKitDto, CreateKitDtoBuilder> {
  _$CreateKitDto? _$v;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  CreateKitDtoStatusEnum? _status;
  CreateKitDtoStatusEnum? get status => _$this._status;
  set status(CreateKitDtoStatusEnum? status) => _$this._status = status;

  CreateKitDtoBuilder() {
    CreateKitDto._defaults(this);
  }

  CreateKitDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _name = $v.name;
      _status = $v.status;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(CreateKitDto other) {
    _$v = other as _$CreateKitDto;
  }

  @override
  void update(void Function(CreateKitDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  CreateKitDto build() => _build();

  _$CreateKitDto _build() {
    final _$result = _$v ??
        _$CreateKitDto._(
          name: BuiltValueNullFieldError.checkNotNull(
              name, r'CreateKitDto', 'name'),
          status: status,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
