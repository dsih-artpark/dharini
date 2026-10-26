// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'phone_login_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$PhoneLoginDto extends PhoneLoginDto {
  @override
  final String phone;

  factory _$PhoneLoginDto([void Function(PhoneLoginDtoBuilder)? updates]) =>
      (PhoneLoginDtoBuilder()..update(updates))._build();

  _$PhoneLoginDto._({required this.phone}) : super._();
  @override
  PhoneLoginDto rebuild(void Function(PhoneLoginDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  PhoneLoginDtoBuilder toBuilder() => PhoneLoginDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is PhoneLoginDto && phone == other.phone;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, phone.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'PhoneLoginDto')..add('phone', phone))
        .toString();
  }
}

class PhoneLoginDtoBuilder
    implements Builder<PhoneLoginDto, PhoneLoginDtoBuilder> {
  _$PhoneLoginDto? _$v;

  String? _phone;
  String? get phone => _$this._phone;
  set phone(String? phone) => _$this._phone = phone;

  PhoneLoginDtoBuilder() {
    PhoneLoginDto._defaults(this);
  }

  PhoneLoginDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _phone = $v.phone;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(PhoneLoginDto other) {
    _$v = other as _$PhoneLoginDto;
  }

  @override
  void update(void Function(PhoneLoginDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  PhoneLoginDto build() => _build();

  _$PhoneLoginDto _build() {
    final _$result = _$v ??
        _$PhoneLoginDto._(
          phone: BuiltValueNullFieldError.checkNotNull(
              phone, r'PhoneLoginDto', 'phone'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
