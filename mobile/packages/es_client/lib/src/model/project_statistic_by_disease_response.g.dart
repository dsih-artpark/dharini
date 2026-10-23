// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'project_statistic_by_disease_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ProjectStatisticByDiseaseResponse
    extends ProjectStatisticByDiseaseResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final BuiltList<ProjectStatisticByDiseasesResponseData> data;

  factory _$ProjectStatisticByDiseaseResponse(
          [void Function(ProjectStatisticByDiseaseResponseBuilder)? updates]) =>
      (ProjectStatisticByDiseaseResponseBuilder()..update(updates))._build();

  _$ProjectStatisticByDiseaseResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  ProjectStatisticByDiseaseResponse rebuild(
          void Function(ProjectStatisticByDiseaseResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ProjectStatisticByDiseaseResponseBuilder toBuilder() =>
      ProjectStatisticByDiseaseResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ProjectStatisticByDiseaseResponse &&
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
    return (newBuiltValueToStringHelper(r'ProjectStatisticByDiseaseResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class ProjectStatisticByDiseaseResponseBuilder
    implements
        Builder<ProjectStatisticByDiseaseResponse,
            ProjectStatisticByDiseaseResponseBuilder> {
  _$ProjectStatisticByDiseaseResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  ListBuilder<ProjectStatisticByDiseasesResponseData>? _data;
  ListBuilder<ProjectStatisticByDiseasesResponseData> get data =>
      _$this._data ??= ListBuilder<ProjectStatisticByDiseasesResponseData>();
  set data(ListBuilder<ProjectStatisticByDiseasesResponseData>? data) =>
      _$this._data = data;

  ProjectStatisticByDiseaseResponseBuilder() {
    ProjectStatisticByDiseaseResponse._defaults(this);
  }

  ProjectStatisticByDiseaseResponseBuilder get _$this {
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
  void replace(ProjectStatisticByDiseaseResponse other) {
    _$v = other as _$ProjectStatisticByDiseaseResponse;
  }

  @override
  void update(
      void Function(ProjectStatisticByDiseaseResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ProjectStatisticByDiseaseResponse build() => _build();

  _$ProjectStatisticByDiseaseResponse _build() {
    _$ProjectStatisticByDiseaseResponse _$result;
    try {
      _$result = _$v ??
          _$ProjectStatisticByDiseaseResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'ProjectStatisticByDiseaseResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'ProjectStatisticByDiseaseResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'ProjectStatisticByDiseaseResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
