import 'package:es_platform_mobile/utils/sentry_scrubber.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

/// Applies the app's Sentry settings. Kept out of `main()` so a test can check
/// that the privacy settings stay in place.
void configureSentryOptions(
  SentryFlutterOptions options, {
  required String dsn,
  required String environment,
}) {
  options.dsn = dsn;
  options.environment = environment;
  options.enableAutoSessionTracking = environment == 'production';
  options.debug = environment == 'development';

  // Performance tracing is not used, so no transactions leave the device.
  options.tracesSampleRate = 0;

  // Keep personal data and credentials out of Sentry (DPDP Act).
  // `print`/`debugPrint` output would otherwise be recorded as breadcrumbs,
  // including sync payloads and API responses.
  options.sendDefaultPii = false;
  options.enablePrintBreadcrumbs = false;
  options.attachScreenshot = false;
  options.attachViewHierarchy = false;
  options.beforeBreadcrumb = SentryScrubber.scrubBreadcrumb;
  options.beforeSend = SentryScrubber.scrubEvent;
}
