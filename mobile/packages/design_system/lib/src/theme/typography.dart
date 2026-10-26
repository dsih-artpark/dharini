import 'package:flutter/material.dart';

import 'colors.dart';

class AppTypography {
  const AppTypography._();

  static const String headingFont = 'NotoSerif';
  static const String bodyFont = 'Geist';

  static TextStyle baseStyle = const TextStyle(
    fontFamily: bodyFont,
    fontSize: 16,
    height: 1.5,
    fontWeight: FontWeight.w400,
  );

  static TextTheme get textTheme => const TextTheme(
        // Headings with NotoSerif
        displayLarge: TextStyle(
          fontFamily: headingFont,
          fontSize: 24,
          height: 1.25,
          fontWeight: FontWeight.w600,
          color: AppColors.textTheme,
        ),
        titleLarge: TextStyle(
          fontFamily: headingFont,
          fontSize: 32,
          height: 1.25,
          fontWeight: FontWeight.w600,
          color: AppColors.textTheme,
        ),
        displayMedium: TextStyle(
          fontFamily: headingFont,
          fontSize: 20,
          height: 1.25,
          fontWeight: FontWeight.w600,
        ),
        displaySmall: TextStyle(
          fontFamily: headingFont,
          fontSize: 18,
          height: 1.25,
          fontWeight: FontWeight.w600,
        ),

        // Heading Styles
        headlineMedium: TextStyle(
          fontFamily: headingFont,
          fontSize: 20,
          height: 1.3,
          letterSpacing: 0,
          fontWeight: FontWeight.w600,
        ),
        // Adding missing required properties with heading font
        headlineLarge: TextStyle(
          fontFamily: headingFont,
          fontSize: 32,
          height: 1.2,
          letterSpacing: 2,
          fontWeight: FontWeight.w600,
        ),
        headlineSmall: TextStyle(
          fontFamily: headingFont,
          fontSize: 18,
          height: 1.3,
          letterSpacing: 0,
          fontWeight: FontWeight.w600,
        ),

        titleMedium: TextStyle(
          fontFamily: headingFont,
          fontSize: 28,
          height: 1.25,
          fontWeight: FontWeight.w600,
        ),
        titleSmall: TextStyle(
          fontFamily: headingFont,
          fontSize: 24,
          height: 1.25,
          fontWeight: FontWeight.w600,
        ),

        // Body styles with Geist
        bodyLarge: TextStyle(
          fontFamily: bodyFont,
          fontSize: 16,
          height: 1.5,
          letterSpacing: 0,
          fontWeight: FontWeight.w400,
        ),
        bodyMedium: TextStyle(
          fontFamily: bodyFont,
          fontSize: 16,
          height: 1.5,
          letterSpacing: 0,
          fontWeight: FontWeight.w400,
        ),
        bodySmall: TextStyle(
          fontFamily: bodyFont,
          fontSize: 14,
          height: 1.5,
          letterSpacing: 0,
          fontWeight: FontWeight.w400,
        ),

        labelLarge: TextStyle(
          fontFamily: bodyFont,
          fontSize: 12,
          height: 1.5,
          fontWeight: FontWeight.w400,
        ),
        labelSmall: TextStyle(
          fontFamily: bodyFont,
          fontSize: 10,
          height: 1.5,
          fontWeight: FontWeight.w400,
        ),
        labelMedium: TextStyle(
          fontFamily: bodyFont,
          fontSize: 20,
          height: 1.25,
          letterSpacing: 2,
          fontWeight: FontWeight.w600,
        ),
      );

  // Helper methods remain unchanged
  static TextStyle bodyRegular(TextStyle style) =>
      style.copyWith(fontWeight: FontWeight.w400);

  static TextStyle bodyMediumWeight(TextStyle style) =>
      style.copyWith(fontWeight: FontWeight.w500);

  static TextStyle bodySemiBold(TextStyle style) =>
      style.copyWith(fontWeight: FontWeight.w600);
}

extension TextThemeExtension on TextTheme {
  TextStyle get headingH1 => headlineLarge!;

  TextStyle get headingH2 => headlineMedium!;

  TextStyle get headingH3 => headlineSmall!;

  TextStyle get bodyB2Medium =>
      bodyMedium!.copyWith(fontWeight: FontWeight.w500);

  TextStyle get bodyB2Regular => bodyMedium!;

  TextStyle get bodyB1Medium =>
      bodyLarge!.copyWith(fontWeight: FontWeight.w500);

  TextStyle get bodyB3Medium =>
      bodySmall!.copyWith(fontWeight: FontWeight.w500);

  TextStyle get bodyB3Regular => bodySmall!;

  static const TextStyle _bodyB4Medium = TextStyle(
    fontFamily: AppTypography.bodyFont,
    fontWeight: FontWeight.w500,
    fontSize: 12,
    height: 1.5,
    letterSpacing: 0,
  );

