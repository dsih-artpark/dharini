import 'package:domain/domain.dart';

import '../../../mappers/entity_mappers.dart';
import 'invite_dto.dart';

class InviteMapper implements EntityMapper<Invite, InviteDto> {
  const InviteMapper();

  @override
  Invite toDomain(InviteDto dto) => Invite(
        id: dto.id,
        invitedById: dto.invitedById,
        inviteeType: dto.inviteeType != null
            ? InviteeType.values.byName(dto.inviteeType!)
            : null,
        organizationName: dto.organizationName,
        firstName: dto.firstName,
        lastName: dto.lastName,
        organizationType: dto.organizationType != null
            ? OrganizationType.values.byName(dto.organizationType!)
            : null,
        email: dto.email,
        contactNumber: dto.contactNumber,
        projectId: dto.projectId,
        inviteToken: dto.inviteToken,
        expirationDate: dto.expirationDate,
        accepted: dto.accepted,
        userType:
            dto.userType != null ? UserType.values.byName(dto.userType!) : null,
        createdAt: dto.createdAt,
        updatedAt: dto.updatedAt,
      );

  @override
  InviteDto toDto(Invite entity) => InviteDto(
        id: entity.id,
        invitedById: entity.invitedById,
        inviteeType: entity.inviteeType?.name,
        organizationName: entity.organizationName,
        firstName: entity.firstName,
        lastName: entity.lastName,
        organizationType: entity.organizationType?.name,
        email: entity.email,
        contactNumber: entity.contactNumber,
        projectId: entity.projectId,
        inviteToken: entity.inviteToken,
        expirationDate: entity.expirationDate,
        accepted: entity.accepted,
        userType: entity.userType?.name,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      );

  @override
  List<Invite> toDomainList(List<InviteDto> dtos) =>
      dtos.map(toDomain).toList();

  @override
  List<InviteDto> toDtoList(List<Invite> entities) =>
      entities.map(toDto).toList();
}
