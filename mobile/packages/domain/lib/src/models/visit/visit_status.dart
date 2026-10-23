import 'package:barrel_files_annotation/barrel_files_annotation.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

@includeInBarrelFile
enum VisitStatus {
  @JsonValue('UPCOMING')
  upcoming,
  @JsonValue('COMPLETED')
  completed,
  @JsonValue('CANCELLED')
  cancelled,
  @JsonValue('IN_PROGRESS')
  inProgress,
}
