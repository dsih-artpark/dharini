import 'dart:convert';
import 'dart:io';
import 'package:path_provider/path_provider.dart';
import 'package:intl/intl.dart';

import 'package:built_collection/built_collection.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:collection/collection.dart';
import 'package:design_system/design_system.dart';
import 'package:es_client/es_client.dart';
import 'package:es_platform_mobile/hooks/auth.dart';
import 'package:es_platform_mobile/models/pending_submission.dart';
import 'package:es_platform_mobile/providers/connectivity_provider.dart';
import 'package:es_platform_mobile/providers/sync_service_provider.dart';
import 'package:es_platform_mobile/services/connectivity_service.dart';
import 'package:es_platform_mobile/services/database_service.dart';
import 'package:es_platform_mobile/services/visit_draft_repository.dart';
import 'package:es_platform_mobile/hooks/visit_draft.dart';
import 'package:es_platform_mobile/utils/hive_serialization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:fquery/fquery.dart';
import 'package:go_router/go_router.dart';
import 'package:hive/hive.dart';

import '../../utils/api_cache.dart';
import '../../utils/tenant_roles.dart';
import 'models/sample_data.dart';
import 'package:es_platform_mobile/managers/location_manager.dart';
import 'package:es_platform_mobile/hooks/species.dart';

/// Converts List<SampleData> (UI model) to ListBuilder<VisitSampleData> (API model)
/// for displaying sample info in offline completed visits
ListBuilder<VisitSampleData> convertSamplesToVisitSamples(
    List<SampleData> samples) {
  final now = DateTime.now().toUtc();
  return ListBuilder<VisitSampleData>(
    samples
        .map((sample) => VisitSampleData((b) => b
          ..id = 'local-sample-${sample.barcode}'
          ..barcode = sample.barcode
          ..sampleStatus = SampleStatus.pending
          ..collectedAt = now
          ..collectionTime = now
          ..quantity = sample.quantity
          ..unit = sample.unit
          ..photos.replace(sample.photos)
          ..comment = sample.comments
          ..sampleType.replace(SampleType((st) => st
            ..id = sample.sampleType
            ..name = sample.sampleName
            ..status = SampleTypeStatusEnum.active
            ..createdAt = now
            ..updatedAt = now))))
        .toList(),
  );
}

class ReviewVisitDetails extends HookWidget {
  final String visitId;
  final List<SampleData> samples;
  final UpdateVisitDto updateVisitDto;
  final VisitResponseData visitDetails;

