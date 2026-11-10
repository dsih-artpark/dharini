import 'package:design_system/design_system.dart';
import 'package:flutter/material.dart';

import 'dropdown.dart';

/// Picks a site's collectors, primary first.
///
/// The chosen collectors show as chips in the order they were added; the
/// dropdown adds another. Every collector sees the site's visits and can
/// submit them. They may be from different teams; plan visits are created
/// under the first one, the primary, and their team.
class CollectorPicker extends StatelessWidget {
  final String label;
  final List<CustomDropdownOption<String>> options;
  final List<String> selectedIds;
  final ValueChanged<List<String>> onChanged;
  final bool isLoading;

  /// Names for selected collectors missing from [options], e.g. a site's
  /// collector who has since left the team.
  final Map<String, String> fallbackLabels;

  const CollectorPicker({
    Key? key,
    required this.options,
    required this.selectedIds,
    required this.onChanged,
    this.label = 'Select Collectors',
    this.isLoading = false,
    this.fallbackLabels = const {},
  }) : super(key: key);

  String _labelOf(String id) {
    for (final option in options) {
      if (option.id == id) return option.label;
    }
    return fallbackLabels[id] ?? 'Collector';
  }

  @override
  Widget build(BuildContext context) {
    final remaining =
        options.where((option) => !selectedIds.contains(option.id)).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CustomDropdown<String>(
          label: label,
          hintText: selectedIds.isEmpty
              ? CustomDropdown.defaultHint
              : 'Add another collector',
          options: remaining,
          isLoading: isLoading,
          onChanged: (id) {
            if (id == null || selectedIds.contains(id)) return;
            onChanged([...selectedIds, id]);
          },
        ),
        if (selectedIds.isNotEmpty) ...[
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              for (var i = 0; i < selectedIds.length; i++)
                InputChip(
                  label: Text(
                    _labelOf(selectedIds[i]),
                    style: AppTypography.textTheme.bodyB3Regular.copyWith(
                      color: AppColors.textStrong,
                    ),
                  ),
                  onDeleted: () => onChanged([...selectedIds]..removeAt(i)),
                ),
            ],
          ),
        ],
      ],
    );
  }
}
