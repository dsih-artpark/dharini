import 'package:test/test.dart';
import 'package:es_client/es_client.dart';


/// tests for SamplesApi
void main() {
  final instance = EsClient().getSamplesApi();

  group(SamplesApi, () {
    // List all animals recorded at a site
    //
    // Returns every AnimalMetadata record ever attached to a sample at the given site, newest-first. Used by the mobile app to let collectors pick an existing animal instead of re-entering metadata.
    //
    //Future<ListAnimalMetadataResponse> samplesControllerGetAnimalMetadataBySite(String siteId) async
    test('test samplesControllerGetAnimalMetadataBySite', () async {
      // TODO
    });

  });
}
