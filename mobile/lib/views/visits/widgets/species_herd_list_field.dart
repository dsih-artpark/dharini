import 'package:design_system/design_system.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:es_platform_mobile/views/sites/widgets/dropdown.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:es_platform_mobile/hooks/species.dart';
import 'package:es_platform_mobile/utils/species_filter.dart';
import 'package:es_client/es_client.dart';

class SpeciesHerdListWidget extends StatefulHookWidget {
  final List<Map<String, dynamic>>? value;
  final ValueChanged<List<Map<String, dynamic>>> onChanged;
  final String? disease;

  const SpeciesHerdListWidget({
    Key? key,
    this.value,
    required this.onChanged,
    this.disease,
  }) : super(key: key);

  @override
  State<SpeciesHerdListWidget> createState() => _SpeciesHerdListWidgetState();
}

class _SpeciesHerdListWidgetState extends State<SpeciesHerdListWidget> {
  late List<Map<String, dynamic>> _list;

  String get _sizeLabel => widget.disease == 'AI' ? 'Flock Size' : 'Herd Size';
  String get _titleLabel =>
      widget.disease == 'AI' ? 'Species & Flock Size' : 'Species & Herd Size';

  List<CustomDropdownOption<String>> _getSpeciesOptions(
      List<SpeciesResponseData> speciesList) {
    if (speciesList.isEmpty) return [];

    final options = filterSpeciesByDisease(speciesList, widget.disease)
        .map((s) => CustomDropdownOption<String>(id: s.id, label: s.name))
        .toList();

    // Always add 'Other'
    options
        .add(const CustomDropdownOption<String>(id: 'Other', label: 'Other'));
    return options;
  }

  @override
  void initState() {
    super.initState();
    _list = widget.value != null
        ? List.from(widget.value!.map((e) => Map<String, dynamic>.from(e)))
        : [];
    if (_list.isEmpty) {
      _list.add({'species': null, 'herdSize': null, 'otherSpecies': null});
    }
  }

  @override
  void didUpdateWidget(covariant SpeciesHerdListWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.value != oldWidget.value) {
      setState(() {
        _list = widget.value != null
            ? List.from(widget.value!.map((e) => Map<String, dynamic>.from(e)))
            : [];
        if (_list.isEmpty) {
          _list.add({'species': null, 'herdSize': null, 'otherSpecies': null});
        }
      });
    }
  }

  void _notifyChange() {
    widget.onChanged(List.from(_list.map((e) => Map<String, dynamic>.from(e))));
  }

  @override
  Widget build(BuildContext context) {
    final speciesQuery = useSpecies();
    final speciesOptions = _getSpeciesOptions(speciesQuery.data ?? []);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          _titleLabel,
          style: AppTypography.textTheme.bodyB2Medium.copyWith(
            color: AppColors.textStrong,
          ),
        ),
        const SizedBox(height: 8),
        ..._list.asMap().entries.map((entry) {
          final index = entry.key;
          final item = entry.value;

          return Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              border: Border.all(color: AppColors.strokeMedium),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    if (_list.length > 1)
                      IconButton(
                        icon: const Icon(Icons.delete_outline,
                            color: AppColors.semanticsRed30),
                        constraints: const BoxConstraints(),
                        padding: EdgeInsets.zero,
                        onPressed: () {
                          setState(() {
                            _list.removeAt(index);
                          });
                          _notifyChange();
                        },
                      ),
                  ],
                ),
                const SizedBox(height: 8),
                CustomDropdown<String>(
                  label: 'Species',
                  value: item['species'] as String?,
                  options: speciesOptions,
                  isLoading: speciesQuery.isLoading,
                  onChanged: (val) {
                    setState(() {
                      item['species'] = val;
                      if (val != 'Other') {
                        item.remove('otherSpecies');
                      }
                    });
                    _notifyChange();
                  },
                ),
                if (item['species'] == 'Other') ...[
                  const SizedBox(height: 8),
                  Text(
                    'Specify Other Species',
                    style: AppTypography.textTheme.bodyB3Medium
                        .copyWith(color: AppColors.textStrong),
                  ),
                  const SizedBox(height: 4),
                  TextFormField(
                    initialValue: item['otherSpecies'] as String? ?? '',
                    onChanged: (val) {
                      item['otherSpecies'] = val;
                      _notifyChange();
                    },
                    decoration: const InputDecoration(
                      border: OutlineInputBorder(),
                      isDense: true,
                    ),
                  ),
                ],
                const SizedBox(height: 8),
                Text(
                  _sizeLabel,
                  style: AppTypography.textTheme.bodyB3Medium
                      .copyWith(color: AppColors.textStrong),
                ),
                const SizedBox(height: 4),
                TextFormField(
                  initialValue: item['herdSize']?.toString() ?? '',
                  keyboardType: TextInputType.number,
                  inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                  onChanged: (val) {
                    item['herdSize'] = int.tryParse(val);
                    _notifyChange();
                  },
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    isDense: true,
                  ),
                ),
              ],
            ),
          );
        }).toList(),
        OutlinedButton.icon(
          onPressed: () {
            setState(() {
              _list.add({'species': null, 'herdSize': null});
            });
            _notifyChange();
          },
          icon: const Icon(Icons.add, size: 18),
          label: const Text('Add Another Species'),
          style: OutlinedButton.styleFrom(
            foregroundColor: AppColors.primaryLight,
            side: const BorderSide(color: AppColors.primaryLight),
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          ),
        ),
      ],
    );
  }
}
