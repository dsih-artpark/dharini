import 'package:test/test.dart';
import 'package:es_client/es_client.dart';


/// tests for DiseaseApi
void main() {
  final instance = EsClient().getDiseaseApi();

  group(DiseaseApi, () {
    //Future<DiseaseResponse> diseaseControllerCreate(CreateDiseaseDto createDiseaseDto) async
    test('test diseaseControllerCreate', () async {
      // TODO
    });

    //Future<ListDiseaseResponse> diseaseControllerFindAll() async
    test('test diseaseControllerFindAll', () async {
      // TODO
    });

    //Future<DiseaseResponse> diseaseControllerFindOne(String id) async
    test('test diseaseControllerFindOne', () async {
      // TODO
    });

    //Future<DiseaseResponse> diseaseControllerUpdate(String id, UpdateDiseaseDto updateDiseaseDto) async
    test('test diseaseControllerUpdate', () async {
      // TODO
    });

  });
}
