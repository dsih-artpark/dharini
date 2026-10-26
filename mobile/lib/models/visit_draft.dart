import 'dart:convert';
import '../utils/hive_serialization.dart';

class VisitDraft {
  final String visitId;
  final DateTime updatedAt;
  final int stepIndex; // e.g., 0 = AddVisitDetails, 1 = Guidelines, 2 = SelectSampleType, etc.
  final Map<String, dynamic> stepData; // Highly flexible map to store all Hook/state values of each screen

  VisitDraft({
    required this.visitId,
    required this.updatedAt,
    required this.stepIndex,
    required this.stepData,
  });

  factory VisitDraft.fromJson(Map<String, dynamic> json) {
    return VisitDraft(
      visitId: json['visitId']?.toString() ?? '',
      updatedAt: json['updatedAt'] != null
          ? DateTime.parse(json['updatedAt'].toString())
          : DateTime.now(),
      stepIndex: json['stepIndex'] as int? ?? 0,
      stepData: HiveSerialization.normalizeMap(json['stepData'] as Map?) ?? <String, dynamic>{},
    );
  }

  Map<String, dynamic> toJson() => {
        'visitId': visitId,
        'updatedAt': updatedAt.toIso8601String(),
        'stepIndex': stepIndex,
        'stepData': stepData,
      };

  VisitDraft copyWith({
    String? visitId,
    DateTime? updatedAt,
    int? stepIndex,
    Map<String, dynamic>? stepData,
  }) {
    return VisitDraft(
      visitId: visitId ?? this.visitId,
      updatedAt: updatedAt ?? this.updatedAt,
      stepIndex: stepIndex ?? this.stepIndex,
      stepData: stepData ?? this.stepData,
    );
  }

  @override
  String toString() {
    return 'VisitDraft(visitId: $visitId, stepIndex: $stepIndex, updatedAt: $updatedAt)';
  }
}
