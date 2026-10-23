import 'package:barrel_files_annotation/barrel_files_annotation.dart';

@includeInBarrelFile
class StringValidation {
  const StringValidation({
    this.minLength,
    this.maxLength,
    this.pattern,
    this.message,
  });
  final int? minLength;
  final int? maxLength;
  final String? pattern;
  final String? message;
}
