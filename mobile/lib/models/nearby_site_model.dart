import 'package:es_client/es_client.dart';

class CombinedSite {
  final String id;
  final String name;
  final String? address;
  final String? farmType;
  double? distance;
  final Location? location;
  final bool _isLocal;
  final DateTime? createdAt; // ✅ Add this field

  CombinedSite({
    required this.id,
    required this.name,
    this.address = '',
    this.farmType,
    this.distance,
    this.location,
    required bool isLocal,
    this.createdAt, // ✅ initialize
  }) : _isLocal = isLocal;

  factory CombinedSite.fromNearby(NearbySiteResponseData site) {
    return CombinedSite(
      id: site.id,
      name: site.name,
      address: site.address,
      farmType: site.farmType,
      distance: site.distance.toDouble(),
      location: site.location,
      isLocal: false,
      createdAt:
          null, // ❌ nearby doesn't have meaningful `createdAt` for sorting
    );
  }

  factory CombinedSite.fromLocal(SiteResponseData site) {
    return CombinedSite(
      id: site.id,
      name: site.name,
      address: site.address,
      farmType: site.farmType,
      distance: null,
      location: site.location,
      isLocal: true,
      createdAt: site.createdAt, // ✅ this comes from SiteResponseData
    );
  }

  bool get isLocal => _isLocal;
}