  const ReviewVisitDetails({
    required this.visitId,
    required this.samples,
    required this.updateVisitDto,
    required this.visitDetails,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    print('ReviewVisitDetails build started');
    print('visitId: $visitId');

    final draftController = useVisitDraft(visitId, initialStepIndex: 6);
    final hasMarkedStep = useRef<bool>(false);

    // Persist step 6 state once on mount. updateVisitDto and samples are passed
    // as widget props so they are stable — no need to re-run on draft changes.
    useEffect(() {
      if (draftController.draft != null && !hasMarkedStep.value) {
        hasMarkedStep.value = true;
        final currentData =
            Map<String, dynamic>.from(draftController.draft!.stepData);
        final serialized = HiveSerialization.serializeBuiltValue(
          UpdateVisitDto.serializer,
          updateVisitDto,
        );
        if (serialized != null) {
          currentData['updateVisitDto'] = serialized;
        }
        currentData['samples'] = samples.map((s) => s.toJson()).toList();
        currentData['resumeRoute'] = '/ReviewVisitDetails';
        currentData['resumeArgs'] = <String, dynamic>{};
        draftController.updateDraftImmediate(currentData, 6);
      }
      return null;
    }, [draftController.draft]);


    final speciesQuery = useSpecies();
    final speciesMap = {
      for (var s in (speciesQuery.data ?? [])) s.id: s.name,
    };

    final visit = visitDetails;
    final project = useProject();
    print('project status: ${project.status}');

    final queryClient = useQueryClient();
    final projectId = useCurrentProjectId();
    print('projectId: $projectId');

    final profile = useProfile();
    print('profile status: ${profile.status}');
    print('profile id: ${profile.data?.id}');

    final latitude = useState<double?>(null);
    final longitude = useState<double?>(null);

    final sitesData = useSites().data;
    final resolvedSite = useState<SiteResponseData?>(null);

    useEffect(() {
      final inMemorySite =
          sitesData?.firstWhereOrNull((element) => element.id == visit.site.id);

      if (inMemorySite != null) {
        resolvedSite.value = inMemorySite;
        return null;
      }

      Future.microtask(() async {
        try {
          final box = Hive.isBoxOpen('sites')
              ? Hive.box('sites')
              : await Hive.openBox('sites');

          if (box.containsKey(visit.site.id)) {
            final raw = box.get(visit.site.id);
            // Normalize _Map<dynamic,dynamic> from Hive binary before deserializing.
            final normalized = jsonDecode(jsonEncode(raw));
            final deserialized = standardSerializers.deserializeWith(
              SiteResponseData.serializer,
              normalized,
            );
            if (deserialized != null) {
              resolvedSite.value = deserialized;
            }
          }
        } catch (e) {
          debugPrint('[Review Fallback] Error resolving site: $e');
        }
      });
      return null;
    }, [sitesData, visit.site.id]);

    useEffect(() {
      Future.microtask(() async {
        // ignore: use_build_context_synchronously
        if (!context.mounted) return;
        final position = await LocationManager.ensureLocation(context);
        if (position == null) {
          return;
        }

        latitude.value = position.latitude;
        longitude.value = position.longitude;
      });
      return null;
    }, []);

    // Helper to check if GPS coordinates are available
    final hasCoords = latitude.value != null && longitude.value != null;

    // Add loading state
    // if (visitDetails.isLoading || project.isLoading || profile.isLoading) {
    //   return Scaffold(
    //     appBar: AppBar(
    //       backgroundColor: Colors.white,
    //       elevation: 0,
    //       leading: const BackButton(color: AppColors.textStrong),
    //       title: Text(
    //         'Visit Details',
    //         style: AppTypography.textTheme.bodyB2SemiBold?.copyWith(
    //           color: AppColors.textStrong,
    //         ),
    //       ),
    //     ),
    //     body: const Center(
    //       child: CircularProgressIndicator(),
    //     ),
    //   );
    // }

    // Check for required data
    if (project.data == null || profile.data == null) {
      return Scaffold(
        appBar: AppBar(
          backgroundColor: Colors.white,
          elevation: 0,
          leading: const BackButton(color: AppColors.textStrong),
          title: Text(
            'Visit Details',
            style: AppTypography.textTheme.bodyB2SemiBold.copyWith(
              color: AppColors.textStrong,
            ),
          ),
        ),
        body: Center(
          child: Text(
            'Missing required data',
            style: AppTypography.textTheme.bodyB2SemiBold,
          ),
        ),
      );
    }

    final submitVisitMutation = useSubmitVisit(
      project.data?.id ?? '',
      visitId,
      onSuccess: () {
        queryClient.invalidateQueries(
          QueryKeys.scheduledVisits(
            projectId,
            assignedTo: true,
            startDate: null,
            endDate: null,
            status: 'upcoming',
          ),
        );
        // Get unique sample types and count
        final uniqueSampleTypes =
            samples.map((s) => s.sampleName).toSet().toList();
        final sampleTypesString = uniqueSampleTypes.join(', ');

        context.go('/SuccessScreen', extra: {
          'totalSamples': samples.length,
          'sampleTypes': sampleTypesString,
          'profile': profile.data,
          'isOnline': true,
        });
      },
      onError: (error) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(error),
            backgroundColor: Colors.red,
          ),
        );
      },
    );

    //final userProfile = useProfile();
    // final handleSubmitVisit = useCallback(() async {
    //   try {
    //     // Get current network status
    //     final networkStatus = await context.connectivity.checkConnectivity();

    //     // Parse and format suspect disease data from JSON strings
    //     final formattedSuspectDiseaseData = updateVisitDto.suspectDiseaseData
    //             ?.map((diseaseStr) {
    //               try {
    //                 // Parse the JSON string directly to a Map
    //                 final desease = jsonDecode(diseaseStr);
    //                 return jsonEncode({
    //                   'diseaseId': desease['diseaseId'],
    //                   'sampleCount': desease['sampleCount'] ?? 0,
    //                   'isSuspectedPositive':
    //                       desease['isSuspectedPositive'] ?? false,
    //                 });
    //               } catch (e) {
    //                 print('Error parsing disease data: $e');
    //                 return null;
    //               }
    //             })
    //             .where((item) => item != null)
    //             .toList() ??
    //         [];

    //     print(
    //         'Disease data before formatting: ${updateVisitDto.suspectDiseaseData}'); // Debug log
    //     print(
    //         'Formatted disease data: $formattedSuspectDiseaseData'); // Debug log

    //     // Build the visit data
    //     final visitDataMap = {
    //       'id': visit.id,
    //       'siteId': visit.site.id,
    //       'visitedBy': profile.data?.id,
    //       'projectId': project.data?.id,
    //       'teamId': profile.data?.team?.id,
    //       'isCompleted': true,
    //       'visitStatus': 'completed',
    //       'photos': updateVisitDto.photos?.toList() ?? [],
    //       'comment': updateVisitDto.comment,
    //       'suspectDiseaseData': formattedSuspectDiseaseData,
    //     };

    //     // Format diseases data correctly for samples
    //     final samplesData = samples
    //         .map((sample) => {
    //               'replicates': sample.replicates == 'available'
    //                   ? 'available'
    //                   : 'notCollected',
    //               'photos': sample.photos.toList(),
    //               'diseases': updateVisitDto.suspectDiseaseData
    //                       ?.map((diseaseStr) {
    //                         try {
    //                           // Parse the JSON string directly to a Map
    //                           final desease = jsonDecode(diseaseStr);
    //                           return desease['diseaseId'];
    //                         } catch (e) {
    //                           print('Error parsing disease data: $e');
    //                           return null;
    //                         }
    //                       })
    //                       .where((item) => item != null)
    //                       .toList() ??
    //                   [],
    //               'originalSampleBarcode': sample.originalSampleBarcode,
    //               'barcode': sample.barcode,
    //               'comment': sample.comments,
    //               'collectedBy': profile.data?.id,
    //               'sampleType': sample.sampleType,
    //             })
    //         .toList();

    //     print('Submission data before sync: ${jsonEncode({
    //           'visitData': visitDataMap,
    //           'samples': samplesData,
    //         })}'); // Debug log

    //     // Create submission data
    //     final Map<String, dynamic> submissionData = {
    //       'visitData': visitDataMap,
    //       'samples': samplesData,
    //     };

    //     print('Submission data: ${submissionData}'); // Add debug log

    //     // Save to local database
    //     final pendingSubmission = PendingVisitSubmission(
    //       id: visitId,
    //       data: submissionData,
    //       photoFiles: [],
    //       createdAt: DateTime.now(),
    //     );
    //     await DatabaseService.savePendingSubmission(pendingSubmission);
    //     // Mark visit as completed in local Hive box if it exists
    //     // final visitsBox = Hive.box('visits');
    //     // if (visitsBox.containsKey(visitId)) {
    //     //   final visit = visitsBox.get(visitId);
    //     //   visitsBox.put(visitId, visit.rebuild((b) => b..isCompleted = true));
    //     // }

    //     // Update fquery cache: remove from upcoming, add to completed
    //     final upcomingKey = QueryKeys.scheduledVisits(
    //       projectId,
    //       assignedTo: true,
    //       startDate: null,
    //       endDate: null,
    //       status: 'upcoming',
    //     );
    //     queryClient.setQueryData<List<VisitResponseData>>(
    //       upcomingKey,
    //       (old) => old?.where((v) => v.id != visitId).toList() ?? [],
    //     );

    //     final completedKey = QueryKeys.completedVisits(
    //       projectId,
    //       startDate: null,
    //       endDate: null,
    //     );
    //     queryClient.setQueryData<List<VisitResponseData>>(
    //       completedKey,
    //       (old) {
    //         final completedVisit =
    //             visit.rebuild((b) => b..visitStatus = VisitStatus.completed);
    //         return old == null ? [completedVisit] : [completedVisit, ...old];
    //       },
    //     );

    //     // Invalidate all upcoming and completed visits queries for this project
    //     queryClient
    //         .invalidateQueries(['projects', projectId, 'visits', 'scheduled']);
    //     queryClient
    //         .invalidateQueries(['projects', projectId, 'visits', 'completed']);

    //     // If online, trigger sync immediately
    //     if (networkStatus == NetworkStatus.online) {
    //       context.syncService.sync().then((result) {
    //         if (result.success) {
    //           ScaffoldMessenger.of(context).showSnackBar(
    //             SnackBar(
    //               content: Text('Visit submitted successfully'),
    //               backgroundColor: Colors.green,
    //             ),
    //           );
    //         } else {
    //           ScaffoldMessenger.of(context).showSnackBar(
    //             SnackBar(
    //               content: Text('Visit submission failed'),
    //               backgroundColor: Colors.red,
    //             ),
    //           );
    //         }
    //       });
    //     }

    //     // Show appropriate message based on network status
    //     ScaffoldMessenger.of(context).showSnackBar(
    //       SnackBar(
    //         content: Text(
    //           networkStatus == NetworkStatus.online
    //               ? 'Visit saved. Syncing in background...'
    //               : 'Visit saved locally. Will sync when online.',
    //         ),
    //         backgroundColor: networkStatus == NetworkStatus.online
    //             ? Colors.green
    //             : Colors.orange,
    //       ),
    //     );

    //     // Get unique sample types and count for success screen
    //     final uniqueSampleTypes =
    //         samples.map((s) => s.sampleName).toSet().toList();
    //     final sampleTypesString = uniqueSampleTypes.join(', ');

    //     // Navigate to success screen
    //     context.go('/SuccessScreen', extra: {
    //       'totalSamples': samples.length,
    //       'sampleTypes': sampleTypesString,
    //       'profile': profile.data,
    //       'isOnline': networkStatus == NetworkStatus.online,
    //     });

    //     // Update persistent Hive cache for all relevant upcoming/completed visits keys
    //     // Common filters: no filter, this week, this month, 3 months
    //     final now = DateTime.now();
    //     final startOfWeek = now.subtract(Duration(days: now.weekday - 1));
    //     final endOfWeek = startOfWeek.add(const Duration(days: 6));
    //     final startOfMonth = DateTime(now.year, now.month, 1);
    //     final endOfMonth = DateTime(now.year, now.month + 1, 0);
    //     final startOf3Months = DateTime(now.year, now.month - 2, 1);
    //     final endOf3Months = endOfMonth;
    //     final filters = [
    //       // (startDate, endDate)
    //       [null, null],
    //       [startOfWeek, endOfWeek],
    //       [startOfMonth, endOfMonth],
    //       [startOf3Months, endOf3Months],
    //     ];
    //     for (final filter in filters) {
    //       final startDate = filter[0];
    //       final endDate = filter[1];
    //       // Upcoming
    //       final upcomingCacheKey = 'scheduledVisits_${projectId}_upcoming_true_' +
    //           '${startDate?.toIso8601String() ?? ''}_${endDate?.toIso8601String() ?? ''}';
    //       final upcomingCached = await ApiCache.get<List<Object?>>(
    //         upcomingCacheKey,
    //         (json) => (json as List?) ?? [],
    //       );
    //       if (upcomingCached != null && upcomingCached.isNotEmpty) {
    //         final filtered = upcomingCached.where((e) {
    //           try {
    //             // Use id field to filter
    //             return (e as Map<String, dynamic>)['id'] != visitId;
    //           } catch (_) {
    //             return true;
    //           }
    //         }).toList();
    //         await ApiCache.set(upcomingCacheKey, filtered);
    //       }
    //       // Completed
    //       final completedCacheKey =
    //           'completedVisits_${projectId}_${startDate?.toIso8601String() ?? ''}_${endDate?.toIso8601String() ?? ''}_';
    //       final completedCached = await ApiCache.get<List<Object?>>(
    //         completedCacheKey,
    //         (json) => (json as List?) ?? [],
    //       );
    //       // Serialize the completed visit
    //       final completedVisitSerialized = standardSerializers.serializeWith(
    //         VisitResponseData.serializer,
    //         visit.rebuild((b) => b..visitStatus = VisitStatus.completed),
    //       );
    //       if (completedCached != null) {
    //         await ApiCache.set(completedCacheKey,
    //             [completedVisitSerialized, ...completedCached]);
    //       } else {
    //         await ApiCache.set(completedCacheKey, [completedVisitSerialized]);
    //       }
    //     }
    //   } catch (error) {
    //     ScaffoldMessenger.of(context).showSnackBar(
    //       SnackBar(
    //         content: Text(error.toString()),
    //         backgroundColor: Colors.red,
    //       ),
    //     );
    //   }
    // }, [visit, project, submitVisitMutation, samples, visitId, profile.data]);

    final handleSubmitVisit = useCallback(() async {
      try {
        // The team a visit is attributed to is a property of the submitting
        // collector's role in this project, not the legacy global
        // `profile.team`. If no per-project team resolves, submitting with a
        // null/empty teamId would silently write a visit that can't be
        // scoped to any team — fail visibly instead so the collector (or
        // their admin) knows to fix the role assignment.
        final teamId = teamIdForProject(profile.data, projectId);
        if (teamId == null) {
          if (context.mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text(
                  'Unable to submit visit: you are not assigned to a team '
                  'for this project. Contact your administrator.',
                ),
                backgroundColor: Colors.red,
              ),
            );
          }
          return;
        }

        final networkStatus = await context.connectivity.checkConnectivity();

        final formattedSuspectDiseaseData = updateVisitDto.suspectDiseaseData
                ?.map((diseaseStr) {
                  try {
                    final desease = jsonDecode(diseaseStr);
                    return jsonEncode({
                      'diseaseId': desease['diseaseId'],
                      'sampleCount': desease['sampleCount'] ?? 0,
                      'isSuspectedPositive':
                          desease['isSuspectedPositive'] ?? false,
                    });
                  } catch (e) {
                    print('Error parsing disease data: $e');
                    return null;
                  }
                })
                .where((item) => item != null)
                .toList() ??
            [];
        // Resolve local IDs to server IDs if available (for online-created sites/visits)
        var resolvedVisitId = visit.id;
        var resolvedSiteId = visit.site.id;
        if (resolvedVisitId.startsWith('local-')) {
          final visitIdMapBox = Hive.isBoxOpen('visitIdMap')
              ? Hive.box('visitIdMap')
              : await Hive.openBox('visitIdMap');
          final serverVisitId = visitIdMapBox.get(resolvedVisitId);
          if (serverVisitId != null) {
            resolvedVisitId = serverVisitId;
            debugPrint(
                '[Submit] Resolved local visit ID: ${visit.id} → $resolvedVisitId');
          }
        }
        if (resolvedSiteId.startsWith('local-')) {
          final siteIdMapBox = Hive.isBoxOpen('siteIdMap')
              ? Hive.box('siteIdMap')
              : await Hive.openBox('siteIdMap');
          final serverSiteId = siteIdMapBox.get(resolvedSiteId);
          if (serverSiteId != null) {
            resolvedSiteId = serverSiteId;
            debugPrint(
                '[Submit] Resolved local site ID: ${visit.site.id} → $resolvedSiteId');
          }
        }

        final visitDataMap = {
          'id': resolvedVisitId,
          'originalVisitId': visit.id,
          'siteId': resolvedSiteId,
          'originalSiteId': visit.site.id,
          'visitedBy': profile.data?.id,
          'projectId': project.data?.id,
          'teamId': teamId,
          'isCompleted': true,
          'visitStatus': 'completed',
          'photos': updateVisitDto.photos?.toList() ?? [],
          'comment': updateVisitDto.comment,
          'suspectDiseaseData': formattedSuspectDiseaseData,
          'diseaseQuestionnaireData':
              updateVisitDto.diseaseQuestionnaireData?.value,
          'latitude': latitude.value,
          'longitude': longitude.value,
          'visitStartedAt':
              updateVisitDto.visitStartedAt?.toUtc().toIso8601String(),
        };

        final samplesData = samples
            .map((sample) => {
                  'replicates': sample.replicates == 'available'
                      ? 'available'
                      : 'notCollected',
                  'photos': sample.photos.toList(),
                  'diseases': updateVisitDto.suspectDiseaseData
                          ?.map((diseaseStr) {
                            try {
                              final desease = jsonDecode(diseaseStr);
                              return desease['diseaseId'];
                            } catch (e) {
                              print('Error parsing disease data: $e');
                              return null;
                            }
                          })
                          .where((item) => item != null)
                          .toList() ??
                      [],
                  'originalSampleBarcode': sample.originalSampleBarcode,
                  'barcode': sample.barcode,
                  'comment': sample.comments,
                  'collectedBy': profile.data?.id,
                  'sampleType': sample.sampleType,
                  'quantity': sample.quantity,
                  'unit': sample.unit,
                  'details': sample.metadata,
                })
            .toList();

        final Map<String, dynamic> submissionData = {
          'visitData': visitDataMap,
          'samples': samplesData,
        };

        final pendingSubmission = PendingVisitSubmission(
          id: resolvedVisitId, // Using resolved ID for proper sync/cleanup
          data: submissionData,
          photoFiles: [],
          createdAt: DateTime.now(),
        );
        await DatabaseService.savePendingSubmission(pendingSubmission);

        // Update query cache
        final upcomingKey = QueryKeys.scheduledVisits(
          projectId,
          assignedTo: true,
          startDate: null,
          endDate: null,
          status: 'upcoming',
        );
        queryClient.setQueryData<List<VisitResponseData>>(
          upcomingKey,
          (old) => old?.where((v) => v.id != visitId).toList() ?? [],
        );

        final completedKey = QueryKeys.completedVisits(
          projectId,
          startDate: null,
          endDate: null,
        );
        queryClient.setQueryData<List<VisitResponseData>>(
          completedKey,
          (old) {
            final completedVisit = visit.rebuild(
              (b) => b
                ..visitStatus = VisitStatus.completed
                ..visitedAt = DateTime.now().toUtc()
                ..samples = convertSamplesToVisitSamples(samples),
            );
            return old == null ? [completedVisit] : [completedVisit, ...old];
          },
        );

        // queryClient.invalidateQueries(['projects', projectId, 'visits', 'upcoming']);
        // queryClient.invalidateQueries(['projects', projectId, 'visits', 'scheduled']);
        // queryClient.invalidateQueries(['projects', projectId, 'visits', 'completed']);

        // ✅ NEW: Save completed visit to completedVisits Hive box
        try {
          final completedVisitsBox = await Hive.openBox('completedVisits');
          final serializedVisit = standardSerializers.serializeWith(
            VisitResponseData.serializer,
            visit.rebuild((b) => b
              ..visitStatus = VisitStatus.completed
              ..visitedAt = DateTime.now().toUtc()
              ..samples = convertSamplesToVisitSamples(samples)),
          );
          if (serializedVisit != null) {
            await completedVisitsBox.put(visitId, serializedVisit);
            print('Saved visit $visitId to completedVisits Hive box');
          }

          // Also remove from visits Hive box if present (for offline-created visits)
          final visitsBox =
              Hive.isBoxOpen('visits') ? Hive.box('visits') : null;
          if (visitsBox != null && visitsBox.containsKey(visitId)) {
            await visitsBox.delete(visitId);
            print('Removed visit $visitId from visits Hive box');
          }
        } catch (e) {
          print('Error saving to completedVisits Hive box: $e');
        }

        if (networkStatus == NetworkStatus.online) {
          final scaffoldMessenger = ScaffoldMessenger.of(context);
          context.syncService.sync().then((result) async {
            debugPrint("Sync results: $result");
            final msg = result.success
                ? 'Visit submitted successfully'
                : 'Visit submission failed: ${result.error ?? ""}';
            final color = result.success ? Colors.green : Colors.red;
            try {
              scaffoldMessenger.showSnackBar(
                SnackBar(
                    content: Text(msg),
                    backgroundColor: color,
                    duration: const Duration(seconds: 5)),
              );
            } catch (e) {
              // Widget may have been disposed, ignore snackbar error
              debugPrint('[Sync] Could not show snackbar: $e');
            }
          });
        }

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              networkStatus == NetworkStatus.online
                  ? 'Visit saved. Syncing in background...'
                  : 'Visit saved locally. Will sync when online.',
            ),
            backgroundColor: networkStatus == NetworkStatus.online
                ? Colors.green
                : Colors.orange,
          ),
        );

        final uniqueSampleTypes =
            samples.map((s) => s.sampleName).toSet().toList();
        final sampleTypesString = uniqueSampleTypes.join(', ');

        // Clean up the local draft as the flow is now successfully submitted!
        await VisitDraftRepository.deleteDraft(visitId);

        if (context.mounted) {
          context.go('/SuccessScreen', extra: {
            'totalSamples': samples.length,
            'sampleTypes': sampleTypesString,
            'profile': profile.data,
            'isOnline': networkStatus == NetworkStatus.online,
          });
        }

        final now = DateTime.now();
        final today = DateTime(now.year, now.month, now.day);
        final startOfWeek = today.subtract(Duration(days: now.weekday - 1));
        final endOfWeek = startOfWeek.add(const Duration(days: 6));
        final startOfMonth = DateTime(now.year, now.month, 1);
        final endOfMonth = DateTime(now.year, now.month + 1, 0);
        final startOf3Months = DateTime(now.year, now.month - 2, 1);
        final endOf3Months = endOfMonth;

        final filters = [
          [null, null],
          [startOfWeek, endOfWeek],
          [startOfMonth, endOfMonth],
          [startOf3Months, endOf3Months],
        ];
        for (final filter in filters) {
          final startDate = filter[0];
          final endDate = filter[1];

          // Update upcoming visits ApiCache - remove completed visit
          final upcomingCacheKey =
              'scheduledVisits_${projectId}_upcoming_true_${startDate?.toIso8601String() ?? ''}_${endDate?.toIso8601String() ?? ''}';
          final upcomingCached = await ApiCache.get<List<Object?>>(
            upcomingCacheKey,
            (json) => (json as List?) ?? [],
          );
          if (upcomingCached != null && upcomingCached.isNotEmpty) {
            final filtered = upcomingCached.where((e) {
              try {
                return (e as Map<String, dynamic>)['id'] != visitId;
              } catch (_) {
                return true;
              }
            }).toList();
            await ApiCache.set(upcomingCacheKey, filtered);
          }

          // Update completed visits ApiCache - add completed visit
          final completedCacheKey =
              'completedVisits_${projectId}_${startDate?.toIso8601String() ?? ''}_${endDate?.toIso8601String() ?? ''}__';
          final completedCached = await ApiCache.get<List<Object?>>(
            completedCacheKey,
            (json) => (json as List?) ?? [],
          );
          final completedVisitSerialized = standardSerializers.serializeWith(
            VisitResponseData.serializer,
            visit.rebuild(
              (b) => b
                ..visitStatus = VisitStatus.completed
                ..visitedAt = DateTime.now().toUtc()
                ..samples = convertSamplesToVisitSamples(samples),
            ),
          );
          if (completedCached != null) {
            final filtered = completedCached.where((e) {
              try {
                return (e as Map)['id'] != visitId;
              } catch (_) {
                return true;
              }
            }).toList();
            await ApiCache.set(
                completedCacheKey, [completedVisitSerialized, ...filtered]);
          } else {
            await ApiCache.set(completedCacheKey, [completedVisitSerialized]);
          }
        }
      } catch (error) {
        print("Error saving visit: ${error}");
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(error.toString()),
            backgroundColor: Colors.red,
          ),
        );
      }
    }, [visit, project, submitVisitMutation, samples, visitId, profile.data]);

    // Define the builder functions at the top level of build

    Widget buildPhotoThumbnail(String photoPath) {
      if (!photoPath.startsWith('http')) {
        return Container(
          width: 100,
          height: 100,
          margin: const EdgeInsets.only(right: 8),
          decoration: BoxDecoration(
            color: AppColors.surfaceLight,
            borderRadius: BorderRadius.circular(8),
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: Image.file(
              File(photoPath),
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) =>
                  const Icon(Icons.photo_outlined),
            ),
          ),
        );
      }

      // S3 remote URL - look for a matching local compressed file in temporary directory
      return FutureBuilder<File?>(
        future: () async {
          try {
            final tempDir = await getTemporaryDirectory();
            final urlFileName = photoPath.split('/').last.split('?').first;

            // 1. Direct file check
            final directFile = File('${tempDir.path}/$urlFileName');
            if (await directFile.exists()) {
              return directFile;
            }

            // 2. Suffix match check for compressed files
            final List<FileSystemEntity> files = tempDir.listSync();
            for (final entity in files) {
              if (entity is File) {
                final localName = entity.path.split('/').last;
                if (urlFileName.contains(localName)) {
                  return entity;
                }
              }
            }
          } catch (e) {
            debugPrint('Error finding local file for review thumbnail: $e');
          }
          return null;
        }(),
        builder: (context, snapshot) {
          final localFile = snapshot.data;

          return Container(
            width: 100,
            height: 100,
            margin: const EdgeInsets.only(right: 8),
            decoration: BoxDecoration(
              color: AppColors.surfaceLight,
              borderRadius: BorderRadius.circular(8),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: localFile != null
                  ? Image.file(
                      localFile,
                      fit: BoxFit.cover,
                    )
                  : Image.network(
                      photoPath,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) =>
                          const Icon(Icons.broken_image, color: Colors.grey),
                    ),
            ),
          );
        },
      );
    }

    Widget _buildSmallHeading(String title) {
      return Padding(
        padding: const EdgeInsets.only(left: 16, right: 16, top: 24, bottom: 8),
        child: Text(
          title.toUpperCase(),
          style: AppTypography.textTheme.labelMMedium.copyWith(
            color: AppColors.textWeak,
            fontSize: 12,
            fontWeight: FontWeight.bold,
            letterSpacing: 1.2,
          ),
        ),
      );
    }

    Widget _buildSectionHeader(IconData icon, String title) {
      return Row(
        children: [
          Icon(icon, color: AppColors.secondaryPurple10, size: 20),
          const SizedBox(width: 8),
          Text(
            title,
            style: AppTypography.textTheme.bodyB2SemiBold.copyWith(
              color: AppColors.textStrong,
              fontSize: 14,
            ),
          ),
        ],
      );
    }

    Widget buildVisitorCard(String initials, String name, String email) =>
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            border: Border.all(color: AppColors.strokeWeak),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: AppColors.surfaceLight,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Center(
                  child: Text(
                    initials,
                    style: AppTypography.textTheme.bodyB2SemiBold.copyWith(
                      color: AppColors.textStrong,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      name,
                      style: AppTypography.textTheme.bodyB2SemiBold.copyWith(
                        color: AppColors.textStrong,
                      ),
                    ),
                    Text(
                      email,
                      style: AppTypography.textTheme.bodyB3Regular.copyWith(
                        color: AppColors.textWeak,
                      ),
                    ),
                  ],
                ),
              ),
              // const Icon(
              //   Icons.chevron_right,
              //   color: AppColors.textWeak,
              // ),
            ],
          ),
        );

    Map<String, List<SampleData>> _groupSamplesByAnimal(
        List<SampleData> samples) {
      final Map<String, List<SampleData>> groups = {};
      for (var sample in samples) {
        // Show all unique barcodes in review
        if (sample.originalSampleBarcode != sample.barcode &&
            sample.originalSampleBarcode.isNotEmpty) {
          // It's a replicate
        }

        final metadata = sample.metadata != null
            ? Map<String, dynamic>.from(sample.metadata!)
            : <String, dynamic>{};
        final animalMeta = metadata['animalMetadata'] != null
            ? Map<String, dynamic>.from(metadata['animalMetadata'] as Map)
            : null;

        // Try to get animal ID from nested or top level metadata
        final String? animalId = (animalMeta != null
                ? (animalMeta['animalTagId'] ?? animalMeta['birdId'])
                : (metadata['animalTagId'] ?? metadata['birdId']))
            ?.toString();

        if (animalId != null && animalId.trim().isNotEmpty) {
          groups.putIfAbsent(animalId, () => []).add(sample);
        } else {
          // If it lacks an animal identifier, check if it's explicitly environmental
          // or just fallback to environmental bucket.
          groups.putIfAbsent('Environmental', () => []).add(sample);
        }
      }
      return groups;
    }

    int _getAnimalIndex(String animalId, List<SampleData> samples) {
      final ids = _groupSamplesByAnimal(samples)
          .keys
          .where((k) => k != 'Environmental')
          .toList();
      return ids.indexOf(animalId) + 1;
    }

    Widget _buildSampleRow(SampleData sample) {
      final photoCount = sample.photos.length;
      final hasReplicates =
          sample.replicates != 'not collected' && sample.replicates.isNotEmpty;
      final comments = sample.comments;

      return Padding(
        padding: const EdgeInsets.symmetric(vertical: 10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    sample.sampleName,
                    style: AppTypography.textTheme.bodyB2SemiBold.copyWith(
                      color: AppColors.textStrong,
                    ),
                  ),
                ),
                if (photoCount > 0)
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: AppColors.background,
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.camera_alt_outlined,
                            size: 12, color: AppColors.textWeak),
                        const SizedBox(width: 4),
                        Text(
                          '$photoCount',
                          style: AppTypography.textTheme.bodyB4Regular.copyWith(
                            color: AppColors.textWeak,
                          ),
                        ),
                      ],
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 6),
            Row(
              children: [
                Expanded(
                  child: Row(
                    children: [
                      Text(
                        'Barcode: ',
                        style: AppTypography.textTheme.bodyB3Regular.copyWith(
                          color: AppColors.textWeak,
                        ),
                      ),
                      Text(
                        sample.barcode,
                        style: AppTypography.textTheme.bodyB3Medium.copyWith(
                          color: AppColors.textStrong,
                        ),
                      ),
                    ],
                  ),
                ),
                if (hasReplicates)
                  Row(
                    children: [
                      const Icon(Icons.copy_all,
                          size: 14, color: AppColors.primaryLight),
                      const SizedBox(width: 4),
                      Text(
                        'Replicate included',
                        style: AppTypography.textTheme.bodyB4Medium.copyWith(
                          color: AppColors.primaryLight,
                        ),
                      ),
                    ],
                  ),
              ],
            ),
            if (comments.isNotEmpty && comments != 'No comments') ...[
              const SizedBox(height: 8),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: AppColors.background,
                  borderRadius: BorderRadius.circular(8),
                  border:
                      Border.all(color: AppColors.strokeWeak.withOpacity(0.5)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'COMMENTS',
                      style: AppTypography.textTheme.labelMMedium.copyWith(
                        color: AppColors.textWeak,
                        fontSize: 9,
                        letterSpacing: 1.0,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      comments,
                      style: AppTypography.textTheme.bodyB4Regular.copyWith(
                        color: AppColors.textStrong,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
      );
    }

    Widget buildDetailRow(IconData icon, String label, String value) {
      return Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: AppColors.primaryLight.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, size: 18, color: AppColors.primaryLight),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: AppTypography.textTheme.labelMMedium.copyWith(
                    color: AppColors.textWeak,
                    fontSize: 11,
                    letterSpacing: 0.5,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: AppTypography.textTheme.bodyB2Medium.copyWith(
                    color: AppColors.textStrong,
                  ),
                ),
              ],
            ),
          ),
        ],
      );
    }

    Widget buildDiseaseHerdInfoCard() {
      final questionnaireData = updateVisitDto.diseaseQuestionnaireData?.value;
      if (questionnaireData == null) {
        return const SizedBox.shrink();
      }

      final dataMap = Map<String, dynamic>.from(questionnaireData as Map);
      if (dataMap.isEmpty) {
        return const SizedBox.shrink();
      }

      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildSmallHeading('Disease & Herd Info'),
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 16),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.strokeWeak.withOpacity(0.5)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Diseases',
                  style: AppTypography.textTheme.bodyB3Regular.copyWith(
                    color: AppColors.textWeak,
                  ),
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: dataMap.keys
                      .map((disease) => Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 12, vertical: 6),
                            decoration: BoxDecoration(
                              color: AppColors.primaryLight.withOpacity(0.08),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(
                              disease,
                              style:
                                  AppTypography.textTheme.bodyB3Medium.copyWith(
                                color: AppColors.primaryLight,
                              ),
                            ),
                          ))
                      .toList(),
                ),
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 16),
                  child: Divider(height: 1, color: AppColors.strokeWeak),
                ),
                Text(
                  'Species & Herd',
                  style: AppTypography.textTheme.bodyB3Regular.copyWith(
                    color: AppColors.textWeak,
                  ),
                ),
                const SizedBox(height: 12),
                ...dataMap.entries.map((entry) {
                  final answers = Map<String, dynamic>.from(entry.value as Map);
                  final herdList = (answers['speciesHerdList'] as List?) ?? [];

                  return Column(
                    children: herdList.map((item) {
                      final speciesId =
                          (item['species'] ?? 'Unknown').toString();
                      final species = speciesId == 'Other'
                          ? 'Other'
                          : speciesMap[speciesId] ?? speciesId;
                      final otherSpecies = item['otherSpecies']?.toString();
                      final herdSize = item['herdSize']?.toString() ?? '0';
                      final displaySpecies =
                          species == 'Other' && otherSpecies != null
                              ? otherSpecies
                              : species;

                      return Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              displaySpecies,
                              style:
                                  AppTypography.textTheme.bodyB2Medium.copyWith(
                                color: AppColors.textStrong,
                              ),
                            ),
                            Text(
                              herdSize,
                              style: AppTypography.textTheme.bodyB2Regular
                                  .copyWith(
                                color: AppColors.textWeak,
                              ),
                            ),
                          ],
                        ),
                      );
                    }).toList(),
                  );
                }).toList(),
              ],
            ),
          ),
        ],
      );
    }

    Widget buildSiteInfoCard() {
      final site = visit.site;
      final date = visit.visitScheduledAt;
      final formattedDate = DateFormat('dd MMM, yyyy').format(date);

      return Container(
        margin: const EdgeInsets.symmetric(horizontal: 16),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.strokeWeak.withOpacity(0.5)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    site.name,
                    style: AppTypography.textTheme.headingH3.copyWith(
                      color: AppColors.textStrong,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.secondaryPurple10.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    site.siteCode ?? '',
                    style: AppTypography.textTheme.labelMMedium.copyWith(
                      color: AppColors.secondaryPurple10,
                      fontSize: 10,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              '${site.farmType ?? ''}${site.siteSubType != null ? " (${site.siteSubType})" : ""}',
              style: AppTypography.textTheme.bodyB3Regular.copyWith(
                color: AppColors.textWeak,
              ),
            ),
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 16),
              child: Divider(height: 1, color: AppColors.strokeWeak),
            ),
            if (site.siteOwnerName != null &&
                site.siteOwnerName!.isNotEmpty) ...[
              buildDetailRow(
                  Icons.person_outline, 'Site Owner', site.siteOwnerName!),
              const SizedBox(height: 16),
            ],
            buildDetailRow(
                Icons.calendar_today_outlined, 'Visit Date', formattedDate),
            const SizedBox(height: 16),
            buildDetailRow(
                Icons.location_searching,
                'Site Coordinates',
                (site.location?.coordinates?.coordinates != null &&
                        site.location!.coordinates!.coordinates.length >= 2)
                    ? '${site.location!.coordinates!.coordinates[1].toStringAsFixed(6)}, ${site.location!.coordinates!.coordinates[0].toStringAsFixed(6)}'
                    : '...'),
            const SizedBox(height: 16),
            buildDetailRow(Icons.location_on_outlined, 'Site Address',
                site.address ?? 'No address provided'),
          ],
        ),
      );
    }

    Widget buildLocationCard() {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildSmallHeading('LOCATION'),
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.strokeWeak.withOpacity(0.5)),
            ),
            child: Column(
              children: [
                buildDetailRow(Icons.my_location, 'Current Coordinates',
                    '${latitude.value?.toStringAsFixed(6) ?? '...'}, ${longitude.value?.toStringAsFixed(6) ?? '...'}'),
              ],
            ),
          ),
        ],
      );
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: const BackButton(color: AppColors.textStrong),
        title: Text(
          'Visit Details',
          style: AppTypography.textTheme.bodyB2SemiBold.copyWith(
            color: AppColors.textStrong,
          ),
        ),
        actions: [],
      ),
      bottomNavigationBar: Container(
        padding: EdgeInsets.only(
          left: 16,
          right: 16,
          bottom: MediaQuery.of(context).padding.bottom + 16,
          top: 16,
        ),
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 4,
              offset: const Offset(0, -2),
            ),
          ],
        ),
        child: ElevatedButton(
          onPressed: hasCoords ? handleSubmitVisit : null,
          style: ElevatedButton.styleFrom(
            backgroundColor: hasCoords
                ? AppColors.primaryLight
                : AppColors.primaryLight.withOpacity(0.5),
            padding: const EdgeInsets.symmetric(vertical: 16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
          child: submitVisitMutation.isPending
              ? const CircularProgressIndicator(color: Colors.white)
              : !hasCoords
                  ? Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const SizedBox(
                          width: 16,
                          height: 16,
                          child: CircularProgressIndicator(
                            color: Colors.white,
                            strokeWidth: 2,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'Fetching Location...',
                          style: AppTypography.textTheme.buttonSmall.copyWith(
                            color: AppColors.white,
                          ),
                        ),
                      ],
                    )
                  : Text(
                      'Submit Visit',
                      style: AppTypography.textTheme.buttonSmall.copyWith(
                        color: AppColors.white,
                      ),
                    ),
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Farm Image
            Container(
              color: AppColors.background,
              height: 220,
              width: double.infinity,
              child: ((resolvedSite.value?.photos?.isNotEmpty == true &&
                          resolvedSite.value!.photos!.first.isNotEmpty) ||
                      (visit.site.photos?.isNotEmpty == true &&
                          visit.site.photos!.first.isNotEmpty))
                  ? CachedNetworkImage(
                      imageUrl: resolvedSite.value?.photos?.firstOrNull ??
                          visit.site.photos?.firstOrNull ??
                          '',
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
            const SizedBox(height: 16),
            buildSiteInfoCard(),
            buildLocationCard(),
            buildDiseaseHerdInfoCard(),

            // Clinical Samples Logic
            if (_groupSamplesByAnimal(samples)
                .keys
                .any((k) => k != 'Environmental')) ...[
              _buildSmallHeading('Clinical Samples'),
              ..._groupSamplesByAnimal(samples)
                  .entries
                  .where((e) => e.key != 'Environmental')
                  .map((entry) {
                final animalId = entry.key;
                final animalSamples = entry.value;
                final metadata = animalSamples.first.metadata != null
                    ? Map<String, dynamic>.from(animalSamples.first.metadata!)
                    : <String, dynamic>{};
                final animalMeta = metadata['animalMetadata'] != null
                    ? Map<String, dynamic>.from(
                        metadata['animalMetadata'] as Map)
                    : metadata;
                final fever = animalMeta['feverObserved'] == true;

                final speciesId =
                    animalMeta['species'] ?? animalMeta['species_AI'] ?? '';
                final species = speciesId == 'Other'
                    ? 'Other'
                    : speciesMap[speciesId] ?? speciesId;

                final breed =
                    animalMeta['breed'] ?? animalMeta['breed_AI'] ?? '';

                String? ageStr;
                if (animalMeta['age'] != null) {
                  ageStr = 'Age: ${animalMeta['age']}';
                } else if (animalMeta['ageYears'] != null) {
                  ageStr = 'Age: ${animalMeta['ageYears']}y';
                  if (animalMeta['ageMonths'] != null) {
                    ageStr += ' ${animalMeta['ageMonths']}m';
                  }
                }

                final metadataParts = [
                  if (ageStr != null) ageStr,
                  if (animalMeta['gender'] != null)
                    'Gender: ${animalMeta['gender']}',
                  if (animalMeta['vaccinationStage'] != null)
                    'Vaccination Stage: ${animalMeta['vaccinationStage']}',
                  if (animalMeta['vaccinationStage_AI'] != null)
                    'Vaccination Stage: ${animalMeta['vaccinationStage_AI']}',
                  if (animalMeta['diseaseHistory'] != null)
                    'Disease History: ${animalMeta['diseaseHistory']}',
                ];

                return Container(
                  margin:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                        color: AppColors.strokeWeak.withOpacity(0.5)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Animal ${_getAnimalIndex(animalId, samples)} — $animalId',
                            style:
                                AppTypography.textTheme.bodyB2SemiBold.copyWith(
                              color: AppColors.textStrong,
                            ),
                          ),
                          Text(
                            '$species · $breed',
                            style:
                                AppTypography.textTheme.bodyB3Regular.copyWith(
                              color: AppColors.textWeak,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      RichText(
                        text: TextSpan(
                          style: AppTypography.textTheme.bodyB3Regular.copyWith(
                            color: AppColors.textWeak,
                          ),
                          children: [
                            TextSpan(text: metadataParts.join(' · ')),
                            if (fever)
                              const TextSpan(
                                text: ' · Fever observed',
                                style: TextStyle(color: Colors.red),
                              ),
                          ],
                        ),
                      ),
                      const Padding(
                        padding: EdgeInsets.symmetric(vertical: 12),
                        child: Divider(height: 1, color: AppColors.strokeWeak),
                      ),
                      ...animalSamples
                          .map((sample) => _buildSampleRow(sample))
                          .toList(),
                    ],
                  ),
                );
              }),
            ],

            // Environmental Samples Logic
            if (_groupSamplesByAnimal(samples)
                .containsKey('Environmental')) ...[
              _buildSmallHeading('Environmental Samples'),
              Container(
                margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border:
                      Border.all(color: AppColors.strokeWeak.withOpacity(0.5)),
                ),
                child: Column(
                  children: _groupSamplesByAnimal(samples)['Environmental']!
                      .map((sample) => _buildSampleRow(sample))
                      .toList(),
                ),
              ),
            ],
            const SizedBox(height: 4),
            // Photos & Comments Section
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border:
                      Border.all(color: AppColors.strokeWeak.withOpacity(0.5)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildSectionHeader(
                        Icons.insert_photo_outlined, 'Photos & Comments'),
                    const SizedBox(height: 20),
                    if (updateVisitDto.photos?.isEmpty ?? true)
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: AppColors.background,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.no_photography_outlined,
                                color: AppColors.textWeak),
                            const SizedBox(width: 8),
                            Text('No photos available',
                                style: AppTypography.textTheme.bodyB3Regular
                                    .copyWith(color: AppColors.textWeak)),
                          ],
                        ),
                      )
                    else
                      SizedBox(
                        height: 100,
                        child: ListView.separated(
                          scrollDirection: Axis.horizontal,
                          itemCount: updateVisitDto.photos?.length ?? 0,
                          separatorBuilder: (_, __) => const SizedBox(width: 8),
                          itemBuilder: (context, index) => buildPhotoThumbnail(
                              updateVisitDto.photos![index]),
                        ),
                      ),
                    const SizedBox(height: 20),
                    Text(
                      'COLLECTOR\'S COMMENT',
                      style: AppTypography.textTheme.labelMMedium.copyWith(
                        color: AppColors.textWeak,
                        fontSize: 10,
                        letterSpacing: 1.0,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.background,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.strokeWeak),
                      ),
                      child: Text(
                        updateVisitDto.comment ?? 'No comments provided',
                        style: AppTypography.textTheme.bodyB3Regular.copyWith(
                          color: AppColors.textStrong,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 4),
            // Visited by Section
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border:
                      Border.all(color: AppColors.strokeWeak.withOpacity(0.5)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildSectionHeader(
                        Icons.person_pin_outlined, 'Visited by'),
                    const SizedBox(height: 20),
                    if (profile.data != null)
                      buildVisitorCard(
                        (profile.data!.lastName?.isNotEmpty == true)
                            ? profile.data!.lastName!
                                .substring(0, 1)
                                .toUpperCase()
                            : 'O',
                        '${profile.data!.firstName ?? ''} ${profile.data!.lastName ?? ''}',
                        profile.data!.email ?? '',
                      ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}
