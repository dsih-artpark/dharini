# es_client.model.VisitResponseData

## Load the model package
```dart
import 'package:es_client/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**visitStartedAt** | [**DateTime**](DateTime.md) | Timestamp when the collector opened the page | [optional] 
**visitStatus** | [**VisitStatus**](VisitStatus.md) |  | 
**round** | **num** | Sequential round number of this visit for its site (Nth visit, ordered by schedule date) | [optional] 
**suspectedPositives** | [**BuiltList&lt;SuspectedPositivesData&gt;**](SuspectedPositivesData.md) |  | [optional] 
**site** | [**VisitSiteData**](VisitSiteData.md) |  | 
**samples** | [**BuiltList&lt;VisitSampleData&gt;**](VisitSampleData.md) |  | 
**collector** | [**User**](User.md) |  | [optional] 
**visitedBy** | [**User**](User.md) |  | [optional] 
**id** | **String** |  | 
**visitedAt** | [**DateTime**](DateTime.md) |  | [optional] 
**visitScheduledAt** | [**DateTime**](DateTime.md) |  | 
**comment** | **String** |  | [optional] 
**isCompleted** | **bool** |  | 
**rescheduledFrom** | [**DateTime**](DateTime.md) |  | [optional] 
**createdAt** | [**DateTime**](DateTime.md) |  | 
**updatedAt** | [**DateTime**](DateTime.md) |  | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


