# es_client.api.SitesApi

## Load the API package
```dart
import 'package:es_client/api.dart';
```

All URIs are relative to *http://localhost:4000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**sitesControllerFindAll**](SitesApi.md#sitescontrollerfindall) | **GET** /sites | 


# **sitesControllerFindAll**
> ListSiteResponse sitesControllerFindAll(search, farmType, assignedTo, longitude, latitude, filterBy, endDate, startDate, siteType, disease, testResult, project)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getSitesApi();
final String search = ABC Site; // String | 
final String farmType = poultry farm; // String | 
final bool assignedTo = true; // bool | 
final num longitude = 78.4867; // num | Longitude of the location
final num latitude = 17.385; // num | Latitude of the location
final String filterBy = newest; // String | 
final String endDate = 2024-12-31; // String | 
final String startDate = 2024-01-01; // String | 
final String siteType = private; // String | 
final String disease = 1; // String | 
final String testResult = positive; // String | 
final String project = 123; // String | 

try {
    final response = api.sitesControllerFindAll(search, farmType, assignedTo, longitude, latitude, filterBy, endDate, startDate, siteType, disease, testResult, project);
    print(response);
} on DioException catch (e) {
    print('Exception when calling SitesApi->sitesControllerFindAll: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **search** | **String**|  | [optional] 
 **farmType** | **String**|  | [optional] 
 **assignedTo** | **bool**|  | [optional] 
 **longitude** | **num**| Longitude of the location | [optional] 
 **latitude** | **num**| Latitude of the location | [optional] 
 **filterBy** | **String**|  | [optional] 
 **endDate** | **String**|  | [optional] 
 **startDate** | **String**|  | [optional] 
 **siteType** | **String**|  | [optional] 
 **disease** | **String**|  | [optional] 
 **testResult** | **String**|  | [optional] 
 **project** | **String**|  | [optional] 

### Return type

[**ListSiteResponse**](ListSiteResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

