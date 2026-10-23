import 'package:design_system/design_system.dart';
import 'package:flutter/material.dart';

class BarcodeVerificationScreen extends StatelessWidget {
  final String barcode;
  final Function(String)? onBarcodeVerified;

  const BarcodeVerificationScreen({
    required this.barcode,
    this.onBarcodeVerified,
    super.key,
  });

  @override
  Widget build(BuildContext context) => Scaffold(
        backgroundColor: Colors.white,
        appBar: PreferredSize(
          preferredSize: const Size.fromHeight(56),
          child: Container(
            padding: EdgeInsets.only(top: MediaQuery.of(context).padding.top),
            color: AppColors.white,
            child: Theme(
              data: Theme.of(context).copyWith(
                textTheme: Theme.of(context).textTheme.copyWith(
                      bodyLarge:
                          AppTypography.textTheme.bodyB2SemiBold.copyWith(
                        color: AppColors.textStrong,
                      ),
                    ),
              ),
              child: const HeaderNavigation(
                title: 'Verify Barcode',
                prefix: BackButton(),
              ),
            ),
          ),
        ),
        body: SingleChildScrollView(
          child: Padding(
            padding: Spacing.p(4),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                // Barcode Image Container
                Container(
                  width: double.infinity,
                  height: 120,
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.purple, width: 2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                SizedBox(
                  height: Spacing.space(4),
                ),

                // Verify Barcode Details Section
                Text(
                  'Verify Barcode Details',
                  style: AppTypography.textTheme.bodyB2Medium.copyWith(
                    color: AppColors.textLabelInput,
                  ),
                ),
                SizedBox(
                  height: Spacing.space(4),
                ),

                // Barcode Details
                Row(
                  children: <Widget>[
                    Expanded(
                      child: Text(
                        barcode,
                        style: AppTypography.textTheme.bodyB3Regular.copyWith(
                          color: AppColors.textLabelInput,
                        ),
                      ),
                    ),
                    TextButton.icon(
                      onPressed: () {
                        Navigator.pop(context);
                      },
                      icon: const Icon(Icons.refresh, color: Colors.blue),
                      label: Text(
                        'Rescan',
                        style: AppTypography.textTheme.buttonSmall.copyWith(
                          color: AppColors.buttonTextActive,
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(
                  height: Spacing.space(4),
                ),

                // Details List
                _buildDetailRow(
                  'Sampling Org',
                  'G',
                  'Gandhinagar\nBiotechnology Research\nCenter',
                ),
                _buildDetailRow('Surveillance Type', 'E', 'Environmental'),
                _buildDetailRow('Site Details', '11', 'Anjaneya Farms'),
                _buildDetailRow('Diseases', 'L', 'LSD'),
                _buildDetailRow('Sample Number', '9', ''),
                _buildDetailRow('Date', '2407', 'Jul 2024'),

                SizedBox(
                  height: Spacing.space(6),
                ),

                // Proceed Button
                SizedBox(
                  width: double.infinity,
                  child: AppButton(
                    child: const Text('Proceed'),
                    onPressed: () {
                      if (onBarcodeVerified != null) {
                        onBarcodeVerified!(barcode);
                      } else {
                        Navigator.pop(context, barcode);
                      }
                    },
                  ),
                ),
              ],
            ),
          ),
        ),
      );

  Widget _buildDetailRow(String label, String code, String description) =>
      Padding(
        padding: const EdgeInsets.symmetric(vertical: 8),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            SizedBox(
              width: 120,
              child: Text(
                label,
                style: AppTypography.textTheme.bodyB4Medium.copyWith(
                  color: AppColors.textWeak,
                ),
              ),
            ),
            Text(
              code,
              style: AppTypography.textTheme.bodyB3Medium.copyWith(
                color: AppColors.textStrong,
              ),
            ),
            if (description.isNotEmpty) ...<Widget>[
              const Text(' | '),
              Expanded(
                child: Text(
                  description,
                  style: AppTypography.textTheme.bodyB3Medium.copyWith(
                    color: AppColors.textStrong,
                  ),
                ),
              ),
            ],
          ],
        ),
      );
}
