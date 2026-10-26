import 'package:flutter/material.dart';

import '../theme/colors.dart';
import '../theme/spacing.dart';
import '../theme/typography.dart';

enum TabVariant {
  underlined, // default
  rounded,
}

class AppTabs extends StatefulWidget {
  const AppTabs({
    required this.tabs,
    super.key,
    this.variant = TabVariant.underlined,
    this.initialIndex = 0,
    this.onChanged,
    this.padding,
    this.tabPadding,
    this.decoration,
    this.selectedDecoration,
    this.labelStyle,
    this.selectedLabelStyle,
    this.backgroundColor,
    this.indicatorColor,
    this.unselectedLabelColor,
    this.selectedLabelColor,
    this.isScrollable = false,
  });

  final List<String> tabs;
  final TabVariant variant;
  final int initialIndex;
  final ValueChanged<int>? onChanged;
  final EdgeInsets? padding;
  final EdgeInsets? tabPadding;
  final BoxDecoration? decoration;
  final BoxDecoration? selectedDecoration;
  final TextStyle? labelStyle;
  final TextStyle? selectedLabelStyle;
  final Color? backgroundColor;
  final Color? indicatorColor;
  final Color? unselectedLabelColor;
  final Color? selectedLabelColor;
  final bool isScrollable;

  @override
  State<AppTabs> createState() => _AppTabsState();
}

class _AppTabsState extends State<AppTabs> with SingleTickerProviderStateMixin {
  late TabController _controller;

  @override
  void initState() {
    super.initState();
    _controller = TabController(
      length: widget.tabs.length,
      vsync: this,
      initialIndex: widget.initialIndex,
    );
    _controller.addListener(_handleTabSelection);
  }

  @override
  void dispose() {
    _controller
      ..removeListener(_handleTabSelection)
      ..dispose();
    super.dispose();
  }

  void _handleTabSelection() {
    if (_controller.indexIsChanging) {
      widget.onChanged?.call(_controller.index);
    }
  }

  @override
  Widget build(BuildContext context) {
    // Updated default styles using AppColors
    const Color defaultUnselectedColor = AppColors.labletestgrey;
    const Color defaultSelectedColor = AppColors.primaryLight;

    final EdgeInsets effectiveTabPadding = widget.tabPadding ??
        (widget.variant == TabVariant.rounded
            ? Spacing.pxy(4, 2)
            : Spacing.pxy(4, 3));

    // Using AppTypography for text styles
    final TextStyle effectiveLabelStyle =
        widget.labelStyle ?? AppTypography.textTheme.bodySmall!;

    final TextStyle effectiveSelectedLabelStyle = widget.selectedLabelStyle ??
        AppTypography.bodySemiBold(AppTypography.textTheme.bodySmall!);

    Widget buildTab({
      required String label,
      required bool isSelected,
    }) {
      final Color textColor = isSelected
          ? (widget.selectedLabelColor ?? defaultSelectedColor)
          : (widget.unselectedLabelColor ?? defaultUnselectedColor);

      Widget tabContent = Text(
        label,
        style: (isSelected ? effectiveSelectedLabelStyle : effectiveLabelStyle)
            .copyWith(color: textColor),
      );

      if (widget.variant == TabVariant.rounded) {
        tabContent = Container(
          padding: effectiveTabPadding,
          decoration: isSelected
              ? widget.selectedDecoration ??
                  BoxDecoration(
                    color: AppColors.primaryLight.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: AppColors.primaryLight,
                    ),
                  )
              : widget.decoration ??
                  BoxDecoration(
                    borderRadius: BorderRadius.circular(20),
                  ),
          child: tabContent,
        );
      } else {
        tabContent = Padding(
          padding: effectiveTabPadding,
          child: tabContent,
        );
      }

      return tabContent;
    }

    return Container(
      padding: widget.padding,
      color: widget.backgroundColor,
      child: TabBar(
        controller: _controller,
        isScrollable: widget.isScrollable,
        tabs: widget.tabs.map((String label) {
          final bool isSelected =
              _controller.index == widget.tabs.indexOf(label);
          return Tab(
            child: buildTab(
              label: label,
              isSelected: isSelected,
            ),
          );
        }).toList(),
        indicator: widget.variant == TabVariant.underlined
            ? UnderlineTabIndicator(
                borderSide: BorderSide(
                  width: 2,
                  color: widget.indicatorColor ?? AppColors.primaryLight,
                ),
              )
            : const BoxDecoration(),
        indicatorSize: TabBarIndicatorSize.tab,
        labelPadding: EdgeInsets.zero,
      ),
    );
  }
}
