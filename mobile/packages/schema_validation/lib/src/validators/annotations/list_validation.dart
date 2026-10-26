import 'package:barrel_files_annotation/barrel_files_annotation.dart';

@includeInBarrelFile
class ListValidation {
  const ListValidation({
    this.minLength,
    this.maxLength,
    this.message,
  });
  final int? minLength;
  final int? maxLength;
  final String? message;
}
