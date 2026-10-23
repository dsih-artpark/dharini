import 'dart:convert';
import 'package:design_system/design_system.dart';
import 'package:es_client/es_client.dart';
import 'package:es_platform_mobile/hooks/auth.dart';
import 'package:es_platform_mobile/managers/location_manager.dart';
import 'package:es_platform_mobile/models/nearby_site_model.dart';
import 'package:es_platform_mobile/providers/connectivity_provider.dart';
import 'package:es_platform_mobile/services/analytics_service.dart';
import 'package:es_platform_mobile/utils/map_tile_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:geolocator/geolocator.dart';
import 'package:go_router/go_router.dart';
import 'package:hive/hive.dart';
import 'package:latlong2/latlong.dart';

class AddNewVisitController {
  AddNewVisitController();

  String formatDistance(num? meters) {
    if (meters == null) return 'NA';

    if (meters < 1000) return '${meters.toInt()} m away';
    return '${(meters / 1000).toStringAsFixed(2)} km away';
  }

  double calculateDistance({
    required Location? location,
    required Position? currentLocation,
  }) {
    final coords = location?.coordinates?.coordinates;
    if (coords == null) return 0.0;

    final lat = coords[1].toDouble();
    final lon = coords[0].toDouble();

    final currLat = currentLocation?.latitude;
    final currLon = currentLocation?.longitude;

    if (currLat == null || currLon == null) return 0.0;

    return Geolocator.distanceBetween(
      lat,
      lon,
      currLat,
      currLon,
    );
  }

  Future<Position?> getCurrentLocation(BuildContext context) async {
    try {
      return await LocationManager.ensureLocation(context);
    } catch (e) {
      return null;
    }
  }

  Future<List<SiteResponseData>> fetchSavedSites() async {
    final box = Hive.isBoxOpen('sites')
        ? Hive.box('sites')
        : await Hive.openBox('sites');

    return box.values
        .whereType<Map>()
        .map((raw) {
          try {
            final normalized = jsonDecode(jsonEncode(raw));
            return standardSerializers.deserializeWith(
                SiteResponseData.serializer, normalized);
          } catch (_) {
            return null;
          }
        })
        .whereType<SiteResponseData>()
        .toList();
  }

  Future<VisitResponseData?> createOfflineVisit({
    required String siteId,
    required String collectorId,
    required DateTime scheduledAt,
    required String comment,
  }) async {
    final localVisitId = await createLocalVisit(
      siteId: siteId,
      collectorId: collectorId,
      scheduledAt: scheduledAt,
      comment: comment,
    );

    final visitBox = Hive.isBoxOpen('visits')
        ? Hive.box('visits')
        : await Hive.openBox('visits');
    final visitSerialized = visitBox.get(localVisitId);

    final visit = visitSerialized != null
        ? standardSerializers.deserializeWith(
            VisitResponseData.serializer,
            jsonDecode(jsonEncode(visitSerialized)))
        : null;

    return visit;
  }
}

class AddNewVisit extends HookWidget {
  const AddNewVisit({
    super.key,
    required this.collectorId,
  });

  final String collectorId;

