import 'package:barrel_files_annotation/barrel_files_annotation.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

@includeInBarrelFile
enum InviteeType {
  @JsonValue('organization')
  organization,
  @JsonValue('user')
  user,
}
