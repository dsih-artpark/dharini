import 'dart:async';
import 'package:flutter/widgets.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import '../models/visit_draft.dart';
import '../services/visit_draft_repository.dart';

class VisitDraftController {
  final ValueNotifier<VisitDraft?> draftNotifier;
  final ValueNotifier<bool> isSavingNotifier;
  final Future<void> Function(Map<String, dynamic> data, int stepIndex) updateDraft;
  final Future<void> Function(Map<String, dynamic> data, int stepIndex) updateDraftImmediate;
  final Future<void> Function() clearDraft;
  final Future<void> Function() reload;

  VisitDraftController({
    required this.draftNotifier,
    required this.isSavingNotifier,
    required this.updateDraft,
    required this.updateDraftImmediate,
    required this.clearDraft,
    required this.reload,
  });

  VisitDraft? get draft => draftNotifier.value;
  bool get isSaving => isSavingNotifier.value;
}

VisitDraftController useVisitDraft(String visitId, {int initialStepIndex = 0}) {
  final draftState = useState<VisitDraft?>(null);
  final isSaving = useState<bool>(false);
  final debounceTimerRef = useRef<Timer?>(null);

  // A controller reference so we don't recreate listeners unnecessarily
  final activeDataRef = useRef<Map<String, dynamic>>({});

  // 1. Initial Load of Draft
  useEffect(() {
    bool isMounted = true;
    void loadDraft() async {
      final loaded = await VisitDraftRepository.getDraft(visitId);
      if (isMounted) {
        if (loaded != null) {
          draftState.value = loaded;
          activeDataRef.value = Map<String, dynamic>.from(loaded.stepData);
        } else {
          // Initialize fresh draft
          final newDraft = VisitDraft(
            visitId: visitId,
            updatedAt: DateTime.now(),
            stepIndex: initialStepIndex,
            stepData: {},
          );
          draftState.value = newDraft;
          activeDataRef.value = {};
        }
      }
    }

    loadDraft();
    return () {
      isMounted = false;
      debounceTimerRef.value?.cancel();
    };
  }, [visitId]);

  // 2. Debounced save function
  final saveDebounced = useCallback((Map<String, dynamic> data, int stepIndex) {
    // Update active data immediately in reference
    activeDataRef.value = data;

    // Cancel previous timer
    debounceTimerRef.value?.cancel();

    // Start a new timer for 300 milliseconds debounce
    debounceTimerRef.value = Timer(const Duration(milliseconds: 300), () async {
      if (draftState.value == null) return;
      isSaving.value = true;
      final updated = draftState.value!.copyWith(
        stepIndex: stepIndex,
        stepData: data,
        updatedAt: DateTime.now(),
      );
      await VisitDraftRepository.saveDraft(updated);
      draftState.value = updated;
      isSaving.value = false;
    });
  }, [visitId]);

  // 3. Immediate update draft function
  final updateDraftImmediate = useCallback((Map<String, dynamic> data, int stepIndex) async {
    debounceTimerRef.value?.cancel();
    if (draftState.value == null) return;
    isSaving.value = true;
    final updated = draftState.value!.copyWith(
      stepIndex: stepIndex,
      stepData: data,
      updatedAt: DateTime.now(),
    );
    // Update in-memory state SYNCHRONOUSLY — before the async disk write — so
    // that any effect running later in the same build pass (e.g. a screen's
    // debounced field auto-save) captures stepData that already includes this
    // write. Otherwise a debounced save scheduled with a pre-write snapshot
    // fires ~300ms later and reverts keys written here (notably the resume
    // marker). Also sync activeDataRef so the lifecycle emergency-save persists
    // the latest data rather than a stale snapshot.
    activeDataRef.value = data;
    draftState.value = updated;
    await VisitDraftRepository.saveDraft(updated);
    isSaving.value = false;
  }, [visitId]);

  // 4. Clear Draft function
  final clearDraft = useCallback(() async {
    debounceTimerRef.value?.cancel();
    await VisitDraftRepository.deleteDraft(visitId);
    draftState.value = null;
    activeDataRef.value = {};
  }, [visitId]);

  // 4b. Reload the draft from disk. Used when a screen is revealed via back
  // navigation: this controller loaded once on mount, so its in-memory stepData
  // is stale relative to keys persisted by screens pushed afterwards. Reloading
  // refreshes it so a subsequent full-snapshot save from this screen does not
  // clobber those downstream keys.
  final reload = useCallback(() async {
    final loaded = await VisitDraftRepository.getDraft(visitId);
    if (loaded != null) {
      draftState.value = loaded;
      activeDataRef.value = Map<String, dynamic>.from(loaded.stepData);
    }
  }, [visitId]);

  // 5. App Lifecycle Observer for auto-saving on background/suspend.
  //
  // ⚠️ Multi-screen safety: pushed routes keep prior screens' `useVisitDraft`
  // hooks alive — each registers its own observer. When the app backgrounds,
  // every observer fires. We MUST avoid an older screen's stale activeDataRef
  // clobbering a downstream screen's fresher write. The on-disk timestamp
  // check below ensures only the most recent in-memory state wins.
  useEffect(() {
    final observer = _AppLifecycleObserver(
      onInactiveOrPaused: () async {
        if (draftState.value == null || activeDataRef.value.isEmpty) return;
        try {
          final onDisk = await VisitDraftRepository.getDraft(visitId);
          if (onDisk != null &&
              onDisk.updatedAt.isAfter(draftState.value!.updatedAt)) {
            // A downstream screen already persisted a newer draft — skip to
            // avoid reverting their progress.
            print(
                '[useVisitDraft] Skipping background save: on-disk draft is newer than this hook\'s state.');
            return;
          }
          print(
              '[useVisitDraft] App going inactive/paused, performing emergency save...');
          await VisitDraftRepository.saveDraft(
            draftState.value!.copyWith(
              stepData: activeDataRef.value,
              updatedAt: DateTime.now(),
            ),
          );
        } catch (e) {
          print('[useVisitDraft] Emergency save failed: $e');
        }
      },
    );
    WidgetsBinding.instance.addObserver(observer);
    return () => WidgetsBinding.instance.removeObserver(observer);
  }, [visitId]);

  return useMemoized(
    () => VisitDraftController(
      draftNotifier: draftState,
      isSavingNotifier: isSaving,
      updateDraft: (data, stepIndex) async {
        saveDebounced(data, stepIndex);
      },
      updateDraftImmediate: updateDraftImmediate,
      clearDraft: clearDraft,
      reload: reload,
    ),
    [visitId, draftState, isSaving, saveDebounced, updateDraftImmediate, clearDraft, reload],
  );
}

class _AppLifecycleObserver extends WidgetsBindingObserver {
  final VoidCallback onInactiveOrPaused;

  _AppLifecycleObserver({required this.onInactiveOrPaused});

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.paused || state == AppLifecycleState.inactive) {
      onInactiveOrPaused();
    }
  }
}
