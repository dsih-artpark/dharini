import 'package:flutter/material.dart';

import '../theme/colors.dart';

class MemberCountCard extends StatelessWidget {
  const MemberCountCard({
    required this.totalMembers,
    required this.image,
    super.key,
    this.width,
    this.height,
  });
  final int totalMembers;
  final double? width;
  final double? height;
  final String? image;

  @override
  Widget build(BuildContext context) => Container(
        width: width ?? 150,
        height: height ?? 120,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.backgroundLight,
          borderRadius: BorderRadius.circular(8),
          boxShadow: <BoxShadow>[
            BoxShadow(
              color: Colors.grey.withOpacity(0.1),
              spreadRadius: 1,
              blurRadius: 4,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: <Widget>[
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                Text(
                  totalMembers.toString(),
                  style: Theme.of(context)
                      .textTheme
                      .labelMedium
                      ?.copyWith(color: AppColors.onErrorDark),
                ),
                CircleAvatar(
                  radius: 35,
                  backgroundColor: const Color(0xffE0DCC5),
                  child: Center(
                    child: Image(
                      height: 80,
                      width: 80,
                      image: AssetImage(
                        image.toString(),
                      ),
                    ),
                  ),
                ),
              ],
            ),
            Text(
              'TOTAL MEMBERS',
              style: Theme.of(context)
                  .textTheme
                  .labelLarge
                  ?.copyWith(color: AppColors.onErrorDark),
            ),
          ],
        ),
      );
}
