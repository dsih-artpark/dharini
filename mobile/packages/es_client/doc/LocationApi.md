# es_client.api.LocationApi

## Load the API package
```dart
import 'package:es_client/api.dart';
```

All URIs are relative to *http://localhost:4000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**locationControllerCreate**](LocationApi.md#locationcontrollercreate) | **POST** /location | 
[**locationControllerFindAll**](LocationApi.md#locationcontrollerfindall) | **GET** /location | 
[**locationControllerFindLocationFileByStateCode**](LocationApi.md#locationcontrollerfindlocationfilebystatecode) | **GET** /location/state/{regionId} | 
[**locationControllerFindOne**](LocationApi.md#locationcontrollerfindone) | **GET** /location/{id} | 
[**locationControllerUpdate**](LocationApi.md#locationcontrollerupdate) | **PATCH** /location/{id} | 
[**locationControllerUploadExcelFile**](LocationApi.md#locationcontrolleruploadexcelfile) | **POST** /location/import | 


# **locationControllerCreate**
> LocationResponse locationControllerCreate(createLocationDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getLocationApi();
final CreateLocationDto createLocationDto = ; // CreateLocationDto | 

try {
    final response = api.locationControllerCreate(createLocationDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling LocationApi->locationControllerCreate: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createLocationDto** | [**CreateLocationDto**](CreateLocationDto.md)|  | 

### Return type

[**LocationResponse**](LocationResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **locationControllerFindAll**
> ListLocationResponse locationControllerFindAll()



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getLocationApi();

try {
    final response = api.locationControllerFindAll();
    print(response);
} on DioException catch (e) {
    print('Exception when calling LocationApi->locationControllerFindAll: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**ListLocationResponse**](ListLocationResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **locationControllerFindLocationFileByStateCode**
> ListLocationResponse locationControllerFindLocationFileByStateCode(regionId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getLocationApi();
final String regionId = regionId_example; // String | Region UUID

try {
    final response = api.locationControllerFindLocationFileByStateCode(regionId);
    print(response);
} on DioException catch (e) {
    print('Exception when calling LocationApi->locationControllerFindLocationFileByStateCode: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **regionId** | **String**| Region UUID | 

### Return type

[**ListLocationResponse**](ListLocationResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **locationControllerFindOne**
> LocationResponse locationControllerFindOne(id)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getLocationApi();
final String id = id_example; // String | Location UUID

try {
    final response = api.locationControllerFindOne(id);
    print(response);
} on DioException catch (e) {
    print('Exception when calling LocationApi->locationControllerFindOne: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Location UUID | 

### Return type

[**LocationResponse**](LocationResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **locationControllerUpdate**
> LocationResponse locationControllerUpdate(id, updateLocationDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getLocationApi();
final String id = id_example; // String | Location UUID
final UpdateLocationDto updateLocationDto = ; // UpdateLocationDto | 

try {
    final response = api.locationControllerUpdate(id, updateLocationDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling LocationApi->locationControllerUpdate: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Location UUID | 
 **updateLocationDto** | [**UpdateLocationDto**](UpdateLocationDto.md)|  | 

### Return type

[**LocationResponse**](LocationResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **locationControllerUploadExcelFile**
> ListLocationResponse locationControllerUploadExcelFile()



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getLocationApi();

try {
    final response = api.locationControllerUploadExcelFile();
    print(response);
} on DioException catch (e) {
    print('Exception when calling LocationApi->locationControllerUploadExcelFile: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**ListLocationResponse**](ListLocationResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

