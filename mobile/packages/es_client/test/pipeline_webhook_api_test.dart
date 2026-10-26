import 'package:test/test.dart';
import 'package:es_client/es_client.dart';


/// tests for PipelineWebhookApi
void main() {
  final instance = EsClient().getPipelineWebhookApi();

  group(PipelineWebhookApi, () {
    //Future pipelineWebhookControllerHandleWebhook(String xDhariniEvent, String xDhariniDelivery, String xDhariniTimestamp, String xDhariniSignature) async
    test('test pipelineWebhookControllerHandleWebhook', () async {
      // TODO
    });

  });
}
