import 'package:design_system/design_system.dart';
import 'package:es_client/es_client.dart';
import 'package:es_platform_mobile/hooks/auth.dart';
import 'package:es_platform_mobile/views/sites/widgets/dropdown.dart';
import 'package:es_platform_mobile/views/visits/disease_questions_config.dart';
import 'package:es_platform_mobile/views/visits/widgets/question_renderer.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';

import 'models/sample_data.dart';

class SampleSelectionAndMetadataScreen extends HookWidget {
  final String visitId;
  final UpdateVisitDto updateVisitDto;
  final VisitResponseData visitDetails;
  final String? collectionType; // 'Clinical' or 'Environmental' or 'Both'
  final String? currentFlow; // 'Clinical' or 'Environmental'
  final bool isBothFlow;
  final List<String> completedFlows;
  final List<SampleData> existingSamples;

  const SampleSelectionAndMetadataScreen({
    Key? key,
    required this.visitId,
    required this.updateVisitDto,
    required this.visitDetails,
    this.collectionType,
    this.currentFlow,
    this.isBothFlow = false,
    this.completedFlows = const [],
    this.existingSamples = const [],
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final sampleTypes = useSampleType();

    final selectedSampleType = useState<SampleTypeResponseData?>(null);
    final barcodeController = useTextEditingController();
    final quantityController = useTextEditingController();
    final unitController = useTextEditingController();

    // Animal/Sample Metadata
    final animalIdController = useTextEditingController();
    final sampleMetadata = useState<Map<String, dynamic>>({});

    final isClinical = currentFlow == 'Clinical';

    void handleProceed() {
      if (barcodeController.text.trim().isEmpty ||
          selectedSampleType.value == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
              content: Text('Please select sample type and scan barcode'),
              backgroundColor: Colors.red),
        );
        return;
      }

      final metadata = Map<String, dynamic>.from(sampleMetadata.value);
      if (isClinical && animalIdController.text.isNotEmpty) {
        metadata['animalId'] = animalIdController.text;
      }

      final newSample = SampleData(
        replicates: '0',
        photos: [],
        diseases: [],
        originalSampleBarcode: barcodeController.text.trim(),
        barcode: barcodeController.text.trim(),
        comments: '',
        sampleType: selectedSampleType.value!.id,
        sampleName: selectedSampleType.value!.name,
        quantity: num.tryParse(quantityController.text),
        unit: unitController.text.isEmpty ? null : unitController.text,
        metadata: metadata,
      );

      final nextSamples = [...existingSamples, newSample];

      // Route to NextActionScreen
      context.push('/NextActionScreen', extra: {
        'visitId': visitId,
        'updateVisitDto': updateVisitDto,
        'visitDetails': visitDetails,
        'collectionType': collectionType,
        'currentFlow': currentFlow,
        'isBothFlow': isBothFlow,
        'completedFlows': completedFlows,
        'existingSamples': nextSamples,
      });
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.textStrong),
          onPressed: () => context.pop(),
        ),
        backgroundColor: AppColors.white,
        elevation: 0,
        title: Text(
          isClinical
              ? 'Clinical Sample Details'
              : 'Environmental Sample Details',
          style: AppTypography.textTheme.bodyB2SemiBold.copyWith(
            color: AppColors.textStrong,
          ),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Sample Selection
              Text(
                'Sample Selection',
                style: AppTypography.textTheme.headingH3.copyWith(
                  color: AppColors.textStrong,
                ),
              ),
              const SizedBox(height: 16),

              if (sampleTypes.isLoading)
                const Center(child: CircularProgressIndicator())
              else if (sampleTypes.data != null)
                CustomDropdown<String>(
                  label: 'Sample Type',
                  value: selectedSampleType.value?.id,
                  options: sampleTypes.data!
                      .map((e) =>
                          CustomDropdownOption<String>(id: e.id, label: e.name))
                      .toList(),
                  onChanged: (val) {
                    final matching = sampleTypes.data!
                        .firstWhere((element) => element.id == val);
                    selectedSampleType.value = matching;
                  },
                ),

              const SizedBox(height: 16),

              Text(
                'Barcode',
                style: AppTypography.textTheme.bodyB2Medium
                    .copyWith(color: AppColors.textStrong),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: barcodeController,
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        hintText: 'Enter or scan barcode',
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  IconButton(
                    icon: const Icon(Icons.qr_code_scanner,
                        color: AppColors.primaryLight),
                    onPressed: () async {
                      final scanned = await context
                          .push<List<String>>('/BarcodeScannerScreen', extra: {
                        'visitId': visitId,
                      });
                      if (scanned != null && scanned.isNotEmpty) {
                        barcodeController.text = scanned.first;
                      }
                    },
                  ),
                ],
              ),

              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    flex: 2,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Volume/Quantity',
                          style: AppTypography.textTheme.bodyB2Medium
                              .copyWith(color: AppColors.textStrong),
                        ),
                        const SizedBox(height: 8),
                        TextFormField(
                          controller: quantityController,
                          keyboardType: const TextInputType.numberWithOptions(
                              decimal: true),
                          decoration: const InputDecoration(
                            border: OutlineInputBorder(),
                            hintText: 'e.g. 10',
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    flex: 1,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Unit',
                          style: AppTypography.textTheme.bodyB2Medium
                              .copyWith(color: AppColors.textStrong),
                        ),
                        const SizedBox(height: 8),
                        TextFormField(
                          controller: unitController,
                          decoration: const InputDecoration(
                            border: OutlineInputBorder(),
                            hintText: 'ml/gm',
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 32),

              if (isClinical) ...[
                Text(
                  'Sample Metadata',
                  style: AppTypography.textTheme.headingH3
                      .copyWith(color: AppColors.textStrong),
                ),
                const SizedBox(height: 16),
                Text(
                  'Animal ID',
                  style: AppTypography.textTheme.bodyB2Medium
                      .copyWith(color: AppColors.textStrong),
                ),
                const SizedBox(height: 8),
                TextFormField(
                  controller: animalIdController,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    hintText: 'Enter Animal ID (Optional)',
                  ),
                ),
                const SizedBox(height: 16),
                DiseaseQuestionsForm(
                  questions: {
                    'age': const QuestionConfig(
                        label: 'Age (in months/years)',
                        type: QuestionType.text),
                    'species': const QuestionConfig(
                      label: 'Species',
                      type: QuestionType.dropdown,
                      options: [
                        CustomDropdownOption(id: 'Cattle', label: 'Cattle'),
                        CustomDropdownOption(id: 'Buffalo', label: 'Buffalo'),
                        CustomDropdownOption(id: 'Sheep', label: 'Sheep'),
                        CustomDropdownOption(id: 'Goat', label: 'Goat'),
                        CustomDropdownOption(id: 'Pig', label: 'Pig'),
                        CustomDropdownOption(id: 'Other', label: 'Other'),
                      ],
                    ),
                    'breed': const QuestionConfig(
                        label: 'Breed', type: QuestionType.text),
                    'gender': const QuestionConfig(
                        label: 'Gender',
                        type: QuestionType.dropdown,
                        options: [
                          CustomDropdownOption(id: 'Male', label: 'Male'),
                          CustomDropdownOption(id: 'Female', label: 'Female'),
                          CustomDropdownOption(id: 'Unknown', label: 'Unknown'),
                        ]),
                  },
                  answers: sampleMetadata.value,
                  onAnswerChanged: (key, value) {
                    final curr =
                        Map<String, dynamic>.from(sampleMetadata.value);
                    if (value == null || (value is String && value.isEmpty)) {
                      curr.remove(key);
                    } else {
                      curr[key] = value;
                    }
                    sampleMetadata.value = curr;
                  },
                ),
              ],

              const SizedBox(height: 40),
              ElevatedButton(
                onPressed: handleProceed,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primaryLight,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: Text(
                  'Continue',
                  style: AppTypography.textTheme.bodyB2SemiBold.copyWith(
                    color: AppColors.white,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
