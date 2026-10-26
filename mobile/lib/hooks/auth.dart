// ignore_for_file: unused_local_variable

import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:math';

import 'package:built_collection/built_collection.dart';
import 'package:dartx/dartx.dart';
import 'package:dio/dio.dart';
import 'package:es_client/es_client.dart';
import 'package:es_platform_mobile/models/nearby_site_model.dart';
import 'package:es_platform_mobile/models/pending_submission.dart';
import 'package:es_platform_mobile/models/site_extensions.dart';
import 'package:es_platform_mobile/services/database_service.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:fquery/fquery.dart';
import 'package:hive/hive.dart';
import 'package:hive_flutter/hive_flutter.dart';

import '../services/tenant_selection_service.dart';
import '../utils/api_cache.dart';
import '../utils/visit_selection.dart';
import 'api.dart';
import 'package:es_platform_mobile/services/sync_service.dart';
import 'package:es_platform_mobile/services/photo_upload_manager.dart';

/// Fetcher
// Future<Response<dynamic>> toFix(Future<Response<dynamic>> future) async {
//   try {
//     return await future;
//   } catch (e) {
//     if (e is DioException) {
//       final data = e.response?.data;
//       return Response(requestOptions: e.requestOptions, data: data);
//     }
//     throw e;
//   }
// }

/// Thrown by [getProject] when the current project cannot be resolved: the
/// user has zero projects, or more than one with no persisted selection.
///
/// This is NOT a network/server error — it's a legitimate state meaning "the
/// picker needs to be shown." Callers that want to distinguish it from a
/// genuine fetch failure can check `error is NoProjectSelectedException` on
/// the relevant `UseQueryResult`.
class NoProjectSelectedException implements Exception {
  const NoProjectSelectedException();
  @override
  String toString() =>
      'No project selected: the user has zero or multiple projects with no '
      'persisted selection';
}

ProjectResponseDataExtended? _findProjectById(
  List<ProjectResponseDataExtended> projects,
  String id,
) {
  for (final project in projects) {
    if (project.id == id) return project;
  }
  return null;
}

/// Pages through `GET /projects` until every project has been fetched.
///
/// The endpoint defaults to 10 per page. Taking only the first page hid
/// projects from the picker, and made [_resolveCurrentProject] clear a
/// persisted selection that happened to fall past it, as if the user had
/// been removed from that project.
///
/// Calls Dio directly because the generated `projectsControllerFindAll`
/// doesn't accept `page`/`limit`. Only `data` and `total` are read: the
/// backend echoes `page`/`limit` back as the query-string values, which the
/// generated `PaginatedProjectResponse` (typed `num`) can't deserialize.
Future<List<ProjectResponseDataExtended>> _fetchAllProjectPages(
  EsClient client,
) async {
  const pageSize = 100;
  const maxPages = 50; // guard against a server that never reports the end
  final projects = <ProjectResponseDataExtended>[];

  for (var page = 1; page <= maxPages; page++) {
    final response = await client.dio.get<Map<String, dynamic>>(
      '/projects',
      queryParameters: {'page': page, 'limit': pageSize},
    );
    final body = response.data ?? const <String, dynamic>{};
    final items = (body['data'] as List?) ?? const [];
    projects.addAll(items
        .map((e) => standardSerializers.deserializeWith(
            ProjectResponseDataExtended.serializer, e))
        .whereType<ProjectResponseDataExtended>());

    final total = (body['total'] as num?)?.toInt() ?? 0;
    if (items.length < pageSize || projects.length >= total) break;
  }

  return projects;
}

/// Fetches every project the user belongs to, across every workspace.
///
/// Cached under a user-namespaced key (`available_projects_<userId>`)
/// instead of the old flat `'project_extended'` key, which had no user in it
/// at all — meaning one user's project data could survive logout and be
/// served to the next person on a shared device. `logout()` also clears the
/// whole `ApiCache` box outright as a second layer, but namespacing means
/// even a partially-failed clear can't cross-contaminate.
Future<List<ProjectResponseDataExtended>> getAvailableProjects(
  EsClient client, {
  required String? userId,
  bool forceRefresh = false,
}) async {
  final cacheKey = 'available_projects_${userId ?? 'anonymous'}';

  // 1. Try to load from cache
  List<ProjectResponseDataExtended>? cached;
  if (!forceRefresh) {
    try {
      cached = await ApiCache.get<List<ProjectResponseDataExtended>>(
        cacheKey,
        (json) => (json as List)
            .map((e) => standardSerializers.deserializeWith(
                ProjectResponseDataExtended.serializer, e))
            .whereType<ProjectResponseDataExtended>()
            .toList(),
      );
    } catch (e) {
      print('[getAvailableProjects] Cache load failed: $e');
    }
  }

  // 2. Define network fetch
  Future<List<ProjectResponseDataExtended>> fetchFromNetwork() async {
    final data = await _fetchAllProjectPages(client);
    final serialized = data
        .map((e) => standardSerializers.serializeWith(
            ProjectResponseDataExtended.serializer, e))
        .toList();
    await ApiCache.set(cacheKey, serialized);
    return data;
  }

  // 3. Return cached if available, and fetch in background
  if (cached != null) {
    unawaited(fetchFromNetwork().catchError((e) {
      print('[getAvailableProjects] Background fetch failed: $e');
      return cached!;
    }));
    return cached;
  }

  // 4. If no cache, fetch from network
  return await fetchFromNetwork();
}

/// Resolves the "current" project from the full list the server actually
/// returned: persisted selection → validated against [projects] → else, if
/// the user has exactly one project, auto-select and persist it → else throw
/// [NoProjectSelectedException] (meaning "show the picker").
///
/// The validation step is the security-relevant part: if the persisted id no
/// longer appears in [projects] — the user was removed from that project, or
/// this is stale data left behind by a previous account on a shared device —
/// it must NOT keep scoping queries. It's cleared here so the caller falls
/// through to auto-select or the picker rather than silently keeping the
/// stale id.
Future<ProjectResponseDataExtended> _resolveCurrentProject(
  List<ProjectResponseDataExtended> projects,
) async {
  final selectedId = await TenantSelectionService.getSelectedProjectId();
  if (selectedId != null) {
    final match = _findProjectById(projects, selectedId);
    if (match != null) return match;
    await TenantSelectionService.clear();
  }

  if (projects.length == 1) {
    final only = projects.first;
    await TenantSelectionService.select(projectId: only.id);
    return only;
  }

  throw const NoProjectSelectedException();
}

Future<ProjectResponseDataExtended> getProject(
  EsClient client, {
  required String? userId,
  bool forceRefresh = false,
}) async {
  final projects = await getAvailableProjects(
    client,
    userId: userId,
    forceRefresh: forceRefresh,
  );
  return _resolveCurrentProject(projects);
}

// Future<List<SiteResponseData>> getSites(
//   EsClient client,
//   String projectId,
// ) async {
//   try {
//     final response = await client
//         .getProjectsApi()
//         .projectsControllerFindSites(projectId: projectId);
//     final data = response.data?.data.toList() ?? [];
//     // Serialize using built_value
//     final serialized = data
//         .map((e) =>
//             standardSerializers.serializeWith(SiteResponseData.serializer, e))
//         .toList();
//     await ApiCache.set('sites_$projectId', serialized);
//     return data;
//   } catch (e) {
//     // On error (e.g., offline), try to load from cache
//     final cached = await ApiCache.get<List<SiteResponseData>>(
//       'sites_$projectId',
//       (json) => (json as List)
//           .map((e) => standardSerializers.deserializeWith(
//               SiteResponseData.serializer, e))
//           .whereType<SiteResponseData>()
//           .toList(),
//     );
//     return cached ?? [];
//   }
// }

Future<List<SiteResponseData>> loadSavedSites(String projectId) async {
  final cacheKey = 'sites_$projectId';

  // 1. Load local Hive sites
  Future<List<SiteResponseData>> loadLocalSites() async {
    final box = Hive.isBoxOpen('sites')
        ? Hive.box('sites')
        : await Hive.openBox('sites');

    return box.values
        .map((e) {
          try {
            // Round-trip through JSON to normalize _Map<dynamic,dynamic>
            // that Hive binary encoding produces for nested maps.
            final normalized = jsonDecode(jsonEncode(e));
            return standardSerializers.deserializeWith(
              SiteResponseData.serializer,
              normalized,
            );
          } catch (_) {
            return null;
          }
        })
        .whereType<SiteResponseData>()
        .where((s) => s.id.startsWith('local-'))
        .toList();
  }

  // 2. Load cached API data
  Future<List<SiteResponseData>?> loadCachedSites() async {
    try {
      return await ApiCache.get<List<SiteResponseData>>(
        cacheKey,
        (json) => (json as List)
            .map((e) => standardSerializers.deserializeWith(
                  SiteResponseData.serializer,
                  e,
                ))
            .whereType<SiteResponseData>()
            .toList(),
      );
    } catch (_) {
      return null;
    }
  }

  final cachedSites = await loadCachedSites() ?? [];
  final localSites = await loadLocalSites();
  return [...cachedSites, ...localSites];
}

Future<List<SiteResponseData>> getSites(
  EsClient client,
  String projectId,
) async {
  final cacheKey = 'sites_$projectId';

  // 1. Load local Hive sites (to merge with server data)
  Future<List<SiteResponseData>> loadLocalSites() async {
    final box = Hive.isBoxOpen('sites')
        ? Hive.box('sites')
        : await Hive.openBox('sites');

    return box.values
        .map((e) {
          try {
            // Round-trip through JSON to normalize _Map<dynamic,dynamic>
            // that Hive binary encoding produces for nested maps.
            final normalized = jsonDecode(jsonEncode(e));
            return standardSerializers.deserializeWith(
              SiteResponseData.serializer,
              normalized,
            );
          } catch (_) {
            return null;
          }
        })
        .whereType<SiteResponseData>()
        .where((s) => s.id.startsWith('local-'))
        .toList();
  }

  // 2. Fetch from server
  try {
    final response = await client
        .getProjectsApi()
        .projectsControllerFindSites(projectId: projectId);

    final serverSites = response.data?.data.toList() ?? [];

    // Save server data to cache
    final serialized = serverSites
        .map((e) => standardSerializers.serializeWith(
              SiteResponseData.serializer,
              e,
            ))
        .toList();
    await ApiCache.set(cacheKey, serialized);

    // Merge with local sites
    final localSites = await loadLocalSites();
    return [...serverSites, ...localSites];
  } catch (e) {
    // On error, return saved sites (offline mode)
    print('[getSites] Fetch failed, loading saved sites: $e');
    final saved = await loadSavedSites(projectId);
    if (saved.isNotEmpty) return saved;
    rethrow;
  }
}

// Future<List<VisitResponseData>> getScheduledVisits(
//   EsClient client,
//   String projectId,
//   bool assignedTo, {
//   DateTime? startDate,
//   DateTime? endDate,
//   required String status,
// }) async {
//   final cacheKey = 'scheduledVisits_${projectId}_${status}_${assignedTo}_'
//       '${startDate?.toIso8601String() ?? ''}_${endDate?.toIso8601String() ?? ''}';
//   try {
//     final response = await client.getProjectsApi().projectsControllerGetVisits(
//           projectId: projectId,
//           visitStatus: status,
//           startDate: startDate?.toIso8601String(),
//           endDate: endDate?.toIso8601String(),
//           assignedTo: assignedTo,
//         );
//     final data = response.data?.data.toList() ?? [];
//     final serialized = data
//         .map((e) =>
//             standardSerializers.serializeWith(VisitResponseData.serializer, e))
//         .toList();
//     await ApiCache.set(cacheKey, serialized);
//     return data;
//   } catch (e) {
//     final cached = await ApiCache.get<List<VisitResponseData>>(
//       cacheKey,
//       (json) => (json as List)
//           .map((e) => standardSerializers.deserializeWith(
//               VisitResponseData.serializer, e))
//           .whereType<VisitResponseData>()
//           .toList(),
//     );
//     return cached ?? [];
//   }
// }

List<VisitResponseData> _filterOutCompletedVisits(
  List<VisitResponseData> data,
  Set<String> completedVisitIds,
) {
  return data.where((v) => !completedVisitIds.contains(v.id)).toList();
}

List<VisitResponseData> _filterVisitsByAssignee(
  List<VisitResponseData> data,
  String? userId,
) {
  return data; // returning all visits

  // Filter visits
  // if (userId == null) return data;
  // return data.where((v) => v.collector?.id == userId).toList();
}

Future<List<VisitResponseData>> getScheduledVisits(
  EsClient client,
  String projectId,
  bool assignedTo, {
  DateTime? startDate,
  DateTime? endDate,
  required String status,
  QueryClient? queryClient,
  String? userId,
}) async {
  final cacheKey = 'scheduledVisits_${projectId}_${status}_${assignedTo}_'
      '${startDate?.toIso8601String() ?? ''}_${endDate?.toIso8601String() ?? ''}';

  // Get completed visit IDs from Hive to filter them out
  Set<String> completedVisitIds = {};
  try {
    final completedVisitsBox = Hive.isBoxOpen('completedVisits')
        ? Hive.box('completedVisits')
        : await Hive.openBox('completedVisits');
    completedVisitIds = completedVisitsBox.keys.cast<String>().toSet();
  } catch (e) {
    print("Failed to load completed visit IDs from Hive: $e");
  }

  // 1. Try to load from cache
  List<VisitResponseData>? cached;
  try {
    cached = await ApiCache.get<List<VisitResponseData>>(
      cacheKey,
      (json) => (json as List)
          .map((e) => standardSerializers.deserializeWith(
              VisitResponseData.serializer, e))
          .whereType<VisitResponseData>()
          .toList(),
    );
  } catch (e) {
    print("Failed to load cached scheduled visits: $e");
  }

  // 2. Define network fetch
  Future<List<VisitResponseData>> fetchFromNetwork() async {
    final response = await client.getProjectsApi().projectsControllerGetVisits(
          projectId: projectId,
          visitStatus: status,
          startDate: startDate?.toIso8601String(),
          endDate: endDate?.toIso8601String(),
          assignedTo: assignedTo,
        );
    final data = response.data?.data.toList() ?? [];
    final filtered = _filterOutCompletedVisits(data, completedVisitIds);
    final assignedVisits = _filterVisitsByAssignee(filtered, userId);
    final serialized = assignedVisits
        .map((e) =>
            standardSerializers.serializeWith(VisitResponseData.serializer, e))
        .toList();
    await ApiCache.set(cacheKey, serialized);
    return assignedVisits;
  }

  // 3. Return cached if available, and fetch in background
  if (cached != null && cached.isNotEmpty) {
    final filteredCached = _filterOutCompletedVisits(cached, completedVisitIds);

    unawaited(
      fetchFromNetwork().then((freshData) async {
        if (queryClient != null) {
          queryClient.setQueryData<List<VisitResponseData>>(
            QueryKeys.scheduledVisits(
              projectId,
              assignedTo: assignedTo,
              startDate: startDate,
              endDate: endDate,
              status: status,
            ),
            (_) => freshData,
          );
        }
      }).catchError((e) {
        print("Background refresh failed: $e");
      }),
    );

    return filteredCached;
  }

  // 4. If no cache, fetch from network
  return await fetchFromNetwork();
}

// Future<List<VisitResponseData>> getSiteVisits(
//   EsClient client,
//   String projectId,
//   String siteId,
// ) async {
//   final cacheKey = 'siteVisits_${projectId}_$siteId';
//   try {
//     final response = await client
//         .getProjectsApi()
//         .projectsControllerGetVisits(projectId: projectId, siteId: siteId);
//     final data = response.data?.data.toList() ?? [];
//     final serialized = data
//         .map((e) =>
//             standardSerializers.serializeWith(VisitResponseData.serializer, e))
//         .toList();
//     await ApiCache.set(cacheKey, serialized);
//     return data;
//   } catch (e) {
//     final cached = await ApiCache.get<List<VisitResponseData>>(
//       cacheKey,
//       (json) => (json as List)
//           .map((e) => standardSerializers.deserializeWith(
//               VisitResponseData.serializer, e))
//           .whereType<VisitResponseData>()
//           .toList(),
//     );
//     return cached ?? [];
//   }
// }

