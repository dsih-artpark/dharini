// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'team_member_activity_response_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$TeamMemberActivityResponseData extends TeamMemberActivityResponseData {
  @override
  final String id;
  @override
  final String firstName;
  @override
  final String lastName;
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

  factory _$TeamMemberActivityResponseData(
          [void Function(TeamMemberActivityResponseDataBuilder)? updates]) =>
      (TeamMemberActivityResponseDataBuilder()..update(updates))._build();

  _$TeamMemberActivityResponseData._(
      {required this.id,
      required this.firstName,
      required this.lastName,
      required this.totalCollected,
      required this.totalReceived,
      required this.totalExtracted,
      required this.totalTested,
      required this.totalReportGenerated})
      : super._();
  @override
  TeamMemberActivityResponseData rebuild(
          void Function(TeamMemberActivityResponseDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  TeamMemberActivityResponseDataBuilder toBuilder() =>
      TeamMemberActivityResponseDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is TeamMemberActivityResponseData &&
        id == other.id &&
        firstName == other.firstName &&
        lastName == other.lastName &&
        totalCollected == other.totalCollected &&
        totalReceived == other.totalReceived &&
        totalExtracted == other.totalExtracted &&
        totalTested == other.totalTested &&
        totalReportGenerated == other.totalReportGenerated;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, firstName.hashCode);
    _$hash = $jc(_$hash, lastName.hashCode);
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
    return (newBuiltValueToStringHelper(r'TeamMemberActivityResponseData')
          ..add('id', id)
          ..add('firstName', firstName)
          ..add('lastName', lastName)
          ..add('totalCollected', totalCollected)
          ..add('totalReceived', totalReceived)
          ..add('totalExtracted', totalExtracted)
          ..add('totalTested', totalTested)
          ..add('totalReportGenerated', totalReportGenerated))
        .toString();
  }
}

class TeamMemberActivityResponseDataBuilder
    implements
        Builder<TeamMemberActivityResponseData,
            TeamMemberActivityResponseDataBuilder> {
  _$TeamMemberActivityResponseData? _$v;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  String? _firstName;
  String? get firstName => _$this._firstName;
  set firstName(String? firstName) => _$this._firstName = firstName;

  String? _lastName;
  String? get lastName => _$this._lastName;
  set lastName(String? lastName) => _$this._lastName = lastName;

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

  TeamMemberActivityResponseDataBuilder() {
    TeamMemberActivityResponseData._defaults(this);
  }

  TeamMemberActivityResponseDataBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _firstName = $v.firstName;
      _lastName = $v.lastName;
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
  void replace(TeamMemberActivityResponseData other) {
    _$v = other as _$TeamMemberActivityResponseData;
  }

  @override
  void update(void Function(TeamMemberActivityResponseDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  TeamMemberActivityResponseData build() => _build();

  _$TeamMemberActivityResponseData _build() {
    final _$result = _$v ??
        _$TeamMemberActivityResponseData._(
          id: BuiltValueNullFieldError.checkNotNull(
              id, r'TeamMemberActivityResponseData', 'id'),
          firstName: BuiltValueNullFieldError.checkNotNull(
              firstName, r'TeamMemberActivityResponseData', 'firstName'),
          lastName: BuiltValueNullFieldError.checkNotNull(
              lastName, r'TeamMemberActivityResponseData', 'lastName'),
          totalCollected: BuiltValueNullFieldError.checkNotNull(totalCollected,
              r'TeamMemberActivityResponseData', 'totalCollected'),
          totalReceived: BuiltValueNullFieldError.checkNotNull(totalReceived,
              r'TeamMemberActivityResponseData', 'totalReceived'),
          totalExtracted: BuiltValueNullFieldError.checkNotNull(totalExtracted,
              r'TeamMemberActivityResponseData', 'totalExtracted'),
          totalTested: BuiltValueNullFieldError.checkNotNull(
              totalTested, r'TeamMemberActivityResponseData', 'totalTested'),
          totalReportGenerated: BuiltValueNullFieldError.checkNotNull(
              totalReportGenerated,
              r'TeamMemberActivityResponseData',
              'totalReportGenerated'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
