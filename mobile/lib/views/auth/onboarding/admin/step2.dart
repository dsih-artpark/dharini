import 'package:design_system/design_system.dart';
// import 'package:es_platform_mobile/views/auth/onboarding/admin/contactscreen.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../utils/configs/constants.dart';

class OnbordingAdminstep2Screen extends StatelessWidget {
  const OnbordingAdminstep2Screen({super.key});

  @override
  Widget build(BuildContext context) => SafeArea(
        child: Scaffold(
          resizeToAvoidBottomInset: false, // Prevent layout adjustment
          body: Stack(
            children: <Widget>[
              ListView(
                children: <Widget>[
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: SingleChildScrollView(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          const SizedBox(
                            height: 20,
                          ),
                          const CircleAvatar(
                            radius: 20,
                            backgroundColor: Color(0xffE0DCC5),
                            child: Center(
                              child: Image(
                                image: AssetImage(
                                  Assets.step2memberIcon,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(
                            height: 10,
                          ),
                          Text(
                            'Step 2 of 2',
                            style: AppTypography.textTheme.labelLarge
                                ?.copyWith(color: AppColors.labletestgrey),
                          ),
                          const SizedBox(
                            height: 10,
                          ),
                          Text(
                            'Invite Collectors',
                            style: AppTypography.textTheme.displayLarge
                                ?.copyWith(color: AppColors.labletestblack),
                          ),
                          const Divider(
                            color: AppColors.borderLight,
                          ),
                          const SizedBox(
                            height: 10,
                          ),
                          Text(
                            'We will send an invite via SMS to the selected contacts, once you submit.',
                            style: AppTypography.textTheme.bodySmall
                                ?.copyWith(color: AppColors.labletestgrey),
                          ),
                          const SizedBox(
                            height: 10,
                          ),
                          // Contacts invite disabled (see add_new_member_screen.dart).
                          // SizedBox(
                          //   width: MediaQuery.of(context).size.width,
                          //   child: AppButton(
                          //     onPressed: () {
                          //       Navigator.push(
                          //           context,
                          //           MaterialPageRoute(
                          //               builder: (context) =>
                          //                   ContactListScreen()));
                          //     },
                          //     variant: ButtonVariant.tonal,
                          //     child: const Text('Invite via Contacts'),
                          //   ),
                          // ),
                          const SizedBox(
                            height: 10,
                          ),
                          Text(
                            'Selected Contacts (0)',
                            style: AppTypography.textTheme.bodySmall
                                ?.copyWith(color: AppColors.labletestblack),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(
                    height: 120,
                  ),
                ],
              ),
              Positioned(
                bottom: 0,
                left: 0,
                right: 0,
                child: Container(
                  padding: const EdgeInsets.all(16),
                  color: Colors.white
                      .withOpacity(0.9), // Optional semi-transparent background
                  child: AppButton(
                    child: const Text('Submit & Proceed'),
                    onPressed: () {
                      context.go('/');
                    },
                  ),
                ),
              ),
            ],
          ),
        ),
      );
}
