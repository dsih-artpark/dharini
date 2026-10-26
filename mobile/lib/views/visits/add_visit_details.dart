// ignore_for_file: unused_local_variable

import 'dart:convert';
import 'dart:typed_data';

import 'package:built_collection/built_collection.dart';
import 'package:built_value/json_object.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:collection/collection.dart';
import 'package:design_system/design_system.dart';
import 'package:es_client/es_client.dart';
import 'package:es_platform_mobile/hooks/auth.dart';
import 'package:es_platform_mobile/hooks/visit_draft.dart';
import 'package:es_platform_mobile/utils/hive_serialization.dart';
import 'package:es_platform_mobile/widgets/image_upload_grid.dart';
import 'package:es_platform_mobile/utils/disease_site_config.dart';
import 'package:es_platform_mobile/views/visits/disease_questions_config.dart';
import 'package:es_platform_mobile/views/visits/widgets/question_renderer.dart';
import 'package:es_platform_mobile/widgets/image_preview_dialog.dart';
import 'package:es_platform_mobile/utils/image_picker_helper.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import 'package:hive/hive.dart';
import 'package:image_picker/image_picker.dart';

class SuspectDiseaseData {
  final String diseaseId;
  final int sampleCount;
  final bool isSuspectedPositive;

  SuspectDiseaseData({
    required this.diseaseId,
    required this.sampleCount,
    required this.isSuspectedPositive,
  });

  Map<String, dynamic> toJson() => {
        'diseaseId': diseaseId,
        'sampleCount': sampleCount,
        'isSuspectedPositive': isSuspectedPositive,
      };
}

class AddVisitDetails extends HookWidget {
  final VisitResponseData visitDetails;
  final String? collectorId;
  final bool showSuccessSnackbar;

  // final String visitId;
  // final String? collectorId;

