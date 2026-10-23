import 'package:flutter/material.dart';
import '../theme/colors.dart';
import '../theme/spacing.dart';
import '../theme/typography.dart';

class AppRadioGroup<T> extends StatefulWidget {
  AppRadioGroup({
    required this.items,
    super.key,
    this.initialValue,
    this.onChanged,
    this.enabled = true,
    this.axis = Axis.vertical,
    this.runSpacing = 0.0,
    this.alignment = WrapAlignment.start,
    this.runAlignment = WrapAlignment.start,
    this.crossAxisAlignment = WrapCrossAlignment.start,
  });

  final Iterable<Widget> items;
  final T? initialValue;
  final ValueChanged<T?>? onChanged;
  final bool enabled;
  final Axis axis;
  final double spacing = Spacing.space(2);
  final double runSpacing;
  final WrapAlignment alignment;
  final WrapAlignment runAlignment;
  final WrapCrossAlignment crossAxisAlignment;

  @override
  State<AppRadioGroup<T>> createState() => AppRadioGroupState<T>();

  static AppRadioGroupState<T> of<T>(BuildContext context) => context
      .dependOnInheritedWidgetOfExactType<_InheritedRadioGroup<T>>()!
      .state;
}

class AppRadioGroupState<T> extends State<AppRadioGroup<T>> {
  late T? selectedValue = widget.initialValue;

  void select(T value) {
    if (value == selectedValue) return;
    setState(() => selectedValue = value);
    widget.onChanged?.call(value);
  }

  @override
  Widget build(BuildContext context) => _InheritedRadioGroup<T>(
        state: this,
        child: Wrap(
          direction: widget.axis,
          spacing: widget.spacing,
          runSpacing: widget.runSpacing,
          alignment: widget.alignment,
          runAlignment: widget.runAlignment,
          crossAxisAlignment: widget.crossAxisAlignment,
          children: widget.items.toList(),
        ),
      );
}

class _InheritedRadioGroup<T> extends InheritedWidget {
  const _InheritedRadioGroup({
    required this.state,
    required super.child,
  });

  final AppRadioGroupState<T> state;

  @override
  bool updateShouldNotify(_InheritedRadioGroup<T> oldWidget) => true;
}

class AppRadio<T> extends StatefulWidget {
  const AppRadio({
    required this.value,
    super.key,
    this.label,
    this.sublabel,
    this.enabled = true,
    this.focusNode,
    this.size,
    this.color,
    this.padding,
    this.direction,
    this.crossAxisAlignment,
  });

  final T value;
  final Widget? label;
  final Widget? sublabel;
  final bool enabled;
  final FocusNode? focusNode;
  final double? size;
  final Color? color;
  final EdgeInsets? padding;
  final TextDirection? direction;
  final CrossAxisAlignment? crossAxisAlignment;

  @override
  State<AppRadio<T>> createState() => _AppRadioState<T>();
}

class _AppRadioState<T> extends State<AppRadio<T>> {
  late final WidgetStatesController statesController = WidgetStatesController();
  bool hovering = false;
  FocusNode? _focusNode;

  FocusNode get focusNode => widget.focusNode ?? _focusNode!;

  @override
  void initState() {
    super.initState();
    if (widget.focusNode == null) {
      _focusNode = FocusNode();
    }
  }

  @override
  void dispose() {
    _focusNode?.dispose();
    statesController.dispose();
    super.dispose();
  }

  void onTap() {
    final AppRadioGroupState<T> group = AppRadioGroup.of<T>(context);
    if (!widget.enabled || !group.widget.enabled) return;

    group.select(widget.value);
    if (!focusNode.hasFocus) {
      FocusScope.of(context).unfocus();
    }
  }

  @override
  Widget build(BuildContext context) {
    final AppRadioGroupState<T> group = AppRadioGroup.of<T>(context);
    final bool selected = group.selectedValue == widget.value;
    final bool enabled = widget.enabled && group.widget.enabled;

    final double effectiveSize = widget.size ?? Spacing.space(4);
    final Color effectiveColor = widget.color ?? AppColors.primaryLight;
    final EdgeInsets effectivePadding = widget.padding ?? Spacing.pl(2);

    final Semantics radio = Semantics(
      checked: selected,
      child: MouseRegion(
        cursor:
            enabled ? SystemMouseCursors.click : SystemMouseCursors.forbidden,
        onEnter: (_) => setState(() => hovering = true),
        onExit: (_) => setState(() => hovering = false),
        child: GestureDetector(
          onTap: enabled ? onTap : null,
          child: Container(
            width: effectiveSize,
            height: effectiveSize,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(
                color: enabled
                    ? selected
                        ? effectiveColor
                        : AppColors.borderLight
                    : AppColors.borderLight.withOpacity(0.5),
                width: 2,
              ),
              color: enabled
                  ? selected
                      ? effectiveColor
                      : hovering
                          ? AppColors.surfaceLight
                          : Colors.transparent
                  : AppColors.surfaceLight.withOpacity(0.5),
            ),
            child: Center(
              child: selected
                  ? Container(
                      width: 6,
                      height: 6,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: enabled
                            ? Colors.white
                            : AppColors.borderLight.withOpacity(0.5),
                      ),
                    )
                  : null,
            ),
          ),
        ),
      ),
    );

    if (widget.label == null) return radio;

    return GestureDetector(
      onTap: enabled ? onTap : null,
      child: Container(
        decoration: BoxDecoration(
          color: selected ? AppColors.surfaceLight : Colors.transparent,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Padding(
          padding: Spacing.p(2),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            textDirection: widget.direction,
            children: <Widget>[
              radio,
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
                          style: AppTypography.textTheme.bodyMedium!.copyWith(
                            color: enabled
                                ? AppColors.textTheme
                                : AppColors.textTheme.withOpacity(0.38),
                          ),
                          child: widget.label!,
                        ),
                        if (widget.sublabel != null) ...<Widget>[
                          SizedBox(height: Spacing.space(1)),
                          DefaultTextStyle(
                            style: AppTypography.textTheme.bodySmall!.copyWith(
                              color: enabled
                                  ? AppColors.labletestgrey
                                  : AppColors.textTheme.withOpacity(0.38),
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
