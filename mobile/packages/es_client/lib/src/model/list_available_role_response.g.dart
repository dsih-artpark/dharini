// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'list_available_role_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ListAvailableRoleResponse extends ListAvailableRoleResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final BuiltList<RoleResponse> data;

  factory _$ListAvailableRoleResponse(
          [void Function(ListAvailableRoleResponseBuilder)? updates]) =>
      (ListAvailableRoleResponseBuilder()..update(updates))._build();

  _$ListAvailableRoleResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  ListAvailableRoleResponse rebuild(
          void Function(ListAvailableRoleResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ListAvailableRoleResponseBuilder toBuilder() =>
      ListAvailableRoleResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ListAvailableRoleResponse &&
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
    return (newBuiltValueToStringHelper(r'ListAvailableRoleResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class ListAvailableRoleResponseBuilder
    implements
        Builder<ListAvailableRoleResponse, ListAvailableRoleResponseBuilder> {
  _$ListAvailableRoleResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  ListBuilder<RoleResponse>? _data;
  ListBuilder<RoleResponse> get data =>
      _$this._data ??= ListBuilder<RoleResponse>();
  set data(ListBuilder<RoleResponse>? data) => _$this._data = data;

  ListAvailableRoleResponseBuilder() {
    ListAvailableRoleResponse._defaults(this);
  }

  ListAvailableRoleResponseBuilder get _$this {
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
  void replace(ListAvailableRoleResponse other) {
    _$v = other as _$ListAvailableRoleResponse;
  }

  @override
  void update(void Function(ListAvailableRoleResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ListAvailableRoleResponse build() => _build();

  _$ListAvailableRoleResponse _build() {
    _$ListAvailableRoleResponse _$result;
    try {
      _$result = _$v ??
          _$ListAvailableRoleResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'ListAvailableRoleResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'ListAvailableRoleResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'ListAvailableRoleResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