/// The ApiCache key [getSiteVisits] keeps a site's visits under.
String siteVisitsCacheKey(String projectId, String siteId) =>
    'siteVisits_${projectId}_$siteId';

Future<List<VisitResponseData>> getSiteVisits(
  EsClient client,
  String projectId,
  String siteId,
) async {
  final cacheKey = siteVisitsCacheKey(projectId, siteId);

  // 1. Try to load from cache
  List<VisitResponseData>? cached;
  try {
    cached = await ApiCache.get<List<VisitResponseData>>(
      cacheKey,
      (json) => (json as List)
          .map((e) => standardSerializers.deserializeWith(
              VisitResponseData.serializer, e))
          .whereType<VisitResponseData>()
          .toList(),
    );
  } catch (e) {
    print("Failed to load cached site visits: $e");
  }

  // 2. Define network fetch
  Future<List<VisitResponseData>> fetchFromNetwork() async {
    final response = await client
        .getProjectsApi()
        .projectsControllerGetVisits(projectId: projectId, siteId: siteId);
    final data = response.data?.data.toList() ?? [];
    final serialized = data
        .map((e) =>
            standardSerializers.serializeWith(VisitResponseData.serializer, e))
        .toList();
    await ApiCache.set(cacheKey, serialized);
    return data;
  }

  // 3. Return cached if available, and fetch in background
  if (cached != null && cached.isNotEmpty) {
    unawaited(fetchFromNetwork().catchError((e) {
      print("Background refresh failed: $e");
      return cached!;
    }));
    return cached;
  }

  // 4. If no cache, fetch from network
  return await fetchFromNetwork();
}

// Future<VisitSummaryResponseData> getVisitSummary(
//   EsClient client,
//   String projectId,
//   DateTime? startDate,
//   DateTime? endDate,
// ) async {
//   final cacheKey =
//       'visitSummary_${projectId}_${startDate?.toIso8601String() ?? ''}_${endDate?.toIso8601String() ?? ''}';
//   try {
//     print('[getVisitSummary] Fetching from API...');
//     final response =
//         await client.getProjectsApi().projectsControllerGetVisitSummary(
//               projectId: projectId,
//               startDate: startDate?.toIso8601String(),
//               endDate: endDate?.toIso8601String(),
//             );
//     final data = response.data!.data;
//     print('[getVisitSummary] API success, caching data: $data');
//     final serialized = standardSerializers.serializeWith(
//         VisitSummaryResponseData.serializer, data);
//     await ApiCache.set(cacheKey, serialized);
//     print('[getVisitSummary] Cached data saved');
//     return data;
//   } catch (e) {
//     print('[getVisitSummary] API failed: $e');
//     print('[getVisitSummary] Trying to load from cache with key: $cacheKey');
//     final cached = await ApiCache.get<VisitSummaryResponseData>(
//       cacheKey,
//       (json) {
//         final result = standardSerializers.deserializeWith(
//             VisitSummaryResponseData.serializer, json);
//         print('[getVisitSummary] Deserialized cached result: $result');
//         if (result == null) {
//           print('[getVisitSummary] No cached visit summary available');
//           throw Exception('No cached visit summary available');
//         }
//         return result;
//       },
//     );
//     if (cached != null) {
//       print('[getVisitSummary] Returning cached data: $cached');
//       return cached;
//     }
//     print('[getVisitSummary] No cached data found, throwing error');
//     throw Exception('No cached visit summary available');
//   }
// }
Future<VisitSummaryResponseData> getVisitSummary(
  EsClient client,
  String projectId,
  DateTime? startDate,
  DateTime? endDate,
) async {
  final cacheKey =
      'visitSummary_${projectId}_${startDate?.toIso8601String() ?? ''}_${endDate?.toIso8601String() ?? ''}';

  // 1. Try to load from cache
  VisitSummaryResponseData? cached;
  try {
    cached = await ApiCache.get<VisitSummaryResponseData>(
      cacheKey,
      (json) => standardSerializers.deserializeWith(
          VisitSummaryResponseData.serializer, json)!,
    );
  } catch (e) {
    print('[getVisitSummary] Cache load failed: $e');
  }

  // 2. Define network fetch
  Future<VisitSummaryResponseData> fetchFromNetwork() async {
    final safeStartDate = startDate?.toIso8601String();
    final safeEndDate = endDate?.toIso8601String();

    print('[getVisitSummary] Fetching from API with project ID: $projectId');
    final response =
        await client.getProjectsApi().projectsControllerGetVisitSummary(
              projectId: projectId,
              startDate: safeStartDate,
              endDate: safeEndDate,
            );
    final data = response.data?.data;
    if (data == null) {
      throw Exception("Visit summary API returned null data");
    }

    final serialized = standardSerializers.serializeWith(
        VisitSummaryResponseData.serializer, data);
    await ApiCache.set(cacheKey, serialized);
    return data;
  }

  // 3. Return cached if available, and fetch in background
  if (cached != null) {
    unawaited(fetchFromNetwork().catchError((e) {
      print('[getVisitSummary] Background fetch failed: $e');
      return cached!;
    }));
    return cached;
  }

  // 4. If no cache, fetch from network
  return await fetchFromNetwork();
}

Future<TeamProgressActivityOverviewResponseData>
    getTeamProgressActivityOverview(
  EsClient client,
  String teamId,
  String projectId,
  DateTime? startDate,
  DateTime? endDate,
) async {
  final cacheKey =
      'teamProgressActivityOverview_${projectId}_${teamId}_${startDate?.toIso8601String() ?? ''}_${endDate?.toIso8601String() ?? ''}';

  // 1. Try to load from cache
  TeamProgressActivityOverviewResponseData? cached;
  try {
    cached = await ApiCache.get<TeamProgressActivityOverviewResponseData>(
      cacheKey,
      (json) => standardSerializers.deserializeWith(
          TeamProgressActivityOverviewResponseData.serializer, json)!,
    );
  } catch (e) {
    print('[getTeamProgressActivityOverview] Cache load failed: $e');
  }

  // 2. Define network fetch
  Future<TeamProgressActivityOverviewResponseData> fetchFromNetwork() async {
    final response =
        await client.getProjectsApi().projectsControllerGetTeamActivityOverview(
              teamId: teamId,
              projectId: projectId,
              startDate: startDate?.toIso8601String(),
              endDate: endDate?.toIso8601String(),
            );
    final data = response.data!.data;
    final serialized = standardSerializers.serializeWith(
        TeamProgressActivityOverviewResponseData.serializer, data);
    await ApiCache.set(cacheKey, serialized);
    return data;
  }

  // 3. Return cached if available, and fetch in background
  if (cached != null) {
    unawaited(fetchFromNetwork().catchError((e) {
      print('[getTeamProgressActivityOverview] Background fetch failed: $e');
      return cached!;
    }));
    return cached;
  }

  // 4. If no cache, fetch from network
  return await fetchFromNetwork();
}

Future<TeamMemberActivityResponse> getTeamMemberActivity(
  EsClient client,
  String teamId,
  String projectId,
  DateTime? startDate,
  DateTime? endDate,
) async {
  final cacheKey =
      'teamMemberActivity_${projectId}_${teamId}_${startDate?.toIso8601String() ?? ''}_${endDate?.toIso8601String() ?? ''}';

  // 1. Try to load from cache
  TeamMemberActivityResponse? cached;
  try {
    cached = await ApiCache.get<TeamMemberActivityResponse>(
      cacheKey,
      (json) => standardSerializers.deserializeWith(
          TeamMemberActivityResponse.serializer, json)!,
    );
  } catch (e) {
    print('[getTeamMemberActivity] Cache load failed: $e');
  }

  // 2. Define network fetch
  Future<TeamMemberActivityResponse> fetchFromNetwork() async {
    final response = await client
        .getProjectsApi()
        .projectsControllerGetTeamMembersVisitActivity(
          teamId: teamId,
          projectId: projectId,
          startDate: startDate?.toIso8601String(),
          endDate: endDate?.toIso8601String(),
        );
    final data = response.data!;
    final serialized = standardSerializers.serializeWith(
        TeamMemberActivityResponse.serializer, data);
    await ApiCache.set(cacheKey, serialized);
    return data;
  }

  // 3. Return cached if available, and fetch in background
  if (cached != null) {
    unawaited(fetchFromNetwork().catchError((e) {
      print('[getTeamMemberActivity] Background fetch failed: $e');
      return cached!;
    }));
    return cached;
  }

  // 4. If no cache, fetch from network
  return await fetchFromNetwork();
}

Future<PaginatedTeamMemberResponse> getTeamMembersFieldView(
  EsClient client,
  String teamId,
  String projectId,
) async {
  final cacheKey = 'teamMembersFieldView_${projectId}_${teamId}';

  // 1. Try to load from cache
  PaginatedTeamMemberResponse? cached;
  try {
    cached = await ApiCache.get<PaginatedTeamMemberResponse>(
      cacheKey,
      (json) => standardSerializers.deserializeWith(
          PaginatedTeamMemberResponse.serializer, json)!,
    );
  } catch (e) {
    print('[getTeamMembersFieldView] Cache load failed: $e');
  }

  // 2. Define network fetch
  Future<PaginatedTeamMemberResponse> fetchFromNetwork() async {
    final response =
        await client.getProjectsApi().projectsControllerGetTeamMembersFieldView(
              teamId: teamId,
              projectId: projectId,
            );
    final data = response.data!;
    final serialized = standardSerializers.serializeWith(
        PaginatedTeamMemberResponse.serializer, data);
    await ApiCache.set(cacheKey, serialized);
    return data;
  }

  // 3. Return cached if available, and fetch in background
  if (cached != null) {
    unawaited(fetchFromNetwork().catchError((e) {
      print('[getTeamMembersFieldView] Background fetch failed: $e');
      return cached!;
    }));
    return cached;
  }

  // 4. If no cache, fetch from network
  return await fetchFromNetwork();
}

Future<VisitResponseData> updateVisitDetails(
  EsClient client,
  String projectId,
  String visitId,
  UpdateVisitDto updateVisitDto,
) async {
  final response = await client.getProjectsApi().projectsControllerUpdateVisit(
        visitId: visitId,
        projectId: projectId,
        updateVisitDto: updateVisitDto,
      );
  return response.data!.data;
}

// Future<List<VisitResponseData>> getCompletedVisits(
//   EsClient client,
//   String projectId, {
//   DateTime? startDate,
//   DateTime? endDate,
//   num? page,
//   num? limit,
// }) async {
//   final cacheKey =
//       'completedVisits_${projectId}_${startDate?.toIso8601String() ?? ''}_${endDate?.toIso8601String() ?? ''}_${page ?? ''}_${limit ?? ''}';
//   try {
//     final response = await client.getProjectsApi().projectsControllerGetVisits(
//           projectId: projectId,
//           visitStatus: 'completed',
//           startDate: startDate?.toIso8601String(),
//           endDate: endDate?.toIso8601String(),
//           limit: limit,
//           page: page,
//           assignedTo: true,
//         );
//     final data = response.data?.data.toList() ?? [];
//     final serialized = data
//         .map((e) =>
//             standardSerializers.serializeWith(VisitResponseData.serializer, e))
//         .toList();
//     await ApiCache.set(cacheKey, serialized);
//     return data;
//   } catch (e) {
//     final cached = await ApiCache.get<List<VisitResponseData>>(
//       cacheKey,
//       (json) => (json as List)
//           .map((e) => standardSerializers.deserializeWith(
//               VisitResponseData.serializer, e))
//           .whereType<VisitResponseData>()
//           .toList(),
//     );
//     return cached ?? [];
//   }
// }

// Helper to merge online visits with offline completed visits from Hive
Future<List<VisitResponseData>> _mergeWithOfflineVisits(
    List<VisitResponseData> onlineVisits) async {
  try {
    final completedVisitsBox = Hive.isBoxOpen('completedVisits')
        ? Hive.box('completedVisits')
        : await Hive.openBox('completedVisits');

    if (completedVisitsBox.isNotEmpty) {
      final offlineCompleted = completedVisitsBox.values
          .map((v) => standardSerializers.deserializeWith(
              VisitResponseData.serializer, v))
          .whereType<VisitResponseData>()
          .toList();

      // Merge and deduplicate - offline visits that aren't already in online list
      final onlineIds = onlineVisits.map((v) => v.id).toSet();
      final uniqueOffline =
          offlineCompleted.where((v) => !onlineIds.contains(v.id)).toList();

      final merged = [...onlineVisits, ...uniqueOffline];
      return sortCompletedVisits(merged);
    }
  } catch (e) {
    print("Error merging offline visits: $e");
  }

  return onlineVisits;
}

List<VisitResponseData> sortCompletedVisits(List<VisitResponseData> visits) {
  visits.sort((a, b) =>
      (b.visitedAt ?? DateTime(0)).compareTo(a.visitedAt ?? DateTime(0)));
  return visits;
}

Future<List<VisitResponseData>> getCompletedVisits(
  EsClient client,
  String projectId, {
  DateTime? startDate,
  DateTime? endDate,
  num? page,
  num? limit,
  QueryClient? queryClient,
}) async {
  final cacheKey =
      'completedVisits_${projectId}_${startDate?.toIso8601String() ?? ''}_${endDate?.toIso8601String() ?? ''}_${page ?? ''}_${limit ?? ''}';

  // 1. Try to load from cache
  List<VisitResponseData>? cached;
  try {
    cached = await ApiCache.get<List<VisitResponseData>>(
      cacheKey,
      (json) => (json as List)
          .map((e) => standardSerializers.deserializeWith(
              VisitResponseData.serializer, e))
          .whereType<VisitResponseData>()
          .toList(),
    );
  } catch (e) {
    print("Failed to load cached completed visits: $e");
  }

  // 2. Define network fetch
  Future<List<VisitResponseData>> fetchFromNetwork() async {
    final response = await client.getProjectsApi().projectsControllerGetVisits(
          projectId: projectId,
          visitStatus: 'completed',
          startDate: startDate?.toIso8601String(),
          endDate: endDate?.toIso8601String(),
          limit: limit,
          page: page,
          assignedTo: true,
        );
    final data = response.data?.data.toList() ?? [];
    final serialized = data
        .map((e) =>
            standardSerializers.serializeWith(VisitResponseData.serializer, e))
        .toList();
    await ApiCache.set(cacheKey, serialized);
    return sortCompletedVisits(data);
  }

  // 3. Return cached if available, and fetch in background
  if (cached != null) {
    unawaited(fetchFromNetwork().then((data) async {
      // Update fquery cache with fresh data so UI reflects immediately
      if (queryClient != null) {
        // Merge with offline completed visits from Hive
        final mergedData = await _mergeWithOfflineVisits(data);
        queryClient.setQueryData<List<VisitResponseData>>(
          QueryKeys.completedVisits(projectId,
              startDate: startDate, endDate: endDate),
          (_) => mergedData,
        );
      }
    }).catchError((e) {
      print("Background refresh failed: $e");
    }));
    return sortCompletedVisits(cached);
  }

  // 4. If no cache, fetch from network
  return await fetchFromNetwork();
}

// Future<VisitResponseData?> getVisit(
//   EsClient client,
//   String projectId,
//   String visitId,
// ) async {
//   final cacheKey = 'visit_${projectId}_$visitId';
//   try {
//     final response = await client.getProjectsApi().projectsControllerFindById(
//           visitId: visitId,
//           siteId: "",
//           projectId: projectId,
//         );
//     final data = response.data?.data;
//     if (data != null) {
//       final serialized =
//           standardSerializers.serializeWith(VisitResponseData.serializer, data);
//       await ApiCache.set(cacheKey, serialized);
//     }
//     return data;
//   } catch (e) {
//     final cached = await ApiCache.get<VisitResponseData>(
//       cacheKey,
//       (json) {
//         final result = standardSerializers.deserializeWith(
//             VisitResponseData.serializer, json);
//         if (result == null) throw Exception('No cached visit available');
//         return result;
//       },
//     );
//     if (cached != null) return cached;
//     throw Exception('No cached visit available');
//   }
// }

