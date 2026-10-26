// sample_type_selector_widget.dart
import 'dart:math';

import 'package:flutter/material.dart';

import '../../design_system.dart';

class SampleTypeSelectorWidget extends StatefulWidget {
  const SampleTypeSelectorWidget({
    required this.sampleType,
    required this.initialValue,
    required this.onValueChanged,
    super.key,
  });
  final String sampleType;
  final int initialValue;
  final ValueChanged<int> onValueChanged;

  @override
  SampleTypeSelectorWidgetState createState() =>
      SampleTypeSelectorWidgetState();
}

class SampleTypeSelectorWidgetState extends State<SampleTypeSelectorWidget> {
  late int _selectedValue;

  @override
  void initState() {
    super.initState();
    _selectedValue = widget.initialValue;
    //widget.onValueChanged(_selectedValue);
  }

  @override
  Widget build(BuildContext context) => SizedBox(
        height: 100,
        child: Center(
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget>[
              Text(
                widget.sampleType,
                style: AppTypography.textTheme.bodyB2Medium.copyWith(
                  color: AppColors.greyTextPrimary,
                ),
              ),
              Row(
                children: <Widget>[
                  Container(
                    height: 24,
                    width: 24,
                    decoration: BoxDecoration(
                      border: Border.all(color: AppColors.backgroundDark),
                      shape: BoxShape.circle,
                    ),
                    child: InkWell(
                      child: const Icon(
                        Icons.remove,
                        size: 24,
                      ),
                      onTap: () {
                        setState(() {
                          _selectedValue = max(_selectedValue - 1, 0);
                          widget.onValueChanged(_selectedValue);
                        });
                      },
                    ),
                  ),
                  SizedBox(
                    width: Spacing.space(2),
                  ),
                  Container(
                    height: 30,
                    width: 60,
                    decoration: BoxDecoration(
                      border:
                          Border.all(color: AppColors.inputFieldStrokeDefault),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Center(
                      child: Text(
                        '$_selectedValue',
                        style: AppTypography.textTheme.bodyB3Regular.copyWith(
                          color: AppColors.textLabelInput,
                        ),
                      ),
                    ),
                  ),
                  SizedBox(
                    width: Spacing.space(2),
                  ),
                  Container(
                    height: 24,
                    width: 24,
                    decoration: BoxDecoration(
                      border: Border.all(color: AppColors.backgroundDark),
                      shape: BoxShape.circle,
                    ),
                    child: Center(
                      child: InkWell(
                        child: const Icon(
                          Icons.add,
                          size: 24,
                        ),
                        onTap: () {
                          setState(() {
                            _selectedValue++;
                            widget.onValueChanged(_selectedValue);
                          });
                        },
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      );
}
