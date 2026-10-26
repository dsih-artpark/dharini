import 'package:hive/hive.dart';

part 'pending_submission.g.dart';

@HiveType(typeId: 0)
class PendingVisitSubmission extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final Map<String, dynamic> data;

  @HiveField(2)
  final List<String> photoFiles;

  @HiveField(3)
  final DateTime createdAt;

  @HiveField(4)
  final bool isUploading;

  @HiveField(5)
  final String? error;

  /// The project this submission was captured against.
  ///
  /// This is a property of the *record*, not of whatever project happens to
  /// be selected in the UI when the queue is flushed later — a collector can
  /// queue visits offline, switch projects, regain signal, and each queued
  /// visit must still land in the project it was actually captured in. Scoping
  /// the flush to the current selection instead of this field is exactly what
  /// strands or misfiles offline records; see `SyncService.sync()`.
  ///
  /// New field index (6) — chosen because 0-5 are already in use by rows
  /// persisted by earlier app versions. NEVER renumber or reuse an existing
  /// index: Hive's binary format keys fields by index, so reusing one would
  /// silently corrupt already-stored rows.
  ///
  /// Nullable and defaulted (see constructor) so pre-upgrade rows — persisted
  /// before this field existed — deserialize safely: Hive simply omits index 6
  /// from `fields` for those rows, `fields[6] as String?` reads as `null`, and
  /// the constructor below recovers the value from the submission's own
  /// `data['visitData']['projectId']`, which every row (old and new) already
  /// carries. Nothing crashes and nothing is silently mis-tagged.
  @HiveField(6)
  final String? projectId;

  /// Companion workspace tag; same reasoning and same safety story as
  /// [projectId]. May legitimately stay null even for freshly captured rows
  /// if the app version in play at capture time had no workspace concept yet
  /// — `projectId` is the field the flush path actually depends on.
  @HiveField(7)
  final String? workspaceId;

  PendingVisitSubmission({
    required this.id,
    required this.data,
    required this.photoFiles,
    required this.createdAt,
    this.isUploading = false,
    this.error,
    String? projectId,
    String? workspaceId,
  })  : projectId = projectId ?? _tenantIdFromData(data, 'projectId'),
        workspaceId = workspaceId ?? _tenantIdFromData(data, 'workspaceId');

  /// Best-effort recovery of a tenant id embedded in the submission's own
  /// `visitData` payload, used whenever the caller doesn't pass an explicit
  /// [projectId]/[workspaceId] — including when the Hive adapter reads a
  /// pre-upgrade row (a missing field index just yields `null`, which arrives
  /// here exactly as if the caller hadn't passed one). `visitData` already
  /// carries the project id it was captured against (see
  /// `review_visit_details.dart`'s `visitDataMap`), so this recovers the
  /// correct tag for old rows instead of guessing or leaving them untagged.
  static String? _tenantIdFromData(Map<String, dynamic> data, String key) {
    final visitData = data['visitData'];
    if (visitData is Map) {
      final value = visitData[key];
      if (value != null) return value.toString();
    }
    return null;
  }

  factory PendingVisitSubmission.fromVisitData({
    required Map<String, dynamic> visitData,
    required List<Map<String, dynamic>> samples,
    required List<String> photoFiles,
    String? projectId,
    String? workspaceId,
  }) {
    return PendingVisitSubmission(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      data: {
        'visitData': visitData,
        'samples': samples,
      },
      photoFiles: List<String>.from(photoFiles),
      createdAt: DateTime.now(),
      projectId: projectId,
      workspaceId: workspaceId,
    );
  }

  PendingVisitSubmission copyWith({
    String? id,
    Map<String, dynamic>? data,
    List<String>? photoFiles,
    DateTime? createdAt,
    bool? isUploading,
    String? error,
    String? projectId,
    String? workspaceId,
  }) {
    return PendingVisitSubmission(
      id: id ?? this.id,
      data: data ?? this.data,
      photoFiles: photoFiles ?? this.photoFiles,
      createdAt: createdAt ?? this.createdAt,
      isUploading: isUploading ?? this.isUploading,
      error: error ?? this.error,
      projectId: projectId ?? this.projectId,
      workspaceId: workspaceId ?? this.workspaceId,
    );
  }
}
