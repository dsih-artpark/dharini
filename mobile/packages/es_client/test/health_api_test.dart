import 'package:test/test.dart';
import 'package:es_client/es_client.dart';


/// tests for HealthApi
void main() {
  final instance = EsClient().getHealthApi();

  group(HealthApi, () {
    // Health check endpoint for uptime monitoring
    //
    //Future healthControllerCheck() async
    test('test healthControllerCheck', () async {
      // TODO
    });

  });
}
