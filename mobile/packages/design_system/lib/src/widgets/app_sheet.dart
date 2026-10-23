import 'package:flutter/material.dart';

import '../theme/colors.dart';
import '../theme/corners.dart';
import '../theme/spacing.dart';

import 'app_dialog.dart';

/// Side from which the sheet appears
enum SheetSide {
  top,
  right,
  bottom,
  left;

  Alignment get alignment => switch (this) {
        SheetSide.top => Alignment.topCenter,
        SheetSide.bottom => Alignment.bottomCenter,
        SheetSide.left => Alignment.centerLeft,
        SheetSide.right => Alignment.centerRight,
      };
}

/// Shows a sheet that slides in from the specified side
Future<T?> showSheet<T>({
  required BuildContext context,
  required WidgetBuilder builder,
  SheetSide? side,
  Color barrierColor = AppColors.overlayBarrier,
  String barrierLabel = '',
  bool useRootNavigator = false,
  bool isDismissible = true,
  RouteSettings? routeSettings,
  Offset? anchorPoint,
}) {
  final SheetSide effectiveSide = side ?? SheetSide.bottom;

  // Fractional offset the sheet slides in from, based on its entering side.
  final Offset slideBegin = switch (effectiveSide) {
    SheetSide.top => const Offset(0, -1),
    SheetSide.bottom => const Offset(0, 1),
    SheetSide.left => const Offset(-1, 0),
    SheetSide.right => const Offset(1, 0),
  };

  return showBaseDialog(
    context: context,
    builder: (BuildContext context) => _SheetScope(
      side: effectiveSide,
      child: builder(context),
    ),
    barrierColor: barrierColor,
    barrierLabel: barrierLabel,
    barrierDismissible: isDismissible,
    useRootNavigator: useRootNavigator,
    routeSettings: routeSettings,
    anchorPoint: anchorPoint,
    slideBegin: slideBegin,
  );
}

class _SheetScope extends InheritedWidget {
  const _SheetScope({
    required super.child,
    required this.side,
  });

  final SheetSide side;

  static SheetSide sideOf(BuildContext context) {
    final _SheetScope? scope =
        context.dependOnInheritedWidgetOfExactType<_SheetScope>();
    return scope?.side ?? SheetSide.bottom;
  }

  @override
  bool updateShouldNotify(_SheetScope oldWidget) => side != oldWidget.side;
}

class Sheet extends StatefulWidget {
  const Sheet({
    super.key,
    this.title,
    this.description,
    this.child,
    this.actions = const <Widget>[],
    this.constraints,
    this.expandCrossSide = true,
    this.closeIcon,
    this.closeIconPosition,
    this.radius,
    this.backgroundColor,
    this.padding,
    this.gap,
    this.border,
    this.shadows,
    this.header,
    this.footer,
    this.headerTextStyle,
    this.descriptionTextStyle,
    this.headerTextAlign,
    this.descriptionTextAlign,
    this.mainAxisAlignment,
    this.crossAxisAlignment,
    this.draggable = false,
    this.onDragStart,
    this.onDragEnd,
  });

  final Widget? title;
  final Widget? description;
  final Widget? child;
  final List<Widget> actions;
  final BoxConstraints? constraints;
  final bool expandCrossSide;
  final Widget? closeIcon;
  final Offset? closeIconPosition;
  final BorderRadius? radius;
  final Color? backgroundColor;
  final EdgeInsets? padding;
  final double? gap;
  final Border? border;
  final List<BoxShadow>? shadows;
  final Widget? header;
  final Widget? footer;
  final TextStyle? headerTextStyle;
  final TextStyle? descriptionTextStyle;
  final TextAlign? headerTextAlign;
  final TextAlign? descriptionTextAlign;
  final MainAxisAlignment? mainAxisAlignment;
  final CrossAxisAlignment? crossAxisAlignment;
  final bool draggable;
  final GestureDragStartCallback? onDragStart;
  final GestureDragEndCallback? onDragEnd;

  @override
  State<Sheet> createState() => _SheetState();
}

class _SheetState extends State<Sheet> {
  late final ScrollController scrollController;
  bool isDragging = false;
  double dragStart = 0;

  @override
  void initState() {
    super.initState();
    scrollController = ScrollController();
  }

  @override
  void dispose() {
    scrollController.dispose();
    super.dispose();
  }

  void _onVerticalDragStart(DragStartDetails details) {
    isDragging = true;
    dragStart = details.globalPosition.dy;
    widget.onDragStart?.call(details);
  }

  void _onVerticalDragEnd(DragEndDetails details) {
    isDragging = false;
    widget.onDragEnd?.call(details);
  }

