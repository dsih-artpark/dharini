import 'package:test/test.dart';
import 'package:es_client/es_client.dart';


/// tests for StatisticsApi
void main() {
  final instance = EsClient().getStatisticsApi();

  group(StatisticsApi, () {
    //Future<ExploreSitesResponse> statisticsControllerExploreSites({ String surveillanceType, String endDate, String startDate, String disease, String regionId }) async
    test('test statisticsControllerExploreSites', () async {
      // TODO
    });

    //Future<DiseaseStatsResponse> statisticsControllerGetDiseaseWiseSample() async
    test('test statisticsControllerGetDiseaseWiseSample', () async {
      // TODO
    });

    //Future<MostPositiveSiteResponse> statisticsControllerGetMostPositive(String endDate, String startDate, { String diseaseId }) async
    test('test statisticsControllerGetMostPositive', () async {
      // TODO
    });

    //Future<SampleStatLogisticResponse> statisticsControllerGetSampleStatLogistics({ String diseaseId }) async
    test('test statisticsControllerGetSampleStatLogistics', () async {
      // TODO
    });

    //Future<GetSiteOnDiseaseResponse> statisticsControllerGetSiteOnDisease() async
    test('test statisticsControllerGetSiteOnDisease', () async {
      // TODO
    });

    //Future<SampleBreakDownResponse> statisticsControllerSieWiseSampleBreakDown({ String region, String disease }) async
    test('test statisticsControllerSieWiseSampleBreakDown', () async {
      // TODO
    });

  });
}
