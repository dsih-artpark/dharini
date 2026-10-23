import 'package:flutter/services.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:es_platform_mobile/bootstrap.dart';

class MockFlutterSecureStorage extends Mock implements FlutterSecureStorage {}

void main() {
  group('readInitialToken', () {
    test('returns the stored token when the read succeeds', () async {
      final storage = MockFlutterSecureStorage();
      when(() => storage.read(key: any(named: 'key')))
          .thenAnswer((_) async => 'abc123');

      final token = await readInitialToken(storage);

      expect(token, 'abc123');
    });

    test('returns null instead of throwing when secure storage read fails',
        () async {
      final storage = MockFlutterSecureStorage();
      when(() => storage.read(key: any(named: 'key'))).thenThrow(
        PlatformException(code: 'read_error', message: 'Keystore unavailable'),
      );

      final token = await readInitialToken(storage);

      expect(token, isNull);
    });
  });
}
