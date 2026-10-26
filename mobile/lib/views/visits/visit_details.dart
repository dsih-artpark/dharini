import 'package:cached_network_image/cached_network_image.dart';
import 'package:design_system/design_system.dart';
import 'package:es_client/es_client.dart';
import 'package:es_platform_mobile/domain/extensions/model_extension.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';

class VisitDetailsScreen extends HookWidget {
  final VisitResponseData visitDetails;

  const VisitDetailsScreen({
    required this.visitDetails,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    // Refetch visit details when the screen is mounted

    final visit = visitDetails;

    /// Counts the number of replicate samples
    /// A replicate sample has originalSampleId set to the parent's ID
    int _countReplicate(String sampleId) {
      // TODO: Implement replicate count
      return 0;
      // return visit.samples
      //     .where((sample) => sample.originalSampleId == sampleId)
      //     .length;
    }

    /// Filters to get only parent samples
    List<VisitSampleData> _getParentSamples() {
      // TODO: Implement parent sample filter
      return visit.samples.toList();
      // return visit.samples
      //     .where((sample) => sample.originalSampleId == null)
      //     .toList();
    }

    // Define the builder functions at the top level of build
    Widget buildDiseaseCard(String title, String status) => Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            border: Border.all(color: AppColors.strokeWeak),
            borderRadius: BorderRadius.circular(4),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.max,
            children: [
              Container(
                width: double.infinity,
                decoration: BoxDecoration(
                  color: AppColors.white,
                  borderRadius: BorderRadius.circular(0),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: AppTypography.textTheme.bodyB2SemiBold.copyWith(
                        color: AppColors.textStrong,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      status,
                      style: AppTypography.textTheme.bodyB3Regular.copyWith(
                        color: AppColors.textWeak,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );

    Widget buildSampleCard(
      String title,
      String barcode,
      String replicates,
      String photos,
      String comments,
    ) =>
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            border: Border.all(color: AppColors.strokeWeak),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Title and Barcode Row
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    title,
                    style: AppTypography.textTheme.bodyB2SemiBold.copyWith(
                      color: AppColors.textStrong,
                    ),
                  ),
                  Text(
                    barcode,
                    style: AppTypography.textTheme.labelMMedium.copyWith(
                      color: AppColors.textWeak,
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 8),
              const Divider(
                color: AppColors.strokeWeak,
                height: 16,
              ),
              const SizedBox(height: 8),
              // Replicates and Photos Row
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    replicates,
                    style: AppTypography.textTheme.labelMMedium.copyWith(
                      color: replicates.startsWith('0')
                          ? AppColors.textWeak
                          : AppColors.primaryLight,
                    ),
                  ),
                  const SizedBox(width: 24),
                  Row(children: [
                    const Icon(
                      Icons.attach_file_outlined,
                      size: 16,
                      color: AppColors.textStrong,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      photos,
                      style: AppTypography.textTheme.labelMMedium.copyWith(
                        color: AppColors.textStrong,
                      ),
                    ),
                  ]),
                ],
              ),
              const SizedBox(height: 16),

              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.background,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  comments.isNotEmpty ? comments : 'No comments',
                  style: AppTypography.textTheme.bodyB3Medium.copyWith(
                    color: AppColors.textStrong,
                  ),
                ),
              ),
            ],
          ),
        );

    Widget buildPhotoThumbnail(String photo) => Container(
          width: 100,
          height: 100,
          margin: const EdgeInsets.only(right: 8),
          decoration: BoxDecoration(
            color: AppColors.surfaceLight,
            borderRadius: BorderRadius.circular(8),
          ),
          child: photo.isNotEmpty
              ? CachedNetworkImage(
                  imageUrl: photo,
                  placeholder: (context, url) =>
                      const Icon(Icons.photo_outlined),
                  errorWidget: (context, url, error) =>
                      const Icon(Icons.photo_outlined),
                  fit: BoxFit.cover,
                )
              : const Icon(Icons.photo_outlined),
        );

    Widget buildVisitorCard(String initials, String name, String email) =>
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            border: Border.all(color: AppColors.strokeWeak),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: AppColors.surfaceLight,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Center(
                  child: Text(
                    initials,
                    style: AppTypography.textTheme.bodyB2SemiBold.copyWith(
                      color: AppColors.textStrong,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      name,
                      style: AppTypography.textTheme.bodyB2SemiBold.copyWith(
                        color: AppColors.textStrong,
                      ),
                    ),
                    Text(
                      email,
                      style: AppTypography.textTheme.bodyB3Regular.copyWith(
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
            ],
          ),
        );

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: const BackButton(color: AppColors.textStrong),
        title: Text(
          'Visit Details',
          style: AppTypography.textTheme.bodyB2SemiBold.copyWith(
            color: AppColors.textStrong,
          ),
        ),
        actions: [],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Farm Image and Details
            Container(
              color: AppColors.background,
              height: 160,
              child: Stack(
                clipBehavior: Clip.none,
                children: [
                  Positioned.fill(
                    child: CachedNetworkImage(
                      imageUrl: visit.site.photos?.firstOrNull ?? '',
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
                    left: 16,
                    right: 16,
                    child: Container(
                      padding: const EdgeInsets.all(16),
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
                            visit.site.name,
                            style: AppTypography.textTheme.headingH3.copyWith(
                              color: AppColors.textStrong,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            '${visit.site.farmType ?? 'Unknown Farm Type'}  |  SITE CODE : ${visit.site.siteCode ?? 'N/A'}',
                            style:
                                AppTypography.textTheme.labelMMedium.copyWith(
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
            const SizedBox(height: 80),
            // Surveillance Details Section
            Padding(
              padding: const EdgeInsets.only(top: 8, bottom: 8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.all(16),
                    color: AppColors.white,
                    child: Column(children: [
                      Row(
                        children: [
                          CircleAvatar(
                            radius: 16,
                            backgroundColor: AppColors.secondaryPurple10,
                            child: const Icon(Icons.search,
                                color: Colors.white, size: 16),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            'Surveillance Details',
                            style:
                                AppTypography.textTheme.bodyB2SemiBold.copyWith(
                              color: AppColors.textStrong,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      if (visit.suspectedPositives?.isNotEmpty == true)
                        ...visit.suspectedPositives!
                            .toList()
                            .map((disease) => Padding(
                                  padding: const EdgeInsets.only(bottom: 8),
                                  child: buildDiseaseCard(
                                    disease.disease?.name ?? 'Unknown Disease',
                                    disease.isSuspectedPositive == true
                                        ? '${disease.sampleCount ?? 0} Positives Suspected'
                                        : 'No Positives Suspected',
                                  ),
                                ))
                      else
                        Text(
                          'No surveillance details available',
                          style: AppTypography.textTheme.bodyB3Regular.copyWith(
                            color: AppColors.textWeak,
                          ),
                        ),
                    ]),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 4),
            // Sample Details Section
            Padding(
              padding: const EdgeInsets.only(top: 8, bottom: 8),
              child: Container(
                padding: const EdgeInsets.all(16),
                color: AppColors.white,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        CircleAvatar(
                          radius: 16,
                          backgroundColor: AppColors.secondaryPurple10,
                          child: const Icon(Icons.science_outlined,
                              color: Colors.white, size: 16),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'Sample Details',
                          style:
                              AppTypography.textTheme.bodyB2SemiBold.copyWith(
                            color: AppColors.textStrong,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    ..._getParentSamples().map((sample) => Padding(
                          padding: const EdgeInsets.only(bottom: 8),
                          child: buildSampleCard(
                            sample.sampleType?.name ?? 'Unnamed Sample',
                            sample.barcode,
                            '${_countReplicate(sample.id)} REPLICATE${_countReplicate(sample.id) != 1 ? 'S' : ''}',
                            '${sample.photos.length} PHOTOS',
                            sample.comment ?? '',
                          ),
                        )),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 4),
            // Photos & Comments Section
            Padding(
              padding: const EdgeInsets.only(top: 8, bottom: 8),
              child: Container(
                padding: const EdgeInsets.all(16),
                color: AppColors.white,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        CircleAvatar(
                          radius: 16,
                          backgroundColor: AppColors.secondaryPurple10,
                          child: const Icon(Icons.chat_bubble_outline,
                              color: Colors.white, size: 16),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'Photos & Comments',
                          style:
                              AppTypography.textTheme.bodyB2SemiBold.copyWith(
                            color: AppColors.textStrong,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      child: Row(
                        children: [
                          ...(visit.site.photos?.toList() ?? [])
                              .map((photo) => buildPhotoThumbnail(photo)),
                          if (visit.site.photos?.isNotEmpty == true)
                            Stack(
                              children: [
                                Container(
                                  width: 100,
                                  height: 100,
                                  decoration: BoxDecoration(
                                    color: AppColors.overlayBarrier,
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Center(
                                    child: Text(
                                      '${visit.site.photos?.length ?? 0}',
                                      style: AppTypography.textTheme.headingH2
                                          .copyWith(
                                        color: Colors.white,
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'COLLECTOR\'S COMMENT',
                      style: AppTypography.textTheme.bodyB4Medium.copyWith(
                        color: AppColors.textWeak,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Container(
                      width: double.infinity,
                      height: 100,
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.background,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        visit.comment ?? 'No comments',
                        style: AppTypography.textTheme.bodyB3Regular.copyWith(
                          color: AppColors.textStrong,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 4),
            // Visited by Section
            Padding(
              padding: const EdgeInsets.only(top: 16, bottom: 16),
              child: Container(
                padding: const EdgeInsets.all(16),
                color: AppColors.white,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        CircleAvatar(
                          radius: 16,
                          backgroundColor: AppColors.secondaryPurple10,
                          child: const Icon(Icons.location_on_outlined,
                              color: Colors.white, size: 16),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'Visited by',
                          style:
                              AppTypography.textTheme.bodyB2SemiBold.copyWith(
                            color: AppColors.textStrong,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    if (visit.collector != null)
                      // buildVisitorCard(
                      //   visit.collector?.lastName
                      //           ?.substring(0, 2)
                      //           .toUpperCase() ??
                      //       'NA',
                      //   '${visit.collector?.firstName ?? ''} ${visit.collector?.lastName ?? ''}',
                      //   visit.collector?.email ?? 'No email',
                      // ),
                      buildVisitorCard(
                        (visit.collector?.lastName != null &&
                                visit.collector!.lastName!.length >= 2)
                            ? visit.collector!.lastName!
                                .substring(0, 2)
                                .toUpperCase()
                            : (visit.collector?.lastName ?? 'NA').toUpperCase(),
                        '${visit.collector?.firstName ?? ''} ${visit.collector?.lastName ?? ''}',
                        visit.collector?.email ?? 'No email',
                      ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
