import 'package:barrel_files_annotation/barrel_files_annotation.dart';

/// Exception thrown when an API request fails
@includeInBarrelFile
class ApiException implements Exception {
  /// Creates a new [ApiException]
  ApiException({
    required this.message,
    this.statusCode,
    this.data,
  });

  /// The error message
  final String message;

  /// The HTTP status code if available
  final int? statusCode;

  /// The response data if available
  final dynamic data;
}
