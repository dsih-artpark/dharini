// `SentryEvent.extra` is deprecated, but older call sites could still fill it,
// so the backstop scrubs it too.
// ignore_for_file: deprecated_member_use

import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart' show debugPrint;
import 'package:sentry_flutter/sentry_flutter.dart';

/// Keeps personal data and credentials out of Sentry events.
///
/// What goes to Sentry is the *shape* of a request or response (field names,
/// value types, list lengths), never the values. That is enough to debug most
/// failures, and it keeps phone numbers, emails, OTPs, tokens, site-owner
/// details and exact coordinates off a third-party server.
///
/// The helpers are used in two places:
///  * at the call sites that add breadcrumbs or contexts, so values are never
///    collected in the first place;
///  * in [scrubBreadcrumb] / [scrubEvent], wired into `SentryFlutter.init`, as
///    a backstop for anything a future call site forgets.
class SentryScrubber {
  SentryScrubber._();

  static const String masked = '[Filtered]';

  /// Field names whose values are personal data, credentials or health data.
  /// Used on structured data (by key) and in free text (`siteOwnerName: …`).
  static const String _sensitiveFieldNames =
      r'token|password|passwd|secret|otp|phone|mobile|contact|email|name|'
      r'address|owner|latitude|longitude|location|coordinates?|pincode|'
      r'village|disease|symptom|questionnaire|photos?|comment|cookie|'
      r'authorization';

  // One pass, alternatives in priority order. UUIDs and local record IDs
  // (`local-1729912345678`) match first so their digits are not mistaken for a
  // phone number, and are kept as they are useful for tracing a record.
  static final RegExp _sensitiveText = RegExp(
    r'(?<uuid>\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b)'
    r'|(?<localId>\blocal-\d+\b)'
    // Presigned S3 links carry credentials; photo URLs point at personal data.
    r'|(?<url>\b(?:https?|wss?)://[^\s"<>' "'" r']+)'
    // `siteOwnerName: Ramesh Kumar`, `"latitude":12.97`, `comment=…`
    r'|(?<field>(?<q>["' "'" r']?)\b(?<key>\w*?(?:' '$_sensitiveFieldNames'
    r')\w*|lat|lng|lon)\k<q>(?<sep>\s*[:=]\s*)'
    r'(?:"[^"]*"|' "'[^']*'" r'|\{[^}]*\}|(?:\[[^\]]*\]|[^,;}\]\n])+))'
    r'|(?<jwt>\beyJ[\w-]+\.[\w-]+\.[\w-]*)'
    r'|(?<bearer>\bBearer\s+\S+)'
    r'|(?<email>[\w.+-]+@[\w-]+(?:\.[\w-]+)+)'
    // Coordinates: a decimal with four or more places, not part of a word or a
    // time. The character before is matched and put back rather than checked
    // with a lookbehind, which Safari before 16.4 (the web build) cannot parse.
    r'|(?<before>^|[^\w.:])-?\d{1,3}\.\d{4,}(?![\d.])'
    r'|(?<phone>\+?\d{1,4}[\s-]\d{3,5}[\s-]\d{3,5}(?:[\s-]\d{1,5})?'
    r'|\b[6-9]\d{4}[\s-]\d{5}\b)'
    r'|(?<digits>\d{6,})',
    caseSensitive: false,
  );

  static final RegExp _sensitiveField = RegExp(
    '$_sensitiveFieldNames|auth|credential|gps|image|'
    'collectedby|visitedby|testedby',
  );
  static const Set<String> _sensitiveFieldExact = {
    'lat',
    'lng',
    'lon',
    'long',
    'ip',
  };

  /// Whether the value under [key] must never be sent, whatever its type
  /// (a latitude is a number, a photo list is a list). Counts and payload
  /// shapes (`photo_count`, `visit_data_shape`) carry no values and are kept.
  static bool _isSensitiveField(String key) {
    final normalized = _normalizeField(key);
    if (normalized.endsWith('count') || normalized.endsWith('shape')) {
      return false;
    }
    return _sensitiveFieldExact.contains(normalized) ||
        _sensitiveField.hasMatch(normalized);
  }

  static String _normalizeField(String key) =>
      key.toLowerCase().replaceAll(RegExp(r'[^a-z0-9]'), '');

  static const int _maxShapeLength = 1000;
  static const int _maxShapeDepth = 4;
  static const int _maxShapeKeys = 60;

  /// How far past `maxLength` [maskText] still scans. Far enough that a token
  /// starting before the cut (a JWT, an email, a phone number) is seen whole
  /// and masked; near enough that a long blob in an error message (a hex dump,
  /// a base64 image) cannot freeze the app, as the patterns slow down sharply
  /// on long unbroken text.
  static const int _scanMargin = 500;

