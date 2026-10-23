// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'team_member_progress_response_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$TeamMemberProgressResponseData extends TeamMemberProgressResponseData {
  @override
  final String userId;
  @override
  final String firstName;
  @override
  final String lastName;
  @override
  final String siteId;
  @override
  final String siteName;
  @override
  final num pendingVisitCount;
  @override
  final num completedVisitCount;
  @override
  final num totalCollected;
  @override
  final num totalReceived;
  @override
  final num totalExtracted;
  @override
  final num totalTested;
  @override
  final num totalReportGenerated;

  factory _$TeamMemberProgressResponseData(
          [void Function(TeamMemberProgressResponseDataBuilder)? updates]) =>
      (TeamMemberProgressResponseDataBuilder()..update(updates))._build();

  _$TeamMemberProgressResponseData._(
      {required this.userId,
      required this.firstName,
      required this.lastName,
      required this.siteId,
      required this.siteName,
      required this.pendingVisitCount,
      required this.completedVisitCount,
      required this.totalCollected,
      required this.totalReceived,
      required this.totalExtracted,
      required this.totalTested,
      required this.totalReportGenerated})
      : super._();
  @override
  TeamMemberProgressResponseData rebuild(
          void Function(TeamMemberProgressResponseDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  TeamMemberProgressResponseDataBuilder toBuilder() =>
      TeamMemberProgressResponseDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is TeamMemberProgressResponseData &&
        userId == other.userId &&
        firstName == other.firstName &&
        lastName == other.lastName &&
        siteId == other.siteId &&
        siteName == other.siteName &&
        pendingVisitCount == other.pendingVisitCount &&
        completedVisitCount == other.completedVisitCount &&
        totalCollected == other.totalCollected &&
        totalReceived == other.totalReceived &&
        totalExtracted == other.totalExtracted &&
        totalTested == other.totalTested &&
        totalReportGenerated == other.totalReportGenerated;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, userId.hashCode);
    _$hash = $jc(_$hash, firstName.hashCode);
    _$hash = $jc(_$hash, lastName.hashCode);
    _$hash = $jc(_$hash, siteId.hashCode);
    _$hash = $jc(_$hash, siteName.hashCode);
    _$hash = $jc(_$hash, pendingVisitCount.hashCode);
    _$hash = $jc(_$hash, completedVisitCount.hashCode);
    _$hash = $jc(_$hash, totalCollected.hashCode);
    _$hash = $jc(_$hash, totalReceived.hashCode);
    _$hash = $jc(_$hash, totalExtracted.hashCode);
    _$hash = $jc(_$hash, totalTested.hashCode);
    _$hash = $jc(_$hash, totalReportGenerated.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'TeamMemberProgressResponseData')
          ..add('userId', userId)
          ..add('firstName', firstName)
          ..add('lastName', lastName)
          ..add('siteId', siteId)
          ..add('siteName', siteName)
          ..add('pendingVisitCount', pendingVisitCount)
          ..add('completedVisitCount', completedVisitCount)
          ..add('totalCollected', totalCollected)
          ..add('totalReceived', totalReceived)
          ..add('totalExtracted', totalExtracted)
          ..add('totalTested', totalTested)
          ..add('totalReportGenerated', totalReportGenerated))
        .toString();
  }
}

