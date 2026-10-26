import 'package:design_system/design_system.dart';
import 'package:flutter/material.dart';

import '../../utils/configs/constants.dart';

class ProfileContainer extends StatelessWidget {
  const ProfileContainer({
    required this.imageUrl,
    required this.name,
    required this.role,
    super.key,
  });
  final String imageUrl;
  final String name;
  final String role;

  @override
  Widget build(BuildContext context) => Container(
        width: MediaQuery.of(context).size.width,
        // Minimum (not fixed) height so the avatar, name and role are never
        // clipped when 30% of the screen is shorter than the content.
        constraints: BoxConstraints(
          minHeight: MediaQuery.of(context).size.height * 0.3,
        ),
        color: AppColors.white,
        child: Stack(
          alignment: AlignmentDirectional.center,
          children: <Widget>[
            // Background image positioned at the bottom
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: Image.asset(
                Assets.loginLeaves,
                fit: BoxFit.cover,
              ),
            ),
            // Centered content using Center widget
            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                Avatar(
                  size: AvatarSize.large,
                  imageUrl: imageUrl,
                ),
                Text(
                  name,
                  style: Theme.of(context)
                      .textTheme
                      .displayMedium
                      ?.copyWith(color: AppColors.labletestblack),
                  textAlign: TextAlign.center,
                ),
                Text(
                  role,
                  style: Theme.of(context)
                      .textTheme
                      .bodyMedium
                      ?.copyWith(color: AppColors.labletestgrey),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ],
        ),
      );
}
