import 'package:es_client/es_client.dart';
import 'package:es_platform_mobile/views/samplecollection/review_visit_details.dart';
import 'package:es_platform_mobile/views/samplecollection/sucessess.dart';
import 'package:es_platform_mobile/views/sites/edit_collection_plan.dart';
import 'package:es_platform_mobile/views/sites/edit_site.dart';
import 'package:es_platform_mobile/views/visits/add_new_visit.dart';
import 'package:es_platform_mobile/views/visits/add_visit_details.dart';
import 'package:es_platform_mobile/views/visits/visit_details.dart';
import 'package:flutter/widgets.dart';
import 'package:go_router/go_router.dart';

import 'hooks/api.dart';
import 'utils/visit_flow_route_observer.dart';
import 'views/app_shell.dart';
import 'views/auth/index.dart';
import 'views/home/home.dart';
import 'views/profile/editprofile.dart';
import 'views/profile/profile.dart';
import 'views/samplecollection/barcodedetailscreen.dart';
import 'views/samplecollection/scanner/barcode_scanner_screen.dart';
import 'views/samplecollection/models/sample_data.dart';
import 'views/samplecollection/sampleduideline.dart';
import 'views/samplecollection/collection_type_screen.dart';
import 'views/samplecollection/sample_selection_metadata_screen.dart';
import 'views/samplecollection/clinical_metadata_screen.dart';
import 'views/samplecollection/environmental_metadata_screen.dart';
import 'views/samplecollection/sample_selection_screen.dart';

import 'views/samplecollection/environmental_barcode_entry_screen.dart';
import 'views/samplecollection/next_action_screen.dart';
import 'views/sites/create_site.dart';
import 'views/sites/site_details.dart';
import 'views/sites/sites.dart';
import 'views/team/team.dart';
import 'views/tenant/tenant_picker.dart';
import 'views/visits/collection_details.dart';
import 'views/visits/pending_visits.dart';
import 'views/visits/visits.dart';

const publicPaths = ['/auth/login', '/auth/verify-otp'];

final List<NavigatorObserver> _rootObservers = [
  visitFlowRouteObserver,
];

