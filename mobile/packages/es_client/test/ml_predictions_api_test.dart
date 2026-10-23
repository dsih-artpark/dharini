import 'package:test/test.dart';
import 'package:es_client/es_client.dart';


/// tests for MLPredictionsApi
void main() {
  final instance = EsClient().getMLPredictionsApi();

  group(MLPredictionsApi, () {
    // Bird migration predictions (species, maps, seasons)
    //
    // Relayed to the dharini-ml prediction service, whose API reference (paths, parameters, responses) is at https://ml.dharini.artpark.ai/docs. Any logged-in user may call it. Returns 404 when ML is not enabled on this server, 503 when the ML service is unavailable or busy.
    //
    //Future mlControllerBirds() async
    test('test mlControllerBirds', () async {
      // TODO
    });

    // One disease model
    //
    // Relayed to the dharini-ml prediction service, whose API reference (paths, parameters, responses) is at https://ml.dharini.artpark.ai/docs. Any logged-in user may call it. Returns 404 when ML is not enabled on this server, 503 when the ML service is unavailable or busy.
    //
    //Future mlControllerDisease() async
    test('test mlControllerDisease', () async {
      // TODO
    });

    // Livestock disease models available (LSD today)
    //
    // Relayed to the dharini-ml prediction service, whose API reference (paths, parameters, responses) is at https://ml.dharini.artpark.ai/docs. Any logged-in user may call it. Returns 404 when ML is not enabled on this server, 503 when the ML service is unavailable or busy.
    //
    //Future mlControllerDiseases() async
    test('test mlControllerDiseases', () async {
      // TODO
    });

    // Disease risk at up to 50 locations on a date
    //
    // Relayed to the dharini-ml prediction service, whose API reference (paths, parameters, responses) is at https://ml.dharini.artpark.ai/docs. Any logged-in user may call it. Returns 404 when ML is not enabled on this server, 503 when the ML service is unavailable or busy.
    //
    //Future mlControllerPredictDisease() async
    test('test mlControllerPredictDisease', () async {
      // TODO
    });

    // Whether ML predictions are enabled, and which models are loaded
    //
    // The UI shows ML features only when this returns 200. 404: not enabled on this server.
    //
    //Future mlControllerStatus() async
    test('test mlControllerStatus', () async {
      // TODO
    });

  });
}
