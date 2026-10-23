// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'paginated_project_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$PaginatedProjectResponse extends PaginatedProjectResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final BuiltList<ProjectResponseDataExtended> data;
  @override
  final num? total;
  @override
  final num? page;
  @override
  final num? limit;
  @override
  final num? totalPages;

  factory _$PaginatedProjectResponse(
          [void Function(PaginatedProjectResponseBuilder)? updates]) =>
      (PaginatedProjectResponseBuilder()..update(updates))._build();

  _$PaginatedProjectResponse._(
      {required this.success,
      required this.message,
      required this.data,
      this.total,
      this.page,
      this.limit,
      this.totalPages})
      : super._();
  @override
  PaginatedProjectResponse rebuild(
          void Function(PaginatedProjectResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  PaginatedProjectResponseBuilder toBuilder() =>
      PaginatedProjectResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is PaginatedProjectResponse &&
        success == other.success &&
        message == other.message &&
        data == other.data &&
        total == other.total &&
        page == other.page &&
        limit == other.limit &&
        totalPages == other.totalPages;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, success.hashCode);
    _$hash = $jc(_$hash, message.hashCode);
    _$hash = $jc(_$hash, data.hashCode);
    _$hash = $jc(_$hash, total.hashCode);
    _$hash = $jc(_$hash, page.hashCode);
    _$hash = $jc(_$hash, limit.hashCode);
    _$hash = $jc(_$hash, totalPages.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'PaginatedProjectResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data)
          ..add('total', total)
          ..add('page', page)
          ..add('limit', limit)
          ..add('totalPages', totalPages))
        .toString();
  }
}

class PaginatedProjectResponseBuilder
    implements
        Builder<PaginatedProjectResponse, PaginatedProjectResponseBuilder> {
  _$PaginatedProjectResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  ListBuilder<ProjectResponseDataExtended>? _data;
  ListBuilder<ProjectResponseDataExtended> get data =>
      _$this._data ??= ListBuilder<ProjectResponseDataExtended>();
  set data(ListBuilder<ProjectResponseDataExtended>? data) =>
      _$this._data = data;

  num? _total;
  num? get total => _$this._total;
  set total(num? total) => _$this._total = total;

  num? _page;
  num? get page => _$this._page;
  set page(num? page) => _$this._page = page;

  num? _limit;
  num? get limit => _$this._limit;
  set limit(num? limit) => _$this._limit = limit;

  num? _totalPages;
  num? get totalPages => _$this._totalPages;
  set totalPages(num? totalPages) => _$this._totalPages = totalPages;

  PaginatedProjectResponseBuilder() {
    PaginatedProjectResponse._defaults(this);
  }

  PaginatedProjectResponseBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _success = $v.success;
      _message = $v.message;
      _data = $v.data.toBuilder();
      _total = $v.total;
      _page = $v.page;
      _limit = $v.limit;
      _totalPages = $v.totalPages;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(PaginatedProjectResponse other) {
    _$v = other as _$PaginatedProjectResponse;
  }

  @override
  void update(void Function(PaginatedProjectResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  PaginatedProjectResponse build() => _build();

  _$PaginatedProjectResponse _build() {
    _$PaginatedProjectResponse _$result;
    try {
      _$result = _$v ??
          _$PaginatedProjectResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'PaginatedProjectResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'PaginatedProjectResponse', 'message'),
            data: data.build(),
            total: total,
            page: page,
            limit: limit,
            totalPages: totalPages,
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'PaginatedProjectResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
