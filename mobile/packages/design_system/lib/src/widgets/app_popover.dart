import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../theme/spacing.dart';

import 'app_portal.dart';

class PopoverController extends ChangeNotifier {
  PopoverController({bool isOpen = false}) : _isOpen = isOpen;

  bool _isOpen = false;

  bool get isOpen => _isOpen;

  void show() {
    if (_isOpen) return;
    _isOpen = true;
    notifyListeners();
  }

  void hide() {
    if (!_isOpen) return;
    _isOpen = false;
    notifyListeners();
  }

  void toggle() => _isOpen ? hide() : show();
}

class Popover extends StatefulWidget {
  const Popover({
    required this.child,
    required this.popover,
    super.key,
    this.controller,
    this.visible,
    this.closeOnTapOutside = true,
    this.padding,
    this.backgroundColor,
    this.border,
    this.radius,
    this.shadows,
    this.filter,
    this.anchor,
    this.effects,
    this.groupId,
  }) : assert(
          (controller != null) ^ (visible != null),
          'Either controller or visible must be provided',
        );

  final Widget child;
  final WidgetBuilder popover;
  final PopoverController? controller;
  final bool? visible;
  final bool closeOnTapOutside;
  final EdgeInsets? padding;
  final Color? backgroundColor;
  final Border? border;
  final BorderRadius? radius;
  final List<BoxShadow>? shadows;
  final ImageFilter? filter;
  final AnchorBase? anchor;
  final List<Effect<dynamic>>? effects;
  final Object? groupId;

  @override
  State<Popover> createState() => _PopoverState();
}

class _PopoverState extends State<Popover> {
  PopoverController? _controller;
  PopoverController get controller => widget.controller ?? _controller!;

  @override
  void initState() {
    super.initState();
    if (widget.controller == null) {
      _controller = PopoverController(isOpen: widget.visible ?? false);
    }
  }

  @override
  void didUpdateWidget(Popover oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.visible != null && widget.visible != controller.isOpen) {
      controller.isOpen ? controller.hide() : controller.show();
    }
  }

  @override
  void dispose() {
    _controller?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);

    // Use theme colors and your Spacing utility for consistent styling
    final Color effectiveBackgroundColor =
        widget.backgroundColor ?? theme.colorScheme.surface;
    final Border effectiveBorder = widget.border ??
        Border.all(
          color: theme.colorScheme.outline,
        );
    final BorderRadius effectiveRadius =
        widget.radius ?? BorderRadius.circular(8);
    final List<BoxShadow> effectiveShadows = widget.shadows ??
        <BoxShadow>[
          BoxShadow(
            color: theme.colorScheme.shadow.withOpacity(0.15),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ];
    final EdgeInsets effectivePadding = widget.padding ?? Spacing.p(4);

    return ListenableBuilder(
      listenable: controller,
      builder: (BuildContext context, Widget? child) {
        Widget popoverContent = Material(
          color: effectiveBackgroundColor,
          borderRadius: effectiveRadius,
          clipBehavior: Clip.antiAlias,
          child: Padding(
            padding: effectivePadding,
            child: Builder(builder: widget.popover),
          ),
        );

        // Apply decoration
        popoverContent = DecoratedBox(
          decoration: BoxDecoration(
            border: effectiveBorder,
            borderRadius: effectiveRadius,
            boxShadow: effectiveShadows,
          ),
          child: popoverContent,
        );

        // Apply backdrop filter if provided
        if (widget.filter != null) {
          popoverContent = BackdropFilter(
            filter: widget.filter!,
            child: popoverContent,
          );
        }

        // Apply animation effects
        if (widget.effects != null) {
          popoverContent = Animate(
            effects: widget.effects,
            child: popoverContent,
          );
        }

        return Portal(
          visible: controller.isOpen,
          anchor: widget.anchor ?? const AutoAnchor(),
          portalBuilder: (BuildContext context) => TapRegion(
            groupId: widget.groupId,
            onTapOutside:
                widget.closeOnTapOutside ? (_) => controller.hide() : null,
            child: popoverContent,
          ),
          child: TapRegion(
            groupId: widget.groupId,
            child: child,
          ),
        );
      },
      child: widget.child,
    );
  }
}