  @override
  Widget build(BuildContext context) {
    final controller = useMemoized(() => AddNewVisitController());

    // Use the global real-time connectivity state from ConnectivityProvider.
    // This is synchronously available (no null window) and updates reactively
    // via InheritedWidget whenever the status changes.
    final isOnline = context.isOnline;

    final currentLocation = useState<Position?>(null);
    final selectedSite = useState<NearbySiteResponseData?>(null);
    final selectedLocalSite = useState<CombinedSite?>(null);
    final selectedDistance = useState<int>(50000);
    final searchQuery = useState<String>('');

    // Ensure large radius when offline
    useEffect(() {
      if (!isOnline) {
        selectedDistance.value = 4000000;
      }
      return null;
    }, [isOnline]);

    // Track visit creation start (only once, now that connectivity is always
    // known synchronously from the global provider).
    final hasTrackedCreationStarted = useRef(false);
    useEffect(() {
      if (!hasTrackedCreationStarted.value) {
        hasTrackedCreationStarted.value = true;
        Analytics.visitCreationStarted(isOffline: !isOnline);
      }
      return null;
    }, []);

    useEffect(() {
      controller.getCurrentLocation(context).then((position) {
        if (position != null) {
          currentLocation.value = position;
        } else {
          if (context.mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text(
                    'Location permission is required to find nearby sites'),
                backgroundColor: Colors.red,
              ),
            );
          }
        }
      });
      return null;
    }, []);

    final nearbySites = useNearbySites(
      isOnline ? currentLocation.value?.latitude : null,
      isOnline ? currentLocation.value?.longitude : null,
      isOnline ? selectedDistance.value.toDouble() : null,
    );

    final createVisit = useCreateVisit(
      onSuccess: (data) {
        if (!context.mounted) return;

        // Track visit creation success
        Analytics.visitCreated(
          siteId: selectedSite.value?.id ?? selectedLocalSite.value?.id,
          isOffline: data == null,
        );

        if (data != null) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Visit created successfully'),
              backgroundColor: AppColors.semanticsGreen20,
              duration: Duration(seconds: 1),
            ),
          );
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Visit created locally. Will sync when online.'),
              backgroundColor: Colors.orange,
              duration: Duration(seconds: 3),
            ),
          );
        }
      },
      onError: (error) {
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Error: $error'),
              backgroundColor: Colors.red,
            ),
          );
        }
      },
    );

    // final rawLocalSites = [...useLocalSites()]..sort((a, b) =>
    //     (b.createdAt ?? DateTime.fromMillisecondsSinceEpoch(0))
    //         .compareTo(a.createdAt ?? DateTime.fromMillisecondsSinceEpoch(0)));

    final rawLocalSites = useLocalSites();
    final localSitesWithDistance = useMemoized(() {
      if (currentLocation.value == null) return rawLocalSites;

      for (final site in rawLocalSites) {
        site.distance = controller.calculateDistance(
          location: site.location,
          currentLocation: currentLocation.value,
        );
      }

      rawLocalSites
          .sort((a, b) => (a.distance ?? 0).compareTo(b.distance ?? 0));
      return rawLocalSites;
    }, [rawLocalSites.length, currentLocation.value?.latitude]);

    useEffect(() {
      if (createVisit.data?.data.id != null) {
        context.push('/AddvisitDetails', extra: {
          'visitDetails': createVisit.data!.data,
          'collectorId': collectorId,
        });
      }
      return null;
    }, [createVisit.data]);

    final distanceOptions = <int>[
      1000,
      2000,
      5000,
      10000,
      15000,
      20000,
      30000,
      40000,
      50000,
      100000,
      200000,
      300000,
      400000,
      500000,
      1000000,
      2000000,
      3000000,
      4000000
    ];

    return Scaffold(
      backgroundColor: AppColors.white,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.textStrong),
          onPressed: () => context.go('/'),
        ),
        backgroundColor: AppColors.white,
        elevation: 0,
        title: Text(
          'Select Site',
          style: AppTypography.textTheme.bodyB2SemiBold
              .copyWith(color: AppColors.textStrong),
        ),
        centerTitle: true,
      ),
      body: Stack(
        fit: StackFit.expand,
        children: [
          SingleChildScrollView(
            padding: const EdgeInsets.only(bottom: 120),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Map view (shows location + nearby markers)
                _MapView(
                  currentLocation: currentLocation.value,
                  nearbySites: nearbySites.data?.data?.toList(),
                  selectedSiteId: selectedSite.value?.id,
                ),

                // Title + distance selector
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 16, 16, 26),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(
                              'Nearby Sites',
                              style: AppTypography.textTheme.headingH3
                                  .copyWith(color: AppColors.textStrong),
                            ),
                          ),
                          if (isOnline)
                            Container(
                              decoration: BoxDecoration(
                                border: Border.all(color: AppColors.strokeWeak),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              padding:
                                  const EdgeInsets.symmetric(horizontal: 8),
                              child: DropdownButton<int>(
                                value: selectedDistance.value,
                                underline: const SizedBox(),
                                items: distanceOptions.map((distance) {
                                  return DropdownMenuItem<int>(
                                    value: distance,
                                    child: Text('${(distance / 1000)}km',
                                        style: AppTypography
                                            .textTheme.bodyB3Regular
                                            .copyWith(
                                                color: AppColors.textStrong)),
                                  );
                                }).toList(),
                                onChanged: isOnline
                                    ? (newValue) {
                                        if (newValue != null)
                                          selectedDistance.value = newValue;
                                      }
                                    : null,
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      // Search Field
                      TextField(
                        onChanged: (value) => searchQuery.value = value,
                        decoration: InputDecoration(
                          hintText: 'Search sites by name...',
                          prefixIcon: const Icon(Icons.search,
                              color: AppColors.textWeak),
                          contentPadding: const EdgeInsets.symmetric(
                              horizontal: 16, vertical: 12),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide:
                                const BorderSide(color: AppColors.strokeWeak),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide:
                                const BorderSide(color: AppColors.strokeWeak),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide:
                                const BorderSide(color: AppColors.primaryLight),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                if (isOnline)
                  Builder(builder: (context) {
                    final query = searchQuery.value.toLowerCase().trim();
                    final sites = nearbySites.data?.data?.toList();
                    final filtered = sites == null
                        ? null
                        : (query.isEmpty
                            ? sites
                            : sites
                                .where(
                                    (s) => s.name.toLowerCase().contains(query))
                                .toList());

                    return _OnlineSiteList(
                      sites: filtered,
                      selectedId: selectedSite.value?.id,
                      onSelect: (site) {
                        selectedSite.value = site;
                        selectedLocalSite.value = null;
                      },
                      controller: controller,
                      searchQuery: query,
                    );
                  }),

                if (!isOnline)
                  Builder(builder: (context) {
                    final query = searchQuery.value.toLowerCase().trim();
                    final filtered = query.isEmpty
                        ? localSitesWithDistance
                        : localSitesWithDistance
                            .where((s) => s.name.toLowerCase().contains(query))
                            .toList();

                    return _OfflineSiteList(
                      localSites: filtered,
                      selectedLocalId: selectedLocalSite.value?.id,
                      onSelect: (site) {
                        selectedLocalSite.value = site;
                        selectedSite.value = null;
                      },
                      controller: controller,
                      searchQuery: query,
                    );
                  }),

                // View Pending Visits Link
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Center(
                    child: TextButton(
                      onPressed: () {
                        context
                            .push('/visits', extra: {'from': 'add-new-visit'});
                      },
                      child: Text(
                        'View Pending Visits',
                        style: AppTypography.textTheme.buttonSmall
                            .copyWith(color: AppColors.primaryLight),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          _BottomActions(
            collectorId: collectorId,
            selectedSiteId: selectedSite.value?.id,
            selectedLocalSiteId: selectedLocalSite.value?.id,
            isCreatePending: createVisit.isPending,
            onCreateNewSite: () {
              context.push('/create-site',
                  extra: {'collectorId': collectorId, 'origin': 'AddNewVisit'});
            },
            onSelectExisting: () async {
              try {
                final siteId =
                    selectedSite.value?.id ?? selectedLocalSite.value?.id;
                if (siteId == null) throw Exception('No site selected');

                if (!isOnline) {
                  final visit = await controller.createOfflineVisit(
                    siteId: siteId,
                    collectorId: collectorId,
                    scheduledAt: DateTime.now().toUtc(),
                    comment: 'New Visit',
                  );

                  if (visit == null) {
                    throw Exception('Visit creation failed, no data found.');
                  }

                  // Track offline visit creation
                  Analytics.visitCreated(
                    siteId: siteId,
                    isOffline: true,
                  );

                  context.push('/AddvisitDetails', extra: {
                    'visitDetails': visit,
                    'collectorId': collectorId
                  });
                } else {
                  final requestData = CreateVisitDto((b) {
                    b.siteId =
                        selectedSite.value?.id ?? selectedLocalSite.value?.id;
                    b.collectorId = collectorId;
                    // b.visitScheduledAt = DateTime.now().toIso8601String();
                    b.visitScheduledAt =
                        DateTime.now().toUtc().toIso8601String();
                    b.comment = 'New Visit';
                  });

                  await createVisit.mutate(requestData);
                }
              } catch (e) {
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                    content: Text('Failed to create visit: ${e.toString()}'),
                    backgroundColor: Colors.red,
                  ));
                }
              }
            },
          ),
        ],
      ),
    );
  }
}

class _MapView extends StatelessWidget {
  const _MapView({
    required this.currentLocation,
    required this.nearbySites,
    required this.selectedSiteId,
  });

  final Position? currentLocation;
  final List<NearbySiteResponseData>? nearbySites;
  final String? selectedSiteId;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 200,
      child: currentLocation != null
          ? FlutterMap(
              options: MapOptions(
                initialCenter: LatLng(
                    currentLocation!.latitude, currentLocation!.longitude),
                initialZoom: 15,
              ),
              children: [
                TileLayer(
                  urlTemplate: AppTileProvider.stadiaBright(),
                  userAgentPackageName: 'com.example.app',
                ),
                MarkerLayer(
                  markers: [
                    Marker(
                      width: 40,
                      height: 40,
                      point: LatLng(currentLocation!.latitude,
                          currentLocation!.longitude),
                      child: const Icon(Icons.my_location_outlined,
                          color: Colors.blue, size: 24),
                    ),
                    ...?nearbySites?.map(
                      (site) => Marker(
                        width: 40,
                        height: 40,
                        point: LatLng(
                          site.location?.coordinates?.coordinates.lastOrNull
                                  ?.toDouble() ??
                              0,
                          site.location?.coordinates?.coordinates.firstOrNull
                                  ?.toDouble() ??
                              0,
                        ),
                        child: Icon(
                          Icons.location_on,
                          color: selectedSiteId == site.id
                              ? AppColors.primaryLight
                              : Colors.red,
                          size: 40,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            )
          : const Center(child: CircularProgressIndicator()),
    );
  }
}

class _OnlineSiteList extends StatelessWidget {
  const _OnlineSiteList({
    required this.sites,
    required this.selectedId,
    required this.onSelect,
    required this.controller,
    this.searchQuery = '',
  });

  final List<NearbySiteResponseData>? sites;
  final String? selectedId;
  final void Function(NearbySiteResponseData) onSelect;
  final AddNewVisitController controller;
  final String searchQuery;

  @override
  Widget build(BuildContext context) {
    if (sites == null) {
      return Container(
          height: 200, child: const Center(child: CircularProgressIndicator()));
    }

    if (sites!.isEmpty) {
      return Container(
        height: 200,
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.location_off, size: 64, color: AppColors.textWeak),
              const SizedBox(height: 16),
              Text(
                  searchQuery.isEmpty
                      ? 'No sites found nearby'
                      : 'No sites match your search',
                  style: AppTypography.textTheme.bodyB1SemiBold
                      .copyWith(color: AppColors.textStrong)),
            ],
          ),
        ),
      );
    }

    return ListView.builder(
      physics: const NeverScrollableScrollPhysics(),
      shrinkWrap: true,
      itemCount: sites!.length,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      itemBuilder: (context, index) {
        final site = sites![index];
        final isSelected = selectedId == site.id;
        final distance = site.distance;

        return Container(
          margin: const EdgeInsets.only(bottom: 8),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
                color:
                    isSelected ? AppColors.primaryLight : AppColors.strokeWeak),
          ),
          child: RadioListTile<String>(
            value: site.id,
            groupValue: selectedId,
            onChanged: (value) => onSelect(site),
            title: Text(site.name,
                style: AppTypography.textTheme.bodyB1SemiBold
                    .copyWith(color: AppColors.textStrong)),
            subtitle: Text(
                '${site.farmType ?? ''}\n\n${controller.formatDistance(distance)}',
                style: AppTypography.textTheme.bodyB4Regular
                    .copyWith(color: AppColors.textStrong)),
            isThreeLine: true,
          ),
        );
      },
    );
  }
}

