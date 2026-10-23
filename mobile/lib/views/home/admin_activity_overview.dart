import 'package:design_system/design_system.dart';
import 'package:es_platform_mobile/hooks/auth.dart';
import 'package:es_platform_mobile/utils/extensions/index.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';

class AdminActivityOverview extends HookWidget {
  const AdminActivityOverview({Key? key}) : super(key: key);
  (DateTime, DateTime) _getDateRange(int index) {
    final now = DateTime.now();
    switch (index) {
      case 0: // This week
        final startOfWeek = now.subtract(Duration(days: now.weekday - 1));
        return (
          DateTime(startOfWeek.year, startOfWeek.month, startOfWeek.day),
          DateTime(now.year, now.month, startOfWeek.day + 6)
        );
      case 1: // This month
        return (
          DateTime(now.year, now.month, 1),
          DateTime(now.year, now.month + 1, 0)
        );
      case 2: // 3 Months
        return (
          DateTime(now.year, now.month - 2, 1), // Start at 1st of 2 months ago
          DateTime(now.year, now.month + 1, 0)
        );
      default:
        return (now, now);
    }
  }

  String _formatDate(DateTime date) {
    return '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    print('AdminActivityOverview build started');

    // Use state hook for selected index
    final selectedIndex = useState(0);
    final periods = ['This week', 'This month', '3 Months'];

    // Calculate date range based on selected index
    final (startDate, endDate) = _getDateRange(selectedIndex.value);
    final formattedStartDate = _formatDate(startDate);
    final formattedEndDate = _formatDate(endDate);
    print(
        'Date range calculated - Start: $formattedStartDate, End: $formattedEndDate');

    // Use visit summary hook
    print('Calling useVisitSummary hook');
    final visitSummaryDetails = useVisitSummary(
      startDate: startDate,
      endDate: endDate,
    );

    final visitSummary = visitSummaryDetails.data;

    print(
        'useVisitSummary hook response - isLoading: [34m${visitSummaryDetails.isLoading}[0m, isError: [34m${visitSummaryDetails.isError}[0m, data: [34m${visitSummaryDetails.data}[0m, error: [31m${visitSummaryDetails.error}[0m');

    // Add loading state
    if (visitSummaryDetails.isLoading) {
      print('Showing loading state');
      return const Center(
        child: CircularProgressIndicator(),
      );
    }

    // Show summary if data exists, even if isError is true
    if (visitSummary != null) {
      return Container(
        color: Colors.white,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Activity Overview Title
            Padding(
              padding: const EdgeInsets.only(left: 24, right: 24, top: 16),
              child: Text(
                'Activity Overview',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w600,
                  color: AppColors.actionButtonDark,
                ),
              ),
            ),

            // Time Period Tabs
            const SizedBox(height: 16),
            Container(
              height: 40,
              margin: const EdgeInsets.symmetric(horizontal: 24),
              decoration: BoxDecoration(
                color: Colors.grey.shade100,
                borderRadius: BorderRadius.circular(50),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: List.generate(periods.length, (index) {
                  final bool isSelected = selectedIndex.value == index;
                  return GestureDetector(
                    onTap: () {
                      print('Tab selected: $index');
                      selectedIndex.value = index;
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 8),
                      decoration: BoxDecoration(
                        color:
                            isSelected ? AppColors.white : Colors.transparent,
                        borderRadius: BorderRadius.circular(50),
                        border: Border.all(
                          color: isSelected
                              ? AppColors.primaryLight
                              : Colors.transparent,
                        ),
                      ),
                      child: Text(
                        periods[index],
                        style: TextStyle(
                          color: isSelected
                              ? AppColors.primaryLight
                              : Colors.black87,
                          fontSize: 14,
                          fontWeight:
                              isSelected ? FontWeight.w500 : FontWeight.normal,
                        ),
                      ),
                    ),
                  );
                }),
              ),
            ),

            // Your Visits Section
            const SizedBox(height: 24),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Text(
                'Your Visits',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  color: AppColors.labletestblack,
                ),
              ),
            ),
            const SizedBox(height: 16),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Row(
                children: [
                  Expanded(
                    child: _VisitCard(
                      icon: Icons.event_note,
                      title: 'PENDING',
                      value: '${visitSummary.pendingVisitsIndividual}',
                      color: AppColors.warningDark,
                      backgroundColor: Colors.amber.shade50,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: _VisitCard(
                      icon: Icons.check_circle_outline,
                      title: 'COMPLETED',
                      value: '${visitSummary.visitCount}',
                      color: AppColors.successDark,
                      backgroundColor: Colors.green.shade50,
                    ),
                  ),
                ],
              ),
            ),

            // Team's Visits Section
            const SizedBox(height: 24),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Text(
                'Team\'s Visits',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  color: AppColors.labletestblack,
                ),
              ),
            ),
            const SizedBox(height: 16),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Left side - metrics
                  Expanded(
                    flex: 1,
                    child: Column(
                      children: [
                        _TeamMetricCard(
                          color: AppColors.semanticsRed30,
                          value: '${visitSummary.overdueVisits}',
                          label: 'OVERDUE',
                        ),
                        const SizedBox(height: 8),
                        _TeamMetricCard(
                          color: AppColors.semanticsYellow20,
                          value: '${visitSummary.pendingVisits}',
                          label: 'PENDING',
                        ),
                        const SizedBox(height: 8),
                        _TeamMetricCard(
                          color: AppColors.semanticsGreen20,
                          value: '${visitSummary.completedVisits}',
                          label: 'COMPLETED',
                        ),
                      ],
                    ),
                  ),

                  // Right side - bar chart
                  Container(
                    width: 100,
                    height: 180,
                    margin: const EdgeInsets.only(left: 48, right: 48),
                    child: (visitSummary.overdueVisits == 0 &&
                            visitSummary.pendingVisits == 0 &&
                            visitSummary.completedVisits == 0)
                        ? Container(
                            decoration: BoxDecoration(
                              color: Colors.grey.shade200,
                              borderRadius: BorderRadius.circular(4),
                            ),
                          )
                        : Column(
                            children: [
                              Expanded(
                                flex: visitSummary.overdueVisits.toInt(),
                                child: Container(
                                  decoration: BoxDecoration(
                                    color: AppColors.semanticsRed20,
                                    borderRadius: BorderRadius.only(
                                      topLeft: Radius.circular(4),
                                      topRight: Radius.circular(4),
                                    ),
                                  ),
                                ),
                              ),
                              Expanded(
                                flex: visitSummary.pendingVisits.toInt(),
                                child: Container(
                                    color: AppColors.semanticsYellow20),
                              ),
                              Expanded(
                                flex: visitSummary.completedVisits.toInt(),
                                child: Container(
                                  decoration: BoxDecoration(
                                    color: AppColors.semanticsGreen20,
                                    borderRadius: BorderRadius.only(
                                      bottomLeft: Radius.circular(4),
                                      bottomRight: Radius.circular(4),
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                  ),
                ],
              ),
            ),

            // View Team Progress Button
            const SizedBox(height: 16),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Material(
                color: AppColors.blue10,
                borderRadius: BorderRadius.circular(4),
                child: InkWell(
                  onTap: () {
                    context.push("/team");
                  },
                  borderRadius: BorderRadius.circular(4),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 16, vertical: 12),
                    child: Row(
                      mainAxisSize: MainAxisSize.max,
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Icon(
                              Icons.people,
                              color: AppColors.textBrand,
                              size: 16,
                            ),
                            const SizedBox(width: 8),
                            const Text(
                              'VIEW TEAM PROGRESS',
                              style: TextStyle(
                                color: AppColors.textBrand,
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                        Icon(
                          Icons.arrow_forward_ios,
                          color: AppColors.textBrand,
                          size: 16,
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      );
    }

    // Add error state (only if data is null and isError is true)
    if (visitSummaryDetails.isError) {
      print(
          'Showing error state: [31m[1m${visitSummaryDetails.error}[0m, data is null');
      return const Center(
        child: Text('Failed to load visit summary'),
      );
    }

    // Fallback (should not be reached)
    print('Fallback: No data, not loading, not error.');
    return Container();
  }
}

class _VisitCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String value;
  final Color color;
  final Color backgroundColor;

  const _VisitCard({
    required this.icon,
    required this.title,
    required this.value,
    required this.color,
    required this.backgroundColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              // ignore: deprecated_member_use
              color: Colors.white.withOpacity(0.5),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(
              icon,
              color: color,
              size: 24,
            ),
          ),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                value,
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: color,
                ),
              ),
              Text(
                title,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: color,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _TeamMetricCard extends StatelessWidget {
  final Color color;
  final String value;
  final String label;

  const _TeamMetricCard({
    required this.color,
    required this.value,
    required this.label,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey.shade200),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          Container(
            width: 10,
            height: 10,
            decoration: BoxDecoration(
              color: color,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 12),
          Text(
            value,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: Colors.black87,
            ),
          ),
          const SizedBox(width: 12),
          Text(
            label,
            style: TextStyle(
              fontSize: 14,
              color: Colors.black54,
            ),
          ),
        ],
      ),
    );
  }
}
