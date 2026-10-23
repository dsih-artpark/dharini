// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'visit_response_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$VisitResponseData extends VisitResponseData {
  @override
  final DateTime? visitStartedAt;
  @override
  final VisitStatus visitStatus;
  @override
  final num? round;
  @override
  final BuiltList<SuspectedPositivesData>? suspectedPositives;
  @override
  final VisitSiteData site;
  @override
  final BuiltList<VisitSampleData> samples;
  @override
  final User? collector;
  @override
  final User? visitedBy;
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

  factory _$VisitResponseData(
          [void Function(VisitResponseDataBuilder)? updates]) =>
      (VisitResponseDataBuilder()..update(updates))._build();

  _$VisitResponseData._(
      {this.visitStartedAt,
      required this.visitStatus,
      this.round,
      this.suspectedPositives,
      required this.site,
      required this.samples,
      this.collector,
      this.visitedBy,
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
  VisitResponseData rebuild(void Function(VisitResponseDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  VisitResponseDataBuilder toBuilder() =>
      VisitResponseDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is VisitResponseData &&
        visitStartedAt == other.visitStartedAt &&
        visitStatus == other.visitStatus &&
        round == other.round &&
        suspectedPositives == other.suspectedPositives &&
        site == other.site &&
        samples == other.samples &&
        collector == other.collector &&
        visitedBy == other.visitedBy &&
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
    _$hash = $jc(_$hash, round.hashCode);
    _$hash = $jc(_$hash, suspectedPositives.hashCode);
    _$hash = $jc(_$hash, site.hashCode);
    _$hash = $jc(_$hash, samples.hashCode);
    _$hash = $jc(_$hash, collector.hashCode);
    _$hash = $jc(_$hash, visitedBy.hashCode);
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
    return (newBuiltValueToStringHelper(r'VisitResponseData')
          ..add('visitStartedAt', visitStartedAt)
          ..add('visitStatus', visitStatus)
          ..add('round', round)
          ..add('suspectedPositives', suspectedPositives)
          ..add('site', site)
          ..add('samples', samples)
          ..add('collector', collector)
          ..add('visitedBy', visitedBy)
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

class VisitResponseDataBuilder
    implements Builder<VisitResponseData, VisitResponseDataBuilder> {
  _$VisitResponseData? _$v;

  DateTime? _visitStartedAt;
  DateTime? get visitStartedAt => _$this._visitStartedAt;
  set visitStartedAt(DateTime? visitStartedAt) =>
      _$this._visitStartedAt = visitStartedAt;

  VisitStatus? _visitStatus;
  VisitStatus? get visitStatus => _$this._visitStatus;
  set visitStatus(VisitStatus? visitStatus) =>
      _$this._visitStatus = visitStatus;

  num? _round;
  num? get round => _$this._round;
  set round(num? round) => _$this._round = round;

  ListBuilder<SuspectedPositivesData>? _suspectedPositives;
  ListBuilder<SuspectedPositivesData> get suspectedPositives =>
      _$this._suspectedPositives ??= ListBuilder<SuspectedPositivesData>();
  set suspectedPositives(
          ListBuilder<SuspectedPositivesData>? suspectedPositives) =>
      _$this._suspectedPositives = suspectedPositives;

  VisitSiteDataBuilder? _site;
  VisitSiteDataBuilder get site => _$this._site ??= VisitSiteDataBuilder();
  set site(VisitSiteDataBuilder? site) => _$this._site = site;

  ListBuilder<VisitSampleData>? _samples;
  ListBuilder<VisitSampleData> get samples =>
      _$this._samples ??= ListBuilder<VisitSampleData>();
  set samples(ListBuilder<VisitSampleData>? samples) =>
      _$this._samples = samples;

  UserBuilder? _collector;
  UserBuilder get collector => _$this._collector ??= UserBuilder();
  set collector(UserBuilder? collector) => _$this._collector = collector;

  UserBuilder? _visitedBy;
  UserBuilder get visitedBy => _$this._visitedBy ??= UserBuilder();
  set visitedBy(UserBuilder? visitedBy) => _$this._visitedBy = visitedBy;

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

  VisitResponseDataBuilder() {
    VisitResponseData._defaults(this);
  }

  VisitResponseDataBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _visitStartedAt = $v.visitStartedAt;
      _visitStatus = $v.visitStatus;
      _round = $v.round;
      _suspectedPositives = $v.suspectedPositives?.toBuilder();
      _site = $v.site.toBuilder();
      _samples = $v.samples.toBuilder();
      _collector = $v.collector?.toBuilder();
      _visitedBy = $v.visitedBy?.toBuilder();
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
  void replace(VisitResponseData other) {
    _$v = other as _$VisitResponseData;
  }

  @override
  void update(void Function(VisitResponseDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  VisitResponseData build() => _build();

  _$VisitResponseData _build() {
    _$VisitResponseData _$result;
    try {
      _$result = _$v ??
          _$VisitResponseData._(
            visitStartedAt: visitStartedAt,
            visitStatus: BuiltValueNullFieldError.checkNotNull(
                visitStatus, r'VisitResponseData', 'visitStatus'),
            round: round,
            suspectedPositives: _suspectedPositives?.build(),
            site: site.build(),
            samples: samples.build(),
            collector: _collector?.build(),
            visitedBy: _visitedBy?.build(),
            id: BuiltValueNullFieldError.checkNotNull(
                id, r'VisitResponseData', 'id'),
            visitedAt: visitedAt,
            visitScheduledAt: BuiltValueNullFieldError.checkNotNull(
                visitScheduledAt, r'VisitResponseData', 'visitScheduledAt'),
            comment: comment,
            isCompleted: BuiltValueNullFieldError.checkNotNull(
                isCompleted, r'VisitResponseData', 'isCompleted'),
            rescheduledFrom: rescheduledFrom,
            createdAt: BuiltValueNullFieldError.checkNotNull(
                createdAt, r'VisitResponseData', 'createdAt'),
            updatedAt: BuiltValueNullFieldError.checkNotNull(
                updatedAt, r'VisitResponseData', 'updatedAt'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'suspectedPositives';
        _suspectedPositives?.build();
        _$failedField = 'site';
        site.build();
        _$failedField = 'samples';
        samples.build();
        _$failedField = 'collector';
        _collector?.build();
        _$failedField = 'visitedBy';
        _visitedBy?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'VisitResponseData', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
