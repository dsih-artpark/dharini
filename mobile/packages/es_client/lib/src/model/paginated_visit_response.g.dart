// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'paginated_visit_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$PaginatedVisitResponse extends PaginatedVisitResponse {
  @override
  final num? totalPages;
  @override
  final bool success;
  @override
  final String message;
  @override
  final BuiltList<VisitResponseData> data;
  @override
  final num total;
  @override
  final num page;
  @override
  final num limit;

  factory _$PaginatedVisitResponse(
          [void Function(PaginatedVisitResponseBuilder)? updates]) =>
      (PaginatedVisitResponseBuilder()..update(updates))._build();

  _$PaginatedVisitResponse._(
      {this.totalPages,
      required this.success,
      required this.message,
      required this.data,
      required this.total,
      required this.page,
      required this.limit})
      : super._();
  @override
  PaginatedVisitResponse rebuild(
          void Function(PaginatedVisitResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  PaginatedVisitResponseBuilder toBuilder() =>
      PaginatedVisitResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is PaginatedVisitResponse &&
        totalPages == other.totalPages &&
        success == other.success &&
        message == other.message &&
        data == other.data &&
        total == other.total &&
        page == other.page &&
        limit == other.limit;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, totalPages.hashCode);
    _$hash = $jc(_$hash, success.hashCode);
    _$hash = $jc(_$hash, message.hashCode);
    _$hash = $jc(_$hash, data.hashCode);
    _$hash = $jc(_$hash, total.hashCode);
    _$hash = $jc(_$hash, page.hashCode);
    _$hash = $jc(_$hash, limit.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'PaginatedVisitResponse')
          ..add('totalPages', totalPages)
          ..add('success', success)
          ..add('message', message)
          ..add('data', data)
          ..add('total', total)
          ..add('page', page)
          ..add('limit', limit))
        .toString();
  }
}

class PaginatedVisitResponseBuilder
    implements Builder<PaginatedVisitResponse, PaginatedVisitResponseBuilder> {
  _$PaginatedVisitResponse? _$v;

  num? _totalPages;
  num? get totalPages => _$this._totalPages;
  set totalPages(num? totalPages) => _$this._totalPages = totalPages;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  ListBuilder<VisitResponseData>? _data;
  ListBuilder<VisitResponseData> get data =>
      _$this._data ??= ListBuilder<VisitResponseData>();
  set data(ListBuilder<VisitResponseData>? data) => _$this._data = data;

  num? _total;
  num? get total => _$this._total;
  set total(num? total) => _$this._total = total;

  num? _page;
  num? get page => _$this._page;
  set page(num? page) => _$this._page = page;

  num? _limit;
  num? get limit => _$this._limit;
  set limit(num? limit) => _$this._limit = limit;

  PaginatedVisitResponseBuilder() {
    PaginatedVisitResponse._defaults(this);
  }

  PaginatedVisitResponseBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _totalPages = $v.totalPages;
      _success = $v.success;
      _message = $v.message;
      _data = $v.data.toBuilder();
      _total = $v.total;
      _page = $v.page;
      _limit = $v.limit;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(PaginatedVisitResponse other) {
    _$v = other as _$PaginatedVisitResponse;
  }

  @override
  void update(void Function(PaginatedVisitResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  PaginatedVisitResponse build() => _build();

  _$PaginatedVisitResponse _build() {
    _$PaginatedVisitResponse _$result;
    try {
      _$result = _$v ??
          _$PaginatedVisitResponse._(
            totalPages: totalPages,
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'PaginatedVisitResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'PaginatedVisitResponse', 'message'),
            data: data.build(),
            total: BuiltValueNullFieldError.checkNotNull(
                total, r'PaginatedVisitResponse', 'total'),
            page: BuiltValueNullFieldError.checkNotNull(
                page, r'PaginatedVisitResponse', 'page'),
            limit: BuiltValueNullFieldError.checkNotNull(
                limit, r'PaginatedVisitResponse', 'limit'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'PaginatedVisitResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
