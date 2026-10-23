# es_client.model.UpdateVisitDto

## Load the model package
```dart
import 'package:es_client/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**visitStartedAt** | [**DateTime**](DateTime.md) | Timestamp when the collector opened the page | [optional] 
**visitStatus** | [**VisitStatus**](VisitStatus.md) |  | 
**siteId** | **String** | site id | [optional] 
**photos** | **BuiltList&lt;String&gt;** | file path | [optional] 
**comment** | **String** | comment | [optional] 
**visitedBy** | **String** | team member id | [optional] 
**suspectDiseaseData** | **BuiltList&lt;String&gt;** | This data is updating result of test result for disease | [optional] 
**diseaseQuestionnaireData** | [**JsonObject**](.md) | Disease questionnaire responses grouped by disease shortName | [optional] 
**environmentalQuestionnaireData** | [**JsonObject**](.md) | Environmental questionnaire responses | [optional] 
**latitude** | **num** | Latitude of location where visit was completed | [optional] 
**longitude** | **num** | Longitude of location where visit was completed | [optional] 
**visitedAt** | [**DateTime**](DateTime.md) |  | [optional] 
**isCompleted** | **bool** |  | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


