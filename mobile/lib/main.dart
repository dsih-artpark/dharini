import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import 'bootstrap.dart';
import 'services/database_service.dart';
import 'services/analytics_service.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Hive database
  try {
    await DatabaseService.initialize();
  } catch (e, stack) {
    debugPrint('Failed to initialize database: $e\n$stack');
  }

  await loadEnv(dotenv);

  // Initialize PostHog analytics
  try {
    await AnalyticsService.instance.initialize();
  } catch (e, stack) {
    debugPrint('Failed to initialize analytics: $e\n$stack');
  }

  final sentryDsn = dotenv.env['SENTRY_DSN'] ?? '';
  final sentryEnv = dotenv.env['SENTRY_ENV'] ?? 'production';
  
  if (sentryDsn.isNotEmpty) {
    await SentryFlutter.init(
      (options) {
        options.dsn = sentryDsn;
        options.environment = sentryEnv;
        options.tracesSampleRate = sentryEnv == 'development' ? 1.0 : 0.2;
        options.enableAutoSessionTracking = sentryEnv == 'production';
        options.debug = sentryEnv == 'development';
      },
      appRunner: () => runESApp(),
    );
  } else {
    // Run without Sentry if DSN is not configured
    runESApp();
  }
}

@visibleForTesting
Future<void> loadEnv(DotEnv env) async {
  try {
    await env.load(fileName: ".env");
  } catch (e, stack) {
    debugPrint('Failed to load .env: $e\n$stack');
  }
}
