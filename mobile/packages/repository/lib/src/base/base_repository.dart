abstract class BaseRepository {
  const BaseRepository();

  /// Handles API errors and converts them to domain exceptions
  Future<T> handleApiError<T>(Future<T> Function() apiCall) async {
    try {
      return await apiCall();
    } catch (e) {
      throw mapToDomainException(e);
    }
  }

  /// Maps API exceptions to domain exceptions
  Exception mapToDomainException(dynamic error) =>
      DomainException(message: error.toString());
}

/// Base domain exception
class DomainException implements Exception {
  DomainException({required this.message});
  final String message;

  @override
  String toString() => message;
}
