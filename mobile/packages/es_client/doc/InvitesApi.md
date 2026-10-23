# es_client.api.InvitesApi

## Load the API package
```dart
import 'package:es_client/api.dart';
```

All URIs are relative to *http://localhost:4000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**invitesControllerGetInviteByToken**](InvitesApi.md#invitescontrollergetinvitebytoken) | **GET** /invites/{inviteToken} | 
[**invitesControllerGetInvites**](InvitesApi.md#invitescontrollergetinvites) | **GET** /invites | 
[**invitesControllerInviteAccept**](InvitesApi.md#invitescontrollerinviteaccept) | **POST** /invites/accept/{inviteToken} | 
[**invitesControllerInviteToWorkspace**](InvitesApi.md#invitescontrollerinvitetoworkspace) | **POST** /invites/workspace | 


# **invitesControllerGetInviteByToken**
> InviteResponse invitesControllerGetInviteByToken(inviteToken)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getInvitesApi();
final String inviteToken = inviteToken; // String | invite token

try {
    final response = api.invitesControllerGetInviteByToken(inviteToken);
    print(response);
} on DioException catch (e) {
    print('Exception when calling InvitesApi->invitesControllerGetInviteByToken: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **inviteToken** | **String**| invite token | 

### Return type

[**InviteResponse**](InviteResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **invitesControllerGetInvites**
> FetchAllInviteResponse invitesControllerGetInvites()



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getInvitesApi();

try {
    final response = api.invitesControllerGetInvites();
    print(response);
} on DioException catch (e) {
    print('Exception when calling InvitesApi->invitesControllerGetInvites: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**FetchAllInviteResponse**](FetchAllInviteResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **invitesControllerInviteAccept**
> JsonObject invitesControllerInviteAccept(inviteToken)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getInvitesApi();
final String inviteToken = inviteToken; // String | invite token

try {
    final response = api.invitesControllerInviteAccept(inviteToken);
    print(response);
} on DioException catch (e) {
    print('Exception when calling InvitesApi->invitesControllerInviteAccept: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **inviteToken** | **String**| invite token | 

### Return type

[**JsonObject**](JsonObject.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **invitesControllerInviteToWorkspace**
> JsonObject invitesControllerInviteToWorkspace(createWorkspaceInviteDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getInvitesApi();
final CreateWorkspaceInviteDto createWorkspaceInviteDto = ; // CreateWorkspaceInviteDto | 

try {
    final response = api.invitesControllerInviteToWorkspace(createWorkspaceInviteDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling InvitesApi->invitesControllerInviteToWorkspace: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createWorkspaceInviteDto** | [**CreateWorkspaceInviteDto**](CreateWorkspaceInviteDto.md)|  | 

### Return type

[**JsonObject**](JsonObject.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

