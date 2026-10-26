import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/spacing.dart';

class NumberInput extends FormField<int> {
  NumberInput({
    required String label,
    super.key,
    String? description,
    String? error,
    super.initialValue = 0,
    bool stacked = true,
    ValueChanged<int?>? onChanged,
    int? minValue,
    int? maxValue,
    super.onSaved,
    super.validator,
    super.enabled = true,
    super.autovalidateMode,
    super.restorationId,
  }) : super(
          builder: (FormFieldState<int> field) {
            final _NumberInputFormFieldState state =
                field as _NumberInputFormFieldState;
            final bool hasError = field.hasError;
            final ThemeData theme = Theme.of(state.context);
            final ColorScheme colorScheme = theme.colorScheme;

            return Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: <Widget>[
                if (stacked) ...<Widget>[
                  // Stacked Layout
                  Text(
                    label,
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color:
                          hasError ? colorScheme.error : colorScheme.onSurface,
                    ),
                  ),
                  if (description != null)
                    Padding(
                      padding: Spacing.pt(1),
                      child: Text(
                        description,
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: colorScheme.onSurfaceVariant,
                        ),
                      ),
                    ),
                  const SizedBox(height: 8),
                  NumberInputRow(
                    value: state.value ?? 0,
                    onChanged: (int value) {
                      field.didChange(value);
                      onChanged?.call(value);
                    },
                    hasError: hasError,
                    enabled: enabled,
                    minValue: minValue,
                    maxValue: maxValue,
                  ),
                ] else ...<Widget>[
                  // Row Layout
                  Row(
                    children: <Widget>[
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: <Widget>[
                            Text(
                              label,
                              style: theme.textTheme.bodyMedium?.copyWith(
                                color: hasError
                                    ? colorScheme.error
                                    : colorScheme.onSurface,
                              ),
                            ),
                            if (description != null)
                              Text(
                                description,
                                style: theme.textTheme.bodySmall?.copyWith(
                                  color: colorScheme.onSurfaceVariant,
                                ),
                              ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 16),
                      NumberInputRow(
                        value: state.value ?? 0,
                        onChanged: (int value) {
                          field.didChange(value);
                          onChanged?.call(value);
                        },
                        hasError: hasError,
                        enabled: enabled,
                        minValue: minValue,
                        maxValue: maxValue,
                      ),
                    ],
                  ),
                ],
                if (hasError)
                  Padding(
                    padding: const EdgeInsets.only(top: 8),
                    child: Text(
                      error ?? field.errorText!,
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: colorScheme.error,
                      ),
                    ),
                  ),
              ],
            );
          },
        );

  @override
  FormFieldState<int> createState() => _NumberInputFormFieldState();
}

class _NumberInputFormFieldState extends FormFieldState<int> {
  @override
  NumberInput get widget => super.widget as NumberInput;
}

class NumberInputRow extends StatelessWidget {
  const NumberInputRow({
    required this.value,
    required this.onChanged,
    super.key,
    this.hasError = false,
    this.enabled = true,
    this.minValue,
    this.maxValue,
  });

  final int value;
  final ValueChanged<int> onChanged;
  final bool hasError;
  final bool enabled;
  final int? minValue;
  final int? maxValue;

  void _increment() {
    if (maxValue != null && value >= maxValue!) return;
    onChanged(value + 1);
  }

  void _decrement() {
    if (minValue != null && value <= minValue!) return;
    onChanged(value - 1);
  }

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;

    final Color iconBorderColor =
        hasError ? colorScheme.error : colorScheme.onSurfaceVariant;

    final Color fieldBorderColor =
        hasError ? colorScheme.error : colorScheme.outline;

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        // Decrement Button
        IconButton(
          onPressed: enabled ? _decrement : null,
          icon: const Icon(Icons.remove, size: 16),
          style: IconButton.styleFrom(
            shape: const CircleBorder(),
            side: BorderSide(color: iconBorderColor),
          ),
        ),
        // Number Display
        Container(
          width: Spacing.space(16),
          margin: Spacing.m(2),
          child: TextFormField(
            textAlign: TextAlign.center,
            controller: TextEditingController(text: value.toString()),
            enabled: enabled,
            keyboardType: TextInputType.number,
            inputFormatters: <TextInputFormatter>[
              FilteringTextInputFormatter.digitsOnly,
            ],
            decoration: InputDecoration(
              isDense: true,
              contentPadding: Spacing.pxy(2, 3),
              border: OutlineInputBorder(
                borderSide: BorderSide(color: fieldBorderColor),
              ),
              enabledBorder: OutlineInputBorder(
                borderSide: BorderSide(color: fieldBorderColor),
              ),
              errorBorder: OutlineInputBorder(
                borderSide: BorderSide(color: colorScheme.error),
              ),
            ),
            onChanged: (String value) {
              final int? newValue = int.tryParse(value);
              if (newValue != null) {
                if (minValue != null && newValue < minValue!) return;
                if (maxValue != null && newValue > maxValue!) return;
                onChanged(newValue);
              }
            },
          ),
        ),
        // Increment Button
        IconButton(
          onPressed: enabled ? _increment : null,
          icon: const Icon(Icons.add, size: 16),
          style: IconButton.styleFrom(
            shape: const CircleBorder(),
            side: BorderSide(color: iconBorderColor),
          ),
        ),
      ],
    );
  }
}
