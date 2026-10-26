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
@HiveType(typeId: 10)
class SiteData extends HiveObject {
  @HiveField(0)
  final String localId;

  @HiveField(1)
  final String? serverId;

  @HiveField(2)
  bool isSynced;

  @HiveField(3)
  bool isSyncBlocked;

  @HiveField(4)
  List<String> collectionDayOfWeek;

  @HiveField(5)
  String farmType;

  @HiveField(6)
  String siteType;

  @HiveField(7)
  List<String> photos;

  @HiveField(8)
  String regionId;

  @HiveField(9)
  double latitude;

  @HiveField(10)
  double longitude;

  @HiveField(11)
  String collectionCollector;

  @HiveField(12)
  String name;

  @HiveField(13)
  String siteCode;

  @HiveField(14)
  String? collectionConsent;

  @HiveField(15)
  int collectionFrequencyInterval;

  @HiveField(16)
  int collectionFrequency;

  @HiveField(17)
  String collectionTime;

  @HiveField(18)
  DateTime? collectionStartDate;

  @HiveField(19)
  DateTime? collectionLastScheduleDate;

  @HiveField(20)
  int collectionDuration;

  @HiveField(21)
  DateTime? collectionExpiryDate;

  @HiveField(22)
  String siteOwnerName;

  @HiveField(23)
  String siteOwnerNumber;

  @HiveField(24)
  int workerNumber;

  @HiveField(25)
  String address;

  @HiveField(26)
  int pinCode;

  @HiveField(27)
  String comment;

  @HiveField(28)
  final DateTime createdAt;

  SiteData({
    String? localId,
    this.serverId,
    this.isSynced = false,
    this.isSyncBlocked = false,
    required this.collectionDayOfWeek,
    required this.farmType,
    required this.siteType,
    required this.photos,
    required this.regionId,
    required this.latitude,
    required this.longitude,
    required this.collectionCollector,
    required this.name,
    required this.siteCode,
    this.collectionConsent,
    required this.collectionFrequencyInterval,
    required this.collectionFrequency,
    required this.collectionTime,
    this.collectionStartDate,
    this.collectionLastScheduleDate,
    required this.collectionDuration,
    this.collectionExpiryDate,
    required this.siteOwnerName,
    required this.siteOwnerNumber,
    required this.workerNumber,
    required this.address,
    required this.pinCode,
    required this.comment,
    DateTime? createdAt,
  })  : localId = localId ?? const Uuid().v4(),
        createdAt = createdAt ?? DateTime.now();

  /// Convert model to JSON (for API request)
  Map<String, dynamic> toJson({required String projectId}) {
    return {
      "projectId": projectId,
      "collectionDayOfWeek": collectionDayOfWeek,
      "farmType": farmType,
      "siteType": siteType,
      "photos": photos,
      "regionId": regionId,
      "latitude": latitude,
      "longitude": longitude,
      "collectionCollector": collectionCollector,
      "name": name,
      "siteCode": siteCode,
      "collectionConsent": collectionConsent,
      "collectionFrequencyInterval": collectionFrequencyInterval,
      "collectionFrequency": collectionFrequency,
      "collectionTime": collectionTime,
      "collectionStartDate": collectionStartDate?.toIso8601String(),
      "collectionLastScheduleDate":
          collectionLastScheduleDate?.toIso8601String(),
      "collectionDuration": collectionDuration,
      "collectionExpiryDate": collectionExpiryDate?.toIso8601String(),
      "siteOwnerName": siteOwnerName,
      "siteOwnerNumber": siteOwnerNumber,
      "workerNumber": workerNumber,
      "address": address,
      "pinCode": pinCode,
      "comment": comment,
    };
  }

  /// Create model instance from server JSON response
  factory SiteData.fromServerJson(Map<String, dynamic> json) {
    return SiteData(
      serverId: json["id"],
      collectionDayOfWeek: List<String>.from(json["collectionDayOfWeek"] ?? []),
      farmType: json["farmType"] ?? "",
      siteType: json["siteType"] ?? "",
      photos: List<String>.from(json["photos"] ?? []),
      regionId: json["location"]?["region"]?["id"] ?? "",
      latitude: (json["location"]?["coordinates"]?["coordinates"]?[1] ?? 0.0)
          .toDouble(),
      longitude: (json["location"]?["coordinates"]?["coordinates"]?[0] ?? 0.0)
          .toDouble(),
      collectionCollector: json["collectionCollector"]?["id"] ?? "",
      name: json["name"] ?? "",
      siteCode: json["siteCode"] ?? "",
      collectionConsent: json["collectionConsent"],
      collectionFrequencyInterval: json["collectionFrequencyInterval"] ?? 0,
      collectionFrequency: json["collectionFrequency"] ?? 0,
      collectionTime: json["collectionTime"] ?? "",
      collectionStartDate: _parseDate(json["collectionStartDate"]),
      collectionLastScheduleDate:
          _parseDate(json["collectionLastScheduleDate"]),
      collectionDuration: json["collectionDuration"] ?? 0,
      collectionExpiryDate: _parseDate(json["collectionExpiryDate"]),
      siteOwnerName: json["siteOwnerName"] ?? "",
      siteOwnerNumber: json["siteOwnerNumber"] ?? "",
      workerNumber: json["workerNumber"] ?? 0,
      address: json["address"] ?? "",
      pinCode: json["pinCode"] ?? 0,
      comment: json["comment"] ?? "",
      createdAt: _parseDate(json["createdAt"]) ?? DateTime.now(),
      isSynced: true,
      isSyncBlocked: false,
    );
  }

  /// Utility date parser
  static DateTime? _parseDate(dynamic value) {
    if (value == null) return null;
    try {
      return DateTime.parse(value);
    } catch (_) {
      return null;
    }
  }
}
