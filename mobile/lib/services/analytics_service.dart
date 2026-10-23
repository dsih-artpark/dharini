import 'dart:async';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:hive/hive.dart';
import 'package:posthog_flutter/posthog_flutter.dart';

/// Analytics service with offline-first support using Hive for event queuing.
/// Events are queued locally when offline and flushed when connectivity is restored.
class AnalyticsService {
  static const String _analyticsBoxName = 'analytics_queue';
  static const String _userIdKey = 'posthog_user_id';
  static const int _maxQueueSize = 500;
  static const int _maxRetries = 3;
  static const Duration _staleEventThreshold = Duration(days: 7);

  static AnalyticsService? _instance;
  static AnalyticsService get instance {
    _instance ??= AnalyticsService._();
    return _instance!;
  }

  AnalyticsService._();

  bool _initialized = false;
  Box<Map>? _analyticsBox;
  StreamSubscription? _connectivitySubscription;
  String? _userId;
  int _retryCount = 0;
  bool _isFlushing = false;

  /// Initialize the analytics service
  Future<void> initialize() async {
    if (_initialized) return;

    final apiKey = dotenv.env['POSTHOG_API_KEY'] ?? '';
    final host = dotenv.env['POSTHOG_HOST'] ?? 'https://app.posthog.com';

    if (apiKey.isEmpty) {
      debugPrint('[Analytics] PostHog API key not configured');
      return;
    }

    try {
      // Initialize PostHog
      final config = PostHogConfig(apiKey);
      config.host = host;
      config.captureApplicationLifecycleEvents = true;
      config.debug = kDebugMode;
      config.sessionReplay = true;

      // Screens show personal data (names, phone numbers, site-owner details,
      // site photos), so replays mask all text and images.
      config.sessionReplayConfig.maskAllTexts = true;
      config.sessionReplayConfig.maskAllImages = true;
      config.sessionReplayConfig.throttleDelay = const Duration(milliseconds: 300);
      await Posthog().setup(config);

      // Open analytics queue box
      _analyticsBox = await Hive.openBox<Map>(_analyticsBoxName);

      // Load stored user ID
      final appBox = Hive.box('app');
      _userId = appBox.get(_userIdKey) as String?;
      if (_userId != null) {
        await Posthog().identify(userId: _userId!);
      }

      // Listen for connectivity changes to flush queue
      _connectivitySubscription = Connectivity()
          .onConnectivityChanged
          .listen(_onConnectivityChanged);

      // Flush any pending events on startup
      await _flushQueue();

      _initialized = true;
      debugPrint('[Analytics] Initialized successfully');
    } catch (e) {
      debugPrint('[Analytics] Failed to initialize: $e');
    }
  }

  void _onConnectivityChanged(ConnectivityResult result) {
    final isOnline = result != ConnectivityResult.none;
    if (isOnline) {
      _retryCount = 0; // Reset retry count on connectivity restore
      _flushQueue();
    }
  }

  /// Check if we're currently online
  Future<bool> _isOnline() async {
    final result = await Connectivity().checkConnectivity();
    return result != ConnectivityResult.none;
  }

