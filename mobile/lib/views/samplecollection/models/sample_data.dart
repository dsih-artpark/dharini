class SampleData {
  final String replicates;
  final List<String> photos;
  final List<String> diseases;
  final String originalSampleBarcode;
  final String barcode;
  final String comments;
  final String sampleType;
  final String sampleName;
  final num? quantity;
  final String? unit;
  final Map<String, dynamic>? metadata;

  SampleData({
    required this.replicates,
    required this.photos,
    required this.diseases,
    required this.originalSampleBarcode,
    required this.barcode,
    required this.comments,
    required this.sampleType,
    required this.sampleName,
    this.quantity,
    this.unit,
    this.metadata,
  });

  Map<String, dynamic> toJson() => {
        'replicates': replicates,
        'photos': photos,
        'diseases': diseases,
        'originalSampleBarcode': originalSampleBarcode,
        'barcode': barcode,
        'comments': comments,
        'sampleType': sampleType,
        'sampleName': sampleName,
        'quantity': quantity,
        'unit': unit,
        if (metadata != null && metadata!.isNotEmpty) 'metadata': metadata,
      };

  factory SampleData.fromJson(Map<String, dynamic> json) {
    return SampleData(
      replicates: json['replicates']?.toString() ?? '',
      photos: (json['photos'] as List?)?.map((e) => e.toString()).toList() ?? const [],
      diseases: (json['diseases'] as List?)?.map((e) => e.toString()).toList() ?? const [],
      originalSampleBarcode: json['originalSampleBarcode']?.toString() ?? '',
      barcode: json['barcode']?.toString() ?? '',
      comments: json['comments']?.toString() ?? '',
      sampleType: json['sampleType']?.toString() ?? '',
      sampleName: json['sampleName']?.toString() ?? '',
      quantity: json['quantity'] as num?,
      unit: json['unit']?.toString(),
      metadata: json['metadata'] is Map ? Map<String, dynamic>.from(json['metadata'] as Map) : null,
    );
  }

  @override
  String toString() {
    return 'SampleData${toJson()}';
  }
}

class VisitSubmitData {
  final String siteId;
  final String visitedBy;
  final String projectId;
  final String teamId;
  final bool isCompleted;
  final List<SampleData> samples;

  VisitSubmitData({
    required this.siteId,
    required this.visitedBy,
    required this.projectId,
    required this.teamId,
    required this.isCompleted,
    required this.samples,
  });

  Map<String, dynamic> toJson() => {
        'visitData': {
          'siteId': siteId,
          'visitedBy': visitedBy,
          'projectId': projectId,
          'teamId': teamId,
          'isCompleted': isCompleted,
        },
        'samples': samples.map((sample) => sample.toJson()).toList(),
      };
}

class SampleTypeCount {
  final String type;
  final int count;
  final String sampleId;
  final String? emojiIcon;

  SampleTypeCount({
    required this.type,
    required this.count,
    required this.sampleId,
    this.emojiIcon,
  });

  Map<String, dynamic> toJson() => {
        'type': type,
        'count': count,
        'sampleId': sampleId,
        'emojiIcon': emojiIcon,
      };

  factory SampleTypeCount.fromJson(Map<String, dynamic> json) {
    return SampleTypeCount(
      type: json['type']?.toString() ?? '',
      count: json['count'] as int? ?? 0,
      sampleId: json['sampleId']?.toString() ?? '',
      emojiIcon: json['emojiIcon']?.toString(),
    );
  }
}

