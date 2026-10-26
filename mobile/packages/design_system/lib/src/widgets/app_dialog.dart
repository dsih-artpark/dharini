import 'package:flutter/material.dart';

import '../theme/colors.dart';
import '../theme/corners.dart';
import '../theme/spacing.dart';

/// Shows a dialog above a dimmed background.
///
/// Pass [slideBegin] for a slide-in transition starting from that fractional
/// offset (e.g. `Offset(0, 1)` for a bottom sheet); omit it for the default
/// fade + scale dialog transition. The transition is driven by the route's own
/// animation, so the content stays in sync with the barrier fade and runs the
/// full [transitionDuration] without snapping.
Future<T?> showBaseDialog<T>({
  required BuildContext context,
  required WidgetBuilder builder,
  bool barrierDismissible = true,
  Color barrierColor = AppColors.overlayBarrier,
  String barrierLabel = '',
  bool useRootNavigator = true,
  RouteSettings? routeSettings,
  Offset? anchorPoint,
  Offset? slideBegin,
  Duration transitionDuration = const Duration(milliseconds: 240),
}) {
  final ThemeData theme = Theme.of(context);

  return showGeneralDialog<T>(
    context: context,
    pageBuilder: (
      BuildContext context,
      Animation<double> animation,
      Animation<double> secondaryAnimation,
    ) =>
        Theme(
      data: theme,
      child: builder(context),
    ),
    barrierColor: barrierColor,
    barrierDismissible: barrierDismissible,
    barrierLabel: barrierLabel,
    useRootNavigator: useRootNavigator,
    routeSettings: routeSettings,
    anchorPoint: anchorPoint,
    transitionDuration: transitionDuration,
    transitionBuilder: (
      BuildContext context,
      Animation<double> animation,
      Animation<double> secondaryAnimation,
      Widget child,
    ) {
      final CurvedAnimation curved = CurvedAnimation(
        parent: animation,
        curve: Curves.easeOutCubic,
        reverseCurve: Curves.easeInCubic,
      );

      // Sheets: slide in from the given edge. Driven by the route animation, so
      // it's synced with the barrier fade and never gets cut off mid-slide.
      if (slideBegin != null) {
        return SlideTransition(
          position: Tween<Offset>(begin: slideBegin, end: Offset.zero)
              .animate(curved),
          child: child,
        );
      }

      // Dialogs: fade + subtle scale.
      return FadeTransition(
        opacity: curved,
        child: ScaleTransition(
          scale: Tween<double>(begin: 0.95, end: 1).animate(curved),
          child: child,
        ),
      );
    },
  );
}

/// Types of dialogs that can be shown
enum DialogVariant {
  primary,
  alert,
}

class BaseDialog extends StatelessWidget {
  const BaseDialog({
    super.key,
    this.title,
    this.description,
    this.child,
    this.actions = const <Widget>[],
    this.closeIcon,
    this.closeIconPosition,
    this.radius,
    this.backgroundColor,
    this.padding,
    this.gap,
    this.constraints,
    this.border,
    this.shadows,
    this.headerTextStyle,
    this.descriptionTextStyle,
    this.headerTextAlign,
    this.descriptionTextAlign,
    this.alignment,
    this.mainAxisAlignment,
    this.crossAxisAlignment,
    this.scrollable = true,
    this.scrollPadding,
  }) : variant = DialogVariant.primary;

  const BaseDialog.alert({
    super.key,
    this.title,
    this.description,
    this.child,
    this.actions = const <Widget>[],
    this.closeIcon,
    this.closeIconPosition,
    this.radius,
    this.backgroundColor,
    this.padding,
    this.gap,
    this.constraints,
    this.border,
    this.shadows,
    this.headerTextStyle,
    this.descriptionTextStyle,
    this.headerTextAlign,
    this.descriptionTextAlign,
    this.alignment,
    this.mainAxisAlignment,
    this.crossAxisAlignment,
    this.scrollable = true,
    this.scrollPadding,
  }) : variant = DialogVariant.alert;

