import 'package:design_system/design_system.dart';
import 'package:flutter/material.dart';

class ActionCard extends StatelessWidget {
  const ActionCard({
    Key? key,
    required this.farmName,
    required this.location,
    this.isNew = true,
  }) : super(key: key);

  final String farmName;
  final String location;
  final bool isNew;

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 3,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12.0),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  farmName,
                  style: const TextStyle(
                    fontSize: 18.0,
                    fontWeight: FontWeight.w500,
                    color: AppColors.actionButtonDark,
                  ),
                ),
                if (isNew)
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10.0,
                      vertical: 4.0,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.teal[100],
                      borderRadius: BorderRadius.circular(8.0),
                    ),
                    child: const Text(
                      'NEW SITE',
                      style: TextStyle(
                        fontSize: 12.0,
                        fontWeight: FontWeight.w500,
                        color: Colors.teal,
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 8.0),
            Row(
              children: [
                const Icon(
                  Icons.location_on_outlined,
                  color: Colors.blue,
                  size: 16.0,
                ),
                const SizedBox(width: 4.0),
                Text(
                  location,
                  style: TextStyle(
                    fontSize: 12.0,
                    color: Colors.grey[600],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
