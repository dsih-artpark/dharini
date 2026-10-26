// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_multiple_lab_test_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$CreateMultipleLabTestDto extends CreateMultipleLabTestDto {
  @override
  final BuiltList<CreateLabTestDto> labTests;

  factory _$CreateMultipleLabTestDto(
          [void Function(CreateMultipleLabTestDtoBuilder)? updates]) =>
      (CreateMultipleLabTestDtoBuilder()..update(updates))._build();

  _$CreateMultipleLabTestDto._({required this.labTests}) : super._();
  @override
  CreateMultipleLabTestDto rebuild(
          void Function(CreateMultipleLabTestDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  CreateMultipleLabTestDtoBuilder toBuilder() =>
      CreateMultipleLabTestDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is CreateMultipleLabTestDto && labTests == other.labTests;
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
    return (newBuiltValueToStringHelper(r'CreateMultipleLabTestDto')
          ..add('labTests', labTests))
        .toString();
  }
}

class CreateMultipleLabTestDtoBuilder
    implements
        Builder<CreateMultipleLabTestDto, CreateMultipleLabTestDtoBuilder> {
  _$CreateMultipleLabTestDto? _$v;

  ListBuilder<CreateLabTestDto>? _labTests;
  ListBuilder<CreateLabTestDto> get labTests =>
      _$this._labTests ??= ListBuilder<CreateLabTestDto>();
  set labTests(ListBuilder<CreateLabTestDto>? labTests) =>
      _$this._labTests = labTests;

  CreateMultipleLabTestDtoBuilder() {
    CreateMultipleLabTestDto._defaults(this);
  }

  CreateMultipleLabTestDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _labTests = $v.labTests.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(CreateMultipleLabTestDto other) {
    _$v = other as _$CreateMultipleLabTestDto;
  }

  @override
  void update(void Function(CreateMultipleLabTestDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  CreateMultipleLabTestDto build() => _build();

  _$CreateMultipleLabTestDto _build() {
    _$CreateMultipleLabTestDto _$result;
    try {
      _$result = _$v ??
          _$CreateMultipleLabTestDto._(
            labTests: labTests.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'labTests';
        labTests.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'CreateMultipleLabTestDto', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
