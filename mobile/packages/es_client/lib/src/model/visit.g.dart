// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'visit.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$Visit extends Visit {
  @override
  final DateTime? visitStartedAt;
  @override
  final VisitStatus visitStatus;
  @override
  final User? visitedBy;
  @override
  final User? collector;
  @override
  final String id;
  @override
  final DateTime? visitedAt;
  @override
  final DateTime visitScheduledAt;
  @override
  final String? comment;
  @override
  final bool isCompleted;
  @override
  final DateTime? rescheduledFrom;
  @override
  final DateTime createdAt;
  @override
  final DateTime updatedAt;

  factory _$Visit([void Function(VisitBuilder)? updates]) =>
      (VisitBuilder()..update(updates))._build();

  _$Visit._(
      {this.visitStartedAt,
      required this.visitStatus,
      this.visitedBy,
      this.collector,
      required this.id,
      this.visitedAt,
      required this.visitScheduledAt,
      this.comment,
      required this.isCompleted,
      this.rescheduledFrom,
      required this.createdAt,
      required this.updatedAt})
      : super._();
  @override
  Visit rebuild(void Function(VisitBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  VisitBuilder toBuilder() => VisitBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is Visit &&
        visitStartedAt == other.visitStartedAt &&
        visitStatus == other.visitStatus &&
        visitedBy == other.visitedBy &&
        collector == other.collector &&
        id == other.id &&
        visitedAt == other.visitedAt &&
        visitScheduledAt == other.visitScheduledAt &&
        comment == other.comment &&
        isCompleted == other.isCompleted &&
        rescheduledFrom == other.rescheduledFrom &&
        createdAt == other.createdAt &&
        updatedAt == other.updatedAt;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, visitStartedAt.hashCode);
    _$hash = $jc(_$hash, visitStatus.hashCode);
    _$hash = $jc(_$hash, visitedBy.hashCode);
    _$hash = $jc(_$hash, collector.hashCode);
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, visitedAt.hashCode);
    _$hash = $jc(_$hash, visitScheduledAt.hashCode);
    _$hash = $jc(_$hash, comment.hashCode);
    _$hash = $jc(_$hash, isCompleted.hashCode);
    _$hash = $jc(_$hash, rescheduledFrom.hashCode);
    _$hash = $jc(_$hash, createdAt.hashCode);
    _$hash = $jc(_$hash, updatedAt.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'Visit')
          ..add('visitStartedAt', visitStartedAt)
          ..add('visitStatus', visitStatus)
          ..add('visitedBy', visitedBy)
          ..add('collector', collector)
          ..add('id', id)
          ..add('visitedAt', visitedAt)
          ..add('visitScheduledAt', visitScheduledAt)
          ..add('comment', comment)
          ..add('isCompleted', isCompleted)
          ..add('rescheduledFrom', rescheduledFrom)
          ..add('createdAt', createdAt)
          ..add('updatedAt', updatedAt))
        .toString();
  }
}

class VisitBuilder implements Builder<Visit, VisitBuilder> {
  _$Visit? _$v;

  DateTime? _visitStartedAt;
  DateTime? get visitStartedAt => _$this._visitStartedAt;
  set visitStartedAt(DateTime? visitStartedAt) =>
      _$this._visitStartedAt = visitStartedAt;

  VisitStatus? _visitStatus;
  VisitStatus? get visitStatus => _$this._visitStatus;
  set visitStatus(VisitStatus? visitStatus) =>
      _$this._visitStatus = visitStatus;

  UserBuilder? _visitedBy;
  UserBuilder get visitedBy => _$this._visitedBy ??= UserBuilder();
  set visitedBy(UserBuilder? visitedBy) => _$this._visitedBy = visitedBy;

  UserBuilder? _collector;
  UserBuilder get collector => _$this._collector ??= UserBuilder();
  set collector(UserBuilder? collector) => _$this._collector = collector;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  DateTime? _visitedAt;
  DateTime? get visitedAt => _$this._visitedAt;
  set visitedAt(DateTime? visitedAt) => _$this._visitedAt = visitedAt;

  DateTime? _visitScheduledAt;
  DateTime? get visitScheduledAt => _$this._visitScheduledAt;
  set visitScheduledAt(DateTime? visitScheduledAt) =>
      _$this._visitScheduledAt = visitScheduledAt;

  String? _comment;
  String? get comment => _$this._comment;
  set comment(String? comment) => _$this._comment = comment;

  bool? _isCompleted;
  bool? get isCompleted => _$this._isCompleted;
  set isCompleted(bool? isCompleted) => _$this._isCompleted = isCompleted;

  DateTime? _rescheduledFrom;
  DateTime? get rescheduledFrom => _$this._rescheduledFrom;
  set rescheduledFrom(DateTime? rescheduledFrom) =>
      _$this._rescheduledFrom = rescheduledFrom;

  DateTime? _createdAt;
  DateTime? get createdAt => _$this._createdAt;
  set createdAt(DateTime? createdAt) => _$this._createdAt = createdAt;

  DateTime? _updatedAt;
  DateTime? get updatedAt => _$this._updatedAt;
  set updatedAt(DateTime? updatedAt) => _$this._updatedAt = updatedAt;

  VisitBuilder() {
    Visit._defaults(this);
  }

  VisitBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _visitStartedAt = $v.visitStartedAt;
      _visitStatus = $v.visitStatus;
      _visitedBy = $v.visitedBy?.toBuilder();
      _collector = $v.collector?.toBuilder();
      _id = $v.id;
      _visitedAt = $v.visitedAt;
      _visitScheduledAt = $v.visitScheduledAt;
      _comment = $v.comment;
      _isCompleted = $v.isCompleted;
      _rescheduledFrom = $v.rescheduledFrom;
      _createdAt = $v.createdAt;
      _updatedAt = $v.updatedAt;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(Visit other) {
    _$v = other as _$Visit;
  }

  @override
  void update(void Function(VisitBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  Visit build() => _build();

  _$Visit _build() {
    _$Visit _$result;
    try {
      _$result = _$v ??
          _$Visit._(
            visitStartedAt: visitStartedAt,
            visitStatus: BuiltValueNullFieldError.checkNotNull(
                visitStatus, r'Visit', 'visitStatus'),
            visitedBy: _visitedBy?.build(),
            collector: _collector?.build(),
            id: BuiltValueNullFieldError.checkNotNull(id, r'Visit', 'id'),
            visitedAt: visitedAt,
            visitScheduledAt: BuiltValueNullFieldError.checkNotNull(
                visitScheduledAt, r'Visit', 'visitScheduledAt'),
            comment: comment,
            isCompleted: BuiltValueNullFieldError.checkNotNull(
                isCompleted, r'Visit', 'isCompleted'),
            rescheduledFrom: rescheduledFrom,
            createdAt: BuiltValueNullFieldError.checkNotNull(
                createdAt, r'Visit', 'createdAt'),
            updatedAt: BuiltValueNullFieldError.checkNotNull(
                updatedAt, r'Visit', 'updatedAt'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'visitedBy';
        _visitedBy?.build();
        _$failedField = 'collector';
        _collector?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(r'Visit', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
