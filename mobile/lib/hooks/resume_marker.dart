import 'package:flutter/widgets.dart';
import 'package:flutter_hooks/flutter_hooks.dart';

import 'package:es_platform_mobile/hooks/visit_draft.dart';
import 'package:es_platform_mobile/utils/visit_flow_route_observer.dart';

/// Records a navigation marker (`resumeRoute` + `resumeArgs`) into the visit
/// draft so the app can resume to the exact screen after a kill.
///
/// - Writes once on mount (after the draft has loaded).
/// - Re-writes when this screen is revealed after a child route pops, so the
///   marker always reflects the *visible* screen — including after a back tap.
///
/// `buildArgs` must return ONLY JSON-serializable, immutable routing context
/// (scalars, lists of `toJson()` maps). Mutable field state (answers, groups)
/// is persisted separately by each screen and rebuilt by the resumer from
/// stepData — do not put it in `resumeArgs`.
void useResumeMarker({
  required VisitDraftController draft,
  required String route,
  required Map<String, dynamic> Function() buildArgs,
  required int stepIndex,
}) {
  final context = useContext();
  final hasMarkedOnMount = useRef<bool>(false);
  // Always call the latest buildArgs so the back-reveal re-write (whose effect
  // captures the mount-time closure) never reads a stale args builder.
  final buildArgsRef = useRef<Map<String, dynamic> Function()>(buildArgs);
  buildArgsRef.value = buildArgs;

  void writeMarker() {
    final current = draft.draft;
    if (current == null) return;
    final data = Map<String, dynamic>.from(current.stepData);
    data['resumeRoute'] = route;
    data['resumeArgs'] = buildArgsRef.value();
    // Immediate write also cancels any pending debounced field-save on the
    // shared controller; on mount no user input has been entered yet, so
    // nothing is lost, and subsequent field saves re-include resumeRoute.
    draft.updateDraftImmediate(data, stepIndex);
  }

  // 1. Record on mount, once the (async) draft load completes.
  useEffect(() {
    if (!hasMarkedOnMount.value && draft.draft != null) {
      hasMarkedOnMount.value = true;
      writeMarker();
    }
    return null;
  }, [draft.draft != null]);

  // 2. Re-record when revealed after a child route pops (back navigation).
  //
  // `ModalRoute.of(context)` registers an inherited-widget dependency, which
  // flutter_hooks forbids while an effect runs during the init phase
  // ("Cannot listen to inherited widgets inside HookState.initState"). Defer
  // the lookup + subscription to a post-frame callback so it runs after the
  // first frame, outside that phase.
  final awareRef = useRef<_ResumeMarkerAware?>(null);
  useEffect(() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!context.mounted) return;
      // Skip if not on a PageRoute (e.g. inside a dialog) — not expected in the
      // visit flow, but avoids subscribing to the wrong route.
      final modalRoute = ModalRoute.of(context);
      if (modalRoute is! PageRoute<dynamic>) return;
      final aware = _ResumeMarkerAware(onRevealed: () {
        // On back-reveal this controller's stepData is stale (loaded before
        // downstream screens persisted their keys). Reload from disk first so
        // the marker re-stamp — and any later save from this screen — preserves
        // those downstream keys instead of overwriting them with a stale copy.
        draft.reload().then((_) => writeMarker());
      });
      awareRef.value = aware;
      visitFlowRouteObserver.subscribe(aware, modalRoute);
    });
    return () {
      final aware = awareRef.value;
      if (aware != null) {
        visitFlowRouteObserver.unsubscribe(aware);
        awareRef.value = null;
      }
    };
  }, const []);
}

// Only didPopNext is relevant: re-stamp the marker when this screen is
// revealed after a child route pops. Other RouteAware callbacks are intentionally
// not handled.
class _ResumeMarkerAware extends RouteAware {
  final VoidCallback onRevealed;
  _ResumeMarkerAware({required this.onRevealed});

  @override
  void didPopNext() => onRevealed();
}
