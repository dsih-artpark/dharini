// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'members_activity_data_type.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$MembersActivityDataType extends MembersActivityDataType {
  @override
  final BuiltList<VisitDataForEveryMemberType> visits;
  @override
  final num totalNumberOfVisitsAssigned;
  @override
  final String collector;
  @override
  final String id;
  @override
  final num totalNumberOfVisitsPending;
  @override
  final num totalNumberOfVisitsOverDue;

  factory _$MembersActivityDataType(
          [void Function(MembersActivityDataTypeBuilder)? updates]) =>
      (MembersActivityDataTypeBuilder()..update(updates))._build();

  _$MembersActivityDataType._(
      {required this.visits,
      required this.totalNumberOfVisitsAssigned,
      required this.collector,
      required this.id,
      required this.totalNumberOfVisitsPending,
      required this.totalNumberOfVisitsOverDue})
      : super._();
  @override
  MembersActivityDataType rebuild(
          void Function(MembersActivityDataTypeBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  MembersActivityDataTypeBuilder toBuilder() =>
      MembersActivityDataTypeBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is MembersActivityDataType &&
        visits == other.visits &&
        totalNumberOfVisitsAssigned == other.totalNumberOfVisitsAssigned &&
        collector == other.collector &&
        id == other.id &&
        totalNumberOfVisitsPending == other.totalNumberOfVisitsPending &&
        totalNumberOfVisitsOverDue == other.totalNumberOfVisitsOverDue;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, visits.hashCode);
    _$hash = $jc(_$hash, totalNumberOfVisitsAssigned.hashCode);
    _$hash = $jc(_$hash, collector.hashCode);
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, totalNumberOfVisitsPending.hashCode);
    _$hash = $jc(_$hash, totalNumberOfVisitsOverDue.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'MembersActivityDataType')
          ..add('visits', visits)
          ..add('totalNumberOfVisitsAssigned', totalNumberOfVisitsAssigned)
          ..add('collector', collector)
          ..add('id', id)
          ..add('totalNumberOfVisitsPending', totalNumberOfVisitsPending)
          ..add('totalNumberOfVisitsOverDue', totalNumberOfVisitsOverDue))
        .toString();
  }
}

class MembersActivityDataTypeBuilder
    implements
        Builder<MembersActivityDataType, MembersActivityDataTypeBuilder> {
  _$MembersActivityDataType? _$v;

  ListBuilder<VisitDataForEveryMemberType>? _visits;
  ListBuilder<VisitDataForEveryMemberType> get visits =>
      _$this._visits ??= ListBuilder<VisitDataForEveryMemberType>();
  set visits(ListBuilder<VisitDataForEveryMemberType>? visits) =>
      _$this._visits = visits;

  num? _totalNumberOfVisitsAssigned;
  num? get totalNumberOfVisitsAssigned => _$this._totalNumberOfVisitsAssigned;
  set totalNumberOfVisitsAssigned(num? totalNumberOfVisitsAssigned) =>
      _$this._totalNumberOfVisitsAssigned = totalNumberOfVisitsAssigned;

  String? _collector;
  String? get collector => _$this._collector;
  set collector(String? collector) => _$this._collector = collector;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  num? _totalNumberOfVisitsPending;
  num? get totalNumberOfVisitsPending => _$this._totalNumberOfVisitsPending;
  set totalNumberOfVisitsPending(num? totalNumberOfVisitsPending) =>
      _$this._totalNumberOfVisitsPending = totalNumberOfVisitsPending;

  num? _totalNumberOfVisitsOverDue;
  num? get totalNumberOfVisitsOverDue => _$this._totalNumberOfVisitsOverDue;
  set totalNumberOfVisitsOverDue(num? totalNumberOfVisitsOverDue) =>
      _$this._totalNumberOfVisitsOverDue = totalNumberOfVisitsOverDue;

  MembersActivityDataTypeBuilder() {
    MembersActivityDataType._defaults(this);
  }

  MembersActivityDataTypeBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _visits = $v.visits.toBuilder();
      _totalNumberOfVisitsAssigned = $v.totalNumberOfVisitsAssigned;
      _collector = $v.collector;
      _id = $v.id;
      _totalNumberOfVisitsPending = $v.totalNumberOfVisitsPending;
      _totalNumberOfVisitsOverDue = $v.totalNumberOfVisitsOverDue;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(MembersActivityDataType other) {
    _$v = other as _$MembersActivityDataType;
  }

  @override
  void update(void Function(MembersActivityDataTypeBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  MembersActivityDataType build() => _build();

  _$MembersActivityDataType _build() {
    _$MembersActivityDataType _$result;
    try {
      _$result = _$v ??
          _$MembersActivityDataType._(
            visits: visits.build(),
            totalNumberOfVisitsAssigned: BuiltValueNullFieldError.checkNotNull(
                totalNumberOfVisitsAssigned,
                r'MembersActivityDataType',
                'totalNumberOfVisitsAssigned'),
            collector: BuiltValueNullFieldError.checkNotNull(
                collector, r'MembersActivityDataType', 'collector'),
            id: BuiltValueNullFieldError.checkNotNull(
                id, r'MembersActivityDataType', 'id'),
            totalNumberOfVisitsPending: BuiltValueNullFieldError.checkNotNull(
                totalNumberOfVisitsPending,
                r'MembersActivityDataType',
                'totalNumberOfVisitsPending'),
            totalNumberOfVisitsOverDue: BuiltValueNullFieldError.checkNotNull(
                totalNumberOfVisitsOverDue,
                r'MembersActivityDataType',
                'totalNumberOfVisitsOverDue'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'visits';
        visits.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'MembersActivityDataType', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
