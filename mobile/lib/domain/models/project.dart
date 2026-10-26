import 'entity.dart';

class Project extends Entity {
  const Project({
    required super.id,
    required this.name,
    required this.adminId,
    required this.diseaseIds,
    required this.superAdminId,
    required this.locationId,
  });
  final String name;
  final String adminId;
  final List<String> diseaseIds;
  final String superAdminId;
  final String locationId;

  Project copyWith({
    String? id,
    String? name,
    String? adminId,
    List<String>? diseaseIds,
    String? superAdminId,
    String? locationId,
  }) =>
      Project(
        id: id ?? this.id,
        name: name ?? this.name,
        adminId: adminId ?? this.adminId,
        diseaseIds: diseaseIds ?? this.diseaseIds,
        superAdminId: superAdminId ?? this.superAdminId,
        locationId: locationId ?? this.locationId,
      );
}
