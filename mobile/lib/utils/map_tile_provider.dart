import 'package:flutter_dotenv/flutter_dotenv.dart';

class AppTileProvider {
  static String stadiaBright() {
    return _build('osm_bright');
  }

  static String stadiaOutdoors() {
    return _build('outdoors');
  }

  static String stadiaAlidadeSmooth() {
    return _build('alidade_smooth');
  }

  static String stadiaStamenTerrain() {
    return _build('stamen_terrain');
  }

  static String esriSatellite() {
    return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
  }

  static String _build(String style) {
    final apiKey = dotenv.env['MAP_API_KEY'];
    return 'https://tiles.stadiamaps.com/tiles/$style/{z}/{x}/{y}.png?api_key=$apiKey';
  }
}
