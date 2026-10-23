import 'package:design_system/design_system.dart';
import 'package:es_platform_mobile/utils/extensions/validator.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../utils/configs/constants.dart';

class OnbordingAdminstep1Screen extends StatelessWidget {
  const OnbordingAdminstep1Screen({super.key});

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
                                  Assets.step1personIcon,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(
                            height: 10,
                          ),
                          Text(
                            'Step 1 of 2',
                            style: AppTypography.textTheme.labelLarge
                                ?.copyWith(color: AppColors.labletestgrey),
                          ),
                          const SizedBox(
                            height: 10,
                          ),
                          Text(
                            'Set up your Profile',
                            style: AppTypography.textTheme.displayMedium
                                ?.copyWith(color: AppColors.labletestblack),
                          ),
                          const SizedBox(
                            height: 15,
                          ),
                          const Divider(
                            color: Color(0xffE6E8EB),
                          ),
                          const SizedBox(
                            height: 15,
                          ),
                          Text(
                            'Your Name',
                            style: AppTypography.textTheme.displaySmall
                                ?.copyWith(color: AppColors.labletestblack),
                          ),
                          const SizedBox(
                            height: 10,
                          ),
                          AppTextField(
                            label: 'First Name',
                            placeholder: ' Enter Your First Name',
                            // obscureText: true,
                            onChanged: (String val) {},
                            validator: ValidationHelper.validateName,
                          ),
                          const SizedBox(
                            height: 10,
                          ),
                          AppTextField(
                            label: 'Last Name',
                            placeholder: ' Enter Your Last Name',
                            onChanged: (String val) {},
                            validator: ValidationHelper.validateName,
                          ),
                          const SizedBox(
                            height: 20,
                          ),
                          const Divider(
                            color: Color(0xffE6E8EB),
                          ),
                          const SizedBox(
                            height: 15,
                          ),
                          Text(
                            'Contact Information',
                            style: AppTypography.textTheme.displaySmall
                                ?.copyWith(color: AppColors.labletestblack),
                          ),
                          const SizedBox(
                            height: 10,
                          ),
                          const SizedBox(
                            height: 15,
                          ),
                          const AppTextField(
                            keyboardType: TextInputType.phone,
                            label: 'Phone Number',
                            validator: ValidationHelper.validatePhoneNumber,
                            placeholder: 'Enter your Phone Number',
                          ),
                          const SizedBox(
                            height: 10,
                          ),
                          const AppTextField(
                            label: 'Email Address',
                            validator: ValidationHelper.validateEmail,
                            placeholder: 'Enter your Email',
                          ),
                          const SizedBox(
                            height: 10,
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
                    child: const Text('Proceed'),
                    onPressed: () {
                      context.go('/onboardingadminstep2');
                    },
                  ),
                  //  AppButton(
                  //   title: 'Proceed',
                  //   onPressed: () {
                  //     context.go('/onboardingadminstep2');
                  //   },
                  //   height: MediaQuery.of(context).size.height * .07,
                  //   width: MediaQuery.of(context).size.width * .4,
                  //   color: const Color(0xff284DB6),
                  // ),
                ),
              ),
            ],
          ),
        ),
      );
}
