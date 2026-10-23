import 'package:es_client/es_client.dart';
import 'package:es_platform_mobile/services/connectivity_service.dart';

/// Encapsulates all barcode uniqueness validation logic.
///
/// Validation is always skipped gracefully when the device is offline or the
/// project context is unavailable, so collectors are never blocked in the field.
class BarcodeValidatorService {
  final EsClient _api;
  final ConnectivityService _connectivity;
  final String? _projectId;

  BarcodeValidatorService({
    required EsClient api,
    required ConnectivityService connectivity,
    required String? projectId,
  })  : _api = api,
        _connectivity = connectivity,
        _projectId = projectId;

  /// Returns `true` when validation can actually run (online + project known).
  bool get canValidate => _projectId != null;

  /// Validates a single [barcode] against the project database.
  ///
  /// Returns:
  /// - `null`  → barcode is valid (or validation was skipped because we are
  ///             offline / project id is unavailable).
  /// - a non-empty [String] → error message to show to the user.
  Future<String?> validate(String barcode) async {
    if (_projectId == null || barcode.isEmpty) return null;

    try {
      final status = await _connectivity.checkConnectivity();
      if (status != NetworkStatus.online) return null; // offline – skip

      final response =
          await _api.getProjectsApi().projectsControllerValidateBarcode(
                projectId: _projectId,
                barcode: barcode,
              );

      if (response.data?.isValidBarcode == false) {
        return 'Barcode "$barcode" already exists in this project. Please use a different barcode.';
      }
      return null;
    } catch (_) {
      // Network / server error – fail open so we never block a field collector.
      return null;
    }
  }

  /// Validates a batch of [barcodes] sequentially.
  ///
  /// Stops at the first failure and returns its error message, or `null` if
  /// all barcodes are valid (or validation was skipped).
  Future<String?> validateBatch(List<String> barcodes) async {
    for (final barcode in barcodes) {
      final error = await validate(barcode);
      if (error != null) return error;
    }
    return null;
  }
}
