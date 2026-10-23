# es_client.api.SequencingApi

## Load the API package
```dart
import 'package:es_client/api.dart';
```

All URIs are relative to *http://localhost:4000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**sequencingControllerGetAllJobs**](SequencingApi.md#sequencingcontrollergetalljobs) | **GET** /sequencing/jobs | 
[**sequencingControllerGetAllSubmissions**](SequencingApi.md#sequencingcontrollergetallsubmissions) | **GET** /sequencing | 
[**sequencingControllerGetArtifactUrl**](SequencingApi.md#sequencingcontrollergetartifacturl) | **GET** /sequencing/jobs/{id}/artifacts/{filename}/url | 
[**sequencingControllerGetJob**](SequencingApi.md#sequencingcontrollergetjob) | **GET** /sequencing/jobs/{id} | 
[**sequencingControllerGetJobArtifacts**](SequencingApi.md#sequencingcontrollergetjobartifacts) | **GET** /sequencing/jobs/{id}/artifacts | 
[**sequencingControllerGetJobProgress**](SequencingApi.md#sequencingcontrollergetjobprogress) | **GET** /sequencing/jobs/{id}/progress | 
[**sequencingControllerGetJobVariants**](SequencingApi.md#sequencingcontrollergetjobvariants) | **GET** /sequencing/jobs/{id}/variants | 
[**sequencingControllerGetNcbiPreview**](SequencingApi.md#sequencingcontrollergetncbipreview) | **GET** /sequencing/ncbi/preview | 
[**sequencingControllerGetPipelines**](SequencingApi.md#sequencingcontrollergetpipelines) | **GET** /sequencing/pipelines | 
[**sequencingControllerGetQueue**](SequencingApi.md#sequencingcontrollergetqueue) | **GET** /sequencing/queue | 
[**sequencingControllerGetSubmission**](SequencingApi.md#sequencingcontrollergetsubmission) | **GET** /sequencing/{id} | 
[**sequencingControllerPresignUpload**](SequencingApi.md#sequencingcontrollerpresignupload) | **POST** /sequencing/uploads/presign | 
[**sequencingControllerRetryJob**](SequencingApi.md#sequencingcontrollerretryjob) | **POST** /sequencing/jobs/{id}/retry | 
[**sequencingControllerSearchLabSamples**](SequencingApi.md#sequencingcontrollersearchlabsamples) | **GET** /sequencing/lab-samples/search | 
[**sequencingControllerSubmitJob**](SequencingApi.md#sequencingcontrollersubmitjob) | **POST** /sequencing/jobs/submit | 


# **sequencingControllerGetAllJobs**
> sequencingControllerGetAllJobs(workspaceId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getSequencingApi();
final String workspaceId = workspaceId_example; // String | 

try {
    api.sequencingControllerGetAllJobs(workspaceId);
} on DioException catch (e) {
    print('Exception when calling SequencingApi->sequencingControllerGetAllJobs: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **workspaceId** | **String**|  | 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **sequencingControllerGetAllSubmissions**
> sequencingControllerGetAllSubmissions(workspaceId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getSequencingApi();
final String workspaceId = workspaceId_example; // String | 

try {
    api.sequencingControllerGetAllSubmissions(workspaceId);
} on DioException catch (e) {
    print('Exception when calling SequencingApi->sequencingControllerGetAllSubmissions: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **workspaceId** | **String**|  | 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **sequencingControllerGetArtifactUrl**
> sequencingControllerGetArtifactUrl(id, filename, inline)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getSequencingApi();
final String id = id_example; // String | 
final String filename = filename_example; // String | 
final String inline = inline_example; // String | 

try {
    api.sequencingControllerGetArtifactUrl(id, filename, inline);
} on DioException catch (e) {
    print('Exception when calling SequencingApi->sequencingControllerGetArtifactUrl: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **filename** | **String**|  | 
 **inline** | **String**|  | 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **sequencingControllerGetJob**
> sequencingControllerGetJob(id)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getSequencingApi();
final String id = id_example; // String | 

try {
    api.sequencingControllerGetJob(id);
} on DioException catch (e) {
    print('Exception when calling SequencingApi->sequencingControllerGetJob: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **sequencingControllerGetJobArtifacts**
> sequencingControllerGetJobArtifacts(id)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getSequencingApi();
final String id = id_example; // String | 

try {
    api.sequencingControllerGetJobArtifacts(id);
} on DioException catch (e) {
    print('Exception when calling SequencingApi->sequencingControllerGetJobArtifacts: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **sequencingControllerGetJobProgress**
> sequencingControllerGetJobProgress(id)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getSequencingApi();
final String id = id_example; // String | 

try {
    api.sequencingControllerGetJobProgress(id);
} on DioException catch (e) {
    print('Exception when calling SequencingApi->sequencingControllerGetJobProgress: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **sequencingControllerGetJobVariants**
> sequencingControllerGetJobVariants(id)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getSequencingApi();
final String id = id_example; // String | 

try {
    api.sequencingControllerGetJobVariants(id);
} on DioException catch (e) {
    print('Exception when calling SequencingApi->sequencingControllerGetJobVariants: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **sequencingControllerGetNcbiPreview**
> sequencingControllerGetNcbiPreview(accession)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getSequencingApi();
final String accession = accession_example; // String | 

try {
    api.sequencingControllerGetNcbiPreview(accession);
} on DioException catch (e) {
    print('Exception when calling SequencingApi->sequencingControllerGetNcbiPreview: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **accession** | **String**|  | 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **sequencingControllerGetPipelines**
> sequencingControllerGetPipelines()



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getSequencingApi();

try {
    api.sequencingControllerGetPipelines();
} on DioException catch (e) {
    print('Exception when calling SequencingApi->sequencingControllerGetPipelines: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **sequencingControllerGetQueue**
> sequencingControllerGetQueue()



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getSequencingApi();

try {
    api.sequencingControllerGetQueue();
} on DioException catch (e) {
    print('Exception when calling SequencingApi->sequencingControllerGetQueue: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **sequencingControllerGetSubmission**
> sequencingControllerGetSubmission(id)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getSequencingApi();
final String id = id_example; // String | 

try {
    api.sequencingControllerGetSubmission(id);
} on DioException catch (e) {
    print('Exception when calling SequencingApi->sequencingControllerGetSubmission: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **sequencingControllerPresignUpload**
> sequencingControllerPresignUpload(presignUploadDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getSequencingApi();
final PresignUploadDto presignUploadDto = ; // PresignUploadDto | 

try {
    api.sequencingControllerPresignUpload(presignUploadDto);
} on DioException catch (e) {
    print('Exception when calling SequencingApi->sequencingControllerPresignUpload: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **presignUploadDto** | [**PresignUploadDto**](PresignUploadDto.md)|  | 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **sequencingControllerRetryJob**
> sequencingControllerRetryJob(id)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getSequencingApi();
final String id = id_example; // String | 

try {
    api.sequencingControllerRetryJob(id);
} on DioException catch (e) {
    print('Exception when calling SequencingApi->sequencingControllerRetryJob: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **sequencingControllerSearchLabSamples**
> sequencingControllerSearchLabSamples(q)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getSequencingApi();
final String q = q_example; // String | 

try {
    api.sequencingControllerSearchLabSamples(q);
} on DioException catch (e) {
    print('Exception when calling SequencingApi->sequencingControllerSearchLabSamples: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **q** | **String**|  | 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **sequencingControllerSubmitJob**
> sequencingControllerSubmitJob(submitSequencingJobDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getSequencingApi();
final SubmitSequencingJobDto submitSequencingJobDto = ; // SubmitSequencingJobDto | 

try {
    api.sequencingControllerSubmitJob(submitSequencingJobDto);
} on DioException catch (e) {
    print('Exception when calling SequencingApi->sequencingControllerSubmitJob: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **submitSequencingJobDto** | [**SubmitSequencingJobDto**](SubmitSequencingJobDto.md)|  | 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

