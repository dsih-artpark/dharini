import 'package:test/test.dart';
import 'package:es_client/es_client.dart';


/// tests for InvitesApi
void main() {
  final instance = EsClient().getInvitesApi();

  group(InvitesApi, () {
    //Future<InviteResponse> invitesControllerGetInviteByToken(String inviteToken) async
    test('test invitesControllerGetInviteByToken', () async {
      // TODO
    });

    //Future<FetchAllInviteResponse> invitesControllerGetInvites() async
    test('test invitesControllerGetInvites', () async {
      // TODO
    });

    //Future<JsonObject> invitesControllerInviteAccept(String inviteToken) async
    test('test invitesControllerInviteAccept', () async {
      // TODO
    });

    //Future<JsonObject> invitesControllerInviteToWorkspace(CreateWorkspaceInviteDto createWorkspaceInviteDto) async
    test('test invitesControllerInviteToWorkspace', () async {
      // TODO
    });

  });
}
