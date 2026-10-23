# es_client.model.CreateSampleOnVisitDto

## Load the model package
```dart
import 'package:es_client/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**quantity** | **num** | Quantity | [optional] 
**replicates** | **String** | Replicates | 
**unit** | **String** | Unit | [optional] 
**photos** | **BuiltList&lt;String&gt;** | file path | [optional] 
**barcode** | **String** | barcode | 
**originalSampleBarcode** | **String** | barcode of original sample if exist | [optional] 
**diseases** | [**BuiltList&lt;JsonObject&gt;**](JsonObject.md) | disease id array | 
**testDate** | [**DateTime**](DateTime.md) | when the sample is tested | [optional] 
**collectedBy** | [**JsonObject**](.md) | who tested the sample | 
**location** | **String** | location | [optional] 
**sampleStatus** | **String** | enum [positive, negative, unclear] | [optional] 
**testedBy** | **String** | who has tested  | [optional] 
**comment** | **String** | comments | [optional] 
**sampleType** | [**JsonObject**](.md) | Sample type UUID | 
**species** | [**JsonObject**](.md) | Species UUID | [optional] 
**details** | [**JsonObject**](.md) | Additional sample metadata (e.g. animal info for FMD/LSD, farm info for AI) | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


