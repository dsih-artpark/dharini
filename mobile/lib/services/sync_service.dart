import 'dart:async';

import 'package:built_collection/built_collection.dart';
import 'package:built_value/json_object.dart';
import 'package:dio/dio.dart';
import 'package:es_client/es_client.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:fquery/fquery.dart';
import 'package:hive/hive.dart';
import 'package:path/path.dart' as path;
import 'package:sentry_flutter/sentry_flutter.dart';

import '../hooks/auth.dart';
import 'database_service.dart';
import 'photo_upload_manager.dart';
import '../utils/hive_serialization.dart';

enum SyncStatus { idle, syncing, error, completed }

class SyncResult {
  final bool success;
  final String? error;
  final int processedCount;
  final int failedCount;

  SyncResult({
    required this.success,
    this.error,
    required this.processedCount,
    required this.failedCount,
  });
}

class SyncService {
  final EsClient _client;
  final PhotoUploadManager _photoManager;
  final QueryClient? _queryClient;
  final String? _projectId;
  final _syncController = StreamController<SyncStatus>.broadcast();
  Timer? _syncTimer;
  String? lastError;

  // App-wide, not per instance: more than one SyncService can be alive at once
  // (the provider rebuilds on connectivity changes, logout() creates a
  // throwaway one), and a disposed instance's in-flight sync keeps running.
  // A per-instance flag let two runs read the same pending submission and
  // PUT submit-visit twice, the second failing with a duplicate-barcode 409.
  static Future<SyncResult>? _inFlightSync;
  static bool _rerunRequested = false;

  SyncService(
    this._client,
    PhotoUploadManager? photoManager, {
    QueryClient? queryClient,
    String? projectId,
  })  : _photoManager = photoManager ??
            PhotoUploadManager((localPath) =>
                PhotoUploadManager.uploadPhotoToApi(_client, localPath)),
        _queryClient = queryClient,
        _projectId = projectId;

  Stream<SyncStatus> get syncStatus => _syncController.stream;

  void startAutoSync({Duration interval = const Duration(minutes: 5)}) {
    _syncTimer?.cancel();
    _syncTimer = Timer.periodic(interval, (_) => sync());
  }

  void stopAutoSync() {
    _syncTimer?.cancel();
    _syncTimer = null;
  }

  /// Runs a sync, or joins the one already running anywhere in the app.
  ///
  /// A caller that joins also requests one more pass once the current one
  /// finishes, since the running pass may have read the pending queue before
  /// the caller's submission was saved. That pass only runs if a submission
  /// was actually queued after the current one started: a join with nothing
  /// new (a connectivity flap, the timer, a manual tap) would just retry what
  /// the current pass already attempted, back to back on a flaky network.
  /// The returned result is the last pass's.
  Future<SyncResult> sync() {
    final inFlight = _inFlightSync;
    if (inFlight != null) {
      _rerunRequested = true;
      return inFlight;
    }

    return _inFlightSync = _syncUntilSettled();
  }

  Future<SyncResult> _syncUntilSettled() async {
    try {
      SyncResult result;
      Set<DateTime> queuedAtStart;
      do {
        _rerunRequested = false;
        queuedAtStart = _queuedSubmissionTimes();
        result = await _syncOnce();
      } while (_rerunRequested &&
          !queuedAtStart.containsAll(_queuedSubmissionTimes()));
      return result;
    } finally {
      // Cleared with no await after the last rerun check, so a caller can
      // never join a finished run and have its rerun dropped.
      _inFlightSync = null;
    }
  }

  // createdAt, not id, identifies a queued submission: a pass rewrites the id
  // when it re-keys a local visit to its server id, but status updates and
  // re-keying both go through copyWith, which keeps createdAt. Only a new
  // submission brings a createdAt the pass didn't start with.
  static Set<DateTime> _queuedSubmissionTimes() =>
      DatabaseService.getSubmissionsToUpload().map((s) => s.createdAt).toSet();

