import 'package:design_system/design_system.dart';
import 'package:flutter/material.dart';

class FarmVisitDetailsPage extends StatelessWidget {
  const FarmVisitDetailsPage({super.key});

  @override
  Widget build(BuildContext context) => SafeArea(
        child: Scaffold(
          appBar: PreferredSize(
            preferredSize: const Size.fromHeight(56),
            child: HeaderNavigation(
              title: 'Visit Details',
              prefix: const BackButton(),
            ),
          ),
          body: Stack(
            children: <Widget>[
              SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    SizedBox(
                      height: 200,
                      width: MediaQuery.of(context).size.width,
                    ),
                    _buildFarmHeader(context),
                    _buildSurveillanceSection(context),
                    _buildSamplesSection(context),
                    _buildPhotosSection(context),
                    _buildVisitedBySection(context),
                    // Extra space for the bottom button
                    const SizedBox(height: 80),
                  ],
                ),
              ),
              Positioned(
                bottom: 0,
                left: 0,
                right: 0,
                child: Container(
                  padding: const EdgeInsets.all(16),
                  color: Colors.white.withOpacity(0.9),
                  child: AppButton(
                    onPressed: () {
                      // Navigator.push<SuccessScreen>(
                      //   context,
                      //   MaterialPageRoute<SuccessScreen>(
                      //     builder: (BuildContext context) =>
                      //         const SuccessScreen(
                      //       totalSamples: 0,
                      //       sampleTypes: '',
                      //       profile: UserProfileResponseData(),
                      //   ),
                      // );
                    },
                    child: const Text('Submit Visit'),
                  ),
                ),
              ),
            ],
          ),
        ),
      );

  Widget _buildFarmHeader(BuildContext context) => Container(
        padding: Spacing.p(4),
        color: AppColors.white,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text(
                      'Anjaneya Farms',
                      style: Theme.of(context)
                          .textTheme
                          .displaySmall
                          ?.copyWith(color: AppColors.labletestblack),
                    ),
                    Text(
                      'DT: 11/1 DATE : 11/11 CODE : 78',
                      style: Theme.of(context)
                          .textTheme
                          .bodyMedium
                          ?.copyWith(color: AppColors.labletestgrey),
                    ),
                  ],
                ),
                Container(
                  padding: Spacing.px(2),
                  decoration: BoxDecoration(
                    color: const Color(0xffE0DCC5),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: const Column(
                    children: <Widget>[
                      Text('Ang'),
                      Text('9'),
                    ],
                  ),
                ),
              ],
            ),
            SizedBox(height: Spacing.space(1)),
          ],
        ),
      );

  Widget _buildSurveillanceSection(BuildContext context) => Container(
        margin: Spacing.p(2),
        color: AppColors.white,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Padding(
              padding: Spacing.p(2),
              child: Row(
                children: <Widget>[
                  const CircleAvatar(
                    backgroundColor: Color(0xffE7D2F7),
                    radius: 20,
                    child: Icon(
                      Icons.search,
                      color: Color(0xff8C47BF),
                    ),
                  ),
                  SizedBox(width: Spacing.space(2)),
                  Text(
                    'Surveillance Details',
                    style: Theme.of(context)
                        .textTheme
                        .displaySmall
                        ?.copyWith(color: AppColors.labletestblack),
                  ),
                ],
              ),
            ),
            _buildSurveillanceItem(
              'Foot & Mouth Disease',
              'No Problems Suspected',
              context,
            ),
            _buildSurveillanceItem(
              'Lumpy Skin Diseases',
              'No Problems Suspected',
              context,
            ),
            SizedBox(height: Spacing.space(4)),
          ],
        ),
      );

  Widget _buildSurveillanceItem(
    String title,
    String description,
    BuildContext context,
  ) =>
      Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Padding(
            padding: Spacing.px(4),
            child: Container(
              width: MediaQuery.of(context).size.width,
              decoration: BoxDecoration(
                border: Border.all(color: AppColors.borderLight),
              ),
              child: Padding(
                padding: Spacing.p(2),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text(
                      title,
                      style: Theme.of(context)
                          .textTheme
                          .bodyMedium
                          ?.copyWith(color: AppColors.labletestblack),
                    ),
                    SizedBox(height: Spacing.space(1)),
                    Text(
                      description,
                      style: Theme.of(context)
                          .textTheme
                          .bodySmall
                          ?.copyWith(color: AppColors.labletestgrey),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      );

  Widget _buildSamplesSection(BuildContext context) => ColoredBox(
        color: AppColors.white,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Padding(
              padding: Spacing.p(4),
              child: Row(
                children: <Widget>[
                  Padding(
                    padding: Spacing.p(2),
                    child: Row(
                      children: <Widget>[
                        const CircleAvatar(
                          backgroundColor: Color(0xffE7D2F7),
                          radius: 20,
                          child: Icon(
                            Icons.thermostat,
                            color: Color(0xff8C47BF),
                          ),
                        ),
                        SizedBox(width: Spacing.space(2)),
                        Text(
                          'Sample Details',
                          style: Theme.of(context)
                              .textTheme
                              .displaySmall
                              ?.copyWith(color: AppColors.labletestblack),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            _buildSampleItem(
              'Waste water',
              '2 REPLICATES',
              '6 PHOTOS',
              'Very sunny day, took time to reach hotspots and store sampl',
              'G-2407-E-L-11-09',
            ),
            const SizedBox(
              height: 10,
            ),
            _buildSampleItem(
              'Anjaneya Farms',
              '2 REPLICATES',
              '6 PHOTOS',
              'Very sunny day, took time to reach hotspots and store sampl',
              'G-2407-E-L-11-09',
            ),
          ],
        ),
      );

  Widget _buildSampleItem(
    String title,
    String replicates,
    String photos,
    String description,
    String sampleId,
  ) =>
      Padding(
        padding: Spacing.px(4),
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(4),
            boxShadow: <BoxShadow>[
              BoxShadow(
                color: Colors.grey.withOpacity(0.1),
                blurRadius: 4,
                offset: const Offset(0, 1),
              ),
            ],
            border: Border.all(color: AppColors.borderLight),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              // Title and Sample ID row
              Padding(
                padding: const EdgeInsets.all(8),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: <Widget>[
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Colors.black87,
                      ),
                    ),
                    Text(
                      sampleId,
                      style: const TextStyle(
                        fontSize: 14,
                        color: Colors.grey,
                      ),
                    ),
                  ],
                ),
              ),
              const Divider(
                color: AppColors.borderLight,
              ),
              const SizedBox(height: 8),

              // Replicates and Photos row
              Padding(
                padding: const EdgeInsets.all(8),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: <Widget>[
                    Text(
                      replicates,
                      style: const TextStyle(
                        fontSize: 14,
                        color: Colors.grey,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Container(
                      decoration: BoxDecoration(
                        border: Border.all(),
                        color: AppColors.backgroundLight,
                        borderRadius:
                            const BorderRadius.all(Radius.circular(25)),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(4),
                        child: Row(
                          children: <Widget>[
                            const Icon(
                              Icons.camera_alt_outlined,
                              size: 16,
                              color: Colors.grey,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              photos,
                              style: const TextStyle(
                                fontSize: 14,
                                color: Colors.grey,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 8),

              // Description
              Padding(
                padding: const EdgeInsets.all(8),
                child: ColoredBox(
                  color: AppColors.backgroundLight,
                  child: Text(
                    description,
                    style: const TextStyle(
                      fontSize: 14,
                      color: Colors.grey,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      );

  Widget _buildPhotosSection(BuildContext context) => Container(
        margin: Spacing.p(2),
        color: AppColors.white,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Padding(
              padding: Spacing.p(4),
              child: Row(
                children: <Widget>[
                  const CircleAvatar(
                    backgroundColor: Color(0xffE7D2F7),
                    radius: 20,
                    child: Icon(
                      Icons.folder_copy_outlined,
                      color: Color(0xff8C47BF),
                    ),
                  ),
                  SizedBox(width: Spacing.space(2)),
                  Text(
                    'Photos & Comments',
                    style: Theme.of(context)
                        .textTheme
                        .displaySmall
                        ?.copyWith(color: AppColors.labletestblack),
                  ),
                ],
              ),
            ),
            Padding(
              padding: Spacing.p(4),
              child: GridView.count(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                crossAxisCount: 3,
                mainAxisSpacing: 8,
                crossAxisSpacing: 8,
                // ignore: always_specify_types
                children: List.generate(
                  3,
                  (int index) => Container(
                    decoration: BoxDecoration(
                      color: AppColors.borderLight,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child:
                        const Icon(Icons.photo, color: AppColors.borderLight),
                  ),
                ),
              ),
            ),
            Padding(
              padding: Spacing.px(4),
              child: const Text(
                'collector’s Comment',
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey,
                ),
              ),
            ),
            Padding(
              padding: Spacing.p(4),
              child: const ColoredBox(
                color: AppColors.backgroundLight,
                child: Text(
                  'Very sunny day, took time to reach hotspots and store sampl',
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey,
                  ),
                ),
              ),
            ),
          ],
        ),
      );

  Widget _buildVisitedBySection(BuildContext context) => Container(
        margin: Spacing.p(2),
        color: AppColors.white,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Padding(
              padding: Spacing.p(4),
              child: Row(
                children: <Widget>[
                  const CircleAvatar(
                    backgroundColor: Color(0xffE7D2F7),
                    radius: 20,
                    child: Icon(
                      Icons.person_pin_circle_outlined,
                      color: Color(0xff8C47BF),
                    ),
                  ),
                  SizedBox(width: Spacing.space(2)),
                  Text(
                    'Visited By',
                    style: Theme.of(context)
                        .textTheme
                        .displaySmall
                        ?.copyWith(color: AppColors.labletestblack),
                  ),
                ],
              ),
            ),
            _buildVisitorItem(
              'AG',
              'Anushka Gokahle',
              'anushka.gokhale@somewhere...',
              context,
            ),
            _buildVisitorItem(
              'RG',
              'Riti Gupta',
              'anushka.gokhale@somewhere...',
              context,
            ),
          ],
        ),
      );

  Widget _buildVisitorItem(
    String initials,
    String name,
    String email,
    BuildContext context,
  ) =>
      Container(
        decoration: BoxDecoration(
          border: Border.all(
            color: AppColors.borderLight,
          ),
          borderRadius: const BorderRadius.all(Radius.circular(4)),
        ),
        child: ListTile(
          leading: Avatar(
            backgroundColor: const Color(0xffE4F2F2),
            placeholder: initials,
          ),
          title: Text(
            name,
            style: Theme.of(context)
                .textTheme
                .bodyMedium
                ?.copyWith(color: AppColors.labletestblack),
          ),
          subtitle: Text(
            email,
            style: Theme.of(context)
                .textTheme
                .bodySmall
                ?.copyWith(color: AppColors.labletestgrey),
          ),
          trailing: const Icon(
            Icons.arrow_forward_ios_outlined,
            size: 15,
            color: AppColors.labletestblack,
          ),
        ),
      );
}
