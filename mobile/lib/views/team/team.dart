// ignore_for_file: unnecessary_null_comparison

import 'package:built_collection/built_collection.dart'; // Add import for BuiltList
import 'package:design_system/design_system.dart';
import 'package:es_client/es_client.dart';
import 'package:es_platform_mobile/domain/permissions.dart';
import 'package:es_platform_mobile/hooks/auth.dart';
import 'package:es_platform_mobile/hooks/permissions.dart';
import 'package:es_platform_mobile/utils/extensions/index.dart';
import 'package:es_platform_mobile/utils/tenant_roles.dart';
import 'package:es_platform_mobile/views/team/teams_progress_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:intl/intl.dart';

// import 'add_new_member_screen.dart';

class TeamProgressScreen extends HookWidget {
  TeamProgressScreen({super.key});

  // Helper function to calculate start of the week (assuming Monday is start)
  DateTime _startOfWeek(DateTime date) {
    // Adjust to handle Sunday correctly if needed
    int daysToSubtract = date.weekday - DateTime.monday;
    if (daysToSubtract < 0) {
      daysToSubtract += 7;
    }
    return date.subtract(Duration(days: daysToSubtract));
  }

  // Helper to get date range based on selected period string
  (DateTime?, DateTime?) _getDateRangeForPeriod(String period) {
    final now = DateTime.now();
    switch (period) {
      case 'This week':
        final startOfWeek = _startOfWeek(now);
        return (
          startOfWeek,
          startOfWeek.add(const Duration(days: 6)),
        );
      case 'This month':
        return (
          DateTime(now.year, now.month, 1),
          DateTime(now.year, now.month + 1, 0), // Last day of current month
        );
      case '3 Months':
        // Assuming "3 Months" means the current month and the previous two
        return (
          DateTime(now.year, now.month - 2, 1), // First day of 2 months ago
          DateTime(now.year, now.month + 1, 0), // Last day of current month
        );
      default:
        return (null, null); // Handle unknown period or default case
    }
  }

