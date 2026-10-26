import 'package:flutter/material.dart';
import '../theme/colors.dart';
import '../theme/typography.dart';

class NavigationItem {
  const NavigationItem({
    required this.label,
    required this.icon,
    this.selectedIcon,
    this.onTap,
  });
  final String label;
  final Icon icon;
  final Icon? selectedIcon;
  final void Function()? onTap;
}

class AppBottomNavBar extends StatelessWidget {
  const AppBottomNavBar({
    required this.activeIndex,
    required this.navigationItems,
    super.key,
  });

  final int activeIndex;
  final List<NavigationItem> navigationItems;

  @override
  Widget build(BuildContext context) => Container(
        decoration: const BoxDecoration(
          border: Border(
            top: BorderSide(
              color: AppColors.borderLight,
            ),
          ),
        ),
        child: NavigationBarTheme(
          data: NavigationBarThemeData(
            labelTextStyle: WidgetStateProperty.all(
              AppTypography.textTheme.bodyB4SemiBold,
            ),
            backgroundColor: AppColors.white,
            height: 64,
            indicatorColor: Colors.transparent,
          ),
          child: LayoutBuilder(
            builder: (BuildContext context, BoxConstraints constraints) =>
                NavigationBar(
              selectedIndex: activeIndex,
              onDestinationSelected: (int index) {
                final NavigationItem item = navigationItems[index];
                item.onTap?.call();
              },
              destinations: navigationItems
                  .map(
                    (NavigationItem item) => NavigationDestination(
                      icon: item.icon,
                      selectedIcon: item.selectedIcon ??
                          Icon(
                            item.icon.icon,
                            color: AppColors.primaryLight,
                          ),
                      label: item.label,
                    ),
                  )
                  .toList(),
            ),
          ),
        ),
      );
}