  final DialogVariant variant;
  final Widget? title;
  final Widget? description;
  final Widget? child;
  final List<Widget> actions;
  final Widget? closeIcon;
  final Offset? closeIconPosition;
  final BorderRadius? radius;
  final Color? backgroundColor;
  final EdgeInsets? padding;
  final double? gap;
  final BoxConstraints? constraints;
  final Border? border;
  final List<BoxShadow>? shadows;
  final TextStyle? headerTextStyle;
  final TextStyle? descriptionTextStyle;
  final TextAlign? headerTextAlign;
  final TextAlign? descriptionTextAlign;
  final Alignment? alignment;
  final MainAxisAlignment? mainAxisAlignment;
  final CrossAxisAlignment? crossAxisAlignment;
  final bool scrollable;
  final EdgeInsets? scrollPadding;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final MediaQueryData mediaQuery = MediaQuery.of(context);

    // Default styles and properties based on Material theme
    final Color effectiveBackgroundColor =
        backgroundColor ?? theme.colorScheme.surface;
    final Border effectiveBorder =
        border ?? Border.all(color: theme.colorScheme.outline);
    final BorderRadius effectiveRadius = radius ?? Corners.borderSm;
    final List<BoxShadow> effectiveShadows = shadows ??
        <BoxShadow>[
          BoxShadow(
            color: theme.colorScheme.shadow.withOpacity(0.2),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ];
    final EdgeInsets effectivePadding = padding ?? Spacing.p(6);
    final double effectiveGap = gap ?? Spacing.space(2);
    final BoxConstraints effectiveConstraints =
        constraints ?? const BoxConstraints(maxWidth: 512);

    final TextStyle? effectiveHeaderStyle =
        headerTextStyle ?? theme.textTheme.titleMedium;
    final TextStyle? effectiveDescriptionStyle =
        descriptionTextStyle ?? theme.textTheme.bodyMedium;

    final TextAlign effectiveHeaderAlign = headerTextAlign ?? TextAlign.start;
    final TextAlign effectiveDescriptionAlign =
        descriptionTextAlign ?? TextAlign.start;

    final Alignment effectiveAlignment = alignment ?? Alignment.center;
    final MainAxisAlignment effectiveMainAxisAlignment =
        mainAxisAlignment ?? MainAxisAlignment.start;
    final CrossAxisAlignment effectiveCrossAxisAlignment =
        crossAxisAlignment ?? CrossAxisAlignment.stretch;

    final EdgeInsets effectiveScrollPadding =
        scrollPadding ?? mediaQuery.viewPadding;

    Widget dialog = ConstrainedBox(
      constraints: effectiveConstraints,
      child: Container(
        decoration: BoxDecoration(
          color: effectiveBackgroundColor,
          borderRadius: effectiveRadius,
          border: effectiveBorder,
          boxShadow: effectiveShadows,
        ),
        child: Stack(
          children: <Widget>[
            Padding(
              padding: effectivePadding,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                mainAxisAlignment: effectiveMainAxisAlignment,
                crossAxisAlignment: effectiveCrossAxisAlignment,
                children: <Widget>[
                  if (title != null)
                    DefaultTextStyle(
                      style: effectiveHeaderStyle!,
                      textAlign: effectiveHeaderAlign,
                      child: title!,
                    ),
                  if (description != null)
                    DefaultTextStyle(
                      style: effectiveDescriptionStyle!,
                      textAlign: effectiveDescriptionAlign,
                      child: description!,
                    ),
                  if (child != null)
                    Flexible(
                      child: DefaultTextStyle(
                        style: effectiveDescriptionStyle!,
                        child: child!,
                      ),
                    ),
                  if (actions.isNotEmpty)
                    Padding(
                      padding: EdgeInsets.only(top: effectiveGap),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: actions,
                      ),
                    ),
                ].separatedBy(SizedBox(height: effectiveGap)),
              ),
            ),
            if (closeIcon != null)
              Positioned(
                top: closeIconPosition?.dy ?? Spacing.space(2),
                right: closeIconPosition?.dx ?? Spacing.space(2),
                child: closeIcon!,
              ),
          ],
        ),
      ),
    );

    if (scrollable) {
      dialog = SingleChildScrollView(
        padding: effectiveScrollPadding,
        child: dialog,
      );
    }

    return Align(
      alignment: effectiveAlignment,
      child: dialog,
    );
  }
}

extension ListSeparatorX on List<Widget> {
  List<Widget> separatedBy(Widget separator) {
    if (length <= 1) return this;

    final List<Widget> result = <Widget>[];
    for (int i = 0; i < length; i++) {
      result.add(this[i]);
      if (i < length - 1) {
        result.add(separator);
      }
    }
    return result;
  }
}
