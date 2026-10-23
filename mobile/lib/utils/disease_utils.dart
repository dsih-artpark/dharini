import 'dart:convert';

/// Helper class for parsing disease-related data from backend responses
class DiseaseUtils {
  /// Extracts the active disease short names from the `suspectDiseaseData` field
  /// which contains JSON-encoded strings of disease data.
  static List<String> extractActiveDiseases(List<String>? suspectDiseaseData) {
    if (suspectDiseaseData == null || suspectDiseaseData.isEmpty) {
      return [];
    }

    return suspectDiseaseData
        .map((jsonStr) {
          try {
            final decoded = jsonDecode(jsonStr);
            return decoded['shortName'] as String?;
          } catch (e) {
            return null;
          }
        })
        .where((d) => d != null)
        .cast<String>()
        .toList();
  }
}
