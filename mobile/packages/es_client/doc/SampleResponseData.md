# es_client.model.SampleResponseData

## Load the model package
```dart
import 'package:es_client/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**replicates** | [**ReplicateAvailability**](ReplicateAvailability.md) |  | [optional] 
**sampleStatus** | [**SampleStatus**](SampleStatus.md) |  | 
**barcode** | **String** |  | 
**project** | [**Project**](Project.md) |  | [optional] 
**site** | [**SiteResponseData**](SiteResponseData.md) |  | [optional] 
**diseases** | [**BuiltList&lt;Disease&gt;**](Disease.md) |  | [optional] 
**team** | [**Team**](Team.md) |  | [optional] 
**location** | [**Location**](Location.md) |  | [optional] 
**visit** | [**Visit**](Visit.md) |  | [optional] 
**labTests** | [**BuiltList&lt;LabTestResponseData&gt;**](LabTestResponseData.md) |  | [optional] 
**hasAI** | **bool** |  | [optional] 
**originalSampleId** | **String** |  | [optional] 
**id** | **String** |  | 
**sampleCode** | **String** |  | [optional] 
**collectedAt** | [**DateTime**](DateTime.md) |  | 
**quantity** | **num** |  | [optional] 
**unit** | **String** |  | [optional] 
**habitat** | **String** |  | [optional] 
**conc** | **String** |  | [optional] 
**collectionTime** | [**DateTime**](DateTime.md) |  | 
**photos** | **BuiltList&lt;String&gt;** |  | 
**comment** | **String** |  | [optional] 
**rejectReason** | **String** |  | [optional] 
**receivedAt** | [**DateTime**](DateTime.md) |  | [optional] 
**receivedVolumeValue** | **String** |  | [optional] 
**receivedVolumeUnit** | **String** |  | [optional] 
**receivedLabStorageDetails** | **String** |  | [optional] 
**extractionDateTime** | [**DateTime**](DateTime.md) |  | [optional] 
**extractionSampleUsedValue** | **String** |  | [optional] 
**extractionSampleUsedUnit** | **String** |  | [optional] 
**extractionSampleRemainingValue** | **String** |  | [optional] 
**extractionSampleRemainingUnit** | **String** |  | [optional] 
**extractionComments** | **String** |  | [optional] 
**receivedBy** | [**User**](User.md) |  | [optional] 
**extractedBy** | [**User**](User.md) |  | [optional] 
**collectedBy** | [**User**](User.md) |  | [optional] 
**reportGeneratedBy** | [**User**](User.md) |  | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