  /// Flush queued events to PostHog
  Future<void> _flushQueue() async {
    if (_analyticsBox == null || _analyticsBox!.isEmpty) return;
    if (_isFlushing) return; // Reentrancy guard

    final isOnline = await _isOnline();
    if (!isOnline) return;

    _isFlushing = true;
    try {
      debugPrint('[Analytics] Flushing ${_analyticsBox!.length} queued events');

      final keysToDelete = <dynamic>[];
      final now = DateTime.now();

      for (var i = 0; i < _analyticsBox!.length; i++) {
        final key = _analyticsBox!.keyAt(i);
        final eventData = _analyticsBox!.get(key);

        if (eventData == null) {
          keysToDelete.add(key);
          continue;
        }

        // Check for stale events (older than 7 days)
        final queuedAtStr = eventData['queued_at'] as String?;
        if (queuedAtStr != null) {
          try {
            final queuedAt = DateTime.parse(queuedAtStr);
            if (now.difference(queuedAt) > _staleEventThreshold) {
              debugPrint('[Analytics] Discarding stale event: ${eventData['event']}');
              keysToDelete.add(key);
              continue;
            }
          } catch (_) {
            // If we can't parse the date, try to send anyway
          }
        }

        final eventName = eventData['event'] as String?;
        if (eventName == null) {
          // Invalid event data, delete it
          keysToDelete.add(key);
          continue;
        }

        try {
          final rawProperties = eventData['properties'] as Map?;

          // Sanitize properties: remove null values to prevent cast errors
          final properties = rawProperties?.entries
              .where((e) => e.value != null)
              .fold<Map<String, Object>>({}, (map, e) => map..[e.key.toString()] = e.value);

          await Posthog().capture(
            eventName: eventName,
            properties: properties,
          );
          keysToDelete.add(key);
          _retryCount = 0; // Reset retry count on successful send
        } catch (e) {
          debugPrint('[Analytics] Failed to flush event: $e');
          _retryCount++;

          // Exponential backoff: delay and continue instead of breaking
          if (_retryCount >= _maxRetries) {
            debugPrint('[Analytics] Max retries reached, scheduling delayed retry');
            // Schedule a delayed retry instead of breaking
            Future.delayed(const Duration(minutes: 1), () => _flushQueue());
            break;
          }

          // Wait with exponential backoff before continuing to next event
          await Future.delayed(Duration(seconds: _retryCount * 2));
        }
      }

      // Delete successfully sent events and stale events
      for (final key in keysToDelete) {
        await _analyticsBox!.delete(key);
      }

      debugPrint('[Analytics] Flushed ${keysToDelete.length} events');
    } finally {
      _isFlushing = false;
    }
  }

  /// Track an event, queuing it locally if offline
  Future<void> track(String eventName, [Map<String, dynamic>? properties]) async {
    if (!_initialized) {
      debugPrint('[Analytics] Not initialized, skipping: $eventName');
      return;
    }

    final eventProperties = {
      ...?properties,
      'timestamp': DateTime.now().toIso8601String(),
    };

    final isOnline = await _isOnline();

    // Sanitize properties: remove null values to prevent cast errors
    final sanitizedProperties = eventProperties.entries
        .where((e) => e.value != null)
        .fold<Map<String, Object>>({}, (map, e) => map..[e.key] = e.value);

    if (isOnline) {
      try {
        await Posthog().capture(
          eventName: eventName,
          properties: sanitizedProperties,
        );
        debugPrint('[Analytics] Tracked: $eventName');
      } catch (e) {
        debugPrint('[Analytics] Failed to track, queuing: $eventName');
        await _queueEvent(eventName, eventProperties);
      }
    } else {
      await _queueEvent(eventName, eventProperties);
      debugPrint('[Analytics] Queued (offline): $eventName');
    }
  }

  /// Queue an event for later sending
  Future<void> _queueEvent(String eventName, Map<String, dynamic> properties) async {
    if (_analyticsBox == null) return;

    // Enforce max queue size - remove oldest events if at capacity
    while (_analyticsBox!.length >= _maxQueueSize) {
      final oldestKey = _analyticsBox!.keyAt(0);
      debugPrint('[Analytics] Queue full, removing oldest event');
      await _analyticsBox!.delete(oldestKey);
    }

    final eventData = {
      'event': eventName,
      'properties': properties,
      'queued_at': DateTime.now().toIso8601String(),
    };

    await _analyticsBox!.add(eventData);
  }