class _OfflineSiteList extends StatelessWidget {
  const _OfflineSiteList({
    required this.localSites,
    required this.selectedLocalId,
    required this.onSelect,
    required this.controller,
    this.searchQuery = '',
  });

  final List<CombinedSite> localSites;
  final String? selectedLocalId;
  final void Function(CombinedSite) onSelect;
  final AddNewVisitController controller;
  final String searchQuery;

  @override
  Widget build(BuildContext context) {
    if (localSites.isEmpty) {
      return Container(
        height: 200,
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.location_off, size: 64, color: AppColors.textWeak),
              const SizedBox(height: 16),
              Text(
                  searchQuery.isEmpty
                      ? 'No local sites available'
                      : 'No local sites match your search',
                  style: AppTypography.textTheme.bodyB1SemiBold
                      .copyWith(color: AppColors.textStrong)),
            ],
          ),
        ),
      );
    }

    return ListView.builder(
      physics: const NeverScrollableScrollPhysics(),
      shrinkWrap: true,
      itemCount: localSites.length,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      itemBuilder: (context, index) {
        final site = localSites[index];
        final distance = site.distance;
        final isSelected = selectedLocalId == site.id;

        return Container(
          margin: const EdgeInsets.only(bottom: 8),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
                color:
                    isSelected ? AppColors.primaryLight : AppColors.strokeWeak),
          ),
          child: RadioListTile<String>(
            value: site.id,
            groupValue: selectedLocalId,
            onChanged: (value) => onSelect(site),
            title: Text(site.name,
                style: AppTypography.textTheme.bodyB1SemiBold
                    .copyWith(color: AppColors.textStrong)),
            subtitle: Text(
                '${site.farmType ?? ''}\n\n${site.address ?? 'NA'}\n${controller.formatDistance(distance)}',
                style: AppTypography.textTheme.bodyB4Regular
                    .copyWith(color: AppColors.textStrong)),
            isThreeLine: true,
          ),
        );
      },
    );
  }
}

