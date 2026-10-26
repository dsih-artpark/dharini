import 'dart:developer';

import 'package:bloc/bloc.dart';
import 'package:data_provider/data_provider.dart';
import 'package:es_platform_mobile/hooks/api.dart';
import 'package:es_platform_mobile/utils/restart_widget.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:fquery/fquery.dart';
import 'package:repository/repository.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import 'package:es_platform_mobile/interceptors/auth_interceptor.dart';
import 'package:es_platform_mobile/interceptors/connectivity_interceptor.dart';
import 'app.dart';
import 'providers/connectivity_provider.dart';
import 'providers/sync_service_provider.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

final apiUrl = dotenv.env['API_BASE_URL'] ?? '';

ValueNotifier<String> baseUrlNotifier = ValueNotifier(apiUrl);

void runESApp() async {
  // These replace the handlers Sentry installed in `SentryFlutter.init`, so
  // they report to Sentry themselves. Without that, uncaught errors would only
  // be logged. Like Sentry's own handlers they mark the error unhandled, which
  // is what makes it count as a crash in release health.
  FlutterError.onError = (FlutterErrorDetails details) {
    log(details.exceptionAsString(), stackTrace: details.stack);
    if (details.silent || !Sentry.isEnabled) return;
    Sentry.captureException(
      ThrowableMechanism(
        Mechanism(type: 'FlutterError', handled: false),
        details.exception,
      ),
      stackTrace: details.stack,
      withScope: (scope) {
        scope.setTag('error.source', 'flutter');
        final library = details.library;
        if (library != null) scope.setTag('flutter.library', library);
      },
    );
  };

  PlatformDispatcher.instance.onError = (Object error, StackTrace stack) {
    log(error.toString(), stackTrace: stack);
    if (Sentry.isEnabled) {
      Sentry.captureException(
        ThrowableMechanism(
          Mechanism(type: 'PlatformDispatcher.onError', handled: false),
          error,
        ),
        stackTrace: stack,
        withScope: (scope) => scope.setTag('error.source', 'platform'),
      );
    }
    return true;
  };

  Bloc.observer = const AppBlocObserver();

  // Pre-load token to avoid race conditions at startup
  final initialToken = await readInitialToken(const FlutterSecureStorage());

  runApp(
    RestartWidget(
      child: ValueListenableBuilder<String>(
        valueListenable: baseUrlNotifier,
        builder: (context, baseUrl, _) {
          final DioHttpClient httpClient = DioHttpClient(
            baseUrl: baseUrl,
            interceptors: [
              ConnectivityInterceptor(),
              AuthInterceptor(),
            ],
          );

          final UserRepository userRepository =
              UserRepository(httpClient: httpClient);
          final ProjectRepository projectRepository =
              ProjectRepository(httpClient: httpClient);
          final SiteRepository siteRepository =
              SiteRepository(httpClient: httpClient);
          final InviteRepository inviteRepository =
              InviteRepository(httpClient: httpClient);
          final VisitRepository visitRepository =
              VisitRepository(httpClient: httpClient);

          final queryClient = QueryClient(
            defaultQueryOptions: DefaultQueryOptions(
              staleDuration: const Duration(seconds: 60),
              refetchOnMount: RefetchOnMount.stale,
              refetchInterval: null,
            ),
          );

          return EsClientProvider(
            baseUrl: baseUrl,
            httpClient: httpClient,
            initialToken: initialToken,
            child: QueryClientProvider(
              queryClient: queryClient,
              child: ConnectivityProvider(
                child: SyncServiceProvider(
                  child: ESApp(
                    userRepository: userRepository,
                    projectRepository: projectRepository,
                    siteRepository: siteRepository,
                    inviteRepository: inviteRepository,
                    visitRepository: visitRepository,
                  ),
                ),
              ),
            ),
          );
        },
      ),
    ),
  );
}

@visibleForTesting
Future<String?> readInitialToken(FlutterSecureStorage storage) async {
  try {
    return await storage.read(key: 'es_access_token');
  } catch (e, stack) {
    log('Failed to read initial token from secure storage: $e',
        stackTrace: stack);
    return null;
  }
}

class AppBlocObserver extends BlocObserver {
  const AppBlocObserver();

  @override
  void onChange(BlocBase<dynamic> bloc, Change<dynamic> change) {
    super.onChange(bloc, change);
    log('onChange(${bloc.runtimeType}, $change)');
  }

  @override
  void onError(BlocBase<dynamic> bloc, Object error, StackTrace stackTrace) {
    log('onError(${bloc.runtimeType}, $error, $stackTrace)');
    if (Sentry.isEnabled) {
      Sentry.captureException(
        error,
        stackTrace: stackTrace,
        withScope: (scope) {
          scope.setTag('error.source', 'bloc');
          scope.setTag('bloc.type', bloc.runtimeType.toString());
        },
      );
    }
    super.onError(bloc, error, stackTrace);
  }
}