  /// Identify a user (using UUID from database, no PII)
  /// Optional userProperties can include role, team, project, organization
  Future<void> identify(String userId, [Map<String, dynamic>? userProperties]) async {
    if (!_initialized) return;

    _userId = userId;

    // Store user ID for persistence
    final appBox = Hive.box('app');
    await appBox.put(_userIdKey, userId);

    try {
      // Sanitize properties: remove null values
      final properties = userProperties?.entries
          .where((e) => e.value != null)
          .fold<Map<String, Object>>({}, (map, e) => map..[e.key] = e.value);

      await Posthog().identify(userId: userId, userProperties: properties);
      debugPrint('[Analytics] Identified user: $userId');
    } catch (e) {
      debugPrint('[Analytics] Failed to identify user: $e');
    }
  }

  /// Reset user identity (on logout)
  Future<void> reset() async {
    if (!_initialized) return;

    _userId = null;

    // Clear stored user ID
    final appBox = Hive.box('app');
    await appBox.delete(_userIdKey);

    try {
      await Posthog().reset();
      debugPrint('[Analytics] Reset user');
    } catch (e) {
      debugPrint('[Analytics] Failed to reset: $e');
    }
  }

  /// Dispose resources
  void dispose() {
    _connectivitySubscription?.cancel();
    _connectivitySubscription = null;
  }
}

/// Convenience class for tracking specific events
/// Event names follow consistent naming without platform prefix
class Analytics {
  static AnalyticsService get _service => AnalyticsService.instance;

  // Auth events
  static Future<void> loginOtpSent() => _service.track('login_otp_sent');

  static Future<void> loginSuccess({
    String? userId,
    String? role,
    String? team,
    String? project,
    String? organization,
  }) async {
    await _service.track('login_success');
    if (userId != null) {
      await _service.identify(userId, {
        'role': role,
        'team': team,
        'project': project,
        'organization': organization,
      });
    }
  }

  static Future<void> loginFailed(String error) =>
      _service.track('login_failed', {'error': _sanitizeError(error)});

  /// Sanitize error messages to remove potential PII
  static String _sanitizeError(String error) {
    final lowerError = error.toLowerCase();

    // Map known error patterns to safe codes
    if (lowerError.contains('invalid otp')) return 'INVALID_OTP';
    if (lowerError.contains('otp expired')) return 'OTP_EXPIRED';
    if (lowerError.contains('too many')) return 'RATE_LIMITED';
    if (lowerError.contains('not found')) return 'USER_NOT_FOUND';
    if (lowerError.contains('network')) return 'NETWORK_ERROR';
    if (lowerError.contains('timeout')) return 'TIMEOUT';

    // Strip potential PII patterns
    var sanitized = error
        .replaceAll(RegExp(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'), '[EMAIL]')
        .replaceAll(RegExp(r'\+?[0-9]{10,15}'), '[PHONE]')
        .replaceAll(RegExp(r'[0-9]{6}'), '[OTP]');

    // If too long, return generic
    if (sanitized.length > 100) return 'UNKNOWN_ERROR';

    return sanitized;
  }

  // Site events
  static Future<void> siteCreationStarted() =>
      _service.track('site_creation_started');

  static Future<void> siteCreated({
    String? siteType,
    String? farmType,
    required bool isOffline,
  }) => _service.track('site_created', {
    'site_type': siteType,
    'farm_type': farmType,
    'is_offline': isOffline,
  });

  // Visit events
  static Future<void> visitCreationStarted({required bool isOffline}) =>
      _service.track('visit_creation_started', {'is_offline': isOffline});

  static Future<void> visitCreated({
    String? siteId,
    required bool isOffline,
  }) => _service.track('visit_created', {
    'site_id': siteId,
    'is_offline': isOffline,
  });

  static Future<void> visitCompleted({
    required int totalSamples,
    String? sampleTypes,
    required bool isSynced,
  }) => _service.track('visit_completed', {
    'total_samples': totalSamples,
    'sample_types': sampleTypes,
    'is_synced': isSynced,
  });

  // User identification (using UUID from database only)
  static Future<void> identify(String userId) => _service.identify(userId);

  static Future<void> reset() => _service.reset();
}
