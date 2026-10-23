import 'package:es_platform_mobile/views/sites/widgets/dropdown.dart';

enum QuestionType {
  text,
  number,
  dropdown,
  radio,
  date,
  checkbox,
  multiSelectDropdown,
  speciesHerdList,
  toggle,
  speciesDropdown,
}

class QuestionConfig {
  final String label;
  final QuestionType type;
  final List<CustomDropdownOption<String>>? options;
  final List<String>? checkboxOptions;
  final bool Function(Map<String, dynamic> answers)? showIf;
  final bool isReadOnly;

  const QuestionConfig({
    required this.label,
    required this.type,
    this.options,
    this.checkboxOptions,
    this.showIf,
    this.isReadOnly = false,
  });
}

final Map<String, QuestionConfig> questionRegistry = {
  // AI Questions
  'farmType': const QuestionConfig(
    label: 'Farm Type',
    type: QuestionType.dropdown,
    options: [
      CustomDropdownOption(id: 'Layer', label: 'Layer'),
      CustomDropdownOption(id: 'Broiler', label: 'Broiler'),
      CustomDropdownOption(id: 'Breeder', label: 'Breeder'),
      CustomDropdownOption(id: 'Backyard', label: 'Backyard'),
    ],
  ),
  'numberOfSheds': const QuestionConfig(
    label: 'Number of sheds',
    type: QuestionType.number,
  ),
  'shedCapacity': const QuestionConfig(
    label: 'Shed capacity',
    type: QuestionType.number,
  ),
  'birdsInShed': const QuestionConfig(
    label: 'Number of birds in the shed',
    type: QuestionType.number,
  ),
  'farmCapacity': const QuestionConfig(
    label: 'Farm capacity',
    type: QuestionType.number,
  ),
  'farmSize': const QuestionConfig(
    label: 'Farm size',
    type: QuestionType.text,
  ),
  'vaccinationStage_AI': const QuestionConfig(
    label: 'Vaccination stage',
    type: QuestionType.dropdown,
    options: [
      CustomDropdownOption(id: 'Vaccinated', label: 'Vaccinated'),
      CustomDropdownOption(id: 'Not Vaccinated', label: 'Not Vaccinated'),
      CustomDropdownOption(id: 'Unknown', label: 'Unknown'),
    ],
  ),
  'breed_AI': const QuestionConfig(
    label: 'Breed',
    type: QuestionType.text,
  ),
  'species_AI': const QuestionConfig(
    label: 'Species',
    type: QuestionType.speciesDropdown,
  ),
  'mortalityObservedInShed': const QuestionConfig(
    label: 'Mortality Observed in Shed',
    type: QuestionType.radio,
  ),
  'dropInEggProduction': const QuestionConfig(
    label: 'Drop in Egg Production',
    type: QuestionType.toggle,
  ),

  // AI sample-level questions
  'birdId': const QuestionConfig(
    label: 'Bird ID',
    type: QuestionType.text,
  ),
  'ageYears': const QuestionConfig(
    label: 'Age (Years)',
    type: QuestionType.number,
  ),
  'ageMonths': const QuestionConfig(
    label: 'Age (Months)',
    type: QuestionType.number,
  ),
  'dropInFeedIntake': const QuestionConfig(
    label: 'Drop in Feed Intake',
    type: QuestionType.toggle,
  ),
  'dropInWaterIntake': const QuestionConfig(
    label: 'Drop in Water Intake',
    type: QuestionType.toggle,
  ),

  // Common Animal Questions (FMD, LSD)
  'animalTagId': const QuestionConfig(
    label: 'Animal Tag ID',
    type: QuestionType.text,
  ),
  'species': const QuestionConfig(
    label: 'Species',
    type: QuestionType.speciesDropdown,
  ),
  'breed': const QuestionConfig(
    label: 'Breed',
    type: QuestionType.text,
  ),
  'age': const QuestionConfig(
    label: 'Age',
    type: QuestionType.number,
  ),
  'gender': const QuestionConfig(
    label: 'Gender',
    type: QuestionType.dropdown,
    options: [
      CustomDropdownOption(id: 'Male', label: 'Male'),
      CustomDropdownOption(id: 'Female', label: 'Female'),
      CustomDropdownOption(id: 'Unknown', label: 'Unknown'),
    ],
  ),
  'speciesHerdList': const QuestionConfig(
    label: 'Species & Herd Size',
    type: QuestionType.speciesHerdList,
  ),
  'totalAnimalsAtSite': const QuestionConfig(
    label: 'Total Animals at Site',
    type: QuestionType.number,
  ),
  'vaccinationStage': const QuestionConfig(
    label: 'Vaccination Stage',
    type: QuestionType.dropdown,
    options: [
      CustomDropdownOption(
          id: 'Vaccinated within 1 year', label: 'Vaccinated within 1 year'),
      CustomDropdownOption(
          id: 'Vaccinated before 1 year', label: 'Vaccinated before 1 year'),
      CustomDropdownOption(id: 'Not Vaccinated', label: 'Not Vaccinated'),
      CustomDropdownOption(id: 'Unknown', label: 'Unknown'),
    ],
  ),
  'diseaseHistory': const QuestionConfig(
    label: 'Disease History',
    type: QuestionType.multiSelectDropdown,
    checkboxOptions: [
      'FMD-within 1 year',
      'FMD-before 1 year',
      'LSD-within 1 year',
      'LSD-before 1 year',
      'No history',
      'Unknown',
    ],
  ),
  'averageMilkProductionPerDay_withinOneYear': const QuestionConfig(
    label: 'Avg. Milk Production (L/day) - Within 1 Year',
    type: QuestionType.number,
  ),
  'averageMilkProductionPerDay_beforeOneYear': const QuestionConfig(
    label: 'Avg. Milk Production (L/day) - Before 1 Year',
    type: QuestionType.number,
  ),
  'feverObserved': const QuestionConfig(
    label: 'Fever Observed?',
    type: QuestionType.toggle,
  ),
  'feverAnimalCount': QuestionConfig(
    label: 'How many animals have fever',
    type: QuestionType.number,
    showIf: (answers) => answers['feverObserved'] == true,
  ),
  'firstNoticedDate': QuestionConfig(
    label: 'First Noticed Date',
    type: QuestionType.date,
    showIf: (answers) => answers['feverObserved'] == true,
  ),
  'vectors': const QuestionConfig(
    label: 'Presence of Vectors',
    type: QuestionType.checkbox,
    checkboxOptions: ['Ticks', 'Flies', 'Mosquitoes'],
  ),
};

