import '../models/project.dart';
import 'repository.dart';

abstract class ProjectRepository extends Repository<Project> {
  Future<List<Project>> getByAdmin(String adminId);
  Future<List<Project>> getBySuperAdmin(String superAdminId);
  Future<List<Project>> getByLocation(String locationId);
  Future<List<Project>> getByDisease(String diseaseId);
}