Future<VisitResponseData?> getVisit(
  EsClient client,
  String projectId,
  String visitId,
) async {
  final cacheKey = 'visit_${projectId}_$visitId';

  // 1. Try to load from cache
  VisitResponseData? cached;
  try {
    cached = await ApiCache.get<VisitResponseData>(
      cacheKey,
      (json) => standardSerializers.deserializeWith(
          VisitResponseData.serializer, json)!,
    );
  } catch (e) {
    print("Failed to load cached visit: $e");
  }

  // 2. Define network fetch
  Future<VisitResponseData?> fetchFromNetwork() async {
    final response = await client.getProjectsApi().projectsControllerFindById(
          visitId: visitId,
          siteId: "",
          projectId: projectId,
        );
    final data = response.data?.data;
    if (data != null) {
      final serialized =
          standardSerializers.serializeWith(VisitResponseData.serializer, data);
      await ApiCache.set(cacheKey, serialized);
    }
    return data;
  }

  // 3. Return cached if available, and fetch in background
  if (cached != null) {
    unawaited(fetchFromNetwork().catchError((e) {
      print("Background refresh failed: $e");
      return cached;
    }));
    return cached;
  }

  // 4. If no cache, fetch from network
  try {
    return await fetchFromNetwork();
  } catch (e) {
    throw Exception("No cached data available");
  }
}

Future<UserProfileResponseData> getProfile(EsClient client,
    {bool forceRefresh = false}) async {
  const cacheKey = 'user_profile';

  // 1. Try to load from cache
  UserProfileResponseData? cached;
  if (!forceRefresh) {
    try {
      cached = await ApiCache.get<UserProfileResponseData>(
        cacheKey,
        (json) => standardSerializers.deserializeWith(
            UserProfileResponseData.serializer, json)!,
      );
    } catch (e) {
      print('[getProfile] Cache load failed: $e');
    }
  }

  // 2. Define network fetch
  Future<UserProfileResponseData> fetchFromNetwork() async {
    final response = await client.getUserApi().userControllerProfile();
    final data = response.data!.data;
    final serialized = standardSerializers.serializeWith(
        UserProfileResponseData.serializer, data);
    await ApiCache.set(cacheKey, serialized);
    return data;
  }

  // 3. Return cached if available, and fetch in background
  if (cached != null) {
    unawaited(fetchFromNetwork().catchError((e) {
      print('[getProfile] Background fetch failed: $e');
      return cached!;
    }));
    return cached;
  }

  // 4. If no cache, fetch from network
  return await fetchFromNetwork();
}

Future<VisitResponseData?> getVisitById(
  EsClient client,
  String projectId,
  String visitId,
) async {
  final cacheKey = 'visitById_${projectId}_$visitId';
  try {
    final response = await client.getProjectsApi().projectsControllerFindById(
          projectId: projectId,
          siteId: "",
          visitId: visitId,
        );
    final data = response.data?.data;
    if (data != null) {
      final serialized =
          standardSerializers.serializeWith(VisitResponseData.serializer, data);
      await ApiCache.set(cacheKey, serialized);
    }
    return data;
  } catch (e) {
    final cached = await ApiCache.get<VisitResponseData>(
      cacheKey,
      (json) {
        final result = standardSerializers.deserializeWith(
            VisitResponseData.serializer, json);
        if (result == null) throw Exception('No cached visit by id available');
        return result;
      },
    );
    if (cached != null) return cached;
    throw Exception('No cached visit by id available');
  }
}

/// Max time to wait for the sample-type fetch before giving up.
const _kSampleTypeFetchTimeout = Duration(seconds: 30);

/// Cache-first (stale-while-revalidate): a non-empty cached list is returned
/// immediately and the network is refreshed in the background. A successful
/// refresh updates Hive and, when [queryClient] is given, the active
/// sample-type query. Empty responses never overwrite the cache.
Future<List<SampleTypeResponseData>> getSampleType(
  EsClient client, {
  QueryClient? queryClient,
}) async {
  const cacheKey = 'sample_type';

  // 1. Try to load from cache
  List<SampleTypeResponseData>? cached;
  try {
    cached = await ApiCache.get<List<SampleTypeResponseData>>(
      cacheKey,
      (json) => (json as List)
          .map((e) => standardSerializers.deserializeWith(
              SampleTypeResponseData.serializer, e))
          .whereType<SampleTypeResponseData>()
          .toList(),
    );
  } catch (e) {
    print('[getSampleType] Cache load failed: $e');
  }

  // 2. Define network fetch
  Future<List<SampleTypeResponseData>> fetchFromNetwork() async {
    final response = await client
        .getSampleTypeApi()
        .sampleTypeControllerFindAll()
        .timeout(_kSampleTypeFetchTimeout);
    final data = response.data?.data.toList() ?? [];
    if (data.isEmpty) {
      print('[getSampleType] Empty response, keeping existing cache');
      return data;
    }
    final serialized = data
        .map((e) => standardSerializers.serializeWith(
            SampleTypeResponseData.serializer, e))
        .toList();
    await ApiCache.set(cacheKey, serialized);
    return data;
  }

  // 3. Return cached if available, and fetch in background
  if (cached != null && cached.isNotEmpty) {
    final fallback = cached;
    unawaited(fetchFromNetwork().then((fresh) {
      if (fresh.isNotEmpty) {
        queryClient?.setQueryData<List<SampleTypeResponseData>>(
          QueryKeys.sampleType(),
          (_) => fresh,
        );
      }
      return fresh;
    }).catchError((e) {
      print('[getSampleType] Background fetch failed: $e');
      return fallback;
    }));
    return cached;
  }

  // 4. If no cache, fetch from network
  return await fetchFromNetwork();
}

/// The ApiCache key [getSiteById] keeps a site under.
String siteByIdCacheKey(String projectId, String siteId) =>
    'siteById_${projectId}_$siteId';

Future<SiteResponseData?> getSiteById(
  EsClient client,
  String projectId,
  String siteId,
) async {
  final cacheKey = siteByIdCacheKey(projectId, siteId);

  // Try loading from local Hive cache first
  try {
    final cached = await ApiCache.get<SiteResponseData>(
      cacheKey,
      (json) =>
          standardSerializers.deserializeWith(
              SiteResponseData.serializer, json) ??
          (throw Exception('No cached site by id available')),
    );
    if (cached != null) {
      // Return cached immediately for quick UI
      // Meanwhile try network fetch if siteId is not local
      if (!siteId.startsWith('local-')) {
        _fetchAndCacheFromNetwork(client, projectId, siteId, cacheKey);
      }
      return cached;
    }
  } catch (_) {
    // No cache found, proceed to network fetch below
  }

  // If no cache or local site, fetch from network (only for server IDs)
  if (!siteId.startsWith('local-')) {
    try {
      final response = await client
          .getProjectsApi()
          .projectsControllerFindSite(projectId: projectId, siteId: siteId);
      final data = response.data?.data;
      if (data != null) {
        final serialized = standardSerializers.serializeWith(
            SiteResponseData.serializer, data);
        await ApiCache.set(cacheKey, serialized);
      }
      return data;
    } catch (e) {
      // Failed network fetch and no cache => throw
      throw Exception('No cached site by id available');
    }
  }

  // For local site IDs, just return null or handle appropriately
  return null;
}

// Background fetch helper
void _fetchAndCacheFromNetwork(
  EsClient client,
  String projectId,
  String siteId,
  String cacheKey,
) async {
  try {
    final response = await client
        .getProjectsApi()
        .projectsControllerFindSite(projectId: projectId, siteId: siteId);
    final data = response.data?.data;
    if (data != null) {
      final serialized =
          standardSerializers.serializeWith(SiteResponseData.serializer, data);
      await ApiCache.set(cacheKey, serialized);
    }
  } catch (_) {
    // Ignore background fetch errors
  }
}

// Future<SiteResponseData?> getSiteById(
//   EsClient client,
//   String projectId,
//   String siteId,
// ) async {
//   final cacheKey = 'siteById_${projectId}_$siteId';
//   try {
//     final response = await client
//         .getProjectsApi()
//         .projectsControllerFindSite(projectId: projectId, siteId: siteId);
//     final data = response.data?.data;
//     if (data != null) {
//       final serialized =
//           standardSerializers.serializeWith(SiteResponseData.serializer, data);
//       await ApiCache.set(cacheKey, serialized);
//     }
//     return data;
//   } catch (e) {
//     final cached = await ApiCache.get<SiteResponseData>(
//       cacheKey,
//       (json) {
//         final result = standardSerializers.deserializeWith(
//             SiteResponseData.serializer, json);
//         if (result == null) throw Exception('No cached site by id available');
//         return result;
//       },
//     );
//     if (cached != null) return cached;
//     throw Exception('No cached site by id available');
//   }
// }

String? useCurrentProjectId() {
  final project = useProject();
  return project.data?.id;
}

UseQueryResult<SiteResponseData?, dynamic> useSite(String? siteId) {
  final api = useEsApiClient();
  final projectId = useCurrentProjectId();

  return useQuery(
    QueryKeys.site(projectId, siteId),
    () async {
      debugPrint("[useSite] Starting for siteId: $siteId");

      if (projectId == null ||
          siteId == null ||
          projectId.isEmpty ||
          siteId.isEmpty) {
        debugPrint("Missing projectId or siteId");
        throw Exception("Missing projectId or siteId");
      }

      try {
        // --- NETWORK FETCH ---
        debugPrint("[useSite] Fetching from network...");
        final result = await getSiteById(api, projectId, siteId);

        if (result == null) {
          debugPrint("[useSite] Network returned null result");
          throw Exception("Network returned null result");
        }

        debugPrint("[useSite] Network fetch succeeded for siteId: $siteId");

        // --- HIVE CACHING ---
        debugPrint(
            "[useSite] Saving to Hive box 'site-details' for siteId: $siteId");

        try {
          await DatabaseService.saveSiteDetails(siteId, {
            'data': result,
          });
          debugPrint("[useSite] Successfully cached siteId: $siteId");
        } catch (e, s) {
          debugPrint("[useSite] Failed to save to Hive: $e\n$s");
        }

        return result;
      } catch (e, s) {
        debugPrint("[useSite] Error during network fetch: $e\n$s");

        // --- HIVE FALLBACK ---
        debugPrint("[useSite] Trying to load from Hive cache...");

        final cached = await DatabaseService.getSiteDetailsFromCache(siteId);

        if (cached == null) {
          debugPrint(
              "[useSite] No cached data found in Hive for siteId: $siteId");
          rethrow;
        }

        debugPrint("📂 [useSite] Loaded cached data for siteId: $siteId");

        if (!cached.containsKey('data')) {
          debugPrint("[useSite] Cached map does not contain 'data' key");
          rethrow;
        }

        final cachedData = cached['data'];

        if (cachedData is SiteResponseData?) {
          debugPrint("[useSite] Returning cached SiteResponseData");
          return cachedData;
        } else {
          debugPrint(
              "[useSite] Cached data is not of type SiteResponseData: ${cachedData.runtimeType}");
          rethrow;
        }
      }
    },
    enabled: (projectId?.isNotEmpty ?? false) && (siteId?.isNotEmpty ?? false),
  );
}

// UseQueryResult<SiteResponseData?, dynamic> useSite(String? siteId) {
//   final api = useEsApiClient();
//   final projectId = useCurrentProjectId();

//   return useQuery(
//     enabled: (projectId?.isNotEmpty ?? false) && (siteId?.isNotEmpty ?? false),
//     QueryKeys.site(projectId, siteId),
//     () => getSiteById(api, projectId as String, siteId as String),
//   );
// }

UseQueryResult<VisitResponseData?, dynamic> useGetVisitDetails(String visitId) {
  final api = useEsApiClient();
  final projectId = useCurrentProjectId();
  return useQuery(
    enabled: visitId.isNotEmpty,
    QueryKeys.visits(null),
    () => getVisitById(api, projectId!, visitId),
  );
}

UseQueryResult<List<SampleTypeResponseData>, dynamic> useSampleType() {
  final api = useEsApiClient();
  final queryClient = useQueryClient();
  return useQuery(
    QueryKeys.sampleType(),
    () => getSampleType(api, queryClient: queryClient),
  );
}

abstract class QueryKeys {
  static final session = ['session'];
  static final profile = ['profile'];
  static final projects = ['projects'];
  static final availableProjects =
      (String? userId) => ['availableProjects', userId ?? 'anonymous'];
  static final regions = (String type, {String? parentId}) =>
      parentId != null ? ['regions', type, parentId] : ['regions', type];
  static final collectors =
      (String? projectId) => ["project", projectId, "collectors"];
  static final validateBarcode = (String? projectId, String? barcode) =>
      ["project", projectId, "validateBarcode", barcode];
  static final teamRoles =
      (String? projectId) => ["project", projectId, "teamRoles"];
  static final teamMembers =
      (String? projectId) => ["project", projectId, "teamMembers"];

  static List<String> sites(String? projectId) =>
      ['projects', projectId ?? '', 'sites'];

  static site(String? projectId, String? siteId) =>
      ['projects', projectId, 'sites', siteId];

  static visits(String? projectId) => ['projects', projectId, 'visits'];

  static visit(String? projectId, String? visitId) =>
      ['projects', projectId, 'visits', visitId];

  static siteVisits(String? projectId, String? siteId) =>
      ['projects', projectId, 'sites', siteId, 'visits'];

  static nearbySites(String? projectId, double? latitude, double? longitude,
          double? radius) =>
      [
        'projects',
        projectId,
        'sites',
        'nearby',
        latitude?.toString() ?? 'null',
        longitude?.toString() ?? 'null',
        radius?.toString() ?? 'null'
      ];

  static updateVisit(String? siteId) => ['site', siteId, 'updateVisit'];

  static sampleType() => ['sampleType'];

  static String _formatDateWithTime(DateTime? date, bool isEndDate) {
    if (date == null) return '';
    final formattedDate =
        '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
    return isEndDate
        ? '${formattedDate}T23:59:59.000'
        : '${formattedDate}T00:00:00.000';
  }

  static scheduledVisits(String? projectId,
          {required bool assignedTo,
          DateTime? startDate,
          DateTime? endDate,
          required String status}) =>
      [
        'projects',
        projectId,
        'visits',
        'scheduled',
        status,
        assignedTo.toString(),
        _formatDateWithTime(startDate, false),
        _formatDateWithTime(endDate, true)
      ];

  static visitSummary(DateTime? startDate, DateTime? endDate) => [
        'visit',
        'summary',
        _formatDateWithTime(startDate, false),
        _formatDateWithTime(endDate, true)
      ];

  static teamProgressActivityOverview(
          String? teamId, DateTime? startDate, DateTime? endDate) =>
      [
        'team',
        'progress',
        'activity',
        'overview',
        teamId ?? 'null',
        _formatDateWithTime(startDate, false),
        _formatDateWithTime(endDate, true)
      ];

  static teamMemberActivity(
          String? teamId, DateTime? startDate, DateTime? endDate) =>
      [
        'team',
        'member',
        'activity',
        teamId ?? 'null',
        _formatDateWithTime(startDate, false),
        _formatDateWithTime(endDate, true)
      ];

  static teamMembersFieldView(String? teamId) =>
      ['team', 'members', 'field', 'view', teamId ?? 'null'];

  static completedVisits(String? projectId,
          {DateTime? startDate, DateTime? endDate}) =>
      [
        'projects',
        projectId,
        'visits',
        'completed',
        _formatDateWithTime(startDate, false),
        _formatDateWithTime(endDate, true)
      ];
}

