// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'visit_data_for_every_member_type.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const VisitDataForEveryMemberTypeVisitStatusEnum
    _$visitDataForEveryMemberTypeVisitStatusEnum_upcoming =
    const VisitDataForEveryMemberTypeVisitStatusEnum._('upcoming');
const VisitDataForEveryMemberTypeVisitStatusEnum
    _$visitDataForEveryMemberTypeVisitStatusEnum_overdue =
    const VisitDataForEveryMemberTypeVisitStatusEnum._('overdue');
const VisitDataForEveryMemberTypeVisitStatusEnum
    _$visitDataForEveryMemberTypeVisitStatusEnum_skipped =
    const VisitDataForEveryMemberTypeVisitStatusEnum._('skipped');
const VisitDataForEveryMemberTypeVisitStatusEnum
    _$visitDataForEveryMemberTypeVisitStatusEnum_completed =
    const VisitDataForEveryMemberTypeVisitStatusEnum._('completed');
const VisitDataForEveryMemberTypeVisitStatusEnum
    _$visitDataForEveryMemberTypeVisitStatusEnum_unknownDefaultOpenApi =
    const VisitDataForEveryMemberTypeVisitStatusEnum._('unknownDefaultOpenApi');

VisitDataForEveryMemberTypeVisitStatusEnum
    _$visitDataForEveryMemberTypeVisitStatusEnumValueOf(String name) {
  switch (name) {
    case 'upcoming':
      return _$visitDataForEveryMemberTypeVisitStatusEnum_upcoming;
    case 'overdue':
      return _$visitDataForEveryMemberTypeVisitStatusEnum_overdue;
    case 'skipped':
      return _$visitDataForEveryMemberTypeVisitStatusEnum_skipped;
    case 'completed':
      return _$visitDataForEveryMemberTypeVisitStatusEnum_completed;
    case 'unknownDefaultOpenApi':
      return _$visitDataForEveryMemberTypeVisitStatusEnum_unknownDefaultOpenApi;
    default:
      return _$visitDataForEveryMemberTypeVisitStatusEnum_unknownDefaultOpenApi;
  }
}

final BuiltSet<VisitDataForEveryMemberTypeVisitStatusEnum>
    _$visitDataForEveryMemberTypeVisitStatusEnumValues = BuiltSet<
        VisitDataForEveryMemberTypeVisitStatusEnum>(const <VisitDataForEveryMemberTypeVisitStatusEnum>[
  _$visitDataForEveryMemberTypeVisitStatusEnum_upcoming,
  _$visitDataForEveryMemberTypeVisitStatusEnum_overdue,
  _$visitDataForEveryMemberTypeVisitStatusEnum_skipped,
  _$visitDataForEveryMemberTypeVisitStatusEnum_completed,
  _$visitDataForEveryMemberTypeVisitStatusEnum_unknownDefaultOpenApi,
]);

Serializer<VisitDataForEveryMemberTypeVisitStatusEnum>
    _$visitDataForEveryMemberTypeVisitStatusEnumSerializer =
    _$VisitDataForEveryMemberTypeVisitStatusEnumSerializer();

class _$VisitDataForEveryMemberTypeVisitStatusEnumSerializer
    implements PrimitiveSerializer<VisitDataForEveryMemberTypeVisitStatusEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'upcoming': 'upcoming',
    'overdue': 'overdue',
    'skipped': 'skipped',
    'completed': 'completed',
    'unknownDefaultOpenApi': 'unknown_default_open_api',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'upcoming': 'upcoming',
    'overdue': 'overdue',
    'skipped': 'skipped',
    'completed': 'completed',
    'unknown_default_open_api': 'unknownDefaultOpenApi',
  };

  @override
  final Iterable<Type> types = const <Type>[
    VisitDataForEveryMemberTypeVisitStatusEnum
  ];
  @override
  final String wireName = 'VisitDataForEveryMemberTypeVisitStatusEnum';

  @override
  Object serialize(Serializers serializers,
          VisitDataForEveryMemberTypeVisitStatusEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  VisitDataForEveryMemberTypeVisitStatusEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      VisitDataForEveryMemberTypeVisitStatusEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$VisitDataForEveryMemberType extends VisitDataForEveryMemberType {
  @override
  final String siteName;
  @override
  final String siteAddress;
  @override
  final String siteState;
  @override
  final String siteDistrict;
  @override
  final DateTime visitScheduledAt;
  @override
  final VisitDataForEveryMemberTypeVisitStatusEnum visitStatus;

  factory _$VisitDataForEveryMemberType(
          [void Function(VisitDataForEveryMemberTypeBuilder)? updates]) =>
      (VisitDataForEveryMemberTypeBuilder()..update(updates))._build();

  _$VisitDataForEveryMemberType._(
      {required this.siteName,
      required this.siteAddress,
      required this.siteState,
      required this.siteDistrict,
      required this.visitScheduledAt,
      required this.visitStatus})
      : super._();
  @override
  VisitDataForEveryMemberType rebuild(
          void Function(VisitDataForEveryMemberTypeBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  VisitDataForEveryMemberTypeBuilder toBuilder() =>
      VisitDataForEveryMemberTypeBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is VisitDataForEveryMemberType &&
        siteName == other.siteName &&
        siteAddress == other.siteAddress &&
        siteState == other.siteState &&
        siteDistrict == other.siteDistrict &&
        visitScheduledAt == other.visitScheduledAt &&
        visitStatus == other.visitStatus;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, siteName.hashCode);
    _$hash = $jc(_$hash, siteAddress.hashCode);
    _$hash = $jc(_$hash, siteState.hashCode);
    _$hash = $jc(_$hash, siteDistrict.hashCode);
    _$hash = $jc(_$hash, visitScheduledAt.hashCode);
    _$hash = $jc(_$hash, visitStatus.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'VisitDataForEveryMemberType')
          ..add('siteName', siteName)
          ..add('siteAddress', siteAddress)
          ..add('siteState', siteState)
          ..add('siteDistrict', siteDistrict)
          ..add('visitScheduledAt', visitScheduledAt)
          ..add('visitStatus', visitStatus))
        .toString();
  }
}

