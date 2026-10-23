import 'package:flutter/material.dart';
import '../theme/spacing.dart';

class DataTableColumn<T> {
  DataTableColumn({
    required this.label,
    this.builder,
    this.propertyName,
    this.numeric = false,
    this.width,
  }) : assert(
          builder != null || propertyName != null,
          'Either builder or propertyName must be provided',
        );
  final String label;
  final Widget Function(T item)? builder;
  final String? propertyName;
  final bool numeric;
  final double? width;
}

class CustomDataTable<T> extends StatelessWidget {
  const CustomDataTable({
    required this.columns,
    required this.data,
    super.key,
    this.currentPage,
    this.totalPages,
    this.onPageChanged,
    this.showPagination = true,
    this.rowsPerPage = 10,
  });
  final List<DataTableColumn<T>> columns;
  final List<T> data;
  final int? currentPage;
  final int? totalPages;
  final ValueChanged<int>? onPageChanged;
  final bool showPagination;
  final int rowsPerPage;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: ConstrainedBox(
            constraints: BoxConstraints(
              minWidth: MediaQuery.of(context).size.width,
            ),
            child: DataTable(
              headingRowColor: WidgetStateProperty.resolveWith(
                (Set<WidgetState> states) => theme.colorScheme.surface,
              ),
              dataRowMinHeight: Spacing.space(12),
              headingRowHeight: Spacing.space(12),
              horizontalMargin: Spacing.space(4),
              columnSpacing: Spacing.space(4),
              columns: columns
                  .map(
                    (DataTableColumn<T> column) => DataColumn(
                      label: Text(
                        column.label,
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: theme.colorScheme.onSurface,
                        ),
                      ),
                      numeric: column.numeric,
                    ),
                  )
                  .toList(),
              rows: data
                  .map(
                    (T item) => DataRow(
                      cells: columns.map((DataTableColumn<T> column) {
                        final dynamic cellContent =
                            column.builder?.call(item) ??
                                _getPropertyValue(item, column.propertyName!);

                        return DataCell(
                          DefaultTextStyle(
                            style: theme.textTheme.bodySmall!.copyWith(
                              color: theme.colorScheme.onSurface,
                            ),
                            child:
                             cellContent is Widget
                                ? cellContent
                                : 
                                Text('$cellContent'),
                          ),
                        );
                      }).toList(),
                    ),
                  )
                  .toList(),
            ),
          ),
        ),
        if (showPagination && totalPages != null && totalPages! > 1)
          Padding(
            padding: const EdgeInsets.only(top: 16),
            child: _TablePagination(
              currentPage: currentPage ?? 1,
              totalPages: totalPages!,
              onPageChanged: onPageChanged,
            ),
          ),
      ],
    );
  }

  dynamic _getPropertyValue(T item, String propertyName) {
    if (item is Map) {
      return item[propertyName];
    }
    // For class instances, you would need to implement reflection or
    // a custom way to access properties
    return '';
  }
}

class _TablePagination extends StatelessWidget {
  const _TablePagination({
    required this.currentPage,
    required this.totalPages,
    this.onPageChanged,
  });
  final int currentPage;
  final int totalPages;
  final ValueChanged<int>? onPageChanged;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);

    return Padding(
      padding: Spacing.pxy(4, 2),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: <Widget>[
          IconButton(
            icon: const Icon(Icons.chevron_left),
            onPressed: currentPage > 1
                ? () => onPageChanged?.call(currentPage - 1)
                : null,
          ),
          Text(
            'Page $currentPage of $totalPages',
            style: theme.textTheme.bodyMedium?.copyWith(
              color: theme.colorScheme.onSurface,
            ),
          ),
          IconButton(
            icon: const Icon(Icons.chevron_right),
            onPressed: currentPage < totalPages
                ? () => onPageChanged?.call(currentPage + 1)
                : null,
          ),
        ],
      ),
    );
  }
}

// Example usage:
/*
final columns = [
  DataTableColumn<Map>(
    label: 'Collector',
    propertyName: 'collector',
  ),
  DataTableColumn<Map>(
    label: 'Sites',
    builder: (item) => Text(
      item['sites'] ?? 'None',
      style: TextStyle(
        color: item['sites'] == null ? Colors.red : null,
      ),
    ),
  ),
  DataTableColumn<Map>(
    label: 'Date',
    propertyName: 'date',
  ),
];

final data = [
  {
    'collector': 'Anjaneya Nair',
    'sites': null,
    'date': '15 Jul \'24'
  },
  {
    'collector': 'Anjaneya Nair', 
    'sites': 4,
    'date': '15 Jul \'24'
  },
];

CustomDataTable<Map>(
  columns: columns,
  data: data,
  currentPage: 1,
  totalPages: 23,
  onPageChanged: (page) {
    // Handle page change
  },
)
*/
