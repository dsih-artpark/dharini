import 'package:design_system/design_system.dart';
import 'package:es_platform_mobile/utils/collection_plan_edit.dart';
import 'package:es_platform_mobile/views/sites/widgets/dropdown.dart';
import 'package:flutter/material.dart';

/// The collection plan fields, for a new plan and an edited one alike, as the
/// web's collection plan form has them: start date, frequency, days and a
/// duration in months. intervalController and frequencyController both hold
/// the interval the API expects (7 weekly, 0 one-time, ...).
class ScheduleCollectionWidget extends StatefulWidget {
  final TextEditingController intervalController;
  final TextEditingController frequencyController;
  final TextEditingController dayOfWeekController;
  final TextEditingController timeController;
  final TextEditingController durationController;

  /// The site's saved start date, when editing its plan. The form opens on it
  /// and keeps it even once it is more than a month back. A new plan opens on
  /// today.
  final DateTime? savedStartDate;

  final Function(
    int collectionFrequencyInterval,
    int collectionFrequency,
    List<String> collectionDayOfWeek,
    String collectionTime,
    int collectionDuration,
    DateTime collectionStartDate,
  ) onSubmit;

  const ScheduleCollectionWidget({
    Key? key,
    required this.intervalController,
    required this.frequencyController,
    required this.dayOfWeekController,
    required this.timeController,
    required this.durationController,
    required this.onSubmit,
    this.savedStartDate,
  }) : super(key: key);

  @override
  State<ScheduleCollectionWidget> createState() =>
      _ScheduleCollectionWidgetState();
}

