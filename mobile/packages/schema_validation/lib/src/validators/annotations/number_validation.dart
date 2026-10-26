import 'package:barrel_files_annotation/barrel_files_annotation.dart';

@includeInBarrelFile
class NumberValidation {
  const NumberValidation({
    this.min,
    this.max,
    this.isInteger,
    this.message,
  });
  final num? min;
  final num? max;
  final bool? isInteger;
  final String? message;
}
