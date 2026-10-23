# es_client.api.AccessApi

## Load the API package
```dart
import 'package:es_client/api.dart';
```

All URIs are relative to *http://localhost:4000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**accessControllerFindOne**](AccessApi.md#accesscontrollerfindone) | **GET** /access/{id} | 
[**accessControllerUpdate**](AccessApi.md#accesscontrollerupdate) | **PATCH** /access/{id} | 


# **accessControllerFindOne**
> JsonObject accessControllerFindOne(id)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getAccessApi();
final String id = id_example; // String | 

try {
    final response = api.accessControllerFindOne(id);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AccessApi->accessControllerFindOne: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

[**JsonObject**](JsonObject.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **accessControllerUpdate**
> JsonObject accessControllerUpdate(id, updateAccessDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getAccessApi();
final String id = id_example; // String | 
final UpdateAccessDto updateAccessDto = ; // UpdateAccessDto | 

try {
    final response = api.accessControllerUpdate(id, updateAccessDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AccessApi->accessControllerUpdate: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **updateAccessDto** | [**UpdateAccessDto**](UpdateAccessDto.md)|  | 

### Return type

[**JsonObject**](JsonObject.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

