import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../theme/corners.dart';
import '../theme/spacing.dart';

class Toggle extends StatefulWidget {
  const Toggle({
    required this.value,
    this.onChanged,
    super.key,
    this.enabled = true,
    this.thumbColor,
    this.activeTrackColor,
    this.inactiveTrackColor,
    this.width,
    this.height,
    this.thumbPadding,
    this.duration,
    this.label,
    this.sublabel,
    this.padding,
    this.direction,
    this.focusNode,
  });

  /// Current value of the toggle
  final bool value;

  /// Callback when toggle value changes
  final ValueChanged<bool>? onChanged;

  /// Whether the toggle is enabled
  final bool enabled;

  /// Color of the toggle thumb/handle
  final Color? thumbColor;

  /// Color of track when toggle is on
  final Color? activeTrackColor;

  /// Color of track when toggle is off
  final Color? inactiveTrackColor;

  /// Width of the toggle
  final double? width;

  /// Height of the toggle
  final double? height;

  /// Padding around the thumb
  final double? thumbPadding;

  /// Animation duration
  final Duration? duration;

  /// Optional label widget
  final Widget? label;

  /// Optional sublabel widget
  final Widget? sublabel;

  /// Padding between toggle and labels
  final EdgeInsets? padding;

  /// Text direction
  final TextDirection? direction;

  /// Focus node
  final FocusNode? focusNode;

  @override
  State<Toggle> createState() => _ToggleState();
}

class _ToggleState extends State<Toggle> {
  FocusNode? _focusNode;
  late bool _value;

  FocusNode get focusNode => widget.focusNode ?? _focusNode!;

  @override
  void initState() {
    super.initState();
    _value = widget.value;
    if (widget.focusNode == null) {
      _focusNode = FocusNode();
    }
  }

  @override
  void didUpdateWidget(Toggle oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.value != widget.value) {
      _value = widget.value;
    }
  }

  @override
  void dispose() {
    _focusNode?.dispose();
    super.dispose();
  }

  void onTap() {
    if (!widget.enabled) return;

    setState(() {
      _value = !_value;
    });

    widget.onChanged?.call(_value);

    if (!focusNode.hasFocus) {
      FocusScope.of(context).unfocus();
    }
  }

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;

    final double effectiveWidth = widget.width ?? Spacing.space(11);
    final double effectiveHeight = widget.height ?? Spacing.space(6);
    final double effectiveThumbPadding =
        widget.thumbPadding ?? Spacing.space(1);
    final double effectiveThumbSize =
        effectiveHeight - (effectiveThumbPadding * 2);

    final Duration effectiveDuration = widget.duration ?? 100.milliseconds;

    final Color effectiveThumbColor = widget.thumbColor ??
        (widget.enabled
            ? (_value ? Colors.white : colorScheme.surface)
            : colorScheme.surface.withOpacity(0.5));

    final Color effectiveTrackColor = _value
        ? (widget.activeTrackColor ??
            (widget.enabled
                ? colorScheme.primary
                : colorScheme.primary.withOpacity(0.5)))
        : (widget.inactiveTrackColor ??
            (widget.enabled
                ? colorScheme.outline
                : colorScheme.outline.withOpacity(0.5)));

    final Semantics toggle = Semantics(
      toggled: _value,
      child: MouseRegion(
        cursor: widget.enabled
            ? SystemMouseCursors.click
            : SystemMouseCursors.forbidden,
        child: GestureDetector(
          onTap: widget.enabled ? onTap : null,
          child: Container(
            width: effectiveWidth,
            height: effectiveHeight,
            decoration: BoxDecoration(
              color: effectiveTrackColor,
              borderRadius: Corners.borderFull,
            ),
            child: AnimatedAlign(
              duration: effectiveDuration,
              alignment: _value ? Alignment.centerRight : Alignment.centerLeft,
              child: Padding(
                padding: EdgeInsets.all(effectiveThumbPadding),
                child: Container(
                  width: effectiveThumbSize,
                  height: effectiveThumbSize,
                  decoration: BoxDecoration(
                    color: effectiveThumbColor,
                    shape: BoxShape.circle,
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );

    if (widget.label == null) {
      return toggle;
    }

    return Opacity(
      opacity: widget.enabled ? 1 : 0.5,
      child: GestureDetector(
        onTap: widget.enabled ? onTap : null,
        child: Row(
          textDirection: widget.direction,
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            if (widget.label != null || widget.sublabel != null)
              Expanded(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    if (widget.label != null)
                      DefaultTextStyle(
                        style: theme.textTheme.bodyLarge!.copyWith(
                          fontWeight: FontWeight.w500,
                        ),
                        child: widget.label!,
                      ),
                    if (widget.sublabel != null)
                      DefaultTextStyle(
                        style: theme.textTheme.bodyMedium!.copyWith(
                          color: theme.colorScheme.onSurface.withOpacity(0.7),
                        ),
                        child: widget.sublabel!,
                      ),
                  ],
                ),
              ),
            SizedBox(width: Spacing.space(2)),
            toggle,
          ],
        ),
      ),
    );
  }
}
