// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'reschedule_visit_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$RescheduleVisitDto extends RescheduleVisitDto {
  @override
  final String newScheduledDate;

  factory _$RescheduleVisitDto(
          [void Function(RescheduleVisitDtoBuilder)? updates]) =>
      (RescheduleVisitDtoBuilder()..update(updates))._build();

  _$RescheduleVisitDto._({required this.newScheduledDate}) : super._();
  @override
  RescheduleVisitDto rebuild(
          void Function(RescheduleVisitDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  RescheduleVisitDtoBuilder toBuilder() =>
      RescheduleVisitDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is RescheduleVisitDto &&
        newScheduledDate == other.newScheduledDate;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, newScheduledDate.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'RescheduleVisitDto')
          ..add('newScheduledDate', newScheduledDate))
        .toString();
  }
}

class RescheduleVisitDtoBuilder
    implements Builder<RescheduleVisitDto, RescheduleVisitDtoBuilder> {
  _$RescheduleVisitDto? _$v;

  String? _newScheduledDate;
  String? get newScheduledDate => _$this._newScheduledDate;
  set newScheduledDate(String? newScheduledDate) =>
      _$this._newScheduledDate = newScheduledDate;

  RescheduleVisitDtoBuilder() {
    RescheduleVisitDto._defaults(this);
  }

  RescheduleVisitDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _newScheduledDate = $v.newScheduledDate;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(RescheduleVisitDto other) {
    _$v = other as _$RescheduleVisitDto;
  }

  @override
  void update(void Function(RescheduleVisitDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  RescheduleVisitDto build() => _build();

  _$RescheduleVisitDto _build() {
    final _$result = _$v ??
        _$RescheduleVisitDto._(
          newScheduledDate: BuiltValueNullFieldError.checkNotNull(
              newScheduledDate, r'RescheduleVisitDto', 'newScheduledDate'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
