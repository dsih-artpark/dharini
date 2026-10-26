import 'package:test/test.dart';
import 'package:es_client/es_client.dart';


/// tests for DataImportApi
void main() {
  final instance = EsClient().getDataImportApi();

  group(DataImportApi, () {
    //Future dataImportControllerDownloadTemplate(String projectId, String diseaseGroup, String section) async
    test('test dataImportControllerDownloadTemplate', () async {
      // TODO
    });

    //Future dataImportControllerUploadCollection(String projectId) async
    test('test dataImportControllerUploadCollection', () async {
      // TODO
    });

    //Future dataImportControllerUploadLab(String projectId) async
    test('test dataImportControllerUploadLab', () async {
      // TODO
    });

  });
}
