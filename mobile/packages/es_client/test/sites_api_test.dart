import 'package:test/test.dart';
import 'package:es_client/es_client.dart';


/// tests for SitesApi
void main() {
  final instance = EsClient().getSitesApi();

  group(SitesApi, () {
    //Future<ListSiteResponse> sitesControllerFindAll({ String search, String farmType, bool assignedTo, num longitude, num latitude, String filterBy, String endDate, String startDate, String siteType, String disease, String testResult, String project }) async
    test('test sitesControllerFindAll', () async {
      // TODO
    });

  });
}