  // Helper function to show the bottom sheet
  void _showManageMembersBottomSheet(
    BuildContext context,
    ValueNotifier<bool> isDeleteMode,
    ValueNotifier<Set<String>> selectedMemberIds,
  ) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16.0)),
      ),
      builder: (BuildContext bc) {
        return Padding(
          padding: EdgeInsets.fromLTRB(
            20,
            20,
            20,
            20 + MediaQuery.of(bc).padding.bottom,
          ),
          child: Wrap(
            // Use Wrap for simple vertical list
            children: <Widget>[
              // Hidden while the contacts invite is disabled; Add New Member
              // has no other way to pick people (see add_new_member_screen.dart).
              // ListTile(
              //   leading: const Icon(Icons.person_add_outlined,
              //       color: AppColors.textStrong),
              //   title: Text(
              //     'Add New Member',
              //     style: AppTypography.textTheme.bodyB2Regular
              //         .copyWith(color: AppColors.textStrong),
              //   ),
              //   onTap: () {
              //     Navigator.pop(context); // Close the bottom sheet first
              //     // Navigate to the new screen
              //     Navigator.push(
              //       context,
              //       MaterialPageRoute(
              //           builder: (context) => const AddNewMemberScreen()),
              //     );
              //     print('Add New Member tapped - Navigating...');
              //   },
              // ),
              // const Divider(
              //     height: 1, thickness: 1, color: AppColors.strokeWeak),
              ListTile(
                leading: const Icon(Icons.delete_outline,
                    color: AppColors.textStrong),
                title: Text(
                  'Remove Members',
                  style: AppTypography.textTheme.bodyB2Regular
                      .copyWith(color: AppColors.textStrong),
                ),
                onTap: () {
                  Navigator.pop(context);
                  isDeleteMode.value = true;
                  selectedMemberIds.value = {};
                },
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    // Use hooks directly in build method
    final tabController = useTabController(initialLength: 2);
    final selectedPeriod =
        useState('This month'); // State for Overview dropdown
    final currentWeekStartDate =
        useState(_startOfWeek(DateTime.now())); // State for weekly tracker

    // Use state for expansion map
    final expansionState = useState<Map<String, bool>>({});

    // --- Data Fetching Hooks ---
    final profile = useProfile();
    final projectId = useCurrentProjectId();
    final teamId = teamIdForProject(profile.data, projectId); // per-project team

    final manager = usePermissionManager();
    final canViewTeamMembers = manager.can(UserAction.Read, Subject.Team,
        resourceProjectId: projectId, resourceTeamId: teamId);

    final canAddTeamMembers = manager.can(UserAction.Create, Subject.TeamMember,
        resourceProjectId: projectId, resourceTeamId: teamId);

    // Calculate overview dates based on selectedPeriod
    final (overviewStartDate, overviewEndDate) =
        _getDateRangeForPeriod(selectedPeriod.value);

    // Overview Data
    final teamProgressOverview = useTeamProgressActivityOverview(
      teamId: teamId ?? '',
      startDate: overviewStartDate,
      endDate: overviewEndDate,
    );

    // Weekly Activity Data (using visitSummary)
    final visitSummary = useVisitSummary(
      startDate: currentWeekStartDate.value,
      endDate: currentWeekStartDate.value.add(const Duration(days: 6)),
    );

    // Team Member Activity Data
    final teamMemberActivity = useTeamMemberActivity(
      teamId: teamId ?? '',
      // Use the same dates as the overview section
      startDate: overviewStartDate,
      endDate: overviewEndDate,
    );

    // Hook for Manage tab data
    final teamMembersFieldView = useTeamMembersFieldView(
      teamId: teamId ?? '',
    );

    // --- Loading State ---
    if (profile.isLoading ||
        (teamId != null &&
            (teamProgressOverview.isLoading ||
                visitSummary.isLoading ||
                teamMemberActivity.isLoading ||
                teamMembersFieldView.isLoading))) {
      return Scaffold(
        appBar: AppBar(
          title: Text(
            'Team Progress',
            style: AppTypography.textTheme.bodyB1SemiBold
                .copyWith(color: AppColors.textStrong),
          ),
          backgroundColor: Colors.white,
          elevation: 0,
          actions: [
            IconButton(
              icon: const Icon(Icons.settings_outlined),
              onPressed: () {},
            ),
          ],
        ),
        body: const Center(child: CircularProgressIndicator()),
      );
    }
    // --- End Loading State ---

    // --- Error State ---
    if (profile.isError ||
        (teamId != null &&
            (teamProgressOverview.isError ||
                visitSummary.isError ||
                teamMemberActivity.isError ||
                teamMembersFieldView.isError))) {
      return Scaffold(
        appBar: AppBar(
            title: Text(
              'Team Progress',
              style: AppTypography.textTheme.bodyB1SemiBold
                  .copyWith(color: AppColors.textStrong),
            ),
            backgroundColor: Colors.white,
            elevation: 0),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text('Error loading team data.'),
              ElevatedButton(
                onPressed: () {
                  profile.refetch();
                  if (teamId != null) {
                    teamProgressOverview.refetch();
                    visitSummary.refetch();
                    teamMemberActivity.refetch();
                    teamMembersFieldView.refetch();
                  }
                },
                child: const Text('Retry'),
              )
            ],
          ),
        ),
      );
    }
    // --- End Error State ---

    // Initialize expansion state if empty and data is available
    useEffect(() {
      final members = teamMemberActivity.data?.data; // Correct access
      if (members != null && expansionState.value.isEmpty) {
        final initialExpansionState = <String, bool>{};
        for (var member in members) {
          // Use correct member type: TeamMemberActivityMemberData
          initialExpansionState[member.id] = false;
        }
        // Check if the component is still mounted before updating state
        if (context.mounted) {
          expansionState.value = initialExpansionState;
        }
      }
      return null; // No cleanup needed
    }, [teamMemberActivity.data]); // Rerun effect when data changes
    final isDeleteMode = useState(false);
    final selectedMemberIds = useState<Set<String>>({});
    // --- Main Scaffold ---
    return Scaffold(
      backgroundColor: AppColors.white, // Use design system background
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.textStrong),
          onPressed: () => context.go('/'),
        ),
        title: Text(
          'Team Progress',
          style: AppTypography.textTheme.bodyB1SemiBold
              .copyWith(color: AppColors.textStrong),
        ),
        centerTitle: true,
        actions: [
          if (canAddTeamMembers)
            IconButton(
              icon: const Icon(Icons.settings_outlined,
                  color: AppColors.textStrong), // Added settings icon
              onPressed: () {
                // Call the helper function to show the bottom sheet
                _showManageMembersBottomSheet(
                    context, isDeleteMode, selectedMemberIds);
              },
            ),
        ],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(48),
          child: TabBar(
            controller: tabController,
            tabs: const <Widget>[
              Tab(
                child: Text(
                  'Activity', // Updated tab text
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                ),
              ),
              Tab(
                child: Text(
                  'Manage', // Updated tab text
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                ),
              ),
            ],
            labelColor: AppColors.primaryLight, // Copied from visits.dart
            unselectedLabelColor:
                AppColors.labletestgrey, // Copied from visits.dart
            indicatorColor: AppColors.primaryLight, // Copied from visits.dart
            indicatorSize: TabBarIndicatorSize.tab, // Copied from visits.dart
            labelStyle: const TextStyle(
                fontSize: 14, fontWeight: FontWeight.w600), // Copied
            unselectedLabelStyle: const TextStyle(
                fontSize: 14, fontWeight: FontWeight.w500), // Copied
          ),
        ),
      ),
      body: TabBarView(
        controller: tabController,
        children: [
          _buildActivityTab(
            context,
            selectedPeriod,
            currentWeekStartDate,
            expansionState, // Pass expansion state
            teamProgressOverview.data,
            visitSummary.data,
            teamMemberActivity.data,
          ),
          if (canViewTeamMembers)
            _buildManageTab(context, teamMembersFieldView.data, isDeleteMode,
                selectedMemberIds),
        ],
      ),
      // Removed bottom navigation bar as it's handled by AppShell
    );
  }

  // --- Build Methods for Tabs and Sections ---

  Widget _buildActivityTab(
    BuildContext context,
    ValueNotifier<String> selectedPeriod,
    ValueNotifier<DateTime> currentWeekStartDate,
    ValueNotifier<Map<String, bool>> expansionState, // Receive expansion state
    TeamProgressActivityOverviewResponseData? overviewData,
    VisitSummaryResponseData? visitSummaryData,
    TeamMemberActivityResponse? teamMemberActivityData,
  ) {
    // Format for date range display
    final DateFormat rangeFormatter = DateFormat('MMM d');
    final String dateRange =
        '${rangeFormatter.format(currentWeekStartDate.value)} - ${rangeFormatter.format(currentWeekStartDate.value.add(const Duration(days: 6)))}';

    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 16.0), // Vertical padding
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Overview Section
            Padding(
              padding: const EdgeInsets.symmetric(
                  horizontal: 16.0), // Horizontal padding
              child: _buildOverviewSectionHeader(context, selectedPeriod),
            ),
            const SizedBox(height: 12),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: _buildOverviewSection(context, overviewData),
            ),
            const SizedBox(height: 24),

            // Track Weekly Activity Section
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Text(
                'Track Weekly Activity',
                style:
                    AppTypography.textTheme.headingH3 // Match screenshot style
                        .copyWith(color: AppColors.textStrong),
              ),
            ),
            const SizedBox(height: 16),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: _buildWeeklyActivitySection(
                  context, visitSummaryData, currentWeekStartDate, dateRange),
            ),
            const SizedBox(height: 24),

            // Team Activity Section Header (Filter/Sort)
            _buildTeamActivityHeader(context), // Use helper for header
            const SizedBox(height: 0), // Reduce space before list

            // Team Activity List
            _buildTeamActivitySection(context, teamMemberActivityData,
                expansionState), // Pass expansion state

            const SizedBox(height: 24), // Padding at the bottom
          ],
        ),
      ),
    );
  }

  // --- Section Header Builders ---
  Widget _buildOverviewSectionHeader(
      BuildContext context, ValueNotifier<String> selectedPeriod) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          'Overview',
          style: AppTypography.textTheme.headingH3 // Match screenshot style
              .copyWith(color: AppColors.textStrong),
        ),
        // Placeholder Dropdown
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16), // Rounded corners
            border: Border.all(color: AppColors.strokeWeak),
          ),
          child: DropdownButtonHideUnderline(
            child: DropdownButton<String>(
              value: selectedPeriod.value,
              isDense: true,
              icon: const Icon(
                Icons.keyboard_arrow_down,
                size: 20,
                color: AppColors.textWeak,
              ),
              items: ['This week', 'This month', '3 Months']
                  .map((String value) => DropdownMenuItem<String>(
                        value: value,
                        child: Text(value,
                            style: AppTypography.textTheme.bodyB3Regular),
                      ))
                  .toList(),
              onChanged: (String? newValue) {
                if (newValue != null) {
                  selectedPeriod.value = newValue;
                }
              },
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildTeamActivityHeader(BuildContext context) {
    // Style for the filter/sort buttons
    OutlinedButton.styleFrom(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      side: const BorderSide(color: AppColors.strokeWeak),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      textStyle: AppTypography.textTheme.bodyB3Regular,
      foregroundColor: AppColors.textStrong,
      minimumSize: Size.zero, // Adjust size
      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
    );

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
      decoration: const BoxDecoration(
        color: AppColors.white,
        border: Border(
          top: BorderSide(color: AppColors.strokeWeak),
          bottom: BorderSide(color: AppColors.strokeWeak),
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          Text(
            'Team Activity',
            style: AppTypography.textTheme.headingH3
                .copyWith(color: AppColors.textStrong),
          ),
        ],
      ),
    );
  }

  // --- Section Content Builders ---

  Widget _buildOverviewSection(
      BuildContext context, TeamProgressActivityOverviewResponseData? data) {
    // Use placeholders if data or specific fields are null

    return Row(
      children: <Widget>[
        Expanded(
          child: TeamsProgressCard(
            type: StatisticsType.members,
            count: data?.activeMembers.toInt() ?? 0,
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: TeamsProgressCard(
            type: StatisticsType.samples,
            count: data?.collectedSamples.toInt() ?? 0,
          ),
        ),
      ],
    );
  }

  Widget _buildWeeklyActivitySection(
      BuildContext context,
      VisitSummaryResponseData? data,
      ValueNotifier<DateTime> currentWeekStartDate,
      String dateRange) {
    final int overdue = data?.overdueVisits.toInt() ?? 0;
    final int pending = data?.pendingVisits.toInt() ?? 0;
    final int completed = data?.completedVisits.toInt() ?? 0;

    return Column(
      children: [
        // Date Navigation Row
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            // Use IconButton for navigation
            IconButton(
              icon: const Icon(Icons.chevron_left, color: AppColors.textWeak),
              onPressed: () {
                currentWeekStartDate.value = currentWeekStartDate.value
                    .subtract(const Duration(days: 7));
                // TODO: Trigger refetch
              },
              splashRadius: 20, // Smaller splash for icon button
              constraints: const BoxConstraints(), // Remove extra padding
            ),
            Text(
              dateRange,
              style: AppTypography.textTheme.bodyB2SemiBold,
            ),
            IconButton(
              icon: const Icon(Icons.chevron_right, color: AppColors.textWeak),
              onPressed: () {
                currentWeekStartDate.value =
                    currentWeekStartDate.value.add(const Duration(days: 7));
                // TODO: Trigger refetch
              },
              splashRadius: 20,
              constraints: const BoxConstraints(),
            ),
          ],
        ),
        const SizedBox(height: 16),
        // Metrics and Chart Row
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Left side - metrics
              Expanded(
                flex: 3,
                child: Column(
                  children: [
                    _TeamMetricCard(
                      color: AppColors.semanticsRed20,
                      value: '${overdue}',
                      label: 'OVERDUE',
                    ),
                    const SizedBox(height: 8),
                    _TeamMetricCard(
                      color: AppColors.semanticsYellow20,
                      value: '${pending}',
                      label: 'PENDING',
                    ),
                    const SizedBox(height: 8),
                    _TeamMetricCard(
                      color: AppColors.semanticsGreen20,
                      value: '${completed}',
                      label: 'COMPLETED',
                    ),
                  ],
                ),
              ),

              // Right side - bar chart
              Expanded(
                flex: 3,
                child: Container(
                  width: 100,
                  height: 180,
                  margin: const EdgeInsets.only(left: 48, right: 48),
                  child: (overdue == 0 && pending == 0 && completed == 0)
                      ? Container(
                          decoration: BoxDecoration(
                            color: Colors.grey.shade200,
                            borderRadius: BorderRadius.circular(4),
                          ),
                        )
                      : Column(
                          children: [
                            Expanded(
                              flex: overdue,
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
                              flex: pending,
                              child:
                                  Container(color: AppColors.semanticsYellow20),
                            ),
                            Expanded(
                              flex: completed,
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
              ),
            ],
          ),
        ),
      ],
    );
  }

  // Helper for status items in weekly activity
  // ignore: unused_element
  Widget _statusItem(int count, String label, Color color) {
    return Row(
      children: [
        Container(
          width: 8, // Smaller dot
          height: 8,
          decoration: BoxDecoration(
            color: color,
            shape: BoxShape.circle, // Circle dot
          ),
        ),
        const SizedBox(width: 8),
        Text(
          '$count',
          style: AppTypography.textTheme.bodyB1SemiBold // Bold count
              .copyWith(color: AppColors.textStrong),
        ),
        const SizedBox(width: 8),
        Text(
          label,
          style: AppTypography.textTheme.bodyB3Medium // Medium label
              .copyWith(color: AppColors.textWeak), // Fallback color
        ),
      ],
    );
  }

  Widget _buildTeamActivitySection(
    BuildContext context,
    TeamMemberActivityResponse? data,
    ValueNotifier<Map<String, bool>> expansionState, // Receive expansion state
  ) {
    final members = data?.data ?? BuiltList<MembersActivityDataType>();

    if (members.isEmpty) {
      return const Padding(
        padding: EdgeInsets.all(16.0),
        child: Center(child: Text('No team activity found.')),
      );
    }

    return ListView.builder(
      shrinkWrap: true, // Important for nested lists
      physics: const NeverScrollableScrollPhysics(), // Disable scrolling
      itemCount: members.length,

      itemBuilder: (context, index) {
        final member = members[index];
        final memberId = member.id; // Ensure a unique key
        // Determine visit status string - needs logic based on API data
        // Placeholder logic:
        final visitsPending = member.totalNumberOfVisitsPending;
        final visitsTotal = member.totalNumberOfVisitsAssigned;
        final visitsStatus = visitsTotal > 0
            ? '$visitsPending/$visitsTotal Visits Pending'
            : 'No Visits Assigned';
        final overdueCount = member.totalNumberOfVisitsOverDue;

        return Container(
          decoration: BoxDecoration(
            border: Border(
              bottom: BorderSide(color: AppColors.strokeWeak),
            ),
          ),
          child: _buildExpandableTeamMember(
            context,
            member.collector,
            member.collector,
            visitsStatus,
            overdueCount > 0 ? '$overdueCount OVERDUE' : '', // Alert text
            AppColors.semanticsRed10, // Alert background color
            member.visits.toList(), // Pass member's visits
            expansionState, // Pass expansion state notifier
            memberId, // Pass member ID
          ),
        );
      },
    );
  }

  // Updated Expandable Team Member Widget
  Widget _buildExpandableTeamMember(
    BuildContext context,
    String initials,
    String name,
    String status,
    String alert,
    Color alertColor,
    List<VisitDataForEveryMemberType> visits,
    ValueNotifier<Map<String, bool>> expansionState,
    String memberId, // Use member ID
  ) {
    // Get expanded state from the notifier map
    final bool isExpanded = expansionState.value[memberId] ?? false;

    return Column(
      children: [
        InkWell(
          onTap: () {
            // Create a new map and update the specific member's state
            final newState = Map<String, bool>.from(expansionState.value);
            newState[memberId] = !isExpanded;
            expansionState.value =
                newState; // Assign the new map to trigger rebuild
          },
          child: Container(
            padding:
                const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
            child: Row(
              children: [
                // Initials Circle
                Container(
                  width: 36,
                  height: 36,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: AppColors.white, // Use fallback color
                    shape: BoxShape.circle,
                  ),
                  child: Text(
                    initials.length > 2 ? initials.substring(0, 2) : initials,
                    style: AppTypography.textTheme.bodyB2SemiBold
                        .copyWith(color: AppColors.textWeak), // Fallback color
                  ),
                ),
                const SizedBox(width: 12),
                // Name and Status Column
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        name,
                        style: AppTypography.textTheme.bodyB2Medium
                            .copyWith(color: AppColors.textStrong),
                      ),
                      if (status.isNotEmpty)
                        Text(
                          status,
                          style: AppTypography.textTheme.bodyB3Medium.copyWith(
                              color: AppColors.textWeak), // Fallback color
                        ),
                    ],
                  ),
                ),
                // Overdue Alert Chip
                if (alert.isNotEmpty)
                  Chip(
                    label: Text(alert.toUpperCase()),
                    labelStyle: AppTypography.textTheme.labelCapsMedium
                        .copyWith(color: AppColors.semanticsRed30),
                    backgroundColor: AppColors.semanticsRed10,
                    padding:
                        const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    visualDensity:
                        VisualDensity.comfortable, // Make chip smaller
                    materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    side: BorderSide.none,
                  ),
                const SizedBox(width: 8),
                // Expansion Icon
                Icon(
                  isExpanded
                      ? Icons.keyboard_arrow_up
                      : Icons.keyboard_arrow_down,
                  color: AppColors.textWeak,
                ),
              ],
            ),
          ),
        ),
        // Expanded Content (Visits)
        if (isExpanded)
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 16),
            color: AppColors.white, // Use fallback color
            child: Column(
              children: visits.isEmpty
                  ? [
                      const Padding(
                          padding: EdgeInsets.all(16.0),
                          child: Text("No visits to display"))
                    ]
                  : visits
                      .map((visit) => Container(
                            margin: const EdgeInsets.symmetric(vertical: 8),
                            decoration: BoxDecoration(
                              border: Border(
                                bottom: BorderSide(color: AppColors.strokeWeak),
                              ),
                            ),
                            child: _buildVisitItem(context, visit),
                          ))
                      .toList(),
            ),
          ),
      ],
    );
  }

  // Visit Item Widget (inside expanded member)
  Widget _buildVisitItem(
      BuildContext context, VisitDataForEveryMemberType visit) {
    final visitDate = visit.visitScheduledAt.toLocal();
    final String date =
        visitDate != null ? DateFormat('dd MMM').format(visitDate) : '--';
    final String time = visitDate != null
        ? DateFormat('hh:mm a').format(visitDate).toUpperCase()
        : '--';
    final bool isOverdue =
        visit.visitStatus.name == VisitStatus.overdue.name; // Check if overdue

    // Use null checks for location details
    final String district = visit.siteDistrict;
    final String state = visit.siteState;
    final String locationDetails = (district.isNotEmpty && state.isNotEmpty)
        ? '$district | $state'
        : (district.isNotEmpty ? district : state);

    return Container(
      padding: const EdgeInsets.only(
          left: 16, right: 16, top: 16, bottom: 16), // Indent content
      decoration: const BoxDecoration(
        border: Border(
          bottom: BorderSide(color: AppColors.strokeWeak),
          top: BorderSide(color: AppColors.strokeWeak),
          left: BorderSide(color: AppColors.strokeWeak),
          right: BorderSide(color: AppColors.strokeWeak),
        ),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start, // Align top
        children: [
          // Date and Time Column
          SizedBox(
            width: 50, // Fixed width for date/time
            child: Column(
              // Center the content of this column
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Text(date,
                    // Center the date text
                    textAlign: TextAlign.center,
                    style: AppTypography.textTheme.bodyB4Medium
                        .copyWith(color: AppColors.textWeak)), // Fallback color
                Text(time,
                    // Center the time text
                    textAlign: TextAlign.center,
                    style: AppTypography.textTheme.bodyB3Medium
                        .copyWith(color: AppColors.textStrong)),
              ],
            ),
          ),
          const SizedBox(width: 8),
          // Make the divider taller and remove indents
          SizedBox(
            height: isOverdue ? 80 : 60, // Give the divider a specific height
            child: VerticalDivider(
              color: AppColors.strokeWeak, // Use a standard stroke color
              width: 1,
              thickness: 1,
              // Remove indents
              // indent: 16,
              // endIndent: 16,
            ),
          ),
          const SizedBox(width: 8),
          // Visit Details Column
          Expanded(
            child: Container(
              padding: const EdgeInsets.only(left: 8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Overdue Chip - directly in the column, not nested in a Row>Column
                  if (isOverdue)
                    Chip(
                      label: const Text('OVERDUE'),
                      labelStyle: AppTypography.textTheme.labelCapsMedium
                          .copyWith(color: AppColors.semanticsRed30),
                      backgroundColor: AppColors.semanticsRed10,
                      visualDensity: VisualDensity.compact,
                      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      side: BorderSide.none,
                    ),
                  const SizedBox(height: 8),
                  // Site Name Text
                  Text(
                    visit.siteName,
                    style: AppTypography.textTheme.bodyB2Medium
                        .copyWith(color: AppColors.textStrong),
                  ),

                  const SizedBox(height: 4),

                  // Location Details (e.g., Gandhinagar | New Text)
                  Row(
                    children: [
                      const Icon(Icons.location_on_outlined,
                          size: 14, color: AppColors.primaryLight),
                      const SizedBox(width: 4),
                      Text(
                        locationDetails.isNotEmpty
                            ? locationDetails
                            : 'Location Unknown', // Handle empty location
                        style: AppTypography.textTheme.bodyB4Medium.copyWith(
                            color: AppColors.textWeak), // Fallback color
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // Method to build the Manage Tab content
  Widget _buildManageTab(
    BuildContext context,
    PaginatedTeamMemberResponse? data, // Correct response type
    ValueNotifier<bool> isDeleteMode,
    ValueNotifier<Set<String>> selectedMemberIds,
  ) {
    // Safely access members and pagination meta, provide defaults
    final members = data?.data ?? BuiltList<TeamMembersCollectorListType>();
    final totalMembers = data?.total ?? members.length;
    final currentPage = data?.page ?? 1;

    // TODO: Implement state and logic for actual pagination
    useState(currentPage);

    // Style for Filter/Sort buttons
    OutlinedButton.styleFrom(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      side: const BorderSide(color: AppColors.strokeWeak),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      textStyle: AppTypography.textTheme.bodyB3Regular,
      foregroundColor: AppColors.textStrong,
      minimumSize: Size.zero,
      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
    );

    return Container(
      color: AppColors.white,
      child: Column(
        children: [
          // Top Card - Total Members
          Container(
            margin: const EdgeInsets.all(16.0),
            padding: const EdgeInsets.all(20.0),
            decoration: BoxDecoration(
              color: AppColors.background,
              borderRadius: BorderRadius.circular(8.0),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        totalMembers.toString(),
                        style: AppTypography.textTheme.headingH1
                            .copyWith(color: AppColors.textStrong),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'TOTAL MEMBERS',
                        style: AppTypography.textTheme.bodyB4Medium.copyWith(
                            color: AppColors.textWeak, letterSpacing: 0.5),
                      ),
                    ],
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      // ignore: deprecated_member_use
                      color: Colors.black.withOpacity(0.05),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.group_outlined,
                        color: AppColors.textStrong, size: 20),
                  ),
                ),
              ],
            ),
          ),

          // All Members Title & Filter/Sort
          Row(
            children: [
              Padding(
                padding: const EdgeInsets.all(16),
                child: Text(
                  'All Members',
                  style: AppTypography.textTheme.headingH3
                      .copyWith(color: AppColors.textStrong),
                ),
              ),
            ],
          ),
          Divider(
            height: 1,
            color: AppColors.strokeWeak,
          ),
          Container(
            color: Color(0xFFF8F9FA),
            child: Padding(
              padding: const EdgeInsets.all(12.0),
              child: Row(
                children: [
                  OutlinedButton.icon(
                    onPressed: () {
                      // TODO: Add filter logic
                    },
                    icon: const Icon(Icons.filter_alt_outlined, size: 16),
                    label: const Text('Filter'),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 6),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      side: const BorderSide(color: AppColors.strokeWeak),
                      textStyle: AppTypography.textTheme.bodyB3Regular,
                      foregroundColor: AppColors.textStrong,
                      minimumSize: Size.zero,
                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    ),
                  ),
                  const SizedBox(width: 8),
                  OutlinedButton.icon(
                    onPressed: () {
                      // TODO: Add sort logic
                    },
                    icon: const Icon(Icons.sort, size: 16),
                    label: const Text('Sort by'),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 6),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      side: const BorderSide(color: AppColors.strokeWeak),
                      textStyle: AppTypography.textTheme.bodyB3Regular,
                      foregroundColor: AppColors.textStrong,
                      minimumSize: Size.zero,
                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    ),
                  ),
                ],
              ),
            ),
          ),
          Divider(
            height: 1,
            color: AppColors.strokeWeak,
          ),
          // Header Row
          Container(
            padding:
                const EdgeInsets.symmetric(horizontal: 16.0, vertical: 10.0),
            decoration: const BoxDecoration(
                color: AppColors.fillWeak, // Fallback color
                border:
                    Border(bottom: BorderSide(color: AppColors.strokeWeak))),
            child: Row(
              children: [
                if (isDeleteMode.value)
                  Checkbox(
                    value: members.isNotEmpty &&
                        selectedMemberIds.value.length == members.length,
                    tristate: false,
                    onChanged: (checked) {
                      if (checked == true) {
                        selectedMemberIds.value =
                            members.map((m) => m.id).toSet();
                      } else {
                        selectedMemberIds.value = {};
                      }
                    },
                  ),
                Expanded(
                  flex: 5,
                  child: Text('Collector',
                      style: AppTypography.textTheme.bodyB4Medium
                          .copyWith(color: AppColors.textWeak)),
                ),
                Expanded(
                  flex: 2,
                  child: Text('Sites',
                      textAlign: TextAlign.center,
                      style: AppTypography.textTheme.bodyB4Medium
                          .copyWith(color: AppColors.textWeak)),
                ),
                Expanded(
                  flex: 3,
                  child: Text('Date',
                      textAlign: TextAlign.right,
                      style: AppTypography.textTheme.bodyB4Medium
                          .copyWith(color: AppColors.textWeak)),
                ),
              ],
            ),
          ),
          // TextButton(
          //   onPressed: () {
          //     if (selectedMemberIds.value.length == data?.data.length) {
          //       selectedMemberIds.value = {};
          //     } else {
          //       selectedMemberIds.value =
          //           data?.data.map((m) => m.id).toSet() ?? {};
          //     }
          //   },
          //   child: Text(
          //     selectedMemberIds.value.length == data?.data.length
          //         ? 'Deselect All'
          //         : 'Select All',
          //   ),
          // ),

          if (isDeleteMode.value && selectedMemberIds.value.isNotEmpty)
            Container(
              padding:
                  const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
              color: AppColors.fillWeak,
              child: Row(
                children: [
                  Text(
                    '${selectedMemberIds.value.length} Selected',
                    style: AppTypography.textTheme.bodyB3SemiBold
                        .copyWith(color: AppColors.textStrong),
                  ),
                  const Spacer(),
                  IconButton(
                    icon: const Icon(Icons.delete_outline, color: Colors.red),
                    onPressed: () {
                      // Assuming you have access to members here
                      // data?.data.removeWhere(
                      //   (m) => selectedMemberIds.value.contains(m.id),
                      // );
                      selectedMemberIds.value = {};
                      isDeleteMode.value = false;
                    },
                  ),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () {
                      isDeleteMode.value = false;
                      selectedMemberIds.value = {};
                    },
                  ),
                ],
              ),
            ),

          // Member List
          Expanded(
            child: members.isEmpty
                ? const Center(child: Text('No members found.'))
                : ListView.separated(
                    itemCount: members.length,
                    separatorBuilder: (context, index) => const Divider(
                        height: 1,
                        color: AppColors.strokeWeak,
                        indent: 16,
                        endIndent: 16),
                    itemBuilder: (context, index) {
                      // Assume member is TeamMemberResponseData based on BuiltList type
                      final member = members[index];
                      final memberName = member.firstName;
                      final memberInitials = member.firstName.isNotEmpty == true
                          ? member.firstName.substring(
                              0,
                              member.firstName.length >= 2
                                  ? 2
                                  : member.firstName.length)
                          : '??';
                      // Safely access sitesCount, default to 0
                      final siteCount = member.siteCount;
                      // Safely access createdAt, handle null
                      final dateJoined = member.lastVisitedVisit;
                      final formattedDate = dateJoined != null
                          ? DateFormat('dd MMM yy').format(dateJoined.toLocal())
                          : '--';

                      return Container(
                        color: Colors.white,
                        padding: const EdgeInsets.symmetric(
                            horizontal: 16.0, vertical: 12.0),
                        child: Row(
                          children: [
                            if (isDeleteMode.value)
                              Checkbox(
                                value:
                                    selectedMemberIds.value.contains(member.id),
                                onChanged: (checked) {
                                  final updated = {...selectedMemberIds.value};
                                  if (checked == true) {
                                    updated.add(member.id);
                                  } else {
                                    updated.remove(member.id);
                                  }
                                  selectedMemberIds.value = updated;
                                },
                              ),

                            // Collector Info (Initials + Name)
                            Expanded(
                              flex: 5,
                              child: Row(
                                children: [
                                  Container(
                                    width: 32,
                                    height: 32,
                                    alignment: Alignment.center,
                                    decoration: BoxDecoration(
                                      color: AppColors
                                          .semanticsGreen20, // Fallback color
                                      shape: BoxShape.circle,
                                    ),
                                    child: Text(
                                      memberInitials,
                                      style: AppTypography
                                          .textTheme.bodyB3SemiBold
                                          .copyWith(color: AppColors.textWeak),
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                      child: Text(
                                    memberName,
                                    style: AppTypography.textTheme.bodyB3Medium
                                        .copyWith(color: AppColors.textStrong),
                                    overflow: TextOverflow.ellipsis,
                                  )),
                                ],
                              ),
                            ),
                            // Sites Count
                            Expanded(
                              flex: 2,
                              child: Center(
                                child: siteCount == 0
                                    ? Chip(
                                        label: const Text('None'),
                                        labelStyle: AppTypography
                                            .textTheme.bodyB4Medium
                                            .copyWith(
                                                color:
                                                    AppColors.semanticsRed30),
                                        backgroundColor:
                                            AppColors.semanticsRed10,
                                        padding: const EdgeInsets.symmetric(
                                            horizontal: 6, vertical: 2),
                                        visualDensity: VisualDensity.compact,
                                        materialTapTargetSize:
                                            MaterialTapTargetSize.shrinkWrap,
                                      )
                                    : Text(
                                        siteCount.toString(),
                                        style: AppTypography
                                            .textTheme.bodyB3SemiBold
                                            .copyWith(
                                                color: AppColors.textStrong),
                                      ),
                              ),
                            ),

                            // Date
                            Expanded(
                              flex: 3,
                              child: Text(formattedDate,
                                  textAlign: TextAlign.right,
                                  style: AppTypography.textTheme.bodyB3Regular
                                      .copyWith(color: AppColors.textWeak)),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
          ),

          // Pagination Footer
          // Container(
          //   padding:
          //       const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
          //   decoration: const BoxDecoration(
          //     color: AppColors.background,
          //     border: Border(top: BorderSide(color: AppColors.strokeWeak)),
          //   ),
          //   child: Row(
          //     mainAxisAlignment: MainAxisAlignment.spaceBetween,
          //     children: [
          //       IconButton(
          //         icon: const Icon(Icons.arrow_back_ios_new_rounded,
          //             color: AppColors.textWeak, size: 16),
          //         onPressed: currentPage <= 1 ? null : () {},
          //         splashRadius: 20,
          //       ),
          //       Text(
          //         'Page $currentPage of 23',
          //         style: AppTypography.textTheme.bodyB3Medium
          //             .copyWith(color: AppColors.textStrong),
          //       ),
          //       IconButton(
          //         icon: const Icon(Icons.arrow_forward_ios_rounded,
          //             color: AppColors.textWeak, size: 16),
          //         onPressed: currentPage >= 23 ? null : () {},
          //         splashRadius: 20,
          //       ),
          //     ],
          //   ),
          // ),
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