  Future<SyncResult> _syncOnce() async {
    if (!_syncController.isClosed) _syncController.add(SyncStatus.syncing);

    try {
      final submissions = DatabaseService.getSubmissionsToUpload();
      int processed = 0;
      int failed = 0;
      int queueSynced = 0;
      List<String> failedErrors = [];

      Sentry.addBreadcrumb(Breadcrumb(
        message: 'Starting sync for ${submissions.length} submission(s)',
        category: 'sync',
        level: SentryLevel.info,
      ));

      debugPrint(
          '[Sync] Starting sync for ${submissions.length} submission(s)');

      // Step 0: First sync any pending site/visit creations to server.
      // This ensures local IDs are mapped to server IDs before submitting visits.
      //
      // Tenant-agnostic by design: a queued item belongs to the project it was
      // captured under, not to whatever project happens to be selected in the
      // UI right now (see PendingVisitSubmission.projectId doc comment). So
      // this runs once per DISTINCT project represented in the pending queue,
      // not once for `_projectId` alone — otherwise a visit captured under
      // Project B while Project A is selected would never get its site/visit
      // IDs resolved and would be stuck retrying forever. The currently
      // selected project is included too, even with no pending submissions
      // yet, so an in-progress site/visit creation still flushes.
      //
      // KNOWN GAP (not fixable from this file): syncChangesToServerQueue
      // (lib/hooks/auth.dart) reads the shared 'syncQueue' Hive box, whose
      // entries carry no project id of their own — it submits every entry
      // currently in that box against whichever projectId is passed in, then
      // removes it from the queue. Looping over multiple projects here is the
      // best available fix without changing that box's schema (out of scope:
      // mobile/lib/hooks/** is owned by another agent). It stays correct only
      // as long as a device can't accumulate syncQueue entries for more than
      // one project at a time, which is still true today since project
      // switching isn't wired up yet. Once it is, 'syncQueue' entries need the
      // same per-entry projectId tag PendingVisitSubmission just got.
      final pendingProjectIds = DatabaseService.getSubmissionsToUpload()
          .map((s) => s.projectId)
          .whereType<String>()
          .where((id) => id.isNotEmpty)
          .toSet();
      if (_projectId != null && _projectId.isNotEmpty) {
        pendingProjectIds.add(_projectId);
      }

      for (final pid in pendingProjectIds) {
        try {
          debugPrint('[Sync] Running syncChangesToServerQueue for project $pid...');
          SyncQueueResult queueResult =
              await syncChangesToServerQueue(_client, pid);
          queueSynced += queueResult.totalSynced;
          debugPrint(
              '[Sync] syncChangesToServerQueue completed for $pid: $queueResult');

          // If the first pass had errors but also some successes, retry once for
          // the remaining failures (e.g. a visit whose site just got synced).
          if (queueResult.hasErrors && queueResult.totalSynced > 0) {
            debugPrint(
                '[Sync] Queue for $pid had partial errors — retrying failed items...');
            await Future.delayed(const Duration(seconds: 2));
            final retryResult = await syncChangesToServerQueue(_client, pid);
            queueSynced += retryResult.totalSynced;
            debugPrint(
                '[Sync] Retry syncChangesToServerQueue completed for $pid: $retryResult');
          } else if (queueResult.hasErrors) {
            debugPrint(
                '[Sync] Queue sync for $pid had errors: ${queueResult.errors}');
          }

          Sentry.addBreadcrumb(Breadcrumb(
            message: 'syncChangesToServerQueue completed',
            category: 'sync',
            level: SentryLevel.info,
            data: {
              'projectId': pid,
              'queueResult': queueResult.toString(),
              'errors': queueResult.errors
            },
          ));
        } catch (e) {
          debugPrint('[Sync] syncChangesToServerQueue failed for $pid: $e');
          Sentry.addBreadcrumb(Breadcrumb(
            message: 'syncChangesToServerQueue failed',
            category: 'sync',
            level: SentryLevel.error,
            data: {'projectId': pid, 'error': e.toString()},
          ));
          // Do not rethrow — we still want to process any submissions whose
          // IDs were already resolved in a previous sync cycle (for this or
          // any other project).
        }
      }

      if (pendingProjectIds.isNotEmpty) {
        debugPrint(
            '[Sync] Re-fetching submissions after queue sync to get updated IDs...');
      }

      final updatedSubmissions = DatabaseService.getSubmissionsToUpload();
      debugPrint(
          '[Sync] Processing ${updatedSubmissions.length} submission(s) after queue sync');

      for (int i = 0; i < updatedSubmissions.length; i++) {
        final submission = updatedSubmissions[i];
        debugPrint(
            '[Sync] Processing ${i + 1}/${updatedSubmissions.length} - ID: ${submission.id}');

        try {
          Sentry.addBreadcrumb(Breadcrumb(
            message: 'Step 0: Starting submission ${submission.id}',
            category: 'sync',
            level: SentryLevel.info,
            data: {'submission_index': i + 1, 'total': submissions.length},
          ));

          await DatabaseService.updateSubmissionStatus(
            submission.id,
            isUploading: true,
          );

          // Step 1: Collect photo paths
          Sentry.addBreadcrumb(Breadcrumb(
            message: 'Step 1: Collecting photo paths',
            category: 'sync',
            level: SentryLevel.info,
          ));

          final visitData = HiveSerialization.normalizeMap(submission.data['visitData']) ?? <String, dynamic>{};
          final samples = (submission.data['samples'] as List)
              .map((e) => HiveSerialization.normalizeMap(e) ?? <String, dynamic>{})
              .toList();

          // Use originalVisitId from the submission if available (for proper Hive cleanup)
          // Fall back to the current visit ID if not present (backwards compatibility)
          final originalVisitId =
              visitData['originalVisitId'] ?? visitData['id'];
          if (originalVisitId != null &&
              originalVisitId is String &&
              originalVisitId.startsWith('local-')) {
            final visitIdMapBox = Hive.isBoxOpen('visitIdMap')
                ? Hive.box('visitIdMap')
                : await Hive.openBox('visitIdMap');

            debugPrint('[Sync] 🔍 Checking visitIdMapBox for $originalVisitId');
            debugPrint(
                '[Sync] visitIdMapBox keys: ${visitIdMapBox.keys.toList()}');
            debugPrint(
                '[Sync] visitIdMapBox values: ${visitIdMapBox.values.toList()}');

            final resolvedId = visitIdMapBox.get(originalVisitId);
            if (resolvedId != null) {
              visitData['id'] = resolvedId;
              Sentry.addBreadcrumb(Breadcrumb(
                message: 'Resolved local visit ID to server ID',
                category: 'sync',
                level: SentryLevel.info,
                data: {'original': originalVisitId, 'resolved': resolvedId},
              ));
              debugPrint(
                  '[Sync] ✅ Replaced visit ID $originalVisitId → $resolvedId');
              // Note: do NOT delete the map entry here — delete it only after
              // _submitVisit succeeds, so retries can still resolve the ID.
            } else {
              debugPrint(
                  '[Sync] ❌ No mapped ID found for local visit $originalVisitId');
            }
          }

          // Resolve siteId if it's a local ID
          final siteId = visitData['siteId'];
          if (siteId != null &&
              siteId is String &&
              siteId.startsWith('local-')) {
            final siteIdMapBox = Hive.isBoxOpen('siteIdMap')
                ? Hive.box('siteIdMap')
                : await Hive.openBox('siteIdMap');

            debugPrint('[Sync] Checking siteIdMapBox for $siteId');
            final resolvedSiteId = siteIdMapBox.get(siteId);

            if (resolvedSiteId != null) {
              visitData['siteId'] = resolvedSiteId;
              Sentry.addBreadcrumb(Breadcrumb(
                message: 'Resolved local site ID to server ID',
                category: 'sync',
                level: SentryLevel.info,
                data: {'original': siteId, 'resolved': resolvedSiteId},
              ));
              debugPrint('[Sync] ✅ Replaced site ID $siteId → $resolvedSiteId');
            } else {
              debugPrint('[Sync] ❌ No mapped ID found for local site $siteId');
            }
          }

          debugPrint(
              '[Sync] Final visit ID before _submitVisit: ${visitData['id']}');

          final visitPhotoPaths =
              (visitData['photos'] as List?)?.cast<String>() ?? [];
          final samplePhotoPaths = samples
              .expand(
                  (sample) => (sample['photos'] as List?)?.cast<String>() ?? [])
              .toList();
          // Only upload LOCAL files. Photos captured via ImageUploadGrid (e.g.
          // visit-level / site photos) are uploaded eagerly and already stored
          // as S3 URLs; feeding those to the uploader would try to read a URL
          // as a local file (PathNotFoundException). They are preserved as-is by
          // _updatePhotosIn* (which passes through anything not in the mapping).
          final allPhotoPaths = <String>{...visitPhotoPaths, ...samplePhotoPaths}
              .where((p) => !PhotoUploadManager.isRemoteUrl(p))
              .toList();

          debugPrint('[Sync] Found ${allPhotoPaths.length} photo(s) to upload');

          // Step 2: Upload photos
          Sentry.addBreadcrumb(Breadcrumb(
            message: 'Step 2: Uploading ${allPhotoPaths.length} photo(s)',
            category: 'sync',
            level: SentryLevel.info,
            data: {'photo_count': allPhotoPaths.length},
          ));

          final photoResults =
              await _photoManager.uploadPhotosWithMapping(allPhotoPaths);

          final failedPhotos =
              photoResults.where((r) => r.error != null).toList();
          if (failedPhotos.isNotEmpty) {
            final errorSummary = failedPhotos
                .map((p) => '${path.basename(p.localPath)}: ${p.error}')
                .join('; ');
            throw Exception('Photo upload failed: $errorSummary');
          }

          Sentry.addBreadcrumb(Breadcrumb(
            message: 'Step 2: Photo upload completed',
            category: 'sync',
            level: SentryLevel.info,
          ));

          // Step 3: Replace local paths with S3 URLs
          Sentry.addBreadcrumb(Breadcrumb(
            message: 'Step 3: Replacing local paths with S3 URLs',
            category: 'sync',
            level: SentryLevel.info,
          ));

          final photoMapping = Map<String, String>.fromEntries(
            photoResults.map((r) => MapEntry(r.localPath, r.s3Url!)),
          );
          final updatedVisitData =
              _updatePhotosInVisitData(visitData, photoMapping);
          final updatedSamples = _updatePhotosInSamples(samples, photoMapping);

          // Log full data before submitting
          debugPrint('[Sync] Submitting updated visit for ${submission.id}');
          debugPrint('[Sync] VisitData Submitted: ${(updatedVisitData)}');
          debugPrint('[Sync] Samples Submitted: ${(updatedSamples)}');
          debugPrint('[Sync] Photo Mapping Used: ${(photoMapping)}');
          debugPrint('[Sync] Original visit ID for cleanup: $originalVisitId');

          final submissionVisitId = updatedVisitData['id']?.toString() ?? '';
          final submissionSiteId = updatedVisitData['siteId']?.toString() ?? '';
          if (submissionVisitId.startsWith('local-')) {
            // The visit hasn't been synced to the server yet (e.g. the site or
            // visit creation API call failed during syncChangesToServerQueue).
            // Skip this submission gracefully so it can be retried on the next
            // sync cycle — do NOT throw, which would mark it permanently failed.
            debugPrint(
                '[Sync] ⏭️ Skipping submission ${submission.id}: visit ID still '
                'unresolved ($submissionVisitId). Will retry on next sync.');
            Sentry.addBreadcrumb(Breadcrumb(
              message: 'Skipped submission — unresolved local visit ID',
              category: 'sync',
              level: SentryLevel.warning,
              data: {
                'submission_id': submission.id,
                'local_visit_id': submissionVisitId,
              },
            ));
            await DatabaseService.updateSubmissionStatus(
              submission.id,
              isUploading: false,
              error:
                  'Waiting for visit to be created on server. Will retry automatically.',
            );
            failed++;
            continue;
          }
          if (submissionSiteId.startsWith('local-')) {
            debugPrint(
                '[Sync] ⏭️ Skipping submission ${submission.id}: site ID still '
                'unresolved ($submissionSiteId). Will retry on next sync.');
            Sentry.addBreadcrumb(Breadcrumb(
              message: 'Skipped submission — unresolved local site ID',
              category: 'sync',
              level: SentryLevel.warning,
              data: {
                'submission_id': submission.id,
                'local_site_id': submissionSiteId,
              },
            ));
            await DatabaseService.updateSubmissionStatus(
              submission.id,
              isUploading: false,
              error:
                  'Waiting for site to be created on server. Will retry automatically.',
            );
            failed++;
            continue;
          }

          // Step 4: Submit to API
          Sentry.addBreadcrumb(Breadcrumb(
            message: 'Step 4: Submitting visit to API',
            category: 'sync',
            level: SentryLevel.info,
            data: {'visit_id': visitData['id']},
          ));

          await _submitVisit(
            visitData: updatedVisitData,
            samples: updatedSamples,
            originalVisitId: originalVisitId?.toString(),
            success: () {
              debugPrint(
                  '[Sync] ✅ Successfully submitted visit: ${submission.id}');
              return SyncResult(
                  success: true, processedCount: 1, failedCount: 0);
            },
            errorInSubmitVisit: (apiError) {
              debugPrint(
                  '[Sync] ❌ API submission failed for ${submission.id}: $apiError');
              throw apiError as Object;
            },
          );

          // Step 5: Delete successful submission
          Sentry.addBreadcrumb(Breadcrumb(
            message: 'Step 5: Cleaning up local submission',
            category: 'sync',
            level: SentryLevel.info,
          ));

          await DatabaseService.deleteSubmission(submission.id);
          debugPrint('[Sync] 🗑️ Deleted submission: ${submission.id}');
          processed++;

          Sentry.addBreadcrumb(Breadcrumb(
            message: '✅ Submission ${submission.id} completed successfully',
            category: 'sync',
            level: SentryLevel.info,
          ));
        } catch (e, stackTrace) {
          // Capture error to Sentry with context
          await Sentry.captureException(
            e,
            stackTrace: stackTrace,
            withScope: (scope) {
              scope.setTag('sync_type', 'visit_submission');
              scope.setContexts('submission', {
                'id': submission.id,
                'visit_data': submission.data['visitData'],
              });
            },
          );

          final errorMessage = _describeSyncError(e);

          failedErrors.add(errorMessage);

          await DatabaseService.updateSubmissionStatus(
            submission.id,
            isUploading: false,
            error: errorMessage,
          );
          failed++;

          debugPrint('[Sync] ❌ Failed to process submission ${submission.id}');
          debugPrint('[Sync] Submission data for ID: ${submission.id}');
          debugPrint('[Sync] visitData: ${(submission.data['visitData'])}');
          debugPrint('[Sync] samples: ${(submission.data['samples'])}');
          debugPrint('[Sync] Error: $e');
        }
      }

      debugPrint(
          '[Sync] ✅ Sync complete. Success: $processed, Failed: $failed');

      // If any submissions failed, report error status
      if (failed > 0) {
        lastError = failedErrors.isNotEmpty
            ? failedErrors.join('; ')
            : '$failed submission(s) failed to sync';
        if (!_syncController.isClosed) _syncController.add(SyncStatus.error);
        return SyncResult(
          success: false,
          error: lastError,
          processedCount: processed,
          failedCount: failed,
        );
      }

      lastError = null;
      // Only report completed if there were actual changes synced and no failures
      if (!_syncController.isClosed) {
        if (processed > 0 || queueSynced > 0) {
          _syncController.add(SyncStatus.completed);
        } else {
          _syncController.add(SyncStatus.idle);
        }
      }
      return SyncResult(
        success: true,
        processedCount: processed,
        failedCount: failed,
      );
    } catch (e, stackTrace) {
      // Capture global sync error to Sentry
      await Sentry.captureException(
        e,
        stackTrace: stackTrace,
        withScope: (scope) {
          scope.setTag('sync_type', 'global_sync_error');
        },
      );

      debugPrint('[Sync] ❌ Global sync error: $e');
      lastError = _describeSyncError(e);
      if (!_syncController.isClosed) _syncController.add(SyncStatus.error);
      return SyncResult(
        success: false,
        error: lastError,
        processedCount: 0,
        failedCount: 0,
      );
    }
  }

