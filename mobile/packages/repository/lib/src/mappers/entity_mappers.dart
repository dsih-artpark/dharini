/// Base mapper interface for converting between domain entities and DTOs
abstract class EntityMapper<Entity, Dto> {
  /// Convert from DTO to domain entity
  Entity toDomain(Dto dto);

  /// Convert from domain entity to DTO
  Dto toDto(Entity entity);

  /// Convert list of DTOs to list of domain entities
  List<Entity> toDomainList(List<Dto> dtos) => dtos.map(toDomain).toList();

  /// Convert list of domain entities to list of DTOs
  List<Dto> toDtoList(List<Entity> entities) => entities.map(toDto).toList();
}
