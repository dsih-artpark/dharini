import 'package:cached_network_image/cached_network_image.dart';
import 'package:design_system/design_system.dart';
import 'package:es_client/es_client.dart';
import 'package:es_platform_mobile/domain/extensions/model_extension.dart';
import 'package:es_platform_mobile/hooks/api.dart';
import 'package:es_platform_mobile/hooks/auth.dart';
import 'package:es_platform_mobile/utils/extensions/index.dart';
import 'package:es_platform_mobile/utils/map_tile_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:hive/hive.dart';
import 'package:es_platform_mobile/utils/disease_site_config.dart';
import 'package:es_platform_mobile/models/visit_draft.dart';
import 'package:es_platform_mobile/services/visit_draft_repository.dart';
import 'package:es_platform_mobile/utils/visit_flow_resumer.dart';
import 'package:es_platform_mobile/utils/hive_serialization.dart';
import 'package:latlong2/latlong.dart';

class CollectionDetails extends HookWidget {
  final VisitResponseData visitDetails;

  const CollectionDetails({
    super.key,
    required this.visitDetails,
  });

  @override
  Widget build(BuildContext context) {
    final siteDetails = useSites();
    // final site = siteDetails.data
    //     ?.firstWhere((element) => element.id == visitDetails.site.id);
    final visit = visitDetails;

    final siteState = useState<SiteResponseData?>(null);
    final isLoading = useState(true);
    // final siteDetails = useSites();

    final api = useEsApiClient();
    final projectId = useCurrentProjectId();

    Future<SiteResponseData?> loadSite(List<SiteResponseData>? allSites) async {
      SiteResponseData? matchingSite;
      if (allSites != null) {
        try {
          matchingSite = allSites.firstWhere(
            (element) => element.id == visitDetails.site.id,
          );
        } catch (_) {
          matchingSite = null;
        }
      }

      if (matchingSite != null) return matchingSite;

      if (projectId != null &&
          projectId.isNotEmpty &&
          !visitDetails.site.id.startsWith('local-')) {
        try {
          final res = await api.getProjectsApi().projectsControllerFindSite(
              projectId: projectId, siteId: visitDetails.site.id);
          if (res.data?.data != null) {
            return res.data!.data;
          }
        } catch (e) {
          print('[Fetch Error] Failed to fetch site individually: $e');
        }
      }

      final siteBox = Hive.isBoxOpen('sites')
          ? Hive.box('sites')
          : await Hive.openBox('sites');
      final raw = siteBox.get(visitDetails.site.id);
      if (raw != null) {
        try {
          return HiveSerialization.deserializeBuiltValue(
            SiteResponseData.serializer,
            raw,
          );
        } catch (e) {
          print('[Deserialize Error] Failed to deserialize site from Hive: $e');
        }
      }

      return null;
    }

    useEffect(() {
      () async {
        final site = await loadSite(siteDetails.data);
        siteState.value = site;
        isLoading.value = false;
      }();
      return null;
    }, [siteDetails.data]);

    // ── Resume-draft flow ────────────────────────────────────────────────
    // Shared dialog so the Start Visit button and the auto-open effect present
    // the exact same prompt.
    void showResumeDialog(VisitDraft draft) {
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: const Text('Resume Visit Draft?'),
            content: Text(
                'You started this visit earlier but did not complete it. A saved draft was found for this site from ${draft.updatedAt.toLocal().toString().substring(0, 16)}'),
            actions: [
              TextButton(
                onPressed: () async {
                  Navigator.of(context).pop();
                  await VisitDraftRepository.deleteDraft(draft.visitId);
                  if (context.mounted) {
                    context.push(
                      '/AddvisitDetails',
                      extra: <String, VisitResponseData>{"visitDetails": visit},
                    );
                  }
                },
                child: const Text('Start Fresh',
                    style: TextStyle(color: Colors.red)),
              ),
              ElevatedButton(
                onPressed: () {
                  Navigator.of(context).pop();
                  VisitFlowResumer.resumeVisitFlow(context, draft, visit);
                },
                child: const Text('Resume'),
              ),
            ],
          );
        },
      );
    }

    // Start Visit button: prompt to resume when a draft exists, otherwise begin
    // a fresh visit.
    Future<void> onStartVisitPressed() async {
      final draft = await VisitDraftRepository.getDraft(visit.id);
      if (draft != null) {
        if (context.mounted) showResumeDialog(draft);
      } else if (context.mounted) {
        context.push(
          '/AddvisitDetails',
          extra: <String, VisitResponseData>{"visitDetails": visit},
        );
      }
    }

    // Auto-open the resume dialog once the screen has loaded, when an
    // incomplete draft exists — saving the user a tap on Start Visit. Skipped
    // for completed visits; if there's no draft, nothing pops.
    final autoResumeShown = useRef(false);
    useEffect(() {
      final ready = !siteDetails.isLoading &&
          !isLoading.value &&
          siteState.value != null &&
          visit.visitStatus != 'completed';
      if (ready && !autoResumeShown.value) {
        autoResumeShown.value = true;
        WidgetsBinding.instance.addPostFrameCallback((_) async {
          final draft = await VisitDraftRepository.getDraft(visit.id);
          if (draft != null && context.mounted) {
            showResumeDialog(draft);
          }
        });
      }
      return null;
    }, [siteDetails.isLoading, isLoading.value, siteState.value]);

    // if (siteDetails.isLoading) {
    //   return const Scaffold(
    //     backgroundColor: Color(0xFFF9F8F3),
    //     body: Center(child: CircularProgressIndicator()),
    //   );
    // }

    // if (siteDetails.isError || site == null) {
    //   return Center(child: Text(siteDetails.error.toString()));
    // }

    if (siteDetails.isLoading || isLoading.value) {
      return const Scaffold(
        backgroundColor: Color(0xFFF9F8F3),
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (siteState.value == null) {
      return const Scaffold(
        backgroundColor: Color(0xFFF9F8F3),
        body: Center(
            child: Text(
                'Failed to load site data. Please ensure you are online and have access to this site.')),
      );
    }

    final site = siteState.value!;

    final lat = site.location?.coordinates?.coordinates[0].toDouble() ?? 0;
    final lng = site.location?.coordinates?.coordinates[1].toDouble() ?? 0;
    final diseases = site.diseases.asList();
    // final coordinates = collectionData['coordinates'] as Map<String, double>;
    // final caretaker = collectionData['caretaker'] as Map<String, String>;
    // final diseases = collectionData['diseases'] as List<String>;
    //
    // final dateParts = (collectionData['date'] as String).split(' ');
    // final timeParts = (collectionData['time'] as String).split(' ');
    // final dateDisplay = dateParts.length > 1
    //     ? '${dateParts[0]}\n${dateParts[1]}'
    //     : collectionData['date'] as String;
    // final timeDisplay = timeParts.length > 1
    //     ? '${timeParts[0]}\n${timeParts[1]}'
    //     : collectionData['time'] as String;

    return Scaffold(
      backgroundColor: AppColors.background,
      extendBody: true,
      appBar: AppBar(
          backgroundColor: Colors.white,
          elevation: 0,
          title: Text(
            'Collection Details',
            style: AppTypography.textTheme.bodyB2SemiBold.copyWith(
              color: AppColors.textStrong,
            ),
          ),
          leading: const BackButton()),
      body: Stack(
        children: [
          SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Farm image with details overlay
                Container(
                  height: 160, // Correct height of 160px
                  child: Stack(
                    clipBehavior: Clip.none,
                    children: [
                      Positioned.fill(
                        child: CachedNetworkImage(
                          imageUrl: site.photos?.firstOrNull ?? '',
                          width: double.infinity,
                          placeholder: (context, url) =>
                              const Icon(Icons.photo_outlined),
                          errorWidget: (context, url, error) =>
                              const Icon(Icons.photo_outlined),
                          fit: BoxFit.cover,
                        ),
                      ),
                      Positioned(
                        bottom: -64,
                        // Card starts 64px from the bottom of the image container
                        left: 16,
                        right: 16,
                        child: Container(
                          padding: EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(8),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black12,
                                blurRadius: 4,
                              ),
                            ],
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                site.name,
                                style:
                                    AppTypography.textTheme.headingH3.copyWith(
                                  color: AppColors.textStrong,
                                ),
                              ),
                              SizedBox(height: 4),
                              Text(
                                '${formatFarmType(site.farmType)}${site.siteSubType != null ? " (${formatSubType(site.siteSubType)})" : ""} | SITE CODE : ${site.siteCode ?? ""}',
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
                // Add spacing to account for the card overlay plus 8px padding
                SizedBox(height: 72), // Changed from 64 to 72 (64+8)

                // Date & Time Section
                // _buildSectionCard(
                //   icon: Icons.calendar_today,
                //   iconColor: AppColors.secondaryPurple10,
                //   title: 'Date & Time',
                //   content: Padding(
                //     padding: const EdgeInsets.symmetric(vertical: 16.0),
                //     child: Row(
                //       children: [
                //         SizedBox(width: 16),
                //         Container(
                //           width: 68,
                //           height: 68,
                //           padding: EdgeInsets.all(8),
                //           decoration: BoxDecoration(
                //             border: Border.all(color: Colors.grey.shade300),
                //             borderRadius: BorderRadius.circular(4),
                //           ),
                //           child: Column(
                //             children: [
                //               Text(
                //                 visit.visitScheduledAt?.toLocal().humanDate ??
                //                     '',
                //                 textAlign: TextAlign.center,
                //                 style: AppTypography.textTheme.bodyB3Medium
                //                     ?.copyWith(
                //                   color: AppColors.textStrong,
                //                 ),
                //               ),
                //             ],
                //           ),
                //         ),
                //         SizedBox(width: 16),
                //         Container(
                //           width: 68,
                //           height: 68,
                //           padding: const EdgeInsets.all(8),
                //           decoration: BoxDecoration(
                //             border: Border.all(color: Colors.grey[300]!),
                //             borderRadius: BorderRadius.circular(4),
                //           ),
                //           child: Text(
                //             visit.visitScheduledAt?.toLocal().humanTime ?? '',
                //             textAlign: TextAlign.center,
                //             style:
                //                 AppTypography.textTheme.bodyB3Medium?.copyWith(
                //               color: AppColors.textStrong,
                //             ),
                //           ),
                //         ),
                //       ],
                //     ),
                //   ),
                // ),

                // Site Address
                _buildSectionCard(
                  icon: Icons.location_on,
                  iconColor: AppColors.secondaryPurple10,
                  title: 'Site Address',
                  content: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Padding(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 16.0, vertical: 8.0),
                        child: Text(
                          site.address ?? '',
                          style: AppTypography.textTheme.bodyB2Regular.copyWith(
                            color: AppColors.textStrong,
                          ),
                        ),
                      ),
                      // Padding(
                      //   padding: const EdgeInsets.symmetric(
                      //       horizontal: 16.0, vertical: 8.0),
                      //   child: InkWell(
                      //     onTap: () {
                      //       // Open maps action
                      //     },
                      //     child: Text(
                      //       'View on Maps',
                      //       style: AppTypography.textTheme.buttonSmall.copyWith(
                      //         color: AppColors.buttonTextDefault,
                      //       ),
                      //     ),
                      //   ),
                      // ),
                      SizedBox(height: 8),
                      Container(
                        height: 150,
                        margin: EdgeInsets.only(bottom: 16),
                        decoration: BoxDecoration(),
                        clipBehavior: Clip.antiAlias,
                        child: FlutterMap(
                          options: MapOptions(
                            initialCenter: LatLng(lng, lat),
                            initialZoom: 13,
                          ),
                          children: [
                            TileLayer(
                              urlTemplate:
                                  // 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                                  AppTileProvider.stadiaBright(),
                              userAgentPackageName: 'com.example.app',
                            ),
                            MarkerLayer(
                              markers: [
                                Marker(
                                  width: 40,
                                  height: 40,
                                  point: LatLng(lng, lat),
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
                    ],
                  ),
                ),

                // Contact Details
                _buildSectionCard(
                  icon: Icons.contact_phone,
                  iconColor: AppColors.secondaryPurple10,
                  title: 'Contact Details',
                  content: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Row(
                      children: [
                        CircleAvatar(
                          radius: 20,
                          backgroundColor: AppColors.secondaryOlive10,
                          child: Text(
                            site.siteOwnerName?.isNotEmpty ?? false
                                ? site.siteOwnerName!.substring(
                                    0,
                                    site.siteOwnerName!.length >= 2
                                        ? 2
                                        : site.siteOwnerName!.length)
                                : '',
                            style:
                                AppTypography.textTheme.bodyB1Medium.copyWith(
                              color: AppColors.textStrong,
                            ),
                          ),
                        ),
                        SizedBox(width: 16),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              site.siteOwnerName ?? '',
                              style:
                                  AppTypography.textTheme.bodyB1Medium.copyWith(
                                color: AppColors.textStrong,
                              ),
                            ),
                            Row(
                              children: [
                                Text(
                                  '',
                                  style: AppTypography.textTheme.bodyB4Medium
                                      .copyWith(
                                    color: AppColors.textWeak,
                                  ),
                                ),
                                Text(
                                  site.siteOwnerNumber ?? '',
                                  style: AppTypography.textTheme.buttonSmall
                                      .copyWith(
                                    color: AppColors.buttonTextDefault,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),

                // Disease Section
                _buildSectionCard(
                  icon: Icons.coronavirus,
                  iconColor: AppColors.secondaryPurple10,
                  title: 'Disease',
                  content: Column(
                    children: site.diseases
                        .asMap()
                        .entries
                        .map((entry) => Container(
                              width: double.infinity,
                              padding: EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                border: Border(
                                  bottom: entry.key < diseases.length - 1
                                      ? BorderSide(color: Color(0xFFE6E8EB))
                                      : BorderSide.none,
                                ),
                              ),
                              child: Text(
                                entry.value.name,
                                style: AppTypography.textTheme.bodyB2Medium
                                    .copyWith(
                                  color: AppColors.textStrong,
                                ),
                              ),
                            ))
                        .toList(),
                  ),
                ),
                // Add bottom padding to accommodate the button
                SizedBox(height: 80),
              ],
            ),
          ),

          // Fixed Start Visit button at bottom
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
                    offset: Offset(0, -2),
                  ),
                ],
              ),
              child: visit.visitStatus == 'completed'
                  ? Container(
                      width: double.infinity,
                      child: Text('Visit already completed'),
                    )
                  : AppButton(
                      size: ButtonSize.lg,
                      child: Text(
                        'Start Visit',
                        style: AppTypography.textTheme.buttonLarge.copyWith(
                          color: Colors.white,
                        ),
                      ),
                      onPressed: onStartVisitPressed,
                    ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionCard({
    required IconData icon,
    required Color iconColor,
    required String title,
    required Widget content,
  }) {
    return Container(
      margin: EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: Color(0xFFE6E8EB), width: 1),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 16,
                  backgroundColor: iconColor,
                  child: Icon(icon, color: Colors.white, size: 16),
                ),
                SizedBox(width: 12),
                Text(
                  title,
                  style: AppTypography.textTheme.headingH3.copyWith(
                    color: AppColors.textStrong,
                  ),
                ),
              ],
            ),
          ),
          Divider(height: 1, thickness: 1, color: Color(0xFFE6E8EB)),
          content,
        ],
      ),
    );
  }
}