  // Future<SyncResult> sync() async {
  //   if (_isSyncing) {
  //     return SyncResult(
  //       success: false,
  //       error: 'Sync already in progress',
  //       processedCount: 0,
  //       failedCount: 0,
  //     );
  //   }

  //   _isSyncing = true;
  //   _syncController.add(SyncStatus.syncing);

  //   try {
  //     final submissions = DatabaseService.getSubmissionsToUpload();
  //     int processed = 0;
  //     int failed = 0;

  //     for (final submission in submissions) {
  //       try {
  //         await DatabaseService.updateSubmissionStatus(
  //           submission.id,
  //           isUploading: true,
  //         );

  //         // 1. Collect all unique photo paths from visitData and samples
  //         final visitData =
  //             Map<String, dynamic>.from(submission.data['visitData'] as Map);
  //         final samples = (submission.data['samples'] as List)
  //             .map((e) => Map<String, dynamic>.from(e as Map))
  //             .toList();
  //         final visitPhotoPaths =
  //             (visitData['photos'] as List?)?.cast<String>() ?? [];
  //         final samplePhotoPaths = samples
  //             .expand(
  //                 (sample) => (sample['photos'] as List?)?.cast<String>() ?? [])
  //             .toList();
  //         final allPhotoPaths =
  //             <String>{...visitPhotoPaths, ...samplePhotoPaths}.toList();