  void _onVerticalDragUpdate(DragUpdateDetails details) {
    if (!isDragging) return;

    final double dragDistance = details.globalPosition.dy - dragStart;
    final SheetSide side = _SheetScope.sideOf(context);

    // Close sheet if dragged far enough
    if ((side == SheetSide.bottom && dragDistance > 100) ||
        (side == SheetSide.top && dragDistance < -100)) {
      Navigator.of(context).pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final SheetSide side = _SheetScope.sideOf(context);
    final MediaQueryData mediaQuery = MediaQuery.of(context);

    // Default styles and properties based on Material theme
    final Color effectiveBackgroundColor =
        widget.backgroundColor ?? theme.colorScheme.surface;
    final Border effectiveBorder =
        widget.border ?? Border.all(color: theme.colorScheme.outline);

    // Different corner radii based on side
    final BorderRadius effectiveRadius = widget.radius ??
        switch (side) {
          SheetSide.top => Corners.borderSm,
          SheetSide.bottom => Corners.borderSm,
          SheetSide.left => Corners.borderSm,
          SheetSide.right => Corners.borderSm,
        };

    final List<BoxShadow> effectiveShadows = widget.shadows ??
        <BoxShadow>[
          BoxShadow(
            color: theme.colorScheme.shadow.withOpacity(0.2),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ];

    final EdgeInsets effectivePadding = widget.padding ?? Spacing.p(6);
    final double effectiveGap = widget.gap ?? Spacing.space(2);

    // Constraints with full width/height on respective side
    BoxConstraints effectiveConstraints =
        widget.constraints ?? const BoxConstraints(maxWidth: 512);
    if (widget.expandCrossSide) {
      effectiveConstraints = switch (side) {
        SheetSide.left || SheetSide.right => effectiveConstraints.copyWith(
            maxHeight: mediaQuery.size.height,
          ),
        SheetSide.top || SheetSide.bottom => effectiveConstraints.copyWith(
            maxWidth: mediaQuery.size.width,
          ),
      };
    }

    final TextStyle? effectiveHeaderStyle =
        widget.headerTextStyle ?? theme.textTheme.titleLarge;
    final TextStyle? effectiveDescriptionStyle =
        widget.descriptionTextStyle ?? theme.textTheme.bodyMedium;

    final TextAlign effectiveHeaderAlign =
        widget.headerTextAlign ?? TextAlign.start;
    final TextAlign effectiveDescriptionAlign =
        widget.descriptionTextAlign ?? TextAlign.start;

    final MainAxisAlignment effectiveMainAxisAlignment =
        widget.mainAxisAlignment ?? MainAxisAlignment.start;
    final CrossAxisAlignment effectiveCrossAxisAlignment =
        widget.crossAxisAlignment ?? CrossAxisAlignment.stretch;

    Widget content = Container(
      decoration: BoxDecoration(
        color: effectiveBackgroundColor,
        borderRadius: effectiveRadius,
        border: effectiveBorder,
        boxShadow: effectiveShadows,
      ),
      child: Stack(
        children: <Widget>[
          Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              if (widget.header != null) widget.header!,
              Flexible(
                child: SingleChildScrollView(
                  controller: scrollController,
                  physics: widget.draggable
                      ? const NeverScrollableScrollPhysics()
                      : null,
                  child: Padding(
                    padding: effectivePadding,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      mainAxisAlignment: effectiveMainAxisAlignment,
                      crossAxisAlignment: effectiveCrossAxisAlignment,
                      children: <Widget>[
                        if (widget.title != null)
                          DefaultTextStyle(
                            style: effectiveHeaderStyle!,
                            textAlign: effectiveHeaderAlign,
                            child: widget.title!,
                          ),
                        if (widget.description != null)
                          DefaultTextStyle(
                            style: effectiveDescriptionStyle!,
                            textAlign: effectiveDescriptionAlign,
                            child: widget.description!,
                          ),
                        if (widget.child != null) widget.child!,
                        if (widget.actions.isNotEmpty)
                          Padding(
                            padding: EdgeInsets.only(top: effectiveGap),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.end,
                              children: widget.actions,
                            ),
                          ),
                      ].separatedBy(SizedBox(height: effectiveGap)),
                    ),
                  ),
                ),
              ),
              if (widget.footer != null) widget.footer!,
            ],
          ),
          if (widget.closeIcon != null)
            Positioned(
              top: widget.closeIconPosition?.dy ?? Spacing.space(2),
              right: widget.closeIconPosition?.dx ?? Spacing.space(2),
              child: widget.closeIcon!,
            ),
        ],
      ),
    );

    if (widget.draggable &&
        (side == SheetSide.bottom || side == SheetSide.top)) {
      content = GestureDetector(
        onVerticalDragStart: _onVerticalDragStart,
        onVerticalDragUpdate: _onVerticalDragUpdate,
        onVerticalDragEnd: _onVerticalDragEnd,
        behavior: HitTestBehavior.translucent,
        child: content,
      );
    }

    return Align(
      alignment: side.alignment,
      child: ConstrainedBox(
        constraints: effectiveConstraints,
        child: content,
      ),
    );
  }
}
