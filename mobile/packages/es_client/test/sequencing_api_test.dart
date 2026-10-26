import 'package:test/test.dart';
import 'package:es_client/es_client.dart';


/// tests for SequencingApi
void main() {
  final instance = EsClient().getSequencingApi();

  group(SequencingApi, () {
    //Future sequencingControllerDownloadJobFile(String id, String fileName) async
    test('test sequencingControllerDownloadJobFile', () async {
      // TODO
    });

    //Future sequencingControllerGetAllJobs() async
    test('test sequencingControllerGetAllJobs', () async {
      // TODO
    });

    //Future sequencingControllerGetAllSubmissions() async
    test('test sequencingControllerGetAllSubmissions', () async {
      // TODO
    });

    //Future sequencingControllerGetJob(String id) async
    test('test sequencingControllerGetJob', () async {
      // TODO
    });

    //Future sequencingControllerGetNcbiPreview(String accession) async
    test('test sequencingControllerGetNcbiPreview', () async {
      // TODO
    });

    //Future sequencingControllerGetSubmission(String id) async
    test('test sequencingControllerGetSubmission', () async {
      // TODO
    });

    //Future sequencingControllerGetVisualizationHtml(String id) async
    test('test sequencingControllerGetVisualizationHtml', () async {
      // TODO
    });

    //Future sequencingControllerSearchLabSamples(String q) async
    test('test sequencingControllerSearchLabSamples', () async {
      // TODO
    });

    //Future sequencingControllerSubmitJob(SubmitSequencingJobDto submitSequencingJobDto) async
    test('test sequencingControllerSubmitJob', () async {
      // TODO
    });

  });
}
