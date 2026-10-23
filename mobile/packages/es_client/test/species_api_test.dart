import 'package:test/test.dart';
import 'package:es_client/es_client.dart';


/// tests for SpeciesApi
void main() {
  final instance = EsClient().getSpeciesApi();

  group(SpeciesApi, () {
    // Create a new species
    //
    //Future<Species> speciesControllerCreate(CreateSpeciesDto createSpeciesDto) async
    test('test speciesControllerCreate', () async {
      // TODO
    });

    // Get all active species
    //
    //Future<BuiltList<Species>> speciesControllerFindAll() async
    test('test speciesControllerFindAll', () async {
      // TODO
    });

    // Get a species by id
    //
    //Future<Species> speciesControllerFindOne(String id) async
    test('test speciesControllerFindOne', () async {
      // TODO
    });

    // Delete a species
    //
    //Future speciesControllerRemove(String id) async
    test('test speciesControllerRemove', () async {
      // TODO
    });

    // Update a species
    //
    //Future<Species> speciesControllerUpdate(String id, UpdateSpeciesDto updateSpeciesDto) async
    test('test speciesControllerUpdate', () async {
      // TODO
    });

  });
}