// Visit-level questions config mapped by Disease and FarmType.
// If a farmType is not found, fallback to 'default'.
final Map<String, Map<String, List<String>>> visitDiseaseQuestionsConfig = {
  'AI': {
    'poultry_farm': [
      'numberOfSheds',
      'shedCapacity',
      'birdsInShed',
      'farmCapacity',
      'farmSize',
      'mortalityObservedInShed',
    ],
    'live_bird_market': [
      'speciesHerdList',
    ],
  },
  'FMD': {
    'default': ['speciesHerdList', 'totalAnimalsAtSite'],
  },
  'LSD': {
    'default': ['speciesHerdList', 'totalAnimalsAtSite'],
  },
};

List<String> getVisitQuestions(String disease, String? farmType) {
  final diseaseConfig = visitDiseaseQuestionsConfig[disease];
  if (diseaseConfig == null) return [];

  if (farmType != null && diseaseConfig.containsKey(farmType)) {
    return diseaseConfig[farmType]!;
  }

  return diseaseConfig['default'] ?? [];
}

// Sample-level questions config
final Map<String, Map<String, List<String>>> sampleDiseaseQuestionsConfig = {
  'AI': {
    'default': [
      'birdId',
      'ageYears',
      'ageMonths',
      'vaccinationStage_AI',
      'breed_AI',
      'species_AI',
      'dropInFeedIntake',
      'dropInWaterIntake',
      'dropInEggProduction',
    ],
  },
  'FMD': {
    'default': [
      'animalTagId',
      'species',
      'breed',
      'ageYears',
      'ageMonths',
      'gender',
      'vaccinationStage',
      'diseaseHistory',
      'averageMilkProductionPerDay_withinOneYear',
      'averageMilkProductionPerDay_beforeOneYear',
      'feverObserved',
      'firstNoticedDate',
      'vectors',
    ],
  },
  'LSD': {
    'default': [
      'animalTagId',
      'species',
      'breed',
      'ageYears',
      'ageMonths',
      'gender',
      'vaccinationStage',
      'diseaseHistory',
      'averageMilkProductionPerDay_withinOneYear',
      'averageMilkProductionPerDay_beforeOneYear',
      'feverObserved',
      'firstNoticedDate',
      'vectors',
    ],
  },
};

List<String> getSampleQuestions(String disease, String? farmType) {
  final diseaseConfig = sampleDiseaseQuestionsConfig[disease];
  if (diseaseConfig == null) return [];

  if (farmType != null && diseaseConfig.containsKey(farmType)) {
    return diseaseConfig[farmType]!;
  }

  return diseaseConfig['default'] ?? [];
}

// Legacy maps for backward compatibility during refactoring
final Map<String, List<String>> visitDiseaseQuestions = {
  for (var entry in visitDiseaseQuestionsConfig.entries)
    entry.key: entry.value['default'] ?? entry.value.values.first,
};

final Map<String, List<String>> sampleDiseaseQuestions = {
  for (var entry in sampleDiseaseQuestionsConfig.entries)
    entry.key: entry.value['default'] ?? entry.value.values.first,
};

final Map<String, List<String>> diseaseQuestions = {
  'AI': [
    ...getVisitQuestions('AI', null),
    ...getSampleQuestions('AI', null),
  ],
  'FMD': [
    ...getVisitQuestions('FMD', null),
    ...getSampleQuestions('FMD', null),
  ],
  'LSD': [
    ...getVisitQuestions('LSD', null),
    ...getSampleQuestions('LSD', null),
  ],
};
