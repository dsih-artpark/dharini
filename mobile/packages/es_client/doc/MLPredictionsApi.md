# es_client.api.MLPredictionsApi

## Load the API package
```dart
import 'package:es_client/api.dart';
```

All URIs are relative to *http://localhost:4000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**mlControllerBirds**](MLPredictionsApi.md#mlcontrollerbirds) | **GET** /ml/birds/{path} | Bird migration predictions (species, maps, seasons)
[**mlControllerDisease**](MLPredictionsApi.md#mlcontrollerdisease) | **GET** /ml/diseases/{disease} | One disease model
[**mlControllerDiseases**](MLPredictionsApi.md#mlcontrollerdiseases) | **GET** /ml/diseases | Livestock disease models available (LSD today)
[**mlControllerPredictDisease**](MLPredictionsApi.md#mlcontrollerpredictdisease) | **POST** /ml/diseases/{disease}/predict | Disease risk at up to 50 locations on a date
[**mlControllerStatus**](MLPredictionsApi.md#mlcontrollerstatus) | **GET** /ml/status | Whether ML predictions are enabled, and which models are loaded


# **mlControllerBirds**
> mlControllerBirds()

Bird migration predictions (species, maps, seasons)

Relayed to the dharini-ml prediction service, whose API reference (paths, parameters, responses) is at https://ml.dharini.artpark.ai/docs. Any logged-in user may call it. Returns 404 when ML is not enabled on this server, 503 when the ML service is unavailable or busy.

### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getMLPredictionsApi();

try {
    api.mlControllerBirds();
} on DioException catch (e) {
    print('Exception when calling MLPredictionsApi->mlControllerBirds: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **mlControllerDisease**
> mlControllerDisease()

One disease model

Relayed to the dharini-ml prediction service, whose API reference (paths, parameters, responses) is at https://ml.dharini.artpark.ai/docs. Any logged-in user may call it. Returns 404 when ML is not enabled on this server, 503 when the ML service is unavailable or busy.

### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getMLPredictionsApi();

try {
    api.mlControllerDisease();
} on DioException catch (e) {
    print('Exception when calling MLPredictionsApi->mlControllerDisease: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **mlControllerDiseases**
> mlControllerDiseases()

Livestock disease models available (LSD today)

Relayed to the dharini-ml prediction service, whose API reference (paths, parameters, responses) is at https://ml.dharini.artpark.ai/docs. Any logged-in user may call it. Returns 404 when ML is not enabled on this server, 503 when the ML service is unavailable or busy.

### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getMLPredictionsApi();

try {
    api.mlControllerDiseases();
} on DioException catch (e) {
    print('Exception when calling MLPredictionsApi->mlControllerDiseases: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **mlControllerPredictDisease**
> mlControllerPredictDisease()

Disease risk at up to 50 locations on a date

Relayed to the dharini-ml prediction service, whose API reference (paths, parameters, responses) is at https://ml.dharini.artpark.ai/docs. Any logged-in user may call it. Returns 404 when ML is not enabled on this server, 503 when the ML service is unavailable or busy.

### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getMLPredictionsApi();

try {
    api.mlControllerPredictDisease();
} on DioException catch (e) {
    print('Exception when calling MLPredictionsApi->mlControllerPredictDisease: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **mlControllerStatus**
> mlControllerStatus()

Whether ML predictions are enabled, and which models are loaded

The UI shows ML features only when this returns 200. 404: not enabled on this server.

### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getMLPredictionsApi();

try {
    api.mlControllerStatus();
} on DioException catch (e) {
    print('Exception when calling MLPredictionsApi->mlControllerStatus: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

