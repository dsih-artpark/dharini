# es_client.api.RegionApi

## Load the API package
```dart
import 'package:es_client/api.dart';
```

All URIs are relative to *http://localhost:4000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**regionControllerCreate**](RegionApi.md#regioncontrollercreate) | **POST** /regions | 
[**regionControllerFindAll**](RegionApi.md#regioncontrollerfindall) | **GET** /regions | 
[**regionControllerFindAllRegionsForInProject**](RegionApi.md#regioncontrollerfindallregionsforinproject) | **GET** /regions/project-location | 
[**regionControllerFindOne**](RegionApi.md#regioncontrollerfindone) | **GET** /regions/{id} | 
[**regionControllerUpdate**](RegionApi.md#regioncontrollerupdate) | **PATCH** /regions/{id} | 
[**regionControllerUploadExcelFileDistrict**](RegionApi.md#regioncontrolleruploadexcelfiledistrict) | **POST** /regions/import/district | 
[**regionControllerUploadExcelFileState**](RegionApi.md#regioncontrolleruploadexcelfilestate) | **POST** /regions/import/state | 


# **regionControllerCreate**
> RegionResponse regionControllerCreate(createRegionDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getRegionApi();
final CreateRegionDto createRegionDto = ; // CreateRegionDto | 

try {
    final response = api.regionControllerCreate(createRegionDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling RegionApi->regionControllerCreate: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createRegionDto** | [**CreateRegionDto**](CreateRegionDto.md)|  | 

### Return type

[**RegionResponse**](RegionResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **regionControllerFindAll**
> ListRegionResponse regionControllerFindAll(type, select, search)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getRegionApi();
final String type = STATE; // String | 
final String select = id,name; // String | 
final String search = andaman; // String | this search the name of the region, it needs type, if you want to search state then the type query should be state

try {
    final response = api.regionControllerFindAll(type, select, search);
    print(response);
} on DioException catch (e) {
    print('Exception when calling RegionApi->regionControllerFindAll: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **type** | **String**|  | 
 **select** | **String**|  | [optional] 
 **search** | **String**| this search the name of the region, it needs type, if you want to search state then the type query should be state | [optional] 

### Return type

[**ListRegionResponse**](ListRegionResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **regionControllerFindAllRegionsForInProject**
> ProjectLocationStateResponse regionControllerFindAllRegionsForInProject(search)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getRegionApi();
final String search = andaman; // String | this search the name of the region, it needs type, if you want to search state then the type query should be state

try {
    final response = api.regionControllerFindAllRegionsForInProject(search);
    print(response);
} on DioException catch (e) {
    print('Exception when calling RegionApi->regionControllerFindAllRegionsForInProject: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **search** | **String**| this search the name of the region, it needs type, if you want to search state then the type query should be state | [optional] 

### Return type

[**ProjectLocationStateResponse**](ProjectLocationStateResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **regionControllerFindOne**
> RegionResponse regionControllerFindOne(id)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getRegionApi();
final String id = id_example; // String | Region UUID

try {
    final response = api.regionControllerFindOne(id);
    print(response);
} on DioException catch (e) {
    print('Exception when calling RegionApi->regionControllerFindOne: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Region UUID | 

### Return type

[**RegionResponse**](RegionResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **regionControllerUpdate**
> RegionResponse regionControllerUpdate(id, updateRegionDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getRegionApi();
final String id = id_example; // String | Region UUID
final UpdateRegionDto updateRegionDto = ; // UpdateRegionDto | 

try {
    final response = api.regionControllerUpdate(id, updateRegionDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling RegionApi->regionControllerUpdate: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Region UUID | 
 **updateRegionDto** | [**UpdateRegionDto**](UpdateRegionDto.md)|  | 

### Return type

[**RegionResponse**](RegionResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **regionControllerUploadExcelFileDistrict**
> ConvertExcelResponse regionControllerUploadExcelFileDistrict()



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getRegionApi();

try {
    final response = api.regionControllerUploadExcelFileDistrict();
    print(response);
} on DioException catch (e) {
    print('Exception when calling RegionApi->regionControllerUploadExcelFileDistrict: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**ConvertExcelResponse**](ConvertExcelResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **regionControllerUploadExcelFileState**
> ConvertExcelResponse regionControllerUploadExcelFileState()



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getRegionApi();

try {
    final response = api.regionControllerUploadExcelFileState();
    print(response);
} on DioException catch (e) {
    print('Exception when calling RegionApi->regionControllerUploadExcelFileState: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**ConvertExcelResponse**](ConvertExcelResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

