// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_surveillance_type_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$UpdateSurveillanceTypeDto extends UpdateSurveillanceTypeDto {
  @override
  final String? name;

  factory _$UpdateSurveillanceTypeDto(
          [void Function(UpdateSurveillanceTypeDtoBuilder)? updates]) =>
      (UpdateSurveillanceTypeDtoBuilder()..update(updates))._build();

  _$UpdateSurveillanceTypeDto._({this.name}) : super._();
  @override
  UpdateSurveillanceTypeDto rebuild(
          void Function(UpdateSurveillanceTypeDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UpdateSurveillanceTypeDtoBuilder toBuilder() =>
      UpdateSurveillanceTypeDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UpdateSurveillanceTypeDto && name == other.name;
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
    return (newBuiltValueToStringHelper(r'UpdateSurveillanceTypeDto')
          ..add('name', name))
        .toString();
  }
}

class UpdateSurveillanceTypeDtoBuilder
    implements
        Builder<UpdateSurveillanceTypeDto, UpdateSurveillanceTypeDtoBuilder> {
  _$UpdateSurveillanceTypeDto? _$v;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  UpdateSurveillanceTypeDtoBuilder() {
    UpdateSurveillanceTypeDto._defaults(this);
  }

  UpdateSurveillanceTypeDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _name = $v.name;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(UpdateSurveillanceTypeDto other) {
    _$v = other as _$UpdateSurveillanceTypeDto;
  }

  @override
  void update(void Function(UpdateSurveillanceTypeDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UpdateSurveillanceTypeDto build() => _build();

  _$UpdateSurveillanceTypeDto _build() {
    final _$result = _$v ??
        _$UpdateSurveillanceTypeDto._(
          name: name,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
