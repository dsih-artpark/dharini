import 'package:test/test.dart';
import 'package:es_client/es_client.dart';


/// tests for AccessApi
void main() {
  final instance = EsClient().getAccessApi();

  group(AccessApi, () {
    //Future<JsonObject> accessControllerFindOne(String id) async
    test('test accessControllerFindOne', () async {
      // TODO
    });

    //Future<JsonObject> accessControllerUpdate(String id, UpdateAccessDto updateAccessDto) async
    test('test accessControllerUpdate', () async {
      // TODO
    });

  });
}
