/// Disease→SiteType→SubType configuration for site creation.
///
/// This mirrors the web app's `DISEASE_SITE_CONFIG` constant.
/// Key: disease shortName (e.g. 'AI', 'FMD', 'LSD')
/// Value: list of site-type options, each with optional subtypes.

class DiseaseSiteOption {
  final String value;
  final String label;
  final List<DiseaseSubTypeOption>? subtypes;

  const DiseaseSiteOption({
    required this.value,
    required this.label,
    this.subtypes,
  });
}

class DiseaseSubTypeOption {
  final String value;
  final String label;

  const DiseaseSubTypeOption({required this.value, required this.label});
}

const Map<String, List<DiseaseSiteOption>> kDiseaseSiteConfig = {
  'AI': [
    DiseaseSiteOption(
      value: 'poultry_farm',
      label: 'Poultry Farm',
      subtypes: [
        DiseaseSubTypeOption(value: 'broiler', label: 'Broiler'),
        DiseaseSubTypeOption(value: 'breeder', label: 'Breeder'),
        DiseaseSubTypeOption(value: 'layer', label: 'Layer'),
        DiseaseSubTypeOption(value: 'backyard', label: 'Backyard'),
      ],
    ),
    DiseaseSiteOption(value: 'wetland', label: 'Wetland'),
    DiseaseSiteOption(value: 'slaughter_house', label: 'Slaughter House'),
    DiseaseSiteOption(value: 'zoo', label: 'Zoo'),
    DiseaseSiteOption(value: 'sewage', label: 'Sewage'),
    DiseaseSiteOption(value: 'live_bird_market', label: 'Live Bird Market'),
    DiseaseSiteOption(value: 'rescue_center', label: 'Rescue Center'),
    DiseaseSiteOption(value: 'wildlife_sanctuary', label: 'Wildlife Sanctuary'),
  ],
  'FMD': [
    DiseaseSiteOption(value: 'cattle_farm', label: 'Cattle Farm'),
    DiseaseSiteOption(value: 'cattle_market', label: 'Cattle Market'),
    DiseaseSiteOption(value: 'buffalo_farm', label: 'Buffalo Farm'),
    DiseaseSiteOption(value: 'slaughter_house', label: 'Slaughter House'),
    DiseaseSiteOption(value: 'bmcc', label: 'BMCC'),
  ],
  'LSD': [
    DiseaseSiteOption(value: 'cattle_farm', label: 'Cattle Farm'),
    DiseaseSiteOption(value: 'cattle_market', label: 'Cattle Market'),
    DiseaseSiteOption(value: 'buffalo_farm', label: 'Buffalo Farm'),
    DiseaseSiteOption(value: 'slaughter_house', label: 'Slaughter House'),
    DiseaseSiteOption(value: 'bmcc', label: 'BMCC'),
  ],
};

/// Returns deduplicated site-type options for the given set of disease shortNames.
List<DiseaseSiteOption> getSiteOptionsForDiseases(List<String> shortNames) {
  final seen = <String>{};
  final result = <DiseaseSiteOption>[];
  for (final name in shortNames) {
    final options = kDiseaseSiteConfig[name] ?? [];
    for (final opt in options) {
      if (seen.add(opt.value)) {
        result.add(opt);
      }
    }
  }
  return result;
}

/// A mapping of farm-type values to their descriptive labels.
final Map<String, String> farmTypeMap = {
  for (var options in kDiseaseSiteConfig.values)
    for (var opt in options) opt.value: opt.label,
};

/// A mapping of site-sub-type values to their descriptive labels.
final Map<String, String> subTypeMap = {
  for (var options in kDiseaseSiteConfig.values)
    for (var opt in options)
      if (opt.subtypes != null)
        for (var sub in opt.subtypes!) sub.value: sub.label,
};

/// Formats snake_case value (like 'poultry_farm') into a display-friendly label ('Poultry Farm').
String formatValue(String? value) {
  if (value == null || value.isEmpty) return '';
  return value.replaceAll('_', ' ').split(' ').map((word) {
    if (word.isEmpty) return '';
    return word[0].toUpperCase() + word.substring(1).toLowerCase();
  }).join(' ');
}

String formatFarmType(String? value) {
  if (value == null || value.isEmpty) return '';
  if (farmTypeMap.containsKey(value)) return farmTypeMap[value]!;
  return formatValue(value);
}

String formatSubType(String? value) {
  if (value == null || value.isEmpty) return '';
  if (subTypeMap.containsKey(value)) return subTypeMap[value]!;
  return formatValue(value);
}
