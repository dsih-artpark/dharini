import 'package:es_platform_mobile/views/sites/widgets/dropdown.dart';
import 'disease_questions_config.dart';

final Map<String, QuestionConfig> environmentalQuestionRegistry = {
  // Drinking Water
  'sourceOfDrinkingWater': const QuestionConfig(
    label: 'Source of Drinking Water',
    type: QuestionType.dropdown,
    options: [
      CustomDropdownOption(id: 'Borewell', label: 'Borewell'),
      CustomDropdownOption(id: 'Tap', label: 'Tap'),
      CustomDropdownOption(id: 'River', label: 'River'),
      CustomDropdownOption(id: 'Pond', label: 'Pond'),
      CustomDropdownOption(id: 'Tanker', label: 'Tanker'),
    ],
  ),
  'waterStorageSystem': const QuestionConfig(
    label: 'Water Storage System',
    type: QuestionType.dropdown,
    options: [
      CustomDropdownOption(
          id: 'Common Tank for all Animals in Herd',
          label: 'Common Tank for all Animals in Herd'),
      CustomDropdownOption(
          id: 'Individual Buckets/Tubs for Animals',
          label: 'Individual Buckets/Tubs for Animals'),
    ],
  ),
  'tankDrainProvision': const QuestionConfig(
    label: 'Tank Drain Provision',
    type: QuestionType.radio,
  ),
  'cleaningFrequencyOfWaterTanks': const QuestionConfig(
    label: 'Cleaning Frequency of Water Tanks',
    type: QuestionType.dropdown,
    options: [
      CustomDropdownOption(id: 'Daily', label: 'Daily'),
      CustomDropdownOption(id: 'Bi-Weekly', label: 'Bi-Weekly'),
      CustomDropdownOption(id: 'Weekly', label: 'Weekly'),
    ],
  ),
  'waterRefillFrequency': const QuestionConfig(
    label: 'Water Refill Frequency',
    type: QuestionType.dropdown,
    options: [
      CustomDropdownOption(id: 'Daily', label: 'Daily'),
      CustomDropdownOption(id: 'Bi-Weekly', label: 'Bi-Weekly'),
      CustomDropdownOption(id: 'Weekly', label: 'Weekly'),
    ],
  ),
  'sharedWateringPointsBetweenHerds': const QuestionConfig(
    label: 'Shared Watering Points Between Herds',
    type: QuestionType.radio,
  ),

  // Wastewater
  'outletDrainageSystemAvailable': const QuestionConfig(
    label: 'Outlet / Drainage System Available',
    type: QuestionType.radio,
  ),
  'presenceOfStagnantWater': const QuestionConfig(
    label: 'Presence of Stagnant Water',
    type: QuestionType.radio,
  ),
  'wastewaterContactWithAnimalHousingArea': const QuestionConfig(
    label: 'Wastewater Contact with Animal Housing area',
    type: QuestionType.radio,
  ),

  // Soil
  'animalShedFloor': const QuestionConfig(
    label: 'Animal Shed Floor',
    type: QuestionType.radio,
  ),
  'soilMoisture': const QuestionConfig(
    label: 'Soil Moisture',
    type: QuestionType.dropdown,
    options: [
      CustomDropdownOption(id: 'Dry', label: 'Dry'),
      CustomDropdownOption(id: 'Moist', label: 'Moist'),
      CustomDropdownOption(id: 'Wet', label: 'Wet'),
      CustomDropdownOption(id: 'Waterlogged', label: 'Waterlogged'),
    ],
  ),
  'cleaningFrequency': const QuestionConfig(
    label: 'Cleaning Frequency',
    type: QuestionType.radio,
  ),
  'limeApplication': const QuestionConfig(
    label: 'Lime Application',
    type: QuestionType.radio,
  ),

  // Feed Sample
  'typeOfFeed': const QuestionConfig(
    label: 'Type of Feed',
    type: QuestionType.dropdown,
    options: [
      CustomDropdownOption(id: 'Dry Fodder', label: 'Dry Fodder'),
      CustomDropdownOption(id: 'Green Fodder', label: 'Green Fodder'),
      CustomDropdownOption(id: 'Silage', label: 'Silage'),
      CustomDropdownOption(id: 'Concentrate Feed', label: 'Concentrate Feed'),
      CustomDropdownOption(id: 'Crop Residues', label: 'Crop Residues'),
    ],
  ),
  'feedSource': const QuestionConfig(
    label: 'Feed Source',
    type: QuestionType.dropdown,
    options: [
      CustomDropdownOption(id: 'Farm Produced', label: 'Farm Produced'),
      CustomDropdownOption(
          id: 'Purchased from Market', label: 'Purchased from Market'),
      CustomDropdownOption(
          id: 'Cooperative Supply', label: 'Cooperative Supply'),
      CustomDropdownOption(
          id: 'Commercial Feed Supplier', label: 'Commercial Feed Supplier'),
    ],
  ),
  'feedSharedBetweenFarms': const QuestionConfig(
    label: 'Feed Shared Between Farms',
    type: QuestionType.radio,
  ),
  'feedStorage': const QuestionConfig(
    label: 'Feed Storage',
    type: QuestionType.dropdown,
    options: [
      CustomDropdownOption(id: 'Open Storage', label: 'Open Storage'),
      CustomDropdownOption(id: 'Covered Shed', label: 'Covered Shed'),
      CustomDropdownOption(id: 'Feed Room', label: 'Feed Room'),
      CustomDropdownOption(id: 'Plastic Bags', label: 'Plastic Bags'),
      CustomDropdownOption(id: 'Silage Pit', label: 'Silage Pit'),
      CustomDropdownOption(id: 'Bunker', label: 'Bunker'),
      CustomDropdownOption(
          id: 'Elevated Platform Storage', label: 'Elevated Platform Storage'),
    ],
  ),
};

final _drinkingWaterQuestions = [
  'sourceOfDrinkingWater',
  'waterStorageSystem',
  'tankDrainProvision',
  'cleaningFrequencyOfWaterTanks',
  'waterRefillFrequency',
  'sharedWateringPointsBetweenHerds',
];

final _wastewaterQuestions = [
  'outletDrainageSystemAvailable',
  'presenceOfStagnantWater',
  'wastewaterContactWithAnimalHousingArea',
];

final _soilQuestions = [
  'animalShedFloor',
  'soilMoisture',
  'cleaningFrequency',
  'limeApplication',
];

final _feedQuestions = [
  'typeOfFeed',
  'feedSource',
  'feedSharedBetweenFarms',
  'feedStorage',
];

final Map<String, List<String>> environmentalQuestionsConfig = {
  'drinking water': _drinkingWaterQuestions,
  'wastewater': _wastewaterQuestions,
  'soil': _soilQuestions,
  'feed': _feedQuestions,
};

List<String> getEnvironmentalQuestions(String sampleType) {
  final normalized = sampleType.toLowerCase();
  for (final key in environmentalQuestionsConfig.keys) {
    if (normalized.contains(key)) {
      return environmentalQuestionsConfig[key]!;
    }
  }
  return [];
}
