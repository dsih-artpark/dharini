import '../models/user.dart';
import 'repository.dart';

abstract class UserRepository extends Repository<User> {
  Future<User?> getByEmail(String email);
  Future<List<User>> getByOrganisation(String organisationId);
  Future<User?> getOrganisationAdmin(String organisationId);
}
