# es_client.api.DataImportApi

## Load the API package
```dart
import 'package:es_client/api.dart';
```

All URIs are relative to *http://localhost:4000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**dataImportControllerDownloadTemplate**](DataImportApi.md#dataimportcontrollerdownloadtemplate) | **GET** /projects/{projectId}/data-import/template | 
[**dataImportControllerUploadCollection**](DataImportApi.md#dataimportcontrolleruploadcollection) | **POST** /projects/{projectId}/data-import/collection | 
[**dataImportControllerUploadLab**](DataImportApi.md#dataimportcontrolleruploadlab) | **POST** /projects/{projectId}/data-import/lab | 


# **dataImportControllerDownloadTemplate**
> dataImportControllerDownloadTemplate(projectId, diseaseGroup, section)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getDataImportApi();
final String projectId = projectId_example; // String | 
final String diseaseGroup = diseaseGroup_example; // String | 
final String section = section_example; // String | 

try {
    api.dataImportControllerDownloadTemplate(projectId, diseaseGroup, section);
} on DioException catch (e) {
    print('Exception when calling DataImportApi->dataImportControllerDownloadTemplate: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**|  | 
 **diseaseGroup** | **String**|  | 
 **section** | **String**|  | 

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **dataImportControllerUploadCollection**
> dataImportControllerUploadCollection(projectId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getDataImportApi();
final String projectId = projectId_example; // String | 

try {
    api.dataImportControllerUploadCollection(projectId);
} on DioException catch (e) {
    print('Exception when calling DataImportApi->dataImportControllerUploadCollection: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**|  | 

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **dataImportControllerUploadLab**
> dataImportControllerUploadLab(projectId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getDataImportApi();
final String projectId = projectId_example; // String | 

try {
    api.dataImportControllerUploadLab(projectId);
} on DioException catch (e) {
    print('Exception when calling DataImportApi->dataImportControllerUploadLab: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**|  | 

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

