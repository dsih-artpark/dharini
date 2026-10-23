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
@HiveType(typeId: 12)
class SampleData extends HiveObject {
  @HiveField(0)
  final String localId;

  @HiveField(1)
  final String? serverId;

  @HiveField(2)
  final String visitLocalId;

  @HiveField(3)
  String sampleCode;

  @HiveField(4)
  String status;

  @HiveField(5)
  DateTime collectedAt;

  @HiveField(6)
  bool isSynced;

  @HiveField(7)
  bool isSyncBlocked;

  @HiveField(8)
  final DateTime createdAt;

  SampleData({
    String? localId,
    this.serverId,
    required this.visitLocalId,
    required this.sampleCode,
    required this.status,
    required this.collectedAt,
    this.isSynced = false,
    this.isSyncBlocked = false,
    DateTime? createdAt,
  })  : localId = localId ?? const Uuid().v4(),
        createdAt = createdAt ?? DateTime.now();
}
