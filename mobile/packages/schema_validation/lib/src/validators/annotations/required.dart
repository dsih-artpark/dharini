import 'package:barrel_files_annotation/barrel_files_annotation.dart';

@includeInBarrelFile
class Required {
  const Required([this.message]);
  final String? message;
}
