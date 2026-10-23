// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'paginated_sample_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$PaginatedSampleResponse extends PaginatedSampleResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final BuiltList<SampleResponseData> data;
  @override
  final num total;
  @override
  final num page;
  @override
  final num limit;
  @override
  final num totalPages;

  factory _$PaginatedSampleResponse(
          [void Function(PaginatedSampleResponseBuilder)? updates]) =>
      (PaginatedSampleResponseBuilder()..update(updates))._build();

  _$PaginatedSampleResponse._(
      {required this.success,
      required this.message,
      required this.data,
      required this.total,
      required this.page,
      required this.limit,
      required this.totalPages})
      : super._();
  @override
  PaginatedSampleResponse rebuild(
          void Function(PaginatedSampleResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  PaginatedSampleResponseBuilder toBuilder() =>
      PaginatedSampleResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is PaginatedSampleResponse &&
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
    return (newBuiltValueToStringHelper(r'PaginatedSampleResponse')
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

class PaginatedSampleResponseBuilder
    implements
        Builder<PaginatedSampleResponse, PaginatedSampleResponseBuilder> {
  _$PaginatedSampleResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  ListBuilder<SampleResponseData>? _data;
  ListBuilder<SampleResponseData> get data =>
      _$this._data ??= ListBuilder<SampleResponseData>();
  set data(ListBuilder<SampleResponseData>? data) => _$this._data = data;

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

  PaginatedSampleResponseBuilder() {
    PaginatedSampleResponse._defaults(this);
  }

  PaginatedSampleResponseBuilder get _$this {
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
  void replace(PaginatedSampleResponse other) {
    _$v = other as _$PaginatedSampleResponse;
  }

  @override
  void update(void Function(PaginatedSampleResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  PaginatedSampleResponse build() => _build();

  _$PaginatedSampleResponse _build() {
    _$PaginatedSampleResponse _$result;
    try {
      _$result = _$v ??
          _$PaginatedSampleResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'PaginatedSampleResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'PaginatedSampleResponse', 'message'),
            data: data.build(),
            total: BuiltValueNullFieldError.checkNotNull(
                total, r'PaginatedSampleResponse', 'total'),
            page: BuiltValueNullFieldError.checkNotNull(
                page, r'PaginatedSampleResponse', 'page'),
            limit: BuiltValueNullFieldError.checkNotNull(
                limit, r'PaginatedSampleResponse', 'limit'),
            totalPages: BuiltValueNullFieldError.checkNotNull(
                totalPages, r'PaginatedSampleResponse', 'totalPages'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'PaginatedSampleResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
