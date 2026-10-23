# es_client.api.SamplesApi

## Load the API package
```dart
import 'package:es_client/api.dart';
```

All URIs are relative to *http://localhost:4000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**samplesControllerGetAnimalMetadataBySite**](SamplesApi.md#samplescontrollergetanimalmetadatabysite) | **GET** /samples/animal-metadata/by-site/{siteId} | List all animals recorded at a site


# **samplesControllerGetAnimalMetadataBySite**
> ListAnimalMetadataResponse samplesControllerGetAnimalMetadataBySite(siteId)

List all animals recorded at a site

Returns every AnimalMetadata record ever attached to a sample at the given site, newest-first. Used by the mobile app to let collectors pick an existing animal instead of re-entering metadata.

### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getSamplesApi();
final String siteId = siteId_example; // String | Site UUID

try {
    final response = api.samplesControllerGetAnimalMetadataBySite(siteId);
    print(response);
} on DioException catch (e) {
    print('Exception when calling SamplesApi->samplesControllerGetAnimalMetadataBySite: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **siteId** | **String**| Site UUID | 

### Return type

[**ListAnimalMetadataResponse**](ListAnimalMetadataResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