class TeamMemberProgressResponseDataBuilder
    implements
        Builder<TeamMemberProgressResponseData,
            TeamMemberProgressResponseDataBuilder> {
  _$TeamMemberProgressResponseData? _$v;

  String? _userId;
  String? get userId => _$this._userId;
  set userId(String? userId) => _$this._userId = userId;

  String? _firstName;
  String? get firstName => _$this._firstName;
  set firstName(String? firstName) => _$this._firstName = firstName;

  String? _lastName;
  String? get lastName => _$this._lastName;
  set lastName(String? lastName) => _$this._lastName = lastName;

  String? _siteId;
  String? get siteId => _$this._siteId;
  set siteId(String? siteId) => _$this._siteId = siteId;

  String? _siteName;
  String? get siteName => _$this._siteName;
  set siteName(String? siteName) => _$this._siteName = siteName;

  num? _pendingVisitCount;
  num? get pendingVisitCount => _$this._pendingVisitCount;
  set pendingVisitCount(num? pendingVisitCount) =>
      _$this._pendingVisitCount = pendingVisitCount;

  num? _completedVisitCount;
  num? get completedVisitCount => _$this._completedVisitCount;
  set completedVisitCount(num? completedVisitCount) =>
      _$this._completedVisitCount = completedVisitCount;

  num? _totalCollected;
  num? get totalCollected => _$this._totalCollected;
  set totalCollected(num? totalCollected) =>
      _$this._totalCollected = totalCollected;

  num? _totalReceived;
  num? get totalReceived => _$this._totalReceived;
  set totalReceived(num? totalReceived) =>
      _$this._totalReceived = totalReceived;

  num? _totalExtracted;
  num? get totalExtracted => _$this._totalExtracted;
  set totalExtracted(num? totalExtracted) =>
      _$this._totalExtracted = totalExtracted;

  num? _totalTested;
  num? get totalTested => _$this._totalTested;
  set totalTested(num? totalTested) => _$this._totalTested = totalTested;

  num? _totalReportGenerated;
  num? get totalReportGenerated => _$this._totalReportGenerated;
  set totalReportGenerated(num? totalReportGenerated) =>
      _$this._totalReportGenerated = totalReportGenerated;

  TeamMemberProgressResponseDataBuilder() {
    TeamMemberProgressResponseData._defaults(this);
  }

  TeamMemberProgressResponseDataBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _userId = $v.userId;
      _firstName = $v.firstName;
      _lastName = $v.lastName;
      _siteId = $v.siteId;
      _siteName = $v.siteName;
      _pendingVisitCount = $v.pendingVisitCount;
      _completedVisitCount = $v.completedVisitCount;
      _totalCollected = $v.totalCollected;
      _totalReceived = $v.totalReceived;
      _totalExtracted = $v.totalExtracted;
      _totalTested = $v.totalTested;
      _totalReportGenerated = $v.totalReportGenerated;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(TeamMemberProgressResponseData other) {
    _$v = other as _$TeamMemberProgressResponseData;
  }

  @override
  void update(void Function(TeamMemberProgressResponseDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  TeamMemberProgressResponseData build() => _build();

  _$TeamMemberProgressResponseData _build() {
    final _$result = _$v ??
        _$TeamMemberProgressResponseData._(
          userId: BuiltValueNullFieldError.checkNotNull(
              userId, r'TeamMemberProgressResponseData', 'userId'),
          firstName: BuiltValueNullFieldError.checkNotNull(
              firstName, r'TeamMemberProgressResponseData', 'firstName'),
          lastName: BuiltValueNullFieldError.checkNotNull(
              lastName, r'TeamMemberProgressResponseData', 'lastName'),
          siteId: BuiltValueNullFieldError.checkNotNull(
              siteId, r'TeamMemberProgressResponseData', 'siteId'),
          siteName: BuiltValueNullFieldError.checkNotNull(
              siteName, r'TeamMemberProgressResponseData', 'siteName'),
          pendingVisitCount: BuiltValueNullFieldError.checkNotNull(
              pendingVisitCount,
              r'TeamMemberProgressResponseData',
              'pendingVisitCount'),
          completedVisitCount: BuiltValueNullFieldError.checkNotNull(
              completedVisitCount,
              r'TeamMemberProgressResponseData',
              'completedVisitCount'),
          totalCollected: BuiltValueNullFieldError.checkNotNull(totalCollected,
              r'TeamMemberProgressResponseData', 'totalCollected'),
          totalReceived: BuiltValueNullFieldError.checkNotNull(totalReceived,
              r'TeamMemberProgressResponseData', 'totalReceived'),
          totalExtracted: BuiltValueNullFieldError.checkNotNull(totalExtracted,
              r'TeamMemberProgressResponseData', 'totalExtracted'),
          totalTested: BuiltValueNullFieldError.checkNotNull(
              totalTested, r'TeamMemberProgressResponseData', 'totalTested'),
          totalReportGenerated: BuiltValueNullFieldError.checkNotNull(
              totalReportGenerated,
              r'TeamMemberProgressResponseData',
              'totalReportGenerated'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
