import '../models/entity.dart';

abstract class Repository<T extends Entity> {
  Future<T?> getById(String id);
  Future<List<T>> getAll();
  Future<void> save(T entity);
  Future<void> delete(String id);
}
