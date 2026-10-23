import 'package:design_system/design_system.dart';
import 'package:es_client/src/model/location.dart';
import 'package:es_platform_mobile/utils/map_tile_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

class LocationInfoWidget extends StatelessWidget {
  const LocationInfoWidget({
    required this.location,
    required this.farmName,
    required this.farmType,
    required this.siteNumber,
    required this.address,
    required this.assignedCollectors,
    required this.collectionSchedule,
    required this.mapImageUrl,
    this.isNewSite = false,
    super.key,
  });
  final String farmName;
  final String farmType;
  final String siteNumber;
  final String address;
  final String assignedCollectors;
  final String collectionSchedule;
  final String mapImageUrl;
  final bool isNewSite;
  final Location? location;
  @override
  Widget build(BuildContext context) => Container(
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border.all(
            color: AppColors.borderLight,
            width: 1,
          ),
          borderRadius: const BorderRadius.all(Radius.circular(8)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        farmName,
                        style: AppTypography.textTheme.bodyB2SemiBold.copyWith(
                          color: AppColors.textStrong,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${farmType.toUpperCase()} | SITE: ${siteNumber.toUpperCase()}',
                        style: AppTypography.textTheme.labelMMedium.copyWith(
                          color: AppColors.textWeak,
                        ),
                      ),
                    ],
                  ),
                  if (isNewSite)
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.blue,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        'NEW SITE',
                        style: AppTypography.textTheme.labelMMedium.copyWith(
                          color: AppColors.white,
                        ),
                      ),
                    ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Container(
                height: 120,
                width: double.infinity,
                // decoration: BoxDecoration(
                //   image: DecorationImage(
                //     image: NetworkImage(mapImageUrl),
                //     fit: BoxFit.cover,
                //   ),
                // ),
                child: Stack(
                  children: [
                    Container(
                      height: 150,
                      margin: EdgeInsets.only(bottom: 16),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(4),
                      ),
                      clipBehavior: Clip.antiAlias,
                      child: FlutterMap(
                        options: MapOptions(
                          initialCenter: LatLng(
                              double.tryParse(location
                                          ?.coordinates?.coordinates.lastOrNull
                                          .toString() ??
                                      '0.0') ??
                                  0.0,
                              double.tryParse(location
                                          ?.coordinates?.coordinates.firstOrNull
                                          .toString() ??
                                      '0.0') ??
                                  0.0),
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
                                    double.tryParse(location?.coordinates
                                                ?.coordinates.lastOrNull
                                                .toString() ??
                                            '0.0') ??
                                        0.0,
                                    double.tryParse(location?.coordinates
                                                ?.coordinates.firstOrNull
                                                .toString() ??
                                            '0.0') ??
                                        0.0),
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
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: <Widget>[
                  const Icon(
                    Icons.location_on_rounded,
                    size: 20,
                    color: Colors.blue,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    address,
                    style: AppTypography.textTheme.bodyB4Medium.copyWith(
                      color: AppColors.textStrong,
                    ),
                  ),
                ],
              ),
            ),
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Divider(
                color: AppColors.borderLight,
                height: 1,
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 16,
                    backgroundColor: Color(0xFFEAE8D9),
                    child: const Icon(Icons.person,
                        color: AppColors.textStrong, size: 20),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Assigned Collector',
                          style: AppTypography.textTheme.bodyB4Regular.copyWith(
                            color: AppColors.textWeak,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          assignedCollectors.isEmpty
                              ? 'No collector assigned'
                              : assignedCollectors,
                          style: AppTypography.textTheme.bodyB3Regular.copyWith(
                            color: AppColors.textStrong,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            // Padding(
            //   padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
            //   child: Row(
            //     children: [
            //       CircleAvatar(
            //         radius: 16,
            //         backgroundColor:
            //             const Color(0xFFF5F5DC), // Light beige color
            //         child: const Icon(Icons.calendar_month,
            //             color: Colors.black, size: 20),
            //       ),
            //       const SizedBox(width: 12),
            //       Expanded(
            //         child: Column(
            //           crossAxisAlignment: CrossAxisAlignment.start,
            //           children: [
            //             Text(
            //               'Collection Schedule',
            //               style:
            //                   AppTypography.textTheme.bodyB4Regular?.copyWith(
            //                 color: AppColors.textWeak,
            //               ),
            //             ),
            //             const SizedBox(height: 4),
            //             Text(
            //               collectionSchedule,
            //               style:
            //                   AppTypography.textTheme.bodyB3Regular?.copyWith(
            //                 color: AppColors.textStrong,
            //               ),
            //             ),
            //           ],
            //         ),
            //       ),
            //     ],
            //   ),
            // ),
          ],
        ),
      );
}
