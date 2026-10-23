import 'package:flutter/material.dart';
import '../theme/spacing.dart';

class AppCheckbox extends StatefulWidget {
  const AppCheckbox({
    super.key,
    this.value = false,
    this.onChanged,
    this.enabled = true,
    this.label,
    this.sublabel,
    this.focusNode,
    this.size,
    this.color,
    this.padding,
    this.direction,
    this.crossAxisAlignment,
  });

  final bool value;
  final ValueChanged<bool>? onChanged;
  final bool enabled;
  final Widget? label;
  final Widget? sublabel;
  final FocusNode? focusNode;
  final double? size;
  final Color? color;
  final EdgeInsets? padding;
  final TextDirection? direction;
  final CrossAxisAlignment? crossAxisAlignment;

  @override
  State<AppCheckbox> createState() => _AppCheckboxState();
}

class _AppCheckboxState extends State<AppCheckbox> {
  bool hovering = false;
  FocusNode? _focusNode;
  late bool _value;

  FocusNode get focusNode => widget.focusNode ?? _focusNode!;

  @override
  void initState() {
    super.initState();
    if (widget.focusNode == null) {
      _focusNode = FocusNode();
    }
    _value = widget.value;
  }

  @override
  void didUpdateWidget(AppCheckbox oldWidget) {
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

    final bool newValue = !_value;
    setState(() {
      _value = newValue;
    });
    widget.onChanged?.call(newValue);

    if (!focusNode.hasFocus) {
      FocusScope.of(context).unfocus();
    }
  }

  @override
  Widget build(BuildContext context) {
    final ColorScheme colorScheme = Theme.of(context).colorScheme;
    final TextTheme textTheme = Theme.of(context).textTheme;

    final double effectiveSize = widget.size ?? Spacing.space(4);
    final Color effectiveColor = widget.color ?? colorScheme.primary;
    final EdgeInsets effectivePadding = widget.padding ?? Spacing.pl(2);

    final Semantics checkbox = Semantics(
      checked: _value,
      child: MouseRegion(
        cursor: widget.enabled
            ? SystemMouseCursors.click
            : SystemMouseCursors.forbidden,
        onEnter: (_) => setState(() => hovering = true),
        onExit: (_) => setState(() => hovering = false),
        child: GestureDetector(
          onTap: widget.enabled ? onTap : null,
          child: Container(
            width: effectiveSize,
            height: effectiveSize,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(4),
              border: Border.all(
                color: widget.enabled
                    ? _value
                        ? effectiveColor
                        : colorScheme.outline
                    : colorScheme.outline.withOpacity(0.5),
                width: 2,
              ),
              color: widget.enabled
                  ? _value
                      ? effectiveColor
                      : hovering
                          ? colorScheme.surface
                          : Colors.transparent
                  : colorScheme.surface.withOpacity(0.5),
            ),
            child: _value
                ? Center(
                    child: Icon(
                      Icons.check,
                      size: effectiveSize * 0.7,
                      color: widget.enabled
                          ? colorScheme.onPrimary
                          : colorScheme.outline.withOpacity(0.5),
                    ),
                  )
                : null,
          ),
        ),
      ),
    );

    if (widget.label == null) return checkbox;

    return GestureDetector(
      onTap: widget.enabled ? onTap : null,
      child: Container(
        decoration: BoxDecoration(
          color: widget.value ? colorScheme.surface : Colors.transparent,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Padding(
          padding: Spacing.p(2),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            textDirection: widget.direction,
            children: <Widget>[
              checkbox,
              if (widget.label != null)
                Flexible(
                  child: Padding(
                    padding: effectivePadding,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: <Widget>[
                        DefaultTextStyle(
                          style: textTheme.bodyMedium!.copyWith(
                            color: widget.enabled
                                ? colorScheme.onSurface
                                : colorScheme.onSurface.withOpacity(0.38),
                          ),
                          child: widget.label!,
                        ),
                        if (widget.sublabel != null) ...<Widget>[
                          SizedBox(height: Spacing.space(1)),
                          DefaultTextStyle(
                            style: textTheme.bodySmall!.copyWith(
                              color: widget.enabled
                                  ? colorScheme.secondary
                                  : colorScheme.onSurface.withOpacity(0.38),
                            ),
                            child: widget.sublabel!,
                          ),
                        ],
                      ],
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}

// Checkbox Group Widget
class AppCheckboxGroup extends StatefulWidget {
  AppCheckboxGroup({
    required this.items,
    super.key,
    this.initialValues = const <bool>[],
    this.onChanged,
    this.enabled = true,
    this.axis = Axis.vertical,
    this.runSpacing = 0.0,
    this.alignment = WrapAlignment.start,
    this.runAlignment = WrapAlignment.start,
    this.crossAxisAlignment = WrapCrossAlignment.start,
  }) {
    // Ensure initialValues matches items length
    if (initialValues.length != items.length) {
      throw ArgumentError('initialValues length must match items length');
    }
  }

  final List<Widget> items;
  final List<bool> initialValues;
  final ValueChanged<List<bool>>? onChanged;
  final bool enabled;
  final Axis axis;
  final double spacing = Spacing.space(2);
  final double runSpacing;
  final WrapAlignment alignment;
  final WrapAlignment runAlignment;
  final WrapCrossAlignment crossAxisAlignment;

  @override
  State<AppCheckboxGroup> createState() => AppCheckboxGroupState();

  static AppCheckboxGroupState? of(BuildContext context) => context
      .dependOnInheritedWidgetOfExactType<_InheritedCheckboxGroup>()
      ?.state;
}

class AppCheckboxGroupState extends State<AppCheckboxGroup> {
  late List<bool> selectedValues;

  @override
  void initState() {
    super.initState();
    selectedValues = List<bool>.from(widget.initialValues);
  }

  void toggle({required int index, required bool value}) {
    if (!widget.enabled) return;

    setState(() {
      selectedValues[index] = value;
    });
    widget.onChanged?.call(selectedValues);
  }

  @override
  Widget build(BuildContext context) {
    final List<Widget> wrappedItems = List<Widget>.generate(
      widget.items.length,
      (int index) {
        final Widget item = widget.items[index];
        if (item is AppCheckbox) {
          final bool checkboxValue = selectedValues[index];
          return AppCheckbox(
            key: item.key,
            value: checkboxValue,
            onChanged: (bool value) => toggle(index: index, value: value),
            enabled: widget.enabled && item.enabled,
            label: item.label,
            sublabel: item.sublabel,
            focusNode: item.focusNode,
            size: item.size,
            color: item.color,
            padding: item.padding,
            direction: item.direction,
            crossAxisAlignment: item.crossAxisAlignment,
          );
        }
        return item;
      },
    );

    return Wrap(
      direction: widget.axis,
      spacing: widget.spacing,
      runSpacing: widget.runSpacing,
      alignment: widget.alignment,
      runAlignment: widget.runAlignment,
      crossAxisAlignment: widget.crossAxisAlignment,
      children: wrappedItems,
    );
  }
}

class _InheritedCheckboxGroup extends InheritedWidget {
  const _InheritedCheckboxGroup({
    required this.state,
    required super.child,
  });

  final AppCheckboxGroupState state;

  @override
  bool updateShouldNotify(_InheritedCheckboxGroup oldWidget) => true;
}