  /// Masks emails, phone numbers, OTP/PIN-like digit runs, JWTs, bearer
  /// tokens, URLs, coordinates and the values of sensitive `field: value`
  /// pairs inside free text, and keeps only the first [maxLength] characters.
  ///
  /// [maskFields] is off for payload shapes, whose `name: string(12)` pairs
  /// hold a type, not a value.
  static String maskText(
    String text, {
    int maxLength = 300,
    bool maskFields = true,
  }) {
    final scanned = text.length > maxLength + _scanMargin
        ? text.substring(0, maxLength + _scanMargin)
        : text;

    // Only text that starts before [maxLength] is copied, so nothing past the
    // scanned window can surface even when masking shortens the text.
    final out = StringBuffer();
    var position = 0;
    for (final match in _sensitiveText.allMatches(scanned)) {
      if (match.start >= maxLength) break;
      out
        ..write(scanned.substring(position, match.start))
        ..write(_replacement(match, maskFields: maskFields));
      position = match.end;
    }
    if (position < maxLength) {
      out.write(scanned.substring(
          position, scanned.length < maxLength ? scanned.length : maxLength));
    }

    final result = out.toString();
    if (text.length > maxLength || result.length > maxLength) {
      final kept =
          result.length > maxLength ? result.substring(0, maxLength) : result;
      return '$kept... [TRUNCATED]';
    }
    return result;
  }

  static String _replacement(RegExpMatch match, {required bool maskFields}) {
    if (match.namedGroup('uuid') != null ||
        match.namedGroup('localId') != null) {
      return match.group(0)!;
    }
    final key = match.namedGroup('key');
    if (key != null) {
      if (!maskFields) return match.group(0)!;
      final quote = match.namedGroup('q')!;
      return '$quote$key$quote${match.namedGroup('sep')}$masked';
    }
    final before = match.namedGroup('before');
    if (before != null) return '$before$masked';
    return masked;
  }

  /// Returns the request path with everything that is not a fixed route word
  /// replaced by `:id`, and without host, query string or fragment, e.g.
  /// `/projects/:id/samples/:id/lab-tests`.
  ///
  /// Route words in this API are lowercase and hyphenated (`lab-tests`,
  /// `home-last-30-days`), so that is the only form kept. IDs, tokens, emails
  /// and file names fail it.
  /// Segments after [_opaqueTail] prefixes are always replaced, because those
  /// routes take credentials or free-form values (`/invites/accept/<token>`).
  static String routeOf(Uri uri) {
    final segments = uri.pathSegments.where((s) => s.isNotEmpty).toList();
    final parts = <String>[];
    var opaque = false;
    for (final segment in segments) {
      if (opaque || !_routeWord.hasMatch(segment)) {
        parts.add(':id');
      } else {
        parts.add(segment);
        if (_opaqueTail.contains(segment)) opaque = true;
      }
    }
    return '/${parts.join('/')}';
  }

  // Short number parts only (`last-30-days`), so a UUID can never pass.
  static final RegExp _routeWord = RegExp(r'^[a-z]+(?:-(?:[a-z]+|\d{1,3}))*$');

  /// Route words whose following segments are never safe to report.
  static const Set<String> _opaqueTail = {
    'invites',
    'birds',
    'validate-barcode',
    'artifacts',
  };

  /// Describes [data] without any of its values, e.g.
  /// `{name: string(12), pinCode: number, photos: list(3)[string(40)]}`.
  ///
  /// Accepts decoded JSON, a JSON string, Dio [FormData], or anything else
  /// (reported by runtime type only).
  static String describeShape(dynamic data) {
    final shape = _shape(data, 0);
    if (shape.length > _maxShapeLength) {
      return '${shape.substring(0, _maxShapeLength)}... [TRUNCATED]';
    }
    return shape;
  }