class _ScheduleCollectionWidgetState extends State<ScheduleCollectionWidget> {
  final List<String> _daysOfWeek = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];

  // Frequency options — IDs are semantic strings, not magic numbers
  final List<CustomDropdownOption<String>> _frequencyOptions = [
    CustomDropdownOption<String>(id: 'once', label: 'Once'),
    CustomDropdownOption<String>(id: 'daily', label: 'Daily'),
    CustomDropdownOption<String>(id: 'weekly', label: 'Weekly'),
    CustomDropdownOption<String>(id: 'fortnightly', label: 'Fortnightly'),
    CustomDropdownOption<String>(id: 'monthly', label: 'Monthly'),
    CustomDropdownOption<String>(id: 'quarterly', label: 'Quarterly'),
  ];

  /// Maps a semantic frequency ID to the numeric interval the API expects.
  int _intervalForFrequency(String? freq) {
    switch (freq) {
      case 'once':
        return 0;
      case 'daily':
        return 1;
      case 'weekly':
        return 7;
      case 'fortnightly':
        return 14;
      case 'monthly':
        return 30;
      case 'quarterly':
        return 90;
      default:
        return 7;
    }
  }

  /// Reverse-maps an API interval number to a semantic frequency ID.
  String _frequencyForInterval(int? interval) {
    switch (interval) {
      case 0:
        return 'once';
      case 1:
        return 'daily';
      case 7:
        return 'weekly';
      case 14:
        return 'fortnightly';
      case 30:
        return 'monthly';
      case 90:
        return 'quarterly';
      default:
        return 'weekly';
    }
  }

  List<String> _selectedDays = [];
  TimeOfDay _selectedTime = TimeOfDay.now();
  String _selectedFrequency = 'weekly';
  late DateTime _selectedStartDate;

  bool get _isOnce => _selectedFrequency == 'once';

  // Once collects on its start date's day and Daily on every day, so their
  // days can't be picked.
  bool get _daysLocked => _isOnce || _selectedFrequency == 'daily';

  @override
  void initState() {
    super.initState();
    // Initialize selected days if any exist in controller
    if (widget.dayOfWeekController.text.isNotEmpty) {
      _selectedDays = widget.dayOfWeekController.text.split(', ');
    }

    // Initialize time if any exists in controller
    if (widget.timeController.text.isNotEmpty) {
      final timeParts = widget.timeController.text.split(':');
      if (timeParts.length >= 2) {
        _selectedTime = TimeOfDay(
          hour: int.tryParse(timeParts[0]) ?? 0,
          minute: int.tryParse(timeParts[1]) ?? 0,
        );
        widget.timeController.text = _formatTimeOfDay(_selectedTime);
      }
    } else {
      widget.timeController.text = _formatTimeOfDay(_selectedTime);
    }

    // A saved plan opens on its frequency, a new one on weekly. Both
    // controllers carry the interval, which the screens compare and send; a
    // saved one is left as it is until another frequency is picked.
    final savedInterval = int.tryParse(widget.intervalController.text);
    _selectedFrequency = _frequencyForInterval(savedInterval);
    if (savedInterval == null) {
      widget.intervalController.text =
          _intervalForFrequency(_selectedFrequency).toString();
    }
    widget.frequencyController.text = widget.intervalController.text;

    final today = DateTime.now();
    _selectedStartDate =
        widget.savedStartDate ?? DateTime(today.year, today.month, today.day);
  }

  String _formatTimeOfDay(TimeOfDay timeOfDay) {
    final hour = timeOfDay.hour.toString().padLeft(2, '0');
    final minute = timeOfDay.minute.toString().padLeft(2, '0');
    return '$hour:$minute:00';
  }

  void _notifyChange() {
    widget.onSubmit(
      _intervalForFrequency(_selectedFrequency),
      1, // collectionFrequency is always 1 (once per interval)
      List<String>.from(_selectedDays),
      widget.timeController.text,
      _isOnce ? 0 : (int.tryParse(widget.durationController.text) ?? 0),
      _selectedStartDate,
    );
  }

  void _updateSelectedDays(String day, bool? selected) {
    setState(() {
      _selectedDays = selected == true
          ? [..._selectedDays, day]
          : _selectedDays.where((d) => d != day).toList();
      widget.dayOfWeekController.text = _selectedDays.join(', ');
    });
    _notifyChange();
  }

  void _onFrequencyChanged(String? value) {
    if (value == null) return;
    setState(() {
      final hadFixedDays = _daysLocked;
      _selectedFrequency = value;
      final interval = _intervalForFrequency(value).toString();
      widget.intervalController.text = interval;
      widget.frequencyController.text = interval;

      if (_isOnce) {
        _selectedDays = [weekdayName(_selectedStartDate)];
        widget.durationController.text = '0';
      } else if (value == 'daily') {
        _selectedDays = List<String>.from(_daysOfWeek);
      } else if (hadFixedDays) {
        // As on the web, the days Once or Daily set are not carried over.
        _selectedDays = [];
      }
      widget.dayOfWeekController.text = _selectedDays.join(', ');
    });
    _notifyChange();
  }

  Future<void> _pickStartDate() async {
    final today = DateTime.now();
    final firstDate = earliestStartDate(today);
    final lastDate = today.add(const Duration(days: 365 * 5));
    // A saved start date more than a month back, or one picked before the
    // screen stayed open past midnight, falls outside the range;
    // showDatePicker asserts on it.
    final initialDate = _selectedStartDate.isBefore(firstDate)
        ? firstDate
        : _selectedStartDate.isAfter(lastDate)
            ? lastDate
            : _selectedStartDate;
    final DateTime? pickedDate = await showDatePicker(
      context: context,
      initialDate: initialDate,
      firstDate: firstDate,
      lastDate: lastDate,
    );
    if (pickedDate == null || isSameDay(pickedDate, _selectedStartDate)) {
      return;
    }

    setState(() {
      _selectedStartDate = pickedDate;
      if (_isOnce) {
        _selectedDays = [weekdayName(pickedDate)];
        widget.dayOfWeekController.text = _selectedDays.join(', ');
      }
    });
    _notifyChange();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Collection Start Date *",
              style: AppTypography.textTheme.labelLarge?.copyWith(
                color: Theme.of(context).colorScheme.onSurface,
              ),
            ),
            const SizedBox(height: 8),
            InkWell(
              onTap: _pickStartDate,
              child: Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey.shade300),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.calendar_today),
                    const SizedBox(width: 12),
                    Text(
                      '${_selectedStartDate.day.toString().padLeft(2, '0')}/${_selectedStartDate.month.toString().padLeft(2, '0')}/${_selectedStartDate.year}',
                      style: const TextStyle(fontSize: 16),
                    ),
                    const Spacer(),
                    const Icon(Icons.arrow_drop_down),
                  ],
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        CustomDropdown<String>(
          label: 'Collection Frequency',
          options: _frequencyOptions,
          value: _selectedFrequency,
          onChanged: _onFrequencyChanged,
          isLoading: false,
        ),
        const SizedBox(height: 16),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Select collection days",
              style: AppTypography.textTheme.labelLarge?.copyWith(
                color: Theme.of(context).colorScheme.onSurface,
              ),
            ),
            if (_selectedDays.isEmpty)
              const Text(
                "Please select at least one day",
                style: TextStyle(
                  color: AppColors.onErrorLight,
                ),
              ),
            const SizedBox(height: 8),
            Container(
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey.shade300),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                children: _daysOfWeek.map((day) {
                  return CheckboxListTile(
                    title: Text(
                        day.substring(0, 1).toUpperCase() + day.substring(1)),
                    value: _selectedDays.contains(day),
                    onChanged: _daysLocked
                        ? null
                        : (bool? selected) => _updateSelectedDays(day, selected),
                    controlAffinity: ListTileControlAffinity.trailing,
                    dense: true,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 8),
                  );
                }).toList(),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        AppTextField(
          label: "Duration",
          placeholder: "Enter duration in months.",
          controller: widget.durationController,
          keyboardType: TextInputType.number,
          enabled: !_isOnce,
          onChanged: (_) => _notifyChange(),
          suffix: const Icon(Icons.hourglass_bottom),
        ),
      ],
    );
  }
}
