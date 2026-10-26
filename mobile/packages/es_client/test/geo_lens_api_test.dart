import 'package:test/test.dart';
import 'package:es_client/es_client.dart';


/// tests for GeoLensApi
void main() {
  final instance = EsClient().getGeoLensApi();

  group(GeoLensApi, () {
    // Get all diseases
    //
    //Future geoLensControllerGetDiseases() async
    test('test geoLensControllerGetDiseases', () async {
      // TODO
    });

    // Get eBird observations from backend proxy
    //
    //Future geoLensControllerGetEbirdObservations(num lat, num lng, { num dist, num back }) async
    test('test geoLensControllerGetEbirdObservations', () async {
      // TODO
    });

    // Get poultry farms, optionally by state
    //
    //Future geoLensControllerGetPoultryFarms({ String state }) async
    test('test geoLensControllerGetPoultryFarms', () async {
      // TODO
    });

    // Get all poultry farms in CSV-compatible format
    //
    //Future geoLensControllerGetPoultryFarmsCsv() async
    test('test geoLensControllerGetPoultryFarmsCsv', () async {
      // TODO
    });

    // Get all sites with their locations
    //
    //Future geoLensControllerGetSites() async
    test('test geoLensControllerGetSites', () async {
      // TODO
    });

    // Get water boundaries as GeoJSON (optionally filtered by bbox)
    //
    //Future geoLensControllerGetWaterBoundaries({ String minLng, String minLat, String maxLng, String maxLat }) async
    test('test geoLensControllerGetWaterBoundaries', () async {
      // TODO
    });

    // Get simplified water boundaries (ST_Simplify) for faster map rendering
    //
    //Future geoLensControllerGetWaterBoundariesSimplified({ String minLng, String minLat, String maxLng, String maxLat }) async
    test('test geoLensControllerGetWaterBoundariesSimplified', () async {
      // TODO
    });

    // Get all unique wetland states
    //
    //Future geoLensControllerGetWetlandStates() async
    test('test geoLensControllerGetWetlandStates', () async {
      // TODO
    });

    // Get wetlands filtered by state/district
    //
    //Future geoLensControllerGetWetlands({ String state, String district }) async
    test('test geoLensControllerGetWetlands', () async {
      // TODO
    });

    // Get wetlands in CSV-compatible format (for frontend)
    //
    //Future geoLensControllerGetWetlandsCsv({ String state }) async
    test('test geoLensControllerGetWetlandsCsv', () async {
      // TODO
    });

  });
}
