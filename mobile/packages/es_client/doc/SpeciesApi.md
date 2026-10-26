# es_client.api.SpeciesApi

## Load the API package
```dart
import 'package:es_client/api.dart';
```

All URIs are relative to *http://localhost:4000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**speciesControllerCreate**](SpeciesApi.md#speciescontrollercreate) | **POST** /species | Create a new species
[**speciesControllerFindAll**](SpeciesApi.md#speciescontrollerfindall) | **GET** /species | Get all active species
[**speciesControllerFindOne**](SpeciesApi.md#speciescontrollerfindone) | **GET** /species/{id} | Get a species by id
[**speciesControllerRemove**](SpeciesApi.md#speciescontrollerremove) | **DELETE** /species/{id} | Delete a species
[**speciesControllerUpdate**](SpeciesApi.md#speciescontrollerupdate) | **PATCH** /species/{id} | Update a species


# **speciesControllerCreate**
> SpeciesResponse speciesControllerCreate(createSpeciesDto)

Create a new species

### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getSpeciesApi();
final CreateSpeciesDto createSpeciesDto = ; // CreateSpeciesDto | 

try {
    final response = api.speciesControllerCreate(createSpeciesDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling SpeciesApi->speciesControllerCreate: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createSpeciesDto** | [**CreateSpeciesDto**](CreateSpeciesDto.md)|  | 

### Return type

[**SpeciesResponse**](SpeciesResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **speciesControllerFindAll**
> ListSpeciesResponse speciesControllerFindAll()

Get all active species

### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getSpeciesApi();

try {
    final response = api.speciesControllerFindAll();
    print(response);
} on DioException catch (e) {
    print('Exception when calling SpeciesApi->speciesControllerFindAll: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**ListSpeciesResponse**](ListSpeciesResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **speciesControllerFindOne**
> SpeciesResponse speciesControllerFindOne(id)

Get a species by id

### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getSpeciesApi();
final String id = id_example; // String | 

try {
    final response = api.speciesControllerFindOne(id);
    print(response);
} on DioException catch (e) {
    print('Exception when calling SpeciesApi->speciesControllerFindOne: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

[**SpeciesResponse**](SpeciesResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **speciesControllerRemove**
> speciesControllerRemove(id)

Delete a species

### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getSpeciesApi();
final String id = id_example; // String | 

try {
    api.speciesControllerRemove(id);
} on DioException catch (e) {
    print('Exception when calling SpeciesApi->speciesControllerRemove: $e\n');
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

# **speciesControllerUpdate**
> SpeciesResponse speciesControllerUpdate(id, updateSpeciesDto)

Update a species

### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getSpeciesApi();
final String id = id_example; // String | 
final UpdateSpeciesDto updateSpeciesDto = ; // UpdateSpeciesDto | 

try {
    final response = api.speciesControllerUpdate(id, updateSpeciesDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling SpeciesApi->speciesControllerUpdate: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **updateSpeciesDto** | [**UpdateSpeciesDto**](UpdateSpeciesDto.md)|  | 

### Return type

[**SpeciesResponse**](SpeciesResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

