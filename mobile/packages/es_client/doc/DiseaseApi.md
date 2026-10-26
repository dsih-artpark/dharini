# es_client.api.DiseaseApi

## Load the API package
```dart
import 'package:es_client/api.dart';
```

All URIs are relative to *http://localhost:4000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**diseaseControllerCreate**](DiseaseApi.md#diseasecontrollercreate) | **POST** /disease | 
[**diseaseControllerFindAll**](DiseaseApi.md#diseasecontrollerfindall) | **GET** /disease | 
[**diseaseControllerFindOne**](DiseaseApi.md#diseasecontrollerfindone) | **GET** /disease/{id} | 
[**diseaseControllerUpdate**](DiseaseApi.md#diseasecontrollerupdate) | **PATCH** /disease/{id} | 


# **diseaseControllerCreate**
> DiseaseResponse diseaseControllerCreate(createDiseaseDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getDiseaseApi();
final CreateDiseaseDto createDiseaseDto = ; // CreateDiseaseDto | 

try {
    final response = api.diseaseControllerCreate(createDiseaseDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling DiseaseApi->diseaseControllerCreate: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createDiseaseDto** | [**CreateDiseaseDto**](CreateDiseaseDto.md)|  | 

### Return type

[**DiseaseResponse**](DiseaseResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **diseaseControllerFindAll**
> ListDiseaseResponse diseaseControllerFindAll()



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getDiseaseApi();

try {
    final response = api.diseaseControllerFindAll();
    print(response);
} on DioException catch (e) {
    print('Exception when calling DiseaseApi->diseaseControllerFindAll: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**ListDiseaseResponse**](ListDiseaseResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **diseaseControllerFindOne**
> DiseaseResponse diseaseControllerFindOne(id)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getDiseaseApi();
final String id = id_example; // String | Disease UUID

try {
    final response = api.diseaseControllerFindOne(id);
    print(response);
} on DioException catch (e) {
    print('Exception when calling DiseaseApi->diseaseControllerFindOne: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Disease UUID | 

### Return type

[**DiseaseResponse**](DiseaseResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **diseaseControllerUpdate**
> DiseaseResponse diseaseControllerUpdate(id, updateDiseaseDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getDiseaseApi();
final String id = id_example; // String | Disease UUID
final UpdateDiseaseDto updateDiseaseDto = ; // UpdateDiseaseDto | 

try {
    final response = api.diseaseControllerUpdate(id, updateDiseaseDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling DiseaseApi->diseaseControllerUpdate: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Disease UUID | 
 **updateDiseaseDto** | [**UpdateDiseaseDto**](UpdateDiseaseDto.md)|  | 

### Return type

[**DiseaseResponse**](DiseaseResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

