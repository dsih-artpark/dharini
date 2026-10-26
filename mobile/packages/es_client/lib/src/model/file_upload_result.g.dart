// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'file_upload_result.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$FileUploadResult extends FileUploadResult {
  @override
  final String filename;
  @override
  final bool uploaded;
  @override
  final String? fileUrl;
  @override
  final String? publicUrl;

  factory _$FileUploadResult(
          [void Function(FileUploadResultBuilder)? updates]) =>
      (FileUploadResultBuilder()..update(updates))._build();

  _$FileUploadResult._(
      {required this.filename,
      required this.uploaded,
      this.fileUrl,
      this.publicUrl})
      : super._();
  @override
  FileUploadResult rebuild(void Function(FileUploadResultBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  FileUploadResultBuilder toBuilder() =>
      FileUploadResultBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is FileUploadResult &&
        filename == other.filename &&
        uploaded == other.uploaded &&
        fileUrl == other.fileUrl &&
        publicUrl == other.publicUrl;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, filename.hashCode);
    _$hash = $jc(_$hash, uploaded.hashCode);
    _$hash = $jc(_$hash, fileUrl.hashCode);
    _$hash = $jc(_$hash, publicUrl.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'FileUploadResult')
          ..add('filename', filename)
          ..add('uploaded', uploaded)
          ..add('fileUrl', fileUrl)
          ..add('publicUrl', publicUrl))
        .toString();
  }
}

class FileUploadResultBuilder
    implements Builder<FileUploadResult, FileUploadResultBuilder> {
  _$FileUploadResult? _$v;

  String? _filename;
  String? get filename => _$this._filename;
  set filename(String? filename) => _$this._filename = filename;

  bool? _uploaded;
  bool? get uploaded => _$this._uploaded;
  set uploaded(bool? uploaded) => _$this._uploaded = uploaded;

  String? _fileUrl;
  String? get fileUrl => _$this._fileUrl;
  set fileUrl(String? fileUrl) => _$this._fileUrl = fileUrl;

  String? _publicUrl;
  String? get publicUrl => _$this._publicUrl;
  set publicUrl(String? publicUrl) => _$this._publicUrl = publicUrl;

  FileUploadResultBuilder() {
    FileUploadResult._defaults(this);
  }

  FileUploadResultBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _filename = $v.filename;
      _uploaded = $v.uploaded;
      _fileUrl = $v.fileUrl;
      _publicUrl = $v.publicUrl;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(FileUploadResult other) {
    _$v = other as _$FileUploadResult;
  }

  @override
  void update(void Function(FileUploadResultBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  FileUploadResult build() => _build();

  _$FileUploadResult _build() {
    final _$result = _$v ??
        _$FileUploadResult._(
          filename: BuiltValueNullFieldError.checkNotNull(
              filename, r'FileUploadResult', 'filename'),
          uploaded: BuiltValueNullFieldError.checkNotNull(
              uploaded, r'FileUploadResult', 'uploaded'),
          fileUrl: fileUrl,
          publicUrl: publicUrl,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
