//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

import 'dart:async';

import 'package:built_value/json_object.dart';
import 'package:built_value/serializer.dart';
import 'package:dio/dio.dart';

import 'package:es_client/src/api_util.dart';
import 'package:es_client/src/model/list_site_response.dart';

class SitesApi {

  final Dio _dio;

  final Serializers _serializers;

  const SitesApi(this._dio, this._serializers);

  /// sitesControllerFindAll
  /// 
  ///
  /// Parameters:
  /// * [search] 
  /// * [farmType] 
  /// * [assignedTo] 
  /// * [longitude] - Longitude of the location
  /// * [latitude] - Latitude of the location
  /// * [filterBy] 
  /// * [endDate] 
  /// * [startDate] 
  /// * [siteType] 
  /// * [disease] 
  /// * [testResult] 
  /// * [project] 
  /// * [cancelToken] - A [CancelToken] that can be used to cancel the operation
  /// * [headers] - Can be used to add additional headers to the request
  /// * [extras] - Can be used to add flags to the request
  /// * [validateStatus] - A [ValidateStatus] callback that can be used to determine request success based on the HTTP status of the response
  /// * [onSendProgress] - A [ProgressCallback] that can be used to get the send progress
  /// * [onReceiveProgress] - A [ProgressCallback] that can be used to get the receive progress
  ///
  /// Returns a [Future] containing a [Response] with a [ListSiteResponse] as data
  /// Throws [DioException] if API call or serialization fails
  Future<Response<ListSiteResponse>> sitesControllerFindAll({ 
    String? search,
    String? farmType,
    bool? assignedTo,
    num? longitude,
    num? latitude,
    String? filterBy,
    String? endDate,
    String? startDate,
    String? siteType,
    String? disease,
    String? testResult,
    String? project,
    CancelToken? cancelToken,
    Map<String, dynamic>? headers,
    Map<String, dynamic>? extra,
    ValidateStatus? validateStatus,
    ProgressCallback? onSendProgress,
    ProgressCallback? onReceiveProgress,
  }) async {
    final _path = r'/sites';
    final _options = Options(
      method: r'GET',
      headers: <String, dynamic>{
        ...?headers,
      },
      extra: <String, dynamic>{
        'secure': <Map<String, String>>[
          {
            'type': 'http',
            'scheme': 'bearer',
            'name': 'bearer',
          },
        ],
        ...?extra,
      },
      validateStatus: validateStatus,
    );

    final _queryParameters = <String, dynamic>{
      if (search != null) r'search': encodeQueryParameter(_serializers, search, const FullType(String)),
      if (farmType != null) r'farmType': encodeQueryParameter(_serializers, farmType, const FullType(String)),
      if (assignedTo != null) r'assignedTo': encodeQueryParameter(_serializers, assignedTo, const FullType(bool)),
      if (longitude != null) r'longitude': encodeQueryParameter(_serializers, longitude, const FullType(num)),
      if (latitude != null) r'latitude': encodeQueryParameter(_serializers, latitude, const FullType(num)),
      if (filterBy != null) r'filterBy': encodeQueryParameter(_serializers, filterBy, const FullType(String)),
      if (endDate != null) r'endDate': encodeQueryParameter(_serializers, endDate, const FullType(String)),
      if (startDate != null) r'startDate': encodeQueryParameter(_serializers, startDate, const FullType(String)),
      if (siteType != null) r'siteType': encodeQueryParameter(_serializers, siteType, const FullType(String)),
      if (disease != null) r'disease': encodeQueryParameter(_serializers, disease, const FullType(String)),
      if (testResult != null) r'testResult': encodeQueryParameter(_serializers, testResult, const FullType(String)),
      if (project != null) r'project': encodeQueryParameter(_serializers, project, const FullType(String)),
    };

    final _response = await _dio.request<Object>(
      _path,
      options: _options,
      queryParameters: _queryParameters,
      cancelToken: cancelToken,
      onSendProgress: onSendProgress,
      onReceiveProgress: onReceiveProgress,
    );

    ListSiteResponse? _responseData;

    try {
      final rawResponse = _response.data;
      _responseData = rawResponse == null ? null : _serializers.deserialize(
        rawResponse,
        specifiedType: const FullType(ListSiteResponse),
      ) as ListSiteResponse;

    } catch (error, stackTrace) {
      throw DioException(
        requestOptions: _response.requestOptions,
        response: _response,
        type: DioExceptionType.unknown,
        error: error,
        stackTrace: stackTrace,
      );
    }

    return Response<ListSiteResponse>(
      data: _responseData,
      headers: _response.headers,
      isRedirect: _response.isRedirect,
      requestOptions: _response.requestOptions,
      redirects: _response.redirects,
      statusCode: _response.statusCode,
      statusMessage: _response.statusMessage,
      extra: _response.extra,
    );
  }

}
