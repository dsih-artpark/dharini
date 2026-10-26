# es_client.api.KitApi

## Load the API package
```dart
import 'package:es_client/api.dart';
```

All URIs are relative to *http://localhost:4000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**kitControllerCreate**](KitApi.md#kitcontrollercreate) | **POST** /kits | 
[**kitControllerFindAll**](KitApi.md#kitcontrollerfindall) | **GET** /kits | 
[**kitControllerFindOne**](KitApi.md#kitcontrollerfindone) | **GET** /kits/{id} | 
[**kitControllerUpdate**](KitApi.md#kitcontrollerupdate) | **PATCH** /kits/{id} | 


# **kitControllerCreate**
> KitResponse kitControllerCreate(createKitDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getKitApi();
final CreateKitDto createKitDto = ; // CreateKitDto | 

try {
    final response = api.kitControllerCreate(createKitDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling KitApi->kitControllerCreate: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createKitDto** | [**CreateKitDto**](CreateKitDto.md)|  | 

### Return type

[**KitResponse**](KitResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **kitControllerFindAll**
> ListKitResponse kitControllerFindAll()



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getKitApi();

try {
    final response = api.kitControllerFindAll();
    print(response);
} on DioException catch (e) {
    print('Exception when calling KitApi->kitControllerFindAll: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**ListKitResponse**](ListKitResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **kitControllerFindOne**
> KitResponse kitControllerFindOne(id)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getKitApi();
final String id = id_example; // String | 

try {
    final response = api.kitControllerFindOne(id);
    print(response);
} on DioException catch (e) {
    print('Exception when calling KitApi->kitControllerFindOne: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

[**KitResponse**](KitResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **kitControllerUpdate**
> KitResponse kitControllerUpdate(id, updateKitDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getKitApi();
final String id = id_example; // String | 
final UpdateKitDto updateKitDto = ; // UpdateKitDto | 

try {
    final response = api.kitControllerUpdate(id, updateKitDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling KitApi->kitControllerUpdate: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **updateKitDto** | [**UpdateKitDto**](UpdateKitDto.md)|  | 

### Return type

[**KitResponse**](KitResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

