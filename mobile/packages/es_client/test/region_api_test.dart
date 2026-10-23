import 'package:test/test.dart';
import 'package:es_client/es_client.dart';


/// tests for RegionApi
void main() {
  final instance = EsClient().getRegionApi();

  group(RegionApi, () {
    //Future<RegionResponse> regionControllerCreate(CreateRegionDto createRegionDto) async
    test('test regionControllerCreate', () async {
      // TODO
    });

    //Future<ListRegionResponse> regionControllerFindAll(String type, { String select, String search }) async
    test('test regionControllerFindAll', () async {
      // TODO
    });

    //Future<RegionResponse> regionControllerFindOne(String id) async
    test('test regionControllerFindOne', () async {
      // TODO
    });

    //Future<RegionResponse> regionControllerUpdate(String id, UpdateRegionDto updateRegionDto) async
    test('test regionControllerUpdate', () async {
      // TODO
    });

    //Future<ConvertExcelResponse> regionControllerUploadExcelFileDistrict() async
    test('test regionControllerUploadExcelFileDistrict', () async {
      // TODO
    });

    //Future<ConvertExcelResponse> regionControllerUploadExcelFileState() async
    test('test regionControllerUploadExcelFileState', () async {
      // TODO
    });

  });
}
