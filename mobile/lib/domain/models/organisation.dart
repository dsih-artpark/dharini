import 'entity.dart';

class Organisation extends Entity {
  // Reference to User (super admin)

  const Organisation({
    required super.id,
    required this.name,
    required this.adminId,
  });
  final String name;
  final String adminId;

  Organisation copyWith({
    String? id,
    String? name,
    String? adminId,
  }) =>
      Organisation(
        id: id ?? this.id,
        name: name ?? this.name,
        adminId: adminId ?? this.adminId,
      );
}