/// Auth
UseMutationResult<Response<LoginResponse>, dynamic, UnifiedLoginDto>
    useInitiateOTPLogin({
  void onSuccess()?,
  void onError(String error)?,
}) {
  final client = useEsApiClient();
  return useMutation(
    // Unified endpoint accepts either email or phone; the UnifiedLoginDto only
    // serializes whichever field is set, so exactly one identifier is sent.
    (p) => client.getAuthApi().authControllerLoginUnified(unifiedLoginDto: p),
    onSuccess: (p0, p1, p2) => onSuccess?.call(),
    onError: (error, variables, context) {
      final errorMessage = error is DioException
          ? (error.response?.data?['message'] ??
              error.message ??
              'Failed to send OTP. Please try again.')
          : 'Failed to send OTP. Please try again.';
      onError?.call(errorMessage);
    },
  );
}

UseMutationResult<Response<VerifyOtpResponse>, void, VerifyOtpDto>
    useVerifyOTP({
  void onSuccess()?,
  void onError(String error)?,
}) {
  final client = useQueryClient();
  final api = useEsApiClient();
  final updateToken = useUpdateToken();
  return useMutation(
    (p) async {
      final result =
          await api.getAuthApi().authControllerVerify(verifyOtpDto: p);
      final token = result.data?.data.accessToken;
      if (token == null) throw new Exception('Login failed');
      updateToken(token);
      return result;
    },
    onSuccess: (p0, p1, p2) async {
      // Start the new session from an empty query cache. `logout()` already
      // does this, but the 401 path in AuthInterceptor goes straight to the
      // login screen without calling it. The removal runs on a zero-delay
      // timer, so it completes during the awaits below — before the fresh
      // profile/projects are seeded.
      client.removeQueries(const []);

      // Profile has to resolve first: the project cache key is namespaced by
      // user id (see getAvailableProjects) precisely so a stale project list
      // from a previous account on a shared device can never be served to
      // this one.
      final profile = await getProfile(api, forceRefresh: true);
      final projects = await getAvailableProjects(
        api,
        userId: profile.id,
        forceRefresh: true,
      );
      client.setQueryData<Object?>(QueryKeys.profile, (p) => profile);
      client.setQueryData<Object?>(
        QueryKeys.availableProjects(profile.id),
        (p) => projects,
      );

      onSuccess?.call();
    },
    onError: (error, variables, context) {
      String errorMessage = 'Invalid OTP. Please try again.';
      onError?.call(errorMessage);
    },
  );
}

/// Profile
UseQueryResult<UserProfileResponseData, dynamic> useProfile() {
  final api = useEsApiClient();
  return useQuery(QueryKeys.profile, () => getProfile(api));
}

/// Project
///
/// Resolves to the persisted+validated current project (see [getProject]).
/// `.data` is null while loading, on a genuine fetch error, AND when no
/// project could be resolved (0 or multiple projects with no selection —
/// `.error` is a [NoProjectSelectedException] in that last case). Every
/// existing call site already treats `.data` as nullable, so this widened
/// meaning needed no changes at any of them.
UseQueryResult<ProjectResponseDataExtended, dynamic> useProject() {
  final api = useEsApiClient();
  final userId = useProfile().data?.id;
  return useQuery(
    QueryKeys.projects,
    () => getProject(api, userId: userId),
  );
}

/// Every project the user belongs to, across every workspace — the full list
/// [useProject]'s resolution (persisted selection / auto-select-if-one) picks
/// the current project from. Used by the project picker.
UseQueryResult<List<ProjectResponseDataExtended>, dynamic>
    useAvailableProjects() {
  final api = useEsApiClient();
  final userId = useProfile().data?.id;
  return useQuery(
    QueryKeys.availableProjects(userId),
    () => getAvailableProjects(api, userId: userId),
  );
}

/// Sites
UseQueryResult<List<SiteResponseData>, dynamic> useSites() {
  final api = useEsApiClient();
  final projectId = useCurrentProjectId();

  return useQuery(
    enabled: projectId != null && projectId.isNotEmpty,
    QueryKeys.sites(projectId),
    () => getSites(api, projectId!),
    staleDuration: const Duration(seconds: 1),
    cacheDuration: const Duration(hours: 24),
  );
}

UseQueryResult<List<VisitResponseData>, dynamic> useScheduledVisits(
  bool assignedTo, {
  DateTime? startDate,
  DateTime? endDate,
  String status = 'upcoming',
}) {
  final api = useEsApiClient();
  final queryClient = useQueryClient();
  final projectId = useCurrentProjectId();
  final userId = useProfile().data?.id;

  return useQuery(
    enabled: projectId != null && projectId.isNotEmpty && userId != null,
    QueryKeys.scheduledVisits(
      projectId,
      assignedTo: assignedTo,
      startDate: startDate,
      endDate: endDate,
      status: status,
    ),
    () => getScheduledVisits(
      api,
      projectId as String,
      true,
      startDate: startDate,
      endDate: endDate,
      status: status,
      queryClient: queryClient,
      userId: userId,
    ),
  );
}

UseQueryResult<List<VisitResponseData>, dynamic> useSiteVisits(String? siteId) {
  final api = useEsApiClient();
  final projectId = useCurrentProjectId();
  print(
      "--- useSiteVisits --- Hook called with siteId: $siteId, projectId: $projectId");

  return useQuery<List<VisitResponseData>, dynamic>(
    QueryKeys.siteVisits(projectId, siteId),
    () {
      print(
          "--- useSiteVisits fetcher: Executing for siteId: $siteId (projectId: $projectId) ---");
      return getSiteVisits(api, projectId!, siteId!);
    },
    enabled: projectId != null &&
        projectId.isNotEmpty &&
        siteId != null &&
        siteId.isNotEmpty,
  );
}

UseQueryResult<ListNearbySiteResponse, dynamic> useNearbySites(
    double? latitude, double? longitude, double? radius) {
  final api = useEsApiClient();
  final projectId = useCurrentProjectId();
  final queryClient = useQueryClient();

  final bool enabled = (projectId?.isNotEmpty ?? false) &&
      (latitude != null && latitude != 0) &&
      (longitude != null && longitude != 0) &&
      (radius != null && radius > 0);

  final cacheKey =
      'nearbySites_${projectId}_${latitude}_${longitude}_${radius}';
  final queryKey =
      QueryKeys.nearbySites(projectId, latitude, longitude, radius);

  // Load cache and seed query cache on mount
  useEffect(() {
    if (!enabled) return null;

    Future<void> loadCache() async {
      try {
        final cached = await ApiCache.get<ListNearbySiteResponse>(
          cacheKey,
          (json) {
            final result = standardSerializers.deserializeWith(
                ListNearbySiteResponse.serializer, json);
            return result ?? ListNearbySiteResponse();
          },
        );

        if (cached != null) {
          // Seed the query cache with Hive data
          queryClient.setQueryData<ListNearbySiteResponse>(
              queryKey, (_) => cached);
          debugPrint('[useNearbySites] Seeded query cache from Hive');
        }
      } catch (e) {
        debugPrint('[useNearbySites] Error loading cache: $e');
      }
    }

    loadCache();
    return null;
  }, [cacheKey]);

  return useQuery<ListNearbySiteResponse, dynamic>(
    enabled: enabled,
    queryKey,
    () async {
      if (!enabled) {
        return (ListNearbySiteResponseBuilder()
              ..data = ListBuilder<NearbySiteResponseData>())
            .build();
      }

      // Fetch from network (will update UI automatically when complete)
      try {
        final response = await api
            .getProjectsApi()
            .projectsControllerGetNearbyLocations(
                projectId: projectId!,
                radius: radius,
                lat: latitude,
                lon: longitude,
                assignedTo: true);

        final data = response.data ?? ListNearbySiteResponse();

        // Update Hive cache for persistence
        final serialized = standardSerializers.serializeWith(
            ListNearbySiteResponse.serializer, data);
        await ApiCache.set(cacheKey, serialized);

        debugPrint('[useNearbySites] Network fetch successful, cache updated');
        return data;
      } catch (e) {
        debugPrint('[useNearbySites] Network fetch failed: $e');

        // Network failed - try Hive cache as fallback
        final cached = await ApiCache.get<ListNearbySiteResponse>(
          cacheKey,
          (json) {
            final result = standardSerializers.deserializeWith(
                ListNearbySiteResponse.serializer, json);
            return result ?? ListNearbySiteResponse();
          },
        );

        if (cached != null) {
          debugPrint('[useNearbySites] Using cached data as fallback');
          return cached;
        }

        throw Exception('No cached nearby sites available');
      }
    },
    staleDuration: const Duration(seconds: 0), // Always refetch
    cacheDuration: const Duration(days: 7), // Keep in cache
  );
}

Future<ListNearbySiteResponse> getNearbySites(
  EsClient client,
  String projectId,
  double latitude,
  double longitude,
  double radius,
) async {
  final cacheKey =
      'nearbySites_${projectId}_${latitude}_${longitude}_${radius}';
  try {
    final response = await client
        .getProjectsApi()
        .projectsControllerGetNearbyLocations(
            projectId: projectId,
            radius: radius,
            lat: latitude,
            lon: longitude,
            assignedTo: true);
    final data = response.data ?? ListNearbySiteResponse();
    final serialized = standardSerializers.serializeWith(
        ListNearbySiteResponse.serializer, data);
    // jsonEncode(serialized);
    await ApiCache.set(cacheKey, serialized);
    return data;
  } catch (e) {
    final cached = await ApiCache.get<ListNearbySiteResponse>(
      cacheKey,
      (json) {
        final result = standardSerializers.deserializeWith(
            ListNearbySiteResponse.serializer, json);
        if (result == null) throw Exception('No cached nearby sites available');
        return result;
      },
    );
    if (cached != null) return cached;
    throw Exception('No cached nearby sites available');
  }
}

// Future<ListNearbySiteResponse> getNearbySites(
//   EsClient client,
//   String projectId,
//   double latitude,
//   double longitude,
//   double radius,
// ) async {
//   final latStr = latitude.toStringAsFixed(6);
//   final lonStr = longitude.toStringAsFixed(6);
//   final radiusStr = radius.toStringAsFixed(0);
//   final cacheKey = 'nearbySites_${projectId}_${latStr}_${lonStr}_${radiusStr}';

//   try {
//     print('[NearbySites] Fetching from API for radius: $radiusStr m');

//     final response =
//         await client.getProjectsApi().projectsControllerGetNearbyLocations(
//               projectId: projectId,
//               radius: radius,
//               lat: latitude,
//               lon: longitude,
//               assignedTo: true,
//             );

//     final data = response.data ?? ListNearbySiteResponse();
//     final serialized = standardSerializers.serializeWith(
//       ListNearbySiteResponse.serializer,
//       data,
//     );

//     await ApiCache.set(cacheKey, serialized);
//     print('[NearbySites] Cached ${data.data.length} sites for key: $cacheKey');

//     return data;
//   } catch (e) {
//     print('[NearbySites] API failed for $cacheKey: $e');
//     print('[NearbySites] Trying cache fallback for key: $cacheKey');

//     final cached = await ApiCache.get<ListNearbySiteResponse>(
//       cacheKey,
//       (json) {
//         final result = standardSerializers.deserializeWith(
//           ListNearbySiteResponse.serializer,
//           json,
//         );
//         if (result == null) throw Exception('Deserialization failed');
//         return result;
//       },
//     );

//     if (cached != null) {
//       print('[NearbySites] Cache hit for $cacheKey (returning cached data)');
//       return cached;
//     }

//     print('[NearbySites] No cache found for $cacheKey');
//     throw Exception('No cached nearby sites available for radius $radiusStr');
//   }
// }

Future<void> prefetchAllNearbySites({
  required EsClient api,
  required String projectId,
  required double latitude,
  required double longitude,
}) async {
  const defaultRadius = 4000000;

  print('[Prefetch] Fetching nearby sites within $defaultRadius meters...');

  try {
    final response = await getNearbySites(
      api,
      projectId,
      latitude,
      longitude,
      defaultRadius.toDouble(),
    );
    print(
        '[Prefetch] Cached ${response.data.length} sites for $defaultRadius meters');
  } catch (e) {
    print('[Prefetch] Failed to fetch for $defaultRadius meters: $e');
    throw Exception('Prefetch failed for $defaultRadius m: $e');
  }
}

// Future<void> prefetchAllNearbySites({
//   required EsClient api,
//   required String projectId,
//   required double latitude,
//   required double longitude,
//   required List<int> distances,
// }) async {
//   print('[Prefetch] Starting prefetch for distances: $distances');

//   List<String> failures = [];

//   for (final radius in distances) {
//     try {
//       final response = await getNearbySites(
//         api,
//         projectId,
//         latitude,
//         longitude,
//         radius.toDouble(),
//       );
//       // You may want to validate if response is actually cached or use a callback
//       print(
//           '[Prefetch] Cached ${response.data.length} sites for $radius meters');
//     } catch (e) {
//       print('[Prefetch] Failed to fetch for $radius meters: $e');
//       failures.add('$radius m: $e');
//     }
//   }

//   print('[Prefetch] Finished prefetching nearby sites.');

//   if (failures.isNotEmpty) {
//     throw Exception(
//         'Prefetch failed for some distances:\n${failures.join('\n')}');
//   }
// }
List<CombinedSite> useLocalSites() {
  final localSitesFuture = useFuture(useMemoized(() async {
    print('[useLocalSites] Opening Hive box...');
    final box = Hive.isBoxOpen('sites')
        ? Hive.box('sites')
        : await Hive.openBox('sites');

    final values = box.values.whereType<Map>().toList();
    print('[useLocalSites] Local box has ${values.length} entries');

    final localSites = values
        .map((raw) {
          try {
            // Normalize _Map<dynamic,dynamic> from Hive binary before
            // passing to built_value deserializer.
            final normalized = jsonDecode(jsonEncode(raw));
            final site = standardSerializers.deserializeWith(
                SiteResponseData.serializer, normalized);
            if (site == null) {
              print('[useLocalSites] Skipped a null-deserialized site');
            }
            return site;
          } catch (e) {
            print('[useLocalSites] Error deserializing site: $e');
            return null;
          }
        })
        .whereType<SiteResponseData>()
        .toList();

    print('[useLocalSites] Found ${localSites.length} sites from Hive');
    return localSites;
  }));

  final localSites = localSitesFuture.data ?? [];
  print(
      '[useLocalSites] localSitesFuture complete: ${localSites.length} sites');

  return localSites.map(CombinedSite.fromLocal).toList();
}

// List<CombinedSite> useLocalSites({
//   required UseQueryResult<ListNearbySiteResponse, dynamic> nearbySites,
// }) {
//   final localSitesFuture = useFuture(useMemoized(() async {
//     print('[useLocalSites] Opening Hive box...');
//     final box = Hive.isBoxOpen('sites')
//         ? Hive.box('sites')
//         : await Hive.openBox('sites');

//     final values = box.values.whereType<Map>().toList();
//     print('[useLocalSites] Local box has ${values.length} entries');

//     final localSites = values
//         .map((raw) {
//           final site = standardSerializers.deserializeWith(
//               SiteResponseData.serializer, raw);
//           if (site == null) {
//             print('[useLocalSites] Skipped a null-deserialized site');
//           } else if (!site.id.contains('local')) {
//             print('[useLocalSites] Skipped site without local id: ${site.id}');
//           }
//           return site;
//         })
//         .whereType<SiteResponseData>()
//         .where((site) => site.id.contains('local'))
//         .toList();

//     print(
//         '[useLocalSites] Found ${localSites.length} local sites with "local" in ID');
//     return localSites;
//   }));

//   final localSites = localSitesFuture.data ?? [];
//   print(
//       '[useLocalSites] localSitesFuture complete: ${localSites.length} local sites');

//   return localSites.map(CombinedSite.fromLocal).toList();
// }