  //         // 2. Upload photos with persistent mapping
  //         final photoResults =
  //             await _photoManager.uploadPhotosWithMapping(allPhotoPaths);

  //         // 3. Check if any photo uploads failed
  //         final failedPhotos =
  //             photoResults.where((r) => r.error != null).toList();
  //         if (failedPhotos.isNotEmpty) {
  //           throw Exception(
  //             'Failed to upload photos: ${failedPhotos.map((p) => p.error).join(", ")}',
  //           );
  //         }

  //         // 4. Create photo mapping
  //         final photoMapping = Map<String, String>.fromEntries(
  //           photoResults.map((r) => MapEntry(r.localPath, r.s3Url!)),
  //         );

  //         // 5. Update submission data with S3 URLs
  //         final updatedVisitData =
  //             _updatePhotosInVisitData(visitData, photoMapping);
  //         final updatedSamples = _updatePhotosInSamples(samples, photoMapping);

  //         // 6. Submit to API
  //         await _submitVisit(
  //           visitData: updatedVisitData,
  //           samples: updatedSamples,
  //           success: () {
  //             return SyncResult(
  //               success: true,
  //               error: 'Sync success',
  //               processedCount: 0,
  //               failedCount: 0,
  //             );
  //           },
  //           errorInSubmitVisit: (error) {
  //             return SyncResult(
  //               success: false,
  //               error: 'Sync failed',
  //               processedCount: 0,
  //               failedCount: 0,
  //             );
  //           },
  //         );

