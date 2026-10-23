import 'package:cached_network_image/cached_network_image.dart';
import 'package:design_system/design_system.dart';
import 'package:es_client/es_client.dart';
import 'package:es_platform_mobile/domain/permissions.dart';
import 'package:es_platform_mobile/hooks/auth.dart';
import 'package:es_platform_mobile/hooks/permissions.dart';
import 'package:es_platform_mobile/utils/extensions/index.dart';
import 'package:es_platform_mobile/utils/map_tile_provider.dart';
import 'package:es_platform_mobile/views/sites/site_past_visit_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:hive/hive.dart';
import 'package:es_platform_mobile/utils/disease_site_config.dart';
import 'package:latlong2/latlong.dart';

/// collectionConsent is stored as the string 'true'/'false', or null if never
/// recorded (sites created before the field, or from older APKs).
String collectionConsentLabel(String? consent) {
  if (consent == 'true') return 'Yes';
  if (consent == 'false') return 'No';
  return 'Not Recorded';
}

class SiteDetails extends HookWidget {
  final String siteId;

  const SiteDetails({
    super.key,
    required this.siteId,
  });

  @override
  Widget build(BuildContext context) {
    // final siteDetails = useSite(siteId);

    final remoteResult = useSite(siteId);
    final siteDetails = useState<SiteResponseData?>(null);
    final hasError = useState(false);

    useEffect(() {
      if (remoteResult.data != null) {
        siteDetails.value = remoteResult.data;
        return null;
      }

      Future.microtask(() async {
        try {
          final box = Hive.isBoxOpen('sites')
              ? Hive.box('sites')
              : await Hive.openBox('sites');

          if (box.containsKey(siteId)) {
            final raw = box.get(siteId);
            final deserialized = standardSerializers.deserializeWith(
              SiteResponseData.serializer,
              raw,
            );

            if (deserialized != null) {
              siteDetails.value = deserialized;
              print('[SiteDetails] Loaded from Hive: $siteId');
              return;
            } else {
              print('[SiteDetails] Deserialized data was null for $siteId');
            }
          } else {
            print('[SiteDetails] No site found in Hive for $siteId');
          }

          // If it gets here, Hive failed too
          hasError.value = true;
        } catch (e) {
          print('[SiteDetails] Hive deserialization error for $siteId: $e');
          hasError.value = true;
        }
      });

      return null;
    }, [remoteResult.data]);

    final projectId = useCurrentProjectId();
    final visitDetails = useSiteVisits(siteId);
    final visits = visitDetails.data ?? [];
    final manager = usePermissionManager();

    final site = siteDetails.value;

    final canEditSite = manager.can(
      UserAction.Update,
      Subject.Site,
      resourceTeamId: site?.createdBy?.team?.id,
      resourceProjectId: projectId,
    );

    Widget body = const Center(child: CircularProgressIndicator());

    if (site != null) {
      body = Column(
        children: <Widget>[
          // Header Navigation
          AppBar(
            backgroundColor: Colors.white,
            elevation: 0,
            leading: BackButton(
              onPressed: () {
                context.go('/sites', extra: {'showSuccessSnackbar': false});
              },
            ),
            title: Text(
              'Site Details',
              style: AppTypography.textTheme.bodyB2SemiBold.copyWith(
                color: AppColors.textStrong,
              ),
            ),
            actions: [
              if (canEditSite)
                IconButton(
                  icon: const Icon(Icons.edit),
                  onPressed: () {
                    context.go('/edit-site', extra: {'siteId': siteId});
                  },
                ),
            ],
          ),

          // Content
          Expanded(
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  // Site Image and Farm Name Card
                  Container(
                    height: 160,
                    child: Stack(
                      clipBehavior: Clip.none,
                      children: [
                        Positioned.fill(
                          child: (site.photos?.isNotEmpty == true &&
                                  site.photos!.first.isNotEmpty)
                              ? CachedNetworkImage(
                                  imageUrl: site.photos!.first,
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
                        Positioned(
                          bottom: -36,
                          left: 16,
                          right: 16,
                          child: Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(8),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.1),
                                  blurRadius: 4,
                                ),
                              ],
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  "${site.name}",
                                  style: AppTypography.textTheme.headingH3
                                      .copyWith(
                                    color: AppColors.textStrong,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  '${formatFarmType(site.farmType)}${site.siteSubType != null ? " (${formatSubType(site.siteSubType)})" : ""} | SITE CODE : ${(site.siteCode ?? '')}',
                                  style: AppTypography.textTheme.labelMMedium
                                      .copyWith(
                                    color: AppColors.textWeak,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 48),

                  // Info Cards Row (Site Ownership and Total Workers)
                  Container(
                    margin: const EdgeInsets.symmetric(horizontal: 16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(8),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.05),
                          blurRadius: 2,
                          offset: const Offset(0, 1),
                        ),
                      ],
                    ),
                    child: IntrinsicHeight(
                      child: Row(
                        children: [
                          Expanded(
                            child: _buildInfoCardSection(
                              context,
                              icon: Icons.business,
                              iconBgColor: AppColors.background,
                              iconColor: AppColors.textStrong,
                              label: 'Site Ownership',
                              value: site.siteType?.name ?? '',
                            ),
                          ),
                          VerticalDivider(
                            width: 1,
                            thickness: 1,
                            color: Colors.grey[200],
                          ),
                          Expanded(
                            child: _buildInfoCardSection(
                              context,
                              icon: Icons.people,
                              iconBgColor: AppColors.background,
                              iconColor: AppColors.textStrong,
                              label: 'Total Workers',
                              value: site.workerNumber?.toString() ?? '44',
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  // Site Address Section
                  Container(
                    margin: const EdgeInsets.only(top: 16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.05),
                          blurRadius: 2,
                          offset: const Offset(0, 1),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Padding(
                          padding: const EdgeInsets.all(16),
                          child: Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: Colors.purple[50],
                                  shape: BoxShape.circle,
                                ),
                                child: Icon(Icons.location_on,
                                    color: Colors.purple[900], size: 20),
                              ),
                              const SizedBox(width: 12),
                              Text(
                                'Site Address',
                                style:
                                    AppTypography.textTheme.headingH3.copyWith(
                                  color: AppColors.textStrong,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          child: Text(
                            site.address ??
                                'Sector 32, 6th Main Road, Thanisandra 560027 - Bengaluru',
                            style:
                                AppTypography.textTheme.bodyB2Regular.copyWith(
                              color: AppColors.textWeak,
                            ),
                          ),
                        ),
                        const SizedBox(height: 12),
                        AspectRatio(
                          aspectRatio: 16 / 9,
                          child: Container(
                            margin: const EdgeInsets.symmetric(horizontal: 16),
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(8),
                            ),
                            clipBehavior: Clip.antiAlias,
                            child: FlutterMap(
                              options: MapOptions(
                                initialCenter: LatLng(
                                  (site.location?.coordinates?.coordinates
                                              .lastOrNull ??
                                          77.6216)
                                      .toDouble(),
                                  (site.location?.coordinates?.coordinates
                                              .firstOrNull ??
                                          12.9716)
                                      .toDouble(),
                                ),
                                initialZoom: 13,
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
                                      point: LatLng(
                                        (site.location?.coordinates?.coordinates
                                                    .last ??
                                                0.00)
                                            .toDouble(),
                                        (site.location?.coordinates?.coordinates
                                                    .first ??
                                                0.00)
                                            .toDouble(),
                                      ),
                                      child: Icon(
                                        Icons.location_on,
                                        color: Colors.red,
                                        size: 40,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                        // Padding(
                        //   padding: const EdgeInsets.all(16),
                        //   child: Text(
                        //     'View on Maps',
                        //     style: AppTypography.textTheme.buttonSmall.copyWith(
                        //       color: AppColors.buttonTextDefault,
                        //     ),
                        //   ),
                        // ),
                      ],
                    ),
                  ),

                  // Collection Plan Section
                  Container(
                    color: Colors.white,
                    margin: const EdgeInsets.only(top: 16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Padding(
                          padding: const EdgeInsets.all(16),
                          child: Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: Colors.purple[50],
                                  shape: BoxShape.circle,
                                ),
                                child: Icon(Icons.calendar_today,
                                    color: Colors.purple[900], size: 20),
                              ),
                              const SizedBox(width: 12),
                              Text(
                                'Collection Configuration',
                                style:
                                    AppTypography.textTheme.headingH3.copyWith(
                                  color: AppColors.textStrong,
                                ),
                              ),
                              Spacer(),
                              if (canEditSite)
                                IconButton(
                                  icon: const Icon(Icons.edit),
                                  onPressed: () {
                                    context.go('/edit-collection',
                                        extra: {'siteId': siteId});
                                  },
                                ),
                            ],
                          ),
                        ),
                        Container(
                          margin: const EdgeInsets.symmetric(horizontal: 16),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: AppColors.strokeWeak),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Padding(
                                padding: const EdgeInsets.all(16),
                                child: Text(
                                  'Plan Details',
                                  style: AppTypography.textTheme.bodyB2Medium
                                      .copyWith(
                                    color: AppColors.textStrong,
                                  ),
                                ),
                              ),
                              Padding(
                                padding:
                                    const EdgeInsets.symmetric(horizontal: 16),
                                child: Divider(
                                  height: 1,
                                  color: AppColors.strokeWeak,
                                ),
                              ),
                              _buildPlanDetailRow(
                                  'Frequency',
                                  site.collectionFrequencyInterval == 0
                                      ? 'Once'
                                      : site.collectionFrequencyInterval == 1
                                          ? 'Daily'
                                          : site.collectionFrequencyInterval == 7
                                              ? 'Weekly'
                                              : site.collectionFrequencyInterval == 14
                                                  ? 'Fortnightly'
                                                  : site.collectionFrequencyInterval == 30
                                                      ? 'Monthly'
                                                      : site.collectionFrequencyInterval == 90
                                                          ? 'Quarterly'
                                                          : site.collectionFrequencyInterval?.toString() ?? 'NOT ASSIGNED'),
                              _buildPlanDetailRow(
                                  'Day & Time',
                                  (site.collectionDayOfWeek?.isNotEmpty ??
                                          false)
                                      ? '${site.collectionDayOfWeek!.join(", ")}'
                                      : 'NOT ASSIGNED'),
                              _buildPlanDetailRow(
                                  'Duration',
                                  site.collectionFrequencyInterval == 0
                                      ? 'N/A'
                                      : site.collectionDuration != null
                                          ? '${(site.collectionDuration! / 30).toStringAsFixed(0)} months'
                                          : 'NOT ASSIGNED'),
                              const SizedBox(height: 8),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Assigned Collectors Section
                  Padding(
                    padding: const EdgeInsets.only(top: 0),
                    child: Container(
                      color: Colors.white,
                      child: Column(children: [
                        Padding(
                          padding: const EdgeInsets.all(16),
                          child: Container(
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(4),
                              border: Border.all(color: AppColors.strokeWeak),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Padding(
                                  padding: const EdgeInsets.all(16),
                                  child: Row(
                                    children: [
                                      Text(
                                        'Assigned Collectors',
                                        style: AppTypography.textTheme.headingH3
                                            .copyWith(
                                          color: AppColors.textStrong,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                Padding(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 16),
                                  child: Divider(
                                    height: 1,
                                    color: AppColors.strokeWeak,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                if (site.collectionCollector != null)
                                  Padding(
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 16),
                                    child: Container(
                                      padding: const EdgeInsets.all(16),
                                      decoration: BoxDecoration(
                                        border: Border(
                                          bottom: BorderSide(
                                            color: AppColors.strokeWeak,
                                          ),
                                        ),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Row(
                                        children: [
                                          Container(
                                            width: 40,
                                            height: 40,
                                            child: Center(
                                              child: Text(
                                                (site.collectionCollector
                                                                ?.firstName ??
                                                            '')
                                                        .length >= 2
                                                    ? site.collectionCollector!
                                                        .firstName!
                                                        .substring(0, 2)
                                                        .toUpperCase()
                                                    : (site.collectionCollector
                                                                ?.firstName ??
                                                            '')
                                                        .toUpperCase(),
                                                style: AppTypography
                                                    .textTheme.bodyB2SemiBold
                                                    .copyWith(
                                                  color: AppColors.textStrong,
                                                ),
                                              ),
                                            ),
                                          ),
                                          const SizedBox(width: 12),
                                          Expanded(
                                            child: Column(
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.start,
                                              children: [
                                                Text(
                                                  site.collectionCollector
                                                          ?.firstName ??
                                                      '',
                                                  style: AppTypography
                                                      .textTheme.bodyB2SemiBold
                                                      .copyWith(
                                                    color: AppColors.textStrong,
                                                  ),
                                                ),
                                                Text(
                                                  site.collectionCollector
                                                          ?.email ??
                                                      '',
                                                  style: AppTypography
                                                      .textTheme.bodyB3Regular
                                                      .copyWith(
                                                    color: AppColors.textWeak,
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                          const Icon(
                                            Icons.chevron_right,
                                            color: AppColors.textWeak,
                                          ),
                                          Padding(
                                            padding: const EdgeInsets.symmetric(
                                                horizontal: 16),
                                            child: Divider(
                                              height: 1,
                                              color: AppColors.strokeWeak,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                const SizedBox(height: 8),
                              ],
                            ),
                          ),
                        ),
                      ]),
                    ),
                  ),

                  // Collection Consent Section
                  Container(
                    color: Colors.white,
                    margin: const EdgeInsets.only(top: 16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Padding(
                          padding: const EdgeInsets.all(16),
                          child: Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: Colors.purple[50],
                                  shape: BoxShape.circle,
                                ),
                                child: Icon(Icons.check_circle,
                                    color: Colors.purple[900], size: 20),
                              ),
                              const SizedBox(width: 12),
                              Text(
                                'Collection Consent',
                                style:
                                    AppTypography.textTheme.headingH3.copyWith(
                                  color: AppColors.textStrong,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          child: Text(
                            collectionConsentLabel(site.collectionConsent),
                            style:
                                AppTypography.textTheme.bodyB2Regular.copyWith(
                              color: AppColors.textWeak,
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),
                      ],
                    ),
                  ),

                  // Owner's Contact Section
                  Container(
                    color: Colors.white,
                    margin: const EdgeInsets.only(top: 16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Padding(
                          padding: const EdgeInsets.all(16),
                          child: Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: Colors.purple[50],
                                  shape: BoxShape.circle,
                                ),
                                child: Icon(Icons.person,
                                    color: Colors.purple[900], size: 20),
                              ),
                              const SizedBox(width: 12),
                              Text(
                                'Owner\'s Contact',
                                style:
                                    AppTypography.textTheme.headingH3.copyWith(
                                  color: AppColors.textStrong,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.only(
                              left: 16, right: 16, bottom: 16),
                          child: Container(
                            padding: const EdgeInsets.all(4),
                            decoration: BoxDecoration(
                              border: Border.all(color: AppColors.strokeWeak),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: ListTile(
                              leading: CircleAvatar(
                                backgroundColor: Colors.lightGreen[100],
                                child: Text(
                                  site.siteOwnerName?.isNotEmpty ?? false
                                      ? site.siteOwnerName!
                                          .substring(
                                              0,
                                              site.siteOwnerName!.length >= 2
                                                  ? 2
                                                  : site.siteOwnerName!.length)
                                          .toUpperCase()
                                      : 'NA',
                                  style: AppTypography.textTheme.labelMMedium
                                      .copyWith(
                                    color: Colors.lightGreen[900],
                                    fontSize: 12,
                                  ),
                                ),
                              ),
                              title: Text(
                                site.siteOwnerName ?? 'Not Available',
                                style: AppTypography.textTheme.bodyB2Medium
                                    .copyWith(
                                  color: AppColors.textStrong,
                                ),
                              ),
                              subtitle: Text(
                                site.siteOwnerNumber ?? 'No phone number',
                                style: AppTypography.textTheme.buttonSmall
                                    .copyWith(
                                  color: AppColors.buttonTextDefault,
                                ),
                              ),
                            ),
                          ),
                        )
                      ],
                    ),
                  ),

                  // Recent Visits Section
                  Container(
                    color: Colors.white,
                    margin: const EdgeInsets.only(top: 16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Padding(
                          padding: const EdgeInsets.all(16),
                          child: Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: Colors.purple[50],
                                  shape: BoxShape.circle,
                                ),
                                child: Icon(Icons.history,
                                    color: Colors.purple[900], size: 20),
                              ),
                              const SizedBox(width: 12),
                              Text(
                                'Recent Visits',
                                style:
                                    AppTypography.textTheme.headingH3.copyWith(
                                  color: AppColors.textStrong,
                                ),
                              ),
                            ],
                          ),
                        ),
                        if (visits.isNotEmpty)
                          SizedBox(
                            height: 200, // Fixed height for horizontal list
                            child: ListView.builder(
                              scrollDirection: Axis.horizontal,
                              padding:
                                  const EdgeInsets.symmetric(horizontal: 16),
                              itemCount: visits.length > 3 ? 3 : visits.length,
                              itemBuilder: (context, index) {
                                final visit = visits[index];
                                return Padding(
                                  padding: const EdgeInsets.only(right: 8),
                                  child: SizedBox(
                                    width: 360, // Fixed width for each card
                                    child: Column(
                                      children: [
                                        SitePastVisitCard(
                                          farmName: visit.site.name,
                                          farmType: visit.site.farmType ?? '',
                                          location: visit.site.location?.region
                                                  ?.name ??
                                              '',
                                          visitDate: visit.visitScheduledAt,
                                          sampleCount: visit.samples.length,
                                          sampleTypes: visit.samples
                                              .map((e) =>
                                                  e.sampleType?.name ?? '')
                                              .toList(),
                                          siteCode: visit.site.siteCode ?? '',
                                          visitedBy:
                                              visit.collector?.firstName ?? '',
                                        ),
                                        const SizedBox(height: 8),
                                      ],
                                    ),
                                  ),
                                );
                              },
                            ),
                          )
                        else
                          const Padding(
                            padding: EdgeInsets.all(16),
                            child: Text('No recent visits'),
                          ),
                      ],
                    ),
                  ),

                  // Photos & Comments Section
                  Container(
                    color: Colors.white,
                    margin: const EdgeInsets.only(top: 16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Padding(
                          padding: const EdgeInsets.all(16),
                          child: Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: Colors.purple[50],
                                  shape: BoxShape.circle,
                                ),
                                child: Icon(Icons.photo_library,
                                    color: Colors.purple[900], size: 20),
                              ),
                              const SizedBox(width: 12),
                              Text(
                                'Photos & Comments',
                                style:
                                    AppTypography.textTheme.headingH3.copyWith(
                                  color: AppColors.textStrong,
                                ),
                              ),
                            ],
                          ),
                        ),
                        if (site.photos?.isNotEmpty ?? false)
                          SizedBox(
                            height: 100,
                            child: ListView.builder(
                              scrollDirection: Axis.horizontal,
                              itemCount: site.photos?.length ?? 0,
                              itemBuilder: (context, index) {
                                return Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: CachedNetworkImage(
                                    imageUrl: site.photos![index],
                                    width: 120,
                                    height: 120,
                                    placeholder: (context, url) =>
                                        const Icon(Icons.photo_outlined),
                                    errorWidget: (context, url, error) =>
                                        const Icon(Icons.photo_outlined),
                                    fit: BoxFit.cover,
                                  ),
                                );
                              },
                            ),
                          )
                        else
                          const Padding(
                            padding: EdgeInsets.all(16),
                            child: Text('No photos available'),
                          ),
                        Padding(
                          padding: EdgeInsets.only(
                            left: 16,
                            right: 16,
                            top: 12,
                            bottom: 4,
                          ),
                          child: Text(
                            'COMMENTS',
                            style:
                                AppTypography.textTheme.labelMMedium.copyWith(
                              color: AppColors.textWeak,
                            ),
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.only(
                            left: 16,
                            right: 16,
                            bottom: 16,
                          ),
                          child: Container(
                            width: double.infinity,
                            padding: const EdgeInsets.all(16),
                            color: AppColors.background,
                            child: Text(
                              site.comment ?? 'NA',
                              style:
                                  AppTypography.textTheme.bodyB3Medium.copyWith(
                                color: AppColors.textStrong,
                              ),
                            ),
                          ),
                        )
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                ],
              ),
            ),
          ),
        ],
      );
    } else if (hasError.value) {
      body = Center(
        child: Text(
          'Error loading site details',
          style: AppTypography.textTheme.bodyLarge?.copyWith(
            color: AppColors.errorDark,
          ),
        ),
      );
    }

    return SafeArea(
      child: Scaffold(
        backgroundColor: Colors.grey.shade100,
        body: body,
      ),
    );
  }

  Widget _buildInfoCardSection(
    BuildContext context, {
    required IconData icon,
    required Color iconBgColor,
    required Color iconColor,
    required String label,
    required String value,
  }) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: iconBgColor,
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: iconColor, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: const TextStyle(
                    fontSize: 12,
                    color: Colors.grey,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  value,
                  style: AppTypography.textTheme.bodyB3Regular.copyWith(
                    color: AppColors.textStrong,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPlanDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100, // Fixed width for labels
            child: Text(
              label,
              style: AppTypography.textTheme.bodyB4Medium.copyWith(
                color: AppColors.textWeak,
              ),
            ),
          ),
          Expanded(
            child: value == 'NOT ASSIGNED'
                ? Align(
                    alignment: Alignment.centerLeft,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.orange[50],
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        value,
                        style: AppTypography.textTheme.bodyB4Medium.copyWith(
                          color: Colors.orange[900],
                        ),
                      ),
                    ),
                  )
                : Text(
                    value,
                    style: AppTypography.textTheme.bodyB4Regular.copyWith(
                      color: AppColors.textStrong,
                    ),
                    textAlign: TextAlign.right,
                    softWrap: true,
                  ),
          ),
        ],
      ),
    );
  }
}

class SiteSelection extends StatelessWidget {
  const SiteSelection({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Site Selection'),
      ),
      body: const Center(
        child: Text('Site Selection Screen'),
      ),
    );
  }
}

// Hook for fetching site details
// Hook<AsyncValue<SiteModel>> useSiteDetails(String siteId) {
//   return useQuery(
//     'site-details-$siteId',
//     () async {
//       // Simulate API call
//       await Future.delayed(const Duration(seconds: 1));
//       return SiteModel(
//         id: siteId,
//         name: 'Anjaneya Farms',
//         siteCode: '76',
//         farmType: 'cattle farm',
//         address: 'Sector 32, 6th Main Road, Thanisandra 560027 - Bengaluru',
//         collectionFrequency: null,
//         collectionDayOfWeek: ['Monday'],
//         collectionTime: '3 PM',
//         collectionDuration: null,
//         photos: [],
//         comment: '',
//         siteOwnerName: null,
//         siteOwnerNumber: null,
//         location: LocationModel(coordinates: [77.6216, 12.9716]),
//       );
//     },
//   );
// }

// Mock models to make the code work
class SiteModel {
  final String id;
  final String? name;
  final String? siteCode;
  final String? farmType;
  final String? address;
  final String? collectionFrequency;
  final List<String> collectionDayOfWeek;
  final String? collectionTime;
  final String? collectionDuration;
  final List<dynamic> photos;
  final String? comment;
  final String? siteOwnerName;
  final String? siteOwnerNumber;
  final LocationModel? location;

  SiteModel({
    required this.id,
    this.name,
    this.siteCode,
    this.farmType,
    this.address,
    this.collectionFrequency,
    this.collectionDayOfWeek = const [],
    this.collectionTime,
    this.collectionDuration,
    this.photos = const [],
    this.comment,
    this.siteOwnerName,
    this.siteOwnerNumber,
    this.location,
  });
}

class LocationModel {
  final List<double> coordinates;

  LocationModel({required this.coordinates});
}

// Mock for useQuery hook
// Hook<AsyncValue<T>> useQuery<T>(String key, Future<T> Function() fetchFn) {
//   final state = useState<AsyncValue<T>>(AsyncValue.loading());

//   useEffect(() {
//     fetchFn().then(
//       (data) => state.value = AsyncValue.data(data),
//       onError: (error, stack) => state.value = AsyncValue.error(error, stack),
//     );
//     return null;
//   }, [key]);

//   return state;
// }

// Extension for AsyncValue to make the code cleaner
extension AsyncValueX<T> on AsyncValue<T> {
  bool get isLoading => this is AsyncLoading;

  bool get isSuccess => this is AsyncData;

  bool get isError => this is AsyncError;

  T? get data => isSuccess ? (this as AsyncData<T>).value : null;
}

// Mock classes for AsyncValue
abstract class AsyncValue<T> {
  const AsyncValue();

  static AsyncValue<T> loading<T>() => AsyncLoading<T>();

  static AsyncValue<T> data<T>(T value) => AsyncData<T>(value);

  static AsyncValue<T> error<T>(Object error, StackTrace stack) =>
      AsyncError<T>(error, stack);
}

class AsyncLoading<T> extends AsyncValue<T> {
  const AsyncLoading();
}

class AsyncData<T> extends AsyncValue<T> {
  final T value;

  const AsyncData(this.value);
}

class AsyncError<T> extends AsyncValue<T> {
  final Object error;
  final StackTrace stackTrace;

  const AsyncError(this.error, this.stackTrace);
}
