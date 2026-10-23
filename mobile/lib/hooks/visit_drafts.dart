import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:hive_flutter/hive_flutter.dart';

import '../services/visit_draft_repository.dart';

/// Reactively exposes the set of visitIds that currently have a saved draft.
///
/// Backed by the Hive `visitDrafts` box (opened at startup in
/// `DatabaseService.init`), keyed by visitId — so the returned set updates as
/// drafts are created or deleted while the widget is mounted (e.g. a draft is
/// saved mid-visit, or cleared via "Start Fresh"/submit).
Set<String> useDraftVisitIds() {
  final box = Hive.box<String>(VisitDraftRepository.boxName);
  useListenable(box.listenable());
  return box.keys.map((k) => k.toString()).toSet();
}