  const AddVisitDetails({
    required this.visitDetails,
    this.collectorId,
    this.showSuccessSnackbar = false,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    useEffect(() {
      if (showSuccessSnackbar) {
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (context.mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Site created successfully'),
                backgroundColor: Colors.green,
                duration: Duration(seconds: 2),
              ),
            );
          }
        });
      }
      return null;
    }, []);

    final visitStartedAt = useState<DateTime>(DateTime.now().toUtc());

    final hoovedAnimalsCount = useState<int>(0);
    final fmdSelected = useState<bool>(false);
    final lsdSelected = useState<bool>(false);
    final fmdSuspectedPositive = useState<bool?>(null);
    final lsdSuspectedPositive = useState<bool?>(null);
    final comments = useState<String>('');
    final project = useProject();
    final selectedDiseases = useState<Map<String, bool>>({});
    final suspectedPositives = useState<Map<String, bool?>>({});
    final suspectedPositivesCount = useState<Map<String, int>>({});
    final activeInfectionsPresent = useState<Map<String, bool?>>({});
    final activeInfectionsCount = useState<Map<String, int>>({});
    final uploadedPhotoUrls = useState<List<String>>([]);
    final diseaseQuestionnaire =
        useState<Map<String, Map<String, dynamic>>>({});

    final sitesData = useSites().data;
    final site = useState<SiteResponseData?>(null);
    final hasSiteError = useState<bool>(false);
    final visit = visitDetails;

    final draftController = useVisitDraft(visit.id, initialStepIndex: 1);
    final hasRestored = useState<bool>(false);

    // RESTORE STATE FROM DRAFT
    useEffect(() {
      final draft = draftController.draft;
      if (draft != null && draft.stepData.isNotEmpty && !hasRestored.value) {
        final data = draft.stepData;

        if (data['visitStartedAt'] != null) {
          try {
            visitStartedAt.value =
                DateTime.parse(data['visitStartedAt'] as String);
          } catch (_) {}
        }
        if (data['hoovedAnimalsCount'] != null) {
          hoovedAnimalsCount.value = data['hoovedAnimalsCount'] as int;
        }
        if (data['fmdSelected'] != null) {
          fmdSelected.value = data['fmdSelected'] as bool;
        }
        if (data['lsdSelected'] != null) {
          lsdSelected.value = data['lsdSelected'] as bool;
        }
        if (data['fmdSuspectedPositive'] != null) {
          fmdSuspectedPositive.value = data['fmdSuspectedPositive'] as bool?;
        }
        if (data['lsdSuspectedPositive'] != null) {
          lsdSuspectedPositive.value = data['lsdSuspectedPositive'] as bool?;
        }
        if (data['comments'] != null) {
          comments.value = data['comments'] as String;
        }
        if (data['selectedDiseases'] != null) {
          selectedDiseases.value =
              Map<String, bool>.from(data['selectedDiseases'] as Map);
        }
        if (data['suspectedPositives'] != null) {
          suspectedPositives.value =
              Map<String, bool?>.from(data['suspectedPositives'] as Map);
        }
        if (data['suspectedPositivesCount'] != null) {
          suspectedPositivesCount.value =
              Map<String, int>.from(data['suspectedPositivesCount'] as Map);
        }
        if (data['activeInfectionsPresent'] != null) {
          activeInfectionsPresent.value =
              Map<String, bool?>.from(data['activeInfectionsPresent'] as Map);
        }
        if (data['activeInfectionsCount'] != null) {
          activeInfectionsCount.value =
              Map<String, int>.from(data['activeInfectionsCount'] as Map);
        }
        if (data['uploadedPhotoUrls'] != null) {
          uploadedPhotoUrls.value =
              List<String>.from(data['uploadedPhotoUrls'] as List);
        }
        if (data['diseaseQuestionnaire'] != null) {
          diseaseQuestionnaire.value = (data['diseaseQuestionnaire'] as Map)
              .map((k, v) =>
                  MapEntry(k.toString(), Map<String, dynamic>.from(v as Map)));
        }
        print(
            '[AddVisitDetails] Draft restored successfully for visit: ${visit.id}');
        hasRestored.value = true;
      } else if (draft != null && draft.stepData.isEmpty) {
        hasRestored.value = true;
      }
      return null;
    }, [draftController.draft]);

    // AUTO-SAVE ON CHANGE
    useEffect(() {
      if (!hasRestored.value) return null;

      // Persist all form state needed to restore the screen UI.
      // NOTE: We do NOT persist updateVisitDto here because it is only built
      // when the user taps "Proceed". We persist it there immediately.
      final currentData = <String, dynamic>{
        'visitStartedAt': visitStartedAt.value.toIso8601String(),
        'hoovedAnimalsCount': hoovedAnimalsCount.value,
        'fmdSelected': fmdSelected.value,
        'lsdSelected': lsdSelected.value,
        'fmdSuspectedPositive': fmdSuspectedPositive.value,
        'lsdSuspectedPositive': lsdSuspectedPositive.value,
        'comments': comments.value,
        // Cast map values to JSON-safe primitives (bool is fine, Hive handles it)
        'selectedDiseases': Map<String, dynamic>.from(selectedDiseases.value),
        'suspectedPositives':
            Map<String, dynamic>.from(suspectedPositives.value),
        'suspectedPositivesCount':
            Map<String, dynamic>.from(suspectedPositivesCount.value),
        'activeInfectionsPresent':
            Map<String, dynamic>.from(activeInfectionsPresent.value),
        'activeInfectionsCount':
            Map<String, dynamic>.from(activeInfectionsCount.value),
        'uploadedPhotoUrls': List<dynamic>.from(uploadedPhotoUrls.value),
        'diseaseQuestionnaire': diseaseQuestionnaire.value.map(
          (k, v) => MapEntry(k, Map<String, dynamic>.from(v)),
        ),
      };

      draftController.updateDraft(currentData, 1);
      return null;
    }, [
      hasRestored.value,
      visitStartedAt.value,
      hoovedAnimalsCount.value,
      fmdSelected.value,
      lsdSelected.value,
      fmdSuspectedPositive.value,
      lsdSuspectedPositive.value,
      comments.value,
      selectedDiseases.value,
      suspectedPositives.value,
      suspectedPositivesCount.value,
      activeInfectionsPresent.value,
      activeInfectionsCount.value,
      uploadedPhotoUrls.value,
      diseaseQuestionnaire.value,
    ]);

    // final site = useSites()
    //     .data
    //     ?.firstWhere((element) => element.id == visitDetails.site.id);
    final siteDiseases = site.value?.diseases;
    useEffect(() {
      // First try to find site in memory by ID
      final inMemorySite =
          sitesData?.firstWhereOrNull((element) => element.id == visit.site.id);

      if (inMemorySite != null) {
        site.value = inMemorySite;
        return null;
      }

      // If not in memory, try to load from Hive or find by name
      Future.microtask(() async {
        try {
          final box = Hive.isBoxOpen('sites')
              ? Hive.box('sites')
              : await Hive.openBox('sites');

          // Try to find by ID first
          if (box.containsKey(visit.site.id)) {
            final raw = box.get(visit.site.id);
            final deserialized = HiveSerialization.deserializeBuiltValue(
              SiteResponseData.serializer,
              raw,
            );

            if (deserialized != null) {
              site.value = deserialized;
              print(
                  '[Site Fallback] Loaded from Hive for siteId: ${visit.site.id}');
              return;
            }
          }

          // If not found by ID, try to find by name in sitesData (handles sync scenario)
          if (sitesData != null && sitesData.isNotEmpty) {
            final siteByName = sitesData.firstWhereOrNull(
              (element) => element.name == visit.site.name,
            );
            if (siteByName != null) {
              site.value = siteByName;
              print(
                  '[Site Fallback] Found site by name: ${visit.site.name} (new ID: ${siteByName.id})');
              return;
            }
          }

          // If still not found, log and set error
          print('[Site Fallback] No data in Hive for siteId: ${visit.site.id}');
          hasSiteError.value = true;
        } catch (e) {
          print('[Site Fallback] Error loading site from Hive: $e');
          hasSiteError.value = true;
        }
      });

      return null;
    }, [sitesData]);
    // final site = useSites()
    //     .data
    //     ?.firstWhereOrNull((element) => element.id == visitDetails.site.id);

    // final updateVisit = useUpdateVisitDetails(
    //   visitId,
    //   onSuccess: () {
    //     if (context.mounted) {
    //       ScaffoldMessenger.of(context).showSnackBar(
    //         SnackBar(
    //           content: Text('Visit updated successfully'),
    //           backgroundColor: AppColors.semanticsGreen20,
    //           duration: const Duration(seconds: 1),
    //         ),
    //       );
    //       context
    //           .push('/GuidelineSampleCollection', extra: {'visitId': visitId});
    //     }
    //   },
    //   onError: (error) {
    //     print('Error updating visit: $error');
    //     if (context.mounted) {
    //       ScaffoldMessenger.of(context).showSnackBar(
    //         SnackBar(
    //           content: Text('Failed to update visit $error'),
    //           backgroundColor: Colors.red,
    //         ),
    //       );
    //     }
    //   },
    // );

    useEffect(() {
      print(
          "--- AddVisitDetails useEffect [site.value, project.data] --- Status: ${project.status}");

      if (project.data?.diseases != null) {
        print(
            "--- AddVisitDetails useEffect --- Initializing disease states from project's ${project.data!.diseases.length} diseases");
        try {
          final projectDiseaseShortNames =
              project.data!.diseases.map((d) => d.shortName).toSet();

          selectedDiseases.value = {
            for (final shortName in projectDiseaseShortNames)
              shortName: selectedDiseases.value[shortName] ?? false,
          };

          suspectedPositives.value = {
            for (final shortName in projectDiseaseShortNames)
              shortName: suspectedPositives.value[shortName] ?? false,
          };

          suspectedPositivesCount.value = {
            for (final shortName in projectDiseaseShortNames)
              shortName: suspectedPositivesCount.value[shortName] ?? 1,
          };

          activeInfectionsPresent.value = {
            for (final shortName in projectDiseaseShortNames)
              shortName: activeInfectionsPresent.value[shortName] ?? false,
          };

          activeInfectionsCount.value = {
            for (final shortName in projectDiseaseShortNames)
              shortName: activeInfectionsCount.value[shortName] ?? 1,
          };

          print(
              "--- AddVisitDetails useEffect --- Disease states initialized from project successfully");
        } catch (e, s) {
          print(
              "--- AddVisitDetails useEffect --- ERROR initializing states: $e\n$s");
        }
      }
      return null;
    }, [site.value, project.data]);

    void updateDiseaseAnswer(
      String shortName,
      String key,
      dynamic value,
    ) {
      final updated =
          Map<String, Map<String, dynamic>>.from(diseaseQuestionnaire.value);
      final diseaseAnswers =
          Map<String, dynamic>.from(updated[shortName] ?? {});
      if (value == null || (value is String && value.trim().isEmpty)) {
        diseaseAnswers.remove(key);
      } else {
        diseaseAnswers[key] = value;
      }
      if (diseaseAnswers.isEmpty) {
        updated.remove(shortName);
      } else {
        updated[shortName] = diseaseAnswers;
      }
      diseaseQuestionnaire.value = updated;
    }

    Map<String, dynamic> buildDiseaseQuestionnairePayload() {
      final payload = <String, dynamic>{};
      selectedDiseases.value.forEach((shortName, isSelected) {
        if (!isSelected) return;
        final diseaseData = Map<String, dynamic>.from(
            diseaseQuestionnaire.value[shortName] ?? {});
        if (activeInfectionsPresent.value[shortName] != null) {
          diseaseData['activeInfectionsPresent'] =
              activeInfectionsPresent.value[shortName];
          if (activeInfectionsPresent.value[shortName] == true) {
            diseaseData['activeInfectionsCount'] =
                activeInfectionsCount.value[shortName] ?? 1;
          }
        }
        payload[shortName] = diseaseData;
      });
      return payload;
    }

    void toggleDiseaseSelection(String shortName, bool isSelected) {
      selectedDiseases.value = {
        ...selectedDiseases.value,
        shortName: isSelected,
      };

      if (isSelected) return;

      final updatedQuestionnaire =
          Map<String, Map<String, dynamic>>.from(diseaseQuestionnaire.value);
      updatedQuestionnaire.remove(shortName);
      diseaseQuestionnaire.value = updatedQuestionnaire;

      suspectedPositives.value = {
        ...suspectedPositives.value,
        shortName: false,
      };
      suspectedPositivesCount.value = {
        ...suspectedPositivesCount.value,
        shortName: 1,
      };
      activeInfectionsPresent.value = {
        ...activeInfectionsPresent.value,
        shortName: false,
      };
      activeInfectionsCount.value = {
        ...activeInfectionsCount.value,
        shortName: 1,
      };
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(
            Icons.arrow_back,
            color: AppColors.textStrong,
          ),
          onPressed: () => context.pop(),
        ),
        backgroundColor: AppColors.white,
        elevation: 0,
        title: Text(
          'Add Visit Details',
          style: AppTypography.textTheme.bodyB2SemiBold.copyWith(
            color: AppColors.textStrong,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(
              Icons.notifications_outlined,
              color: AppColors.primaryLight,
              size: 26,
            ),
            onPressed: () {},
          ),
        ],
        centerTitle: true,
      ),
      body: Stack(
        children: [
          SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Farm Details Card
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Site image
                    SizedBox(
                      height: 160,
                      width: double.infinity,
                      child: ((site.value?.photos?.isNotEmpty == true &&
                                  site.value!.photos!.first.isNotEmpty) ||
                              (visit.site.photos?.isNotEmpty == true &&
                                  visit.site.photos!.first.isNotEmpty))
                          ? CachedNetworkImage(
                              imageUrl: site.value?.photos?.firstOrNull ??
                                  visit.site.photos?.firstOrNull ??
                                  '',
                              width: double.infinity,
                              placeholder: (context, url) =>
                                  const Icon(Icons.photo_outlined),
                              errorWidget: (context, url, error) =>
                                  const Icon(Icons.photo_outlined),
                              fit: BoxFit.cover,
                            )
                          : Container(
                              color: AppColors.surfaceLight,
                              child: const Center(
                                child: Icon(Icons.photo_outlined,
                                    size: 40, color: AppColors.textWeak),
                              ),
                            ),
                    ),

                    // Site details card — directly below the image
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withAlpha(26),
                            blurRadius: 4,
                          ),
                        ],
                      ),
                      child: site.value != null
                          ? Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  site.value!.name,
                                  style: AppTypography.textTheme.headingH3
                                      .copyWith(
                                    color: AppColors.textStrong,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  '${formatFarmType(site.value!.farmType)} ${site.value!.siteSubType != null ? " (${formatSubType(site.value!.siteSubType)})" : ""} | SITE CODE : ${(site.value!.siteCode ?? '')}',
                                  style: AppTypography.textTheme.labelMMedium
                                      .copyWith(
                                    color: AppColors.textWeak,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                (siteDiseases?.isNotEmpty ?? false)
                                    ? Wrap(
                                        spacing: 8,
                                        runSpacing: 8,
                                        children: siteDiseases!.map((disease) {
                                          return Chip(
                                            label: Text(
                                              disease.name,
                                              style: AppTypography
                                                  .textTheme.labelMMedium
                                                  .copyWith(
                                                color: AppColors.textWeak,
                                              ),
                                            ),
                                            backgroundColor:
                                                AppColors.infoLight,
                                            padding: EdgeInsets.zero,
                                            visualDensity:
                                                VisualDensity.compact,
                                            materialTapTargetSize:
                                                MaterialTapTargetSize
                                                    .shrinkWrap,
                                            shape: RoundedRectangleBorder(
                                              borderRadius:
                                                  BorderRadius.circular(8),
                                            ),
                                          );
                                        }).toList(),
                                      )
                                    : const SizedBox.shrink(),
                              ],
                            )
                          : Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  visit.site.name,
                                  style: AppTypography.textTheme.headingH3
                                      .copyWith(
                                    color: AppColors.textStrong,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  hasSiteError.value
                                      ? 'Loading site details...'
                                      : 'SITE CODE : ${visit.site.siteCode ?? ''}',
                                  style: AppTypography.textTheme.labelMMedium
                                      .copyWith(
                                    color: AppColors.textWeak,
                                  ),
                                ),
                              ],
                            ),
                    ),
                  ],
                ),

                const SizedBox(height: 8),

                if (project.data?.diseases != null) ...[
                  Container(
                    width: double.infinity,
                    color: Colors.white,
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Select Diseases',
                          style: AppTypography.textTheme.headingH3.copyWith(
                            color: AppColors.textStrong,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Choose the diseases for this visit from the diseases associated with the project.',
                          style: AppTypography.textTheme.bodyB3Regular.copyWith(
                            color: AppColors.textWeak,
                          ),
                        ),
                        const SizedBox(height: 16),
                        ...project.data!.diseases.map((disease) {
                          final isSelected =
                              selectedDiseases.value[disease.shortName] ??
                                  false;
                          return CheckboxListTile(
                            value: isSelected,
                            onChanged: (value) => toggleDiseaseSelection(
                              disease.shortName,
                              value ?? false,
                            ),
                            contentPadding: EdgeInsets.zero,
                            controlAffinity: ListTileControlAffinity.leading,
                            activeColor: AppColors.primaryLight,
                            title: Text(
                              '${disease.shortName} - ${disease.name}',
                              style:
                                  AppTypography.textTheme.bodyB2Medium.copyWith(
                                color: AppColors.textStrong,
                              ),
                            ),
                          );
                        }),
                      ],
                    ),
                  ),
                  const SizedBox(height: 8),
                ],

                // Disease Details Sections
                if (project.data?.diseases != null) ...[
                  ...project.data!.diseases.map((disease) {
                    final isSelected =
                        selectedDiseases.value[disease.shortName] ?? false;
                    if (!isSelected) return const SizedBox.shrink();

                    final currentFarmType =
                        site.value?.farmType ?? visit.site.farmType;
                    final visitQuestions =
                        getVisitQuestions(disease.shortName, currentFarmType);
                    if (visitQuestions.isEmpty) return const SizedBox.shrink();

                    return Column(
                      children: [
                        Container(
                          width: double.infinity,
                          color: Colors.white,
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                '${disease.shortName} - ${disease.name}',
                                style:
                                    AppTypography.textTheme.headingH3.copyWith(
                                  color: AppColors.textStrong,
                                ),
                              ),
                              const SizedBox(height: 16),
                              DiseaseQuestionsForm(
                                disease: disease.shortName,
                                questions: {
                                  for (var code in visitQuestions)
                                    if (questionRegistry.containsKey(code))
                                      code: questionRegistry[code]!
                                },
                                answers: diseaseQuestionnaire
                                        .value[disease.shortName] ??
                                    {},
                                onAnswerChanged: (key, value) =>
                                    updateDiseaseAnswer(
                                  disease.shortName,
                                  key,
                                  value,
                                ),
                              ),
                              const SizedBox(height: 16),
                              Text(
                                'Active Infections Present?',
                                style: AppTypography.textTheme.bodyB2Medium
                                    .copyWith(
                                  color: AppColors.textStrong,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Column(
                                children: [
                                  Row(
                                    children: [
                                      Radio<bool>(
                                        value: true,
                                        groupValue: activeInfectionsPresent
                                            .value[disease.shortName],
                                        onChanged: (value) {
                                          final newInfections =
                                              Map<String, bool?>.from(
                                                  activeInfectionsPresent
                                                      .value);
                                          newInfections[disease.shortName] =
                                              value;
                                          activeInfectionsPresent.value =
                                              newInfections;
                                        },
                                      ),
                                      Text(
                                        'Yes',
                                        style: AppTypography
                                            .textTheme.bodyB2Regular
                                            .copyWith(
                                          color: AppColors.textStrong,
                                        ),
                                      ),
                                      const SizedBox(width: 16),
                                      Radio<bool>(
                                        value: false,
                                        groupValue: activeInfectionsPresent
                                            .value[disease.shortName],
                                        onChanged: (value) {
                                          final newInfections =
                                              Map<String, bool?>.from(
                                                  activeInfectionsPresent
                                                      .value);
                                          newInfections[disease.shortName] =
                                              value;
                                          activeInfectionsPresent.value =
                                              newInfections;
                                        },
                                      ),
                                      Text(
                                        'No',
                                        style: AppTypography
                                            .textTheme.bodyB2Regular
                                            .copyWith(
                                          color: AppColors.textStrong,
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                              if (activeInfectionsPresent
                                      .value[disease.shortName] ==
                                  true) ...[
                                const SizedBox(height: 16),
                                Text(
                                  'Number of Active Infections',
                                  style: AppTypography.textTheme.bodyB2Medium
                                      .copyWith(
                                    color: AppColors.textStrong,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Row(
                                  children: [
                                    IconButton(
                                      icon: const Icon(
                                          Icons.remove_circle_outline),
                                      onPressed: () {
                                        final count = activeInfectionsCount
                                                .value[disease.shortName] ??
                                            1;
                                        if (count > 0) {
                                          final newCounts =
                                              Map<String, int>.from(
                                                  activeInfectionsCount.value);
                                          newCounts[disease.shortName] =
                                              count - 1;
                                          activeInfectionsCount.value =
                                              newCounts;
                                        }
                                      },
                                      color: AppColors.primaryLight,
                                    ),
                                    Text(
                                      '${activeInfectionsCount.value[disease.shortName] ?? 1}',
                                      style: AppTypography
                                          .textTheme.bodyB2Regular
                                          .copyWith(
                                        color: AppColors.textStrong,
                                      ),
                                    ),
                                    IconButton(
                                      icon:
                                          const Icon(Icons.add_circle_outline),
                                      onPressed: () {
                                        final count = activeInfectionsCount
                                                .value[disease.shortName] ??
                                            1;
                                        final newCounts = Map<String, int>.from(
                                            activeInfectionsCount.value);
                                        newCounts[disease.shortName] =
                                            count + 1;
                                        activeInfectionsCount.value = newCounts;
                                      },
                                      color: AppColors.primaryLight,
                                    ),
                                  ],
                                ),
                              ],
                              const SizedBox(height: 16),
                              Text(
                                'Suspected Positives?',
                                style: AppTypography.textTheme.bodyB2Medium
                                    .copyWith(
                                  color: AppColors.textStrong,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Column(
                                children: [
                                  Row(
                                    children: [
                                      Radio<bool>(
                                        value: true,
                                        groupValue: suspectedPositives
                                            .value[disease.shortName],
                                        onChanged: (value) {
                                          final newSuspected =
                                              Map<String, bool?>.from(
                                                  suspectedPositives.value);
                                          newSuspected[disease.shortName] =
                                              value;
                                          suspectedPositives.value =
                                              newSuspected;
                                        },
                                      ),
                                      Text(
                                        'Yes',
                                        style: AppTypography
                                            .textTheme.bodyB2Regular
                                            .copyWith(
                                          color: AppColors.textStrong,
                                        ),
                                      ),
                                      const SizedBox(width: 16),
                                      Radio<bool>(
                                        value: false,
                                        groupValue: suspectedPositives
                                            .value[disease.shortName],
                                        onChanged: (value) {
                                          final newSuspected =
                                              Map<String, bool?>.from(
                                                  suspectedPositives.value);
                                          newSuspected[disease.shortName] =
                                              value;
                                          suspectedPositives.value =
                                              newSuspected;
                                        },
                                      ),
                                      Text(
                                        'No',
                                        style: AppTypography
                                            .textTheme.bodyB2Regular
                                            .copyWith(
                                          color: AppColors.textStrong,
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                              if (suspectedPositives.value[disease.shortName] ==
                                  true) ...[
                                const SizedBox(height: 16),
                                Text(
                                  'Number of Suspected Positives',
                                  style: AppTypography.textTheme.bodyB2Medium
                                      .copyWith(
                                    color: AppColors.textStrong,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Row(
                                  children: [
                                    IconButton(
                                      icon: const Icon(
                                          Icons.remove_circle_outline),
                                      onPressed: () {
                                        final count = suspectedPositivesCount
                                                .value[disease.shortName] ??
                                            1;
                                        if (count > 0) {
                                          final newCounts =
                                              Map<String, int>.from(
                                                  suspectedPositivesCount
                                                      .value);
                                          newCounts[disease.shortName] =
                                              count - 1;
                                          suspectedPositivesCount.value =
                                              newCounts;
                                        }
                                      },
                                      color: AppColors.primaryLight,
                                    ),
                                    Text(
                                      '${suspectedPositivesCount.value[disease.shortName] ?? 1}',
                                      style: AppTypography
                                          .textTheme.bodyB2Regular
                                          .copyWith(
                                        color: AppColors.textStrong,
                                      ),
                                    ),
                                    IconButton(
                                      icon:
                                          const Icon(Icons.add_circle_outline),
                                      onPressed: () {
                                        final count = suspectedPositivesCount
                                                .value[disease.shortName] ??
                                            1;
                                        final newCounts = Map<String, int>.from(
                                            suspectedPositivesCount.value);
                                        newCounts[disease.shortName] =
                                            count + 1;
                                        suspectedPositivesCount.value =
                                            newCounts;
                                      },
                                      color: AppColors.primaryLight,
                                    ),
                                  ],
                                ),
                              ],
                            ],
                          ),
                        ),
                        const SizedBox(height: 8),
                      ],
                    );
                  }),
                ],

                const SizedBox(height: 8),

                // Additional Info Section
                Container(
                  width: double.infinity,
                  color: Colors.white,
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Additional Info',
                        style: AppTypography.textTheme.headingH3.copyWith(
                          color: AppColors.textStrong,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Add Photos',
                        style: AppTypography.textTheme.bodyB2Medium.copyWith(
                          color: AppColors.textStrong,
                        ),
                      ),
                      const SizedBox(height: 8),
                      ImageUploadGrid(
                        onChanged: (urls) => uploadedPhotoUrls.value = urls,
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 8),

                // Comments Section
                Container(
                  width: double.infinity,
                  color: Colors.white,
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Comments',
                        style: AppTypography.textTheme.headingH3.copyWith(
                          color: AppColors.textStrong,
                        ),
                      ),
                      const SizedBox(height: 8),
                      TextField(
                        style: AppTypography.textTheme.bodyB3Regular.copyWith(
                          color: AppColors.textWeak,
                        ),
                        onChanged: (value) => comments.value = value,
                        maxLines: 4,
                        maxLength: 200,
                        decoration: InputDecoration(
                          hintText: 'Add some more information here...',
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide:
                                const BorderSide(color: AppColors.textWeak),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide:
                                const BorderSide(color: AppColors.textWeak),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                // Add bottom padding to accommodate the button
                const SizedBox(height: 80),
              ],
            ),
          ),

          // Fixed Proceed button at bottom
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              padding: EdgeInsets.fromLTRB(
                16,
                16,
                16,
                16 + MediaQuery.of(context).padding.bottom,
              ),
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black12,
                    blurRadius: 4,
                    offset: const Offset(0, -2),
                  ),
                ],
              ),
              child: ElevatedButton(
                onPressed: () async {
                  if (project.data?.diseases == null) return;

                  final selectedProjectDiseases = project.data!.diseases
                      .where((disease) =>
                          selectedDiseases.value[disease.shortName] == true)
                      .toList();

                  if (selectedProjectDiseases.isEmpty) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Select at least one disease'),
                        backgroundColor: Colors.red,
                      ),
                    );
                    return;
                  }

                  try {
                    final suspectDiseaseData = selectedProjectDiseases
                        .map((disease) => jsonEncode({
                              'diseaseId': disease.id,
                              'shortName': disease.shortName,
                              'sampleCount':
                                  suspectedPositives.value[disease.shortName] ==
                                          true
                                      ? suspectedPositivesCount
                                              .value[disease.shortName] ??
                                          1
                                      : 0,
                              'isSuspectedPositive':
                                  suspectedPositives.value[disease.shortName] ??
                                      false,
                            }))
                        .toList();
                    final diseaseQuestionnairePayload =
                        buildDiseaseQuestionnairePayload();

                    print('Creating request with data:');
                    print('suspectDiseaseData: $suspectDiseaseData');

                    final requestJson = {
                      'photos': uploadedPhotoUrls.value,
                      'comment': comments.value,
                      'suspectDiseaseData': suspectDiseaseData,
                      'diseaseQuestionnaireData': diseaseQuestionnairePayload,
                    };

                    print('Request JSON: ${jsonEncode(requestJson)}');

                    // Create the UpdateVisitDto with proper type conversion
                    final requestData = UpdateVisitDto((b) {
                      b.photos = ListBuilder(uploadedPhotoUrls.value);
                      b.comment = comments.value;
                      b.visitStatus = visit.visitStatus;
                      b.isCompleted = false;
                      b.siteId = visit.site.id;
                      b.visitStartedAt = visitStartedAt.value;
                      // Use the already JSON encoded disease data
                      b.suspectDiseaseData = ListBuilder(suspectDiseaseData);
                      b.diseaseQuestionnaireData =
                          JsonObject(diseaseQuestionnairePayload);
                    });

                    // ── Persist the built updateVisitDto immediately into the draft ──
                    // This is critical so that if the user resumes at step 2 (Guidelines)
                    // or later, the VisitFlowResumer can deserialize it from Hive.
                    final serializedDto = HiveSerialization.serializeBuiltValue(
                      UpdateVisitDto.serializer,
                      requestData,
                    );
                    if (serializedDto != null) {
                      final currentData = Map<String, dynamic>.from(
                          draftController.draft?.stepData ?? {});
                      currentData['updateVisitDto'] = serializedDto;
                      // Save immediately (step index stays at 1; the Guidelines screen
                      // will advance to 2 when it loads).
                      await draftController.updateDraftImmediate(
                          currentData, 1);
                      print(
                          '[AddVisitDetails] updateVisitDto persisted to draft before navigation.');
                    } else {
                      print(
                          '[AddVisitDetails] WARNING: Failed to serialize updateVisitDto; draft will not have it.');
                    }

                    if (context.mounted) {
                      context.push('/GuidelineSampleCollection', extra: {
                        'visitId': visit.id,
                        'updateVisitDto': requestData,
                        'visitDetails': visitDetails,
                      });
                    }
                  } catch (e) {
                    print('Error updating visit: $e');
                    if (context.mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('Failed to update visit: $e'),
                          backgroundColor: Colors.red,
                        ),
                      );
                    }
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primaryLight,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: Text(
                  'Proceed',
                  style: AppTypography.textTheme.buttonSmall.copyWith(
                    color: AppColors.white,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
