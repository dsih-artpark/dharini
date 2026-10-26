import 'package:test/test.dart';
import 'package:es_client/es_client.dart';


/// tests for SurveillanceTypeApi
void main() {
  final instance = EsClient().getSurveillanceTypeApi();

  group(SurveillanceTypeApi, () {
    //Future<SurveillanceTypeResponse> surveillanceTypeControllerCreate(CreateSurveillanceTypeDto createSurveillanceTypeDto) async
    test('test surveillanceTypeControllerCreate', () async {
      // TODO
    });

    //Future<ListSurveillanceTypeResponse> surveillanceTypeControllerFindAll() async
    test('test surveillanceTypeControllerFindAll', () async {
      // TODO
    });

    //Future<SurveillanceTypeResponse> surveillanceTypeControllerFindOne(String id) async
    test('test surveillanceTypeControllerFindOne', () async {
      // TODO
    });

    //Future<SurveillanceTypeResponse> surveillanceTypeControllerUpdate(String id, UpdateSurveillanceTypeDto updateSurveillanceTypeDto) async
    test('test surveillanceTypeControllerUpdate', () async {
      // TODO
    });

  });
}
