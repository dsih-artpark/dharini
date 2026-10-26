# es_client.api.ProjectsApi

## Load the API package
```dart
import 'package:es_client/api.dart';
```

All URIs are relative to *http://localhost:4000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**projectsControllerAddMember**](ProjectsApi.md#projectscontrolleraddmember) | **POST** /projects/{projectId}/teams/{teamId}/member | Create Team Member
[**projectsControllerAddMembersList**](ProjectsApi.md#projectscontrolleraddmemberslist) | **POST** /projects/{projectId}/members-list | 
[**projectsControllerCreate**](ProjectsApi.md#projectscontrollercreate) | **POST** /projects | 
[**projectsControllerCreateLabTest**](ProjectsApi.md#projectscontrollercreatelabtest) | **POST** /projects/{projectId}/samples/{sampleId}/lab-tests | 
[**projectsControllerCreateSample**](ProjectsApi.md#projectscontrollercreatesample) | **POST** /projects/{projectId}/samples | Create Sample
[**projectsControllerCreateSite**](ProjectsApi.md#projectscontrollercreatesite) | **POST** /projects/{projectId}/sites | Create Site
[**projectsControllerCreateTeam**](ProjectsApi.md#projectscontrollercreateteam) | **POST** /projects/{projectId}/teams | Create Team
[**projectsControllerCreateVisit**](ProjectsApi.md#projectscontrollercreatevisit) | **POST** /projects/{projectId}/visits | 
[**projectsControllerEditCollectedSampleDetails**](ProjectsApi.md#projectscontrollereditcollectedsampledetails) | **POST** /projects/{projectId}/samples/{sampleId}/edit-details | Edit collected sample details
[**projectsControllerEditSampleDetailsByStage**](ProjectsApi.md#projectscontrollereditsampledetailsbystage) | **POST** /projects/{projectId}/samples/{sampleId}/edit-details/{stage} | Edit sample details for a lab workflow stage
[**projectsControllerExportProjects**](ProjectsApi.md#projectscontrollerexportprojects) | **GET** /projects/download-csv | 
[**projectsControllerFindAll**](ProjectsApi.md#projectscontrollerfindall) | **GET** /projects | 
[**projectsControllerFindAllSamples**](ProjectsApi.md#projectscontrollerfindallsamples) | **GET** /projects/{projectId}/samples | 
[**projectsControllerFindAllSites**](ProjectsApi.md#projectscontrollerfindallsites) | **GET** /projects/{projectId}/sites-statistics-by-diseases | 
[**projectsControllerFindAllTeams**](ProjectsApi.md#projectscontrollerfindallteams) | **GET** /projects/{projectId}/teams | 
[**projectsControllerFindById**](ProjectsApi.md#projectscontrollerfindbyid) | **GET** /projects/{projectId}/visits/{visitId} | 
[**projectsControllerFindOne**](ProjectsApi.md#projectscontrollerfindone) | **GET** /projects/{projectId} | 
[**projectsControllerFindOneSample**](ProjectsApi.md#projectscontrollerfindonesample) | **GET** /projects/{projectId}/samples/{sampleId} | 
[**projectsControllerFindSite**](ProjectsApi.md#projectscontrollerfindsite) | **GET** /projects/{projectId}/sites/{siteId} | 
[**projectsControllerFindSites**](ProjectsApi.md#projectscontrollerfindsites) | **GET** /projects/{projectId}/sites | 
[**projectsControllerFindTeam**](ProjectsApi.md#projectscontrollerfindteam) | **GET** /projects/{projectId}/teams/{teamId} | 
[**projectsControllerGetLabTest**](ProjectsApi.md#projectscontrollergetlabtest) | **GET** /projects/{projectId}/samples/{sampleId}/lab-tests/{labTestId} | 
[**projectsControllerGetLabTestStats**](ProjectsApi.md#projectscontrollergetlabteststats) | **GET** /projects/{projectId}/samples/lab-stats | 
[**projectsControllerGetLabTests**](ProjectsApi.md#projectscontrollergetlabtests) | **GET** /projects/{projectId}/samples/{sampleId}/lab-tests | 
[**projectsControllerGetMaxRound**](ProjectsApi.md#projectscontrollergetmaxround) | **GET** /projects/{projectId}/samples/max-round | 
[**projectsControllerGetMembers**](ProjectsApi.md#projectscontrollergetmembers) | **GET** /projects/{projectId}/collectors | 
[**projectsControllerGetNearbyLocations**](ProjectsApi.md#projectscontrollergetnearbylocations) | **GET** /projects/{projectId}/sites/nearby | 
[**projectsControllerGetPoolableSamples**](ProjectsApi.md#projectscontrollergetpoolablesamples) | **GET** /projects/{projectId}/samples/{sampleId}/poolable-samples | Get samples that can be pooled with the given sample
[**projectsControllerGetProjectDetails**](ProjectsApi.md#projectscontrollergetprojectdetails) | **POST** /projects/details | 
[**projectsControllerGetProjectTeamActivityProgress**](ProjectsApi.md#projectscontrollergetprojectteamactivityprogress) | **GET** /projects/{projectId}/team-activity-progress | 
[**projectsControllerGetProjectTeamMemberActivity**](ProjectsApi.md#projectscontrollergetprojectteammemberactivity) | **GET** /projects/{projectId}/team-member-activity | 
[**projectsControllerGetProjectTeamMemberActivityExport**](ProjectsApi.md#projectscontrollergetprojectteammemberactivityexport) | **GET** /projects/{projectId}/team-member-activity/download-csv | 
[**projectsControllerGetProjectTeamMemberProgress**](ProjectsApi.md#projectscontrollergetprojectteammemberprogress) | **GET** /projects/{projectId}/team-member-progress | 
[**projectsControllerGetProjectTeamMemberProgressExport**](ProjectsApi.md#projectscontrollergetprojectteammemberprogressexport) | **GET** /projects/{projectId}/team-member-progress/download-csv | 
[**projectsControllerGetProjectTeamProgress**](ProjectsApi.md#projectscontrollergetprojectteamprogress) | **GET** /projects/{projectId}/team-progress | 
[**projectsControllerGetProjectTeamUserRoles**](ProjectsApi.md#projectscontrollergetprojectteamuserroles) | **GET** /projects/team-users/roles | 
[**projectsControllerGetProjectTeamUsers**](ProjectsApi.md#projectscontrollergetprojectteamusers) | **GET** /projects/team-users | 
[**projectsControllerGetSitesStatisticsByStatus**](ProjectsApi.md#projectscontrollergetsitesstatisticsbystatus) | **GET** /projects/{projectId}/sites-statistics-by-status | 
[**projectsControllerGetTeamActivityOverview**](ProjectsApi.md#projectscontrollergetteamactivityoverview) | **GET** /projects/{projectId}/teams/{teamId}/activity-overview | 
[**projectsControllerGetTeamMembers**](ProjectsApi.md#projectscontrollergetteammembers) | **GET** /projects/{projectId}/teams/{teamId}/members | 
[**projectsControllerGetTeamMembersFieldView**](ProjectsApi.md#projectscontrollergetteammembersfieldview) | **GET** /projects/{projectId}/teams/{teamId}/members-filed | 
[**projectsControllerGetTeamMembersVisitActivity**](ProjectsApi.md#projectscontrollergetteammembersvisitactivity) | **GET** /projects/{projectId}/teams/{teamId}/visit-activity | 
[**projectsControllerGetTeamRoles**](ProjectsApi.md#projectscontrollergetteamroles) | **GET** /projects/{projectId}/teams/available-roles | 
[**projectsControllerGetVisitSummary**](ProjectsApi.md#projectscontrollergetvisitsummary) | **GET** /projects/{projectId}/visit-summary | Visit Summary for Site
[**projectsControllerGetVisits**](ProjectsApi.md#projectscontrollergetvisits) | **GET** /projects/{projectId}/visits | 
[**projectsControllerRemoveMember**](ProjectsApi.md#projectscontrollerremovemember) | **DELETE** /projects/{projectId}/teams/{teamId}/member/{memberId} | 
[**projectsControllerRemoveMembersList**](ProjectsApi.md#projectscontrollerremovememberslist) | **DELETE** /projects/{projectId}/members-list | 
[**projectsControllerRescheduleVisit**](ProjectsApi.md#projectscontrollerreschedulevisit) | **PATCH** /projects/{projectId}/visits/{visitId}/reschedule | 
[**projectsControllerStatistics**](ProjectsApi.md#projectscontrollerstatistics) | **GET** /projects/statistics | 
[**projectsControllerSubmitVisit**](ProjectsApi.md#projectscontrollersubmitvisit) | **PUT** /projects/{projectId}/visits/{visitId}/submit-visit | 
[**projectsControllerUpdate**](ProjectsApi.md#projectscontrollerupdate) | **PATCH** /projects/{projectId} | 
[**projectsControllerUpdateLabTest**](ProjectsApi.md#projectscontrollerupdatelabtest) | **PATCH** /projects/{projectId}/samples/{sampleId}/lab-tests | 
[**projectsControllerUpdateMember**](ProjectsApi.md#projectscontrollerupdatemember) | **PATCH** /projects/{projectId}/teams/{teamId}/member/{memberId} | 
[**projectsControllerUpdateProjectTeamUserRole**](ProjectsApi.md#projectscontrollerupdateprojectteamuserrole) | **PATCH** /projects/team-users/{memberId}/role | 
[**projectsControllerUpdateSample**](ProjectsApi.md#projectscontrollerupdatesample) | **PATCH** /projects/{projectId}/samples/{sampleId} | 
[**projectsControllerUpdateSite**](ProjectsApi.md#projectscontrollerupdatesite) | **PATCH** /projects/{projectId}/sites/{siteId} | 
[**projectsControllerUpdateTeam**](ProjectsApi.md#projectscontrollerupdateteam) | **PATCH** /projects/{projectId}/teams/{teamId} | 
[**projectsControllerUpdateVisit**](ProjectsApi.md#projectscontrollerupdatevisit) | **PUT** /projects/{projectId}/visits/{visitId} | 
[**projectsControllerUploadSampleDataScript**](ProjectsApi.md#projectscontrolleruploadsampledatascript) | **POST** /projects/upload-sample-data | 
[**projectsControllerValidateBarcode**](ProjectsApi.md#projectscontrollervalidatebarcode) | **GET** /projects/{projectId}/validate-barcode/{barcode} | Validate Barcode


# **projectsControllerAddMember**
> TeamMemberResponse projectsControllerAddMember(teamId, projectId, createMemberDto)

Create Team Member

### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String teamId = teamId_example; // String | Team UUID
final String projectId = projectId_example; // String | Project UUID
final CreateMemberDto createMemberDto = ; // CreateMemberDto | 

try {
    final response = api.projectsControllerAddMember(teamId, projectId, createMemberDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerAddMember: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **teamId** | **String**| Team UUID | 
 **projectId** | **String**| Project UUID | 
 **createMemberDto** | [**CreateMemberDto**](CreateMemberDto.md)|  | 

### Return type

[**TeamMemberResponse**](TeamMemberResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerAddMembersList**
> TeamMemberListResponse projectsControllerAddMembersList(projectId, createMembersListDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID
final CreateMembersListDto createMembersListDto = ; // CreateMembersListDto | 

try {
    final response = api.projectsControllerAddMembersList(projectId, createMembersListDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerAddMembersList: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 
 **createMembersListDto** | [**CreateMembersListDto**](CreateMembersListDto.md)|  | 

### Return type

[**TeamMemberListResponse**](TeamMemberListResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerCreate**
> ProjectResponse projectsControllerCreate(createProjectDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final CreateProjectDto createProjectDto = ; // CreateProjectDto | 

try {
    final response = api.projectsControllerCreate(createProjectDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerCreate: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createProjectDto** | [**CreateProjectDto**](CreateProjectDto.md)|  | 

### Return type

[**ProjectResponse**](ProjectResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerCreateLabTest**
> ListLabTestResponse projectsControllerCreateLabTest(sampleId, projectId, createMultipleLabTestDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String sampleId = sampleId_example; // String | Sample UUID
final String projectId = projectId_example; // String | Project UUID
final CreateMultipleLabTestDto createMultipleLabTestDto = ; // CreateMultipleLabTestDto | 

try {
    final response = api.projectsControllerCreateLabTest(sampleId, projectId, createMultipleLabTestDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerCreateLabTest: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **sampleId** | **String**| Sample UUID | 
 **projectId** | **String**| Project UUID | 
 **createMultipleLabTestDto** | [**CreateMultipleLabTestDto**](CreateMultipleLabTestDto.md)|  | 

### Return type

[**ListLabTestResponse**](ListLabTestResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerCreateSample**
> SampleResponse projectsControllerCreateSample(projectId, createSampleDto)

Create Sample

### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID
final CreateSampleDto createSampleDto = ; // CreateSampleDto | 

try {
    final response = api.projectsControllerCreateSample(projectId, createSampleDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerCreateSample: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 
 **createSampleDto** | [**CreateSampleDto**](CreateSampleDto.md)|  | 

### Return type

[**SampleResponse**](SampleResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerCreateSite**
> SiteResponse projectsControllerCreateSite(projectId, createSiteDto)

Create Site

### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID
final CreateSiteDto createSiteDto = ; // CreateSiteDto | 

try {
    final response = api.projectsControllerCreateSite(projectId, createSiteDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerCreateSite: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 
 **createSiteDto** | [**CreateSiteDto**](CreateSiteDto.md)|  | 

### Return type

[**SiteResponse**](SiteResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerCreateTeam**
> TeamResponse projectsControllerCreateTeam(projectId, createTeamDto)

Create Team

### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID
final CreateTeamDto createTeamDto = ; // CreateTeamDto | 

try {
    final response = api.projectsControllerCreateTeam(projectId, createTeamDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerCreateTeam: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 
 **createTeamDto** | [**CreateTeamDto**](CreateTeamDto.md)|  | 

### Return type

[**TeamResponse**](TeamResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerCreateVisit**
> VisitResponse projectsControllerCreateVisit(projectId, createVisitDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID
final CreateVisitDto createVisitDto = ; // CreateVisitDto | 

try {
    final response = api.projectsControllerCreateVisit(projectId, createVisitDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerCreateVisit: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 
 **createVisitDto** | [**CreateVisitDto**](CreateVisitDto.md)|  | 

### Return type

[**VisitResponse**](VisitResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerEditCollectedSampleDetails**
> SampleResponse projectsControllerEditCollectedSampleDetails(projectId, sampleId, updateCollectedSampleDetailsDto)

Edit collected sample details

### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID
final String sampleId = sampleId_example; // String | Sample UUID
final UpdateCollectedSampleDetailsDto updateCollectedSampleDetailsDto = ; // UpdateCollectedSampleDetailsDto | 

try {
    final response = api.projectsControllerEditCollectedSampleDetails(projectId, sampleId, updateCollectedSampleDetailsDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerEditCollectedSampleDetails: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 
 **sampleId** | **String**| Sample UUID | 
 **updateCollectedSampleDetailsDto** | [**UpdateCollectedSampleDetailsDto**](UpdateCollectedSampleDetailsDto.md)|  | 

### Return type

[**SampleResponse**](SampleResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerEditSampleDetailsByStage**
> SampleResponse projectsControllerEditSampleDetailsByStage(projectId, sampleId, stage, updateSampleStageDetailsDto)

Edit sample details for a lab workflow stage

### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID
final String sampleId = sampleId_example; // String | Sample UUID
final String stage = stage_example; // String | Lab workflow stage: picked-up, received, virus-isolation, pre-processed, extracted, tested, test-report-generated
final UpdateSampleStageDetailsDto updateSampleStageDetailsDto = ; // UpdateSampleStageDetailsDto | 

try {
    final response = api.projectsControllerEditSampleDetailsByStage(projectId, sampleId, stage, updateSampleStageDetailsDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerEditSampleDetailsByStage: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 
 **sampleId** | **String**| Sample UUID | 
 **stage** | **String**| Lab workflow stage: picked-up, received, virus-isolation, pre-processed, extracted, tested, test-report-generated | 
 **updateSampleStageDetailsDto** | [**UpdateSampleStageDetailsDto**](UpdateSampleStageDetailsDto.md)|  | 

### Return type

[**SampleResponse**](SampleResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerExportProjects**
> projectsControllerExportProjects(disease)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String disease = disease UUID; // String | 

try {
    api.projectsControllerExportProjects(disease);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerExportProjects: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **disease** | **String**|  | [optional] 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerFindAll**
> PaginatedProjectResponse projectsControllerFindAll(disease)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String disease = disease UUID; // String | 

try {
    final response = api.projectsControllerFindAll(disease);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerFindAll: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **disease** | **String**|  | [optional] 

### Return type

[**PaginatedProjectResponse**](PaginatedProjectResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerFindAllSamples**
> PaginatedSampleResponse projectsControllerFindAllSamples(projectId, round, limit, page, endDate, startDate, sampleStatus, sampleTypeId, search, visitId, siteId, diseaseId, sortOrder, sort, workspaceId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID
final num round = 8.14; // num | 
final num limit = 10; // num | 
final num page = 1; // num | 
final String endDate = 2024-01-31; // String | 
final String startDate = 2024-01-01; // String | 
final String sampleStatus = sampleStatus_example; // String | 
final String sampleTypeId = sampleTypeId_example; // String | 
final String search = search_example; // String | 
final String visitId = visit UUID; // String | 
final String siteId = site UUID; // String | 
final String diseaseId = disease UUID; // String | 
final String sortOrder = sortOrder_example; // String | asc or desc
final String sort = sort_example; // String | Sort field
final String workspaceId = workspaceId_example; // String | 

try {
    final response = api.projectsControllerFindAllSamples(projectId, round, limit, page, endDate, startDate, sampleStatus, sampleTypeId, search, visitId, siteId, diseaseId, sortOrder, sort, workspaceId);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerFindAllSamples: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 
 **round** | **num**|  | [optional] 
 **limit** | **num**|  | [optional] 
 **page** | **num**|  | [optional] 
 **endDate** | **String**|  | [optional] 
 **startDate** | **String**|  | [optional] 
 **sampleStatus** | **String**|  | [optional] 
 **sampleTypeId** | **String**|  | [optional] 
 **search** | **String**|  | [optional] 
 **visitId** | **String**|  | [optional] 
 **siteId** | **String**|  | [optional] 
 **diseaseId** | **String**|  | [optional] 
 **sortOrder** | **String**| asc or desc | [optional] 
 **sort** | **String**| Sort field | [optional] 
 **workspaceId** | **String**|  | [optional] 

### Return type

[**PaginatedSampleResponse**](PaginatedSampleResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerFindAllSites**
> ProjectStatisticByDiseaseResponse projectsControllerFindAllSites(projectId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID

try {
    final response = api.projectsControllerFindAllSites(projectId);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerFindAllSites: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 

### Return type

[**ProjectStatisticByDiseaseResponse**](ProjectStatisticByDiseaseResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerFindAllTeams**
> ListTeamResponse projectsControllerFindAllTeams(projectId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID

try {
    final response = api.projectsControllerFindAllTeams(projectId);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerFindAllTeams: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | [optional] 

### Return type

[**ListTeamResponse**](ListTeamResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerFindById**
> VisitResponse projectsControllerFindById(projectId, visitId, siteId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID
final String visitId = visitId_example; // String | Visit UUID
final String siteId = siteId_example; // String | Site UUID

try {
    final response = api.projectsControllerFindById(projectId, visitId, siteId);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerFindById: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 
 **visitId** | **String**| Visit UUID | 
 **siteId** | **String**| Site UUID | 

### Return type

[**VisitResponse**](VisitResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerFindOne**
> ProjectResponse projectsControllerFindOne(projectId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Site UUID

try {
    final response = api.projectsControllerFindOne(projectId);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerFindOne: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Site UUID | 

### Return type

[**ProjectResponse**](ProjectResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerFindOneSample**
> SampleResponse projectsControllerFindOneSample(projectId, sampleId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID
final String sampleId = sampleId_example; // String | Sample UUID

try {
    final response = api.projectsControllerFindOneSample(projectId, sampleId);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerFindOneSample: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 
 **sampleId** | **String**| Sample UUID | 

### Return type

[**SampleResponse**](SampleResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerFindSite**
> SiteResponse projectsControllerFindSite(projectId, siteId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID
final String siteId = siteId_example; // String | Site UUID

try {
    final response = api.projectsControllerFindSite(projectId, siteId);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerFindSite: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 
 **siteId** | **String**| Site UUID | 

### Return type

[**SiteResponse**](SiteResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerFindSites**
> ListSiteResponse projectsControllerFindSites(projectId, search, farmType, filterBy, endDate, startDate, siteType, disease, testResult, project)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID
final String search = ABC Site; // String | 
final String farmType = poultry farm; // String | 
final String filterBy = newest; // String | 
final String endDate = 2024-12-31; // String | 
final String startDate = 2024-01-01; // String | 
final String siteType = private; // String | 
final String disease = 1; // String | 
final String testResult = positive; // String | 
final String project = 123; // String | 

try {
    final response = api.projectsControllerFindSites(projectId, search, farmType, filterBy, endDate, startDate, siteType, disease, testResult, project);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerFindSites: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 
 **search** | **String**|  | [optional] 
 **farmType** | **String**|  | [optional] 
 **filterBy** | **String**|  | [optional] 
 **endDate** | **String**|  | [optional] 
 **startDate** | **String**|  | [optional] 
 **siteType** | **String**|  | [optional] 
 **disease** | **String**|  | [optional] 
 **testResult** | **String**|  | [optional] 
 **project** | **String**|  | [optional] 

### Return type

[**ListSiteResponse**](ListSiteResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerFindTeam**
> TeamResponse projectsControllerFindTeam(projectId, teamId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID
final String teamId = teamId_example; // String | Team UUID

try {
    final response = api.projectsControllerFindTeam(projectId, teamId);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerFindTeam: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 
 **teamId** | **String**| Team UUID | 

### Return type

[**TeamResponse**](TeamResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerGetLabTest**
> LabTestResponse projectsControllerGetLabTest(projectId, labTestId, sampleId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID
final String labTestId = labTestId_example; // String | LabTest UUID
final String sampleId = sampleId_example; // String | Sample UUID

try {
    final response = api.projectsControllerGetLabTest(projectId, labTestId, sampleId);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerGetLabTest: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 
 **labTestId** | **String**| LabTest UUID | 
 **sampleId** | **String**| Sample UUID | 

### Return type

[**LabTestResponse**](LabTestResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerGetLabTestStats**
> SampleStatLogisticResponse projectsControllerGetLabTestStats(projectId, endDate, startDate, workspaceId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID
final String endDate = 2024-12-31; // String | 
final String startDate = 2024-01-01; // String | 
final String workspaceId = workspaceId_example; // String | 

try {
    final response = api.projectsControllerGetLabTestStats(projectId, endDate, startDate, workspaceId);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerGetLabTestStats: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 
 **endDate** | **String**|  | [optional] 
 **startDate** | **String**|  | [optional] 
 **workspaceId** | **String**|  | [optional] 

### Return type

[**SampleStatLogisticResponse**](SampleStatLogisticResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerGetLabTests**
> ListLabTestResponse projectsControllerGetLabTests(projectId, sampleId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID
final String sampleId = sampleId_example; // String | Sample UUID

try {
    final response = api.projectsControllerGetLabTests(projectId, sampleId);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerGetLabTests: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 
 **sampleId** | **String**| Sample UUID | 

### Return type

[**ListLabTestResponse**](ListLabTestResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerGetMaxRound**
> projectsControllerGetMaxRound(projectId, workspaceId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID
final String workspaceId = workspaceId_example; // String | 

try {
    api.projectsControllerGetMaxRound(projectId, workspaceId);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerGetMaxRound: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 
 **workspaceId** | **String**|  | [optional] 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerGetMembers**
> ProjectCollectorsResponse projectsControllerGetMembers(projectId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID

try {
    final response = api.projectsControllerGetMembers(projectId);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerGetMembers: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 

### Return type

[**ProjectCollectorsResponse**](ProjectCollectorsResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerGetNearbyLocations**
> ListNearbySiteResponse projectsControllerGetNearbyLocations(projectId, lat, lon, radius, assignedTo, farmType, filterBy)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID
final num lat = 8.14; // num | 
final num lon = 8.14; // num | 
final num radius = 1000; // num | Radius in meters to search for nearby sites
final bool assignedTo = true; // bool | 
final BuiltList<String> farmType = ["poultry farm","cattle farm"]; // BuiltList<String> | Filter sites by farm type
final String filterBy = newest; // String | Filter the sites by newest or status

try {
    final response = api.projectsControllerGetNearbyLocations(projectId, lat, lon, radius, assignedTo, farmType, filterBy);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerGetNearbyLocations: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 
 **lat** | **num**|  | 
 **lon** | **num**|  | 
 **radius** | **num**| Radius in meters to search for nearby sites | 
 **assignedTo** | **bool**|  | [optional] 
 **farmType** | [**BuiltList&lt;String&gt;**](String.md)| Filter sites by farm type | [optional] 
 **filterBy** | **String**| Filter the sites by newest or status | [optional] 

### Return type

[**ListNearbySiteResponse**](ListNearbySiteResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerGetPoolableSamples**
> JsonObject projectsControllerGetPoolableSamples(projectId, sampleId)

Get samples that can be pooled with the given sample

### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID
final String sampleId = sampleId_example; // String | Sample UUID

try {
    final response = api.projectsControllerGetPoolableSamples(projectId, sampleId);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerGetPoolableSamples: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 
 **sampleId** | **String**| Sample UUID | 

### Return type

[**JsonObject**](JsonObject.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerGetProjectDetails**
> JsonObject projectsControllerGetProjectDetails(projectDetailsRequestDto, responseType)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final ProjectDetailsRequestDto projectDetailsRequestDto = ; // ProjectDetailsRequestDto | 
final String responseType = responseType_example; // String | 

try {
    final response = api.projectsControllerGetProjectDetails(projectDetailsRequestDto, responseType);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerGetProjectDetails: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectDetailsRequestDto** | [**ProjectDetailsRequestDto**](ProjectDetailsRequestDto.md)|  | 
 **responseType** | **String**|  | [optional] 

### Return type

[**JsonObject**](JsonObject.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerGetProjectTeamActivityProgress**
> TeamActivityProgressResponse projectsControllerGetProjectTeamActivityProgress(projectId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID

try {
    final response = api.projectsControllerGetProjectTeamActivityProgress(projectId);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerGetProjectTeamActivityProgress: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 

### Return type

[**TeamActivityProgressResponse**](TeamActivityProgressResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerGetProjectTeamMemberActivity**
> PaginatedTeamMemberActivityResponse projectsControllerGetProjectTeamMemberActivity(projectId, sortOrder, sort, endDate, startDate, diseaseId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID
final String sortOrder = sortOrder_example; // String | asc or desc
final String sort = sort_example; // String | Sort field
final String endDate = 2024-12-31; // String | 
final String startDate = 2024-01-01; // String | 
final String diseaseId = Disease ID; // String | 

try {
    final response = api.projectsControllerGetProjectTeamMemberActivity(projectId, sortOrder, sort, endDate, startDate, diseaseId);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerGetProjectTeamMemberActivity: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 
 **sortOrder** | **String**| asc or desc | [optional] 
 **sort** | **String**| Sort field | [optional] 
 **endDate** | **String**|  | [optional] 
 **startDate** | **String**|  | [optional] 
 **diseaseId** | **String**|  | [optional] 

### Return type

[**PaginatedTeamMemberActivityResponse**](PaginatedTeamMemberActivityResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerGetProjectTeamMemberActivityExport**
> projectsControllerGetProjectTeamMemberActivityExport(projectId, sortOrder, sort, endDate, startDate, diseaseId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID
final String sortOrder = sortOrder_example; // String | asc or desc
final String sort = sort_example; // String | Sort field
final String endDate = 2024-12-31; // String | 
final String startDate = 2024-01-01; // String | 
final String diseaseId = Disease ID; // String | 

try {
    api.projectsControllerGetProjectTeamMemberActivityExport(projectId, sortOrder, sort, endDate, startDate, diseaseId);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerGetProjectTeamMemberActivityExport: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 
 **sortOrder** | **String**| asc or desc | [optional] 
 **sort** | **String**| Sort field | [optional] 
 **endDate** | **String**|  | [optional] 
 **startDate** | **String**|  | [optional] 
 **diseaseId** | **String**|  | [optional] 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerGetProjectTeamMemberProgress**
> PaginatedTeamMemberProgressResponse projectsControllerGetProjectTeamMemberProgress(projectId, sortOrder, sort, endDate, startDate, diseaseId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID
final String sortOrder = sortOrder_example; // String | asc or desc
final String sort = sort_example; // String | Sort field
final String endDate = 2024-12-31; // String | 
final String startDate = 2024-01-01; // String | 
final String diseaseId = Disease ID; // String | 

try {
    final response = api.projectsControllerGetProjectTeamMemberProgress(projectId, sortOrder, sort, endDate, startDate, diseaseId);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerGetProjectTeamMemberProgress: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 
 **sortOrder** | **String**| asc or desc | [optional] 
 **sort** | **String**| Sort field | [optional] 
 **endDate** | **String**|  | [optional] 
 **startDate** | **String**|  | [optional] 
 **diseaseId** | **String**|  | [optional] 

### Return type

[**PaginatedTeamMemberProgressResponse**](PaginatedTeamMemberProgressResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerGetProjectTeamMemberProgressExport**
> projectsControllerGetProjectTeamMemberProgressExport(projectId, endDate, startDate, diseaseId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID
final String endDate = 2024-12-31; // String | 
final String startDate = 2024-01-01; // String | 
final String diseaseId = Disease ID; // String | 

try {
    api.projectsControllerGetProjectTeamMemberProgressExport(projectId, endDate, startDate, diseaseId);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerGetProjectTeamMemberProgressExport: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 
 **endDate** | **String**|  | [optional] 
 **startDate** | **String**|  | [optional] 
 **diseaseId** | **String**|  | [optional] 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerGetProjectTeamProgress**
> PaginatedTeamProgressResponse projectsControllerGetProjectTeamProgress(projectId, sortOrder, sort)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID
final String sortOrder = sortOrder_example; // String | asc or desc
final String sort = sort_example; // String | Sort field

try {
    final response = api.projectsControllerGetProjectTeamProgress(projectId, sortOrder, sort);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerGetProjectTeamProgress: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 
 **sortOrder** | **String**| asc or desc | [optional] 
 **sort** | **String**| Sort field | [optional] 

### Return type

[**PaginatedTeamProgressResponse**](PaginatedTeamProgressResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerGetProjectTeamUserRoles**
> JsonObject projectsControllerGetProjectTeamUserRoles()



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();

try {
    final response = api.projectsControllerGetProjectTeamUserRoles();
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerGetProjectTeamUserRoles: $e\n');
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

# **projectsControllerGetProjectTeamUsers**
> JsonObject projectsControllerGetProjectTeamUsers(projectId, workspaceId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | 
final String workspaceId = workspaceId_example; // String | 

try {
    final response = api.projectsControllerGetProjectTeamUsers(projectId, workspaceId);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerGetProjectTeamUsers: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**|  | 
 **workspaceId** | **String**|  | 

### Return type

[**JsonObject**](JsonObject.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerGetSitesStatisticsByStatus**
> ProjectStatisticBySiteResponse projectsControllerGetSitesStatisticsByStatus(projectId, disease, startDate, endDate)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID
final String disease = disease_example; // String | 
final String startDate = startDate_example; // String | 
final String endDate = endDate_example; // String | 

try {
    final response = api.projectsControllerGetSitesStatisticsByStatus(projectId, disease, startDate, endDate);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerGetSitesStatisticsByStatus: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 
 **disease** | **String**|  | 
 **startDate** | **String**|  | 
 **endDate** | **String**|  | 

### Return type

[**ProjectStatisticBySiteResponse**](ProjectStatisticBySiteResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerGetTeamActivityOverview**
> TeamProgressActivityOverviewResponse projectsControllerGetTeamActivityOverview(projectId, teamId, endDate, startDate)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID
final String teamId = teamId_example; // String | Team UUID
final String endDate = 2024-12-31; // String | 
final String startDate = 2024-01-01; // String | 

try {
    final response = api.projectsControllerGetTeamActivityOverview(projectId, teamId, endDate, startDate);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerGetTeamActivityOverview: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 
 **teamId** | **String**| Team UUID | 
 **endDate** | **String**|  | [optional] 
 **startDate** | **String**|  | [optional] 

### Return type

[**TeamProgressActivityOverviewResponse**](TeamProgressActivityOverviewResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerGetTeamMembers**
> ListTeamMemberResponse projectsControllerGetTeamMembers(teamId, projectId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String teamId = teamId_example; // String | Team UUID
final String projectId = projectId_example; // String | Project UUID

try {
    final response = api.projectsControllerGetTeamMembers(teamId, projectId);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerGetTeamMembers: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **teamId** | **String**| Team UUID | 
 **projectId** | **String**| Project UUID | 

### Return type

[**ListTeamMemberResponse**](ListTeamMemberResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerGetTeamMembersFieldView**
> PaginatedTeamMemberResponse projectsControllerGetTeamMembersFieldView(projectId, teamId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID
final String teamId = teamId_example; // String | Team UUID

try {
    final response = api.projectsControllerGetTeamMembersFieldView(projectId, teamId);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerGetTeamMembersFieldView: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 
 **teamId** | **String**| Team UUID | 

### Return type

[**PaginatedTeamMemberResponse**](PaginatedTeamMemberResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerGetTeamMembersVisitActivity**
> TeamMemberActivityResponse projectsControllerGetTeamMembersVisitActivity(projectId, teamId, endDate, startDate)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | project UUID
final String teamId = teamId_example; // String | Team UUID
final String endDate = 2024-12-31; // String | 
final String startDate = 2024-01-01; // String | 

try {
    final response = api.projectsControllerGetTeamMembersVisitActivity(projectId, teamId, endDate, startDate);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerGetTeamMembersVisitActivity: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| project UUID | 
 **teamId** | **String**| Team UUID | 
 **endDate** | **String**|  | [optional] 
 **startDate** | **String**|  | [optional] 

### Return type

[**TeamMemberActivityResponse**](TeamMemberActivityResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerGetTeamRoles**
> ListAvailableRoleResponse projectsControllerGetTeamRoles(projectId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID

try {
    final response = api.projectsControllerGetTeamRoles(projectId);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerGetTeamRoles: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 

### Return type

[**ListAvailableRoleResponse**](ListAvailableRoleResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerGetVisitSummary**
> VisitSummaryResponse projectsControllerGetVisitSummary(projectId, endDate, startDate)

Visit Summary for Site

### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID
final String endDate = 2025-03-21T00:00:00Z; // String | 
final String startDate = 2025-03-01T00:00:00Z; // String | 

try {
    final response = api.projectsControllerGetVisitSummary(projectId, endDate, startDate);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerGetVisitSummary: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 
 **endDate** | **String**|  | [optional] 
 **startDate** | **String**|  | [optional] 

### Return type

[**VisitSummaryResponse**](VisitSummaryResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerGetVisits**
> PaginatedVisitResponse projectsControllerGetVisits(projectId, limit, page, visitStatus, assignedTo, isCompleted, endDate, startDate, siteType, disease, siteId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID
final num limit = 10; // num | 
final num page = 1; // num | 
final String visitStatus = visitStatus_example; // String | 
final bool assignedTo = true; // bool | 
final bool isCompleted = true; // bool | 
final String endDate = 2024-12-31; // String | 
final String startDate = 2024-01-01; // String | 
final String siteType = siteType_example; // String | 
final String disease = disease_example; // String | 
final String siteId = siteId_example; // String | 

try {
    final response = api.projectsControllerGetVisits(projectId, limit, page, visitStatus, assignedTo, isCompleted, endDate, startDate, siteType, disease, siteId);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerGetVisits: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 
 **limit** | **num**|  | [optional] 
 **page** | **num**|  | [optional] 
 **visitStatus** | **String**|  | [optional] 
 **assignedTo** | **bool**|  | [optional] 
 **isCompleted** | **bool**|  | [optional] 
 **endDate** | **String**|  | [optional] 
 **startDate** | **String**|  | [optional] 
 **siteType** | **String**|  | [optional] 
 **disease** | **String**|  | [optional] 
 **siteId** | **String**|  | [optional] 

### Return type

[**PaginatedVisitResponse**](PaginatedVisitResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerRemoveMember**
> projectsControllerRemoveMember(memberId, teamId, projectId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String memberId = memberId_example; // String | User UUID
final String teamId = teamId_example; // String | Team UUID
final String projectId = projectId_example; // String | Project UUID

try {
    api.projectsControllerRemoveMember(memberId, teamId, projectId);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerRemoveMember: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **memberId** | **String**| User UUID | 
 **teamId** | **String**| Team UUID | 
 **projectId** | **String**| Project UUID | 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerRemoveMembersList**
> RemovedTeamMemberResponse projectsControllerRemoveMembersList(projectId, teamMemberRemoveDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID
final TeamMemberRemoveDto teamMemberRemoveDto = ; // TeamMemberRemoveDto | 

try {
    final response = api.projectsControllerRemoveMembersList(projectId, teamMemberRemoveDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerRemoveMembersList: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 
 **teamMemberRemoveDto** | [**TeamMemberRemoveDto**](TeamMemberRemoveDto.md)|  | 

### Return type

[**RemovedTeamMemberResponse**](RemovedTeamMemberResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerRescheduleVisit**
> VisitResponse projectsControllerRescheduleVisit(projectId, visitId, rescheduleVisitDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID
final String visitId = visitId_example; // String | Visit UUID
final RescheduleVisitDto rescheduleVisitDto = ; // RescheduleVisitDto | 

try {
    final response = api.projectsControllerRescheduleVisit(projectId, visitId, rescheduleVisitDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerRescheduleVisit: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 
 **visitId** | **String**| Visit UUID | 
 **rescheduleVisitDto** | [**RescheduleVisitDto**](RescheduleVisitDto.md)|  | 

### Return type

[**VisitResponse**](VisitResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerStatistics**
> ProjectStatisticsResponse projectsControllerStatistics(workspaceId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String workspaceId = workspace UUID; // String | 

try {
    final response = api.projectsControllerStatistics(workspaceId);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerStatistics: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **workspaceId** | **String**|  | [optional] 

### Return type

[**ProjectStatisticsResponse**](ProjectStatisticsResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerSubmitVisit**
> SubmitVisitResponse projectsControllerSubmitVisit(projectId, visitId, submitVisitDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID
final String visitId = visitId_example; // String | Visit UUID
final SubmitVisitDto submitVisitDto = ; // SubmitVisitDto | 

try {
    final response = api.projectsControllerSubmitVisit(projectId, visitId, submitVisitDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerSubmitVisit: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 
 **visitId** | **String**| Visit UUID | 
 **submitVisitDto** | [**SubmitVisitDto**](SubmitVisitDto.md)|  | 

### Return type

[**SubmitVisitResponse**](SubmitVisitResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerUpdate**
> ProjectResponse projectsControllerUpdate(projectId, updateProjectDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID
final UpdateProjectDto updateProjectDto = ; // UpdateProjectDto | 

try {
    final response = api.projectsControllerUpdate(projectId, updateProjectDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerUpdate: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 
 **updateProjectDto** | [**UpdateProjectDto**](UpdateProjectDto.md)|  | 

### Return type

[**ProjectResponse**](ProjectResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerUpdateLabTest**
> ListLabTestResponse projectsControllerUpdateLabTest(sampleId, labTestId, projectId, updateMultipleLabTestDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String sampleId = sampleId_example; // String | Sample UUID
final String labTestId = labTestId_example; // String | LabTest UUID
final String projectId = projectId_example; // String | Project UUID
final UpdateMultipleLabTestDto updateMultipleLabTestDto = ; // UpdateMultipleLabTestDto | 

try {
    final response = api.projectsControllerUpdateLabTest(sampleId, labTestId, projectId, updateMultipleLabTestDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerUpdateLabTest: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **sampleId** | **String**| Sample UUID | 
 **labTestId** | **String**| LabTest UUID | 
 **projectId** | **String**| Project UUID | 
 **updateMultipleLabTestDto** | [**UpdateMultipleLabTestDto**](UpdateMultipleLabTestDto.md)|  | 

### Return type

[**ListLabTestResponse**](ListLabTestResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerUpdateMember**
> TeamMemberResponse projectsControllerUpdateMember(memberId, teamId, projectId, updateMemberDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String memberId = memberId_example; // String | User UUID
final String teamId = teamId_example; // String | Team UUID
final String projectId = projectId_example; // String | Project UUID
final UpdateMemberDto updateMemberDto = ; // UpdateMemberDto | 

try {
    final response = api.projectsControllerUpdateMember(memberId, teamId, projectId, updateMemberDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerUpdateMember: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **memberId** | **String**| User UUID | 
 **teamId** | **String**| Team UUID | 
 **projectId** | **String**| Project UUID | 
 **updateMemberDto** | [**UpdateMemberDto**](UpdateMemberDto.md)|  | 

### Return type

[**TeamMemberResponse**](TeamMemberResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerUpdateProjectTeamUserRole**
> JsonObject projectsControllerUpdateProjectTeamUserRole(memberId)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String memberId = memberId_example; // String | 

try {
    final response = api.projectsControllerUpdateProjectTeamUserRole(memberId);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerUpdateProjectTeamUserRole: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **memberId** | **String**|  | 

### Return type

[**JsonObject**](JsonObject.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerUpdateSample**
> SampleResponse projectsControllerUpdateSample(projectId, sampleId, updateSampleDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID
final String sampleId = sampleId_example; // String | Sample UUID
final UpdateSampleDto updateSampleDto = ; // UpdateSampleDto | 

try {
    final response = api.projectsControllerUpdateSample(projectId, sampleId, updateSampleDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerUpdateSample: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 
 **sampleId** | **String**| Sample UUID | 
 **updateSampleDto** | [**UpdateSampleDto**](UpdateSampleDto.md)|  | 

### Return type

[**SampleResponse**](SampleResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerUpdateSite**
> SiteResponse projectsControllerUpdateSite(projectId, siteId, updateSiteDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID
final String siteId = siteId_example; // String | Site UUID
final UpdateSiteDto updateSiteDto = ; // UpdateSiteDto | 

try {
    final response = api.projectsControllerUpdateSite(projectId, siteId, updateSiteDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerUpdateSite: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 
 **siteId** | **String**| Site UUID | 
 **updateSiteDto** | [**UpdateSiteDto**](UpdateSiteDto.md)|  | 

### Return type

[**SiteResponse**](SiteResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerUpdateTeam**
> TeamResponse projectsControllerUpdateTeam(projectId, teamId, updateTeamDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID
final String teamId = teamId_example; // String | Team UUID
final UpdateTeamDto updateTeamDto = ; // UpdateTeamDto | 

try {
    final response = api.projectsControllerUpdateTeam(projectId, teamId, updateTeamDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerUpdateTeam: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 
 **teamId** | **String**| Team UUID | 
 **updateTeamDto** | [**UpdateTeamDto**](UpdateTeamDto.md)|  | 

### Return type

[**TeamResponse**](TeamResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerUpdateVisit**
> VisitResponse projectsControllerUpdateVisit(projectId, visitId, updateVisitDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID
final String visitId = visitId_example; // String | Visit UUID
final UpdateVisitDto updateVisitDto = ; // UpdateVisitDto | 

try {
    final response = api.projectsControllerUpdateVisit(projectId, visitId, updateVisitDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerUpdateVisit: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 
 **visitId** | **String**| Visit UUID | 
 **updateVisitDto** | [**UpdateVisitDto**](UpdateVisitDto.md)|  | 

### Return type

[**VisitResponse**](VisitResponse.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerUploadSampleDataScript**
> SampleScriptResponseData projectsControllerUploadSampleDataScript(structuredSiteDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final StructuredSiteDto structuredSiteDto = ; // StructuredSiteDto | 

try {
    final response = api.projectsControllerUploadSampleDataScript(structuredSiteDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerUploadSampleDataScript: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **structuredSiteDto** | [**StructuredSiteDto**](StructuredSiteDto.md)|  | 

### Return type

[**SampleScriptResponseData**](SampleScriptResponseData.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **projectsControllerValidateBarcode**
> ValidateBarcodeMessage projectsControllerValidateBarcode(projectId, barcode)

Validate Barcode

### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getProjectsApi();
final String projectId = projectId_example; // String | Project UUID
final String barcode = barcode_example; // String | 

try {
    final response = api.projectsControllerValidateBarcode(projectId, barcode);
    print(response);
} on DioException catch (e) {
    print('Exception when calling ProjectsApi->projectsControllerValidateBarcode: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | **String**| Project UUID | 
 **barcode** | **String**|  | 

### Return type

[**ValidateBarcodeMessage**](ValidateBarcodeMessage.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