UseQueryResult<VisitSummaryResponseData, dynamic> useVisitSummary({
  DateTime? startDate,
  DateTime? endDate,
}) {
  final api = useEsApiClient();
  final projectId = useCurrentProjectId();
  final queryClient = useQueryClient();

  final bool enabled =
      (projectId?.isNotEmpty ?? false) && startDate != null && endDate != null;

  final cacheKey =
      'visitSummary_${projectId}_${startDate?.toIso8601String() ?? ''}_${endDate?.toIso8601String() ?? ''}';
  final queryKey = QueryKeys.visitSummary(startDate, endDate);

  // Load cache and seed query cache on mount
  useEffect(() {
    if (!enabled) return null;

    Future<void> loadCache() async {
      try {
        final cached = await ApiCache.get<VisitSummaryResponseData>(
          cacheKey,
          (json) => standardSerializers.deserializeWith(
              VisitSummaryResponseData.serializer, json)!,
        );

        if (cached != null) {
          // Seed the query cache with cached data
          queryClient.setQueryData<VisitSummaryResponseData>(
              queryKey, (_) => cached);
          debugPrint('[useVisitSummary] Seeded query cache from Hive');
        }
      } catch (e) {
        debugPrint('[useVisitSummary] Error loading cache: $e');
      }
    }

    loadCache();
    return null;
  }, [cacheKey]);

  // if projectId is not yet ready, skip hook execution
  if (projectId == null) {
    print(
        "[useVisitSummary] Project ID is null — skipping query registration.");
    return UseQueryResult(
      data: null,
      isLoading: true,
      isError: false,
      error: null,
      dataUpdatedAt: null,
      errorUpdatedAt: null,
      isFetching: false,
      isSuccess: false,
      status: QueryStatus.loading,
      refetch: () => Future.value(),
      isInvalidated: false,
      isRefetchError: false,
    );
  }

  print("[useVisitSummary] Project ID ready: $projectId, "
      "startDate: $startDate, endDate: $endDate");

  return useQuery(
    queryKey,
    () => getVisitSummary(api, projectId, startDate, endDate),
    enabled: enabled,
  );
}

UseQueryResult<TeamProgressActivityOverviewResponseData, dynamic>
    useTeamProgressActivityOverview({
  required String teamId,
  DateTime? startDate,
  DateTime? endDate,
}) {
  final api = useEsApiClient();
  final projectId = useCurrentProjectId();
  return useQuery(
    QueryKeys.teamProgressActivityOverview(teamId, startDate, endDate),
    () => getTeamProgressActivityOverview(
        api, teamId, projectId.orEmpty(), startDate, endDate),
    enabled: teamId.isNotEmpty,
  );
}

UseQueryResult<TeamMemberActivityResponse, dynamic> useTeamMemberActivity({
  required String teamId,
  DateTime? startDate,
  DateTime? endDate,
}) {
  final api = useEsApiClient();
  final projectId = useCurrentProjectId();
  return useQuery(
    QueryKeys.teamMemberActivity(teamId, startDate, endDate),
    () => getTeamMemberActivity(
        api, teamId, projectId.orEmpty(), startDate, endDate),
    enabled: teamId.isNotEmpty,
  );
}

UseQueryResult<PaginatedTeamMemberResponse, dynamic> useTeamMembersFieldView({
  required String teamId,
}) {
  final api = useEsApiClient();
  final projectId = useCurrentProjectId();
  return useQuery(
    QueryKeys.teamMembersFieldView(teamId),
    () => getTeamMembersFieldView(api, teamId, projectId.orEmpty()),
    enabled: teamId.isNotEmpty,
  );
}

UseQueryResult<List<VisitResponseData>, dynamic> useCompletedVisit({
  DateTime? startDate,
  DateTime? endDate,
}) {
  final api = useEsApiClient();
  final projectId = useCurrentProjectId();
  final queryClient = useQueryClient();

  return useQuery(
    enabled: projectId != null && projectId.isNotEmpty,
    QueryKeys.completedVisits(projectId,
        startDate: startDate, endDate: endDate),
    () async {
      // Get online completed visits
      final onlineVisits = await getCompletedVisits(
        api,
        projectId!,
        startDate: startDate,
        endDate: endDate,
        queryClient: queryClient,
      );

      // Get online+offline completed visits from Hive using helper
      return await _mergeWithOfflineVisits(onlineVisits);
    },
  );
}

UseQueryResult<VisitResponseData?, dynamic> useVisit(String? visitId) {
  final api = useEsApiClient();
  final projectId = useCurrentProjectId();

  return useQuery(
    enabled: (projectId?.isNotEmpty ?? false) && (visitId?.isNotEmpty ?? false),
    QueryKeys.visit(projectId, visitId),
    () => getVisit(api, projectId as String, visitId as String),
  );
}

UseMutationResult<VisitResponse, dynamic, UpdateVisitDto> useUpdateVisitDetails(
  String visitId, {
  void Function()? onSuccess,
  void Function(String errorMessage)? onError,
}) {
  final api = useEsApiClient();
  final projectId = useCurrentProjectId();
  final queryClient = useQueryClient();

  return useMutation(
    (UpdateVisitDto request) async {
      if (projectId == null) throw Exception("No active project");

      final response = await api.getProjectsApi().projectsControllerUpdateVisit(
            visitId: visitId,
            projectId: projectId,
            updateVisitDto: request,
          );
      return response.data!;
    },
    onSuccess: (data, variables, context) {
      queryClient.invalidateQueries(QueryKeys.visits(null));
      onSuccess?.call();
    },
    onError: (error, variables, context) => onError?.call(error.toString()),
  );
}

UseMutationResult<VisitResponse?, dynamic, CreateVisitDto> useCreateVisit({
  void Function(VisitResponse? data)? onSuccess,
  void Function(String errorMessage)? onError,
}) {
  final api = useEsApiClient();
  final projectId = useCurrentProjectId();
  final queryClient = useQueryClient();

  return useMutation(
    (CreateVisitDto request) async {
      if (projectId == null) throw Exception("No active project");

      try {
        final response =
            await api.getProjectsApi().projectsControllerCreateVisit(
                  projectId: projectId,
                  createVisitDto: request,
                );

        _removeFromOfflineCache(request.siteId);
        return response.data;
      } catch (e) {
        // Only treat as offline when the error is a genuine connectivity
        // failure. API errors (4xx/5xx) must surface to the caller so the
        // user sees a meaningful error message instead of the misleading
        // "Visit created locally. Will sync when online." snackbar.
        final isConnectivityError = _isConnectivityError(e);

        if (isConnectivityError) {
          print('[useCreateVisit] Connectivity error – saving offline: $e');
          _saveToOfflineCache(request, projectId);
          return null; // signals "saved locally"
        }

        // Real API / server error — re-throw so onError fires.
        print('[useCreateVisit] API error (not offline): $e');
        rethrow;
      }
    },
    onSuccess: (data, variables, context) {
      if (data != null) {
        queryClient.invalidateQueries(QueryKeys.visits(null));
      }
      onSuccess?.call(data);
    },
    onError: (error, variables, context) {
      print('[useCreateVisit] onError: $error');
      // Show the server's message (e.g. a 400 explaining why the visit
      // can't be created) instead of Dio's generic "bad response" text.
      final responseData = error is DioException ? error.response?.data : null;
      final serverMessage =
          responseData is Map ? responseData['message']?.toString() : null;
      onError?.call(serverMessage ?? error.toString());
    },
  );
}

/// Returns true when [e] indicates the device has no internet connection,
/// as opposed to a server-side or application-level error.
bool _isConnectivityError(Object e) {
  if (e is SocketException) return true;
  if (e is DioException) {
    return e.type == DioExceptionType.connectionError ||
        e.type == DioExceptionType.connectionTimeout ||
        e.type == DioExceptionType.receiveTimeout ||
        e.type == DioExceptionType.sendTimeout ||
        // DioException wrapping a SocketException also counts.
        (e.error is SocketException);
  }
  return false;
}

String _formatSyncError(Object error) {
  if (error is DioException) {
    final statusCode = error.response?.statusCode;
    final responseData = error.response?.data;
    String responseMessage = '';

    if (responseData is Map) {
      final message = responseData['message'];
      responseMessage = message is List ? message.join(', ') : '$message';
    } else if (responseData != null) {
      responseMessage = responseData.toString();
    }

    final requestPath = error.requestOptions.uri.path;
    final prefix = statusCode != null
        ? 'HTTP $statusCode $requestPath'
        : error.type.toString();

    return responseMessage.isNotEmpty
        ? '$prefix: $responseMessage'
        : '$prefix: ${error.message ?? error.toString()}';
  }

  return error.toString();
}

// Save visit data to Hive as a map
void _saveToOfflineCache(CreateVisitDto dto, String projectId) {
  final box = Hive.box<Map>('offlineVisits');

  final visitMap = {
    'projectId': projectId,
    // 'dto': dto.toJson(),
    'timestamp': DateTime.now().toIso8601String(),
  };

  // Use siteId as key or generate ID
  final key = dto.siteId;
  box.put(key, visitMap);
}

// Remove from cache after successful upload
void _removeFromOfflineCache(String? siteId) {
  if (siteId == null) return;
  final box = Hive.box<Map>('offlineVisits');
  box.delete(siteId);
}

// UseMutationResult<VisitResponse, dynamic, CreateVisitDto> useCreateVisit({
//   void Function()? onSuccess,
//   void Function(String errorMessage)? onError,
// }) {
//   final api = useEsApiClient();
//   final projectId = useCurrentProjectId();
//   final queryClient = useQueryClient();

//   return useMutation(
//     (CreateVisitDto request) async {
//       if (projectId == null) throw Exception("No active project");

//       final response = await api.getProjectsApi().projectsControllerCreateVisit(
//             projectId: projectId,
//             createVisitDto: request,
//           );
//       return response.data!;
//     },
//     onSuccess: (data, variables, context) {
//       queryClient.invalidateQueries(QueryKeys.visits(null));
//       onSuccess?.call();
//     },
//     onError: (error, variables, context) => onError?.call(error.toString()),
//   );
// }

UseMutationResult<UserResponse, dynamic, UpdateUserDto> useUpdateProfile({
  required String userId,
  void Function()? onSuccess,
  void Function(String errorMessage)? onError,
}) {
  final api = useEsApiClient();
  final queryClient = useQueryClient();

  return useMutation(
    (UpdateUserDto request) async {
      // TODO(multi-tenancy): switch to `userControllerUpdateProfile`
      // (PATCH /users/profile) once es_client is regenerated —
      // `mobile/scripts/gen-client.sh`, do not hand-edit the package.
      //
      // This calls PATCH /users/{id}, which is the ADMIN endpoint: it
      // requires `manage all`, i.e. System scope, so it already returns 403
      // for every ordinary user editing their own profile. The backend has a
      // self-service PATCH /users/profile that always targets req.user.id and
      // needs only `update user`, which every seeded role holds — but it
      // post-dates the last client generation, so there is no method for it
      // yet.
      final response = await api.getUserApi().userControllerUpdate(
            id: userId,
            updateUserDto: request,
          );
      return response.data!;
    },
    onSuccess: (data, variables, context) {
      queryClient.invalidateQueries(QueryKeys.visits(null));
      onSuccess?.call();
    },
    onError: (error, variables, context) => onError?.call(error.toString()),
  );
}

UseMutationResult<VisitResponseData, dynamic, UpdateVisitDto> useUpdateVisit(
  String visitId, {
  void Function()? onSuccess,
  void Function(String errorMessage)? onError,
}) {
  final api = useEsApiClient();
  final queryClient = useQueryClient();
  final projectId = useCurrentProjectId();

  return useMutation(
    (updateVisitDto) async {
      if (projectId == null) throw Exception('Visit ID is required');
      if (visitId.isEmpty) throw Exception('Visit ID is required');

      final response = await api.getProjectsApi().projectsControllerUpdateVisit(
          visitId: visitId,
          projectId: projectId,
          updateVisitDto: updateVisitDto);
      return response.data!.data;
    },
    onSuccess: (data, variables, context) {
      queryClient.invalidateQueries(
        QueryKeys.scheduledVisits(
          null,
          assignedTo: true,
          status: 'upcoming',
        ),
      );
      queryClient.invalidateQueries(
        QueryKeys.completedVisits(null),
      );
      onSuccess?.call();
    },
    onError: (error, variables, context) {
      final errorMessage = error is Exception
          ? error.toString().replaceAll('Exception: ', '')
          : 'Failed to update visit status';
      onError?.call(errorMessage);
    },
  );
}

UseMutationResult<SiteResponseData, dynamic, CreateSiteDto> useCreateSite({
  void onSuccess()?,
  CreateSiteDto? createSiteDto,
  void Function(String errorMessage)? onError,
}) {
  final api = useEsApiClient();
  final projectId = useCurrentProjectId();
  final queryClient = useQueryClient();
  return useMutation(
    (createSiteDto) async {
      if (projectId == null) throw Exception("No active project");
      final response = await api.getProjectsApi().projectsControllerCreateSite(
            projectId: projectId,
            createSiteDto: createSiteDto,
          );
      if (response.data == null &&
          (response.statusCode == 400 || response.statusCode == 500)) {
        final errorMsg = response.data?.message ?? 'Failed to create site';
        onError?.call(errorMsg);
        throw Exception(errorMsg);
      }
      return response.data!.data;
    },
    // onSuccess: (p0, p1, p2) => onSuccess?.call(),
    onSuccess: (data, variables, context) {
      queryClient.invalidateQueries(QueryKeys.sites(projectId));
      onSuccess?.call();
    },
    onError: (error, variables, context) {
      String errorMessage = 'Something went wrong';
      if (error is DioException) {
        errorMessage =
            error.response?.data?['message'] ?? error.message ?? errorMessage;
      } else if (error is Exception) {
        final msg = error.toString().replaceAll('Exception: ', '');
        if (msg.isNotEmpty) {
          errorMessage = msg;
        }
      }
      onError?.call(errorMessage);
    },
  );
}

UseMutationResult<SiteResponseData, dynamic, UpdateSiteDto> useUpdateSite({
  required String siteId,
  void Function()? onSuccess,
  UpdateSiteDto? updateSiteDto,
  void Function(String errorMessage)? onError,
}) {
  final api = useEsApiClient();
  final projectId = useCurrentProjectId();

  return useMutation(
    (updateSiteDto) async {
      if (projectId == null) throw Exception("No active project");

      final response = await api.getProjectsApi().projectsControllerUpdateSite(
            siteId: siteId,
            projectId: projectId,
            updateSiteDto: updateSiteDto,
          );

      if (response.data == null &&
          (response.statusCode == 400 || response.statusCode == 500)) {
        final errorMsg = response.data?.message ?? 'Failed to update site';
        onError?.call(errorMsg);
        throw Exception(errorMsg);
      }

      // getSiteById and getSiteVisits answer from their caches first, which
      // now hold the site and its visits as they were before this update; a
      // new plan or collector replaces and reassigns the visits. Dropping
      // them makes the refetches that follow read both from the server.
      await ApiCache.clear(siteByIdCacheKey(projectId, siteId));
      await ApiCache.clear(siteVisitsCacheKey(projectId, siteId));

      return response.data!.data;
    },
    onSuccess: (data, variables, context) {
      onSuccess?.call();
    },
    onError: (error, variables, context) {
      String errorMessage = 'Something went wrong';

      if (error is DioException) {
        errorMessage =
            error.response?.data?['message'] ?? error.message ?? errorMessage;
      } else if (error is Exception) {
        final msg = error.toString().replaceAll('Exception: ', '');
        if (msg.isNotEmpty) {
          errorMessage = msg;
        }
      }

      onError?.call(errorMessage);
    },
  );
}

// UseMutationResult<SiteResponseData, void, UpdateSiteDto> useUpdateSite({
//   required String siteId,
//   void onSuccess()?,
//   UpdateSiteDto? updateSiteDto,
//   void Function(String errorMessage)? onError,
// }) {
//   final api = useEsApiClient();
//   final projectId = useCurrentProjectId();
//   return useMutation(
//     (updateSiteDto) async {
//       if (projectId == null) throw Exception("No active project");
//       final response = await api.getProjectsApi().projectsControllerUpdateSite(
//             siteId: siteId,
//             projectId: projectId,
//             updateSiteDto: updateSiteDto,
//           );
//       if (response.data == null &&
//           (response.statusCode == 400 || response.statusCode == 500)) {
//         onError?.call(response.data?.message ?? 'Failed to update site');
//       }
//       return response.data!.data;
//     },
//     onSuccess: (p0, p1, p2) => onSuccess?.call(),
//     onError: (error, variables, context) =>
//         onError?.call("Something went wrong"),
//   );
// }

