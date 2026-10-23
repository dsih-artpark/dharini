import 'package:design_system/design_system.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';

class Collector {
  final String id;
  final String name;
  final String initials;
  final Color color;

  Collector(
      {required this.id,
      required this.name,
      required this.initials,
      required this.color});
}

class AssigningCollectorsWidget extends HookWidget {
  final Function(List<Collector>) onCollectorsChanged;

  const AssigningCollectorsWidget({
    Key? key,
    required this.onCollectorsChanged,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final selectedCollectors = useState<List<Collector>>([]);
    // Use a state for the dropdown value
    final dropdownValue = useState<String?>(null);

    // Sample collectors - in real app, these would come from API
    final availableCollectors = useMemoized(() => [
          Collector(
              id: "1",
              name: "Siddarth P",
              initials: "SP",
              color: Colors.amber.shade200),
          Collector(
              id: "2",
              name: "Ria Gupta",
              initials: "RG",
              color: Colors.pink.shade100),
          Collector(
              id: "3",
              name: "Anushka Gokhale",
              initials: "AS",
              color: Colors.purple.shade100),
          Collector(
              id: "4",
              name: "Vikram Singh",
              initials: "VS",
              color: Colors.green.shade100),
          Collector(
              id: "5",
              name: "Rahul Kumar",
              initials: "RK",
              color: Colors.blue.shade100),
        ]);

    // Calculate available options (exclude already selected collectors)
    final availableOptions = useMemoized(() {
      return availableCollectors
          .where((collector) => !selectedCollectors.value
              .any((selected) => selected.id == collector.id))
          .toList();
    }, [selectedCollectors.value]);

    // Handle adding a collector
    void addCollector(String id) {
      final collector = availableCollectors.firstWhere((c) => c.id == id);
      selectedCollectors.value = [...selectedCollectors.value, collector];
      onCollectorsChanged(selectedCollectors.value);
      // Reset dropdown value after selection
      dropdownValue.value = null;
    }

    // Handle removing a collector
    void removeCollector(Collector collector) {
      selectedCollectors.value = selectedCollectors.value
          .where((item) => item.id != collector.id)
          .toList();
      onCollectorsChanged(selectedCollectors.value);
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Collector Name',
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: AppColors.labletestblack,
              ),
        ),
        const SizedBox(height: 8),

        // Dropdown for collector selection
        DropdownButtonFormField<String>(
          decoration: InputDecoration(
            hintText: 'Select Collectors',
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(color: Colors.grey.shade300),
            ),
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          ),
          icon: const Icon(Icons.keyboard_arrow_down),
          value: dropdownValue.value, // Use the state variable here
          items: availableOptions.isEmpty
              ? null // Set items to null if availableOptions is empty
              : availableOptions.map((collector) {
                  return DropdownMenuItem<String>(
                    value: collector.id,
                    child: Text(collector.name),
                  );
                }).toList(),
          onChanged: availableOptions.isEmpty
              ? null // Disable onChanged if no options available
              : (String? value) {
                  if (value != null) {
                    dropdownValue.value = value; // Update the state
                    addCollector(value);
                  }
                },
          // Show disabled state if no options are available
          disabledHint: availableOptions.isEmpty
              ? const Text('No collectors available')
              : null,
        ),

        const SizedBox(height: 16),

        // Display selected collectors as chips
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: selectedCollectors.value.map((collector) {
            return Container(
              decoration: BoxDecoration(
                color: collector.color,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.grey.shade300),
              ),
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  CircleAvatar(
                    radius: 16,
                    backgroundColor: Colors.white,
                    child: Text(
                      collector.initials,
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(collector.name),
                  const SizedBox(width: 8),
                  InkWell(
                    onTap: () => removeCollector(collector),
                    child: const Icon(
                      Icons.close,
                      size: 16,
                    ),
                  ),
                ],
              ),
            );
          }).toList(),
        ),
      ],
    );
  }
}
