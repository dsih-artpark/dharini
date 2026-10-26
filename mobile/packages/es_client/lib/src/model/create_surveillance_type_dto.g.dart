// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_surveillance_type_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$CreateSurveillanceTypeDto extends CreateSurveillanceTypeDto {
  @override
  final String name;

  factory _$CreateSurveillanceTypeDto(
          [void Function(CreateSurveillanceTypeDtoBuilder)? updates]) =>
      (CreateSurveillanceTypeDtoBuilder()..update(updates))._build();

  _$CreateSurveillanceTypeDto._({required this.name}) : super._();
  @override
  CreateSurveillanceTypeDto rebuild(
          void Function(CreateSurveillanceTypeDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  CreateSurveillanceTypeDtoBuilder toBuilder() =>
      CreateSurveillanceTypeDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is CreateSurveillanceTypeDto && name == other.name;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, name.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'CreateSurveillanceTypeDto')
          ..add('name', name))
        .toString();
  }
}

class CreateSurveillanceTypeDtoBuilder
    implements
        Builder<CreateSurveillanceTypeDto, CreateSurveillanceTypeDtoBuilder> {
  _$CreateSurveillanceTypeDto? _$v;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  CreateSurveillanceTypeDtoBuilder() {
    CreateSurveillanceTypeDto._defaults(this);
  }

  CreateSurveillanceTypeDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _name = $v.name;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(CreateSurveillanceTypeDto other) {
    _$v = other as _$CreateSurveillanceTypeDto;
  }

  @override
  void update(void Function(CreateSurveillanceTypeDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  CreateSurveillanceTypeDto build() => _build();

  _$CreateSurveillanceTypeDto _build() {
    final _$result = _$v ??
        _$CreateSurveillanceTypeDto._(
          name: BuiltValueNullFieldError.checkNotNull(
              name, r'CreateSurveillanceTypeDto', 'name'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
