import 'package:test/test.dart';
import 'package:es_client/es_client.dart';


/// tests for RolesApi
void main() {
  final instance = EsClient().getRolesApi();

  group(RolesApi, () {
    //Future<ListRoleResponse> rolesControllerFindAll() async
    test('test rolesControllerFindAll', () async {
      // TODO
    });

  });
}
