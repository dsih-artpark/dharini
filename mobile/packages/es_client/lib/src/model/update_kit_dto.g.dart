// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_kit_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const UpdateKitDtoStatusEnum _$updateKitDtoStatusEnum_active =
    const UpdateKitDtoStatusEnum._('active');
const UpdateKitDtoStatusEnum _$updateKitDtoStatusEnum_inactive =
    const UpdateKitDtoStatusEnum._('inactive');
const UpdateKitDtoStatusEnum _$updateKitDtoStatusEnum_deleted =
    const UpdateKitDtoStatusEnum._('deleted');
const UpdateKitDtoStatusEnum _$updateKitDtoStatusEnum_unknownDefaultOpenApi =
    const UpdateKitDtoStatusEnum._('unknownDefaultOpenApi');

UpdateKitDtoStatusEnum _$updateKitDtoStatusEnumValueOf(String name) {
  switch (name) {
    case 'active':
      return _$updateKitDtoStatusEnum_active;
    case 'inactive':
      return _$updateKitDtoStatusEnum_inactive;
    case 'deleted':
      return _$updateKitDtoStatusEnum_deleted;
    case 'unknownDefaultOpenApi':
      return _$updateKitDtoStatusEnum_unknownDefaultOpenApi;
    default:
      return _$updateKitDtoStatusEnum_unknownDefaultOpenApi;
  }
}

final BuiltSet<UpdateKitDtoStatusEnum> _$updateKitDtoStatusEnumValues =
    BuiltSet<UpdateKitDtoStatusEnum>(const <UpdateKitDtoStatusEnum>[
  _$updateKitDtoStatusEnum_active,
  _$updateKitDtoStatusEnum_inactive,
  _$updateKitDtoStatusEnum_deleted,
  _$updateKitDtoStatusEnum_unknownDefaultOpenApi,
]);

Serializer<UpdateKitDtoStatusEnum> _$updateKitDtoStatusEnumSerializer =
    _$UpdateKitDtoStatusEnumSerializer();

class _$UpdateKitDtoStatusEnumSerializer
    implements PrimitiveSerializer<UpdateKitDtoStatusEnum> {
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
  final Iterable<Type> types = const <Type>[UpdateKitDtoStatusEnum];
  @override
  final String wireName = 'UpdateKitDtoStatusEnum';

  @override
  Object serialize(Serializers serializers, UpdateKitDtoStatusEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  UpdateKitDtoStatusEnum deserialize(Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      UpdateKitDtoStatusEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$UpdateKitDto extends UpdateKitDto {
  @override
  final String? name;
  @override
  final UpdateKitDtoStatusEnum? status;

  factory _$UpdateKitDto([void Function(UpdateKitDtoBuilder)? updates]) =>
      (UpdateKitDtoBuilder()..update(updates))._build();

  _$UpdateKitDto._({this.name, this.status}) : super._();
  @override
  UpdateKitDto rebuild(void Function(UpdateKitDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UpdateKitDtoBuilder toBuilder() => UpdateKitDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UpdateKitDto &&
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
    return (newBuiltValueToStringHelper(r'UpdateKitDto')
          ..add('name', name)
          ..add('status', status))
        .toString();
  }
}

class UpdateKitDtoBuilder
    implements Builder<UpdateKitDto, UpdateKitDtoBuilder> {
  _$UpdateKitDto? _$v;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  UpdateKitDtoStatusEnum? _status;
  UpdateKitDtoStatusEnum? get status => _$this._status;
  set status(UpdateKitDtoStatusEnum? status) => _$this._status = status;

  UpdateKitDtoBuilder() {
    UpdateKitDto._defaults(this);
  }

  UpdateKitDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _name = $v.name;
      _status = $v.status;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(UpdateKitDto other) {
    _$v = other as _$UpdateKitDto;
  }

  @override
  void update(void Function(UpdateKitDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UpdateKitDto build() => _build();

  _$UpdateKitDto _build() {
    final _$result = _$v ??
        _$UpdateKitDto._(
          name: name,
          status: status,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
