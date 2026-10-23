import 'package:flutter/material.dart';
import 'colors.dart';
import 'typography.dart';

class AppTheme {
  const AppTheme._();

  static ThemeData get lightTheme => ThemeData(
        useMaterial3: true,
        colorScheme: const ColorScheme.light(
          primary: AppColors.primaryLight,
          secondary: AppColors.secondaryLight,
          surface: AppColors.surfaceLight,
          onSecondary: AppColors.onSecondaryLight,
          onSurface: AppColors.onSurfaceLight,
          outline: AppColors.borderLight,
          tertiary: AppColors.actionButtonDark,
        ),
        scaffoldBackgroundColor: AppColors.backgroundLight,
        textTheme: AppTypography.textTheme,
      );

  static ThemeData get darkTheme => ThemeData(
        useMaterial3: true,
        colorScheme: const ColorScheme.dark(
          primary: AppColors.primaryDark,
          onPrimary: AppColors.onPrimaryDark,
          secondary: AppColors.secondaryDark,
          onSecondary: AppColors.onSecondaryDark,
          surface: AppColors.surfaceDark,
        ),
        textTheme: AppTypography.textTheme,
        scaffoldBackgroundColor: AppColors.backgroundDark,
      );
}
