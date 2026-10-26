import 'package:dartx/dartx.dart';
import 'package:design_system/design_system.dart';
import 'package:es_client/es_client.dart';
import 'package:es_platform_mobile/domain/extensions/model_extension.dart';
import 'package:es_platform_mobile/domain/permissions.dart';
import 'package:es_platform_mobile/hooks/auth.dart';
import 'package:es_platform_mobile/hooks/permissions.dart';
import 'package:es_platform_mobile/utils/extensions/go_router.dart';
import 'package:es_platform_mobile/utils/tenant_roles.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:hive/hive.dart';

import 'detailcard_site.dart';

class Sites extends HookWidget {
  final bool showSuccessSnackbar;
  Sites({super.key, this.showSuccessSnackbar = false});

  @override
  Widget build(BuildContext context) {
    // Show Snackbar if flag is true
    useEffect(() {
      if (showSuccessSnackbar) {
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (context.mounted) {
            // Check if context is still valid
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Site created successfully'),
                backgroundColor: Colors.green,
                duration: Duration(seconds: 2),
              ),
            );
          }
        });
      }
      return null; // No cleanup needed
    }, []); // Empty dependency array ensures this runs only once

    final sites = useSites();

    final projectId = useCurrentProjectId();
    final allFarmTypes =
        sites.data?.map((e) => e.farmType).whereNotNull().distinct().toList() ??
            [];
    final manager = usePermissionManager();
    final canCreateSite = manager.can(UserAction.Create, Subject.Site,
        resourceProjectId: projectId,
        resourceTeamId: teamIdForProject(manager.profileData, projectId));

    Widget body = Center(child: Text("No data available"));
    if (sites.isSuccess) {
      body = SingleChildScrollView(
        child: Column(
          children: <Widget>[
            SizedBox(
              height: Spacing.space(2),
            ),
            Container(
              width: MediaQuery.of(context).size.width,
              color: AppColors.white,
              child: Padding(
                padding: Spacing.p(4),
                child: Column(
                  children: <Widget>[
                    SiteCountCard(
                      totalSites: sites.data?.length ?? 0,
                      sites: allFarmTypes,
                    ),
                    SizedBox(
                      height: Spacing.space(4),
                    ),
                    if (canCreateSite)
                      AppButton(
                        variant: ButtonVariant.outline,
                        color: AppColors.primaryDark,
                        onPressed: () {
                          context.go(
                            '/create-site',
                            extra: {
                              'origin': 'Sites',
                            },
                          );
                        },
                        icon: const Icon(
                          Icons.add_location_outlined,
                          size: 15,
                          color: AppColors.primaryDark,
                        ),
                        child: Text(
                          'Create Site',
                          style: AppTypography.textTheme.buttonSmall
                              .copyWith(color: AppColors.buttonTextActive),
                        ),
                      ),
                  ],
                ),
              ),
            ),
            SizedBox(
              height: Spacing.space(4),
            ),
            Container(
              width: MediaQuery.of(context).size.width,
              color: AppColors.white,
              child: Padding(
                padding: Spacing.p(4),
                child: Column(
                  children: <Widget>[
                    SizedBox(
                      height: Spacing.space(2),
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: <Widget>[
                        Text(
                          'All Sites',
                          style: AppTypography.textTheme.headingH3.copyWith(
                            color: AppColors.textStrong,
                          ),
                        ),
                        Row(
                          children: <Widget>[
                            SizedBox(
                              width: Spacing.space(2),
                            ),
                            // Padding(
                            //   padding: Spacing.pr(2),
                            //   child: CustomDropdown(
                            //     borderColor: AppColors.borderLight,
                            //     height: 30,
                            //     prefixIcon:
                            //         const Icon(Icons.filter_alt_outlined),
                            //     width: 120,
                            //     items: filter,
                            //     value: selectedLanguage,
                            //     hint: 'filter',
                            //     textStyle:
                            //         Theme.of(context).textTheme.labelLarge,
                            //     onChanged: (String? newValue) {
                            //       // if (newValue != null) {
                            //       //   setState(() {
                            //       //     _selectedValue = newValue;
                            //       //   });
                            //       // }
                            //     },
                            //   ),
                            // ),
                            // Padding(
                            //   padding: Spacing.pr(2),
                            //   child: CustomDropdown(
                            //     borderColor: AppColors.borderLight,
                            //     prefixIcon:
                            //         const Icon(Icons.compare_arrows_sharp),
                            //     height: 30,
                            //     width: 110,
                            //     items: filter,
                            //     value: selectedLanguage,
                            //     hint: 'short by',
                            //     textStyle:
                            //         Theme.of(context).textTheme.labelLarge,
                            //     onChanged: (String? newValue) {
                            //       // if (newValue != null) {
                            //       //   setState(() {
                            //       //     _selectedValue = newValue;
                            //       //   });
                            //       // }
                            //     },
                            //   ),
                            // ),
                          ],
                        ),
                      ],
                    ),
                    ListView.builder(
                        physics: const ScrollPhysics(),
                        shrinkWrap: true,
                        itemCount: sites.data?.length ?? 0,
                        // itemCount: mergedSites.length,
                        // itemBuilder: (BuildContext context, int index) {
                        //   final site = sites.data![index];
                        //   return InkWell(
                        //     onTap: () {
                        //       context.go('/site-details', extra: {
                        //         'siteId': site.id,
                        //       });
                        //     },
                        //     child: Padding(
                        //       padding: Spacing.py(2),
                        //       child: LocationInfoWidget(
                        //         location: site.location,
                        //         farmName: site.name,
                        //         farmType: site.farmType.text,
                        //         siteNumber: site.siteCode ?? '',
                        //         address: site.address ?? '',
                        //         assignedCollectors:
                        //             site.collectionCollector?.firstName ?? '',
                        //         collectionSchedule:
                        //             '${site.collectionTime ?? ''} time / ${site.collectionDayOfWeek ?? ''} day',
                        //         mapImageUrl:
                        //             'https://storage.googleapis.com/support-forums-api/attachment/message-41810945-4911587587329301990.jpeg',
                        //         //profileImageUrl: 'YOUR_PROFILE_IMAGE_URL',
                        //       ),
                        //     ),
                        //   );
                        // },
                        itemBuilder: (BuildContext context, int index) {
                          final site = sites.data![index];
                          return InkWell(
                            onTap: () {
                              context.go('/site-details',
                                  extra: {'siteId': site.id});
                            },
                            child: Padding(
                              padding: Spacing.py(2),
                              child: LocationInfoWidget(
                                location: site.location,
                                farmName: site.name,
                                farmType: site.farmType ?? '',
                                siteNumber: site.siteCode ?? '',
                                address: site.address ?? '',
                                assignedCollectors:
                                    site.collectionCollector?.firstName ?? '',
                                collectionSchedule:
                                    '${site.collectionTime ?? ''} time / ${site.collectionDayOfWeek ?? ''} day',
                                mapImageUrl:
                                    'https://storage.googleapis.com/support-forums-api/attachment/message-41810945-4911587587329301990.jpeg',
                              ),
                            ),
                          );
                        }),
                  ],
                ),
              ),
            ),
          ],
        ),
      );
    } else if (sites.isLoading) {
      body = Center(child: CircularProgressIndicator());
    }

    return SafeArea(
      child: Scaffold(
        appBar: AppBar(
          backgroundColor: AppColors.white,
          centerTitle: true,
          elevation: 0,
          title: Text(
            'Assigned Sites',
            style: Theme.of(context)
                .textTheme
                .bodyLarge
                ?.copyWith(color: AppColors.labletestblack),
            textAlign: TextAlign.center,
            overflow: TextOverflow.ellipsis,
            maxLines: 1,
          ),
          // leading: AppButton(
          //   variant: ButtonVariant.icon,
          //   size: ButtonSize.sm,
          //   onPressed: () {
          //     Navigator.pop(context);
          //   },
          //   child:
          //       const Icon(Icons.arrow_back, color: AppColors.labletestblack),
          // ),
        ),
        body: body,
      ),
    );
  }
}
