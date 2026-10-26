import 'package:flutter/material.dart';

import '../../design_system.dart';

class AddedSampleCard extends StatelessWidget {
  const AddedSampleCard({
    required this.sampleType,
    required this.sampleDeails,
    super.key,
  });

  final String sampleType;
  final String sampleDeails;

  @override
  Widget build(BuildContext context) => Container(
        height: 40,
        decoration: BoxDecoration(
          border: Border.all(color: AppColors.labletestgrey, width: 0.5),
          borderRadius: BorderRadius.circular(4),
        ),
        child: Padding(
          padding: Spacing.px(4),
          child: Align(
            alignment: Alignment.centerLeft,
            child: Text(
              sampleType,
              style: AppTypography.textTheme.bodyB2SemiBold.copyWith(
                color: AppColors.textBlack,
              ),
            ),
          ),
        ),
      );
}

// class AddedSampleCard extends StatelessWidget {
//   const AddedSampleCard({
//     required this.sampleType,
//     required this.sampleDeails,
//     super.key,
//   });
//   final String sampleType;
//   final String sampleDeails;

//   @override
//   Widget build(BuildContext context) => Container(
//         height: 90,
//         decoration: BoxDecoration(
//           border: Border.all(color: AppColors.labletestgrey, width: 0.5),
//           borderRadius: BorderRadius.circular(4),
//           // shape: BoxShape.circle
//         ),
//         child: Center(
//           child: Column(
//             crossAxisAlignment: CrossAxisAlignment.start,
//             mainAxisAlignment: MainAxisAlignment.spaceAround,
//             children: <Widget>[
//               SizedBox(height: Spacing.space(2)),
//               Padding(
//                 padding: Spacing.px(4),
//                 child: Text(
//                   sampleType,
//                   style: AppTypography.textTheme.bodyB2SemiBold.copyWith(
//                     color: AppColors.textBlack,
//                   ),
//                 ),
//               ),
//               SizedBox(height: Spacing.space(2)),
//               Padding(
//                 padding: Spacing.px(4),
//                 child: const Divider(
//                   thickness: 0.5,
//                   color: AppColors.labletestgrey,
//                   height: 1,
//                 ),
//               ),
//               SizedBox(height: Spacing.space(2)),
//               Padding(
//                 padding: Spacing.pl(4),
//                 child: Text(
//                   sampleDeails,
//                   style: AppTypography.textTheme.bodyB4Regular.copyWith(
//                     color: AppColors.textWeak,
//                   ),
//                 ),
//               ),
//               SizedBox(height: Spacing.space(2)),
//             ],
//           ),
//         ),
//       );
// }
