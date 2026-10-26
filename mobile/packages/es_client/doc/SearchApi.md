# es_client.api.SearchApi

## Load the API package
```dart
import 'package:es_client/api.dart';
```

All URIs are relative to *http://localhost:4000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**searchControllerGlobalSearch**](SearchApi.md#searchcontrollerglobalsearch) | **GET** /search | 


# **searchControllerGlobalSearch**
> SearchResponse searchControllerGlobalSearch(searchText)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getSearchApi();
final String searchText = Project; // String | Site name and Project name to search

try {
    final response = api.searchControllerGlobalSearch(searchText);
    print(response);
} on DioException catch (e) {
    print('Exception when calling SearchApi->searchControllerGlobalSearch: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **searchText** | **String**| Site name and Project name to search | [optional] 

### Return type

[**SearchResponse**](SearchResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

