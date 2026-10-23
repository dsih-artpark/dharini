import 'package:es_platform_mobile/hooks/api.dart';
import 'package:es_platform_mobile/hooks/auth.dart';
import 'package:es_platform_mobile/providers/connectivity_provider.dart';
import 'package:es_platform_mobile/services/barcode_validator_service.dart';
import 'package:flutter_hooks/flutter_hooks.dart';

/// Returns a memoized [BarcodeValidatorService] bound to the current project
/// and connectivity context.
///
/// The service instance is only recreated when [projectId] changes, which keeps
/// it stable across widget rebuilds and safe to pass as a `const`-like dependency
/// to child widgets.
///
/// Usage:
/// ```dart
/// final validator = useBarcodeValidator();
///
/// final error = await validator.validate(barcode);
///
/// final error = await validator.validateBatch(barcodes);
/// ```
BarcodeValidatorService useBarcodeValidator() {
  final context = useContext();
  final api = useEsApiClient();
  final projectId = useCurrentProjectId();

  return useMemoized(
    () => BarcodeValidatorService(
      api: api,
      connectivity: context.connectivity,
      projectId: projectId,
    ),
    [projectId], // rebuild only when the active project changes
  );
}
