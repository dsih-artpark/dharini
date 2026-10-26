# es_client.model.CreateSampleDto

## Load the model package
```dart
import 'package:es_client/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**quantity** | **num** | Quantity | [optional] 
**replicates** | **String** | Replicates | [optional] 
**unit** | **String** | Unit | [optional] 
**photos** | **BuiltList&lt;String&gt;** | File path | [optional] 
**barcode** | **String** | Barcode | 
**originalSampleBarcode** | **String** | Barcode of original sample if exist | [optional] 
**site** | [**JsonObject**](.md) | Site UUID | 
**team** | [**JsonObject**](.md) | Team UUID | 
**diseases** | [**BuiltList&lt;JsonObject&gt;**](JsonObject.md) | Disease ID array | 
**testDate** | [**DateTime**](DateTime.md) | When the sample is tested | [optional] 
**collectedBy** | [**JsonObject**](.md) | Who collected the sample | [optional] 
**receivedBy** | [**JsonObject**](.md) | Who received the sample | [optional] 
**extractedBy** | [**JsonObject**](.md) | Who extracted the sample | [optional] 
**testedBy** | [**JsonObject**](.md) | Who tested the sample | [optional] 
**reportGeneratedBy** | [**JsonObject**](.md) | Who generated the sample report | [optional] 
**latitude** | **num** | latitude | [optional] 
**longitude** | **num** | longitude | [optional] 
**sampleStatus** | **String** | Sample status enum [picked-up, received, extracted, tested, rejected, test-report-generated] | [optional] 
**comment** | **String** | Comments | [optional] 
**visit** | [**JsonObject**](.md) | Visit UUID | 
**sampleType** | [**JsonObject**](.md) | Sample type UUID | 
**species** | [**JsonObject**](.md) | Species UUID | [optional] 
**rejectReason** | **String** | Reason for rejection | [optional] 
**receivedAt** | [**DateTime**](DateTime.md) | Timestamp when the sample was received | [optional] 
**receivedVolumeValue** | **String** | Received volume value | [optional] 
**receivedVolumeUnit** | **String** | Received volume unit | [optional] 
**receivedLabStorageDetails** | **String** | Received lab storage details | [optional] 
**referenceBatchId** | **String** | Reference batch ID | [optional] 
**batchReferenceDocument** | **String** | Batch reference document (URL or filename) | [optional] 
**accessionId** | **String** | Accession ID | [optional] 
**extractionDateTime** | [**DateTime**](DateTime.md) | Timestamp when extraction was performed | [optional] 
**extractionSampleUsedValue** | **String** | Sample used value for extraction | [optional] 
**extractionSampleUsedUnit** | **String** | Sample used unit for extraction | [optional] 
**extractionSampleRemainingValue** | **String** | Remaining sample value after extraction | [optional] 
**extractionSampleRemainingUnit** | **String** | Remaining sample unit after extraction | [optional] 
**extractionComments** | **String** | Comments related to the extraction process | [optional] 
**preprocessingSteps** | [**BuiltList&lt;JsonObject&gt;**](JsonObject.md) | Pre-processing steps data | [optional] 
**preprocessingDate** | [**DateTime**](DateTime.md) | Pre-processing date | [optional] 
**preprocessingStorageTemperature** | **String** | Pre-processing storage temperature | [optional] 
**preprocessingStorageDetails** | **String** | Pre-processing storage details | [optional] 
**preprocessingPerformedBy** | [**JsonObject**](.md) | User who performed pre-processing | [optional] 
**pooledSampleIds** | **BuiltList&lt;String&gt;** | IDs of samples pooled with this sample | [optional] 
**pooledWith** | [**BuiltList&lt;JsonObject&gt;**](JsonObject.md) | Samples pooled with this sample (resolved entities) | [optional] 
**isPooledSample** | **bool** | Whether this is a pooled sample | [optional] 
**details** | [**JsonObject**](.md) | Additional dynamic details (e.g. extraction metadata) | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


