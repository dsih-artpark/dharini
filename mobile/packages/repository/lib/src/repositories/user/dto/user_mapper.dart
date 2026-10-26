import 'package:domain/domain.dart';
import '../../../mappers/entity_mappers.dart';
import 'user_dto.dart';

class UserMapper implements EntityMapper<User, UserDto> {
  const UserMapper();

  @override
  User toDomain(UserDto dto) => User(
        id: dto.id,
        firstName: dto.firstName,
        lastName: dto.lastName,
        designation: dto.designation,
        contactNumber: dto.contactNumber,
        address: dto.address,
        email: dto.email,
        otp: dto.otp,
        userType:
            dto.userType != null ? UserType.values.byName(dto.userType!) : null,
        status:
            dto.status != null ? StatusType.values.byName(dto.status!) : null,
        createdAt: dto.createdAt,
        updatedAt: dto.updatedAt,
        roleIds: dto.roleIds,
        visitIds: dto.visitIds,
        organizationId: dto.organizationId,
        projectIds: dto.projectIds,
        projectId: dto.projectId,
        siteIds: dto.siteIds,
      );

  @override
  UserDto toDto(User entity) => UserDto(
        id: entity.id,
        firstName: entity.firstName,
        lastName: entity.lastName,
        designation: entity.designation,
        contactNumber: entity.contactNumber,
        address: entity.address,
        email: entity.email,
        otp: entity.otp,
        userType: entity.userType?.name,
        status: entity.status?.name,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        roleIds: entity.roleIds,
        visitIds: entity.visitIds,
        organizationId: entity.organizationId,
        projectIds: entity.projectIds,
        projectId: entity.projectId,
        siteIds: entity.siteIds,
      );

  @override
  List<User> toDomainList(List<UserDto> dtos) => dtos.map(toDomain).toList();

  @override
  List<UserDto> toDtoList(List<User> entities) => entities.map(toDto).toList();
}
