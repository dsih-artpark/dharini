class SampleData {
  final String replicates;
  final List<String> photos;
  final List<String> diseases;
  final String originalSampleBarcode;
  final String barcode;
  final String comments;
  final String sampleType;

  SampleData({
    required this.replicates,
    required this.photos,
    required this.diseases,
    required this.originalSampleBarcode,
    required this.barcode,
    required this.comments,
    required this.sampleType,
  });

  Map<String, dynamic> toJson() => {
        'replicates': replicates,
        'photos': photos,
        'diseases': diseases,
        'originalSampleBarcode': originalSampleBarcode,
        'barcode': barcode,
        'comments': comments,
        'sampleType': sampleType,
      };
}