class _BottomActions extends StatelessWidget {
  const _BottomActions({
    required this.collectorId,
    required this.selectedSiteId,
    required this.selectedLocalSiteId,
    required this.isCreatePending,
    required this.onCreateNewSite,
    required this.onSelectExisting,
  });

  final String collectorId;
  final String? selectedSiteId;
  final String? selectedLocalSiteId;
  final bool isCreatePending;
  final VoidCallback onCreateNewSite;
  final VoidCallback onSelectExisting;

  @override
  Widget build(BuildContext context) {
    final canSelect = (selectedSiteId != null || selectedLocalSiteId != null) &&
        !isCreatePending;

    return Positioned(
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
                color: Colors.black.withOpacity(0.1),
                blurRadius: 8,
                offset: const Offset(0, -2))
          ],
        ),
        child: Row(
          children: [
            Expanded(
              child: OutlinedButton(
                onPressed: onCreateNewSite,
                style: OutlinedButton.styleFrom(
                  foregroundColor: AppColors.primaryLight,
                  side: const BorderSide(color: AppColors.primaryLight),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8)),
                ),
                child: Text('Create New Site',
                    style: AppTypography.textTheme.buttonSmall
                        .copyWith(color: AppColors.primaryLight)),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: ElevatedButton(
                onPressed: canSelect ? onSelectExisting : null,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primaryLight,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8)),
                ),
                child: isCreatePending
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor:
                                AlwaysStoppedAnimation<Color>(Colors.white)))
                    : Text('Select Existing Site',
                        style: AppTypography.textTheme.buttonSmall
                            .copyWith(color: AppColors.white)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
