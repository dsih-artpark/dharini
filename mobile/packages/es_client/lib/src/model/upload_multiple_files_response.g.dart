// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'upload_multiple_files_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$UploadMultipleFilesResponse extends UploadMultipleFilesResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final BuiltList<FileUploadResult> data;

  factory _$UploadMultipleFilesResponse(
          [void Function(UploadMultipleFilesResponseBuilder)? updates]) =>
      (UploadMultipleFilesResponseBuilder()..update(updates))._build();

  _$UploadMultipleFilesResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  UploadMultipleFilesResponse rebuild(
          void Function(UploadMultipleFilesResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UploadMultipleFilesResponseBuilder toBuilder() =>
      UploadMultipleFilesResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UploadMultipleFilesResponse &&
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
    return (newBuiltValueToStringHelper(r'UploadMultipleFilesResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class UploadMultipleFilesResponseBuilder
    implements
        Builder<UploadMultipleFilesResponse,
            UploadMultipleFilesResponseBuilder> {
  _$UploadMultipleFilesResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  ListBuilder<FileUploadResult>? _data;
  ListBuilder<FileUploadResult> get data =>
      _$this._data ??= ListBuilder<FileUploadResult>();
  set data(ListBuilder<FileUploadResult>? data) => _$this._data = data;

  UploadMultipleFilesResponseBuilder() {
    UploadMultipleFilesResponse._defaults(this);
  }

  UploadMultipleFilesResponseBuilder get _$this {
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
  void replace(UploadMultipleFilesResponse other) {
    _$v = other as _$UploadMultipleFilesResponse;
  }

  @override
  void update(void Function(UploadMultipleFilesResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UploadMultipleFilesResponse build() => _build();

  _$UploadMultipleFilesResponse _build() {
    _$UploadMultipleFilesResponse _$result;
    try {
      _$result = _$v ??
          _$UploadMultipleFilesResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'UploadMultipleFilesResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'UploadMultipleFilesResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'UploadMultipleFilesResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
