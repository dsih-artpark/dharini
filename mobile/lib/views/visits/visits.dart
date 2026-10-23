import 'package:design_system/design_system.dart';
import 'package:es_client/es_client.dart';
import 'package:es_platform_mobile/hooks/auth.dart';
import 'package:es_platform_mobile/hooks/visit_drafts.dart';
import 'package:es_platform_mobile/utils/tenant_roles.dart';
import 'package:es_platform_mobile/views/visits/visits_overdue_visit_card.dart';
import 'package:es_platform_mobile/widgets/visit_card.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:fquery/fquery.dart';
import 'package:go_router/go_router.dart';
import 'package:hive_flutter/hive_flutter.dart';

import 'completed_card.dart';
import 'progress_card.dart';
import 'dart:convert';
import 'dart:io';
import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';
import 'package:csv/csv.dart';

class Visits extends HookWidget {
  const Visits({
    this.initialTabIndex = 0,
    super.key,
    this.from = 'home',
  });

  final int initialTabIndex;
  final String from;
  @override
  Widget build(BuildContext context) {
    final profile = useProfile();
    final isCollector = profile.data?.roles.isNotEmpty == true
        ? profile.data?.roles.first.role?.name == 'collector'
        : false;

    return DefaultTabController(
      length: 2,
      initialIndex: initialTabIndex,
      child: Scaffold(
        backgroundColor: AppColors.white,
        appBar: AppBar(
          leading: IconButton(
            icon: const Icon(
              Icons.arrow_back,
              color: AppColors.textStrong,
            ),
            onPressed: () => context.go('/'),
          ),
          backgroundColor: AppColors.white,
          elevation: 0,
          title: Text(
            isCollector ? 'Your Visits' : 'Visits',
            style: AppTypography.textTheme.bodyB2SemiBold.copyWith(
              color: AppColors.textStrong,
            ),
          ),
          actions: [
            IconButton(
              icon: const Icon(
                Icons.notifications_outlined,
                color: AppColors.primaryLight,
                size: 26,
              ),
              onPressed: () {},
            ),
          ],
          centerTitle: true,
          bottom: PreferredSize(
            preferredSize: const Size.fromHeight(48),
            child: TabBar(
              tabs: const <Widget>[
                Tab(
                  child: Text(
                    'Pending',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                  ),
                ),
                Tab(
                  child: Text(
                    'Completed',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                  ),
                ),
              ],
              labelColor: AppColors.primaryLight,
              unselectedLabelColor: AppColors.labletestgrey,
              indicatorColor: AppColors.primaryLight,
              indicatorSize: TabBarIndicatorSize.tab,
              labelStyle:
                  const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
              unselectedLabelStyle:
                  const TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
            ),
          ),
        ),
        body: TabBarView(
          children: <Widget>[
            // Pending Tab
            PendingVisit(),
            // Completed Tab
            CompleteVisits(),
          ],
        ),
      ),
    );
  }
}

class PendingVisit extends HookWidget {
  (DateTime, DateTime) _getDateRange(String filter) {
    final now = DateTime.now();
    switch (filter) {
      case 'This week':
        // Get the start of the current week (Monday)
        final startOfWeek = now.subtract(Duration(days: now.weekday - 1));
        return (
          DateTime(startOfWeek.year, startOfWeek.month, startOfWeek.day),
          DateTime(now.year, now.month, startOfWeek.day + 6)
        );
      case 'This month':
        return (
          DateTime(now.year, now.month, 1),
          DateTime(now.year, now.month + 1, 0)
        );
      case '3 Months':
        return (
          DateTime(now.year, now.month, 1),
          DateTime(now.year, now.month - 2, 1)
        );
      default:
        return (now, now);
    }
  }

