import 'package:flutter/material.dart';

import '../theme/corners.dart';
import '../theme/spacing.dart';
import 'app_badge.dart';
import 'app_button.dart';
import 'app_sheet.dart';

class SelectOption<T> {
  const SelectOption({
    required this.value,
    required this.label,
  });
  final T value;
  final String label;
}

class Select<T> extends StatefulWidget {
  const Select({
    required this.options,
    required this.value,
    required this.onChanged,
    super.key,
    this.enabled = true,
    this.placeholder = 'Select an option',
    this.prefixIcon,
    this.badge,
    this.multiple = false,
  });

  final List<SelectOption<T>> options;
  final dynamic value;
  final ValueChanged<dynamic> onChanged;
  final bool enabled;
  final String placeholder;
  final Widget? prefixIcon;
  final String? badge;
  final bool multiple;

  @override
  State<Select<T>> createState() => _SelectState<T>();
}

class _SelectState<T> extends State<Select<T>> {
  void _showOptions(BuildContext context) {
    showSheet<void>(
      context: context,
      builder: (BuildContext context) => Sheet(
        actions: widget.multiple
            ? <Widget>[
                AppButton(
                  variant: ButtonVariant.outline,
                  size: ButtonSize.sm,
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Done'),
                ),
              ]
            : <Widget>[],
        child: ListView.builder(
          shrinkWrap: true,
          itemCount: widget.options.length,
          itemBuilder: (BuildContext context, int index) {
            final ThemeData theme = Theme.of(context);
            final SelectOption<T> option = widget.options[index];
            bool isSelected;
            if (widget.multiple) {
              if (widget.value is List<T>) {
                final List<T> selectedValues = widget.value! as List<T>;
                isSelected = selectedValues.contains(option.value);
              } else {
                isSelected = false;
              }
            } else {
              isSelected = option.value == widget.value;
            }

            return ListTile(
              title: Text(option.label, style: theme.textTheme.bodyMedium),
              trailing: isSelected ? const Icon(Icons.check, size: 18) : null,
              onTap: () {
                if (widget.multiple) {
                  List<T> currentValues;

                  if (widget.value is List<T>) {
                    currentValues = List<T>.from(widget.value! as List<T>);
                  } else {
                    currentValues = <T>[];
                  }

                  if (isSelected) {
                    currentValues.remove(option.value);
                  } else {
                    currentValues.add(option.value);
                  }
                  widget.onChanged(currentValues);
                } else {
                  widget.onChanged(option.value);
                  Navigator.pop(context);
                }
              },
            );
          },
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;

    final SelectOption<T>? selectedOption =
        widget.options.cast<SelectOption<T>?>().firstWhere(
              (SelectOption<T>? option) => option?.value == widget.value,
              orElse: () => null,
            );

    return InkWell(
      onTap: widget.enabled ? () => _showOptions(context) : null,
      borderRadius: Corners.borderLg,
      child: Container(
        padding: Spacing.pxy(3, 2),
        decoration: BoxDecoration(
          border: Border.all(
            color: widget.enabled
                ? colorScheme.outline
                : colorScheme.outline.withOpacity(0.5),
          ),
          borderRadius: Corners.borderLg,
          color: widget.enabled
              ? colorScheme.surface
              : colorScheme.surface.withOpacity(0.7),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            if (widget.prefixIcon != null) ...<Widget>[
              widget.prefixIcon!,
              SizedBox(width: Spacing.space(2)),
            ],
            Expanded(
              child: Text(
                selectedOption?.label ?? widget.placeholder,
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: selectedOption != null
                      ? colorScheme.onSurface
                      : colorScheme.onSurface.withOpacity(0.6),
                ),
              ),
            ),
            if (widget.badge != null) ...<Widget>[
              SizedBox(width: Spacing.space(2)),
              AppBadge.secondary(
                child: Text(widget.badge!),
              ),
            ],
            SizedBox(width: Spacing.space(2)),
            Icon(
              Icons.keyboard_arrow_down,
              size: 20,
              color: widget.enabled
                  ? colorScheme.onSurface
                  : colorScheme.onSurface.withOpacity(0.5),
            ),
          ],
        ),
      ),
    );
  }
}
