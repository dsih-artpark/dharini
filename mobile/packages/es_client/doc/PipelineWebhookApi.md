# es_client.api.PipelineWebhookApi

## Load the API package
```dart
import 'package:es_client/api.dart';
```

All URIs are relative to *http://localhost:4000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**pipelineWebhookControllerHandleWebhook**](PipelineWebhookApi.md#pipelinewebhookcontrollerhandlewebhook) | **POST** /sequencing/pipeline/webhook | 


# **pipelineWebhookControllerHandleWebhook**
> pipelineWebhookControllerHandleWebhook(xDhariniEvent, xDhariniDelivery, xDhariniTimestamp, xDhariniSignature)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getPipelineWebhookApi();
final String xDhariniEvent = xDhariniEvent_example; // String | 
final String xDhariniDelivery = xDhariniDelivery_example; // String | 
final String xDhariniTimestamp = xDhariniTimestamp_example; // String | 
final String xDhariniSignature = xDhariniSignature_example; // String | 

try {
    api.pipelineWebhookControllerHandleWebhook(xDhariniEvent, xDhariniDelivery, xDhariniTimestamp, xDhariniSignature);
} on DioException catch (e) {
    print('Exception when calling PipelineWebhookApi->pipelineWebhookControllerHandleWebhook: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **xDhariniEvent** | **String**|  | 
 **xDhariniDelivery** | **String**|  | 
 **xDhariniTimestamp** | **String**|  | 
 **xDhariniSignature** | **String**|  | 

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

