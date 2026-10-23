// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'disease_search_response_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$DiseaseSearchResponseData extends DiseaseSearchResponseData {
  @override
  final String id;
  @override
  final String name;

  factory _$DiseaseSearchResponseData(
          [void Function(DiseaseSearchResponseDataBuilder)? updates]) =>
      (DiseaseSearchResponseDataBuilder()..update(updates))._build();

  _$DiseaseSearchResponseData._({required this.id, required this.name})
      : super._();
  @override
  DiseaseSearchResponseData rebuild(
          void Function(DiseaseSearchResponseDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  DiseaseSearchResponseDataBuilder toBuilder() =>
      DiseaseSearchResponseDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is DiseaseSearchResponseData &&
        id == other.id &&
        name == other.name;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, name.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'DiseaseSearchResponseData')
          ..add('id', id)
          ..add('name', name))
        .toString();
  }
}

class DiseaseSearchResponseDataBuilder
    implements
        Builder<DiseaseSearchResponseData, DiseaseSearchResponseDataBuilder> {
  _$DiseaseSearchResponseData? _$v;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  DiseaseSearchResponseDataBuilder() {
    DiseaseSearchResponseData._defaults(this);
  }

  DiseaseSearchResponseDataBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _name = $v.name;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(DiseaseSearchResponseData other) {
    _$v = other as _$DiseaseSearchResponseData;
  }

  @override
  void update(void Function(DiseaseSearchResponseDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  DiseaseSearchResponseData build() => _build();

  _$DiseaseSearchResponseData _build() {
    final _$result = _$v ??
        _$DiseaseSearchResponseData._(
          id: BuiltValueNullFieldError.checkNotNull(
              id, r'DiseaseSearchResponseData', 'id'),
          name: BuiltValueNullFieldError.checkNotNull(
              name, r'DiseaseSearchResponseData', 'name'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
