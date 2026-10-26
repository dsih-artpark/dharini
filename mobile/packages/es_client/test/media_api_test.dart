import 'package:test/test.dart';
import 'package:es_client/es_client.dart';


/// tests for MediaApi
void main() {
  final instance = EsClient().getMediaApi();

  group(MediaApi, () {
    //Future<UploadMultipleFilesResponse> mediaControllerUploadImages() async
    test('test mediaControllerUploadImages', () async {
      // TODO
    });

    //Future mediaControllerUploadShapeFiles() async
    test('test mediaControllerUploadShapeFiles', () async {
      // TODO
    });

  });
}
