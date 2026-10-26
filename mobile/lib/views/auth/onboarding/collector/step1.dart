import 'package:design_system/design_system.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../utils/configs/constants.dart';

class OnbordingCollectorstep1Screen extends StatelessWidget {
  const OnbordingCollectorstep1Screen({super.key});

  @override
  Widget build(BuildContext context) => SafeArea(
        child: Scaffold(
          resizeToAvoidBottomInset: false, // Prevent layout adjustment
          body: Stack(
            children: <Widget>[
              ListView(
                children: const <Widget>[
                  ColoredBox(
                    color: AppColors.white,
                    child: Padding(
                      padding: EdgeInsets.symmetric(horizontal: 20),
                      child: ColoredBox(
                        color: AppColors.white,
                        child: SingleChildScrollView(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: <Widget>[
                              SizedBox(
                                height: 20,
                              ),
                              CircleAvatar(
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
                              SizedBox(
                                height: 10,
                              ),
                              Text(
                                'Set up your Profile',
                                style: TextStyle(
                                  fontFamily: 'NotoSerif',
                                  fontSize: 25,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.black,
                                ),
                              ),
                              SizedBox(
                                height: 15,
                              ),
                              Divider(
                                color: Color(0xffE6E8EB),
                              ),
                              SizedBox(
                                height: 15,
                              ),
                              Text(
                                'Your Name',
                                style: TextStyle(
                                  fontSize: 25,
                                  fontWeight: FontWeight.w500,
                                  color: Colors.black,
                                ),
                              ),
                              SizedBox(
                                height: 10,
                              ),
                              SizedBox(
                                height: 15,
                              ),
                              Text(
                                'First Name',
                                style: TextStyle(
                                  fontSize: 25,
                                  // fontWeight: FontWeight.w500,
                                  color: Colors.black,
                                ),
                              ),
                              SizedBox(
                                height: 10,
                              ),
                              AppTextField(
                                obscureText: true,
                              ),
                              SizedBox(
                                height: 10,
                              ),
                              Text(
                                'Last Name',
                                style: TextStyle(
                                  fontSize: 25,
                                  // fontWeight: FontWeight.w500,
                                  color: Colors.black,
                                ),
                              ),
                              SizedBox(
                                height: 10,
                              ),
                              AppTextField(
                                obscureText: true,
                              ),
                              SizedBox(
                                height: 20,
                              ),
                              Divider(
                                color: Color(0xffE6E8EB),
                              ),
                              SizedBox(
                                height: 15,
                              ),
                              Text(
                                'Contact Information',
                                style: TextStyle(
                                  fontSize: 25,
                                  fontWeight: FontWeight.w500,
                                  color: Colors.black,
                                ),
                              ),
                              SizedBox(
                                height: 10,
                              ),
                              SizedBox(
                                height: 15,
                              ),
                              Text(
                                'Phone Number',
                                style: TextStyle(
                                  fontSize: 25,
                                  // fontWeight: FontWeight.w500,
                                  color: Colors.black,
                                ),
                              ),
                              SizedBox(
                                height: 10,
                              ),
                              AppTextField(
                                obscureText: true,
                              ),
                              SizedBox(
                                height: 10,
                              ),
                              Text(
                                'Email Address',
                                style: TextStyle(
                                  fontSize: 25,
                                  // fontWeight: FontWeight.w500,
                                  color: Colors.black,
                                ),
                              ),
                              AppTextField(
                                obscureText: true,
                              ),
                              SizedBox(
                                height: 10,
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                  SizedBox(
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
                      context.go('/home');
                    },
                  ),
                ),
              ),
            ],
          ),
        ),
      );
}
