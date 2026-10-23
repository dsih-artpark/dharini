// ignore_for_file: deprecated_member_use

import 'package:flutter/material.dart';

import '../theme/colors.dart';
import '../theme/spacing.dart';
import '../theme/typography.dart';

enum InputSize { sm, md, lg }

class AppTextField extends StatefulWidget {
  const AppTextField({
    super.key,
    this.label,
    this.placeholder,
    this.prefix,
    this.suffix,
    this.helperText,
    this.showInfoTooltip = false,
    this.size = InputSize.md,
    this.onChanged,
    this.validator,
    this.controller,
    this.enabled = true,
    this.initialValue,
    this.obscureText = false,
    this.maxLines = 1,
    this.minLines,
    this.textInputAction = TextInputAction.newline,
    this.keyboardType = TextInputType.text, // Added keyboard type parameter
  });

  final String? label;
  final String? placeholder;
  final Widget? prefix;
  final Widget? suffix;
  final String? helperText;
  final bool showInfoTooltip;
  final InputSize size;
  final ValueChanged<String>? onChanged;
  final String? Function(String?)? validator;
  final TextEditingController? controller;
  final bool enabled;
  final String? initialValue;
  final bool obscureText;
  final int? maxLines;
  final int? minLines;
  final TextInputAction textInputAction;
  final TextInputType keyboardType; // New field for keyboard type

  @override
  State<AppTextField> createState() => _AppTextFieldState();
}

class _AppTextFieldState extends State<AppTextField> {
  late TextEditingController _controller;
  bool _isFocused = false;
  String? _errorText;
  final FocusNode _focusNode = FocusNode();

  @override
  void initState() {
    super.initState();
    _controller =
        widget.controller ?? TextEditingController(text: widget.initialValue);
    _focusNode.addListener(_handleFocusChange);
  }

  @override
  void dispose() {
    if (widget.controller == null) {
      _controller.dispose();
    }
    _focusNode
      ..removeListener(_handleFocusChange)
      ..dispose();
    super.dispose();
  }

  void _handleFocusChange() {
    setState(() {
      _isFocused = _focusNode.hasFocus;
    });
  }

  EdgeInsets _getPadding() {
    switch (widget.size) {
      case InputSize.sm:
        return Spacing.pxy(2, 3); // 8px vertical, 12px horizontal
      case InputSize.lg:
        return Spacing.pxy(4, 4); // 16px vertical, 16px horizontal
      case InputSize.md:
        return Spacing.pxy(3, 3); // 12px vertical, 14px horizontal
    }
  }

  TextStyle _getTextStyle(ThemeData theme) {
    TextStyle? style;
    switch (widget.size) {
      case InputSize.sm:
        style = AppTypography.textTheme.bodySmall;
      case InputSize.lg:
        style = AppTypography.textTheme.bodyLarge;
      case InputSize.md:
        style = AppTypography.textTheme.bodyMedium;
    }
    return style ?? AppTypography.baseStyle;
  }

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final TextStyle textStyle = _getTextStyle(theme);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        if (widget.label != null)
          Row(
            children: <Widget>[
              Text(
                widget.label!,
                style: AppTypography.textTheme.labelLarge?.copyWith(
                  color: widget.enabled
                      ? (_errorText != null
                          ? theme.colorScheme.error
                          : theme.colorScheme.onSurface)
                      : theme.disabledColor,
                ),
              ),
              if (widget.showInfoTooltip)
                Padding(
                  padding: Spacing.pl(1),
                  child: Icon(
                    Icons.info_outline,
                    size: textStyle.fontSize,
                    color: AppColors.labletestgrey,
                  ),
                ),
            ],
          ),
        SizedBox(height: Spacing.space(2)),
        Container(
          decoration: BoxDecoration(
            border: Border.all(
              color: _errorText != null
                  ? theme.colorScheme.error
                  : _isFocused
                      ? AppColors.primaryLight
                      : AppColors.borderfield
                          .withOpacity(widget.enabled ? 1 : 0.5),
              width: 1.5,
            ),
            borderRadius: BorderRadius.circular(6),
            color: widget.enabled
                ? theme.cardColor
                : AppColors.borderLight.withOpacity(0.1),
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              if (widget.prefix != null)
                Padding(
                  padding: Spacing.pl(3)
                      .copyWith(top: widget.size == InputSize.sm ? 8 : 12),
                  child: widget.prefix,
                ),
              Expanded(
                child: TextField(
                  controller: _controller,
                  focusNode: _focusNode,
                  enabled: widget.enabled,
                  obscureText: widget.obscureText,
                  maxLines: widget.maxLines,
                  minLines: widget.minLines,
                  textInputAction: widget.textInputAction,
                  keyboardType: widget.keyboardType, // Added keyboard type
                  decoration: InputDecoration(
                    hintText: widget.placeholder,
                    hintStyle: textStyle.copyWith(
                      color: AppColors.labletestgrey,
                    ),
                    contentPadding: _getPadding(),
                    border: InputBorder.none,
                    isDense: true,
                  ),
                  style: textStyle.copyWith(
                    color: widget.enabled
                        ? AppColors.labletestblack
                        : AppColors.labletestgrey,
                  ),
                  onChanged: (String value) {
                    if (widget.onChanged != null) {
                      widget.onChanged?.call(value);
                    }
                    if (widget.validator != null) {
                      setState(() {
                        _errorText = widget.validator!(value);
                      });
                    }
                  },
                ),
              ),
              if (widget.suffix != null)
                Padding(
                  padding: Spacing.pr(3)
                      .copyWith(top: widget.size == InputSize.sm ? 8 : 12),
                  child: widget.suffix,
                ),
            ],
          ),
        ),
        if (_errorText != null || widget.helperText != null)
          Padding(
            padding: Spacing.pt(2),
            child: Text(
              _errorText ?? widget.helperText ?? '',
              style: AppTypography.textTheme.labelLarge?.copyWith(
                color: AppColors.textWeak,
              ),
            ),
          ),
      ],
    );
  }
}