  //         // 7. Delete successful submission
  //         await DatabaseService.deleteSubmission(submission.id);
  //         processed++;
  //       } catch (e) {
  //         await DatabaseService.updateSubmissionStatus(
  //           submission.id,
  //           isUploading: false,
  //           error: e.toString(),
  //         );
  //         failed++;
  //         debugPrint('Error processing submission ${submission.id}: $e');
  //       }
  //     }

  //     _syncController.add(SyncStatus.completed);
  //     return SyncResult(
  //       success: true,
  //       processedCount: processed,
  //       failedCount: failed,
  //     );
  //   } catch (e) {
  //     debugPrint('Sync error: $e');
  //     _syncController.add(SyncStatus.error);
  //     return SyncResult(
  //       success: false,
  //       error: e.toString(),
  //       processedCount: 0,
  //       failedCount: 0,
  //     );
  //   } finally {
  //     _isSyncing = false;
  //   }
  // }

  Map<String, dynamic> _updatePhotosInVisitData(
    Map<String, dynamic> visitData,
    Map<String, String> photoMapping,
  ) {
    final updatedData = Map<String, dynamic>.from(visitData);
    if (updatedData['photos'] != null) {
      updatedData['photos'] = (updatedData['photos'] as List)
          .map((path) => photoMapping[path] ?? path)
          .toList();
    }
    return updatedData;
  }

