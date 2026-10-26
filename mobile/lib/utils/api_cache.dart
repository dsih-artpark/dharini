import 'dart:convert';

import 'package:hive/hive.dart';

class ApiCache {
  static const String _boxName = 'apiCache';

  /// Save any serializable value (usually a Map or List) under a key.
  static Future<void> set(String key, dynamic value) async {
    final box = await Hive.openBox(_boxName);
    await box.put(key, jsonEncode(value));
  }

  /// Retrieve and decode a cached value by key.
  /// [fromJson] is a function to convert the decoded JSON to your model.
  static Future<T?> get<T>(
      String key, T Function(dynamic json) fromJson) async {
    final box = await Hive.openBox(_boxName);
    final jsonString = box.get(key);
    if (jsonString == null) return null;
    final decoded = jsonDecode(jsonString);
    return fromJson(decoded);
  }

  /// Remove a cached value by key.
  static Future<void> clear(String key) async {
    final box = await Hive.openBox(_boxName);
    await box.delete(key);
  }

  /// Clear all cached API responses.
  static Future<void> clearAll() async {
    final box = await Hive.openBox(_boxName);
    await box.clear();
  }
}
