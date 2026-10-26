import 'package:design_system/design_system.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Clamps [value] into the inclusive range `[0, max]`.
int clampCount(int value, {required int max}) {
  if (value < 0) return 0;
  if (value > max) return max;
  return value;
}

/// A compact count selector: a `−` button, an editable whole-number field, and
/// a `+` button. Users can tap the buttons or type the number directly.
///
/// The field accepts whole numbers only and defaults to 0; values are clamped to
/// `[0, maxCount]`. The parent owns the value — [onChanged] is called with the
/// new clamped count whenever it changes.
class SampleCountStepper extends StatefulWidget {
  const SampleCountStepper({
    required this.count,
    required this.onChanged,
    this.maxCount = 999,
    Key? key,
  }) : super(key: key);

  final int count;
  final ValueChanged<int> onChanged;
  final int maxCount;

  @override
  State<SampleCountStepper> createState() => _SampleCountStepperState();
}

class _SampleCountStepperState extends State<SampleCountStepper> {
  late final TextEditingController _controller;
  late final FocusNode _focusNode;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: widget.count.toString());
    _focusNode = FocusNode()..addListener(_onFocusChange);
  }

  @override
  void didUpdateWidget(SampleCountStepper oldWidget) {
    super.didUpdateWidget(oldWidget);
    // Sync the field when the count changes from outside (buttons, draft
    // restore). When the change came from the user's own typing, the parsed
    // field already equals widget.count, so we leave the cursor untouched.
    if (widget.count != _parsedValue) {
      _setText(widget.count.toString());
    }
  }

  @override
  void dispose() {
    _focusNode.removeListener(_onFocusChange);
    _focusNode.dispose();
    _controller.dispose();
    super.dispose();
  }

  /// The current field text parsed to an int; empty/invalid → 0.
  int get _parsedValue => int.tryParse(_controller.text) ?? 0;

  void _setText(String text) {
    _controller.text = text;
    _controller.selection =
        TextSelection.collapsed(offset: _controller.text.length);
  }

  void _onFocusChange() {
    if (_focusNode.hasFocus) {
      // Select all so typing replaces the current value instead of appending.
      _controller.selection = TextSelection(
        baseOffset: 0,
        extentOffset: _controller.text.length,
      );
    } else if (_controller.text.isEmpty) {
      // Normalize an empty field back to 0 once editing ends.
      _controller.text = '0';
    }
  }

  void _onTextChanged(String raw) {
    final parsed = int.tryParse(raw) ?? 0;
    final clamped = clampCount(parsed, max: widget.maxCount);
    // Reflect a clamp back into the field (e.g. typing above the cap).
    if (clamped != parsed) {
      _setText(clamped.toString());
    }
    if (clamped != widget.count) {
      widget.onChanged(clamped);
    }
  }

  void _stepBy(int delta) {
    final clamped = clampCount(widget.count + delta, max: widget.maxCount);
    if (clamped != widget.count) {
      widget.onChanged(clamped);
    }
  }

  @override
  Widget build(BuildContext context) {
    final hasCount = widget.count > 0;
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        _CountButton(
          icon: Icons.remove,
          enabled: widget.count > 0,
          onTap: () => _stepBy(-1),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8),
          child: SizedBox(
            width: 52,
            child: TextField(
              controller: _controller,
              focusNode: _focusNode,
              onChanged: _onTextChanged,
              textAlign: TextAlign.center,
              keyboardType: TextInputType.number,
              inputFormatters: [
                FilteringTextInputFormatter.digitsOnly,
                LengthLimitingTextInputFormatter(
                  widget.maxCount.toString().length,
                ),
              ],
              style: AppTypography.textTheme.bodyB2SemiBold.copyWith(
                color: hasCount ? AppColors.primaryLight : AppColors.textStrong,
              ),
              decoration: InputDecoration(
                isDense: true,
                contentPadding:
                    const EdgeInsets.symmetric(horizontal: 4, vertical: 8),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: const BorderSide(color: AppColors.strokeWeak),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: const BorderSide(color: AppColors.strokeWeak),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: const BorderSide(color: AppColors.primaryLight),
                ),
              ),
            ),
          ),
        ),
        _CountButton(
          icon: Icons.add,
          enabled: widget.count < widget.maxCount,
          onTap: () => _stepBy(1),
        ),
      ],
    );
  }
}

class _CountButton extends StatelessWidget {
  final IconData icon;
  final bool enabled;
  final VoidCallback onTap;

  const _CountButton({
    required this.icon,
    required this.enabled,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: enabled ? onTap : null,
      child: Container(
        width: 32,
        height: 32,
        decoration: BoxDecoration(
          color: enabled
              ? AppColors.primaryLight.withValues(alpha: 0.1)
              : AppColors.strokeWeak.withValues(alpha: 0.3),
          shape: BoxShape.circle,
        ),
        child: Icon(
          icon,
          size: 16,
          color: enabled ? AppColors.primaryLight : AppColors.textWeak,
        ),
      ),
    );
  }
}
