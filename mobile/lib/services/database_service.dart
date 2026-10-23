import 'package:es_client/es_client.dart';
import 'package:es_platform_mobile/views/samplecollection/models/sample_data.dart';
import 'package:flutter/foundation.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:path_provider/path_provider.dart';
import 'package:es_platform_mobile/services/visit_draft_repository.dart';

import '../models/pending_submission.dart';

class DatabaseService {
  static const String pendingSubmissionsBox = 'pendingSubmissions';
  static const String photoUploadMappingsBox = 'photoUploadMappings';

  // hive boxes for offline - first approach
  static const String siteDataBox = 'sites';
  static const String siteDto = 'siteDto';
  static const String visitDataBox = 'visits';
  static const String sampleDataBox = 'samples';
  static const String completedVisitsBox = 'completedVisits';
  static const String cachedNearbySites = 'cachedNearbySites';

  static const String boxStateList = 'state_list';
  static const String boxDistrictList = 'district_list';
  static const String collectors = 'collectors';
  static const String boxSiteDetails = 'site-details';
  static const String queueBox = 'syncQueue';
  static const String visitIdMapBox = 'visitIdMap';
  static const String appBox = 'app';

  static bool _initialized = false;

  /// Initialize Hive and register adapters
  static Future<void> initialize() async {
    if (_initialized) return;

    if (kIsWeb) {
      // For web, initialize without a custom path
      await Hive.initFlutter();
    } else {
      // For mobile platforms, use the app documents directory
      final appDocDir = await getApplicationDocumentsDirectory();
      await Hive.initFlutter(appDocDir.path);
    }

    // Register adapters
    if (!Hive.isAdapterRegistered(0)) {
      // 0 is the typeId we defined in PendingVisitSubmission
      Hive.registerAdapter(PendingVisitSubmissionAdapter());
    }

    // Open boxes safely
    await _safeOpenBox<PendingVisitSubmission>(pendingSubmissionsBox);
    await _safeOpenBox<String>(photoUploadMappingsBox);

    await _safeOpenBox(visitDataBox);
    await _safeOpenBox(sampleDataBox);
    await _safeOpenBox(completedVisitsBox);
    await _safeOpenBox(appBox);

    await _safeOpenBox(boxStateList);
    await _safeOpenBox(boxDistrictList);
    await _safeOpenBox(collectors);
    await _safeOpenBox(boxSiteDetails);
    await _safeOpenBox<Map>('offlineVisits');
    await _safeOpenBox<String>('visitDrafts');

    // Asynchronously cleanup expired drafts (>7 days old) in background
    VisitDraftRepository.cleanExpiredDrafts();

    _initialized = true;
  }

  /// Safely open a Hive box. If it fails (e.g. corruption), delete and retry.
  static Future<Box<E>> _safeOpenBox<E>(String name) async {
    try {
      return await Hive.openBox<E>(name);
    } catch (e) {
      print("[DatabaseService] Error opening box '$name': $e. Deleting and retrying...");
      try {
        await Hive.deleteBoxFromDisk(name);
        return await Hive.openBox<E>(name);
      } catch (e2) {
        print("[DatabaseService] CRITICAL: Failed to recover box '$name': $e2");
        rethrow;
      }
    }
  }

  static String generateLocalId() {
    return 'local-${DateTime.now().millisecondsSinceEpoch}';
  }

  /// Get the box for pending submissions
  static Box<PendingVisitSubmission> get pendingSubmissions {
    if (!_initialized) {
      throw StateError('DatabaseService must be initialized before use');
    }
    return Hive.box<PendingVisitSubmission>(pendingSubmissionsBox);
  }

  /// Get the box for photo upload mappings
  static Box<String> get photoUploadMappings {
    if (!_initialized) {
      throw StateError('DatabaseService must be initialized before use');
    }
    return Hive.box<String>(photoUploadMappingsBox);
  }

  static Future<void> saveStates(List<RegionResponseData> states) async {
    print("[Hive] Saving ${states.length} states...");
    final serialized = states
        .map((e) =>
            standardSerializers.serializeWith(RegionResponseData.serializer, e))
        .toList();
    await Hive.box(boxStateList).put('all', serialized);
  }

  static Future<List<RegionResponseData>> getStatesFromCache() async {
    final box = Hive.box(boxStateList);
    final jsonList = box.get('all') as List?;
    print("[Hive] Retrieved ${jsonList?.length ?? 0} cached states.");
    if (jsonList == null || jsonList.isEmpty) return [];

    return jsonList
        .map((json) => standardSerializers.deserializeWith(
            RegionResponseData.serializer, json))
        .whereType<RegionResponseData>()
        .toList();
  }

  static Future<void> saveDistricts(
      String stateId, List<RegionResponseData> districts) async {
    final box = Hive.box(boxDistrictList);
    final serialized = districts
        .map((e) =>
            standardSerializers.serializeWith(RegionResponseData.serializer, e))
        .toList();
    await box.put(stateId, serialized);
  }

  static Future<List<RegionResponseData>> getDistrictsFromCache(
      String stateId) async {
    final box = Hive.box(boxDistrictList);
    final jsonList = box.get(stateId) as List?;
    if (jsonList == null || jsonList.isEmpty) return [];

    return jsonList
        .map((json) => standardSerializers.deserializeWith(
            RegionResponseData.serializer, json))
        .whereType<RegionResponseData>()
        .toList();
  }

