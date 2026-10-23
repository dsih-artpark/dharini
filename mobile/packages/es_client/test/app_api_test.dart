import 'package:test/test.dart';
import 'package:es_client/es_client.dart';


/// tests for AppApi
void main() {
  final instance = EsClient().getAppApi();

  group(AppApi, () {
    //Future<String> appControllerGetHello() async
    test('test appControllerGetHello', () async {
      // TODO
    });

  });
}
