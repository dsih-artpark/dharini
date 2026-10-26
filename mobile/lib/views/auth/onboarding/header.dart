import 'package:design_system/design_system.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg_provider/flutter_svg_provider.dart';

import '../../../utils/configs/constants.dart';

class OnboardingHeader extends StatelessWidget {
  final VoidCallback? onLogoTap;

  const OnboardingHeader({super.key, this.onLogoTap});

  @override
  Widget build(BuildContext context) => Container(
        height: 130,
        decoration: const BoxDecoration(color: AppColors.primaryLight),
        child: Stack(
          children: <Widget>[
            Positioned(
              left: 20,
              top: 50,
              child: Row(
                children: <Widget>[
                  GestureDetector(
                    onTap: onLogoTap,
                    child: Container(
                      height: 56,
                      width: 56,
                      decoration: const BoxDecoration(
                        image: DecorationImage(
                          image: AssetImage(Assets.loginHeaderLogo),
                          fit: BoxFit.contain,
                          colorFilter: ColorFilter.mode(
                            Colors.white,
                            BlendMode.srcIn,
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Text(
                    'Dharini',
                    style: AppTypography.textTheme.titleLarge
                        ?.copyWith(color: Colors.white),
                  ),
                ],
              ),
            ),
            Positioned(
              right: -130,
              top: 20,
              bottom: 5,
              child: Container(
                width: 250,
                height: 500,
                decoration: const BoxDecoration(
                  image: DecorationImage(
                    image: Svg(Assets.circleGraphics),
                    fit: BoxFit.cover,
                  ),
                ),
              ),
            ),
          ],
        ),
      );
}
