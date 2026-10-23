// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'unified_login_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$UnifiedLoginDto extends UnifiedLoginDto {
  @override
  final String? email;
  @override
  final String? phone;

  factory _$UnifiedLoginDto([void Function(UnifiedLoginDtoBuilder)? updates]) =>
      (UnifiedLoginDtoBuilder()..update(updates))._build();

  _$UnifiedLoginDto._({this.email, this.phone}) : super._();
  @override
  UnifiedLoginDto rebuild(void Function(UnifiedLoginDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UnifiedLoginDtoBuilder toBuilder() => UnifiedLoginDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UnifiedLoginDto &&
        email == other.email &&
        phone == other.phone;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, email.hashCode);
    _$hash = $jc(_$hash, phone.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'UnifiedLoginDto')
          ..add('email', email)
          ..add('phone', phone))
        .toString();
  }
}

class UnifiedLoginDtoBuilder
    implements Builder<UnifiedLoginDto, UnifiedLoginDtoBuilder> {
  _$UnifiedLoginDto? _$v;

  String? _email;
  String? get email => _$this._email;
  set email(String? email) => _$this._email = email;

  String? _phone;
  String? get phone => _$this._phone;
  set phone(String? phone) => _$this._phone = phone;

  UnifiedLoginDtoBuilder() {
    UnifiedLoginDto._defaults(this);
  }

  UnifiedLoginDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _email = $v.email;
      _phone = $v.phone;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(UnifiedLoginDto other) {
    _$v = other as _$UnifiedLoginDto;
  }

  @override
  void update(void Function(UnifiedLoginDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UnifiedLoginDto build() => _build();

  _$UnifiedLoginDto _build() {
    final _$result = _$v ??
        _$UnifiedLoginDto._(
          email: email,
          phone: phone,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
