import 'package:test/test.dart';
import 'package:es_client/es_client.dart';


/// tests for UserApi
void main() {
  final instance = EsClient().getUserApi();

  group(UserApi, () {
    //Future<UserResponse> userControllerCreate(CreateUserDto createUserDto) async
    test('test userControllerCreate', () async {
      // TODO
    });

    //Future<FetchAllUserResponse> userControllerFindAll() async
    test('test userControllerFindAll', () async {
      // TODO
    });

    //Future<UserResponse> userControllerFindOne(String id) async
    test('test userControllerFindOne', () async {
      // TODO
    });

    //Future<UserProfileResponse> userControllerProfile() async
    test('test userControllerProfile', () async {
      // TODO
    });

    //Future<UserResponse> userControllerUpdate(String id, UpdateUserDto updateUserDto) async
    test('test userControllerUpdate', () async {
      // TODO
    });

  });
}
