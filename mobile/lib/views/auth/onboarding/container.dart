import 'package:design_system/design_system.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg_provider/flutter_svg_provider.dart' show Svg;

import '../../../../utils/configs/constants.dart';

class OnboardingContainer extends StatelessWidget {
  final String project;
  final String firstName;

  const OnboardingContainer({
    super.key,
    required this.project,
    required this.firstName,
  });

  @override
  Widget build(BuildContext context) {
    final projectName = project.toLowerCase().startsWith("project")
        ? project
        : "Project $project";

    return Container(
      width: MediaQuery.of(context).size.width,
      height: 250,
      decoration: const BoxDecoration(
        color: AppColors.primaryLight,
      ),
      child: Stack(
        children: <Widget>[
          // Status bar color container (bottom-most layer)
          Positioned(
            top: 0,
            child: Container(
              width: MediaQuery.of(context).size.width,
              height: 40,
              color: AppColors.primaryLight,
            ),
          ),

          // Welcome Text
          Positioned(
            top: 60,
            left: 20,
            child: Text(
              'Welcome, ${firstName} to',
              style: AppTypography.textTheme.bodyMedium
                  ?.copyWith(color: Colors.white),
            ),
          ),

          // Project Hassan Text
          Positioned(
            top: 80,
            left: 20,
            right: 16,
            child: Text(
              projectName,
              maxLines: 3,
              style: AppTypography.textTheme.titleLarge?.copyWith(
                color: Colors.white,
                height: 1.2,
              ),
            ),
          ),

          // Circle graphics (top-most layer)
          Positioned(
            right: -60,
            top: -30,
            child: Container(
              width: 250,
              height: 250,
              decoration: BoxDecoration(
                // Add debug border to see the container bounds
                border: Border.all(color: Colors.transparent, width: 1),
                image: DecorationImage(
                  image: Svg(Assets.circleGraphics, size: Size(250, 250)),
                  fit: BoxFit.contain,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
