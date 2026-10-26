import 'dart:async';

import 'package:es_client/es_client.dart';
import 'package:es_platform_mobile/hooks/api.dart';
import 'package:es_platform_mobile/utils/api_cache.dart';
import 'package:es_platform_mobile/views/samplecollection/models/animal_metadata_model.dart';
import 'package:fquery/fquery.dart';

/// Max time to wait for the live fetch before giving up and using the cache.
/// Bounds the spinner so it can never hang on the client's 30s Dio timeout
/// when the server is slow or unreachable (e.g. captive-portal wifi). When the
/// device is genuinely offline the request fails almost immediately, well
/// inside this window.
const _kFetchTimeout = Duration(seconds: 30);

/// Fetches all AnimalMetadata records for a given [siteId].
///
/// Cache-first (stale-while-revalidate): when a non-empty cached list exists it
/// is returned immediately and the network is refreshed in the background;
/// otherwise the network is fetched directly. On any failure — offline,
/// timeout, auth, or server error — it falls back to the cache (or an empty
/// list). Never throws to the UI.
Future<List<AnimalMetadataModel>> getAnimalMetadataBySite(
  EsClient client,
  String siteId, {
  QueryClient? queryClient,
}) async {
  if (siteId.isEmpty) return const [];

  final cacheKey = 'animal_metadata_site_$siteId';

  List<AnimalMetadataModel>? _parseList(dynamic json) {
    if (json is! List) return null;
    try {
      return json
          .whereType<Map>()
          .map(
              (e) => AnimalMetadataModel.fromJson(Map<String, dynamic>.from(e)))
          .toList();
    } catch (_) {
      return null;
    }
  }

  // Read the persisted list from Hive. Returns null on a cache miss or a
  // decode failure (never throws).
  Future<List<AnimalMetadataModel>?> loadCache() async {
    try {
      return await ApiCache.get<List<AnimalMetadataModel>>(
        cacheKey,
        (json) => _parseList(json) ?? const [],
      );
    } catch (e) {
      print('[getAnimalMetadataBySite] Cache load failed: $e');
      return null;
    }
  }

  // Network fetch — use the generated client so the bearer token is
  // auto-injected by the openapi auth interceptor. Also refreshes the cache.
  Future<List<AnimalMetadataModel>> fetchFromNetwork() async {
    final response = await client
        .getSamplesApi()
        .samplesControllerGetAnimalMetadataBySite(siteId: siteId);
    final data = response.data?.data.toList() ?? const [];
    final models = data
        .map((e) => AnimalMetadataModel(
              id: e.id,
              animalTagId: e.animalTagId,
              birdId: e.birdId,
              speciesId: e.species?.id,
              speciesName: e.species?.name,
              speciesEmoji: e.species?.emojiIcon,
              breed: e.breed,
              ageYears: e.ageYears?.toInt(),
              ageMonths: e.ageMonths?.toInt(),
              gender: e.gender,
              vaccinationStage: e.vaccinationStage,
              feverObserved: e.feverObserved,
              createdAt: e.createdAt,
            ))
        .toList();

    // Serialize for cache — plain JSON-serialisable maps
    final serialized = models
        .map((m) => {
              'id': m.id,
              'animalTagId': m.animalTagId,
              'birdId': m.birdId,
              'species': m.speciesId == null
                  ? null
                  : {
                      'id': m.speciesId,
                      'name': m.speciesName,
                      'emojiIcon': m.speciesEmoji,
                    },
              'breed': m.breed,
              'ageYears': m.ageYears,
              'ageMonths': m.ageMonths,
              'gender': m.gender,
              'vaccinationStage': m.vaccinationStage,
              'feverObserved': m.feverObserved,
              'createdAt': m.createdAt?.toIso8601String(),
            })
        .toList();
    await ApiCache.set(cacheKey, serialized);
    return models;
  }

  // 1. Try to load from cache
  List<AnimalMetadataModel>? cached;
  try {
    cached = await loadCache();
  } catch (e) {
    print('[getAnimalMetadataBySite] Cache load failed: $e');
  }

  // 2. If cached data is present and not empty, return immediately and refetch in background
  if (cached != null && cached.isNotEmpty) {
    print(
        '[getAnimalMetadataBySite] Found ${cached.length} cached animal(s). Returning immediately and fetching fresh in background.');
    unawaited(
      fetchFromNetwork().timeout(_kFetchTimeout).then((freshData) {
        if (queryClient != null) {
          queryClient.setQueryData<List<AnimalMetadataModel>>(
            ['animal_metadata_site', siteId],
            (_) => freshData,
          );
        }
      }).catchError((e) {
        print('[getAnimalMetadataBySite] Background refresh failed: $e');
      }),
    );
    return cached;
  }

  // 3. No cache or cache is empty -> fetch from network
  try {
    final fresh = await fetchFromNetwork().timeout(_kFetchTimeout);
    print(
        '[getAnimalMetadataBySite] Network fetch success: ${fresh.length} animals.');
    return fresh;
  } catch (e) {
    print(
        '[getAnimalMetadataBySite] Network fetch failed ($e) and no cache available.');
    return const [];
  }
}

UseQueryResult<List<AnimalMetadataModel>, dynamic> useAnimalMetadataBySite(
  String siteId,
) {
  final api = useEsApiClient();
  final queryClient = useQueryClient();
  return useQuery(
    ['animal_metadata_site', siteId],
    () => getAnimalMetadataBySite(api, siteId, queryClient: queryClient),
    enabled: siteId.isNotEmpty,
    // Always re-run the query function whenever the screen is (re)entered, and
    // never treat the result as fresh — so a live fetch always runs on mount.
    refetchOnMount: RefetchOnMount.always,
    staleDuration: Duration.zero,
    // Drop the query from fquery's in-memory cache as soon as the screen is
    // left. Without this, re-entering reuses the previous query's data, which
    // (a) flashes a stale list before the spinner and (b) can short-circuit the
    // refetch. With a zero cache duration every entry starts from a clean
    // loading state and fetches fresh.
    cacheDuration: Duration.zero,
  );
}
