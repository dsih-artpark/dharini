import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/spacing.dart';

class HeaderNavigation extends StatelessWidget {
  const HeaderNavigation({
    required this.title,
    super.key,
    this.prefix,
    this.suffix,
    this.backgroundColor,
    this.systemOverlayStyle,
  });

  /// The title shown in the center of the header
  final String title;

  /// Optional leading/prefix widget (usually a back button)
  final Widget? prefix;

  /// Optional trailing/suffix widget (usually an action button)
  final Widget? suffix;

  /// Optional background color override
  final Color? backgroundColor;

  /// Optional system overlay style override for status bar
  final SystemUiOverlayStyle? systemOverlayStyle;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;

    return Semantics(
      container: true,
      header: true,
      child: AnnotatedRegion<SystemUiOverlayStyle>(
        value: systemOverlayStyle ??
            SystemUiOverlayStyle.dark.copyWith(
              statusBarColor: Colors.transparent,
              statusBarIconBrightness: Brightness.dark,
            ),
        child: Material(
          color: backgroundColor ?? colorScheme.surface,
          shape: Border(
            bottom: BorderSide(
              color: colorScheme.outline,
            ),
          ),
          child: SafeArea(
            bottom: false,
            top: false,
            child: NavigationHeaderContent(
              title: title,
              prefix: prefix,
              suffix: suffix,
            ),
          ),
        ),
      ),
    );
  }
}

class NavigationHeaderContent extends StatelessWidget {
  const NavigationHeaderContent({
    required this.title,
    super.key,
    this.prefix,
    this.suffix,
  });

  final String title;
  final Widget? prefix;
  final Widget? suffix;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final TextTheme textTheme = theme.textTheme;

    return SizedBox(
      height: kToolbarHeight,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: <Widget>[
          // Prefix widget or placeholder
          if (prefix != null) prefix! else SizedBox(width: Spacing.space(12)),

          // Title
          Expanded(
            child: Text(
              title,
              style: textTheme.bodyLarge,
              textAlign: TextAlign.center,
              overflow: TextOverflow.ellipsis,
              maxLines: 1,
            ),
          ),

          // Suffix widget or placeholder
          if (suffix != null) suffix! else SizedBox(width: Spacing.space(12)),
        ],
      ),
    );
  }
}