  TextStyle get bodyB4Medium => _bodyB4Medium;

  static const TextStyle _bodyB4Regular = TextStyle(
    fontFamily: AppTypography.bodyFont,
    fontWeight: FontWeight.w400,
    fontSize: 12,
    height: 1.5,
    letterSpacing: 0,
  );

  TextStyle get bodyB4Regular => _bodyB4Regular;

  static const TextStyle _bodyB4SemiBold = TextStyle(
    fontFamily: AppTypography.bodyFont,
    fontWeight: FontWeight.w600,
    fontSize: 12,
    height: 1.5,
    letterSpacing: 0,
  );

  TextStyle get bodyB4SemiBold => _bodyB4SemiBold;

  static const TextStyle _buttonLarge = TextStyle(
    fontFamily: AppTypography.bodyFont,
    // Remains Geist as per your data
    fontWeight: FontWeight.w500,
    fontSize: 16,
    height: 1.5,
    letterSpacing: 0, // Remains 0% (unchanged)
  );

  TextStyle get buttonLarge => _buttonLarge;

  static const TextStyle _labelMMedium = TextStyle(
    fontFamily: AppTypography.bodyFont,
    fontWeight: FontWeight.w500,
    fontSize: 12,
    height: 1.5,
    letterSpacing: 0, // Remains 0% (unchanged)
  );

  TextStyle get labelMMedium => _labelMMedium;

  static const TextStyle _labelCapsMedium = TextStyle(
    fontFamily: AppTypography.bodyFont,
    // Remains Geist as per your data
    fontWeight: FontWeight.w500,
    // Updated from w400 to w500 (Medium)
    fontSize: 10,
    // Updated from 14 to 16px
    height: 1.5,
    // Remains 150% (line-height: 150%)
    letterSpacing: 2, // Remains 0% (unchanged)
  );

  TextStyle get labelCapsMedium => _labelCapsMedium;

  static const TextStyle _labelMRegular = TextStyle(
    fontFamily: AppTypography.bodyFont,
    // Remains Geist as per your data
    fontWeight: FontWeight.w400,
    // Updated from w400 to w500 (Medium)
    fontSize: 12,
    // Updated from 14 to 16px
    height: 1.5,
    // Remains 150% (line-height: 150%)
    letterSpacing: 2, // Remains 0% (unchanged)
  );

  TextStyle get labelMRegular => _labelMRegular;

  static const TextStyle _bodyB2SemiBold = TextStyle(
    fontFamily: AppTypography.bodyFont,
    // Remains Geist as per your data
    fontWeight: FontWeight.w600,
    // Updated from w400 to w500 (Medium)
    fontSize: 16,
    // Updated from 14 to 16px
    height: 1.5,
    // Remains 150% (line-height: 150%)
    letterSpacing: 0, // Remains 0% (unchanged)
  );

  TextStyle get bodyB3SemiBold => _bodyB2SemiBold;

  // ignore: unused_field
  static const TextStyle _bodyB3SemiBold = TextStyle(
    fontFamily: AppTypography.bodyFont,
    // Remains Geist as per your data
    fontWeight: FontWeight.w600,
    // Updated from w400 to w500 (Medium)
    fontSize: 14,
    // Updated from 14 to 16px
    height: 1.5,
    // Remains 150% (line-height: 150%)
    letterSpacing: 0, // Remains 0% (unchanged)
  );

  TextStyle get bodyB2SemiBold => _bodyB2SemiBold;

  static const TextStyle _bodyB1SemiBold = TextStyle(
    fontFamily: AppTypography.bodyFont,
    // Remains Geist as per your data
    fontWeight: FontWeight.w600,
    // Updated from w400 to w500 (Medium)
    fontSize: 16,
    // Updated from 14 to 16px
    height: 1.5,
    // Remains 150% (line-height: 150%)
    letterSpacing: 0, // Remains 0% (unchanged)
  );

  TextStyle get bodyB1SemiBold => _bodyB1SemiBold;

  static const TextStyle _bothBig = TextStyle(
    fontFamily: AppTypography.bodyFont,
    // Remains Geist as per your data
    fontWeight: FontWeight.w600,
    // Updated from w400 to w500 (Medium)
    fontSize: 20,
    // Updated from 14 to 16px
    height: 1.25,
    // Remains 150% (line-height: 150%)
    letterSpacing: 0, // Remains 0% (unchanged)
  );

  TextStyle get bothBig => _bothBig;

  static const TextStyle _buttonSmall = TextStyle(
    fontFamily: AppTypography.bodyFont,
    // Remains Geist as per your data
    fontWeight: FontWeight.w500,
    // Updated from w400 to w500 (Medium)
    fontSize: 14,
    // Updated from 14 to 16px
    height: 1.5,
    // Remains 150% (line-height: 150%)
    letterSpacing: 0, // Remains 0% (unchanged)
  );

  TextStyle get buttonSmall => _buttonSmall;
}
