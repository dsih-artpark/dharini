import 'dart:convert';
import 'package:built_value/serializer.dart';
import 'package:es_client/es_client.dart';

class HiveSerialization {
  /// Deeply normalizes any Map to ensure all keys are Strings and all nested Maps/Lists are also normalized.
  /// This prevents the infamous `"type '_Map<dynamic, dynamic>' is not a subtype of type 'Map<String, dynamic>?'"` error.
  static Map<String, dynamic>? normalizeMap(dynamic input) {
    if (input == null) return null;
    if (input is! Map) return null;

    final result = <String, dynamic>{};
    input.forEach((key, value) {
      final stringKey = key.toString();
      result[stringKey] = _normalizeValue(value);
    });
    return result;
  }

  static dynamic _normalizeValue(dynamic value) {
    if (value is Map) {
      return normalizeMap(value);
    } else if (value is List) {
      return value.map(_normalizeValue).toList();
    }
    return value;
  }

  /// Serializes a built_value class to a plain Map.
  static Map<String, dynamic>? serializeBuiltValue<T>(
    Serializer<T> serializer,
    T? instance,
  ) {
    if (instance == null) return null;
    try {
      final serialized = standardSerializers.serializeWith(serializer, instance);
      return normalizeMap(serialized as Map);
    } catch (e) {
      print('[HiveSerialization] Error serializing built_value instance: $e');
      return null;
    }
  }

  /// Deserializes a plain Map to a built_value class.
  static T? deserializeBuiltValue<T>(
    Serializer<T> serializer,
    dynamic raw,
  ) {
    if (raw == null) return null;
    try {
      final normalized = normalizeMap(raw as Map);
      if (normalized == null) return null;
      return standardSerializers.deserializeWith(serializer, normalized);
    } catch (e) {
      print('[HiveSerialization] Error deserializing built_value: $e');
      // Fallback: try using JSON encode/decode to force normalization
      try {
        final jsonString = jsonEncode(raw);
        final decoded = jsonDecode(jsonString);
        return standardSerializers.deserializeWith(serializer, decoded);
      } catch (e2) {
        print('[HiveSerialization] Fallback deserialization also failed: $e2');
        return null;
      }
    }
  }
}
