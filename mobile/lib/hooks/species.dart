import 'dart:async';
import 'package:fquery/fquery.dart';
import 'package:es_client/es_client.dart';
import 'package:es_platform_mobile/hooks/api.dart';
import 'package:es_platform_mobile/utils/api_cache.dart';

/// Max time to wait for the live fetch before giving up. When the device is
/// genuinely offline the request fails almost immediately, well inside this
/// window.
const _kFetchTimeout = Duration(seconds: 30);

/// Cache-first (stale-while-revalidate): a non-empty cached list is returned
/// immediately and the network is refreshed in the background. A successful
/// refresh updates Hive and, when [queryClient] is given, the active
/// `['species']` query so open screens see the fresh list. Empty responses
/// never overwrite the cache.
Future<List<SpeciesResponseData>> getSpecies(
  EsClient client, {
  QueryClient? queryClient,
}) async {
  const cacheKey = 'species';

  // 1. Try to load from cache
  List<SpeciesResponseData>? cached;
  try {
    cached = await ApiCache.get<List<SpeciesResponseData>>(
      cacheKey,
      (json) => (json as List)
          .map((e) => standardSerializers.deserializeWith(
              SpeciesResponseData.serializer, e))
          .whereType<SpeciesResponseData>()
          .toList(),
    );
  } catch (e) {
    print('[getSpecies] Cache load failed: $e');
  }

  // 2. Define network fetch
  Future<List<SpeciesResponseData>> fetchFromNetwork() async {
    final response = await client
        .getSpeciesApi()
        .speciesControllerFindAll()
        .timeout(_kFetchTimeout);
    final data = response.data?.data.toList() ?? [];
    if (data.isEmpty) {
      print('[getSpecies] Empty response, keeping existing cache');
      return data;
    }
    final serialized = data
        .map((e) => standardSerializers.serializeWith(
            SpeciesResponseData.serializer, e))
        .toList();
    await ApiCache.set(cacheKey, serialized);
    return data;
  }

  // 3. Return cached if available, and fetch in background
  if (cached != null && cached.isNotEmpty) {
    final fallback = cached;
    unawaited(fetchFromNetwork().then((fresh) {
      if (fresh.isNotEmpty) {
        queryClient?.setQueryData<List<SpeciesResponseData>>(
          ['species'],
          (_) => fresh,
        );
      }
      return fresh;
    }).catchError((e) {
      print('[getSpecies] Background fetch failed: $e');
      return fallback;
    }));
    return cached;
  }

  // 4. If no cache, fetch from network
  return await fetchFromNetwork();
}

UseQueryResult<List<SpeciesResponseData>, dynamic> useSpecies() {
  final api = useEsApiClient();
  final queryClient = useQueryClient();
  return useQuery(
    ['species'],
    () => getSpecies(api, queryClient: queryClient),
  );
}