  static Future<void> saveCollectors(
      String projectId, List<User> collectors) async {
    final box = Hive.box('collectors');
    final serialized = collectors
        .map((e) =>
            standardSerializers.serializeWith(User.serializer, e))
        .toList();
    await box.put(projectId, serialized);
  }

  static Future<List<User>> getCollectorsFromCache(
      String projectId) async {
    final box = Hive.box('collectors');
    final jsonList = box.get(projectId) as List?;
    if (jsonList == null || jsonList.isEmpty) return [];

    return jsonList
        .map((json) => standardSerializers.deserializeWith(
            User.serializer, json))
        .whereType<User>()
        .toList();
  }

  static Future<bool> areDistrictsCached(String stateId) async {
    final box = Hive.box(boxDistrictList);
    return box.containsKey(stateId);
  }

  static Future<void> saveSiteDetails(
      String siteId, Map<String, dynamic> siteData) async {
    final box = Hive.box(boxSiteDetails);
    await box.put(siteId, siteData);
  }

  static Future<Map<String, dynamic>?> getSiteDetailsFromCache(
      String siteId) async {
    final box = Hive.box(boxSiteDetails);
    final data = box.get(siteId);
    return data is Map<String, dynamic> ? data : null;
  }

  static bool isSiteCached(String siteId) {
    final box = Hive.box(boxSiteDetails);
    return box.containsKey(siteId);
  }

  static Future<void> clearSiteDetailsCache() async {
    final box = Hive.box(boxSiteDetails);
    await box.clear();
  }

  static Box get siteData {
    _checkInitialized();
    return Hive.box(siteDataBox);
  }

  static Future<void> saveSiteOffline(Map<String, dynamic> siteDataMap) async {
    final box = siteData;
    final localSiteId = siteDataMap['localId'] ?? generateLocalId();
    await box.put(localSiteId, siteDataMap);
  }

  static Box<VisitResponseData> get visitData {
    _checkInitialized();
    return Hive.box<VisitResponseData>(visitDataBox);
  }

  static Box<SampleData> get sampleData {
    _checkInitialized();
    return Hive.box<SampleData>(sampleDataBox);
  }

  static void _checkInitialized() {
    if (!_initialized) {
      throw StateError('DatabaseService must be initialized before use');
    }
  }

  /// Get S3 URL for a local photo path, or null if not uploaded
  static String? getS3UrlForPhoto(String localPath) {
    return photoUploadMappings.get(localPath);
  }

  /// Save S3 URL for a local photo path
  static Future<void> savePhotoS3Url(String localPath, String s3Url) async {
    await photoUploadMappings.put(localPath, s3Url);
  }

  /// Remove a photo mapping (optional, for cleanup)
  static Future<void> removePhotoMapping(String localPath) async {
    await photoUploadMappings.delete(localPath);
  }

  /// Save a new pending submission
  static Future<void> savePendingSubmission(
      PendingVisitSubmission submission) async {
    await pendingSubmissions.put(submission.id, submission);
  }

  /// Get all pending submissions
  static List<PendingVisitSubmission> getAllPendingSubmissions() {
    return pendingSubmissions.values.toList();
  }

  /// Get submissions that need to be uploaded (not currently uploading and no error)
  static List<PendingVisitSubmission> getSubmissionsToUpload() {
    return pendingSubmissions.values
        // ignore: unnecessary_null_comparison
        .where((sub) => sub != null)
        .cast<PendingVisitSubmission>()
        .toList();
  }

  /// Update submission status
  static Future<void> updateSubmissionStatus(
    String id, {
    bool? isUploading,
    String? error,
  }) async {
    final submission = pendingSubmissions.get(id);
    if (submission != null) {
      final updated = submission.copyWith(
        isUploading: isUploading,
        error: error,
      );
      await pendingSubmissions.put(id, updated);
    }
  }

  /// Delete a submission
  static Future<void> deleteSubmission(String id) async {
    await pendingSubmissions.delete(id);
  }

  /// Clear all submissions
  static Future<void> clearAllSubmissions() async {
    await pendingSubmissions.clear();
  }

  /// Key used to bucket pending submissions whose project could not be
  /// resolved at all (no `projectId` field and no `visitData.projectId` to
  /// fall back on — practically unreachable now that
  /// [PendingVisitSubmission] derives the field from its own payload, but
  /// kept so a malformed row is still counted and visible instead of
  /// silently vanishing from the map).
  static const String unassignedProjectKey = '';

  /// Pending submission count grouped by the project each row is tagged to
  /// (`PendingVisitSubmission.projectId`), so a project picker can show a
  /// "you have N unsynced visits here" badge instead of that data being
  /// invisible once a project other than the one it was captured in is
  /// selected. Rows with no resolvable project are counted under
  /// [unassignedProjectKey] rather than dropped.
  static Map<String, int> pendingCountByProject() {
    final counts = <String, int>{};
    for (final submission in pendingSubmissions.values) {
      final key = submission.projectId ?? unassignedProjectKey;
      counts[key] = (counts[key] ?? 0) + 1;
    }
    return counts;
  }
}
