import 'package:design_system/design_system.dart';
import 'package:es_client/es_client.dart';
import 'package:es_platform_mobile/providers/sync_service_provider.dart';
import 'package:es_platform_mobile/services/sync_service.dart';
import 'package:es_platform_mobile/utils/extensions/index.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';

import '../../utils/configs/constants.dart';

class SuccessScreen extends HookWidget {
  final int totalSamples;
  final String sampleTypes;
  final UserProfileResponseData profile;
  final bool isOnline;

  const SuccessScreen({
    required this.totalSamples,
    required this.sampleTypes,
    required this.profile,
    required this.isOnline,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final syncService = context.syncService;
    final syncStatus = isOnline
        ? useStream(syncService.syncStatus, initialData: SyncStatus.idle)
        : null;

    Widget syncBanner = const SizedBox.shrink();
    if (isOnline && syncStatus != null) {
      switch (syncStatus.data) {
        case SyncStatus.syncing:
          syncBanner = Material(
            color: Colors.yellow[700],
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 4.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(strokeWidth: 2)),
                  const SizedBox(width: 8),
                  const Text('Syncing visit to server...',
                      style: TextStyle(color: Colors.black)),
                ],
              ),
            ),
          );
          break;
        case SyncStatus.completed:
          syncBanner = Material(
            color: Colors.green[400],
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 4.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: const [
                  Icon(Icons.check_circle, color: Colors.white, size: 18),
                  SizedBox(width: 8),
                  Text('Visit synced successfully!',
                      style: TextStyle(color: Colors.white)),
                ],
              ),
            ),
          );
          break;
        case SyncStatus.error:
          syncBanner = Material(
            color: Colors.red[400],
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 4.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: const [
                  Icon(Icons.error, color: Colors.white, size: 18),
                  SizedBox(width: 8),
                  Text('Sync failed. Will retry when online.',
                      style: TextStyle(color: Colors.white)),
                ],
              ),
            ),
          );
          break;
        default:
          syncBanner = const SizedBox.shrink();
      }
    }

    return Scaffold(
      backgroundColor: AppColors.onSuccessLight,
      body: SafeArea(
        child: Stack(
          children: <Widget>[
            Positioned.fill(
              child: Column(
                children: <Widget>[
                  // Green success area with icon
                  Container(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      children: <Widget>[
                        SizedBox(height: Spacing.space(4)),
                        Text(
                          'Visit saved successfully',
                          style: Theme.of(context)
                              .textTheme
                              .bodyMedium
                              ?.copyWith(color: AppColors.white),
                        ),
                        SizedBox(height: Spacing.space(2)),
                        const Image(
                          image: AssetImage(
                            Assets.sucesssubmit,
                          ),
                        ),
                      ],
                    ),
                  ),
                  // White content area
                  Expanded(
                    child: Container(
                      width: double.infinity,
                      decoration: const BoxDecoration(
                        color: AppColors.white,
                        borderRadius: BorderRadius.only(
                          topLeft: Radius.circular(24),
                          topRight: Radius.circular(24),
                        ),
                      ),
                      child: SingleChildScrollView(
                        padding: const EdgeInsets.all(24),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: <Widget>[
                            // Submitted samples section
                            Text(
                              'SUBMITTED',
                              style: Theme.of(context)
                                  .textTheme
                                  .labelLarge
                                  ?.copyWith(color: AppColors.labletestgrey),
                            ),
                            SizedBox(height: Spacing.space(4)),
                            Text(
                              '$totalSamples Samples',
                              style: Theme.of(context)
                                  .textTheme
                                  .displaySmall
                                  ?.copyWith(color: AppColors.labletestblack),
                            ),
                            SizedBox(height: Spacing.space(4)),
                            Text(
                              sampleTypes,
                              style: Theme.of(context)
                                  .textTheme
                                  .labelLarge
                                  ?.copyWith(color: AppColors.labletestgrey),
                            ),
                            // SizedBox(height: Spacing.space(4)),
                            // AppButton(
                            //   backgroundColor: AppColors.infoLight,
                            //   color: AppColors.primaryDark,
                            //   icon: const Icon(
                            //     Icons.download,
                            //     color: AppColors.primaryDark,
                            //   ),
                            //   child: const Text('Download Visit Report'),
                            //   onPressed: () {},
                            // ),
                            SizedBox(height: Spacing.space(6)),
                            // Next step section
                            Text(
                              'Next Step',
                              style: Theme.of(context)
                                  .textTheme
                                  .labelLarge
                                  ?.copyWith(color: AppColors.labletestgrey),
                            ),
                            SizedBox(height: Spacing.space(4)),
                            Text(
                              'Deliver Samples to Lab',
                              style: Theme.of(context)
                                  .textTheme
                                  .displaySmall
                                  ?.copyWith(color: AppColors.labletestblack),
                            ),
                            SizedBox(height: Spacing.space(4)),
                            // Lab details
                            const Divider(
                              height: 3,
                              color: AppColors.borderLight,
                            ),
                            SizedBox(height: Spacing.space(6)),
                            Container(
                              margin: const EdgeInsets.only(bottom: 16),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: <Widget>[
                                  const Icon(
                                    Icons.location_on_outlined,
                                    color: Colors.black54,
                                    size: 24,
                                  ),
                                  SizedBox(width: Spacing.space(3)),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: <Widget>[
                                        Text(
                                          profile.team?.teamName ?? '',
                                          style: Theme.of(context)
                                              .textTheme
                                              .bodyMedium
                                              ?.copyWith(
                                                color: AppColors.labletestblack,
                                              ),
                                        ),
                                        SizedBox(height: Spacing.space(1)),
                                        Text(
                                          profile.team?.address ??
                                              'Address not available',
                                          style: Theme.of(context)
                                              .textTheme
                                              .bodySmall
                                              ?.copyWith(
                                                color: AppColors.labletestgrey,
                                              ),
                                        ),
                                        SizedBox(height: Spacing.space(1)),
                                        // Text(
                                        //   'View Location',
                                        //   style: Theme.of(context)
                                        //       .textTheme
                                        //       .bodySmall
                                        //       ?.copyWith(
                                        //         color: AppColors.onInfoLight,
                                        //       ),
                                        // ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            // Row(
                            //   crossAxisAlignment: CrossAxisAlignment.start,
                            //   children: <Widget>[
                            //     const Icon(
                            //       Icons.person_outline,
                            //       color: AppColors.actionButtonDark,
                            //       size: 24,
                            //     ),
                            //     SizedBox(width: Spacing.space(1)),
                            //     Expanded(
                            //       child: Column(
                            //         crossAxisAlignment:
                            //             CrossAxisAlignment.start,
                            //         children: <Widget>[
                            //           Text(
                            //             'Krishna Murthy',
                            //             style: Theme.of(context)
                            //                 .textTheme
                            //                 .bodyMedium
                            //                 ?.copyWith(
                            //                   color: AppColors.labletestblack,
                            //                 ),
                            //           ),
                            //           const SizedBox(height: 4),
                            //           Text(
                            //             '+91 567389267',
                            //             style: Theme.of(context)
                            //                 .textTheme
                            //                 .bodySmall
                            //                 ?.copyWith(
                            //                   color: AppColors.onInfoLight,
                            //                 ),
                            //           ),
                            //         ],
                            //       ),
                            //     ),
                            //   ],
                            // ),
                            SizedBox(height: Spacing.space(25)),
                            // Back to home button
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: Container(
                padding: const EdgeInsets.all(16),
                color: Colors.white,
                // Optional semi-transparent background
                child: AppButton(
                  child: const Text('Back to Home'),
                  onPressed: () {
                    context.go('/');
                  },
                ),
              ),
            ),
            if (isOnline)
              Positioned(
                top: 0,
                left: 0,
                right: 0,
                child: syncBanner,
              ),
          ],
        ),
      ),
    );
  }
}
