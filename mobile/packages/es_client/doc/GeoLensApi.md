# es_client.api.GeoLensApi

## Load the API package
```dart
import 'package:es_client/api.dart';
```

All URIs are relative to *http://localhost:4000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**geoLensControllerGetCattleMarkets**](GeoLensApi.md#geolenscontrollergetcattlemarkets) | **GET** /geolens/cattle-markets | Get cattle markets, optionally by state
[**geoLensControllerGetDiseases**](GeoLensApi.md#geolenscontrollergetdiseases) | **GET** /geolens/diseases | Get all diseases
[**geoLensControllerGetEbirdObservations**](GeoLensApi.md#geolenscontrollergetebirdobservations) | **GET** /geolens/ebird | Get eBird observations from backend proxy
[**geoLensControllerGetHistoricalWeather**](GeoLensApi.md#geolenscontrollergethistoricalweather) | **GET** /geolens/weather/historical | Get historical weather from backend proxy
[**geoLensControllerGetPoultryFarms**](GeoLensApi.md#geolenscontrollergetpoultryfarms) | **GET** /geolens/poultry-farms | Get poultry farms, optionally by state
[**geoLensControllerGetPoultryFarmsCsv**](GeoLensApi.md#geolenscontrollergetpoultryfarmscsv) | **GET** /geolens/poultry-farms/csv | Get all poultry farms in CSV-compatible format
[**geoLensControllerGetSites**](GeoLensApi.md#geolenscontrollergetsites) | **GET** /geolens/sites | Get sites the caller can see, with locations
[**geoLensControllerGetWaterBoundaries**](GeoLensApi.md#geolenscontrollergetwaterboundaries) | **GET** /geolens/water-boundaries | Get water boundaries as GeoJSON (optionally filtered by bbox)
[**geoLensControllerGetWaterBoundariesSimplified**](GeoLensApi.md#geolenscontrollergetwaterboundariessimplified) | **GET** /geolens/water-boundaries/simplified | Get simplified water boundaries (ST_Simplify) for faster map rendering
[**geoLensControllerGetWeather**](GeoLensApi.md#geolenscontrollergetweather) | **GET** /geolens/weather | Get current weather from backend proxy
[**geoLensControllerGetWetlandStates**](GeoLensApi.md#geolenscontrollergetwetlandstates) | **GET** /geolens/wetlands/states | Get all unique wetland states
[**geoLensControllerGetWetlands**](GeoLensApi.md#geolenscontrollergetwetlands) | **GET** /geolens/wetlands | Get wetlands filtered by state/district
[**geoLensControllerGetWetlandsCsv**](GeoLensApi.md#geolenscontrollergetwetlandscsv) | **GET** /geolens/wetlands/csv | Get wetlands in CSV-compatible format (for frontend)


# **geoLensControllerGetCattleMarkets**
> geoLensControllerGetCattleMarkets(state)

Get cattle markets, optionally by state

### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getGeoLensApi();
final String state = state_example; // String | 

try {
    api.geoLensControllerGetCattleMarkets(state);
} on DioException catch (e) {
    print('Exception when calling GeoLensApi->geoLensControllerGetCattleMarkets: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **state** | **String**|  | [optional] 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **geoLensControllerGetDiseases**
> geoLensControllerGetDiseases()

Get all diseases

### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getGeoLensApi();

try {
    api.geoLensControllerGetDiseases();
} on DioException catch (e) {
    print('Exception when calling GeoLensApi->geoLensControllerGetDiseases: $e\n');
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

# **geoLensControllerGetEbirdObservations**
> geoLensControllerGetEbirdObservations(lat, lng, dist, back)

Get eBird observations from backend proxy

### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getGeoLensApi();
final num lat = 8.14; // num | 
final num lng = 8.14; // num | 
final num dist = 8.14; // num | 
final num back = 8.14; // num | 

try {
    api.geoLensControllerGetEbirdObservations(lat, lng, dist, back);
} on DioException catch (e) {
    print('Exception when calling GeoLensApi->geoLensControllerGetEbirdObservations: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **lat** | **num**|  | 
 **lng** | **num**|  | 
 **dist** | **num**|  | [optional] 
 **back** | **num**|  | [optional] 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **geoLensControllerGetHistoricalWeather**
> geoLensControllerGetHistoricalWeather(lat, lng)

Get historical weather from backend proxy

### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getGeoLensApi();
final num lat = 8.14; // num | 
final num lng = 8.14; // num | 

try {
    api.geoLensControllerGetHistoricalWeather(lat, lng);
} on DioException catch (e) {
    print('Exception when calling GeoLensApi->geoLensControllerGetHistoricalWeather: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **lat** | **num**|  | 
 **lng** | **num**|  | 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **geoLensControllerGetPoultryFarms**
> geoLensControllerGetPoultryFarms(state)

Get poultry farms, optionally by state

### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getGeoLensApi();
final String state = state_example; // String | 

try {
    api.geoLensControllerGetPoultryFarms(state);
} on DioException catch (e) {
    print('Exception when calling GeoLensApi->geoLensControllerGetPoultryFarms: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **state** | **String**|  | [optional] 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **geoLensControllerGetPoultryFarmsCsv**
> geoLensControllerGetPoultryFarmsCsv()

Get all poultry farms in CSV-compatible format

### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getGeoLensApi();

try {
    api.geoLensControllerGetPoultryFarmsCsv();
} on DioException catch (e) {
    print('Exception when calling GeoLensApi->geoLensControllerGetPoultryFarmsCsv: $e\n');
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

# **geoLensControllerGetSites**
> geoLensControllerGetSites()

Get sites the caller can see, with locations

### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getGeoLensApi();

try {
    api.geoLensControllerGetSites();
} on DioException catch (e) {
    print('Exception when calling GeoLensApi->geoLensControllerGetSites: $e\n');
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

# **geoLensControllerGetWaterBoundaries**
> geoLensControllerGetWaterBoundaries(minLng, minLat, maxLng, maxLat)

Get water boundaries as GeoJSON (optionally filtered by bbox)

### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getGeoLensApi();
final String minLng = minLng_example; // String | Bounding box min longitude
final String minLat = minLat_example; // String | Bounding box min latitude
final String maxLng = maxLng_example; // String | Bounding box max longitude
final String maxLat = maxLat_example; // String | Bounding box max latitude

try {
    api.geoLensControllerGetWaterBoundaries(minLng, minLat, maxLng, maxLat);
} on DioException catch (e) {
    print('Exception when calling GeoLensApi->geoLensControllerGetWaterBoundaries: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **minLng** | **String**| Bounding box min longitude | [optional] 
 **minLat** | **String**| Bounding box min latitude | [optional] 
 **maxLng** | **String**| Bounding box max longitude | [optional] 
 **maxLat** | **String**| Bounding box max latitude | [optional] 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **geoLensControllerGetWaterBoundariesSimplified**
> geoLensControllerGetWaterBoundariesSimplified(minLng, minLat, maxLng, maxLat, zoom)

Get simplified water boundaries (ST_Simplify) for faster map rendering

### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getGeoLensApi();
final String minLng = minLng_example; // String | 
final String minLat = minLat_example; // String | 
final String maxLng = maxLng_example; // String | 
final String maxLat = maxLat_example; // String | 
final String zoom = zoom_example; // String | 

try {
    api.geoLensControllerGetWaterBoundariesSimplified(minLng, minLat, maxLng, maxLat, zoom);
} on DioException catch (e) {
    print('Exception when calling GeoLensApi->geoLensControllerGetWaterBoundariesSimplified: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **minLng** | **String**|  | [optional] 
 **minLat** | **String**|  | [optional] 
 **maxLng** | **String**|  | [optional] 
 **maxLat** | **String**|  | [optional] 
 **zoom** | **String**|  | [optional] 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **geoLensControllerGetWeather**
> geoLensControllerGetWeather(lat, lng)

Get current weather from backend proxy

### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getGeoLensApi();
final num lat = 8.14; // num | 
final num lng = 8.14; // num | 

try {
    api.geoLensControllerGetWeather(lat, lng);
} on DioException catch (e) {
    print('Exception when calling GeoLensApi->geoLensControllerGetWeather: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **lat** | **num**|  | 
 **lng** | **num**|  | 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **geoLensControllerGetWetlandStates**
> geoLensControllerGetWetlandStates()

Get all unique wetland states

### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getGeoLensApi();

try {
    api.geoLensControllerGetWetlandStates();
} on DioException catch (e) {
    print('Exception when calling GeoLensApi->geoLensControllerGetWetlandStates: $e\n');
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

# **geoLensControllerGetWetlands**
> geoLensControllerGetWetlands(state, district)

Get wetlands filtered by state/district

### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getGeoLensApi();
final String state = state_example; // String | 
final String district = district_example; // String | 

try {
    api.geoLensControllerGetWetlands(state, district);
} on DioException catch (e) {
    print('Exception when calling GeoLensApi->geoLensControllerGetWetlands: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **state** | **String**|  | [optional] 
 **district** | **String**|  | [optional] 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **geoLensControllerGetWetlandsCsv**
> geoLensControllerGetWetlandsCsv(state)

Get wetlands in CSV-compatible format (for frontend)

### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getGeoLensApi();
final String state = state_example; // String | 

try {
    api.geoLensControllerGetWetlandsCsv(state);
} on DioException catch (e) {
    print('Exception when calling GeoLensApi->geoLensControllerGetWetlandsCsv: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **state** | **String**|  | [optional] 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

