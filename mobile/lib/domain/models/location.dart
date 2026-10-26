import 'entity.dart';

class Location extends Entity {
  const Location({
    required super.id,
    required this.name,
    required this.latitude,
    required this.longitude,
  });
  final String name;
  final String latitude;
  final String longitude;

  Location copyWith({
    String? id,
    String? name,
    String? latitude,
    String? longitude,
  }) =>
      Location(
        id: id ?? this.id,
        name: name ?? this.name,
        latitude: latitude ?? this.latitude,
        longitude: longitude ?? this.longitude,
      );
}