  static String _shape(dynamic data, int depth) {
    if (data == null) return 'null';
    if (data is bool) return 'bool';
    if (data is num) return 'number';
    if (data is FormData) {
      final fields = data.fields.map((e) => maskText(e.key, maxLength: 60));
      final files = data.files.map((e) => maskText(e.key, maxLength: 60));
      return 'FormData(fields: [${fields.join(', ')}], files: [${files.join(', ')}])';
    }
    if (data is String) {
      final trimmed = data.trimLeft();
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        try {
          return _shape(jsonDecode(data), depth);
        } catch (_) {
          // Not JSON after all; fall through to the plain string description.
        }
      }
      return 'string(${data.length})';
    }
    if (depth >= _maxShapeDepth) return data is Map ? '{...}' : '[...]';
    if (data is Map) {
      final entries = data.entries.take(_maxShapeKeys).map(
            (e) =>
                '${maskText(e.key.toString(), maxLength: 60)}: ${_shape(e.value, depth + 1)}',
          );
      final extra = data.length - _maxShapeKeys;
      return '{${entries.join(', ')}${extra > 0 ? ', +$extra more' : ''}}';
    }
    if (data is List) {
      if (data.isEmpty) return 'list(0)';
      return 'list(${data.length})[${_shape(data.first, depth + 1)}]';
    }
    return data.runtimeType.toString();
  }

  /// Recursively masks every string inside [value], and the whole value of any
  /// sensitive field (names, contact details, GPS, disease data, photos),
  /// whatever its type. Used on structures we do not control, such as
  /// breadcrumb data and custom event contexts.
  static dynamic maskValue(dynamic value) {
    if (value is String) return maskText(value, maxLength: 500);
    if (value is Map) {
      return value.map((k, v) => MapEntry(k, _maskEntry(k.toString(), v)));
    }
    if (value is Iterable) return value.map(maskValue).toList();
    return value;
  }

  static dynamic _maskEntry(String key, dynamic value) {
    if (value == null) return null;
    // Built by [describeShape]: field names and types, never values.
    if (value is String && _normalizeField(key).endsWith('shape')) {
      return maskText(value, maxLength: 500, maskFields: false);
    }
    return _isSensitiveField(key) ? masked : maskValue(value);
  }

  /// A FormatException quotes the text it failed to parse on the lines after
  /// its message, so only the first line is kept. Other exceptions keep their
  /// whole message (masked), up to a generous limit.
  static String _exceptionText(SentryException exception, String value) {
    if (exception.type == 'FormatException') {
      return maskText(value.split('\n').first, maxLength: 300);
    }
    return maskText(value, maxLength: 1000);
  }

  /// `beforeBreadcrumb` hook.
  ///
  /// Fails closed: Sentry keeps a breadcrumb as it is when this hook throws,
  /// so a breadcrumb that cannot be scrubbed is dropped instead.
  static Breadcrumb? scrubBreadcrumb(Breadcrumb? breadcrumb, Hint hint) {
    if (breadcrumb == null) return null;
    try {
      final message = breadcrumb.message;
      if (message != null) {
        breadcrumb.message = maskText(message, maxLength: 500);
      }
      final data = breadcrumb.data;
      if (data != null) {
        breadcrumb.data = Map<String, dynamic>.from(maskValue(data) as Map);
      }
      return breadcrumb;
    } catch (error) {
      _logDropped('breadcrumb', error);
      return null;
    }
  }

  /// `beforeSend` hook.
  ///
  /// Fails closed: Sentry sends an event as it is when this hook throws, so an
  /// event that cannot be scrubbed is dropped instead.
  static SentryEvent? scrubEvent(SentryEvent event, Hint hint) {
    try {
      return _scrubEvent(event, hint);
    } catch (error) {
      _logDropped('event', error);
      return null;
    }
  }

  static SentryEvent _scrubEvent(SentryEvent event, Hint hint) {
    final message = event.message;
    if (message != null) {
      message.formatted = maskText(message.formatted, maxLength: 500);
      final template = message.template;
      if (template != null) {
        message.template = maskText(template, maxLength: 500);
      }
      message.params = message.params?.map(maskValue).toList();
    }

    for (final exception in event.exceptions ?? const <SentryException>[]) {
      final value = exception.value;
      if (value != null) exception.value = _exceptionText(exception, value);
    }

    // A breadcrumb that cannot be scrubbed is left out, not sent as it is.
    event.breadcrumbs = event.breadcrumbs
        ?.map((breadcrumb) => scrubBreadcrumb(breadcrumb, hint))
        .whereType<Breadcrumb>()
        .toList();

    final extra = event.extra;
    if (extra != null) {
      event.extra = Map<String, dynamic>.from(maskValue(extra) as Map);
    }

    event.tags = event.tags?.map((k, v) =>
        MapEntry(k, _isSensitiveField(k) ? masked : maskText(v)));

    // Custom contexts (e.g. `http_error`, `submission`) are plain maps. The
    // typed contexts (device, os, app, ...) are left alone.
    final contexts = event.contexts;
    for (final key in contexts.keys.toList()) {
      final value = contexts[key];
      if (value is Map) contexts[key] = maskValue(value);
    }

    // We never identify users to Sentry, and request bodies, cookies and
    // query strings must not be attached.
    event.user = null;
    event.request = null;
    return event;
  }

  // Only the error type is logged: the message may hold the data that could
  // not be scrubbed.
  static void _logDropped(String what, Object error) {
    debugPrint('[Sentry] Dropped a $what that could not be scrubbed: '
        '${error.runtimeType}');
  }
}
