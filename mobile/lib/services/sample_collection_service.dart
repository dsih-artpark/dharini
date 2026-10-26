import 'dart:convert';
import 'package:http/http.dart' as http;
import '../views/samplecollection/models/sample_data.dart';

class SampleCollectionService {
  final String baseUrl;
  final String token;

  SampleCollectionService({
    required this.baseUrl,
    required this.token,
  });

  Future<Map<String, dynamic>> collectSamples({
    required String visitId,
    required List<SampleData> samples,
  }) async {
    final url = Uri.parse('$baseUrl/api/v1/visits/$visitId/samples');

    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'samples': samples
            .map((sample) => {
                  'replicates': sample.replicates,
                  'photos': sample.photos,
                  'diseases': sample.diseases,
                  'originalSampleBarcode': sample.originalSampleBarcode,
                  'barcode': sample.barcode,
                  'comments': sample.comments,
                  'sampleType': sample.sampleType,
                })
            .toList(),
      }),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to collect samples: ${response.statusCode}');
    }
  }
}
