import 'package:test/test.dart';
import 'package:es_client/es_client.dart';


/// tests for SearchApi
void main() {
  final instance = EsClient().getSearchApi();

  group(SearchApi, () {
    //Future<SearchResponse> searchControllerGlobalSearch({ String searchText }) async
    test('test searchControllerGlobalSearch', () async {
      // TODO
    });

  });
}
