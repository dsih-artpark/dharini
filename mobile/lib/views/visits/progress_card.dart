import 'package:design_system/design_system.dart';
import 'package:es_platform_mobile/utils/configs/constants.dart';
import 'package:flutter/material.dart';

enum StatisticsType {
  visits,
  samples,
}

class VisitsProgressCard extends StatelessWidget {
  const VisitsProgressCard({
    required this.type,
    required this.count,
    super.key,
  });

  final StatisticsType type;
  final int count;

  @override
  Widget build(BuildContext context) {
    final bool isVisits = type == StatisticsType.visits;

    return Card(
      color: isVisits ? const Color(0xFFEAE8D9) : AppColors.white,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
        side: BorderSide(color: const Color(0xFFEAE8D9), width: 1.5),
      ),
      child: Stack(
        children: [
          // Dotted Pattern Background based on the card type
          Positioned(
            right: 0,
            top: 0,
            bottom: 0,
            child: Image.asset(
              isVisits ? Assets.pattern1 : Assets.pattern2,
              fit: BoxFit.cover,
            ),
          ),
          // Content of the card
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Container(
                  height: 20,
                  width: 20,
                  decoration: BoxDecoration(
                    image: DecorationImage(
                      colorFilter: const ColorFilter.mode(
                        Colors.black,
                        BlendMode.srcIn,
                      ),
                      image: AssetImage(
                        isVisits ? Assets.location : Assets.testTubeLine,
                      ),
                      fit: BoxFit.contain,
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Padding(
                  padding: const EdgeInsets.only(left: 4),
                  child: Text(
                    count.toString(),
                    style: AppTypography.textTheme.bothBig.copyWith(
                      color: AppColors.textStrong,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(left: 4),
                  child: Text(
                    isVisits ? 'VISITS \nCOMPLETED' : 'SAMPLES \nCOLLECTED',
                    style: AppTypography.textTheme.labelMRegular.copyWith(
                      color: AppColors.textWeak,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
