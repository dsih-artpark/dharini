import 'package:barrel_files_annotation/barrel_files_annotation.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

@includeInBarrelFile
enum UserType {
  @JsonValue('ADMIN')
  admin,
  @JsonValue('USER')
  user,
  // Add other user types as needed
}
