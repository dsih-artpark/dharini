import '../models/site.dart';
import '../models/site_types.dart';
import 'repository.dart';

abstract class SiteRepository extends Repository<Site> {
  Future<List<Site>> getByFarmType(FarmType farmType);
  Future<List<Site>> getBySiteType(SiteType siteType);
  Future<List<Site>> getByLocation(String locationId);
}
