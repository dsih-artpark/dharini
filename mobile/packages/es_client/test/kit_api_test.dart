import 'package:test/test.dart';
import 'package:es_client/es_client.dart';


/// tests for KitApi
void main() {
  final instance = EsClient().getKitApi();

  group(KitApi, () {
    //Future<KitResponse> kitControllerCreate(CreateKitDto createKitDto) async
    test('test kitControllerCreate', () async {
      // TODO
    });

    //Future<ListKitResponse> kitControllerFindAll() async
    test('test kitControllerFindAll', () async {
      // TODO
    });

    //Future<KitResponse> kitControllerFindOne(String id) async
    test('test kitControllerFindOne', () async {
      // TODO
    });

    //Future<KitResponse> kitControllerUpdate(String id, UpdateKitDto updateKitDto) async
    test('test kitControllerUpdate', () async {
      // TODO
    });

  });
}
