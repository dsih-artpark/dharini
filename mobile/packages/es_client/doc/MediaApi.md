# es_client.api.MediaApi

## Load the API package
```dart
import 'package:es_client/api.dart';
```

All URIs are relative to *http://localhost:4000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**mediaControllerGetSignedUrl**](MediaApi.md#mediacontrollergetsignedurl) | **GET** /media/signed-url | 
[**mediaControllerUploadImages**](MediaApi.md#mediacontrolleruploadimages) | **POST** /media/upload-images | 


# **mediaControllerGetSignedUrl**
> mediaControllerGetSignedUrl(fileUrl)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getMediaApi();
final String fileUrl = fileUrl_example; // String | 

try {
    api.mediaControllerGetSignedUrl(fileUrl);
} on DioException catch (e) {
    print('Exception when calling MediaApi->mediaControllerGetSignedUrl: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **fileUrl** | **String**|  | 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **mediaControllerUploadImages**
> UploadMultipleFilesResponse mediaControllerUploadImages(files)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getMediaApi();
final BuiltList<MultipartFile> files = /path/to/file.txt; // BuiltList<MultipartFile> | Array of files to be uploaded

try {
    final response = api.mediaControllerUploadImages(files);
    print(response);
} on DioException catch (e) {
    print('Exception when calling MediaApi->mediaControllerUploadImages: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **files** | [**BuiltList&lt;MultipartFile&gt;**](MultipartFile.md)| Array of files to be uploaded | 

### Return type

[**UploadMultipleFilesResponse**](UploadMultipleFilesResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

