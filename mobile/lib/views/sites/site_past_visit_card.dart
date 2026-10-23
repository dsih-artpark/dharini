import 'package:design_system/design_system.dart';
import 'package:es_platform_mobile/utils/configs/constants.dart';
import 'package:flutter/material.dart';

class SitePastVisitCard extends StatelessWidget {
  const SitePastVisitCard({
    required this.farmName,
    required this.farmType,
    required this.siteCode,
    required this.location,
    required this.visitDate,
    required this.sampleCount,
    required this.sampleTypes,
    required this.visitedBy,
    super.key,
  });
  final String farmName;
  final String farmType;
  final String siteCode;
  final String location;
  final DateTime visitDate;
  final num sampleCount;
  final List<String> sampleTypes;
  final String visitedBy;

  @override
  Widget build(BuildContext context) => Card(
        color: AppColors.background,
        elevation: 0,
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
          side: BorderSide(color: AppColors.borderLight),
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        Text(
                          farmName,
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                            color: AppColors.actionButtonDark,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '$farmType | SITE CODE: $siteCode'.toUpperCase(),
                          style: TextStyle(
                            color: Colors.grey[600],
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),
                  // Container(
                  //   width: 64,
                  //   padding: const EdgeInsets.all(8),
                  //   alignment: Alignment.center,
                  //   decoration: BoxDecoration(
                  //     color: const Color(0xFFEAE8D9),
                  //     borderRadius: BorderRadius.circular(4),
                  //   ),
                  //   child: Column(
                  //     children: <Widget>[
                  //       Text(
                  //         _formattedTime.split(' ').first.toUpperCase(),
                  //         style: AppTypography.textTheme.bodyMedium?.copyWith(
                  //           fontWeight: FontWeight.w600,
                  //           fontSize: 14,
                  //           color: AppColors.textTheme,
                  //         ),
                  //       ),
                  //       Text(
                  //         _formattedTime.split(' ').last.toUpperCase(),
                  //         style: AppTypography.textTheme.bodyMedium?.copyWith(
                  //           fontWeight: FontWeight.w600,
                  //           fontSize: 14,
                  //           color: AppColors.textTheme,
                  //         ),
                  //       ),
                  //     ],
                  //   ),
                  // ),
                ],
              ),
              Container(
                height: 1,
                width: 360,
                margin: const EdgeInsets.symmetric(vertical: 16),
                color: Colors.grey[300],
              ),
              Row(
                children: <Widget>[
                  Container(
                    height: 20,
                    width: 20,
                    decoration: const BoxDecoration(
                      image: DecorationImage(
                        image: AssetImage(
                          Assets.location,
                        ),
                        fit: BoxFit.contain,
                      ),
                    ),
                  ),
                  const SizedBox(width: 4),
                  Text(
                    '$location',
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: <Widget>[
                  Container(
                    height: 20,
                    width: 20,
                    decoration: const BoxDecoration(
                      image: DecorationImage(
                        image: AssetImage(
                          Assets.testTubeLine,
                        ),
                        fit: BoxFit.contain,
                      ),
                    ),
                  ),
                  const SizedBox(width: 4),
                  Text(
                    '$sampleCount | ${sampleTypes.isNotEmpty ? sampleTypes.join(", ") : 'No Sample Types'}',
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 4),
            ],
          ),
        ),
      );
}