  List<Map<String, dynamic>> _updatePhotosInSamples(
    List<Map<String, dynamic>> samples,
    Map<String, String> photoMapping,
  ) {
    return samples.map((sample) {
      final updatedSample = Map<String, dynamic>.from(sample);
      if (updatedSample['photos'] != null) {
        updatedSample['photos'] = (updatedSample['photos'] as List)
            .map((path) => photoMapping[path] ?? path)
            .toList();
      }
      return updatedSample;
    }).toList();
  }

  /// Turns a thrown sync error into something worth showing a field user.
  ///
  /// For a failed request that means the server's own message ("Barcodes
  /// already exist in database…"), not Dio's generic "the response has a status
  /// code of 400" boilerplate — which says nothing about what actually went
  /// wrong and is what reaches the home-screen snackbar otherwise.
  ///
  /// Must use `is DioException` rather than inspecting `runtimeType.toString()`:
  /// `flutter build web --release` runs dart2js with minification, so the
  /// runtime type name is mangled and a string comparison silently never
  /// matches — the exact reason the raw boilerplate was surfacing on web.
  static String _describeSyncError(Object error) {
    if (error is DioException) {
      final data = error.response?.data;
      if (data is Map && data['message'] != null) {
        final message = data['message'];
        return message is List ? message.join(', ') : message.toString();
      }
    }

    // Strip "Exception: " prefixes (can nest) from plain thrown Exceptions.
    var text = error.toString();
    while (text.startsWith('Exception: ')) {
      text = text.substring('Exception: '.length);
    }
    return text;
  }

