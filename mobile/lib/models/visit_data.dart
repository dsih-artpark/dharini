import 'package:hive/hive.dart';
import 'package:uuid/uuid.dart';

// Hive typeId registry — these must be unique across every adapter that is
// ever registered, or Hive throws at startup. Currently registered:
//   0  PendingVisitSubmission  (lib/models/pending_submission.dart)
// Generated but unregistered:
//   1  RegionResponseData      (lib/models/region_response_data.dart)
// Annotated, not generated (no `part` directive) — reserved so that adding
// one later cannot collide with the registered adapter above:
//   10 SiteData   11 VisitData   12 SampleData
@HiveType(typeId: 11)
class VisitData extends HiveObject {
  @HiveField(0)
  final String localId;

  @HiveField(1)
  final String? serverId;

  @HiveField(2)
  final String siteLocalId;

  @HiveField(3)
  String visitStatus;

  @HiveField(4)
  DateTime visitScheduledAt;

  @HiveField(5)
  DateTime? visitedAt;

  @HiveField(6)
  bool isCompleted;

  @HiveField(7)
  String? comment;

  @HiveField(8)
  bool isSynced;

  @HiveField(9)
  bool isSyncBlocked;

  @HiveField(10)
  List<String> sampleLocalIds;

  @HiveField(11)
  final DateTime createdAt;

  VisitData({
    String? localId,
    this.serverId,
    required this.siteLocalId,
    required this.visitStatus,
    required this.visitScheduledAt,
    this.visitedAt,
    this.isCompleted = false,
    this.comment,
    this.isSynced = false,
    this.isSyncBlocked = false,
    this.sampleLocalIds = const [],
    DateTime? createdAt,
  })  : localId = localId ?? const Uuid().v4(),
        createdAt = createdAt ?? DateTime.now();
}
