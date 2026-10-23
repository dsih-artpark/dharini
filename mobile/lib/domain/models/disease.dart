import 'entity.dart';

class Disease extends Entity {
  const Disease({
    required super.id,
    required this.name,
  });
  final String name;

  Disease copyWith({
    String? id,
    String? name,
  }) =>
      Disease(
        id: id ?? this.id,
        name: name ?? this.name,
      );
}