  Future<void> _submitVisit({
    required Map<String, dynamic> visitData,
    required List<Map<String, dynamic>> samples,
    String? originalVisitId,
    required SyncResult Function() success,
    required SyncResult Function(dynamic error) errorInSubmitVisit,
  }) async {
    try {
      debugPrint(
          '[_submitVisit] ➡️ Starting submit for visitId=${visitData['id']}, originalVisitId=$originalVisitId');
      // Validate required fields. Submit against the project this visit was
      // actually captured under (visitData['projectId']) — not `_projectId`,
      // which is only whatever project the UI currently has selected and may
      // be a different one entirely (see PendingVisitSubmission.projectId).
      // Fall back to `_projectId` only for the genuinely legacy case where
      // the payload itself has no projectId at all (rows written before
      // visitData carried one) — for a single-project user at the time of
      // capture, the currently selected project is the only project such a
      // row could have belonged to.
      final rawProjectId = visitData['projectId']?.toString();
      final String? projectId = (rawProjectId != null && rawProjectId.isNotEmpty)
          ? rawProjectId
          : _projectId;
      final String? visitId = visitData['id']?.toString();
      debugPrint('[_submitVisit] projectId: $projectId');
      debugPrint('[_submitVisit] visitId: $visitId');

      if (projectId == null || projectId.isEmpty) {
        throw Exception('Project ID is required');
      }
      if (visitId == null || visitId.isEmpty) {
        throw Exception('Visit ID is required');
      }

      debugPrint(
          '[_submitVisit] 📤 Calling projectsControllerSubmitVisit API...');
      final submitDto = _createSubmitVisitDto(visitData, samples);
      debugPrint(
          '[_submitVisit] 📦 DTO created with ${samples.length} samples');

      final response =
          await _client.getProjectsApi().projectsControllerSubmitVisit(
                projectId: projectId,
                visitId: visitId,
                submitVisitDto: submitDto,
              );

      debugPrint('[_submitVisit] 📥 API response received');
      debugPrint('[_submitVisit] Response statusCode: ${response.statusCode}');
      debugPrint('[_submitVisit] Response data: ${response.data}');
      debugPrint(
          '[_submitVisit] Response data.success: ${response.data?.success}');
      debugPrint(
          '[_submitVisit] Response data.message: ${response.data?.message}');

      if (response.data?.success != true) {
        debugPrint(
            '[_submitVisit] ❌ response.data?.success is NOT true — throwing exception');
        throw Exception(response.data?.message ?? 'Failed to submit visit');
      }

      debugPrint(
          '[_submitVisit] ✅ API call succeeded — proceeding to Hive cleanup');

      // Clean up local Hive data after successful sync.
      // Delete using BOTH original visit ID (e.g., local-xxx) and resolved visit ID
      // (server ID) to handle all cases.
      try {
        final completedVisitsBox = Hive.isBoxOpen('completedVisits')
            ? Hive.box('completedVisits')
            : await Hive.openBox('completedVisits');

        final visitsBox = Hive.isBoxOpen('visits')
            ? Hive.box('visits')
            : await Hive.openBox('visits');

        // Delete using original visit ID (for offline-created visits)
        if (originalVisitId != null &&
            completedVisitsBox.containsKey(originalVisitId)) {
          await completedVisitsBox.delete(originalVisitId);
          debugPrint(
              '[Sync] Removed visit $originalVisitId (original) from completedVisits Hive box');
        }

        // Also delete from visits box (for offline-created visits that were completed)
        if (originalVisitId != null && visitsBox.containsKey(originalVisitId)) {
          await visitsBox.delete(originalVisitId);
          debugPrint(
              '[Sync] Removed visit $originalVisitId (original) from visits Hive box');
        }

        // Also delete using resolved visit ID (for server-scheduled visits)
        if (visitId != originalVisitId &&
            completedVisitsBox.containsKey(visitId)) {
          await completedVisitsBox.delete(visitId);
          debugPrint(
              '[Sync] Removed visit $visitId (resolved) from completedVisits Hive box');
        }

        // Also delete from visits box using resolved ID
        if (visitId != originalVisitId && visitsBox.containsKey(visitId)) {
          await visitsBox.delete(visitId);
          debugPrint(
              '[Sync] Removed visit $visitId (resolved) from visits Hive box');
        }

        // NOW safe to remove the visitIdMap entry — the submission succeeded,
        // so we no longer need the local-to-server ID mapping.
        if (originalVisitId != null && originalVisitId.startsWith('local-')) {
          final visitIdMapBox = Hive.isBoxOpen('visitIdMap')
              ? Hive.box('visitIdMap')
              : await Hive.openBox('visitIdMap');
          await visitIdMapBox.delete(originalVisitId);
          debugPrint('[Sync] Cleaned up visitIdMap entry for $originalVisitId');
        }
      } catch (e) {
        debugPrint('[Sync] Error cleaning up Hive boxes: $e');
      }

      // Invalidate queries to refresh UI with fresh data from API. Uses this
      // visit's own projectId (resolved above), not `_projectId` — if a
      // background flush just submitted a visit for a project the UI isn't
      // currently showing, invalidating the *selected* project's cache here
      // would be a silent no-op for the project that actually changed.
      // (`projectId` is already known non-null here — the guard above throws
      // otherwise — so only `_queryClient` needs checking.)
      if (_queryClient != null) {
        try {
          _queryClient.invalidateQueries(
            QueryKeys.scheduledVisits(
              projectId,
              assignedTo: true,
              status: 'upcoming',
            ),
          );
          _queryClient.invalidateQueries(
            QueryKeys.completedVisits(projectId),
          );
          _queryClient.invalidateQueries(
            QueryKeys.visitSummary(null, null),
          );
          debugPrint(
              '[Sync] Invalidated queries after successful sync for visit $visitId');
        } catch (e) {
          debugPrint('[Sync] Error invalidating queries: $e');
        }
      }

      success();
    } catch (e) {
      debugPrint('Error in _submitVisit: $e');
      errorInSubmitVisit(e);
      rethrow;
    }
  }

