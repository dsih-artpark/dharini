import 'package:es_client/es_client.dart';

/// Species applicable to [disease]: those whose `diseaseShortNames` include it,
/// plus species with no diseases listed (they apply to every disease).
/// Returns [species] unchanged when [disease] is null.
List<SpeciesResponseData> filterSpeciesByDisease(
  List<SpeciesResponseData> species,
  String? disease,
) {
  if (disease == null) return species;
  return species.where((s) {
    final diseases = s.diseaseShortNames?.toList() ?? [];
    return diseases.contains(disease) || diseases.isEmpty;
  }).toList();
}
