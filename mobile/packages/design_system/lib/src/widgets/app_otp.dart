import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/spacing.dart';

class OtpInput extends StatefulWidget {
  const OtpInput({
    super.key,
    this.length = 6,
    this.onChanged,
    this.onCompleted,
    this.digitsOnly = true,
    this.focusNode,
    this.enabled = true,
    this.textEditingControllers,
    this.errorText,
    this.obscureText = false,
    this.boxSize = 48,
    this.spacing = 8,
    this.textStyle,
    this.autofocus = false,
    this.showCursor = true,
  }) : assert(
          length > 0,
          'OTP length must be greater than 0. You provided: $length',
        );

  /// The number of OTP fields. Defaults to 6.
  final int length;

  /// Called when the OTP input value changes.
  final ValueChanged<String>? onChanged;

  /// Called when all OTP fields are filled.
  final ValueChanged<String>? onCompleted;

  /// Whether to only allow digits. Defaults to true.
  final bool digitsOnly;

  /// The focus node for this input.
  final FocusNode? focusNode;

  /// Whether this input is enabled. Defaults to true.
  final bool enabled;

  /// Optional controllers for each input field.
  final List<TextEditingController>? textEditingControllers;

  /// Error text to display.
  final String? errorText;

  /// Whether to obscure the input text. Defaults to false.
  final bool obscureText;

  /// Size of each OTP box. Defaults to 48.
  final double boxSize;

  /// Spacing between boxes. Defaults to 8.
  final double spacing;

  /// Text style for the input.
  final TextStyle? textStyle;

  /// Whether to autofocus this input. Defaults to false.
  final bool autofocus;

  /// Whether to show cursor. Defaults to true.
  final bool showCursor;

  @override
  State<OtpInput> createState() => _OtpInputState();
}

class _OtpInputState extends State<OtpInput> {
  late List<FocusNode> focusNodes;
  late List<TextEditingController> controllers;
  FocusNode? _focusNode;

  FocusNode get mainFocusNode => widget.focusNode ?? _focusNode!;
  bool hasFocus = false;
  int currentIndex = 0;

  @override
  void initState() {
    super.initState();
    if (widget.focusNode == null) {
      _focusNode = FocusNode();
    }
    _initializeNodes();
    mainFocusNode.addListener(_onFocusChange);
  }

  void _initializeNodes() {
    focusNodes =
        List<FocusNode>.generate(widget.length, (int index) => FocusNode());
    if (widget.textEditingControllers != null) {
      controllers = widget.textEditingControllers!;
    } else {
      controllers = List<TextEditingController>.generate(
        widget.length,
        (_) => TextEditingController(),
      );
    }

    for (int i = 0; i < widget.length; i++) {
      focusNodes[i].addListener(() {
        setState(() {});
      });
    }
  }

  void _onFocusChange() {
    setState(() {
      hasFocus = mainFocusNode.hasFocus;
      if (hasFocus && focusNodes.every((FocusNode node) => !node.hasFocus)) {
        focusNodes[currentIndex].requestFocus();
      }
    });
  }

  @override
  void dispose() {
    if (widget.textEditingControllers == null) {
      for (final TextEditingController controller in controllers) {
        controller.dispose();
      }
    }
    for (final FocusNode node in focusNodes) {
      node.dispose();
    }
    _focusNode?.dispose();
    mainFocusNode.removeListener(_onFocusChange);
    super.dispose();
  }

  void _onChanged() {
    if (widget.onChanged != null) {
      widget.onChanged
          ?.call(controllers.map((TextEditingController c) => c.text).join());
    }
    final int filledBoxes = controllers
        .where((TextEditingController c) => c.text.isNotEmpty)
        .length;
    if (filledBoxes == widget.length && widget.onCompleted != null) {
      widget.onCompleted
          ?.call(controllers.map((TextEditingController c) => c.text).join());
    }
  }

  void _handleInput(String value, int index) {
    if (value.isEmpty) {
      if (index > 0) {
        focusNodes[index - 1].requestFocus();
        currentIndex = index - 1;
      }
    } else {
      if (index < widget.length - 1) {
        focusNodes[index + 1].requestFocus();
        currentIndex = index + 1;
      }
    }
    _onChanged();
  }

  @override
  Widget build(BuildContext context) {
    final ColorScheme colorScheme = Theme.of(context).colorScheme;
    final TextTheme textTheme = Theme.of(context).textTheme;

    final TextStyle? effectiveTextStyle = widget.textStyle ??
        textTheme.bodyLarge?.copyWith(
          fontWeight: FontWeight.w500,
        );

    return Focus(
      focusNode: mainFocusNode,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: List<Widget>.generate(
          widget.length * 2 - 1,
          (int index) {
            if (index.isOdd) {
              return SizedBox(width: Spacing.space(2));
            }
            final int boxIndex = index ~/ 2;
            final bool hasError = widget.errorText != null;

            return SizedBox(
              width: Spacing.space(12),
              height: Spacing.space(12),
              child: TextFormField(
                controller: controllers[boxIndex],
                focusNode: focusNodes[boxIndex],
                textAlign: TextAlign.center,
                style: effectiveTextStyle,
                keyboardType: widget.digitsOnly ? TextInputType.number : null,
                inputFormatters: <TextInputFormatter>[
                  LengthLimitingTextInputFormatter(1),
                  if (widget.digitsOnly) FilteringTextInputFormatter.digitsOnly,
                ],
                obscureText: widget.obscureText,
                decoration: InputDecoration(
                  filled: true,
                  fillColor: colorScheme.surface,
                  contentPadding: EdgeInsets.zero,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(Spacing.space(2)),
                    borderSide: BorderSide(
                      color: hasError ? colorScheme.error : colorScheme.outline,
                    ),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: BorderSide(
                      color: hasError ? colorScheme.error : colorScheme.outline,
                    ),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: BorderSide(
                      color: hasError ? colorScheme.error : colorScheme.primary,
                      width: 2,
                    ),
                  ),
                  errorBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: BorderSide(
                      color: colorScheme.error,
                    ),
                  ),
                  focusedErrorBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: BorderSide(
                      color: colorScheme.error,
                      width: 2,
                    ),
                  ),
                ),
                enabled: widget.enabled,
                autofocus: widget.autofocus && boxIndex == 0,
                showCursor: widget.showCursor,
                onChanged: (String value) => _handleInput(value, boxIndex),
              ),
            );
          },
        ),
      ),
    );
  }
}