  SubmitVisitDto _createSubmitVisitDto(
    Map<String, dynamic> visitData,
    List<Map<String, dynamic>> samples,
  ) {
    // Create the visit data builder
    final visitDataBuilder = UpdateVisitOnSubmitDtoBuilder()
      ..visitStatus = VisitStatus.completed
      ..siteId = visitData['siteId']
      ..projectId = visitData['projectId']
      ..teamId = visitData['teamId']
      ..visitedBy = visitData['visitedBy']
      ..photos = ListBuilder<String>(
          (visitData['photos'] as List?)?.cast<String>() ?? <String>[])
      ..comment = visitData['comment']
      ..latitude = visitData['latitude'] is num
          ? visitData['latitude'] as num
          : (visitData['latitude'] != null
              ? num.tryParse(visitData['latitude'].toString())
              : null)
      ..longitude = visitData['longitude'] is num
          ? visitData['longitude'] as num
          : (visitData['longitude'] != null
              ? num.tryParse(visitData['longitude'].toString())
              : null)
      ..isCompleted = true
      ..visitStartedAt = visitData['visitStartedAt'] != null
          ? DateTime.parse(visitData['visitStartedAt'] as String)
          : null;

    // Handle suspect disease data
    if (visitData['suspectDiseaseData'] != null) {
      //final suspectDiseaseData = (visitData['suspectDiseaseData'] as List);
      // .map((disease) => jsonEncode(disease))
      // .toList();
      visitDataBuilder.suspectDiseaseData =
          ListBuilder<String>(visitData['suspectDiseaseData']);
    }
    if (visitData['diseaseQuestionnaireData'] != null) {
      visitDataBuilder.diseaseQuestionnaireData =
          JsonObject(visitData['diseaseQuestionnaireData']);
    }

    // Create sample builders with proper disease data formatting
    final sampleBuilders = samples.map((sample) {
      final diseases = (sample['diseases'] as List?);
      final details = sample['details'] != null ? Map<String, dynamic>.from(sample['details'] as Map) : <String, dynamic>{};
      final animalMeta = details['animalMetadata'] != null
          ? Map<String, dynamic>.from(details['animalMetadata'] as Map)
          : details;
      final speciesId = animalMeta['species'] ?? animalMeta['species_AI'];

      return CreateSampleOnVisitDtoBuilder()
        ..replicates = sample['replicates'] == 'available'
            ? CreateSampleOnVisitDtoReplicatesEnum.available
            : CreateSampleOnVisitDtoReplicatesEnum.notCollected
        ..photos = ListBuilder<String>(
            (sample['photos'] as List?)?.cast<String>() ?? <String>[])
        ..diseases = ListBuilder<JsonObject>(
            diseases?.map((d) => JsonObject(d)).toList() ?? [])
        ..quantity = sample['quantity'] is num
            ? sample['quantity'] as num
            : (sample['quantity'] != null
                ? num.tryParse(sample['quantity'].toString())
                : null)
        ..unit = sample['unit']?.toString()
        ..originalSampleBarcode = sample['originalSampleBarcode']?.toString()
        ..barcode = sample['barcode']?.toString()
        ..comment = sample['comment']?.toString()
        ..sampleType = JsonObject(sample['sampleType'])
        ..collectedBy = JsonObject(sample['collectedBy']?.toString() ?? '')
        ..species = speciesId != null ? JsonObject(speciesId.toString()) : null
        ..details =
            sample['details'] != null ? JsonObject(sample['details']) : null;
    });

    // Create the final DTO
    final submitVisitDto = (SubmitVisitDtoBuilder()
          ..visitData = visitDataBuilder
          ..samples = ListBuilder<CreateSampleOnVisitDto>(
              sampleBuilders.map((b) => b.build()).toList()))
        .build();
    print('submitVisitDto: $submitVisitDto');
    return submitVisitDto;
  }

  void dispose() {
    stopAutoSync();
    _syncController.close();
  }
}
