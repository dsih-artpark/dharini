import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:es_platform_mobile/main.dart';

class MockDotEnv extends Mock implements DotEnv {}

void main() {
  group('loadEnv', () {
    test('completes normally when the env file loads', () async {
      final env = MockDotEnv();
      when(() => env.load(fileName: any(named: 'fileName')))
          .thenAnswer((_) async {});

      await expectLater(loadEnv(env), completes);
    });

    test('does not throw when loading the env file fails', () async {
      final env = MockDotEnv();
      when(() => env.load(fileName: any(named: 'fileName')))
          .thenThrow(Exception('.env asset not found'));

      await expectLater(loadEnv(env), completes);
    });
  });
}
