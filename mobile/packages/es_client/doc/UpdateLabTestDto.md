# es_client.model.UpdateLabTestDto

## Load the model package
```dart
import 'package:es_client/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**sample** | [**JsonObject**](.md) | Sample UUID | [optional] 
**disease** | [**JsonObject**](.md) | Disease UUID | [optional] 
**kitOrProtocol** | **String** | Kit or Protocol of Test | [optional] 
**testedAt** | [**DateTime**](DateTime.md) | Tested Date of Test | [optional] 
**labComment** | **String** | comments of Test | [optional] 
**testedBy** | [**JsonObject**](.md) | User who tested the sample | [optional] 
**details** | [**JsonObject**](.md) | Additional dynamic details (e.g. ct values, storage) | [optional] 
**testResult** | [**TestResultType**](TestResultType.md) | Test Result | [optional] 
**ctValue** | **String** | Kit or Protocol of Test | [optional] 
**variant** | **String** | Variant detected | [optional] 
**viralLoad** | **String** | Viral load detected | [optional] 
**testResultReport** | **String** | Result Report document of Test | [optional] 
**id** | **String** |  | 
**resultDate** | [**DateTime**](DateTime.md) | Tested Date of Test | [optional] 
**resultComment** | **String** | comments of Test | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


