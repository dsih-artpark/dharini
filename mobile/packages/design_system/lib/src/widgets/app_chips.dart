import 'package:flutter/material.dart';
import '../theme/corners.dart';
import '../theme/spacing.dart';

/// Custom chip widget that can be used standalone or as part of ChipList
class CustomChip extends StatefulWidget {
  const CustomChip({
    required this.label,
    super.key,
    this.value,
    this.prefix,
    this.removable = false,
    this.onRemoved,
    this.onPressed,
    this.selected = false,
  });

  final String label;
  final String? value;
  final Widget? prefix;
  final bool removable;
  final VoidCallback? onRemoved;
  final VoidCallback? onPressed;
  final bool selected;

  @override
  State<CustomChip> createState() => _CustomChipState();
}

class _CustomChipState extends State<CustomChip> {
  bool isHovered = false;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colors = theme.colorScheme;

    final Color backgroundColor = widget.selected
        ? colors.primary.withOpacity(0.1)
        : colors.surfaceContainerHighest;

    final Color borderColor = widget.selected ? colors.primary : colors.outline;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: widget.onPressed,
        borderRadius: Corners.borderFull,
        child: MouseRegion(
          onEnter: (_) => setState(() => isHovered = true),
          onExit: (_) => setState(() => isHovered = false),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            decoration: BoxDecoration(
              color: backgroundColor,
              borderRadius: Corners.borderFull,
              border: Border.all(
                color: borderColor,
              ),
            ),
            child: Padding(
              padding: Spacing.pxy(3, 1),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  if (widget.prefix != null) ...<Widget>[
                    widget.prefix!,
                    SizedBox(width: Spacing.space(2)),
                  ],
                  Text(
                    widget.label,
                    style: theme.textTheme.labelLarge?.copyWith(
                      color:
                          widget.selected ? colors.primary : colors.onSurface,
                    ),
                  ),
                  if (widget.removable) ...<Widget>[
                    SizedBox(width: Spacing.space(1)),
                    MouseRegion(
                      hitTestBehavior: HitTestBehavior.opaque,
                      child: GestureDetector(
                        onTap: widget.onRemoved,
                        behavior: HitTestBehavior.opaque,
                        child: Icon(
                          Icons.close,
                          size: 16,
                          color: widget.selected
                              ? colors.primary
                              : colors.onSurface,
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// Value changed callback type for ChipList
typedef OnChipListChanged<T> = void Function(List<T> selectedValues);

/// A widget that displays a list of selectable chips
class ChipList<T> extends StatefulWidget {
  const ChipList({
    required this.children,
    required this.values,
    super.key,
    this.initialSelection = const <Never>[],
    this.onChanged,
    this.spacing,
    this.runSpacing,
    this.multiSelect = false,
  });

  /// The list of chip widgets to display
  final List<CustomChip> children;

  /// The values corresponding to each chip
  final List<T> values;

  /// Initially selected values
  final List<T> initialSelection;

  /// Callback when selection changes
  final OnChipListChanged<T>? onChanged;

  /// Horizontal spacing between chips
  final double? spacing;

  /// Vertical spacing between chip rows
  final double? runSpacing;

  /// Whether multiple chips can be selected
  final bool multiSelect;

  @override
  State<ChipList<T>> createState() => _ChipListState<T>();
}

class _ChipListState<T> extends State<ChipList<T>> {
  late Set<T> _selectedValues;

  @override
  void initState() {
    super.initState();
    _selectedValues = Set<T>.from(widget.initialSelection);
  }

  void _handleChipSelected(T value) {
    setState(() {
      if (widget.multiSelect) {
        if (_selectedValues.contains(value)) {
          _selectedValues.remove(value);
        } else {
          _selectedValues.add(value);
        }
      } else {
        _selectedValues = <T>{value};
      }
      widget.onChanged?.call(_selectedValues.toList());
    });
  }

  @override
  Widget build(BuildContext context) => Wrap(
        spacing: widget.spacing ?? Spacing.space(2),
        runSpacing: widget.runSpacing ?? Spacing.space(2),
        children: List<Widget>.generate(
          widget.children.length,
          (int index) {
            final CustomChip chip = widget.children[index];
            final T value = widget.values[index];
            final bool isSelected = _selectedValues.contains(value);

            return CustomChip(
              key: chip.key,
              label: chip.label,
              value: chip.value,
              prefix: chip.prefix,
              removable: chip.removable,
              selected: isSelected,
              onPressed: () => _handleChipSelected(value),
              onRemoved:
                  chip.removable ? () => _handleChipSelected(value) : null,
            );
          },
        ),
      );
}
