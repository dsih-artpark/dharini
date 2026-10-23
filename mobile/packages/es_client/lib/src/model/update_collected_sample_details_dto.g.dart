// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_collected_sample_details_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$UpdateCollectedSampleDetailsDto
    extends UpdateCollectedSampleDetailsDto {
  @override
  final String? barcode;
  @override
  final String? collectedBy;
  @override
  final String? collectionTime;

  factory _$UpdateCollectedSampleDetailsDto(
          [void Function(UpdateCollectedSampleDetailsDtoBuilder)? updates]) =>
      (UpdateCollectedSampleDetailsDtoBuilder()..update(updates))._build();

  _$UpdateCollectedSampleDetailsDto._(
      {this.barcode, this.collectedBy, this.collectionTime})
      : super._();
  @override
  UpdateCollectedSampleDetailsDto rebuild(
          void Function(UpdateCollectedSampleDetailsDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UpdateCollectedSampleDetailsDtoBuilder toBuilder() =>
      UpdateCollectedSampleDetailsDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UpdateCollectedSampleDetailsDto &&
        barcode == other.barcode &&
        collectedBy == other.collectedBy &&
        collectionTime == other.collectionTime;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, barcode.hashCode);
    _$hash = $jc(_$hash, collectedBy.hashCode);
    _$hash = $jc(_$hash, collectionTime.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'UpdateCollectedSampleDetailsDto')
          ..add('barcode', barcode)
          ..add('collectedBy', collectedBy)
          ..add('collectionTime', collectionTime))
        .toString();
  }
}

class UpdateCollectedSampleDetailsDtoBuilder
    implements
        Builder<UpdateCollectedSampleDetailsDto,
            UpdateCollectedSampleDetailsDtoBuilder> {
  _$UpdateCollectedSampleDetailsDto? _$v;

  String? _barcode;
  String? get barcode => _$this._barcode;
  set barcode(String? barcode) => _$this._barcode = barcode;

  String? _collectedBy;
  String? get collectedBy => _$this._collectedBy;
  set collectedBy(String? collectedBy) => _$this._collectedBy = collectedBy;

  String? _collectionTime;
  String? get collectionTime => _$this._collectionTime;
  set collectionTime(String? collectionTime) =>
      _$this._collectionTime = collectionTime;

  UpdateCollectedSampleDetailsDtoBuilder() {
    UpdateCollectedSampleDetailsDto._defaults(this);
  }

  UpdateCollectedSampleDetailsDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _barcode = $v.barcode;
      _collectedBy = $v.collectedBy;
      _collectionTime = $v.collectionTime;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(UpdateCollectedSampleDetailsDto other) {
    _$v = other as _$UpdateCollectedSampleDetailsDto;
  }

  @override
  void update(void Function(UpdateCollectedSampleDetailsDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UpdateCollectedSampleDetailsDto build() => _build();

  _$UpdateCollectedSampleDetailsDto _build() {
    final _$result = _$v ??
        _$UpdateCollectedSampleDetailsDto._(
          barcode: barcode,
          collectedBy: collectedBy,
          collectionTime: collectionTime,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
