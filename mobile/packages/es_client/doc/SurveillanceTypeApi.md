# es_client.api.SurveillanceTypeApi

## Load the API package
```dart
import 'package:es_client/api.dart';
```

All URIs are relative to *http://localhost:4000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**surveillanceTypeControllerCreate**](SurveillanceTypeApi.md#surveillancetypecontrollercreate) | **POST** /surveillance-type | 
[**surveillanceTypeControllerFindAll**](SurveillanceTypeApi.md#surveillancetypecontrollerfindall) | **GET** /surveillance-type | 
[**surveillanceTypeControllerFindOne**](SurveillanceTypeApi.md#surveillancetypecontrollerfindone) | **GET** /surveillance-type/{id} | 
[**surveillanceTypeControllerUpdate**](SurveillanceTypeApi.md#surveillancetypecontrollerupdate) | **PATCH** /surveillance-type/{id} | 


# **surveillanceTypeControllerCreate**
> SurveillanceTypeResponse surveillanceTypeControllerCreate(createSurveillanceTypeDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getSurveillanceTypeApi();
final CreateSurveillanceTypeDto createSurveillanceTypeDto = ; // CreateSurveillanceTypeDto | 

try {
    final response = api.surveillanceTypeControllerCreate(createSurveillanceTypeDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling SurveillanceTypeApi->surveillanceTypeControllerCreate: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createSurveillanceTypeDto** | [**CreateSurveillanceTypeDto**](CreateSurveillanceTypeDto.md)|  | 

### Return type

[**SurveillanceTypeResponse**](SurveillanceTypeResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **surveillanceTypeControllerFindAll**
> ListSurveillanceTypeResponse surveillanceTypeControllerFindAll()



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getSurveillanceTypeApi();

try {
    final response = api.surveillanceTypeControllerFindAll();
    print(response);
} on DioException catch (e) {
    print('Exception when calling SurveillanceTypeApi->surveillanceTypeControllerFindAll: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**ListSurveillanceTypeResponse**](ListSurveillanceTypeResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **surveillanceTypeControllerFindOne**
> SurveillanceTypeResponse surveillanceTypeControllerFindOne(id)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getSurveillanceTypeApi();
final String id = id_example; // String | Surveillance Type UUID

try {
    final response = api.surveillanceTypeControllerFindOne(id);
    print(response);
} on DioException catch (e) {
    print('Exception when calling SurveillanceTypeApi->surveillanceTypeControllerFindOne: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Surveillance Type UUID | 

### Return type

[**SurveillanceTypeResponse**](SurveillanceTypeResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **surveillanceTypeControllerUpdate**
> SurveillanceTypeResponse surveillanceTypeControllerUpdate(id, updateSurveillanceTypeDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getSurveillanceTypeApi();
final String id = id_example; // String | Surveillance Type UUID
final UpdateSurveillanceTypeDto updateSurveillanceTypeDto = ; // UpdateSurveillanceTypeDto | 

try {
    final response = api.surveillanceTypeControllerUpdate(id, updateSurveillanceTypeDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling SurveillanceTypeApi->surveillanceTypeControllerUpdate: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Surveillance Type UUID | 
 **updateSurveillanceTypeDto** | [**UpdateSurveillanceTypeDto**](UpdateSurveillanceTypeDto.md)|  | 

### Return type

[**SurveillanceTypeResponse**](SurveillanceTypeResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

