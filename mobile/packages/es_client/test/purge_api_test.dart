import 'package:test/test.dart';
import 'package:es_client/es_client.dart';


/// tests for PurgeApi
void main() {
  final instance = EsClient().getPurgeApi();

  group(PurgeApi, () {
    // Purge a project and all its cascading dependencies
    //
    //Future purgeControllerDeleteProject(String id) async
    test('test purgeControllerDeleteProject', () async {
      // TODO
    });

    // Purge a sample and all its cascading dependencies
    //
    //Future purgeControllerDeleteSample(String id) async
    test('test purgeControllerDeleteSample', () async {
      // TODO
    });

    // Purge a site and all its cascading dependencies
    //
    //Future purgeControllerDeleteSite(String id) async
    test('test purgeControllerDeleteSite', () async {
      // TODO
    });

    // Purge a visit and all its cascading dependencies
    //
    //Future purgeControllerDeleteVisit(String id) async
    test('test purgeControllerDeleteVisit', () async {
      // TODO
    });

  });
}
