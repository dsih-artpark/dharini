# es_client.api.UserApi

## Load the API package
```dart
import 'package:es_client/api.dart';
```

All URIs are relative to *http://localhost:4000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**userControllerCreate**](UserApi.md#usercontrollercreate) | **POST** /users | 
[**userControllerCreateSuperAdmin**](UserApi.md#usercontrollercreatesuperadmin) | **POST** /users/super-admins | 
[**userControllerFindAll**](UserApi.md#usercontrollerfindall) | **GET** /users | 
[**userControllerFindOne**](UserApi.md#usercontrollerfindone) | **GET** /users/{id} | 
[**userControllerFindSuperAdmins**](UserApi.md#usercontrollerfindsuperadmins) | **GET** /users/super-admins | 
[**userControllerLookup**](UserApi.md#usercontrollerlookup) | **GET** /users/lookup | 
[**userControllerProfile**](UserApi.md#usercontrollerprofile) | **GET** /users/profile | 
[**userControllerRemove**](UserApi.md#usercontrollerremove) | **DELETE** /users/{id} | 
[**userControllerRemoveSuperAdmin**](UserApi.md#usercontrollerremovesuperadmin) | **DELETE** /users/super-admins/{id} | 
[**userControllerUpdate**](UserApi.md#usercontrollerupdate) | **PATCH** /users/{id} | 
[**userControllerUpdateProfile**](UserApi.md#usercontrollerupdateprofile) | **PATCH** /users/profile | 
[**userControllerUpdateSuperAdmin**](UserApi.md#usercontrollerupdatesuperadmin) | **PATCH** /users/super-admins/{id} | 


# **userControllerCreate**
> UserResponse userControllerCreate(createUserDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getUserApi();
final CreateUserDto createUserDto = ; // CreateUserDto | 

try {
    final response = api.userControllerCreate(createUserDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling UserApi->userControllerCreate: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createUserDto** | [**CreateUserDto**](CreateUserDto.md)|  | 

### Return type

[**UserResponse**](UserResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerCreateSuperAdmin**
> UserResponse userControllerCreateSuperAdmin(createSuperAdminDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getUserApi();
final CreateSuperAdminDto createSuperAdminDto = ; // CreateSuperAdminDto | 

try {
    final response = api.userControllerCreateSuperAdmin(createSuperAdminDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling UserApi->userControllerCreateSuperAdmin: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createSuperAdminDto** | [**CreateSuperAdminDto**](CreateSuperAdminDto.md)|  | 

### Return type

[**UserResponse**](UserResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerFindAll**
> FetchAllUserResponse userControllerFindAll()



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getUserApi();

try {
    final response = api.userControllerFindAll();
    print(response);
} on DioException catch (e) {
    print('Exception when calling UserApi->userControllerFindAll: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**FetchAllUserResponse**](FetchAllUserResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerFindOne**
> UserResponse userControllerFindOne(id)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getUserApi();
final String id = id_example; // String | User UUID

try {
    final response = api.userControllerFindOne(id);
    print(response);
} on DioException catch (e) {
    print('Exception when calling UserApi->userControllerFindOne: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| User UUID | 

### Return type

[**UserResponse**](UserResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerFindSuperAdmins**
> FetchAllUserResponse userControllerFindSuperAdmins()



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getUserApi();

try {
    final response = api.userControllerFindSuperAdmins();
    print(response);
} on DioException catch (e) {
    print('Exception when calling UserApi->userControllerFindSuperAdmins: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**FetchAllUserResponse**](FetchAllUserResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerLookup**
> LookupUserResponse userControllerLookup(email, contactNumber)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getUserApi();
final String email = user@mail.com; // String | Exact email
final String contactNumber = 9876543210; // String | Exact 10-digit phone

try {
    final response = api.userControllerLookup(email, contactNumber);
    print(response);
} on DioException catch (e) {
    print('Exception when calling UserApi->userControllerLookup: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **email** | **String**| Exact email | [optional] 
 **contactNumber** | **String**| Exact 10-digit phone | [optional] 

### Return type

[**LookupUserResponse**](LookupUserResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerProfile**
> UserProfileResponse userControllerProfile()



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getUserApi();

try {
    final response = api.userControllerProfile();
    print(response);
} on DioException catch (e) {
    print('Exception when calling UserApi->userControllerProfile: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**UserProfileResponse**](UserProfileResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerRemove**
> UserResponse userControllerRemove(id)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getUserApi();
final String id = id_example; // String | User UUID

try {
    final response = api.userControllerRemove(id);
    print(response);
} on DioException catch (e) {
    print('Exception when calling UserApi->userControllerRemove: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| User UUID | 

### Return type

[**UserResponse**](UserResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerRemoveSuperAdmin**
> userControllerRemoveSuperAdmin(id)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getUserApi();
final String id = id_example; // String | User UUID

try {
    api.userControllerRemoveSuperAdmin(id);
} on DioException catch (e) {
    print('Exception when calling UserApi->userControllerRemoveSuperAdmin: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| User UUID | 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerUpdate**
> UserResponse userControllerUpdate(id, updateUserDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getUserApi();
final String id = id_example; // String | User UUID
final UpdateUserDto updateUserDto = ; // UpdateUserDto | 

try {
    final response = api.userControllerUpdate(id, updateUserDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling UserApi->userControllerUpdate: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| User UUID | 
 **updateUserDto** | [**UpdateUserDto**](UpdateUserDto.md)|  | 

### Return type

[**UserResponse**](UserResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerUpdateProfile**
> UserProfileResponse userControllerUpdateProfile(updateOwnProfileDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getUserApi();
final UpdateOwnProfileDto updateOwnProfileDto = ; // UpdateOwnProfileDto | 

try {
    final response = api.userControllerUpdateProfile(updateOwnProfileDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling UserApi->userControllerUpdateProfile: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **updateOwnProfileDto** | [**UpdateOwnProfileDto**](UpdateOwnProfileDto.md)|  | 

### Return type

[**UserProfileResponse**](UserProfileResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerUpdateSuperAdmin**
> UserResponse userControllerUpdateSuperAdmin(id, updateUserDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getUserApi();
final String id = id_example; // String | User UUID
final UpdateUserDto updateUserDto = ; // UpdateUserDto | 

try {
    final response = api.userControllerUpdateSuperAdmin(id, updateUserDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling UserApi->userControllerUpdateSuperAdmin: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| User UUID | 
 **updateUserDto** | [**UpdateUserDto**](UpdateUserDto.md)|  | 

### Return type

[**UserResponse**](UserResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

