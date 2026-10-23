// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_multiple_lab_test_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$UpdateMultipleLabTestDto extends UpdateMultipleLabTestDto {
  @override
  final BuiltList<UpdateLabTestDto> labTests;

  factory _$UpdateMultipleLabTestDto(
          [void Function(UpdateMultipleLabTestDtoBuilder)? updates]) =>
      (UpdateMultipleLabTestDtoBuilder()..update(updates))._build();

  _$UpdateMultipleLabTestDto._({required this.labTests}) : super._();
  @override
  UpdateMultipleLabTestDto rebuild(
          void Function(UpdateMultipleLabTestDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UpdateMultipleLabTestDtoBuilder toBuilder() =>
      UpdateMultipleLabTestDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UpdateMultipleLabTestDto && labTests == other.labTests;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, labTests.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'UpdateMultipleLabTestDto')
          ..add('labTests', labTests))
        .toString();
  }
}

class UpdateMultipleLabTestDtoBuilder
    implements
        Builder<UpdateMultipleLabTestDto, UpdateMultipleLabTestDtoBuilder> {
  _$UpdateMultipleLabTestDto? _$v;

  ListBuilder<UpdateLabTestDto>? _labTests;
  ListBuilder<UpdateLabTestDto> get labTests =>
      _$this._labTests ??= ListBuilder<UpdateLabTestDto>();
  set labTests(ListBuilder<UpdateLabTestDto>? labTests) =>
      _$this._labTests = labTests;

  UpdateMultipleLabTestDtoBuilder() {
    UpdateMultipleLabTestDto._defaults(this);
  }

  UpdateMultipleLabTestDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _labTests = $v.labTests.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(UpdateMultipleLabTestDto other) {
    _$v = other as _$UpdateMultipleLabTestDto;
  }

  @override
  void update(void Function(UpdateMultipleLabTestDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UpdateMultipleLabTestDto build() => _build();

  _$UpdateMultipleLabTestDto _build() {
    _$UpdateMultipleLabTestDto _$result;
    try {
      _$result = _$v ??
          _$UpdateMultipleLabTestDto._(
            labTests: labTests.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'labTests';
        labTests.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'UpdateMultipleLabTestDto', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
