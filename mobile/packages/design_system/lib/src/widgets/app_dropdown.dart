import 'package:flutter/material.dart';
import '../theme/colors.dart';
import '../theme/typography.dart';
import 'app_radio.dart';

class AppDropdown extends StatelessWidget {
  const AppDropdown({
    required this.value,
    required this.items,
    required this.onChanged,
    super.key,
    this.width = 100,
    this.size = DropdownSize.md,
  });
  final String value;
  final List<String> items;
  final ValueChanged<String?> onChanged;
  final double width;
  final DropdownSize size;

  double get _height {
    switch (size) {
      case DropdownSize.sm:
        return 32;
      case DropdownSize.md:
        return 40;
      case DropdownSize.lg:
        return 48;
    }
  }

  double get _menuItemHeight {
    switch (size) {
      case DropdownSize.sm:
        return 48;
      case DropdownSize.md:
        return 48;
      case DropdownSize.lg:
        return 48;
    }
  }

  EdgeInsets get _padding {
    switch (size) {
      case DropdownSize.sm:
        return const EdgeInsets.symmetric(horizontal: 8);
      case DropdownSize.md:
        return const EdgeInsets.symmetric(horizontal: 12);
      case DropdownSize.lg:
        return const EdgeInsets.symmetric(horizontal: 16);
    }
  }

  TextStyle? _getTextStyle(BuildContext context) {
    final TextStyle? baseStyle = switch (size) {
      DropdownSize.sm => AppTypography.textTheme.bodySmall,
      DropdownSize.md => AppTypography.textTheme.bodyMedium,
      DropdownSize.lg => AppTypography.textTheme.bodyLarge,
    };
    return baseStyle?.copyWith(color: AppColors.onSurfaceLight);
  }

  @override
  Widget build(BuildContext context) => Container(
        width: width,
        height: _height,
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.borderLight),
        ),
        child: DropdownButtonHideUnderline(
          child: ButtonTheme(
            alignedDropdown: true,
            child: DropdownButton<String>(
              value: value,
              isExpanded: true,
              icon: Icon(
                Icons.keyboard_arrow_down,
                size: size == DropdownSize.sm ? 16 : 20,
              ),
              iconSize: size == DropdownSize.sm ? 16 : 20,
              elevation: 2,
              style: _getTextStyle(context),
              dropdownColor: AppColors.white,
              menuMaxHeight: 300,
              padding: _padding,
              itemHeight: _menuItemHeight,
              items: items
                  .map(
                    (String item) => DropdownMenuItem<String>(
                      value: item,
                      child: Container(
                        padding: EdgeInsets.zero,
                        child: Row(
                          children: <Widget>[
                            AppRadio<String>(
                              value: item,
                              label: Text(
                                item,
                                style: _getTextStyle(context),
                              ),
                              color: AppColors.primaryLight,
                              size: size == DropdownSize.sm ? 16 : 20,
                            ),
                          ],
                        ),
                      ),
                    ),
                  )
                  .toList(),
              onChanged: onChanged,
              selectedItemBuilder: (BuildContext context) => items
                  .map<Widget>(
                    (String item) => Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        item,
                        style: _getTextStyle(context),
                      ),
                    ),
                  )
                  .toList(),
            ),
          ),
        ),
      );
}

enum DropdownSize {
  sm,
  md,
  lg,
}
