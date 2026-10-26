import 'package:built_collection/built_collection.dart';
import 'package:es_client/es_client.dart';

extension SiteResponseDataX on SiteResponseData {
  VisitSiteData toVisitSiteData() {
    return VisitSiteData((b) {
      b
        ..id = id
        ..createdAt = createdAt
        ..name = name
        ..address = address
        ..siteType = siteType
        ..farmType = farmType
        ..siteOwnerName = siteOwnerName
        ..siteOwnerNumber = siteOwnerNumber
        ..pinCode = pinCode ?? 0
        ..workerNumber = workerNumber ?? 0
        ..comment = comment
        ..collectionTime = collectionTime
        ..collectionDuration = collectionDuration ?? 0
        ..collectionFrequency = collectionFrequency ?? 1
        ..collectionFrequencyInterval = collectionFrequencyInterval ?? 7
        ..collectionDayOfWeek = collectionDayOfWeek != null
            ? ListBuilder(collectionDayOfWeek!)
            : ListBuilder()
        ..photos =
            photos != null ? ListBuilder(photos!) : ListBuilder<String>()
        ..siteCode = siteCode;

      if (location != null) {
        b.location.replace(VisitSiteLocationData((l) {
          l.id = location!.id;
          if (location!.coordinates != null) {
            l.coordinates = LocationCoordinatesBuilder()
              ..type = location!.coordinates!.type
              ..coordinates.addAll(location!.coordinates!.coordinates);
          }
          if (location!.region != null) {
            l.region = SiteResponseRegionBuilder()..replace(location!.region!);
          }
        }));
      }
    });
  }
}
