import 'package:test/test.dart';
import 'package:es_client/es_client.dart';


/// tests for WorkspacesApi
void main() {
  final instance = EsClient().getWorkspacesApi();

  group(WorkspacesApi, () {
    //Future<JsonObject> workspacesControllerAddMember(String workspaceId, CreateWorkspaceMemberDto createWorkspaceMemberDto) async
    test('test workspacesControllerAddMember', () async {
      // TODO
    });

    //Future<JsonObject> workspacesControllerCreate(CreateWorkspaceDto createWorkspaceDto) async
    test('test workspacesControllerCreate', () async {
      // TODO
    });

    //Future<JsonObject> workspacesControllerCreateProject(String workspaceId, CreateWorkspaceProjectDto createWorkspaceProjectDto) async
    test('test workspacesControllerCreateProject', () async {
      // TODO
    });

    //Future<JsonObject> workspacesControllerFindMembers(String workspaceId) async
    test('test workspacesControllerFindMembers', () async {
      // TODO
    });

    //Future<JsonObject> workspacesControllerFindMine() async
    test('test workspacesControllerFindMine', () async {
      // TODO
    });

    //Future<JsonObject> workspacesControllerFindOne(String workspaceId) async
    test('test workspacesControllerFindOne', () async {
      // TODO
    });

    //Future<JsonObject> workspacesControllerFindProjects(String workspaceId) async
    test('test workspacesControllerFindProjects', () async {
      // TODO
    });

    //Future<JsonObject> workspacesControllerRemoveMember(String workspaceId, String memberId) async
    test('test workspacesControllerRemoveMember', () async {
      // TODO
    });

    //Future<JsonObject> workspacesControllerUpdate(String workspaceId, UpdateWorkspaceDto updateWorkspaceDto) async
    test('test workspacesControllerUpdate', () async {
      // TODO
    });

    //Future<JsonObject> workspacesControllerUpdateMember(String workspaceId, String memberId, UpdateWorkspaceMemberDto updateWorkspaceMemberDto) async
    test('test workspacesControllerUpdateMember', () async {
      // TODO
    });

  });
}
