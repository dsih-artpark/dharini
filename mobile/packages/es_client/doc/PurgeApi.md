# es_client.api.PurgeApi

## Load the API package
```dart
import 'package:es_client/api.dart';
```

All URIs are relative to *http://localhost:4000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**purgeControllerDeleteProject**](PurgeApi.md#purgecontrollerdeleteproject) | **DELETE** /purge/project/{projectId} | Purge a project and all its cascading dependencies
[**purgeControllerDeleteSample**](PurgeApi.md#purgecontrollerdeletesample) | **DELETE** /purge/sample/{sampleId} | Purge a sample and all its cascading dependencies
[**purgeControllerDeleteSite**](PurgeApi.md#purgecontrollerdeletesite) | **DELETE** /purge/site/{siteId} | Purge a site and all its cascading dependencies
[**purgeControllerDeleteVisit**](PurgeApi.md#purgecontrollerdeletevisit) | **DELETE** /purge/visit/{visitId} | Purge a visit and all its cascading dependencies


# **purgeControllerDeleteProject**
> purgeControllerDeleteProject(projectId)

Purge a project and all its cascading dependencies

### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getPurgeApi();
final String projectId = projectId_example; // String | Project ID

try {
    api.purgeControllerDeleteProject(projectId);
} on DioException catch (e) {
    print('Exception when calling PurgeApi->purgeControllerDeleteProject: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project ID | 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **purgeControllerDeleteSample**
> purgeControllerDeleteSample(sampleId)

Purge a sample and all its cascading dependencies

### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getPurgeApi();
final String sampleId = sampleId_example; // String | Sample UUID

try {
    api.purgeControllerDeleteSample(sampleId);
} on DioException catch (e) {
    print('Exception when calling PurgeApi->purgeControllerDeleteSample: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **sampleId** | **String**| Sample UUID | 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **purgeControllerDeleteSite**
> purgeControllerDeleteSite(siteId)

Purge a site and all its cascading dependencies

### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getPurgeApi();
final String siteId = siteId_example; // String | Site UUID

try {
    api.purgeControllerDeleteSite(siteId);
} on DioException catch (e) {
    print('Exception when calling PurgeApi->purgeControllerDeleteSite: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **siteId** | **String**| Site UUID | 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **purgeControllerDeleteVisit**
> purgeControllerDeleteVisit(visitId)

Purge a visit and all its cascading dependencies

### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getPurgeApi();
final String visitId = visitId_example; // String | Visit UUID

try {
    api.purgeControllerDeleteVisit(visitId);
} on DioException catch (e) {
    print('Exception when calling PurgeApi->purgeControllerDeleteVisit: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **visitId** | **String**| Visit UUID | 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

