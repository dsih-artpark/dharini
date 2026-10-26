import 'package:flutter/widgets.dart';

/// Observes the visit sample-collection route stack so each flow screen can
/// re-record its resume marker when it becomes visible again after a child
/// route is popped (back navigation). Registered in the GoRouter's root
/// observers (see router.dart).
/// Registered on the ROOT navigator (see router.dart). Visit-flow screens must
/// remain root-level GoRoutes (not inside the ShellRoute) for this observer to fire.
final RouteObserver<PageRoute<dynamic>> visitFlowRouteObserver =
    RouteObserver<PageRoute<dynamic>>();
