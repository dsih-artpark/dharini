import 'package:flutter/material.dart';
import 'package:design_system/design_system.dart';

class CustomDropdownOption<T> {
  final String id;
  final String label;

  const CustomDropdownOption({
    required this.id,
    required this.label,
  });
}

/// A custom select field that opens a searchable bottom sheet.
///
/// The public API is identical to the previous native-dropdown implementation
/// so existing call sites need no changes: tapping the field opens a sheet with
/// a search box pinned at the top and a filtered, single-select list below.
class CustomDropdown<T> extends StatelessWidget {
  final String label;
  final String hintText;
  final List<CustomDropdownOption<T>> options;
  final String? value;
  final ValueChanged<String?>? onChanged;
  final bool isLoading;

  /// Default hint, also treated as "no meaningful hint" for title resolution.
  static const String defaultHint = 'Select an option';

  const CustomDropdown({
    Key? key,
    required this.label,
    required this.options,
    this.value,
    this.onChanged,
    this.isLoading = false,
    this.hintText = defaultHint,
  }) : super(key: key);

  CustomDropdownOption<T>? get _selectedOption {
    for (final option in options) {
      if (option.id == value) return option;
    }
    return null;
  }

  Future<void> _openSheet(BuildContext context) async {
    await showSheet<void>(
      context: context,
      builder: (BuildContext sheetContext) => _SearchableSelectSheet<T>(
        title: resolveSheetTitle(hintText: hintText, label: label),
        options: options,
        selectedId: value,
        onSelected: (String? id) => onChanged?.call(id),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final hasLabel = label.trim().isNotEmpty;
    final textStyle = AppTypography.textTheme.bodyB3Regular.copyWith(
      color: AppColors.textStrong,
    );
    final hintStyle = AppTypography.textTheme.bodyB3Regular.copyWith(
      color: AppColors.textWeak,
    );

    final isEmpty = options.isEmpty;
    final selected = _selectedOption;
    final enabled = !isEmpty && onChanged != null;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (hasLabel) ...[
          Text(
            label,
            style: AppTypography.textTheme.bodyB3Medium.copyWith(
              color: AppColors.textStrong,
            ),
          ),
          const SizedBox(height: 8),
        ],
        if (isLoading)
          const Center(child: CircularProgressIndicator())
        else
          InkWell(
            borderRadius: BorderRadius.circular(12),
            onTap: enabled ? () => _openSheet(context) : null,
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              decoration: BoxDecoration(
                color: AppColors.fillWeak,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.inputFieldStrokeDefault),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      isEmpty
                          ? 'No options available'
                          : (selected?.label ?? hintText),
                      style:
                          (isEmpty || selected == null) ? hintStyle : textStyle,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  Icon(
                    Icons.keyboard_arrow_down,
                    color: AppColors.labletestblack,
                  ),
                ],
              ),
            ),
          ),
      ],
    );
  }
}

/// Case-insensitive substring filter over option labels.
///
/// Returns the original list unchanged for a blank query.
List<CustomDropdownOption<T>> filterOptions<T>(
  List<CustomDropdownOption<T>> options,
  String query,
) {
  final q = query.trim().toLowerCase();
  if (q.isEmpty) return options;
  return options
      .where((option) => option.label.toLowerCase().contains(q))
      .toList();
}

/// Resolves the title shown at the top of the selection sheet.
///
/// Prefers a meaningful [hintText], falls back to [label], and finally to the
/// (possibly default) hint.
String resolveSheetTitle({required String hintText, required String label}) {
  final hint = hintText.trim();
  if (hint.isNotEmpty && hint != CustomDropdown.defaultHint) return hintText;
  if (label.trim().isNotEmpty) return label;
  return hintText;
}

class _SearchableSelectSheet<T> extends StatefulWidget {
  const _SearchableSelectSheet({
    required this.title,
    required this.options,
    required this.selectedId,
    required this.onSelected,
    Key? key,
  }) : super(key: key);

  final String title;
  final List<CustomDropdownOption<T>> options;
  final String? selectedId;
  final ValueChanged<String?> onSelected;

  @override
  State<_SearchableSelectSheet<T>> createState() =>
      _SearchableSelectSheetState<T>();
}

