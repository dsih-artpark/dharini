# es_client.api.SampleTypeApi

## Load the API package
```dart
import 'package:es_client/api.dart';
```

All URIs are relative to *http://localhost:4000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**sampleTypeControllerCreate**](SampleTypeApi.md#sampletypecontrollercreate) | **POST** /sample-type | 
[**sampleTypeControllerFindAll**](SampleTypeApi.md#sampletypecontrollerfindall) | **GET** /sample-type | 
[**sampleTypeControllerFindOne**](SampleTypeApi.md#sampletypecontrollerfindone) | **GET** /sample-type/{id} | 
[**sampleTypeControllerUpdate**](SampleTypeApi.md#sampletypecontrollerupdate) | **PATCH** /sample-type/{id} | 


# **sampleTypeControllerCreate**
> SampleTypeResponse sampleTypeControllerCreate(createSampleTypeDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getSampleTypeApi();
final CreateSampleTypeDto createSampleTypeDto = ; // CreateSampleTypeDto | 

try {
    final response = api.sampleTypeControllerCreate(createSampleTypeDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling SampleTypeApi->sampleTypeControllerCreate: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createSampleTypeDto** | [**CreateSampleTypeDto**](CreateSampleTypeDto.md)|  | 

### Return type

[**SampleTypeResponse**](SampleTypeResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **sampleTypeControllerFindAll**
> ListSampleTypeResponse sampleTypeControllerFindAll()



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getSampleTypeApi();

try {
    final response = api.sampleTypeControllerFindAll();
    print(response);
} on DioException catch (e) {
    print('Exception when calling SampleTypeApi->sampleTypeControllerFindAll: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**ListSampleTypeResponse**](ListSampleTypeResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **sampleTypeControllerFindOne**
> SampleTypeResponse sampleTypeControllerFindOne(id)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getSampleTypeApi();
final String id = id_example; // String | Sample type UUID

try {
    final response = api.sampleTypeControllerFindOne(id);
    print(response);
} on DioException catch (e) {
    print('Exception when calling SampleTypeApi->sampleTypeControllerFindOne: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Sample type UUID | 

### Return type

[**SampleTypeResponse**](SampleTypeResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **sampleTypeControllerUpdate**
> SampleTypeResponse sampleTypeControllerUpdate(id, updateSampleTypeDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getSampleTypeApi();
final String id = id_example; // String | Sample type UUID
final UpdateSampleTypeDto updateSampleTypeDto = ; // UpdateSampleTypeDto | 

try {
    final response = api.sampleTypeControllerUpdate(id, updateSampleTypeDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling SampleTypeApi->sampleTypeControllerUpdate: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Sample type UUID | 
 **updateSampleTypeDto** | [**UpdateSampleTypeDto**](UpdateSampleTypeDto.md)|  | 

### Return type

[**SampleTypeResponse**](SampleTypeResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

