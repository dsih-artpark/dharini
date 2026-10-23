// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'list_role_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ListRoleResponse extends ListRoleResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final BuiltList<RoleResponseData> data;

  factory _$ListRoleResponse(
          [void Function(ListRoleResponseBuilder)? updates]) =>
      (ListRoleResponseBuilder()..update(updates))._build();

  _$ListRoleResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  ListRoleResponse rebuild(void Function(ListRoleResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ListRoleResponseBuilder toBuilder() =>
      ListRoleResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ListRoleResponse &&
        success == other.success &&
        message == other.message &&
        data == other.data;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, success.hashCode);
    _$hash = $jc(_$hash, message.hashCode);
    _$hash = $jc(_$hash, data.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'ListRoleResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class ListRoleResponseBuilder
    implements Builder<ListRoleResponse, ListRoleResponseBuilder> {
  _$ListRoleResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  ListBuilder<RoleResponseData>? _data;
  ListBuilder<RoleResponseData> get data =>
      _$this._data ??= ListBuilder<RoleResponseData>();
  set data(ListBuilder<RoleResponseData>? data) => _$this._data = data;

  ListRoleResponseBuilder() {
    ListRoleResponse._defaults(this);
  }

  ListRoleResponseBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _success = $v.success;
      _message = $v.message;
      _data = $v.data.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(ListRoleResponse other) {
    _$v = other as _$ListRoleResponse;
  }

  @override
  void update(void Function(ListRoleResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ListRoleResponse build() => _build();

  _$ListRoleResponse _build() {
    _$ListRoleResponse _$result;
    try {
      _$result = _$v ??
          _$ListRoleResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'ListRoleResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'ListRoleResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'ListRoleResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