class _SearchableSelectSheetState<T> extends State<_SearchableSelectSheet<T>> {
  /// Lists longer than this get a search field; shorter ones render as a plain
  /// picker (mirrors the web Select's threshold).
  static const int _kSearchThreshold = 3;

  late final TextEditingController _controller;
  String _query = '';

  bool get _showSearch => widget.options.length > _kSearchThreshold;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onQueryChanged(String value) {
    setState(() => _query = value);
  }

  void _clearQuery() {
    _controller.clear();
    _onQueryChanged('');
  }

  @override
  Widget build(BuildContext context) {
    final mediaQuery = MediaQuery.of(context);
    final viewInsets = mediaQuery.viewInsets.bottom;
    final filtered =
        _showSearch ? filterOptions(widget.options, _query) : widget.options;

    final textStyle = AppTypography.textTheme.bodyB3Regular.copyWith(
      color: AppColors.textStrong,
    );
    final hintStyle = AppTypography.textTheme.bodyB3Regular.copyWith(
      color: AppColors.textWeak,
    );
    final titleStyle = AppTypography.textTheme.bodyB2SemiBold.copyWith(
      color: AppColors.textStrong,
    );

    final list = ListView.builder(
      // Short lists (no search) size to their content. Long, searchable lists
      // are wrapped in a bounded box below and scroll lazily — only the visible
      // rows build, so the open and keyboard animations stay smooth.
      shrinkWrap: !_showSearch,
      physics: _showSearch ? null : const NeverScrollableScrollPhysics(),
      padding: EdgeInsets.zero,
      itemCount: filtered.length,
      itemBuilder: (BuildContext context, int index) {
        final option = filtered[index];
        final isSelected = option.id == widget.selectedId;
        return ListTile(
          title: Text(
            option.label,
            style: AppTypography.textTheme.bodyB3Regular.copyWith(
              color: isSelected ? AppColors.primaryLight : AppColors.textStrong,
            ),
          ),
          trailing: isSelected
              ? Icon(Icons.check, size: 18, color: AppColors.primaryLight)
              : null,
          onTap: () {
            widget.onSelected(option.id);
            Navigator.of(context).pop();
          },
        );
      },
    );

    final Widget body = filtered.isEmpty
        ? Padding(
            padding: const EdgeInsets.symmetric(vertical: 32),
            child: Center(child: Text('No results found', style: hintStyle)),
          )
        : _showSearch
            // Fixed height keeps the sheet from jumping as results filter and
            // lets the list build lazily.
            ? SizedBox(height: mediaQuery.size.height * 0.45, child: list)
            : list;

    // The design-system Sheet is shown via showGeneralDialog inside a Cupertino
    // context, so it has no Material ancestor — Material widgets (TextField,
    // ListTile) require one, and a transparent Material provides it without
    // painting over the Sheet's own background.
    // The Sheet also doesn't react to the keyboard, so padding by the keyboard
    // inset lifts the bottom-aligned sheet to keep the search field visible.
    return Material(
      type: MaterialType.transparency,
      child: Padding(
        padding: EdgeInsets.only(bottom: viewInsets),
        child: Sheet(
          padding: EdgeInsets.zero,
          header: Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(widget.title, style: titleStyle),
                if (_showSearch) ...[
                  const SizedBox(height: 12),
                  TextField(
                    controller: _controller,
                    onChanged: _onQueryChanged,
                    textInputAction: TextInputAction.search,
                    style: textStyle,
                    decoration: InputDecoration(
                      hintText: 'Search...',
                      hintStyle: hintStyle,
                      prefixIcon: Icon(Icons.search, color: AppColors.textWeak),
                      suffixIcon: _query.isNotEmpty
                          ? IconButton(
                              icon:
                                  Icon(Icons.close, color: AppColors.textWeak),
                              onPressed: _clearQuery,
                            )
                          : null,
                      filled: true,
                      fillColor: AppColors.fillWeak,
                      isDense: true,
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 14,
                        vertical: 10,
                      ),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(
                          color: AppColors.inputFieldStrokeDefault,
                        ),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(
                          color: AppColors.inputFieldStrokeDefault,
                        ),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(
                          color: AppColors.primaryLight,
                        ),
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
          child: body,
        ),
      ),
    );
  }
}