GoRouter router = GoRouter(
  initialLocation: '/',
  observers: _rootObservers,
  redirect: (context, state) async {
    final checkAuth = useIsAuthenticated(context);
    // Check if the user is going to a public path
    final isPublicPath = publicPaths.any((path) =>
        state.matchedLocation == path ||
        state.matchedLocation.startsWith(path));

    final isLoggedIn = await checkAuth();

    // If the user is not logged in and trying to access a protected route
    if (!isLoggedIn && !isPublicPath) {
      print("Navigating to login");
      return '/auth/login';
    }

    // If the user is logged in and trying to access login page
    if (isLoggedIn && state.matchedLocation == '/auth/login') {
      print("Navigating to login");
      return '/';
    }
    return null; // Return null to continue with the navigation
  },
  routes: <RouteBase>[
    // Auth routes without bottom navigation
    GoRoute(
      path: '/auth/login',
      builder: (BuildContext context, GoRouterState state) => Login(),
    ),
    GoRoute(
      path: '/auth/verify-otp',
      builder: (BuildContext context, GoRouterState state) {
        final extra = state.extra as Map<String, String>;
        return OtpScreen(
          identifier: extra['identifier']!,
          loginType: extra['loginType'] ?? 'phone',
        );
      },
    ),
    GoRoute(
      path: '/onboarding',
      builder: (BuildContext context, GoRouterState state) =>
          const OnboardingScreen(),
    ),
    GoRoute(
      path: '/onboardingadminstep1',
      builder: (BuildContext context, GoRouterState state) =>
          const OnbordingAdminstep1Screen(),
    ),
    GoRoute(
      path: '/onboardingadminstep2',
      builder: (BuildContext context, GoRouterState state) =>
          const OnbordingAdminstep2Screen(),
    ),
    GoRoute(
      path: '/onboardingcollectorlanding',
      builder: (BuildContext context, GoRouterState state) =>
          const OnboardingScreen(),
    ),
    GoRoute(
      path: '/onboardingcollectorstep1',
      builder: (BuildContext context, GoRouterState state) =>
          const OnbordingCollectorstep1Screen(),
    ),

    // Main app routes with bottom navigation
    ShellRoute(
      builder: (BuildContext context, GoRouterState state, Widget child) =>
          AppShell(child: child),
      routes: <RouteBase>[
        GoRoute(
          path: '/',
          builder: (BuildContext context, GoRouterState state) => const Home(),
        ),
        GoRoute(
          path: '/visits',
          builder: (BuildContext context, GoRouterState state) {
            final tabIndex =
                int.tryParse(state.uri.queryParameters['tab'] ?? '') ?? 0;
            final extra = state.extra;
            final from = (extra is Map ? extra['from'] as String? : null) ?? '';
            return Visits(
              initialTabIndex: tabIndex,
              from: from,
            );
          },
        ),
        GoRoute(
          path: '/sites',
          builder: (BuildContext context, GoRouterState state) {
            final extra = state.extra;
            final showSuccessSnackbar =
                (extra is Map ? extra['showSuccessSnackbar'] as bool? : null) ??
                    false;
            return Sites(showSuccessSnackbar: showSuccessSnackbar);
          },
        ),
        GoRoute(
          path: '/profile',
          builder: (BuildContext context, GoRouterState state) =>
              const Profile(),
        ),
        GoRoute(
          path: '/team',
          builder: (BuildContext context, GoRouterState state) =>
              TeamProgressScreen(),
        ),
        GoRoute(
          path: '/profile',
          builder: (BuildContext context, GoRouterState state) =>
              const Profile(),
        ),
        GoRoute(
          path: '/pending-visits',
          builder: (BuildContext context, GoRouterState state) =>
              const PendingVisits(),
        ),
        GoRoute(
          path: '/site-details',
          builder: (BuildContext context, GoRouterState state) {
            final extra = state.extra as Map;
            return SiteDetails(siteId: extra['siteId'] as String);
          },
        ),
        GoRoute(
          path: '/edit-site',
          builder: (BuildContext context, GoRouterState state) {
            final extra = state.extra as Map;
            return EditSite(siteId: extra['siteId'] as String);
          },
        ),
        GoRoute(
          path: '/edit-collection',
          builder: (BuildContext context, GoRouterState state) {
            final extra = state.extra as Map;
            return EditCollectionPlan(siteId: extra['siteId'] as String);
          },
        ),
      ],
    ),
    // Other routes without bottom navigation
    GoRoute(
      path: '/select-project',
      builder: (BuildContext context, GoRouterState state) =>
          TenantPickerScreen(next: state.uri.queryParameters['next']),
    ),
    GoRoute(
      path: '/collection-details',
      builder: (BuildContext context, GoRouterState state) {
        final extra = state.extra as Map;
        return CollectionDetails(
          visitDetails: extra['visitDetails'] as VisitResponseData,
        );
      },
    ),
    GoRoute(
      path: '/visit-details',
      builder: (BuildContext context, GoRouterState state) {
        final extra = state.extra as Map;
        return VisitDetailsScreen(
          visitDetails: extra['visitDetails'] as VisitResponseData,
        );
      },
    ),
    GoRoute(
      path: '/create-site',
      builder: (BuildContext context, GoRouterState state) {
        final extra =
            state.extra is Map ? state.extra as Map : <dynamic, dynamic>{};
        return CreateSite(
          origin: extra['origin'] as String? ?? '',
          collectorId: extra['collectorId'] as String? ?? '',
        );
      },
    ),
    GoRoute(
      path: '/EditProfile',
      builder: (BuildContext context, GoRouterState state) {
        final extra = state.extra as Map;
        return EditProfile(
          profile: extra['profile'] as UserProfileResponseData?,
        );
      },
    ),

    // GoRoute(
    //   path: '/AddvisitDetails',
    //   builder: (BuildContext context, GoRouterState state) => AddVisitDetails(
    //     visitDetails:
    //         (state.extra as Map<String, VisitResponseData>)['visitDetails']!,
    //   ),
    // ),

    GoRoute(
      path: '/AddvisitDetails',
      builder: (BuildContext context, GoRouterState state) {
        final extra = state.extra;
        final data =
            (extra is Map<String, dynamic>) ? extra : <String, dynamic>{};

        final visitDetails = data['visitDetails'] as VisitResponseData?;
        final collectorId = data['collectorId'] as String?;
        final showSuccessSnackbar =
            data['showSuccessSnackbar'] as bool? ?? false;

        if (visitDetails == null) {
          WidgetsBinding.instance.addPostFrameCallback((_) {
            context.go('/sites');
          });
          return const SizedBox.shrink();
        }

        return AddVisitDetails(
          visitDetails: visitDetails,
          collectorId: collectorId,
          showSuccessSnackbar: showSuccessSnackbar,
        );
      },
    ),

    // GoRoute(
    //   path: '/AddvisitDetails',
    //   builder: (BuildContext context, GoRouterState state) {
    //     final data = state.extra as Map<String, dynamic>;
    //     final visitDetails = data['visitDetails'] as VisitResponseData;
    //     final collectorId = data['collectorId'] as String?;

    //     return AddVisitDetails(
    //       visitDetails: visitDetails,
    //       collectorId: collectorId,
    //     );
    //   },
    // ),

    GoRoute(
      path: '/AddNewVisit',
      builder: (BuildContext context, GoRouterState state) {
        final extra = state.extra as Map<String, dynamic>? ?? {};
        return AddNewVisit(
          collectorId: extra['collectorId'] ?? '',
          // we'll check in the add visit page
          // isOnline: extra['isOnline'] ?? false,
        );
      },
    ),
    GoRoute(
      path: '/GuidelineSampleCollection',
      builder: (BuildContext context, GoRouterState state) {
        final Map<String, dynamic> extra = state.extra is Map
            ? Map<String, dynamic>.from(state.extra as Map)
            : <String, dynamic>{};
        return GuidelineSampleCollection(
          visitId: extra['visitId'] as String,
          updateVisitDto: extra['updateVisitDto'] as UpdateVisitDto,
          visitDetails: extra['visitDetails'] as VisitResponseData,
        );
      },
    ),

    GoRoute(
      path: '/CollectionTypeScreen',
      builder: (BuildContext context, GoRouterState state) {
        final Map<String, dynamic> extra = state.extra is Map
            ? Map<String, dynamic>.from(state.extra as Map)
            : <String, dynamic>{};
        return CollectionTypeScreen(
          visitId: extra['visitId'] as String,
          updateVisitDto: extra['updateVisitDto'] as UpdateVisitDto,
          visitDetails: extra['visitDetails'] as VisitResponseData,
          existingSamples: (extra['existingSamples'] as List<dynamic>?)
                  ?.cast<SampleData>() ??
              [],
        );
      },
    ),
    GoRoute(
      path: '/SampleSelectionScreen',
      builder: (BuildContext context, GoRouterState state) {
        final Map<String, dynamic> extra = state.extra is Map
            ? Map<String, dynamic>.from(state.extra as Map)
            : <String, dynamic>{};
        return SampleSelectionScreen(
          visitId: extra['visitId'] as String,
          updateVisitDto: extra['updateVisitDto'] as UpdateVisitDto,
          visitDetails: extra['visitDetails'] as VisitResponseData,
          flowType: extra['flowType'] as String? ?? 'Environmental',
          collectionType: extra['collectionType'] as String?,
          isBothFlow: extra['isBothFlow'] as bool? ?? false,
          completedFlows:
              (extra['completedFlows'] as List<dynamic>?)?.cast<String>() ?? [],
          clinicalMetadata: extra['clinicalMetadata'] as Map<String, dynamic>?,
          addMore: extra['addMore'] as bool? ?? false,
          existingSamplesSummary:
              (extra['existingSamplesSummary'] as List<dynamic>?)
                      ?.cast<SampleTypeCount>() ??
                  [],
          existingSamples: (extra['existingSamples'] as List<dynamic>?)
                  ?.cast<SampleData>() ??
              [],
          isNewAnimal: extra['isNewAnimal'] as bool? ?? false,
        );
      },
    ),
    GoRoute(
      path: '/ClinicalMetadataScreen',
      builder: (BuildContext context, GoRouterState state) {
        final Map<String, dynamic> extra = state.extra is Map
            ? Map<String, dynamic>.from(state.extra as Map)
            : <String, dynamic>{};
        return ClinicalMetadataScreen(
          visitId: extra['visitId'] as String,
          updateVisitDto: extra['updateVisitDto'] as UpdateVisitDto,
          visitDetails: extra['visitDetails'] as VisitResponseData,
          collectionType: extra['collectionType'] as String?,
          isBothFlow: extra['isBothFlow'] as bool? ?? false,
          completedFlows:
              (extra['completedFlows'] as List<dynamic>?)?.cast<String>() ?? [],
          existingSamples: (extra['existingSamples'] as List<dynamic>?)
                  ?.cast<SampleData>() ??
              [],
          isNewAnimal: extra['isNewAnimal'] as bool? ?? false,
        );
      },
    ),
    GoRoute(
      path: '/EnvironmentalMetadataScreen',
      builder: (BuildContext context, GoRouterState state) {
        final Map<String, dynamic> extra = state.extra is Map
            ? Map<String, dynamic>.from(state.extra as Map)
            : <String, dynamic>{};
        return EnvironmentalMetadataScreen(
          visitId: extra['visitId'] as String,
          updateVisitDto: extra['updateVisitDto'] as UpdateVisitDto,
          visitDetails: extra['visitDetails'] as VisitResponseData,
          selectedSamples: (extra['selectedSamples'] as List<dynamic>)
              .cast<SampleTypeCount>(),
          collectionType: extra['collectionType'] as String?,
          isBothFlow: extra['isBothFlow'] as bool? ?? false,
          completedFlows:
              (extra['completedFlows'] as List<dynamic>?)?.cast<String>() ?? [],
          existingSamples: (extra['existingSamples'] as List<dynamic>?)
                  ?.cast<SampleData>() ??
              [],
          clinicalMetadata: extra['clinicalMetadata'] as Map<String, dynamic>?,
          addMore: extra['addMore'] as bool? ?? false,
          existingMetadata: (extra['existingMetadata'] as Map?)?.map((k, v) =>
                  MapEntry(k as String, Map<String, dynamic>.from(v as Map))) ??
              {},
        );
      },
    ),
    GoRoute(
      path: '/EnvironmentalBarcodeEntryScreen',
      builder: (BuildContext context, GoRouterState state) {
        final Map<String, dynamic> extra = state.extra is Map
            ? Map<String, dynamic>.from(state.extra as Map)
            : <String, dynamic>{};
        return EnvironmentalBarcodeEntryScreen(
          selectedSamples: extra['selectedSamples'] as List<SampleTypeCount>,
          visitId: extra['visitId'] as String,
          updateVisitDto: extra['updateVisitDto'] as UpdateVisitDto,
          visitDetails: extra['visitDetails'] as VisitResponseData,
          collectionType: extra['collectionType'] as String?,
          currentFlow: extra['currentFlow'] as String?,
          isBothFlow: extra['isBothFlow'] as bool? ?? false,
          completedFlows:
              (extra['completedFlows'] as List<dynamic>?)?.cast<String>() ?? [],
          existingSamples: (extra['existingSamples'] as List<dynamic>?)
                  ?.cast<SampleData>() ??
              [],
          clinicalMetadata: extra['clinicalMetadata'] as Map<String, dynamic>?,
          isNewAnimal: extra['isNewAnimal'] as bool? ?? false,
        );
      },
    ),

    GoRoute(
      path: '/SampleSelectionAndMetadataScreen',
      builder: (BuildContext context, GoRouterState state) {
        final Map<String, dynamic> extra = state.extra is Map
            ? Map<String, dynamic>.from(state.extra as Map)
            : <String, dynamic>{};
        return SampleSelectionAndMetadataScreen(
          visitId: extra['visitId'] as String,
          updateVisitDto: extra['updateVisitDto'] as UpdateVisitDto,
          visitDetails: extra['visitDetails'] as VisitResponseData,
          collectionType: extra['collectionType'] as String?,
          currentFlow: extra['currentFlow'] as String?,
          isBothFlow: extra['isBothFlow'] as bool? ?? false,
          completedFlows:
              (extra['completedFlows'] as List<dynamic>?)?.cast<String>() ?? [],
          existingSamples:
              (extra['existingSamples'] as List<SampleData>?) ?? [],
        );
      },
    ),
    GoRoute(
      path: '/NextActionScreen',
      builder: (BuildContext context, GoRouterState state) {
        final Map<String, dynamic> extra = state.extra is Map
            ? Map<String, dynamic>.from(state.extra as Map)
            : <String, dynamic>{};
        return NextActionScreen(
          visitId: extra['visitId'] as String,
          updateVisitDto: extra['updateVisitDto'] as UpdateVisitDto,
          visitDetails: extra['visitDetails'] as VisitResponseData,
          collectionType: extra['collectionType'] as String?,
          currentFlow: extra['currentFlow'] as String?,
          isBothFlow: extra['isBothFlow'] as bool? ?? false,
          completedFlows:
              (extra['completedFlows'] as List<dynamic>?)?.cast<String>() ?? [],
          existingSamples: (extra['existingSamples'] as List<dynamic>?)
                  ?.cast<SampleData>() ??
              [],
        );
      },
    ),

    GoRoute(
      path: '/SuccessScreen',
      builder: (BuildContext context, GoRouterState state) {
        final Map<String, dynamic> extra = state.extra as Map<String, dynamic>;
        return SuccessScreen(
          totalSamples: extra['totalSamples'] as int,
          sampleTypes: extra['sampleTypes'] as String,
          profile: extra['profile'] as UserProfileResponseData,
          isOnline: extra['isOnline'] as bool,
        );
      },
    ),

    GoRoute(
      path: '/BarcodeScannerScreen',
      builder: (BuildContext context, GoRouterState state) {
        final Map<String, dynamic> extra =
            (state.extra as Map<String, dynamic>?) ?? {};
        return BarcodeScannerScreen(
          visitId: extra['visitId'] as String? ?? '',
          maxCount: extra['maxCount'] as int? ?? 1,
          existingBarcodes: (extra['existingBarcodes'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList(),
          alreadyScanned: extra['alreadyScanned'] as int? ?? 0,
          totalCount: extra['totalCount'] as int?,
          sampleType: extra['sampleType'] as String?,
        );
      },
    ),
    GoRoute(
      path: '/BarcodeVerificationScreen',
      builder: (BuildContext context, GoRouterState state) {
        final Map<String, dynamic> extra = state.extra as Map<String, dynamic>;
        return BarcodeVerificationScreen(
          barcode: extra['barcode'] as String,
          onBarcodeVerified: extra['onBarcodeVerified'] as Function(String)?,
        );
      },
    ),

    GoRoute(
      path: '/ReviewVisitDetails',
      builder: (BuildContext context, GoRouterState state) {
        final Map<String, dynamic> extra = state.extra is Map
            ? Map<String, dynamic>.from(state.extra as Map)
            : <String, dynamic>{};
        final UpdateVisitDto updateVisitDto =
            extra['updateVisitDto'] as UpdateVisitDto;
        return ReviewVisitDetails(
          visitId: extra['visitId'] as String,
          samples: (extra['samples'] as List<dynamic>).cast<SampleData>(),
          updateVisitDto: updateVisitDto,
          visitDetails: extra['visitDetails'] as VisitResponseData,
        );
      },
    ),
  ],
);

class AppRouter extends StatelessWidget {
  const AppRouter({super.key});

  @override
  Widget build(BuildContext context) {
    return const Placeholder();
  }
}
