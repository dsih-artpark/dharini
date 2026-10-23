# es_client.model.SiteResponseData

## Load the model package
```dart
import 'package:es_client/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**collectionDayOfWeek** | [**BuiltList&lt;DayOfWeek&gt;**](DayOfWeek.md) |  | [optional] 
**collectionStartDate** | [**DateTime**](DateTime.md) | The date when collection visits should start | [optional] 
**farmType** | **String** | Type of farm/site based on the disease (e.g. Poultry Farm, Wetland, Cattle Farm) | [optional] 
**siteSubType** | **String** | Sub-type of the farm/site (e.g. Broiler, Breeder, Layer, Backyard) | [optional] 
**siteType** | [**SiteType**](SiteType.md) |  | [optional] 
**diseases** | [**BuiltList&lt;Disease&gt;**](Disease.md) |  | 
**collectionCollector** | [**User**](User.md) |  | [optional] 
**createdBy** | [**UserWithTeamResponse**](UserWithTeamResponse.md) |  | [optional] 
**location** | [**Location**](Location.md) |  | [optional] 
**id** | **String** |  | 
**name** | **String** |  | 
**siteCode** | **String** |  | [optional] 
**collectionConsent** | **String** |  | [optional] 
**collectionFrequencyInterval** | **num** |  | [optional] 
**collectionFrequency** | **num** |  | [optional] 
**collectionTime** | **String** |  | [optional] 
**collectionLastScheduleDate** | [**DateTime**](DateTime.md) |  | [optional] 
**collectionDuration** | **num** |  | [optional] 
**collectionExpiryDate** | [**DateTime**](DateTime.md) |  | [optional] 
**photos** | **BuiltList&lt;String&gt;** |  | [optional] 
**siteOwnerName** | **String** |  | [optional] 
**siteOwnerNumber** | **String** |  | [optional] 
**workerNumber** | **num** |  | [optional] 
**address** | **String** |  | [optional] 
**pinCode** | **num** |  | [optional] 
**comment** | **String** |  | [optional] 
**createdAt** | [**DateTime**](DateTime.md) |  | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


