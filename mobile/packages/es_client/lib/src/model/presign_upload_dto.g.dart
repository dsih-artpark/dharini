// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'presign_upload_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$PresignUploadDto extends PresignUploadDto {
  @override
  final String filename;
  @override
  final num contentLength;

  factory _$PresignUploadDto(
          [void Function(PresignUploadDtoBuilder)? updates]) =>
      (PresignUploadDtoBuilder()..update(updates))._build();

  _$PresignUploadDto._({required this.filename, required this.contentLength})
      : super._();
  @override
  PresignUploadDto rebuild(void Function(PresignUploadDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  PresignUploadDtoBuilder toBuilder() =>
      PresignUploadDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is PresignUploadDto &&
        filename == other.filename &&
        contentLength == other.contentLength;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, filename.hashCode);
    _$hash = $jc(_$hash, contentLength.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'PresignUploadDto')
          ..add('filename', filename)
          ..add('contentLength', contentLength))
        .toString();
  }
}

class PresignUploadDtoBuilder
    implements Builder<PresignUploadDto, PresignUploadDtoBuilder> {
  _$PresignUploadDto? _$v;

  String? _filename;
  String? get filename => _$this._filename;
  set filename(String? filename) => _$this._filename = filename;

  num? _contentLength;
  num? get contentLength => _$this._contentLength;
  set contentLength(num? contentLength) =>
      _$this._contentLength = contentLength;

  PresignUploadDtoBuilder() {
    PresignUploadDto._defaults(this);
  }

  PresignUploadDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _filename = $v.filename;
      _contentLength = $v.contentLength;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(PresignUploadDto other) {
    _$v = other as _$PresignUploadDto;
  }

  @override
  void update(void Function(PresignUploadDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  PresignUploadDto build() => _build();

  _$PresignUploadDto _build() {
    final _$result = _$v ??
        _$PresignUploadDto._(
          filename: BuiltValueNullFieldError.checkNotNull(
              filename, r'PresignUploadDto', 'filename'),
          contentLength: BuiltValueNullFieldError.checkNotNull(
              contentLength, r'PresignUploadDto', 'contentLength'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
