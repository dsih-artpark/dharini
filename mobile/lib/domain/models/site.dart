import 'address.dart';
import 'entity.dart';
import 'site_contact.dart';
import 'site_types.dart';

class Site extends Entity {
  const Site({
    required super.id,
    required this.name,
    required this.address,
    required this.contact,
    required this.farmType,
    required this.siteType,
  });
  final String name;
  final Address address;
  final Contact contact;
  final FarmType farmType;
  final SiteType siteType;

  Site copyWith({
    String? id,
    String? name,
    Address? address,
    Contact? contact,
    FarmType? farmType,
    SiteType? siteType,
  }) =>
      Site(
        id: id ?? this.id,
        name: name ?? this.name,
        address: address ?? this.address,
        contact: contact ?? this.contact,
        farmType: farmType ?? this.farmType,
        siteType: siteType ?? this.siteType,
      );
}
