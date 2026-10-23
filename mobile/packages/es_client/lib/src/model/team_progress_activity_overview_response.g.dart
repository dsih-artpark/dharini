// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'team_progress_activity_overview_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$TeamProgressActivityOverviewResponse
    extends TeamProgressActivityOverviewResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final TeamProgressActivityOverviewResponseData data;

  factory _$TeamProgressActivityOverviewResponse(
          [void Function(TeamProgressActivityOverviewResponseBuilder)?
              updates]) =>
      (TeamProgressActivityOverviewResponseBuilder()..update(updates))._build();

  _$TeamProgressActivityOverviewResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  TeamProgressActivityOverviewResponse rebuild(
          void Function(TeamProgressActivityOverviewResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  TeamProgressActivityOverviewResponseBuilder toBuilder() =>
      TeamProgressActivityOverviewResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is TeamProgressActivityOverviewResponse &&
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
    return (newBuiltValueToStringHelper(r'TeamProgressActivityOverviewResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class TeamProgressActivityOverviewResponseBuilder
    implements
        Builder<TeamProgressActivityOverviewResponse,
            TeamProgressActivityOverviewResponseBuilder> {
  _$TeamProgressActivityOverviewResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  TeamProgressActivityOverviewResponseDataBuilder? _data;
  TeamProgressActivityOverviewResponseDataBuilder get data =>
      _$this._data ??= TeamProgressActivityOverviewResponseDataBuilder();
  set data(TeamProgressActivityOverviewResponseDataBuilder? data) =>
      _$this._data = data;

  TeamProgressActivityOverviewResponseBuilder() {
    TeamProgressActivityOverviewResponse._defaults(this);
  }

  TeamProgressActivityOverviewResponseBuilder get _$this {
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
  void replace(TeamProgressActivityOverviewResponse other) {
    _$v = other as _$TeamProgressActivityOverviewResponse;
  }

  @override
  void update(
      void Function(TeamProgressActivityOverviewResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  TeamProgressActivityOverviewResponse build() => _build();

  _$TeamProgressActivityOverviewResponse _build() {
    _$TeamProgressActivityOverviewResponse _$result;
    try {
      _$result = _$v ??
          _$TeamProgressActivityOverviewResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'TeamProgressActivityOverviewResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'TeamProgressActivityOverviewResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'TeamProgressActivityOverviewResponse',
            _$failedField,
            e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
