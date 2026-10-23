import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../theme/spacing.dart';

/// A widget that renders its child outside of the normal widget tree.
/// Used for overlays, tooltips, popovers etc.
class Portal extends StatefulWidget {
  const Portal({
    required this.child,
    required this.portalBuilder,
    super.key,
    this.anchor,
    this.visible = true,
  });

  final Widget child;
  final WidgetBuilder portalBuilder;
  final AnchorBase? anchor;
  final bool visible;

  @override
  State<Portal> createState() => _PortalState();
}

class _PortalState extends State<Portal> {
  final GlobalKey<OverlayState> _overlayKey = GlobalKey<OverlayState>();
  final GlobalKey<State<StatefulWidget>> _childKey = GlobalKey();
  OverlayEntry? _overlayEntry;

  @override
  void initState() {
    super.initState();
    if (widget.visible) {
      WidgetsBinding.instance.addPostFrameCallback((_) => _showOverlay());
    }
  }

  @override
  void dispose() {
    _removeOverlay();
    super.dispose();
  }

  @override
  void didUpdateWidget(Portal oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.visible != oldWidget.visible) {
      if (widget.visible) {
        _showOverlay();
      } else {
        _removeOverlay();
      }
    }
  }

  void _removeOverlay() {
    _overlayEntry?.remove();
    _overlayEntry = null;
  }

  void _showOverlay() {
    final OverlayState? overlay = _overlayKey.currentState;
    if (overlay == null) return;

    final ThemeData themeData = Theme.of(context);
    final RenderBox? renderBox =
        _childKey.currentContext?.findRenderObject() as RenderBox?;
    if (renderBox == null) return;

    final Size childSize = renderBox.size;
    final Offset childOffset = renderBox.localToGlobal(Offset.zero);

    _overlayEntry = OverlayEntry(
      builder: (BuildContext context) => Material(
        type: MaterialType.transparency,
        child: Stack(
          children: <Widget>[
            // Backdrop for handling outside clicks
            if (widget.visible)
              Positioned.fill(
                child: MouseRegion(
                  cursor: SystemMouseCursors.click,
                  child: GestureDetector(
                    behavior: HitTestBehavior.opaque,
                    onTap: _removeOverlay,
                  ),
                ),
              ),
            // Portal content
            _PositionedPortal(
              anchor: widget.anchor,
              childOffset: childOffset,
              childSize: childSize,
              child: Theme(
                data: themeData,
                child: Builder(builder: widget.portalBuilder),
              ),
            ),
          ],
        ),
      ),
    );

    overlay.insert(_overlayEntry!);
  }

  @override
  Widget build(BuildContext context) => Material(
        type: MaterialType.transparency,
        child: SizedBox.expand(
          child: Overlay(
            key: _overlayKey,
            initialEntries: <OverlayEntry>[
              OverlayEntry(
                builder: (BuildContext context) => Positioned(
                  child: SizedBox(
                    key: _childKey,
                    child: widget.child,
                  ),
                ),
              ),
            ],
          ),
        ),
      );
}

class _PositionedPortal extends StatelessWidget {
  const _PositionedPortal({
    required this.child,
    required this.childOffset,
    required this.childSize,
    this.anchor,
  });

  final Widget child;
  final Offset childOffset;
  final Size childSize;
  final AnchorBase? anchor;

  @override
  Widget build(BuildContext context) {
    final MediaQueryData mediaQuery = MediaQuery.of(context);
    final Size screenSize = mediaQuery.size;
    final EdgeInsets viewPadding = mediaQuery.viewPadding;

    final Offset anchorPosition = anchor?.getAnchorPoint(
          childOffset: childOffset,
          childSize: childSize,
          screenSize: screenSize,
          viewPadding: viewPadding,
        ) ??
        Offset(
          childOffset.dx,
          childOffset.dy + childSize.height + Spacing.space(2),
        );

    return Positioned(
      left: math.max(Spacing.space(2), anchorPosition.dx),
      top: math.max(Spacing.space(2), anchorPosition.dy),
      child: GestureDetector(
        // Add this to prevent clicks from reaching the backdrop
        behavior: HitTestBehavior.opaque,
        child: Material(
          color: Colors.transparent,
          elevation: 8,
          borderRadius: BorderRadius.circular(8),
          child: child,
        ),
      ),
    );
  }
}

/// Base class for anchor positioning
// ignore: one_member_abstracts
abstract class AnchorBase {
  const AnchorBase();

  Offset getAnchorPoint({
    required Offset childOffset,
    required Size childSize,
    required Size screenSize,
    required EdgeInsets viewPadding,
  });
}

/// Anchors portal content to a global position
class GlobalAnchor extends AnchorBase {
  const GlobalAnchor(this.position);

  final Offset position;

  @override
  Offset getAnchorPoint({
    required Offset childOffset,
    required Size childSize,
    required Size screenSize,
    required EdgeInsets viewPadding,
  }) =>
      position;
}

/// Anchors portal content relative to its trigger element
class Anchor extends AnchorBase {
  const Anchor({
    this.overlayAlignment = Alignment.bottomLeft,
    this.offset = Offset.zero,
  });

  final Alignment overlayAlignment;
  final Offset offset;

  @override
  Offset getAnchorPoint({
    required Offset childOffset,
    required Size childSize,
    required Size screenSize,
    required EdgeInsets viewPadding,
  }) {
    double dx = childOffset.dx;
    double dy = childOffset.dy;

    switch (overlayAlignment) {
      case Alignment.topCenter:
        dx += childSize.width / 2;
        dy -= Spacing.space(2);
      case Alignment.topRight:
        dx += childSize.width;
        dy -= Spacing.space(2);
      case Alignment.centerLeft:
        dy += childSize.height / 2;
      case Alignment.center:
        dx += childSize.width / 2;
        dy += childSize.height / 2;
      case Alignment.centerRight:
        dx += childSize.width;
        dy += childSize.height / 2;
      case Alignment.bottomLeft:
        dy += childSize.height + Spacing.space(2);
      case Alignment.bottomCenter:
        dx += childSize.width / 2;
        dy += childSize.height + Spacing.space(2);
      case Alignment.bottomRight:
        dx += childSize.width;
        dy += childSize.height + Spacing.space(2);
      default:
        dy -= Spacing.space(2);
    }

    return Offset(dx, dy) + offset;
  }
}

/// Automatically positions portal content based on available space
class AutoAnchor extends Anchor {
  const AutoAnchor({
    this.verticalOffset = 0,
    this.preferBelow = true,
  });

  final double verticalOffset;
  final bool preferBelow;

  @override
  Offset getAnchorPoint({
    required Offset childOffset,
    required Size childSize,
    required Size screenSize,
    required EdgeInsets viewPadding,
  }) {
    final Offset targetOffset = super.getAnchorPoint(
      childOffset: childOffset,
      childSize: childSize,
      screenSize: screenSize,
      viewPadding: viewPadding,
    );

    // Check if there's room below
    final bool fitsBelow = (targetOffset.dy + childSize.height) <
        (screenSize.height - viewPadding.bottom);

    // Check if there's room above
    final bool fitsAbove =
        (childOffset.dy - childSize.height) > viewPadding.top;

    final bool showBelow =
        preferBelow ? fitsBelow || !fitsAbove : !fitsAbove && fitsBelow;

    return Offset(
      targetOffset.dx,
      showBelow
          ? childOffset.dy + childSize.height + verticalOffset
          : childOffset.dy - childSize.height - verticalOffset,
    );
  }
}
