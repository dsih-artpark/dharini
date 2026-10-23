// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'sample_break_down_response_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$SampleBreakDownResponseData extends SampleBreakDownResponseData {
  @override
  final String id;
  @override
  final String name;
  @override
  final String code;
  @override
  final BuiltList<String> photos;
  @override
  final String locationId;
  @override
  final String state;
  @override
  final String district;
  @override
  final num totalSampleCount;
  @override
  final num positiveSampleCount;
  @override
  final num negativeSampleCount;
  @override
  final num unclearSampleCount;

  factory _$SampleBreakDownResponseData(
          [void Function(SampleBreakDownResponseDataBuilder)? updates]) =>
      (SampleBreakDownResponseDataBuilder()..update(updates))._build();

  _$SampleBreakDownResponseData._(
      {required this.id,
      required this.name,
      required this.code,
      required this.photos,
      required this.locationId,
      required this.state,
      required this.district,
      required this.totalSampleCount,
      required this.positiveSampleCount,
      required this.negativeSampleCount,
      required this.unclearSampleCount})
      : super._();
  @override
  SampleBreakDownResponseData rebuild(
          void Function(SampleBreakDownResponseDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  SampleBreakDownResponseDataBuilder toBuilder() =>
      SampleBreakDownResponseDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is SampleBreakDownResponseData &&
        id == other.id &&
        name == other.name &&
        code == other.code &&
        photos == other.photos &&
        locationId == other.locationId &&
        state == other.state &&
        district == other.district &&
        totalSampleCount == other.totalSampleCount &&
        positiveSampleCount == other.positiveSampleCount &&
        negativeSampleCount == other.negativeSampleCount &&
        unclearSampleCount == other.unclearSampleCount;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, name.hashCode);
    _$hash = $jc(_$hash, code.hashCode);
    _$hash = $jc(_$hash, photos.hashCode);
    _$hash = $jc(_$hash, locationId.hashCode);
    _$hash = $jc(_$hash, state.hashCode);
    _$hash = $jc(_$hash, district.hashCode);
    _$hash = $jc(_$hash, totalSampleCount.hashCode);
    _$hash = $jc(_$hash, positiveSampleCount.hashCode);
    _$hash = $jc(_$hash, negativeSampleCount.hashCode);
    _$hash = $jc(_$hash, unclearSampleCount.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'SampleBreakDownResponseData')
          ..add('id', id)
          ..add('name', name)
          ..add('code', code)
          ..add('photos', photos)
          ..add('locationId', locationId)
          ..add('state', state)
          ..add('district', district)
          ..add('totalSampleCount', totalSampleCount)
          ..add('positiveSampleCount', positiveSampleCount)
          ..add('negativeSampleCount', negativeSampleCount)
          ..add('unclearSampleCount', unclearSampleCount))
        .toString();
  }
}

class SampleBreakDownResponseDataBuilder
    implements
        Builder<SampleBreakDownResponseData,
            SampleBreakDownResponseDataBuilder> {
  _$SampleBreakDownResponseData? _$v;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  String? _code;
  String? get code => _$this._code;
  set code(String? code) => _$this._code = code;

  ListBuilder<String>? _photos;
  ListBuilder<String> get photos => _$this._photos ??= ListBuilder<String>();
  set photos(ListBuilder<String>? photos) => _$this._photos = photos;

  String? _locationId;
  String? get locationId => _$this._locationId;
  set locationId(String? locationId) => _$this._locationId = locationId;

  String? _state;
  String? get state => _$this._state;
  set state(String? state) => _$this._state = state;

  String? _district;
  String? get district => _$this._district;
  set district(String? district) => _$this._district = district;

  num? _totalSampleCount;
  num? get totalSampleCount => _$this._totalSampleCount;
  set totalSampleCount(num? totalSampleCount) =>
      _$this._totalSampleCount = totalSampleCount;

  num? _positiveSampleCount;
  num? get positiveSampleCount => _$this._positiveSampleCount;
  set positiveSampleCount(num? positiveSampleCount) =>
      _$this._positiveSampleCount = positiveSampleCount;

  num? _negativeSampleCount;
  num? get negativeSampleCount => _$this._negativeSampleCount;
  set negativeSampleCount(num? negativeSampleCount) =>
      _$this._negativeSampleCount = negativeSampleCount;

  num? _unclearSampleCount;
  num? get unclearSampleCount => _$this._unclearSampleCount;
  set unclearSampleCount(num? unclearSampleCount) =>
      _$this._unclearSampleCount = unclearSampleCount;

  SampleBreakDownResponseDataBuilder() {
    SampleBreakDownResponseData._defaults(this);
  }

  SampleBreakDownResponseDataBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _name = $v.name;
      _code = $v.code;
      _photos = $v.photos.toBuilder();
      _locationId = $v.locationId;
      _state = $v.state;
      _district = $v.district;
      _totalSampleCount = $v.totalSampleCount;
      _positiveSampleCount = $v.positiveSampleCount;
      _negativeSampleCount = $v.negativeSampleCount;
      _unclearSampleCount = $v.unclearSampleCount;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(SampleBreakDownResponseData other) {
    _$v = other as _$SampleBreakDownResponseData;
  }

  @override
  void update(void Function(SampleBreakDownResponseDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  SampleBreakDownResponseData build() => _build();

  _$SampleBreakDownResponseData _build() {
    _$SampleBreakDownResponseData _$result;
    try {
      _$result = _$v ??
          _$SampleBreakDownResponseData._(
            id: BuiltValueNullFieldError.checkNotNull(
                id, r'SampleBreakDownResponseData', 'id'),
            name: BuiltValueNullFieldError.checkNotNull(
                name, r'SampleBreakDownResponseData', 'name'),
            code: BuiltValueNullFieldError.checkNotNull(
                code, r'SampleBreakDownResponseData', 'code'),
            photos: photos.build(),
            locationId: BuiltValueNullFieldError.checkNotNull(
                locationId, r'SampleBreakDownResponseData', 'locationId'),
            state: BuiltValueNullFieldError.checkNotNull(
                state, r'SampleBreakDownResponseData', 'state'),
            district: BuiltValueNullFieldError.checkNotNull(
                district, r'SampleBreakDownResponseData', 'district'),
            totalSampleCount: BuiltValueNullFieldError.checkNotNull(
                totalSampleCount,
                r'SampleBreakDownResponseData',
                'totalSampleCount'),
            positiveSampleCount: BuiltValueNullFieldError.checkNotNull(
                positiveSampleCount,
                r'SampleBreakDownResponseData',
                'positiveSampleCount'),
            negativeSampleCount: BuiltValueNullFieldError.checkNotNull(
                negativeSampleCount,
                r'SampleBreakDownResponseData',
                'negativeSampleCount'),
            unclearSampleCount: BuiltValueNullFieldError.checkNotNull(
                unclearSampleCount,
                r'SampleBreakDownResponseData',
                'unclearSampleCount'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'photos';
        photos.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'SampleBreakDownResponseData', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
