# es_client.model.UpdateSiteDto

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
**siteType** | [**SiteType**](SiteType.md) |  | [optional] 
**photos** | **BuiltList&lt;String&gt;** | file path | 
**regionId** | **String** | ID of the region | 
**latitude** | **num** | latitude | 
**longitude** | **num** | longitude | 
**collectionCollector** | **String** | collectionCollector id | 
**collectionConsent** | **String** | Site owner's collection consent: 'true' or 'false' | [optional] 
**name** | **String** |  | 
**collectionFrequencyInterval** | **num** |  | [optional] 
**collectionFrequency** | **num** |  | [optional] 
**collectionTime** | **String** |  | [optional] 
**collectionDuration** | **num** |  | [optional] 
**siteOwnerName** | **String** |  | [optional] 
**siteOwnerNumber** | **String** |  | [optional] 
**workerNumber** | **num** |  | [optional] 
**address** | **String** |  | [optional] 
**pinCode** | **num** |  | [optional] 
**comment** | **String** |  | [optional] 
**block** | **String** |  | [optional] 
**village** | **String** |  | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