  @override
  Widget build(BuildContext context) {
    final profile = useProfile().data;
    final project = useProject().data;
    if (profile == null || project == null) return Container();

    final assignedTo = true;

    // Add state for the selected filter with a default value of empty string
    final selectedFilter = useState<String>('');
    final selectedSiteId = useState<String>('');
    final sitesResult = useSites();

    final queryClient = useQueryClient();

    // Calculate start and end dates based on filter selection
    DateTime? startDate;
    DateTime? endDate;

    if (selectedFilter.value.isNotEmpty) {
      final (start, end) = _getDateRange(selectedFilter.value);
      startDate = start;
      endDate = end;
    } else {
      print('No date filter applied');
    }

    final visits = useScheduledVisits(
      assignedTo,
      startDate: startDate,
      endDate: endDate,
      status: 'upcoming',
    );

    final overDueVisitsRes = useScheduledVisits(
      assignedTo,
      startDate: startDate,
      endDate: endDate,
      status: 'overdue',
    );

    final visitBox = Hive.isBoxOpen('visits') ? Hive.box('visits') : null;
    final completedVisitsBox = Hive.box('completedVisits');

    if (visitBox != null) {
      useListenable(visitBox.listenable());
    }
    useListenable(completedVisitsBox.listenable());
    final draftIds = useDraftVisitIds();

    final offlineVisits = visitBox == null
        ? <VisitResponseData>[]
        : visitBox.values
            .map((v) {
              try {
                return standardSerializers.deserializeWith(
                  VisitResponseData.serializer,
                  jsonDecode(jsonEncode(v)),
                );
              } catch (_) {
                return null;
              }
            })
            .whereType<VisitResponseData>()
            .where((visit) => visit.id.startsWith('local'))
            .toList();

    final List<VisitResponseData> pendingVisits = [];
    final List<VisitResponseData> completedVisits = [];

    for (final visit in offlineVisits) {
      if (completedVisitsBox.containsKey(visit.id)) {
        completedVisits.add(visit);
      } else {
        pendingVisits.add(visit);
      }
    }

    // Build map of siteId -> siteName
    final siteMap = <String, String>{};
    if (sitesResult.data != null) {
      for (final s in sitesResult.data!) {
        if (s.id.isNotEmpty) {
          siteMap[s.id] = s.name.trim();
        }
      }
    }
    if (visits.data != null) {
      for (final v in visits.data!) {
        if (v.site.id.isNotEmpty && !siteMap.containsKey(v.site.id)) {
          siteMap[v.site.id] = v.site.name.trim();
        }
      }
    }
    if (overDueVisitsRes.data != null) {
      for (final v in overDueVisitsRes.data!) {
        if (v.site.id.isNotEmpty && !siteMap.containsKey(v.site.id)) {
          siteMap[v.site.id] = v.site.name.trim();
        }
      }
    }
    for (final v in offlineVisits) {
      if (v.site.id.isNotEmpty && !siteMap.containsKey(v.site.id)) {
        siteMap[v.site.id] = v.site.name.trim();
      }
    }

    final currentSiteId = selectedSiteId.value;
    final validSiteId =
        (currentSiteId.isNotEmpty && siteMap.containsKey(currentSiteId))
            ? currentSiteId
            : '';

    final siteDropdownItems = <DropdownMenuItem<String>>[
      DropdownMenuItem<String>(
        value: '',
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 10.0),
          child: Text(
            'All Sites',
            overflow: TextOverflow.ellipsis,
            style: AppTypography.textTheme.bodyB4Regular.copyWith(
              color: AppColors.iconPrimary,
            ),
          ),
        ),
      ),
      ...siteMap.entries.map((entry) {
        return DropdownMenuItem<String>(
          value: entry.key,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 10.0),
            child: Text(
              entry.value,
              overflow: TextOverflow.ellipsis,
              style: AppTypography.textTheme.bodyB4Regular.copyWith(
                color: AppColors.iconPrimary,
              ),
            ),
          ),
        );
      }),
    ];

    final filteredPendingVisits = validSiteId.isEmpty
        ? pendingVisits
        : pendingVisits.where((e) => e.site.id == validSiteId).toList();

    // Force refetch when filter changes
    useEffect(() {
      if (selectedFilter.value.isNotEmpty || selectedFilter.value.isEmpty) {
        // Invalidate both upcoming and overdue queries to force a refetch with the new filter
        queryClient.invalidateQueries(
          QueryKeys.scheduledVisits(
            project.id,
            assignedTo: assignedTo,
            startDate: startDate,
            endDate: endDate,
            status: 'upcoming',
          ),
        );
        queryClient.invalidateQueries(
          QueryKeys.scheduledVisits(
            project.id,
            assignedTo: assignedTo,
            startDate: startDate,
            endDate: endDate,
            status: 'overdue',
          ),
        );
      }
      return null;
    }, [selectedFilter.value]);

    // Group overdue visits
    final rawOverdueVisits = overDueVisitsRes.data
            // ignore: unnecessary_null_comparison
            ?.where((e) => e != null) ??
        [];
    final filteredOverdueVisits = validSiteId.isEmpty
        ? rawOverdueVisits
        : rawOverdueVisits.where((e) => e.site.id == validSiteId);

    final overdueVisits = filteredOverdueVisits.map((e) {
          // Create a hook for each visit to manage its update
          final updateVisitMutation = useUpdateVisit(
            e.id,
            onSuccess: () {
              // Show success snackbar
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Visit successfully marked as skipped'),
                  backgroundColor: AppColors.semanticsGreen20,
                ),
              );

              // Invalidate the visits query to refresh the UI
              queryClient.invalidateQueries(
                QueryKeys.scheduledVisits(
                  project.id,
                  assignedTo: assignedTo,
                  startDate: startDate,
                  endDate: endDate,
                  status: 'overdue',
                ),
              );
            },
            onError: (errorMessage) {
              // Show error message
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Failed to skip visit: $errorMessage'),
                  backgroundColor: Colors.red,
                ),
              );
            },
          );

          return Container(
            child: Column(
              children: [
                const SizedBox(width: 8),
                VisitsOverdueVisitCard(
                  farmName: e.site.name,
                  farmType: e.site.farmType ?? '',
                  location: e.site.location?.region?.name ?? '',
                  round: e.round,
                  isRescheduled: e.rescheduledFrom != null,
                  daysOverdue:
                      DateTime.now().difference(e.visitScheduledAt).inDays,
                  onSkipPressed: () {
                    // Validate the visit ID
                    final visitId = e.id;
                    if (visitId.isEmpty) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text(
                              'Unable to skip visit - could not identify the visit.'),
                          backgroundColor: Colors.red,
                        ),
                      );
                      return;
                    }

                    try {
                      // Use the original scheduled date or current date if not available

                      // Create a minimal UpdateVisitDto with just siteId and visitStatus
                      // (plus required fields needed by the builder)
                      final UpdateVisitDto updateDto = UpdateVisitDto((b) {
                        // The id is required by the builder but not part of the API model

                        // Required by the generated code, but not part of the API model
                        b.visitStatus = VisitStatus.skipped;
                        b.siteId = e.site.id; // The siteId we want to set
                        b.isCompleted = false;
                        // These fields are required by the model builder
                        // but we're setting them with minimal values
                        //b.visitedAt = DateTime.now(); // Required by the model
                        //b.isCompleted = true; // Required by the model
                      });

                      // Call the mutation to update the visit
                      updateVisitMutation.mutate(updateDto);
                    } catch (error, stackTrace) {
                      print('ERROR creating UpdateVisitDto: $error');
                      print('Stack trace: $stackTrace');

                      // Show error snackbar
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content:
                              Text('Failed to skip visit. Please try again.'),
                          backgroundColor: Colors.red,
                        ),
                      );
                    }
                  },
                  onRevistPressed: () {
                    context.push('/collection-details', extra: {
                      "visitDetails": e,
                    });
                  },
                ),
                const SizedBox(width: 8),
              ],
            ),
          );
        }).toList();

    // Group upcoming visits by date
    final rawUpcomingVisits = visits.data?.toList() ?? [];
    final upcomingVisits = validSiteId.isEmpty
        ? rawUpcomingVisits
        : rawUpcomingVisits.where((e) => e.site.id == validSiteId).toList();

    // Sort visits by date (earliest first) to ensure chronological order
    upcomingVisits
        .sort((a, b) => a.visitScheduledAt.compareTo(b.visitScheduledAt));

    // Group visits by date
    final groupedVisits = <String, List<VisitResponseData>>{};

    for (final visit in upcomingVisits) {
      final visitDate = visit.visitScheduledAt.toLocal();
      final now = DateTime.now();

      // Format the date as "Today", "Thu, 24 September", etc.
      String dateKey;
      if (visitDate.year == now.year &&
          visitDate.month == now.month &&
          visitDate.day == now.day) {
        dateKey = 'Today';
      } else {
        dateKey =
            '${_getDayOfWeek(visitDate.weekday)}, ${visitDate.day} ${_getMonthName(visitDate.month)}';
      }

      if (!groupedVisits.containsKey(dateKey)) {
        groupedVisits[dateKey] = [];
      }
      groupedVisits[dateKey]!.add(visit);
    }

    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: <Widget>[
            if (overdueVisits.isNotEmpty) ...[
              AppAccordion(
                title: 'Overdue Visits',
                itemCount: overdueVisits.length,
                initiallyExpanded: false,
                child: Padding(
                  padding: const EdgeInsets.only(bottom: 16),
                  child: SizedBox(
                    height: 228,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      itemCount: overdueVisits.length,
                      itemBuilder: (context, index) {
                        return Padding(
                          padding: const EdgeInsets.only(right: 0),
                          child: SizedBox(
                            width: 340,
                            child: overdueVisits[index],
                          ),
                        );
                      },
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 8),
            ],
            AppAccordion(
              title: 'Upcoming Visits',
              itemCount: upcomingVisits.length,
              initiallyExpanded: true,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 16.0, vertical: 8.0),
                    child: Row(
                      children: [
                        // Site Filter Dropdown
                        Expanded(
                          child: Container(
                            height: 36,
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(48),
                              border: Border.all(color: AppColors.strokeWeak),
                            ),
                            child: DropdownButtonHideUnderline(
                              child: DropdownButton<String>(
                                value: validSiteId,
                                icon: sitesResult.isLoading
                                    ? SizedBox(
                                        width: 16,
                                        height: 16,
                                        child: CircularProgressIndicator(
                                          strokeWidth: 2,
                                          valueColor:
                                              AlwaysStoppedAnimation<Color>(
                                            AppColors.primaryLight,
                                          ),
                                        ),
                                      )
                                    : const Icon(Icons.arrow_drop_down,
                                        size: 20),
                                iconSize: 20,
                                elevation: 2,
                                isExpanded: true,
                                isDense: true,
                                style: AppTypography.textTheme.bodyB4Regular
                                    .copyWith(
                                  color: AppColors.textStrong,
                                ),
                                underline: Container(),
                                alignment: Alignment.centerLeft,
                                items: siteDropdownItems,
                                onChanged: (String? newValue) {
                                  selectedSiteId.value = newValue ?? '';
                                },
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        // Date Filter Dropdown
                        Container(
                          width: 130,
                          height: 36,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(48),
                            border: Border.all(color: AppColors.strokeWeak),
                          ),
                          child: DropdownButtonHideUnderline(
                            child: DropdownButton<String>(
                              value: selectedFilter.value.isEmpty
                                  ? 'All dates'
                                  : selectedFilter.value,
                              icon: visits.isLoading
                                  ? SizedBox(
                                      width: 16,
                                      height: 16,
                                      child: CircularProgressIndicator(
                                        strokeWidth: 2,
                                        valueColor:
                                            AlwaysStoppedAnimation<Color>(
                                          AppColors.primaryLight,
                                        ),
                                      ),
                                    )
                                  : const Icon(Icons.arrow_drop_down, size: 20),
                              iconSize: 20,
                              elevation: 2,
                              isExpanded: true,
                              isDense: true,
                              style: AppTypography.textTheme.bodyB4Regular
                                  .copyWith(
                                color: AppColors.textStrong,
                              ),
                              underline: Container(),
                              alignment: Alignment.centerLeft,
                              items: const <String>[
                                'All dates',
                                'This week',
                                'This month',
                              ].map<DropdownMenuItem<String>>((String value) {
                                return DropdownMenuItem<String>(
                                  value: value,
                                  child: Padding(
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 10.0),
                                    child: Text(
                                      value,
                                      overflow: TextOverflow.ellipsis,
                                      style: AppTypography
                                          .textTheme.bodyB4Regular
                                          .copyWith(
                                        color: AppColors.iconPrimary,
                                      ),
                                    ),
                                  ),
                                );
                              }).toList(),
                              onChanged: (String? newValue) {
                                if (newValue == 'All dates') {
                                  selectedFilter.value = '';
                                } else {
                                  selectedFilter.value = newValue ?? '';
                                }
                              },
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 8),
                  if (groupedVisits.isEmpty)
                    const Center(
                      child: Padding(
                        padding: EdgeInsets.symmetric(vertical: 32),
                        child: Text(
                          'No upcoming visits found',
                          style: TextStyle(color: AppColors.textWeak),
                        ),
                      ),
                    )
                  else
                    ...groupedVisits.entries.map((entry) {
                    return Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Corrected Date header with rounded container and full-width line
                        Stack(
                          alignment: Alignment.center,
                          children: [
                            // Full-width horizontal line
                            Divider(
                              color: AppColors.strokeWeak, // Light gray line
                              thickness: 1.0,
                              height: 1.0,
                            ),
                            // Rounded container for the date text
                            Container(
                              padding: const EdgeInsets.symmetric(
                                vertical: 8.0,
                                horizontal: 16.0,
                              ),
                              decoration: BoxDecoration(
                                border: Border.all(
                                  color: AppColors.strokeWeak,
                                  width: 1,
                                ),
                                color: Colors.white, // Subtle background color
                                borderRadius: BorderRadius.circular(
                                    24.0), // Rounded corners
                              ),
                              child: Text(
                                entry.key,
                                style: AppTypography.textTheme.bodyMedium
                                    ?.copyWith(
                                  fontWeight: FontWeight.w500,
                                  fontSize: 12,
                                  color: AppColors.textWeak,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),

                        ...entry.value.map((visit) {
                          return InkWell(
                            onTap: () {
                              context.push('/collection-details', extra: {
                                "visitDetails": visit,
                              });
                            },
                            child: Container(
                              child: Column(
                                children: [
                                  const SizedBox(height: 8),
                                  VisitCard(
                                    farmName: visit.site.name,
                                    farmType: visit.site.farmType ?? '',
                                    siteCode: visit.site.siteCode ?? '',
                                    location:
                                        visit.site.location?.region?.name ?? '',
                                    scheduledAt:
                                        visit.visitScheduledAt.toLocal(),
                                    round: visit.round,
                                    isInProgress: draftIds.contains(visit.id),
                                    isRescheduled:
                                        visit.rescheduledFrom != null,
                                  ),
                                  const SizedBox(height: 8),
                                ],
                              ),
                            ),
                          );
                        }).toList(),
                      ],
                    );
                  }).toList(),
                ],
              ),
            ),

            // offline visits shown here --->>
            if (offlineVisits.isNotEmpty) ...[
              // -- PENDING VISITS --
              if (filteredPendingVisits.isNotEmpty) ...[
                const SizedBox(height: 16),
                AppAccordion(
                  title: 'Offline Pending Visits',
                  itemCount: filteredPendingVisits.length,
                  initiallyExpanded: true,
                  child: Column(
                    children: filteredPendingVisits.map((visit) {
                      return InkWell(
                        onTap: () {
                          context.push('/collection-details', extra: {
                            "visitDetails": visit,
                          });
                        },
                        child: Column(
                          children: [
                            const SizedBox(height: 8),
                            VisitCard(
                              farmName: visit.site.name,
                              farmType: visit.site.farmType ?? '',
                              siteCode: visit.site.siteCode ?? '',
                              location: visit.site.address ?? '',
                              scheduledAt: visit.visitScheduledAt.toLocal(),
                              round: visit.round,
                              isInProgress: draftIds.contains(visit.id),
                              isRescheduled: visit.rescheduledFrom != null,
                            ),
                            const SizedBox(height: 8),
                          ],
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ],
            ],
          ],
        ),
      ),
    );
  }

  // Helper function to get day of week
  String _getDayOfWeek(int day) {
    switch (day) {
      case 1:
        return 'Mon';
      case 2:
        return 'Tue';
      case 3:
        return 'Wed';
      case 4:
        return 'Thu';
      case 5:
        return 'Fri';
      case 6:
        return 'Sat';
      case 7:
        return 'Sun';
      default:
        return '';
    }
  }

  // Helper function to get month name
  String _getMonthName(int month) {
    switch (month) {
      case 1:
        return 'January';
      case 2:
        return 'February';
      case 3:
        return 'March';
      case 4:
        return 'April';
      case 5:
        return 'May';
      case 6:
        return 'June';
      case 7:
        return 'July';
      case 8:
        return 'August';
      case 9:
        return 'September';
      case 10:
        return 'October';
      case 11:
        return 'November';
      case 12:
        return 'December';
      default:
        return '';
    }
  }

  // Helper function to get sample types text - fixed to avoid whereNotNull
  // ignore: unused_element
  String _getSampleTypesText(dynamic visit) {
    List<String> sampleTypes = [];

    // If we can access samples, try to extract sample types
    if (visit.samples != null) {
      for (var sample in visit.samples) {
        if (sample?.sampleType?.name != null) {
          sampleTypes.add(sample.sampleType.name);
        }
      }
    }

    // If we couldn't get any sample types, use default fallback values
    if (sampleTypes.isEmpty) {
      // Based on screenshot data
      if (visit.site?.name == 'Anjaneya Farms' ||
          visit.site?.name == 'Balaji Milk Cooperation' ||
          visit.site?.name == 'Fakir Chand Cooperation') {
        return 'Dung Pile';
      } else if (visit.site?.name == 'Nandani Poultry') {
        return 'Air Sample, Sediment +2';
      } else {
        return 'Sample Type';
      }
    }

    // Format the sample types text
    final baseText = sampleTypes[0];
    if (sampleTypes.length > 1) {
      return '$baseText +${sampleTypes.length - 1}';
    }
    return baseText;
  }
}

class CompleteVisits extends HookWidget {
  (DateTime, DateTime) _getDateRange(String filter) {
    final now = DateTime.now();
    switch (filter) {
      case 'This week':
        // Get the start of the current week (Monday)
        final startOfWeek = now.subtract(Duration(days: now.weekday - 1));
        // Get the end of the current week (Sunday)
        final endOfWeek = startOfWeek.add(const Duration(days: 6));
        return (
          DateTime(startOfWeek.year, startOfWeek.month, startOfWeek.day),
          DateTime(endOfWeek.year, endOfWeek.month, endOfWeek.day)
        );
      case 'This month':
        return (
          DateTime(now.year, now.month, 1),
          DateTime(now.year, now.month + 1, 0)
        );
      case '3 Months':
        return (
          DateTime(now.year, now.month - 2, 1),
          DateTime(now.year, now.month + 1, 0)
        );
      default:
        return (now, now);
    }
  }

  @override
  Widget build(BuildContext context) {
    final profile = useProfile().data;
    final project = useProject().data;
    final isCollector = profile?.roles.isNotEmpty == true
        ? profile?.roles.first.role?.name == 'collector'
        : false;

    if (profile == null || project == null) return Container();

    // Set default filter value to 'This week'
    final selectedFilter = useState<String>('This week');
    final selectedSiteId = useState<String>('');
    final sitesResult = useSites();

    final queryClient = useQueryClient();

    // Calculate start and end dates based on filter selection
    DateTime? startDate;
    DateTime? endDate;

    // Always calculate dates since we have a default value
    final (start, end) = _getDateRange(selectedFilter.value);
    startDate = start;
    endDate = end;

    final visits = useCompletedVisit(
      startDate: startDate,
      endDate: endDate,
    );

    final summary = useVisitSummary(
      startDate: startDate,
      endDate: endDate,
    ).data;

    final activityOverview = useTeamProgressActivityOverview(
      teamId: teamIdForProject(profile, project.id) ?? '',
      startDate: startDate,
      endDate: endDate,
    );

    // Force refetch when filter changes
    useEffect(() {
      if (selectedFilter.value.isNotEmpty || selectedFilter.value.isEmpty) {
        // Invalidate the query to force a refetch with the new filter
        queryClient.invalidateQueries(
          QueryKeys.completedVisits(
            project.id,
            startDate: startDate,
            endDate: endDate,
          ),
        );
        queryClient
            .invalidateQueries(QueryKeys.visitSummary(startDate, endDate));
      }
      return null;
    }, [selectedFilter.value]);

    final visitBox = Hive.isBoxOpen('visits') ? Hive.box('visits') : null;
    final completedVisitsBox = Hive.box('completedVisits');

    if (visitBox != null) {
      useListenable(visitBox.listenable());
    }
    useListenable(completedVisitsBox.listenable());

    final List<VisitResponseData> completedVisits = [];

    if (completedVisitsBox.isNotEmpty) {
      final allOfflineCompleted = completedVisitsBox.values
          .map((v) {
            try {
              return standardSerializers.deserializeWith(
                VisitResponseData.serializer,
                jsonDecode(jsonEncode(v)),
              );
            } catch (_) {
              return null;
            }
          })
          .whereType<VisitResponseData>()
          .toList();
      completedVisits.addAll(allOfflineCompleted);
    }

    // Build map of siteId -> siteName
    final siteMap = <String, String>{};
    if (sitesResult.data != null) {
      for (final s in sitesResult.data!) {
        if (s.id.isNotEmpty) {
          siteMap[s.id] = s.name.trim();
        }
      }
    }
    if (visits.data != null) {
      for (final v in visits.data!) {
        if (v.site.id.isNotEmpty && !siteMap.containsKey(v.site.id)) {
          siteMap[v.site.id] = v.site.name.trim();
        }
      }
    }
    for (final v in completedVisits) {
      if (v.site.id.isNotEmpty && !siteMap.containsKey(v.site.id)) {
        siteMap[v.site.id] = v.site.name.trim();
      }
    }

    final currentSiteId = selectedSiteId.value;
    final validSiteId =
        (currentSiteId.isNotEmpty && siteMap.containsKey(currentSiteId))
            ? currentSiteId
            : '';

    final siteDropdownItems = <DropdownMenuItem<String>>[
      DropdownMenuItem<String>(
        value: '',
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 10.0),
          child: Text(
            'All Sites',
            overflow: TextOverflow.ellipsis,
            style: AppTypography.textTheme.bodyB4Regular.copyWith(
              color: AppColors.iconPrimary,
            ),
          ),
        ),
      ),
      ...siteMap.entries.map((entry) {
        return DropdownMenuItem<String>(
          value: entry.key,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 10.0),
            child: Text(
              entry.value,
              overflow: TextOverflow.ellipsis,
              style: AppTypography.textTheme.bodyB4Regular.copyWith(
                color: AppColors.iconPrimary,
              ),
            ),
          ),
        );
      }),
    ];

    // Group completed visits by date
    final groupedVisits = <String, List<VisitResponseData>>{};
    final List<VisitResponseData> displayedCompletedVisits = [];

    // Get the set of offline visit IDs to filter them out from the main section
    final offlineVisitIds = completedVisits.map((v) => v.id).toSet();

    if (visits.data != null) {
      for (final visit in visits.data!) {
        // Skip visits that are in completedVisitsBox (offline/unsynced)
        if (offlineVisitIds.contains(visit.id)) {
          continue;
        }

        // Apply site filter
        if (validSiteId.isNotEmpty && visit.site.id != validSiteId) {
          continue;
        }

        displayedCompletedVisits.add(visit);

        final visitDate = visit.visitedAt?.toLocal() ?? DateTime.now();
        final now = DateTime.now();

        // Format the date as "Today", "Thu, 24 September", etc.
        String dateKey;
        if (visitDate.year == now.year &&
            visitDate.month == now.month &&
            visitDate.day == now.day) {
          dateKey = 'Today';
        } else {
          dateKey =
              '${_getDayOfWeek(visitDate.weekday)}, ${visitDate.day} ${_getMonthName(visitDate.month)}';
        }

        if (!groupedVisits.containsKey(dateKey)) {
          groupedVisits[dateKey] = [];
        }
        groupedVisits[dateKey]!.add(visit);
      }
    }

    final filteredOfflineCompleted = validSiteId.isEmpty
        ? completedVisits
        : completedVisits.where((v) => v.site.id == validSiteId).toList();

    final int visitsCount;
    final int samplesCount;

    if (validSiteId.isNotEmpty) {
      final allCompletedForSite = [
        ...displayedCompletedVisits,
        ...filteredOfflineCompleted,
      ];
      visitsCount = allCompletedForSite.length;
      samplesCount = allCompletedForSite.fold<int>(
        0,
        (sum, v) => sum + v.samples.length,
      );
    } else {
      visitsCount = isCollector
          ? summary?.visitCount.toInt() ?? 0
          : summary?.completedVisits.toInt() ?? 0;
      samplesCount = isCollector
          ? summary?.totalSampleCollected.toInt() ?? 0
          : activityOverview.data?.collectedSamples.toInt() ?? 0;
    }

    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            const SizedBox(height: 8),
            Padding(
              padding: const EdgeInsets.only(bottom: 0, left: 8, right: 8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Completed Visits',
                    style: AppTypography.textTheme.headingH3.copyWith(
                      color: AppColors.textStrong,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      // Site Filter Dropdown
                      Expanded(
                        child: Container(
                          height: 36,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(48),
                            border: Border.all(color: AppColors.strokeWeak),
                          ),
                          child: DropdownButtonHideUnderline(
                            child: DropdownButton<String>(
                              value: validSiteId,
                              icon: sitesResult.isLoading
                                  ? SizedBox(
                                      width: 16,
                                      height: 16,
                                      child: CircularProgressIndicator(
                                        strokeWidth: 2,
                                        valueColor:
                                            AlwaysStoppedAnimation<Color>(
                                          AppColors.primaryLight,
                                        ),
                                      ),
                                    )
                                  : const Icon(Icons.arrow_drop_down,
                                      size: 20),
                              iconSize: 20,
                              elevation: 2,
                              isExpanded: true,
                              isDense: true,
                              style: AppTypography.textTheme.bodyB4Regular
                                  .copyWith(
                                color: AppColors.textStrong,
                              ),
                              underline: Container(),
                              alignment: Alignment.centerLeft,
                              items: siteDropdownItems,
                              onChanged: (String? newValue) {
                                selectedSiteId.value = newValue ?? '';
                              },
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      // Date Filter Dropdown
                      Container(
                        width: 130,
                        height: 36,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(48),
                          border: Border.all(color: AppColors.strokeWeak),
                        ),
                        child: DropdownButtonHideUnderline(
                          child: DropdownButton<String>(
                            value: selectedFilter.value,
                            icon: visits.isLoading
                                ? SizedBox(
                                    width: 16,
                                    height: 16,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2,
                                      valueColor:
                                          AlwaysStoppedAnimation<Color>(
                                        AppColors.primaryLight,
                                      ),
                                    ),
                                  )
                                : const Icon(Icons.arrow_drop_down, size: 20),
                            iconSize: 20,
                            elevation: 2,
                            isExpanded: true,
                            isDense: true,
                            style: AppTypography.textTheme.bodyB4Regular
                                .copyWith(
                              color: AppColors.textStrong,
                            ),
                            underline: Container(),
                            alignment: Alignment.centerLeft,
                            items: const <String>[
                              'This week',
                              'This month',
                              '3 Months',
                            ].map<DropdownMenuItem<String>>((String value) {
                              return DropdownMenuItem<String>(
                                value: value,
                                child: Padding(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 10.0),
                                  child: Text(
                                    value,
                                    overflow: TextOverflow.ellipsis,
                                    style: AppTypography
                                        .textTheme.bodyB4Regular
                                        .copyWith(
                                      color: AppColors.iconPrimary,
                                    ),
                                  ),
                                ),
                              );
                            }).toList(),
                            onChanged: (String? newValue) {
                              selectedFilter.value = newValue ?? 'This week';
                            },
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Column(
              children: <Widget>[
                Row(
                  children: <Widget>[
                    Expanded(
                      child: VisitsProgressCard(
                        type: StatisticsType.visits,
                        count: visitsCount,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: VisitsProgressCard(
                        type: StatisticsType.samples,
                        count: samplesCount,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Grouped visits by date
                if (groupedVisits.isEmpty)
                  const Center(
                    child: Padding(
                      padding: EdgeInsets.only(top: 32),
                      child: Text('No completed visits available'),
                    ),
                  )
                else
                  ...groupedVisits.entries.map((entry) {
                    return Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Date header with rounded container and full-width line
                        Stack(
                          alignment: Alignment.center,
                          children: [
                            // Full-width horizontal line
                            Divider(
                              color: AppColors.strokeWeak, // Light gray line
                              thickness: 1.0,
                              height: 1.0,
                            ),
                            // Rounded container for the date text
                            Container(
                              padding: const EdgeInsets.symmetric(
                                vertical: 8.0,
                                horizontal: 16.0,
                              ),
                              decoration: BoxDecoration(
                                border: Border.all(
                                  color: AppColors.strokeWeak,
                                  width: 1,
                                ),
                                color: Colors.white, // Subtle background color
                                borderRadius: BorderRadius.circular(
                                    24.0), // Rounded corners
                              ),
                              child: Text(
                                entry.key,
                                style: AppTypography.textTheme.bodyMedium
                                    ?.copyWith(
                                  fontWeight: FontWeight.w500,
                                  fontSize: 12,
                                  color: AppColors.textWeak,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),

                        ...entry.value.map((visit) {
                          return InkWell(
                            onTap: () {
                              context.push(
                                "/visit-details",
                                extra: <String, VisitResponseData>{
                                  "visitDetails": visit
                                },
                              );
                            },
                            child: Container(
                              child: Column(
                                children: [
                                  const SizedBox(height: 8),
                                  CompletedCard(
                                    farmName: visit.site.name,
                                    farmType: visit.site.farmType ?? '',
                                    siteCode: visit.site.siteCode ?? '',
                                    visitDate: visit.visitScheduledAt.toLocal(),
                                    round: visit.round,
                                    sampleCount: visit.samples.length,
                                    sampleTypes: _getSampleTypesText(visit),
                                    onDownload: () =>
                                        _downloadVisitCsv(visit, context),
                                  ),
                                  const SizedBox(height: 8),
                                ],
                              ),
                            ),
                          );
                        }).toList(),
                      ],
                    );
                  }).toList(),
              ],
            ),
            // -- COMPLETED VISITS --
            if (filteredOfflineCompleted.isNotEmpty) ...[
              const SizedBox(height: 16),
              AppAccordion(
                title: 'Offline Completed Visits',
                itemCount: filteredOfflineCompleted.length,
                initiallyExpanded: false,
                child: Column(
                  children: filteredOfflineCompleted.map((visit) {
                    return InkWell(
                      onTap: () {
                        // context.push('/collection-details', extra: {
                        //   "visitDetails": visit,
                        // });
                        context.push(
                          "/visit-details",
                          extra: <String, VisitResponseData>{
                            "visitDetails": visit
                          },
                        );
                      },
                      child: Column(
                        children: [
                          const SizedBox(height: 8),
                          CompletedCard(
                            farmName: visit.site.name,
                            farmType: visit.site.farmType ?? '',
                            siteCode: visit.site.siteCode ?? '',
                            visitDate: visit.visitScheduledAt.toLocal(),
                            round: visit.round,
                            sampleCount: visit.samples.length,
                            sampleTypes: _getSampleTypesText(visit),
                            onDownload: () => _downloadVisitCsv(visit, context),
                          ),
                          const SizedBox(height: 8),
                        ],
                      ),
                    );
                  }).toList(),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  List<String> _getSampleTypesText(dynamic visit) {
    List<String> sampleTypes = [];

    // If we can access samples, try to extract sample types
    if (visit.samples != null && visit.samples?.isNotEmpty == true) {
      for (var sample in visit.samples) {
        if (sample?.sampleType?.name != null) {
          sampleTypes.add(sample.sampleType.name);
        }
      }
    } else {
      return [];
    }
    return sampleTypes;
  }

  Future<void> _downloadVisitCsv(
      VisitResponseData visit, BuildContext context) async {
    final siteName = visit.site.name;
    final visitDate = visit.visitedAt != null
        ? "${visit.visitedAt!.year}-${visit.visitedAt!.month.toString().padLeft(2, '0')}-${visit.visitedAt!.day.toString().padLeft(2, '0')}"
        : "";

    final coordinates = visit.site.location?.coordinates?.coordinates;
    final longitude = coordinates != null && coordinates.isNotEmpty
        ? coordinates[0].toString()
        : "";
    final latitude = coordinates != null && coordinates.length > 1
        ? coordinates[1].toString()
        : "";

    final List<List<dynamic>> rows = [
      [
        "site name",
        "date visited",
        "sample name",
        "barcode",
        "is replicate",
        "volume",
        "unit",
        "comment",
        "collected by",
        "latitude",
        "longitude"
      ]
    ];

    for (final sample in visit.samples) {
      final sampleName = sample.sampleType?.name ?? "";
      final barcode = sample.barcode;
      final isReplicate = sample.originalSampleId != null ? "Yes" : "No";
      final volume = sample.quantity?.toString() ?? "";
      final unit = sample.unit ?? "";
      final comment = sample.comment ?? "";

      final collectedByUser = sample.collectedBy ?? visit.collector;
      final collectedBy = collectedByUser != null
          ? "${collectedByUser.firstName ?? ""} ${collectedByUser.lastName ?? ""}"
              .trim()
          : "";

      rows.add([
        siteName,
        visitDate,
        sampleName,
        barcode,
        isReplicate,
        volume,
        unit,
        comment,
        collectedBy,
        latitude,
        longitude
      ]);
    }

    final csvContent = const ListToCsvConverter().convert(rows);

    try {
      final sanitizedSiteName = siteName.replaceAll(RegExp(r'[^\w\s]'), '_');
      final timestamp = DateTime.now().millisecondsSinceEpoch;
      final fileName = '${sanitizedSiteName}_visit_$timestamp.csv';

      // Web has no temp directory or dart:io file system, so download directly
      // instead of going through the share sheet.
      if (kIsWeb) {
        await XFile.fromData(
          utf8.encode(csvContent),
          name: fileName,
          mimeType: 'text/csv',
        ).saveTo(fileName);
        return;
      }

      final directory = await getTemporaryDirectory();
      final file = File('${directory.path}/$fileName');
      await file.writeAsString(csvContent);

      final xFile = XFile(file.path, mimeType: 'text/csv');

      final RenderBox? box =
          context.mounted ? context.findRenderObject() as RenderBox? : null;
      await SharePlus.instance.share(
        ShareParams(
          files: [xFile],
          text: 'Visit Data for $siteName',
          subject: 'Visit Data: $siteName',
          sharePositionOrigin:
              box != null ? box.localToGlobal(Offset.zero) & box.size : null,
        ),
      );
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to share CSV: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  // Helper function to get day of week
  String _getDayOfWeek(int day) {
    switch (day) {
      case 1:
        return 'Mon';
      case 2:
        return 'Tue';
      case 3:
        return 'Wed';
      case 4:
        return 'Thu';
      case 5:
        return 'Fri';
      case 6:
        return 'Sat';
      case 7:
        return 'Sun';
      default:
        return '';
    }
  }

  // Helper function to get month name
  String _getMonthName(int month) {
    switch (month) {
      case 1:
        return 'January';
      case 2:
        return 'February';
      case 3:
        return 'March';
      case 4:
        return 'April';
      case 5:
        return 'May';
      case 6:
        return 'June';
      case 7:
        return 'July';
      case 8:
        return 'August';
      case 9:
        return 'September';
      case 10:
        return 'October';
      case 11:
        return 'November';
      case 12:
        return 'December';
      default:
        return '';
    }
  }
}
