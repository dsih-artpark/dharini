# es_client.api.RolesApi

## Load the API package
```dart
import 'package:es_client/api.dart';
```

All URIs are relative to *http://localhost:4000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**rolesControllerFindAll**](RolesApi.md#rolescontrollerfindall) | **GET** /roles | 


# **rolesControllerFindAll**
> ListRoleResponse rolesControllerFindAll()



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getRolesApi();

try {
    final response = api.rolesControllerFindAll();
    print(response);
} on DioException catch (e) {
    print('Exception when calling RolesApi->rolesControllerFindAll: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**ListRoleResponse**](ListRoleResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