// generic function for offline caching
UseQueryResult<List<T>, dynamic> useOfflineFirstListQuery<T>(
  List<String> queryKey,
  Future<List<T>> Function() fetchFn,
  Future<List<T>> Function() cacheGetter,
  Future<void> Function(List<T>) cacheSetter,
) {
  return useQuery(
    queryKey,
    () async {
      try {
        final data = await fetchFn();

        await cacheSetter(data);

        return data;
      } catch (e) {
        print("Failed to fetch $T from API: $e");

        return await cacheGetter();
      }
    },
    staleDuration: const Duration(days: 7),
    cacheDuration: const Duration(days: 30),
    enabled: true,
  );
}

// ============== Offline data layer added ===========

UseQueryResult<List<RegionResponseData>, dynamic> useRegions(String type,
    {String? parentId}) {
  final api = useEsApiClient();

  return useQuery(
    QueryKeys.regions(type, parentId: parentId),
    () async {
      // Try to fetch from network first
      try {
        final response = await api.getRegionApi().regionControllerFindAll(
              type: type,
              select:
                  "id,regionType,localName,name,lgdCode,createdAt,updatedAt",
            );

        final List<RegionResponseData> data =
            response.data?.data.toList() ?? [];

        // Cache for future use
        if (type == 'state') {
          await DatabaseService.saveStates(data);
        } else if (type == 'district' && parentId != null) {
          await DatabaseService.saveDistricts(parentId, data);
        }

        return data;
      } catch (e) {
        // On failure, fallback to cache
        if (type == 'state') {
          return await DatabaseService.getStatesFromCache();
        } else if (type == 'district' && parentId != null) {
          return await DatabaseService.getDistrictsFromCache(parentId);
        }
        return [];
      }
    },
    enabled: true,
    staleDuration: Duration(days: 7),
    cacheDuration: Duration(days: 30),
  );
}

// UseQueryResult<List<RegionResponseData>, dynamic> useRegions(String type,
//     {String? parentId}) {
//   final api = useEsApiClient();
//   return useQuery(
//     QueryKeys.regions(type, parentId: parentId),
//     () async {
//       final region = await api.getRegionApi().regionControllerFindAll(
//             type: type,
//             select: "id,regionType,localName,name,lgdCode,createdAt,updatedAt",
//           );
//       return region.data?.data.toList() ?? [];
//     },
//     enabled: true,
//   );
// }

UseQueryResult<RegionResponseData, dynamic> useDistricts({String? parentId}) {
  final api = useEsApiClient();
  return useQuery(
    QueryKeys.regions('district', parentId: parentId),
    () async {
      try {
        // Online: Fetch fresh district data
        final response = await api.getRegionApi().regionControllerFindOne(
              id: parentId as String,
            );
        final RegionResponseData district =
            response.data?.data ?? RegionResponseData();

        // Cache districts by parentId
        await DatabaseService.saveDistricts(parentId, [district]);

        return district;
      } catch (e) {
        // Offline: Load from Hive cache
        if (parentId != null) {
          final cachedDistricts =
              await DatabaseService.getDistrictsFromCache(parentId);
          return cachedDistricts.isNotEmpty
              ? cachedDistricts.first
              : RegionResponseData();
        }
        return RegionResponseData();
      }
    },
    enabled: parentId != null,
    staleDuration: Duration(days: 7),
    cacheDuration: Duration(days: 30),
  );
}

// UseQueryResult<RegionResponseData, dynamic> useDistricts({String? parentId}) {
//   final api = useEsApiClient();
//   return useQuery(
//     QueryKeys.regions('district', parentId: parentId),
//     () async {
//       final region = await api.getRegionApi().regionControllerFindOne(
//             id: parentId as String,
//           );
//       print('region.data?.data: ${region.data?.data}');
//       return region.data?.data ?? RegionResponseData();
//     },
//     enabled: true,
//   );
// }

UseQueryResult<List<User>, dynamic> useCollectors(
  String? projectId,
) {
  final api = useEsApiClient();
  final profile = useProfile();

  return useQuery(
    enabled: projectId?.isNotEmpty ?? false,
    QueryKeys.collectors(projectId),
    () async {
      try {
        final response =
            await api.getProjectsApi().projectsControllerGetMembers(
                  projectId: projectId as String,
                );
        final List<User> data = response.data?.data.toList() ?? [];

        await DatabaseService.saveCollectors(projectId, data);

        return data;
      } catch (e) {
        if (projectId != null) {
          final cached =
              await DatabaseService.getCollectorsFromCache(projectId);
          if (cached.isNotEmpty) {
            print('Using cached collectors');
            final currentUser = profile.data;

            if (currentUser != null) {
              final filtered =
                  cached.where((c) => c.id == currentUser.id).toList();

              if (filtered.isNotEmpty) {
                print('Only current user shown from cached list');
                return filtered;
              }
            }

            print('No match found in cached list. Showing all cached.');
            return cached;
          }
        }

        final currentUser = profile.data;
        if (currentUser != null) {
          print('No cached data. Falling back to current user only.');
          return [
            User((b) => b
              ..id = currentUser.id
              ..firstName = currentUser.firstName
              ..lastName = currentUser.lastName
              ..email = currentUser.email),
          ];
        }

        print('Error loading collectors: $e. No fallback available.');
        return [];
      }
    },
    staleDuration: Duration(days: 7),
    cacheDuration: Duration(days: 30),
  );
}

// UseQueryResult<List<UserResponseType>, dynamic> useCollectors(
//   String? projectId,
// ) {
//   final api = useEsApiClient();
//   return useQuery(
//     enabled: projectId?.isNotEmpty ?? false,
//     QueryKeys.collectors(projectId),
//     () async {
//       final response =
//           await api.getProjectsApi().projectsControllerGetProjectCollectors(
//                 projectId: projectId as String,
//               );
//       return response.data?.data.toList() ?? [];
//     },
//   );
// }

void useCacheAllDistricts() {
  final api = useEsApiClient();
  final stateQuery = useRegions('state');

  useEffect(() {
    Future<void> cacheDistrictsForAllStates() async {
      final states = await DatabaseService.getStatesFromCache();
      if (states.isEmpty) return;

      print("Pre-caching districts for ${states.length} states...");

      for (final state in states) {
        final districtBoxKeyExists =
            await DatabaseService.areDistrictsCached(state.id);

        if (!districtBoxKeyExists) {
          try {
            final response = await api.getRegionApi().regionControllerFindOne(
                  id: state.id,
                );
            final districtData = [response.data?.data ?? RegionResponseData()];
            await DatabaseService.saveDistricts(state.id, districtData);
            print("Cached districts for state: ${state.name}");
          } catch (e) {
            print("Failed to cache districts for state: ${state.name}: $e");
          }
        }
      }
    }

    if (stateQuery.isSuccess && !stateQuery.isLoading) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        cacheDistrictsForAllStates();
      });
    }

    return null;
  }, [stateQuery.isSuccess]);
}

// ============== Offline data layer added ===========

UseQueryResult<List<RoleResponse>, dynamic> useTeamRoles() {
  final api = useEsApiClient();
  final projectId = useCurrentProjectId();
  return useQuery(
    enabled: projectId?.isNotEmpty ?? false,
    QueryKeys.teamRoles(projectId),
    () async {
      final response =
          await api.getProjectsApi().projectsControllerGetTeamRoles(
                projectId: projectId as String,
              );
      return response.data?.data.toList() ?? [];
    },
  );
}

UseMutationResult<TeamMemberListResponse, dynamic, CreateMembersListDto>
    useAddNewTeamMembers(
  String? teamId, {
  void Function(TeamMemberListResponse response)? onSuccess,
  void Function(String errorMessage)? onError,
}) {
  final api = useEsApiClient();
  final queryClient = useQueryClient(); // To invalidate queries on success

  return useMutation(
    (CreateMembersListDto createMembersListDto) async {
      if (teamId == null || teamId.isEmpty) {
        throw Exception("Team ID is required to add members.");
      }

      // Make the API call
      // The route is now scoped by project (POST /projects/{projectId}/
      // members-list) and the team is named in the body, which the backend
      // checks belongs to that project. Take the project id from the DTO so
      // the path and the body can never disagree.
      final response =
          await api.getProjectsApi().projectsControllerAddMembersList(
                projectId: createMembersListDto.project,
                createMembersListDto: createMembersListDto,
              );

      // Check for API level success response
      if (response.data == null || response.statusCode != 201) {
        // 201 Created typically
        final apiError =
            response.data?.message ?? 'Failed to add members from API.';
        throw Exception(apiError);
      }

      return response.data!; // Return the successful response data
    },
    onSuccess: (data, variables, context) {
      // Invalidate queries that show team members to refresh the list
      queryClient.invalidateQueries(QueryKeys.teamMembersFieldView(teamId));
      // Potentially invalidate other relevant queries

      onSuccess?.call(data);
    },
    onError: (error, variables, context) {
      print("Error adding team members: $error");
      String errorMessage;
      if (error is DioException) {
        errorMessage = error.response?.data?['message'] ??
            error.message ??
            'Network error adding members.';
      } else {
        errorMessage = error.toString().replaceAll('Exception: ', '');
      }
      onError?.call(errorMessage);
    },
  );
}

Future<Map<String, double>?> getCoordinatesFromAddress(
    String district, String state) async {
  final dio = Dio();
  final response = await dio.get(
    'https://nominatim.openstreetmap.org/search',
    queryParameters: {
      'format': 'json',
      'q': '$district,$state',
    },
    options: Options(
      headers: {
        'User-Agent': 'DhariniApp/1.0 (dharini-support@artpark.in)',
      },
    ),
  );

  if (response.data is List && response.data.isNotEmpty) {
    final location = response.data[0];

    final lat = location['lat'];
    final lon = location['lon'];

    double parsedLat;
    double parsedLon;

    if (lat is String) {
      parsedLat = double.parse(lat);
    } else if (lat is double) {
      parsedLat = lat;
    } else {
      throw TypeError();
    }

    if (lon is String) {
      parsedLon = double.parse(lon);
    } else if (lon is double) {
      parsedLon = lon;
    } else {
      throw TypeError();
    }

    final result = {
      'latitude': parsedLat,
      'longitude': parsedLon,
    };

    print('Got coordinates: $result'); // Debug print
    return result;
  }
  return null;
}

UseQueryResult<Map<String, double>?, dynamic> useLocationCoordinates(
  String? district,
  String? state,
) {
  final enabled = district != null &&
      district.isNotEmpty &&
      state != null &&
      state.isNotEmpty;

  return useQuery<Map<String, double>?, dynamic>(
    ['location', district, state],
    () => getCoordinatesFromAddress(district!, state!),
    enabled: enabled,
  );
}

UseQueryResult<ValidateBarcodeMessage?, dynamic> useValidateBarcode(
  String? barcode,
) {
  final api = useEsApiClient();
  final projectId = useCurrentProjectId();

  return useQuery(
    enabled: projectId?.isNotEmpty ?? false,
    QueryKeys.validateBarcode(projectId, barcode),
    () async {
      final response =
          await api.getProjectsApi().projectsControllerValidateBarcode(
                projectId: projectId as String,
                barcode: barcode as String,
              );
      return response.data;
    },
  );
}

UseMutationResult<bool, dynamic, SubmitVisitDto> useSubmitVisit(
  String projectId,
  String visitId, {
  void Function()? onSuccess,
  void Function(String errorMessage)? onError,
}) {
  final api = useEsApiClient();
  final queryClient = useQueryClient();

  return useMutation(
    (submitVisitDto) async {
      if (visitId.isEmpty) throw Exception('Visit ID is required');
      final response = await api.getProjectsApi().projectsControllerSubmitVisit(
            projectId: projectId,
            visitId: visitId,
            submitVisitDto: submitVisitDto,
          );

      // Check for error response
      if (response.data == null || response.statusCode != 200) {
        // Extract error message from response data
        final errorMessage = response.data?.message ?? 'Failed to submit visit';
        throw Exception(errorMessage);
      }
      return response.data?.success ?? false;
    },
    onSuccess: (data, variables, context) {
      // Invalidate relevant queries to refresh the data
      queryClient.invalidateQueries(QueryKeys.visits(null));
      queryClient.invalidateQueries(
        QueryKeys.scheduledVisits(
          null,
          assignedTo: true,
          status: 'upcoming',
        ),
      );
      queryClient.invalidateQueries(QueryKeys.completedVisits(null));
      onSuccess?.call();
    },
    onError: (error, variables, context) {
      print('Error submitting visit: $error');
      String errorMessage;

      if (error is DioException) {
        // Extract error message from DioException response
        final responseData = error.response?.data;
        errorMessage = responseData?['message'] ?? 'Failed to submit visit';

        // Clean up the error message if needed
        if (errorMessage.startsWith('Error: BadRequestException: ')) {
          errorMessage =
              errorMessage.replaceFirst('Error: BadRequestException: ', '');
        }
      } else {
        errorMessage = error.toString().replaceAll('Exception: ', '');
      }

      onError?.call(errorMessage);
    },
  );
}

Future<UploadMultipleFilesResponse> uploadImages(
  EsClient client,
  List<String> imagePaths,
) async {
  try {
    print('Uploading images: $imagePaths'); // Debug print

    // Compress images before uploading
    final List<String> compressedPaths = await Future.wait(
      imagePaths.map((path) => PhotoUploadManager.compressImage(path)),
    );
    print('Compressed image paths: $compressedPaths');

    // Create a list of MultipartFile objects from the compressed image paths
    final List<MultipartFile> multipartFiles = await Future.wait(
      compressedPaths.map((path) async {
        String fileName = path.split('/').last;
        if (kIsWeb) {
          final dio = Dio();
          final response = await dio.get<List<int>>(
            path,
            options: Options(responseType: ResponseType.bytes),
          );
          final bytes = response.data!;
          if (!fileName.contains('.')) {
            final contentType = response.headers.value('content-type') ?? '';
            String extension = '.jpg';
            if (contentType.contains('image/png')) {
              extension = '.png';
            } else if (contentType.contains('image/webp')) {
              extension = '.webp';
            } else if (contentType.contains('image/gif')) {
              extension = '.gif';
            } else if (contentType.contains('image/heic')) {
              extension = '.heic';
            }
            fileName = '$fileName$extension';
          }
          return MultipartFile.fromBytes(
            bytes,
            filename: fileName,
          );
        } else {
          return await MultipartFile.fromFile(
            path,
            filename: fileName,
          );
        }
      }),
    );

    // Convert the list to BuiltList
    final files = BuiltList<MultipartFile>.from(multipartFiles);

    // Make the request with form data
    final response = await client.getMediaApi().mediaControllerUploadImages(
          files: files,
          validateStatus: (status) => status! < 500,
        );

    print('Upload response details:');
    print('- Status code: ${response.statusCode}');
    print('- Status message: ${response.statusMessage}');
    print('- Response headers: ${response.headers}');

    return response.data!;
  } catch (e) {
    print('Error uploading images: $e'); // Debug print
    if (e is DioException) {
      print('Dio error details:');
      print('- Type: ${e.type}');
      print('- Message: ${e.message}');
      print('- Response: ${e.response?.data}');
      print('- Status code: ${e.response?.statusCode}');
      print('- Request options: ${e.requestOptions.data}');
      print('- Request headers: ${e.requestOptions.headers}');
    }
    rethrow;
  }
}

