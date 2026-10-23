# es_client.api.StatisticsApi

## Load the API package
```dart
import 'package:es_client/api.dart';
```

All URIs are relative to *http://localhost:4000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**statisticsControllerExploreSites**](StatisticsApi.md#statisticscontrollerexploresites) | **GET** /statistics/explore-sites | 
[**statisticsControllerExportSieWiseSampleBreakDown**](StatisticsApi.md#statisticscontrollerexportsiewisesamplebreakdown) | **GET** /statistics/site-wise-samples-breakdown/download-csv | 
[**statisticsControllerGetDiseaseWiseAnalysis**](StatisticsApi.md#statisticscontrollergetdiseasewiseanalysis) | **GET** /statistics/disease-wise-analysis | 
[**statisticsControllerGetDiseaseWiseSample**](StatisticsApi.md#statisticscontrollergetdiseasewisesample) | **GET** /statistics/disease-wise-positive-samples | 
[**statisticsControllerGetHomeLast30Days**](StatisticsApi.md#statisticscontrollergethomelast30days) | **GET** /statistics/home-last-30-days | 
[**statisticsControllerGetMonitorDashboardStats**](StatisticsApi.md#statisticscontrollergetmonitordashboardstats) | **GET** /statistics/monitor-dashboard | 
[**statisticsControllerGetMostPositive**](StatisticsApi.md#statisticscontrollergetmostpositive) | **GET** /statistics/most-positive-sites | 
[**statisticsControllerGetProjectComparison**](StatisticsApi.md#statisticscontrollergetprojectcomparison) | **GET** /statistics/project-comparison | 
[**statisticsControllerGetProjectSampleTypes**](StatisticsApi.md#statisticscontrollergetprojectsampletypes) | **GET** /statistics/project-sample-types | 
[**statisticsControllerGetProjectStats**](StatisticsApi.md#statisticscontrollergetprojectstats) | **GET** /statistics/projects | 
[**statisticsControllerGetSampleStatLogistics**](StatisticsApi.md#statisticscontrollergetsamplestatlogistics) | **GET** /statistics/disease-wise-sample-stat | 
[**statisticsControllerGetSampleTypeComparison**](StatisticsApi.md#statisticscontrollergetsampletypecomparison) | **GET** /statistics/sample-type-comparison | 
[**statisticsControllerGetSampleWiseAnalysis**](StatisticsApi.md#statisticscontrollergetsamplewiseanalysis) | **GET** /statistics/sample-wise-analysis | 
[**statisticsControllerGetSiteComparison**](StatisticsApi.md#statisticscontrollergetsitecomparison) | **GET** /statistics/site-comparison | 
[**statisticsControllerGetSiteOnDisease**](StatisticsApi.md#statisticscontrollergetsiteondisease) | **GET** /statistics/weekly-update | 
[**statisticsControllerGetSiteWiseAnalysis**](StatisticsApi.md#statisticscontrollergetsitewiseanalysis) | **GET** /statistics/site-wise-analysis | 
[**statisticsControllerSieWiseSampleBreakDown**](StatisticsApi.md#statisticscontrollersiewisesamplebreakdown) | **GET** /statistics/site-wise-samples-breakdown | 


# **statisticsControllerExploreSites**
> ExploreSitesResponse statisticsControllerExploreSites(month, year, period, workspaceId, projectId, variant, testResult, sampleTypeId, siteId, surveillanceType, endDate, startDate, disease, regionId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getStatisticsApi();
final num month = 6; // num | 1-12
final num year = 2025; // num | 
final String period = period_example; // String | Time window on sample collection date. Defaults to overall (all data). year needs `year`; month needs `year` and `month`.
final String workspaceId = workspaceId_example; // String | 
final String projectId = projectId_example; // String | 
final String variant = variant_example; // String | 
final String testResult = testResult_example; // String | 
final String sampleTypeId = sampleTypeId_example; // String | 
final String siteId = siteId_example; // String | 
final String surveillanceType = Active Surveillance; // String | 
final String endDate = 2024-12-31; // String | 
final String startDate = 2024-01-01; // String | 
final String disease = Foot & Mouth Disease; // String | 
final String regionId = 123; // String | 

try {
    final response = api.statisticsControllerExploreSites(month, year, period, workspaceId, projectId, variant, testResult, sampleTypeId, siteId, surveillanceType, endDate, startDate, disease, regionId);
    print(response);
} on DioException catch (e) {
    print('Exception when calling StatisticsApi->statisticsControllerExploreSites: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **month** | **num**| 1-12 | [optional] 
 **year** | **num**|  | [optional] 
 **period** | **String**| Time window on sample collection date. Defaults to overall (all data). year needs `year`; month needs `year` and `month`. | [optional] 
 **workspaceId** | **String**|  | [optional] 
 **projectId** | **String**|  | [optional] 
 **variant** | **String**|  | [optional] 
 **testResult** | **String**|  | [optional] 
 **sampleTypeId** | **String**|  | [optional] 
 **siteId** | **String**|  | [optional] 
 **surveillanceType** | **String**|  | [optional] 
 **endDate** | **String**|  | [optional] 
 **startDate** | **String**|  | [optional] 
 **disease** | **String**|  | [optional] 
 **regionId** | **String**|  | [optional] 

### Return type

[**ExploreSitesResponse**](ExploreSitesResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **statisticsControllerExportSieWiseSampleBreakDown**
> SampleBreakDownResponse statisticsControllerExportSieWiseSampleBreakDown(region, disease)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getStatisticsApi();
final String region = district_501; // String | 
final String disease = disease UUID; // String | 

try {
    final response = api.statisticsControllerExportSieWiseSampleBreakDown(region, disease);
    print(response);
} on DioException catch (e) {
    print('Exception when calling StatisticsApi->statisticsControllerExportSieWiseSampleBreakDown: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **region** | **String**|  | [optional] 
 **disease** | **String**|  | [optional] 

### Return type

[**SampleBreakDownResponse**](SampleBreakDownResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **statisticsControllerGetDiseaseWiseAnalysis**
> JsonObject statisticsControllerGetDiseaseWiseAnalysis()



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getStatisticsApi();

try {
    final response = api.statisticsControllerGetDiseaseWiseAnalysis();
    print(response);
} on DioException catch (e) {
    print('Exception when calling StatisticsApi->statisticsControllerGetDiseaseWiseAnalysis: $e\n');
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

# **statisticsControllerGetDiseaseWiseSample**
> DiseaseStatsResponse statisticsControllerGetDiseaseWiseSample()



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getStatisticsApi();

try {
    final response = api.statisticsControllerGetDiseaseWiseSample();
    print(response);
} on DioException catch (e) {
    print('Exception when calling StatisticsApi->statisticsControllerGetDiseaseWiseSample: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**DiseaseStatsResponse**](DiseaseStatsResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **statisticsControllerGetHomeLast30Days**
> JsonObject statisticsControllerGetHomeLast30Days(workspaceId, projectId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getStatisticsApi();
final String workspaceId = workspaceId_example; // String | 
final String projectId = projectId_example; // String | 

try {
    final response = api.statisticsControllerGetHomeLast30Days(workspaceId, projectId);
    print(response);
} on DioException catch (e) {
    print('Exception when calling StatisticsApi->statisticsControllerGetHomeLast30Days: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **workspaceId** | **String**|  | [optional] 
 **projectId** | **String**|  | [optional] 

### Return type

[**JsonObject**](JsonObject.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **statisticsControllerGetMonitorDashboardStats**
> MonitorDashboardResponse statisticsControllerGetMonitorDashboardStats(subdistrictId, districtId, stateId, endDate, startDate, variant, testResult, sampleTypeId, siteId, diseaseId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getStatisticsApi();
final BuiltList<String> subdistrictId = ; // BuiltList<String> | 
final BuiltList<String> districtId = ; // BuiltList<String> | 
final BuiltList<String> stateId = ; // BuiltList<String> | 
final String endDate = endDate_example; // String | 
final String startDate = startDate_example; // String | 
final BuiltList<String> variant = ; // BuiltList<String> | 
final BuiltList<String> testResult = ; // BuiltList<String> | 
final BuiltList<String> sampleTypeId = ; // BuiltList<String> | 
final BuiltList<String> siteId = ; // BuiltList<String> | 
final BuiltList<String> diseaseId = ; // BuiltList<String> | 

try {
    final response = api.statisticsControllerGetMonitorDashboardStats(subdistrictId, districtId, stateId, endDate, startDate, variant, testResult, sampleTypeId, siteId, diseaseId);
    print(response);
} on DioException catch (e) {
    print('Exception when calling StatisticsApi->statisticsControllerGetMonitorDashboardStats: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **subdistrictId** | [**BuiltList&lt;String&gt;**](String.md)|  | [optional] 
 **districtId** | [**BuiltList&lt;String&gt;**](String.md)|  | [optional] 
 **stateId** | [**BuiltList&lt;String&gt;**](String.md)|  | [optional] 
 **endDate** | **String**|  | [optional] 
 **startDate** | **String**|  | [optional] 
 **variant** | [**BuiltList&lt;String&gt;**](String.md)|  | [optional] 
 **testResult** | [**BuiltList&lt;String&gt;**](String.md)|  | [optional] 
 **sampleTypeId** | [**BuiltList&lt;String&gt;**](String.md)|  | [optional] 
 **siteId** | [**BuiltList&lt;String&gt;**](String.md)|  | [optional] 
 **diseaseId** | [**BuiltList&lt;String&gt;**](String.md)|  | [optional] 

### Return type

[**MonitorDashboardResponse**](MonitorDashboardResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **statisticsControllerGetMostPositive**
> MostPositiveSiteResponse statisticsControllerGetMostPositive(endDate, startDate, diseaseId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getStatisticsApi();
final String endDate = 2024-12-31; // String | 
final String startDate = 2024-01-01; // String | 
final BuiltList<String> diseaseId = 1234567; // BuiltList<String> | 

try {
    final response = api.statisticsControllerGetMostPositive(endDate, startDate, diseaseId);
    print(response);
} on DioException catch (e) {
    print('Exception when calling StatisticsApi->statisticsControllerGetMostPositive: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **endDate** | **String**|  | 
 **startDate** | **String**|  | 
 **diseaseId** | [**BuiltList&lt;String&gt;**](String.md)|  | [optional] 

### Return type

[**MostPositiveSiteResponse**](MostPositiveSiteResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **statisticsControllerGetProjectComparison**
> JsonObject statisticsControllerGetProjectComparison(subdistrictId, districtId, stateId, endDate, startDate, variant, testResult, sampleTypeId, siteId, diseaseId, projectId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getStatisticsApi();
final BuiltList<String> subdistrictId = ; // BuiltList<String> | 
final BuiltList<String> districtId = ; // BuiltList<String> | 
final BuiltList<String> stateId = ; // BuiltList<String> | 
final String endDate = endDate_example; // String | 
final String startDate = startDate_example; // String | 
final BuiltList<String> variant = ; // BuiltList<String> | 
final BuiltList<String> testResult = ; // BuiltList<String> | 
final BuiltList<String> sampleTypeId = ; // BuiltList<String> | 
final BuiltList<String> siteId = ; // BuiltList<String> | 
final BuiltList<String> diseaseId = ; // BuiltList<String> | 
final BuiltList<String> projectId = ; // BuiltList<String> | 

try {
    final response = api.statisticsControllerGetProjectComparison(subdistrictId, districtId, stateId, endDate, startDate, variant, testResult, sampleTypeId, siteId, diseaseId, projectId);
    print(response);
} on DioException catch (e) {
    print('Exception when calling StatisticsApi->statisticsControllerGetProjectComparison: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **subdistrictId** | [**BuiltList&lt;String&gt;**](String.md)|  | [optional] 
 **districtId** | [**BuiltList&lt;String&gt;**](String.md)|  | [optional] 
 **stateId** | [**BuiltList&lt;String&gt;**](String.md)|  | [optional] 
 **endDate** | **String**|  | [optional] 
 **startDate** | **String**|  | [optional] 
 **variant** | [**BuiltList&lt;String&gt;**](String.md)|  | [optional] 
 **testResult** | [**BuiltList&lt;String&gt;**](String.md)|  | [optional] 
 **sampleTypeId** | [**BuiltList&lt;String&gt;**](String.md)|  | [optional] 
 **siteId** | [**BuiltList&lt;String&gt;**](String.md)|  | [optional] 
 **diseaseId** | [**BuiltList&lt;String&gt;**](String.md)|  | [optional] 
 **projectId** | [**BuiltList&lt;String&gt;**](String.md)|  | [optional] 

### Return type

[**JsonObject**](JsonObject.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **statisticsControllerGetProjectSampleTypes**
> JsonObject statisticsControllerGetProjectSampleTypes()



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getStatisticsApi();

try {
    final response = api.statisticsControllerGetProjectSampleTypes();
    print(response);
} on DioException catch (e) {
    print('Exception when calling StatisticsApi->statisticsControllerGetProjectSampleTypes: $e\n');
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

# **statisticsControllerGetProjectStats**
> PaginatedProjectDiseaseStatsResponse statisticsControllerGetProjectStats()



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getStatisticsApi();

try {
    final response = api.statisticsControllerGetProjectStats();
    print(response);
} on DioException catch (e) {
    print('Exception when calling StatisticsApi->statisticsControllerGetProjectStats: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**PaginatedProjectDiseaseStatsResponse**](PaginatedProjectDiseaseStatsResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **statisticsControllerGetSampleStatLogistics**
> SampleStatLogisticResponse statisticsControllerGetSampleStatLogistics(diseaseId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getStatisticsApi();
final String diseaseId = disease UUID; // String | 

try {
    final response = api.statisticsControllerGetSampleStatLogistics(diseaseId);
    print(response);
} on DioException catch (e) {
    print('Exception when calling StatisticsApi->statisticsControllerGetSampleStatLogistics: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **diseaseId** | **String**|  | [optional] 

### Return type

[**SampleStatLogisticResponse**](SampleStatLogisticResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **statisticsControllerGetSampleTypeComparison**
> JsonObject statisticsControllerGetSampleTypeComparison(sampleType2Id, sampleType1Id, endDate, startDate, stateId, siteId, projectId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getStatisticsApi();
final String sampleType2Id = sampleType2Id_example; // String | 
final String sampleType1Id = sampleType1Id_example; // String | 
final String endDate = endDate_example; // String | 
final String startDate = startDate_example; // String | 
final BuiltList<String> stateId = ; // BuiltList<String> | 
final BuiltList<String> siteId = ; // BuiltList<String> | 
final String projectId = projectId_example; // String | 

try {
    final response = api.statisticsControllerGetSampleTypeComparison(sampleType2Id, sampleType1Id, endDate, startDate, stateId, siteId, projectId);
    print(response);
} on DioException catch (e) {
    print('Exception when calling StatisticsApi->statisticsControllerGetSampleTypeComparison: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **sampleType2Id** | **String**|  | 
 **sampleType1Id** | **String**|  | 
 **endDate** | **String**|  | [optional] 
 **startDate** | **String**|  | [optional] 
 **stateId** | [**BuiltList&lt;String&gt;**](String.md)|  | [optional] 
 **siteId** | [**BuiltList&lt;String&gt;**](String.md)|  | [optional] 
 **projectId** | **String**|  | [optional] 

### Return type

[**JsonObject**](JsonObject.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **statisticsControllerGetSampleWiseAnalysis**
> JsonObject statisticsControllerGetSampleWiseAnalysis()



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getStatisticsApi();

try {
    final response = api.statisticsControllerGetSampleWiseAnalysis();
    print(response);
} on DioException catch (e) {
    print('Exception when calling StatisticsApi->statisticsControllerGetSampleWiseAnalysis: $e\n');
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

# **statisticsControllerGetSiteComparison**
> JsonObject statisticsControllerGetSiteComparison(site2Id, site1Id, endDate, startDate, sampleTypeId, projectId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getStatisticsApi();
final String site2Id = site2Id_example; // String | 
final String site1Id = site1Id_example; // String | 
final String endDate = endDate_example; // String | 
final String startDate = startDate_example; // String | 
final BuiltList<String> sampleTypeId = ; // BuiltList<String> | 
final String projectId = projectId_example; // String | 

try {
    final response = api.statisticsControllerGetSiteComparison(site2Id, site1Id, endDate, startDate, sampleTypeId, projectId);
    print(response);
} on DioException catch (e) {
    print('Exception when calling StatisticsApi->statisticsControllerGetSiteComparison: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **site2Id** | **String**|  | 
 **site1Id** | **String**|  | 
 **endDate** | **String**|  | [optional] 
 **startDate** | **String**|  | [optional] 
 **sampleTypeId** | [**BuiltList&lt;String&gt;**](String.md)|  | [optional] 
 **projectId** | **String**|  | [optional] 

### Return type

[**JsonObject**](JsonObject.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **statisticsControllerGetSiteOnDisease**
> GetSiteOnDiseaseResponse statisticsControllerGetSiteOnDisease()



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getStatisticsApi();

try {
    final response = api.statisticsControllerGetSiteOnDisease();
    print(response);
} on DioException catch (e) {
    print('Exception when calling StatisticsApi->statisticsControllerGetSiteOnDisease: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**GetSiteOnDiseaseResponse**](GetSiteOnDiseaseResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **statisticsControllerGetSiteWiseAnalysis**
> JsonObject statisticsControllerGetSiteWiseAnalysis()



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getStatisticsApi();

try {
    final response = api.statisticsControllerGetSiteWiseAnalysis();
    print(response);
} on DioException catch (e) {
    print('Exception when calling StatisticsApi->statisticsControllerGetSiteWiseAnalysis: $e\n');
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

# **statisticsControllerSieWiseSampleBreakDown**
> SampleBreakDownResponse statisticsControllerSieWiseSampleBreakDown(region, disease)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getStatisticsApi();
final String region = district_501; // String | 
final String disease = disease UUID; // String | 

try {
    final response = api.statisticsControllerSieWiseSampleBreakDown(region, disease);
    print(response);
} on DioException catch (e) {
    print('Exception when calling StatisticsApi->statisticsControllerSieWiseSampleBreakDown: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **region** | **String**|  | [optional] 
 **disease** | **String**|  | [optional] 

### Return type

[**SampleBreakDownResponse**](SampleBreakDownResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

