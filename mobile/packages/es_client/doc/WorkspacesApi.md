# es_client.api.WorkspacesApi

## Load the API package
```dart
import 'package:es_client/api.dart';
```

All URIs are relative to *http://localhost:4000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**workspacesControllerAddMember**](WorkspacesApi.md#workspacescontrolleraddmember) | **POST** /workspaces/{workspaceId}/members | 
[**workspacesControllerCreate**](WorkspacesApi.md#workspacescontrollercreate) | **POST** /workspaces | 
[**workspacesControllerCreateProject**](WorkspacesApi.md#workspacescontrollercreateproject) | **POST** /workspaces/{workspaceId}/projects | 
[**workspacesControllerFindMembers**](WorkspacesApi.md#workspacescontrollerfindmembers) | **GET** /workspaces/{workspaceId}/members | 
[**workspacesControllerFindMine**](WorkspacesApi.md#workspacescontrollerfindmine) | **GET** /workspaces | 
[**workspacesControllerFindOne**](WorkspacesApi.md#workspacescontrollerfindone) | **GET** /workspaces/{workspaceId} | 
[**workspacesControllerFindProjects**](WorkspacesApi.md#workspacescontrollerfindprojects) | **GET** /workspaces/{workspaceId}/projects | 
[**workspacesControllerRemoveMember**](WorkspacesApi.md#workspacescontrollerremovemember) | **DELETE** /workspaces/{workspaceId}/members/{memberId} | 
[**workspacesControllerUpdate**](WorkspacesApi.md#workspacescontrollerupdate) | **PATCH** /workspaces/{workspaceId} | 
[**workspacesControllerUpdateMember**](WorkspacesApi.md#workspacescontrollerupdatemember) | **PATCH** /workspaces/{workspaceId}/members/{memberId} | 


# **workspacesControllerAddMember**
> JsonObject workspacesControllerAddMember(workspaceId, createWorkspaceMemberDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getWorkspacesApi();
final String workspaceId = workspaceId_example; // String | Workspace UUID
final CreateWorkspaceMemberDto createWorkspaceMemberDto = ; // CreateWorkspaceMemberDto | 

try {
    final response = api.workspacesControllerAddMember(workspaceId, createWorkspaceMemberDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling WorkspacesApi->workspacesControllerAddMember: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **workspaceId** | **String**| Workspace UUID | 
 **createWorkspaceMemberDto** | [**CreateWorkspaceMemberDto**](CreateWorkspaceMemberDto.md)|  | 

### Return type

[**JsonObject**](JsonObject.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **workspacesControllerCreate**
> JsonObject workspacesControllerCreate(createWorkspaceDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getWorkspacesApi();
final CreateWorkspaceDto createWorkspaceDto = ; // CreateWorkspaceDto | 

try {
    final response = api.workspacesControllerCreate(createWorkspaceDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling WorkspacesApi->workspacesControllerCreate: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createWorkspaceDto** | [**CreateWorkspaceDto**](CreateWorkspaceDto.md)|  | 

### Return type

[**JsonObject**](JsonObject.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **workspacesControllerCreateProject**
> JsonObject workspacesControllerCreateProject(workspaceId, createWorkspaceProjectDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getWorkspacesApi();
final String workspaceId = workspaceId_example; // String | Workspace UUID
final CreateWorkspaceProjectDto createWorkspaceProjectDto = ; // CreateWorkspaceProjectDto | 

try {
    final response = api.workspacesControllerCreateProject(workspaceId, createWorkspaceProjectDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling WorkspacesApi->workspacesControllerCreateProject: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **workspaceId** | **String**| Workspace UUID | 
 **createWorkspaceProjectDto** | [**CreateWorkspaceProjectDto**](CreateWorkspaceProjectDto.md)|  | 

### Return type

[**JsonObject**](JsonObject.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **workspacesControllerFindMembers**
> JsonObject workspacesControllerFindMembers(workspaceId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getWorkspacesApi();
final String workspaceId = workspaceId_example; // String | Workspace UUID

try {
    final response = api.workspacesControllerFindMembers(workspaceId);
    print(response);
} on DioException catch (e) {
    print('Exception when calling WorkspacesApi->workspacesControllerFindMembers: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **workspaceId** | **String**| Workspace UUID | 

### Return type

[**JsonObject**](JsonObject.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **workspacesControllerFindMine**
> JsonObject workspacesControllerFindMine()



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getWorkspacesApi();

try {
    final response = api.workspacesControllerFindMine();
    print(response);
} on DioException catch (e) {
    print('Exception when calling WorkspacesApi->workspacesControllerFindMine: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**JsonObject**](JsonObject.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **workspacesControllerFindOne**
> JsonObject workspacesControllerFindOne(workspaceId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getWorkspacesApi();
final String workspaceId = workspaceId_example; // String | Workspace UUID

try {
    final response = api.workspacesControllerFindOne(workspaceId);
    print(response);
} on DioException catch (e) {
    print('Exception when calling WorkspacesApi->workspacesControllerFindOne: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **workspaceId** | **String**| Workspace UUID | 

### Return type

[**JsonObject**](JsonObject.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **workspacesControllerFindProjects**
> JsonObject workspacesControllerFindProjects(workspaceId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getWorkspacesApi();
final String workspaceId = workspaceId_example; // String | Workspace UUID

try {
    final response = api.workspacesControllerFindProjects(workspaceId);
    print(response);
} on DioException catch (e) {
    print('Exception when calling WorkspacesApi->workspacesControllerFindProjects: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **workspaceId** | **String**| Workspace UUID | 

### Return type

[**JsonObject**](JsonObject.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **workspacesControllerRemoveMember**
> JsonObject workspacesControllerRemoveMember(workspaceId, memberId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getWorkspacesApi();
final String workspaceId = workspaceId_example; // String | Workspace UUID
final String memberId = memberId_example; // String | UserRole UUID

try {
    final response = api.workspacesControllerRemoveMember(workspaceId, memberId);
    print(response);
} on DioException catch (e) {
    print('Exception when calling WorkspacesApi->workspacesControllerRemoveMember: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **workspaceId** | **String**| Workspace UUID | 
 **memberId** | **String**| UserRole UUID | 

### Return type

[**JsonObject**](JsonObject.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **workspacesControllerUpdate**
> JsonObject workspacesControllerUpdate(workspaceId, updateWorkspaceDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getWorkspacesApi();
final String workspaceId = workspaceId_example; // String | Workspace UUID
final UpdateWorkspaceDto updateWorkspaceDto = ; // UpdateWorkspaceDto | 

try {
    final response = api.workspacesControllerUpdate(workspaceId, updateWorkspaceDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling WorkspacesApi->workspacesControllerUpdate: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **workspaceId** | **String**| Workspace UUID | 
 **updateWorkspaceDto** | [**UpdateWorkspaceDto**](UpdateWorkspaceDto.md)|  | 

### Return type

[**JsonObject**](JsonObject.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **workspacesControllerUpdateMember**
> JsonObject workspacesControllerUpdateMember(workspaceId, memberId, updateWorkspaceMemberDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getWorkspacesApi();
final String workspaceId = workspaceId_example; // String | Workspace UUID
final String memberId = memberId_example; // String | UserRole UUID
final UpdateWorkspaceMemberDto updateWorkspaceMemberDto = ; // UpdateWorkspaceMemberDto | 

try {
    final response = api.workspacesControllerUpdateMember(workspaceId, memberId, updateWorkspaceMemberDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling WorkspacesApi->workspacesControllerUpdateMember: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **workspaceId** | **String**| Workspace UUID | 
 **memberId** | **String**| UserRole UUID | 
 **updateWorkspaceMemberDto** | [**UpdateWorkspaceMemberDto**](UpdateWorkspaceMemberDto.md)|  | 

### Return type

[**JsonObject**](JsonObject.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