UseMutationResult<UploadMultipleFilesResponse, dynamic, List<String>>
    useUploadImages({
  /// Called when upload succeeds.
  /// [submittedPaths] — the local file paths that were passed to [mutate].
  /// [urls] — the remote URLs returned by the server.
  void Function(List<String> submittedPaths, List<String> urls)? onSuccess,

  /// Called when upload fails.
  /// [submittedPaths] — the local file paths that were passed to [mutate].
  /// [errorMessage] — human-readable error description.
  void Function(List<String> submittedPaths, String errorMessage)? onError,
}) {
  final api = useEsApiClient();

  return useMutation(
    (imagePaths) => uploadImages(api, imagePaths),
    onSuccess: (data, variables, context) {
      print('Upload success details:');
      print('- Success: ${data.success}');
      print('- Message: ${data.message}');
      print('- Number of files: ${data.data.length}');
      print('- File URLs: ${data.data.map((f) => f.fileUrl).join(', ')}');

      // Extract file URLs from the response data
      final urls = data.data
          .where((result) => result.fileUrl != null)
          .map((result) => result.fileUrl!)
          .toList();
      print('Extracted URLs: $urls');
      // Forward the submitted paths (variables) so callers can surgically
      // remove only the completed batch from their uploading-set state.
      onSuccess?.call(variables, urls);
    },
    onError: (error, variables, context) {
      print('Upload error details:');
      print('- Error: $error');
      if (error is DioException) {
        print('- Dio error type: ${error.type}');
        print('- Dio error message: ${error.message}');
        print('- Dio error response: ${error.response?.data}');
        print('- Dio error status: ${error.response?.statusCode}');
      }
      final errorMessage = error is Exception
          ? error.toString().replaceAll('Exception: ', '')
          : 'Failed to upload images';
      // Forward the submitted paths (variables) so callers know exactly
      // which images failed and can offer per-image retry.
      onError?.call(variables, errorMessage);
    },
  );
}

/// Logs the user out and clears local state that must not leak to the next
/// person who logs into this device — normal in field work, and now a
/// cross-organisation leak now that a project belongs to a workspace.
///
/// [queryClient] is a plain parameter rather than fetched via
/// `useQueryClient()` in here, because this function itself is not a hook —
/// it runs from the mutate callback at tap time, not during a widget's
/// build. Calling a hook there (the previous implementation did) throws.
/// `useLogout()` below captures it correctly, during build.
///
/// Pending-submission handling: unsynced field data (`pendingSubmissions`) is
/// deliberately NEVER cleared here. Losing a collector's day of work to a
/// logout tap is worse than the leak it would close. Instead, this makes one
/// best-effort attempt to flush the queue — using a throwaway `SyncService`,
/// while the auth token is still valid — before wiping anything, bounded by a
/// timeout so logout never hangs on a bad connection. Whatever the flush
/// can't deliver (offline, request failed) simply stays queued; it is picked
/// up by the ordinary sync path next time anyone is online, regardless of
/// who is logged in — the queue itself is tenant-tagged per record (see
/// `PendingVisitSubmission.projectId`), so a later flush still submits each
/// item to the right project even if a different user is logged in by then.
Future<void> logout(EsClient client, {QueryClient? queryClient}) async {
  final storage = FlutterSecureStorage();

  try {
    final pending = DatabaseService.getAllPendingSubmissions();
    if (pending.isNotEmpty) {
      final projectId = await TenantSelectionService.getSelectedProjectId();
      final syncService = SyncService(client, null,
          queryClient: queryClient, projectId: projectId);
      try {
        await syncService.sync().timeout(const Duration(seconds: 20));
      } finally {
        syncService.dispose();
      }
    }
  } catch (e) {
    debugPrint('[logout] Best-effort pre-logout sync failed/skipped: $e');
  }

  await storage.delete(key: 'es_access_token');
  applyAuthToken(client, '');
  // Drop every in-memory query, not just mark them stale. fquery matches
  // keys by prefix (there is no '*' wildcard), so the empty key matches all.
  // Invalidating would leave the data in place, and `QueryKeys.projects`
  // isn't user-namespaced — the next user to log in would inherit this
  // user's resolved project.
  queryClient?.removeQueries(const []);

  // Clear cross-user local state. `pendingSubmissions` is intentionally
  // excluded — see the doc comment above.
  await ApiCache.clearAll();
  try {
    final collectorsBox = Hive.isBoxOpen(DatabaseService.collectors)
        ? Hive.box(DatabaseService.collectors)
        : await Hive.openBox(DatabaseService.collectors);
    await collectorsBox.clear();
  } catch (e) {
    debugPrint('[logout] Failed to clear collectors box: $e');
  }
  await TenantSelectionService.clear();
}

UseMutationResult<void, dynamic, void> useLogout() {
  final api = useEsApiClient();
  final queryClient = useQueryClient();
  return useMutation(
    (_) => logout(api, queryClient: queryClient),
  );
}

// <------ offline first implementations ----->

DayOfWeek? dayOfWeekFromString(String value) {
  return DayOfWeek.values.firstWhere(
    (e) => e.name.toLowerCase() == value.toLowerCase(),
    orElse: () => DayOfWeek.sunday,
  );
}

// Create Site offline
Future<String> createLocalSite({
  required String name,
  required String address,
  required String siteOwnerName,
  required String siteOwnerNumber,
  required SiteType siteType,
  required String farmType, // now a plain String, not FarmType enum
  String? siteSubType,
  List<Disease>? diseases,
  required int pinCode,
  required int workerNumber,
  required String comment,
  required String time,
  required int duration,
  required int frequencyInterval,
  required List<String> selectedDays,
  required String regionId,
  required String collectionCollector,
  required List<String> photoUrls,
  required double latitude,
  required double longitude,
  Date? collectionStartDate,
  // 'true' / 'false' as a string; older APKs parse this field as String
  String? collectionConsent,
}) async {
  final siteCode = "5${Random().nextInt(1000000).toString().padLeft(6, '0')}";
  final localSiteId = DatabaseService.generateLocalId();

  final siteData = SiteResponseData((b) {
    b
      ..id = localSiteId
      ..createdAt = DateTime.now().toUtc()
      ..name = name
      ..address = address
      ..siteOwnerName = siteOwnerName
      ..siteOwnerNumber = siteOwnerNumber
      ..siteType = siteType
      ..farmType = farmType
      ..siteSubType = siteSubType
      ..pinCode = pinCode
      ..workerNumber = workerNumber
      ..comment = comment
      ..collectionConsent = collectionConsent
      ..collectionTime = time
      ..collectionDuration = duration * 30
      ..collectionFrequency = 1
      ..collectionFrequencyInterval = frequencyInterval
      ..collectionDayOfWeek
          .addAll(selectedDays.map(dayOfWeekFromString).whereType<DayOfWeek>())
      ..photos.addAll(photoUrls)
      ..siteCode = siteCode
      ..diseases.addAll(diseases ?? [])
      ..collectionCollector = (UserBuilder()..id = collectionCollector);

    b.location.replace(Location((l) => l
      ..id = DatabaseService.generateLocalId()
      ..coordinates.replace(LocationCoordinates((c) => c
        ..type = 'Point'
        ..coordinates.addAll([longitude, latitude])))));
  });

  // Save to local site storage
  final box =
      Hive.isBoxOpen('sites') ? Hive.box('sites') : await Hive.openBox('sites');
  final siteDto = Hive.isBoxOpen('siteDto')
      ? Hive.box('siteDto')
      : await Hive.openBox('siteDto');
  final serialized =
      standardSerializers.serializeWith(SiteResponseData.serializer, siteData);
  await box.put(localSiteId, serialized);
  await siteDto.put(localSiteId, {
    'regionId': regionId,
    'latitude': latitude,
    'longitude': longitude,
    'collectionCollector': collectionCollector,
  });

  // Add to sync queue
  final syncQueueBox = Hive.isBoxOpen('syncQueue')
      ? Hive.box('syncQueue')
      : await Hive.openBox('syncQueue');

  final createSiteDto = CreateSiteDto((b) => b
    ..name = name
    ..address = address
    ..siteOwnerName = siteOwnerName
    ..siteOwnerNumber = siteOwnerNumber
    ..siteType = siteType
    ..farmType = farmType
    ..siteSubType = siteSubType
    ..pinCode = pinCode
    ..workerNumber = workerNumber
    ..comment = comment
    ..collectionConsent = collectionConsent
    ..collectionTime = time
    ..collectionDuration = duration * 30
    ..collectionFrequency = 1
    ..collectionFrequencyInterval = frequencyInterval
    ..collectionDayOfWeek = ListBuilder(
        selectedDays.map(dayOfWeekFromString).whereType<DayOfWeek>())
    ..photos = ListBuilder(photoUrls)
    ..siteCode = siteCode
    ..regionId = regionId
    ..latitude = latitude
    ..longitude = longitude
    ..collectionCollector = collectionCollector
    ..diseaseIds =
        diseases != null ? ListBuilder(diseases.map((d) => d.id)) : null
    // Convert Date to UTC DateTime for serialization
    ..collectionStartDate = collectionStartDate?.toDateTime(utc: true));

  // Tag the entry with whatever project/workspace is selected right now —
  // that's the project this site is actually being captured against. This is
  // a property of the record, not of whatever happens to be selected when
  // the queue is flushed later (see syncChangesToServerQueue, which submits
  // each entry against its own recorded project for exactly this reason).
  // Pre-upgrade entries (written before this tag existed) simply have no
  // 'projectId' key, which syncChangesToServerQueue already treats as "fall
  // back to the caller's current project" — the only project such an entry
  // could have been captured against.
  final tenantProjectId = await TenantSelectionService.getSelectedProjectId();
  final tenantWorkspaceId =
      await TenantSelectionService.getSelectedWorkspaceId();

  await syncQueueBox.add({
    'type': 'site',
    'id': localSiteId,
    'timestamp': DateTime.now().toUtc().toIso8601String(),
    'payload': standardSerializers.serializeWith(
        CreateSiteDto.serializer, createSiteDto),
    'projectId': tenantProjectId,
    'workspaceId': tenantWorkspaceId,
  });

  return localSiteId;
}

// Create Visits offline
Future<String> createLocalVisit({
  required String siteId,
  required String collectorId,
  required DateTime scheduledAt,
  DateTime? visitedAt,
  String? comment,
  // Set for the visit a new site starts with: on sync it attaches to the
  // plan's earliest overdue round instead of posting a second visit.
  bool attachToOverdue = false,
}) async {
  final localVisitId = DatabaseService.generateLocalId();

  // Load site from local Hive
  final siteBox =
      Hive.isBoxOpen('sites') ? Hive.box('sites') : await Hive.openBox('sites');
  final siteSerialized = siteBox.get(siteId);

  if (siteSerialized == null) {
    throw Exception("Site data not found in local storage for id: $siteId");
  }

  final siteData = standardSerializers.deserializeWith(
    SiteResponseData.serializer,
    siteSerialized,
  );

  if (siteData == null) {
    throw Exception("Failed to deserialize site data for id: $siteId");
  }

  final now = DateTime.now().toUtc();

  final visit = VisitResponseData((b) => b
    ..id = localVisitId
    ..site.replace(siteData.toVisitSiteData())
    ..collector.replace(User((b) => b..id = collectorId))
    ..visitScheduledAt = scheduledAt
    ..visitedAt = visitedAt
    ..visitStatus = VisitStatus.upcoming
    ..comment = comment
    ..isCompleted = false
    ..createdAt = now
    ..updatedAt = now
    ..samples = ListBuilder<VisitSampleData>());

  final visitBox = Hive.isBoxOpen('visits')
      ? Hive.box('visits')
      : await Hive.openBox('visits');

  final serializedVisit =
      standardSerializers.serializeWith(VisitResponseData.serializer, visit);
  await visitBox.put(localVisitId, serializedVisit);

  // Prepare CreateVisitDto for syncing
  final createVisitDto = CreateVisitDto((b) => b
    ..siteId = siteId
    ..collectorId = collectorId
    ..visitScheduledAt = scheduledAt.toUtc().toIso8601String()
    ..visitedAt = visitedAt != null ? visitedAt.toUtc().toIso8601String() : null
    ..comment = comment ?? '');

  final syncQueueBox = Hive.isBoxOpen('syncQueue')
      ? Hive.box('syncQueue')
      : await Hive.openBox('syncQueue');

  // See the matching comment in createLocalSite: the entry is tagged with
  // whatever project/workspace is selected at capture time, and
  // syncChangesToServerQueue submits it against that tag regardless of what
  // is selected later when the queue is flushed.
  final tenantProjectId = await TenantSelectionService.getSelectedProjectId();
  final tenantWorkspaceId =
      await TenantSelectionService.getSelectedWorkspaceId();

  await syncQueueBox.add({
    'type': 'visit',
    'id': localVisitId,
    'timestamp': DateTime.now().toUtc().toIso8601String(),
    'payload': standardSerializers.serializeWith(
        CreateVisitDto.serializer, createVisitDto),
    'projectId': tenantProjectId,
    'workspaceId': tenantWorkspaceId,
    'attachToOverdue': attachToOverdue,
  });

  print('[Local] Visit saved and queued: $localVisitId');
  return localVisitId;
}

// sync all server sites to local db
// Future<void> syncNetworkSitesToHive(List<SiteResponseData> networkSites) async {
//   final box =
//       Hive.isBoxOpen('sites') ? Hive.box('sites') : await Hive.openBox('sites');

//   for (final site in networkSites) {
//     final serialized =
//         standardSerializers.serializeWith(SiteResponseData.serializer, site);
//     await box.put(site.id, serialized);
//   }
// }
// sync all server sites to local db
Future<void> syncNetworkSitesToHive(List<SiteResponseData> networkSites) async {
  final box =
      Hive.isBoxOpen('sites') ? Hive.box('sites') : await Hive.openBox('sites');

  print(
      '[HiveSync] 🔄 Starting sync of ${networkSites.length} sites to Hive...');

  int successCount = 0;
  int failureCount = 0;

  for (final site in networkSites) {
    try {
      final serialized =
          standardSerializers.serializeWith(SiteResponseData.serializer, site);
      await box.put(site.id, serialized);
      successCount++;
    } catch (e, stackTrace) {
      failureCount++;
      print('[HiveSync] ❌ Failed to sync site ${site.id}: $e');
      debugPrintStack(stackTrace: stackTrace);
    }
  }

  // Optional: verification
  final storedKeys = box.keys.toSet();
  final expectedKeys = networkSites.map((s) => s.id).toSet();
  final missingKeys = expectedKeys.difference(storedKeys);

  if (missingKeys.isEmpty) {
    print('[HiveSync] ✅ All ${networkSites.length} sites successfully stored.');
  } else {
    print(
        '[HiveSync] ⚠️ ${missingKeys.length} sites missing from Hive after sync.');
    for (final key in missingKeys) {
      print('[HiveSync] ⚠️ Missing site ID: $key');
    }
  }

  print(
      '[HiveSync] ✅ Sync complete. Success: $successCount, Failed: $failureCount');
}

// prepare local site dto request
CreateSiteDto convertToCreateSiteDto(
  SiteResponseData site,
  Map<String, dynamic> meta,
) {
  return CreateSiteDto((b) => b
    ..name = site.name
    ..farmType = site.farmType
    ..siteType = site.siteType
    ..siteOwnerName = site.siteOwnerName
    ..siteOwnerNumber = site.siteOwnerNumber
    ..workerNumber = site.workerNumber
    ..siteCode = site.siteCode
    ..address = site.address
    ..pinCode = site.pinCode
    ..comment = site.comment
    ..collectionFrequency = site.collectionFrequency
    ..collectionFrequencyInterval = site.collectionFrequencyInterval
    ..collectionDayOfWeek = ListBuilder(site.collectionDayOfWeek ?? [])
    ..collectionTime = site.collectionTime
    ..collectionDuration = site.collectionDuration
    ..regionId = meta['regionId'] as String
    ..latitude = meta['latitude'] as double
    ..longitude = meta['longitude'] as double
    ..collectionCollector = meta['collectionCollector'] as String
    ..photos = site.photos != null
        ? ListBuilder(site.photos!)
        : ListBuilder<String>());
}

