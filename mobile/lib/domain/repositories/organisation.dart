import '../models/organisation.dart';
import 'repository.dart';

abstract class OrganisationRepository extends Repository<Organisation> {
  Future<List<Organisation>> getByAdmin(String adminId);
}