class VisitDataForEveryMemberTypeBuilder
    implements
        Builder<VisitDataForEveryMemberType,
            VisitDataForEveryMemberTypeBuilder> {
  _$VisitDataForEveryMemberType? _$v;

  String? _siteName;
  String? get siteName => _$this._siteName;
  set siteName(String? siteName) => _$this._siteName = siteName;

  String? _siteAddress;
  String? get siteAddress => _$this._siteAddress;
  set siteAddress(String? siteAddress) => _$this._siteAddress = siteAddress;

  String? _siteState;
  String? get siteState => _$this._siteState;
  set siteState(String? siteState) => _$this._siteState = siteState;

  String? _siteDistrict;
  String? get siteDistrict => _$this._siteDistrict;
  set siteDistrict(String? siteDistrict) => _$this._siteDistrict = siteDistrict;

  DateTime? _visitScheduledAt;
  DateTime? get visitScheduledAt => _$this._visitScheduledAt;
  set visitScheduledAt(DateTime? visitScheduledAt) =>
      _$this._visitScheduledAt = visitScheduledAt;

  VisitDataForEveryMemberTypeVisitStatusEnum? _visitStatus;
  VisitDataForEveryMemberTypeVisitStatusEnum? get visitStatus =>
      _$this._visitStatus;
  set visitStatus(VisitDataForEveryMemberTypeVisitStatusEnum? visitStatus) =>
      _$this._visitStatus = visitStatus;

  VisitDataForEveryMemberTypeBuilder() {
    VisitDataForEveryMemberType._defaults(this);
  }

  VisitDataForEveryMemberTypeBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _siteName = $v.siteName;
      _siteAddress = $v.siteAddress;
      _siteState = $v.siteState;
      _siteDistrict = $v.siteDistrict;
      _visitScheduledAt = $v.visitScheduledAt;
      _visitStatus = $v.visitStatus;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(VisitDataForEveryMemberType other) {
    _$v = other as _$VisitDataForEveryMemberType;
  }

  @override
  void update(void Function(VisitDataForEveryMemberTypeBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  VisitDataForEveryMemberType build() => _build();

  _$VisitDataForEveryMemberType _build() {
    final _$result = _$v ??
        _$VisitDataForEveryMemberType._(
          siteName: BuiltValueNullFieldError.checkNotNull(
              siteName, r'VisitDataForEveryMemberType', 'siteName'),
          siteAddress: BuiltValueNullFieldError.checkNotNull(
              siteAddress, r'VisitDataForEveryMemberType', 'siteAddress'),
          siteState: BuiltValueNullFieldError.checkNotNull(
              siteState, r'VisitDataForEveryMemberType', 'siteState'),
          siteDistrict: BuiltValueNullFieldError.checkNotNull(
              siteDistrict, r'VisitDataForEveryMemberType', 'siteDistrict'),
          visitScheduledAt: BuiltValueNullFieldError.checkNotNull(
              visitScheduledAt,
              r'VisitDataForEveryMemberType',
              'visitScheduledAt'),
          visitStatus: BuiltValueNullFieldError.checkNotNull(
              visitStatus, r'VisitDataForEveryMemberType', 'visitStatus'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
