import 'package:test/test.dart';
import 'package:es_client/es_client.dart';


/// tests for LocationApi
void main() {
  final instance = EsClient().getLocationApi();

  group(LocationApi, () {
    //Future<LocationResponse> locationControllerCreate(CreateLocationDto createLocationDto) async
    test('test locationControllerCreate', () async {
      // TODO
    });

    //Future<ListLocationResponse> locationControllerFindAll() async
    test('test locationControllerFindAll', () async {
      // TODO
    });

    //Future<ListLocationResponse> locationControllerFindLocationFileByStateCode(String regionId) async
    test('test locationControllerFindLocationFileByStateCode', () async {
      // TODO
    });

    //Future<LocationResponse> locationControllerFindOne(String id) async
    test('test locationControllerFindOne', () async {
      // TODO
    });

    //Future<LocationResponse> locationControllerUpdate(String id, UpdateLocationDto updateLocationDto) async
    test('test locationControllerUpdate', () async {
      // TODO
    });

    //Future<ListLocationResponse> locationControllerUploadExcelFile() async
    test('test locationControllerUploadExcelFile', () async {
      // TODO
    });

  });
}
