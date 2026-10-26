import 'package:es_platform_mobile/utils/sentry_config.dart';
import 'package:es_platform_mobile/utils/sentry_scrubber.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

void main() {
  group('configureSentryOptions', () {
    late SentryFlutterOptions options;

    setUp(() {
      options = SentryFlutterOptions();
      configureSentryOptions(options,
          dsn: 'https://public@example.invalid/1', environment: 'production');
    });

    test('keeps the privacy settings on', () {
      expect(options.sendDefaultPii, isFalse);
      expect(options.enablePrintBreadcrumbs, isFalse);
      expect(options.attachScreenshot, isFalse);
      expect(options.attachViewHierarchy, isFalse);
      expect(options.beforeSend, SentryScrubber.scrubEvent);
      expect(options.beforeBreadcrumb, SentryScrubber.scrubBreadcrumb);
    });

    test('sends no performance transactions', () {
      expect(options.tracesSampleRate, 0);
    });

    test('sets dsn and environment', () {
      expect(options.dsn, 'https://public@example.invalid/1');
      expect(options.environment, 'production');
      expect(options.enableAutoSessionTracking, isTrue);
    });
  });
}
