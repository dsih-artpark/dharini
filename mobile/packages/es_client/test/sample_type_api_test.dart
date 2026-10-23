import 'package:test/test.dart';
import 'package:es_client/es_client.dart';


/// tests for SampleTypeApi
void main() {
  final instance = EsClient().getSampleTypeApi();

  group(SampleTypeApi, () {
    //Future<SampleTypeResponse> sampleTypeControllerCreate(CreateSampleTypeDto createSampleTypeDto) async
    test('test sampleTypeControllerCreate', () async {
      // TODO
    });

    //Future<ListSampleTypeResponse> sampleTypeControllerFindAll() async
    test('test sampleTypeControllerFindAll', () async {
      // TODO
    });

    //Future<SampleTypeResponse> sampleTypeControllerFindOne(String id) async
    test('test sampleTypeControllerFindOne', () async {
      // TODO
    });

    //Future<SampleTypeResponse> sampleTypeControllerUpdate(String id, UpdateSampleTypeDto updateSampleTypeDto) async
    test('test sampleTypeControllerUpdate', () async {
      // TODO
    });

  });
}
