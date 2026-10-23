import 'package:barrel_files_annotation/barrel_files_annotation.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

@IncludeInBarrelFile()
enum DayOfWeek {
  @JsonValue('MONDAY')
  monday,
  @JsonValue('TUESDAY')
  tuesday,
  @JsonValue('WEDNESDAY')
  wednesday,
  @JsonValue('THURSDAY')
  thursday,
  @JsonValue('FRIDAY')
  friday,
  @JsonValue('SATURDAY')
  saturday,
  @JsonValue('SUNDAY')
  sunday,
}