Future<void> _updatePendingSubmissionId(String localId, String serverId) async {
  try {
    final Box<PendingVisitSubmission> pendingSubmissionsBox =
        Hive.isBoxOpen('pendingSubmissions')
            ? Hive.box<PendingVisitSubmission>('pendingSubmissions')
            : await Hive.openBox<PendingVisitSubmission>('pendingSubmissions');

    final existingSubmission = pendingSubmissionsBox.get(localId);
    if (existingSubmission != null) {
      // Create a deep copy of data to update the inner ID
      final updatedData = Map<String, dynamic>.from(existingSubmission.data);
      if (updatedData.containsKey('visitData')) {
        final visitData =
            Map<String, dynamic>.from(updatedData['visitData'] as Map);
        visitData['id'] = serverId;
        updatedData['visitData'] = visitData;
      }

      final updatedSubmission = existingSubmission.copyWith(
        id: serverId,
        data: updatedData,
      );

      await pendingSubmissionsBox.put(serverId, updatedSubmission);
      await pendingSubmissionsBox.delete(localId);
      debugPrint(
          '[Sync] Updated PendingSubmission (Key & Data): $localId → $serverId');
    }
  } catch (e) {
    debugPrint('[Sync] Failed to update pending submission ID: $e');
    rethrow;
  }
}

Future<void> _updatePendingSubmissionSiteId(
    String localSiteId, String serverSiteId) async {
  try {
    final box = Hive.isBoxOpen('pendingSubmissions')
        ? Hive.box<PendingVisitSubmission>('pendingSubmissions')
        : await Hive.openBox<PendingVisitSubmission>('pendingSubmissions');

    for (var key in box.keys) {
      final item = box.get(key);
      if (item == null) continue;

      final rawData = Map<String, dynamic>.from(item.data);
      final rawVisitData = rawData['visitData'];
      if (rawVisitData != null) {
        final visitData = Map<String, dynamic>.from(rawVisitData as Map);
        if (visitData['siteId'] == localSiteId) {
          visitData['siteId'] = serverSiteId;
          final updated = item.copyWith(data: {
            ...rawData,
            'visitData': visitData,
          });
          await box.put(key, updated);
          debugPrint('[Sync] Updated siteId in pendingSubmission: $key');
        }
      }
    }
  } catch (e) {
    debugPrint('[Sync] Failed to update pending submission siteId: $e');
  }
}

/// Result of syncChangesToServerQueue operation
class SyncQueueResult {
  final int sitesSynced;
  final int visitsSynced;
  final int visitsSkipped;
  final List<String> errors;

  SyncQueueResult({
    required this.sitesSynced,
    required this.visitsSynced,
    required this.visitsSkipped,
    this.errors = const [],
  });

  bool get hasErrors => errors.isNotEmpty;
  int get totalSynced => sitesSynced + visitsSynced;

  @override
  String toString() =>
      'SyncQueueResult(sites: $sitesSynced, visits: $visitsSynced, skipped: $visitsSkipped, errors: ${errors.length})';
}

// Tail of the queue-sync chain. Every caller (SyncService, Home, the collector
// landing screen, create_site) drains the same 'syncQueue' box from a snapshot
// taken when its run starts, and only removes an entry once the server has
// answered, so two overlapping runs POST the same site or visit twice. Runs go
// one at a time instead, each starting from a fresh snapshot.
Future<void> _queueSyncTail = Future<void>.value();

// synchronizer for all changes (local to server)
//
// Each `syncQueue` entry carries its own `projectId` (tagged at enqueue time
// in createLocalSite/createLocalVisit — see the comments there). This
// function submits every entry against ITS OWN tagged project, never against
// [fallbackProjectId] alone — captured data belongs to the project it was
// captured in, not to whatever the UI happens to have selected when the
// queue is later flushed. Without this, a collector who creates sites
// offline in Project A, switches to Project B, and regains signal would have
// A's sites silently created inside B.
//
// [fallbackProjectId] is used only for entries with no recorded project —
// rows written by an app version that predates this tag. It's the caller's
// currently-selected project, which is also the only project such an entry
// could have been captured against (the app was single-project at the time
// those rows were written).
Future<SyncQueueResult> syncChangesToServerQueue(
    EsClient api, String fallbackProjectId) {
  final run = _queueSyncTail
      .then((_) => _syncChangesToServerQueue(api, fallbackProjectId));
  // A failed run must not stop the ones queued behind it.
  _queueSyncTail = run.then<void>((_) {}, onError: (Object _) {});
  return run;
}

Future<SyncQueueResult> _syncChangesToServerQueue(
    EsClient api, String fallbackProjectId) async {
  final queueBox = Hive.isBoxOpen('syncQueue')
      ? Hive.box('syncQueue')
      : await Hive.openBox('syncQueue');
  final siteBox =
      Hive.isBoxOpen('sites') ? Hive.box('sites') : await Hive.openBox('sites');
  final siteDtoBox = Hive.isBoxOpen('siteDto')
      ? Hive.box('siteDto')
      : await Hive.openBox('siteDto');
  final visitBox = Hive.isBoxOpen('visits')
      ? Hive.box('visits')
      : await Hive.openBox('visits');
  final visitIdMapBox = Hive.isBoxOpen('visitIdMap')
      ? Hive.box('visitIdMap')
      : await Hive.openBox('visitIdMap');
  final siteIdMapBox = Hive.isBoxOpen('siteIdMap')
      ? Hive.box('siteIdMap')
      : await Hive.openBox('siteIdMap');

  int sitesSynced = 0;
  int visitsSynced = 0;
  int visitsSkipped = 0;
  final List<String> errors = [];

  final queueMap = Map<dynamic, dynamic>.from(queueBox.toMap());

  // 1. Identify and prioritize items (sites first)
  final siteEntries =
      queueMap.entries.where((e) => e.value['type'] == 'site').toList();
  final visitEntries =
      queueMap.entries.where((e) => e.value['type'] == 'visit').toList();

  debugPrint(
      '[Sync] Starting ordered sync. Queue size: ${queueMap.length} (Sites: ${siteEntries.length}, Visits: ${visitEntries.length})');

  for (final entry in siteEntries) {
    final key = entry.key;
    final change = entry.value;
    final localId = change['id'];
    final payload = change['payload'];
    // The project this site was actually captured against — falls back to
    // fallbackProjectId only for pre-upgrade entries with no tag (see the
    // function doc comment above).
    final entryProjectId =
        (change['projectId'] as String?) ?? fallbackProjectId;

    debugPrint(
        '[Sync] Processing Site $localId (Key: $key, project: $entryProjectId)...');

    try {
      final dto = standardSerializers.deserializeWith(
          CreateSiteDto.serializer, payload);
      if (dto == null) throw Exception('Failed to deserialize site $localId');

      final response = await api.getProjectsApi().projectsControllerCreateSite(
            projectId: entryProjectId,
            createSiteDto: dto,
          );

      final responseData = response.data?.data;
      if (responseData == null) {
        throw Exception(response.data?.message ?? 'Null response for site');
      }

      final serverId = responseData.id;
      final serialized = standardSerializers.serializeWith(
          SiteResponseData.serializer, responseData);

      await siteBox.put(serverId, serialized);
      if (localId != serverId) {
        await siteBox.delete(localId);
        await siteDtoBox.delete(localId);
        await siteIdMapBox.put(localId, serverId);

        // Update pending submissions with new site ID
        await _updatePendingSubmissionSiteId(localId, serverId);

        debugPrint('[Sync] Synced Site: $localId → $serverId');

        // Update any PENDING visits in the queue that reference this local site
        for (final visitEntry in visitEntries) {
          final vKey = visitEntry.key;
          final vChange = visitEntry.value;
          final vPayload = vChange['payload'];
          final vDto = standardSerializers.deserializeWith(
              CreateVisitDto.serializer, vPayload);

          if (vDto?.siteId == localId) {
            final updatedDto = vDto!.rebuild((b) => b..siteId = serverId);
            final updatedPayload = standardSerializers.serializeWith(
                CreateVisitDto.serializer, updatedDto);

            final updatedChange = Map<String, dynamic>.from(vChange);
            updatedChange['payload'] = updatedPayload;
            await queueBox.put(vKey, updatedChange);
            debugPrint(
                '[Sync] Updated queued visit ${vChange['id']} with new siteId $serverId');
          }
        }
      }

      sitesSynced++;

      // Check for auto-created visits on server (to avoid duplicates). A
      // queued visit only merges into one scheduled for the day it was
      // collected; otherwise it stays queued and is posted below. A visit from
      // site creation is resolved in the visit loop, where a failed lookup
      // leaves it queued.
      try {
        final upcomingVisits = await fetchUpcomingVisits(api,
            projectId: entryProjectId, siteId: serverId);
        if (upcomingVisits.isNotEmpty) {
          for (final visitEntry in visitEntries) {
            final vKey = visitEntry.key;
            final vItem = queueBox.get(vKey);
            if (vItem == null) continue;
            if (vItem['attachToOverdue'] == true) continue;

            final vPayload = vItem['payload'];
            final vDto = standardSerializers.deserializeWith(
                CreateVisitDto.serializer, vPayload);
            if (vDto?.siteId != serverId) continue;

            final autoCreatedVisit = pickSameDayUpcomingVisit(
                upcomingVisits, DateTime.tryParse(vDto!.visitScheduledAt));
            if (autoCreatedVisit == null) {
              debugPrint(
                  '[Sync] No server visit on the day local visit ${vItem['id']} was collected; it will be posted.');
              continue;
            }

            debugPrint(
                '[Sync] Merging local visit ${vItem['id']} into server visit ${autoCreatedVisit.id}');

            final localVisitId = vItem['id'];
            final serverVisitSerialized = standardSerializers.serializeWith(
                VisitResponseData.serializer, autoCreatedVisit);

            await visitBox.put(autoCreatedVisit.id, serverVisitSerialized);
            await visitBox.delete(localVisitId);
            await visitIdMapBox.put(localVisitId, autoCreatedVisit.id);

            await _updatePendingSubmissionId(localVisitId, autoCreatedVisit.id);
            visitsSynced++;
            await queueBox.delete(vKey);
          }
        }
      } catch (e) {
        debugPrint('[Sync] Error checking/merging auto-created visits: $e');
      }

      await queueBox.delete(key);
    } catch (e) {
      final errorMessage = _formatSyncError(e);
      debugPrint('[Sync] Failed to sync site $localId: $errorMessage');
      errors.add('site $localId: $errorMessage');
    }
  }

  // --- PROCESS VISITS SECOND ---
  final claimedRoundIds = <String>{};
  for (final entry in visitEntries) {
    final key = entry.key;
    final change = queueBox.get(key);
    if (change == null) {
      continue;
    }

    final localId = change['id'];
    final payload = change['payload'];
    // The project this visit was actually captured against — falls back to
    // fallbackProjectId only for pre-upgrade entries with no tag (see the
    // function doc comment above).
    final entryProjectId =
        (change['projectId'] as String?) ?? fallbackProjectId;

    try {
      final dto = standardSerializers.deserializeWith(
          CreateVisitDto.serializer, payload);
      if (dto == null) throw Exception('Failed to deserialize visit $localId');

      if (dto.siteId.startsWith('local-')) {
        debugPrint(
            '[Sync] SKIPPING visit $localId because siteId ${dto.siteId} is still local (unresolved dependency).');
        visitsSkipped++;
        continue;
      }

      // An earlier run already merged this visit into a server visit but
      // stopped before removing its entry. Posting it again would duplicate it.
      if (visitIdMapBox.get(localId) != null) {
        debugPrint(
            '[Sync] Visit $localId was already merged into ${visitIdMapBox.get(localId)}; dropping its entry.');
        await queueBox.delete(key);
        continue;
      }

      // A visit from site creation merges into the plan's earliest overdue
      // round. A failed lookup throws to the catch below, which keeps the entry
      // queued; posting it instead would add a second visit for that round.
      if (change['attachToOverdue'] == true) {
        final round = await fetchAttachTarget(api,
            projectId: entryProjectId,
            siteId: dto.siteId,
            queuedAt: DateTime.tryParse(dto.visitScheduledAt),
            claimed: claimedRoundIds);
        if (round != null) {
          claimedRoundIds.add(round.id);
          debugPrint(
              '[Sync] Merging local visit $localId into server visit ${round.id}');

          await visitBox.put(
              round.id,
              standardSerializers.serializeWith(
                  VisitResponseData.serializer, round));
          await visitBox.delete(localId);
          await visitIdMapBox.put(localId, round.id);
          await _updatePendingSubmissionId(localId, round.id);
          visitsSynced++;
          await queueBox.delete(key);
          continue;
        }
      }

      debugPrint(
          '[Sync] Processing Visit $localId (Site: ${dto.siteId}, project: $entryProjectId)...');

      VisitResponseData? responseData;
      try {
        final response =
            await api.getProjectsApi().projectsControllerCreateVisit(
                  projectId: entryProjectId,
                  createVisitDto: dto,
                );
        responseData = response.data?.data;
        if (responseData == null) throw Exception('Null response for visit');
      } catch (visitError) {
        debugPrint(
            '[Sync] Create visit failed for $localId. Checking for auto-created visit as fallback... Error: $visitError');

        // Fallback: recover the visit a lost POST response may have created,
        // else check if the backend auto-created a visit that we missed earlier
        try {
          final autoCreatedVisit = await fetchFallbackVisit(api,
              projectId: entryProjectId,
              siteId: dto.siteId,
              queuedScheduledAt: dto.visitScheduledAt);

          if (autoCreatedVisit != null) {
            debugPrint(
                '[Sync] Found auto-created visit during fallback: ${autoCreatedVisit.id}');
            responseData = autoCreatedVisit;
          } else {
            rethrow; // No auto-created visit found, throw the original error
          }
        } catch (fallbackError) {
          debugPrint('[Sync] Fallback check also failed: $fallbackError');
          throw visitError; // Throw the original CreateVisit error
        }
      }

      final serverId = responseData.id;
      final serialized = standardSerializers.serializeWith(
          VisitResponseData.serializer, responseData);

      await visitBox.put(serverId, serialized);
      if (localId != serverId) {
        await visitBox.delete(localId);
        await visitIdMapBox.put(localId, serverId);
        await _updatePendingSubmissionId(localId, serverId);
      }

      debugPrint('[Sync] Synced Visit: $localId → $serverId');
      visitsSynced++;

      try {
        final completedCacheKey = 'visits-completed-$entryProjectId';
        final completedCached = await ApiCache.get<List<dynamic>>(
          completedCacheKey,
          (json) => (json as List?) ?? [],
        );

        if (completedCached != null) {
          final updatedCache = completedCached.map((v) {
            final visitData = standardSerializers.deserializeWith(
                VisitResponseData.serializer, v);
            if (visitData?.id == localId) {
              final updatedVisit = visitData!.rebuild((b) => b..id = serverId);
              return standardSerializers.serializeWith(
                  VisitResponseData.serializer, updatedVisit);
            }
            return v;
          }).toList();

          await ApiCache.set(completedCacheKey, updatedCache);
          debugPrint('[Sync] Updated visit cache ID: $localId → $serverId');
        }
      } catch (e) {
        debugPrint('[Sync] Failed to update visit cache: $e');
      }

      // Remove from queue
      await queueBox.delete(key);
    } catch (e) {
      final errorMessage = _formatSyncError(e);
      debugPrint('[Sync] Failed to sync visit $localId: $errorMessage');
      errors.add('visit $localId: $errorMessage');
      // Do NOT delete
    }
  }

  debugPrint('[Sync] Sync process completed.');
  debugPrint(
      '[Sync] Summary: $sitesSynced site(s), $visitsSynced visit(s) synced, $visitsSkipped skipped (local siteId).');

  return SyncQueueResult(
    sitesSynced: sitesSynced,
    visitsSynced: visitsSynced,
    visitsSkipped: visitsSkipped,
    errors: errors,
  );
}
