// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'serializers.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

Serializers _$serializers = (Serializers().toBuilder()
      ..add(AnimalMetadataData.serializer)
      ..add(AnimalMetadataSpecies.serializer)
      ..add(ConvertExcelResponse.serializer)
      ..add(CreateDiseaseDto.serializer)
      ..add(CreateKitDto.serializer)
      ..add(CreateKitDtoStatusEnum.serializer)
      ..add(CreateLabTestDto.serializer)
      ..add(CreateLocationDto.serializer)
      ..add(CreateMemberDto.serializer)
      ..add(CreateMembersListDto.serializer)
      ..add(CreateMultipleLabTestDto.serializer)
      ..add(CreatePayloadDto.serializer)
      ..add(CreateProjectDto.serializer)
      ..add(CreateRegionDto.serializer)
      ..add(CreateRegionDtoRegionTypeEnum.serializer)
      ..add(CreateRoleDto.serializer)
      ..add(CreateSampleDto.serializer)
      ..add(CreateSampleDtoReplicatesEnum.serializer)
      ..add(CreateSampleDtoSampleStatusEnum.serializer)
      ..add(CreateSampleOnVisitDto.serializer)
      ..add(CreateSampleOnVisitDtoReplicatesEnum.serializer)
      ..add(CreateSampleOnVisitDtoSampleStatusEnum.serializer)
      ..add(CreateSampleTypeDto.serializer)
      ..add(CreateSampleTypeDtoStatusEnum.serializer)
      ..add(CreateSiteDto.serializer)
      ..add(CreateSpeciesDto.serializer)
      ..add(CreateSuperAdminDto.serializer)
      ..add(CreateSurveillanceTypeDto.serializer)
      ..add(CreateTeamDto.serializer)
      ..add(CreateUserDto.serializer)
      ..add(CreateVisitDto.serializer)
      ..add(CreateWorkspaceDto.serializer)
      ..add(CreateWorkspaceInviteDto.serializer)
      ..add(CreateWorkspaceMemberDto.serializer)
      ..add(CreateWorkspaceProjectDto.serializer)
      ..add(DayOfWeek.serializer)
      ..add(Disease.serializer)
      ..add(DiseaseFreeSite.serializer)
      ..add(DiseaseResponse.serializer)
      ..add(DiseaseResponseData.serializer)
      ..add(DiseaseResponseDataStatusEnum.serializer)
      ..add(DiseaseResponseDto.serializer)
      ..add(DiseaseSampleStatsResponseData.serializer)
      ..add(DiseaseSampleStatsType.serializer)
      ..add(DiseaseSearchResponseData.serializer)
      ..add(DiseaseSiteStat.serializer)
      ..add(DiseaseStatistics.serializer)
      ..add(DiseaseStatsResponse.serializer)
      ..add(DiseaseStatsResponseData.serializer)
      ..add(DiseaseStatusEnum.serializer)
      ..add(EmailLoginDto.serializer)
      ..add(ExploreSiteData.serializer)
      ..add(ExploreSitesResponse.serializer)
      ..add(FetchAllInviteResponse.serializer)
      ..add(FetchAllLabTestResponse.serializer)
      ..add(FetchAllUserResponse.serializer)
      ..add(FileUploadResult.serializer)
      ..add(GetSiteOnDiseaseResponse.serializer)
      ..add(GetSiteOnDiseaseResponseData.serializer)
      ..add(GetSiteOnDiseaseSiteStatData.serializer)
      ..add(GetSiteOnDiseaseVisitStatData.serializer)
      ..add(GetSiteOnSampleVisitStatData.serializer)
      ..add(Invite.serializer)
      ..add(InvitePartnerDto.serializer)
      ..add(InviteResponse.serializer)
      ..add(KitResponse.serializer)
      ..add(KitResponseData.serializer)
      ..add(KitResponseDataStatusEnum.serializer)
      ..add(LabTestDetailsDto.serializer)
      ..add(LabTestDto.serializer)
      ..add(LabTestResponse.serializer)
      ..add(LabTestResponseData.serializer)
      ..add(LabTestResponseDto.serializer)
      ..add(ListAnimalMetadataResponse.serializer)
      ..add(ListAvailableRoleResponse.serializer)
      ..add(ListDiseaseResponse.serializer)
      ..add(ListKitResponse.serializer)
      ..add(ListLabTestResponse.serializer)
      ..add(ListLocationResponse.serializer)
      ..add(ListNearbySiteResponse.serializer)
      ..add(ListRegionResponse.serializer)
      ..add(ListRoleResponse.serializer)
      ..add(ListSampleTypeResponse.serializer)
      ..add(ListSiteResponse.serializer)
      ..add(ListSpeciesResponse.serializer)
      ..add(ListSurveillanceTypeResponse.serializer)
      ..add(ListTeamMemberResponse.serializer)
      ..add(ListTeamResponse.serializer)
      ..add(Location.serializer)
      ..add(LocationCoordinates.serializer)
      ..add(LocationResponse.serializer)
      ..add(LocationResponseData.serializer)
      ..add(LoginResponse.serializer)
      ..add(LookupUserMatch.serializer)
      ..add(LookupUserResponse.serializer)
      ..add(LookupUserResult.serializer)
      ..add(MemberDto.serializer)
      ..add(MembersActivityDataType.serializer)
      ..add(MonitorDashboardDiseasePositive.serializer)
      ..add(MonitorDashboardResponse.serializer)
      ..add(MonitorDashboardResponseData.serializer)
      ..add(MonitorDashboardSummary.serializer)
      ..add(MonitorDashboardTrendPoint.serializer)
      ..add(MostPositiveSiteResponse.serializer)
      ..add(MostPositiveSiteResponseData.serializer)
      ..add(NearbySiteResponseData.serializer)
      ..add(PaginatedProjectDiseaseStatsResponse.serializer)
      ..add(PaginatedProjectResponse.serializer)
      ..add(PaginatedSampleResponse.serializer)
      ..add(PaginatedTeamMemberActivityResponse.serializer)
      ..add(PaginatedTeamMemberProgressResponse.serializer)
      ..add(PaginatedTeamMemberResponse.serializer)
      ..add(PaginatedTeamProgressResponse.serializer)
      ..add(PaginatedVisitResponse.serializer)
      ..add(Permission.serializer)
      ..add(PhoneLoginDto.serializer)
      ..add(PresignUploadDto.serializer)
      ..add(Project.serializer)
      ..add(ProjectCollectorsResponse.serializer)
      ..add(ProjectDetailsRequestDto.serializer)
      ..add(ProjectDiseaseStatsResponseData.serializer)
      ..add(ProjectLocationStateResponse.serializer)
      ..add(ProjectLocationStateType.serializer)
      ..add(ProjectResponse.serializer)
      ..add(ProjectResponseData.serializer)
      ..add(ProjectResponseDataExtended.serializer)
      ..add(ProjectResponseParentRegion.serializer)
      ..add(ProjectResponseParentRegionRegionTypeEnum.serializer)
      ..add(ProjectResponseRegion.serializer)
      ..add(ProjectResponseRegionRegionTypeEnum.serializer)
      ..add(ProjectSearchResponseData.serializer)
      ..add(ProjectStatisticByDiseaseResponse.serializer)
      ..add(ProjectStatisticByDiseasesResponseData.serializer)
      ..add(ProjectStatisticBySiteResponse.serializer)
      ..add(ProjectStatistics.serializer)
      ..add(ProjectStatisticsBySiteResponseData.serializer)
      ..add(ProjectStatisticsResponse.serializer)
      ..add(Region.serializer)
      ..add(RegionRegionTypeEnum.serializer)
      ..add(RegionResponse.serializer)
      ..add(RegionResponseData.serializer)
      ..add(RegionResponseDataRegionTypeEnum.serializer)
      ..add(RemovedTeamMemberResponse.serializer)
      ..add(ReplicateAvailability.serializer)
      ..add(RescheduleVisitDto.serializer)
      ..add(RoleResponse.serializer)
      ..add(RoleResponseData.serializer)
      ..add(RoleResponseDataStatusEnum.serializer)
      ..add(RoleResponseStatusEnum.serializer)
      ..add(Sample.serializer)
      ..add(SampleBreakDownResponse.serializer)
      ..add(SampleBreakDownResponseData.serializer)
      ..add(SampleDto.serializer)
      ..add(SampleExposesDto.serializer)
      ..add(SampleResponse.serializer)
      ..add(SampleResponseData.serializer)
      ..add(SampleScriptResponseData.serializer)
      ..add(SampleStatLogisticResponse.serializer)
      ..add(SampleStatLogisticResponseData.serializer)
      ..add(SampleStatus.serializer)
      ..add(SampleType.serializer)
      ..add(SampleTypeResponse.serializer)
      ..add(SampleTypeResponseData.serializer)
      ..add(SampleTypeResponseDataStatusEnum.serializer)
      ..add(SampleTypeStatusEnum.serializer)
      ..add(SearchResponse.serializer)
      ..add(SearchResponseData.serializer)
      ..add(SignupDto.serializer)
      ..add(SiteResponse.serializer)
      ..add(SiteResponseData.serializer)
      ..add(SiteResponseParentRegion.serializer)
      ..add(SiteResponseParentRegionRegionTypeEnum.serializer)
      ..add(SiteResponseRegion.serializer)
      ..add(SiteResponseRegionRegionTypeEnum.serializer)
      ..add(SiteSearchResponseData.serializer)
      ..add(SiteStatType.serializer)
      ..add(SiteType.serializer)
      ..add(SmsOtpDto.serializer)
      ..add(SpeciesResponse.serializer)
      ..add(SpeciesResponseData.serializer)
      ..add(StructuredSiteDto.serializer)
      ..add(SubmitSequencingJobDto.serializer)
      ..add(SubmitSequencingJobDtoFileFormatEnum.serializer)
      ..add(SubmitSequencingJobDtoLibraryTypeEnum.serializer)
      ..add(SubmitSequencingJobDtoSourceTypeEnum.serializer)
      ..add(SubmitVisitDto.serializer)
      ..add(SubmitVisitResponse.serializer)
      ..add(SurveillanceType.serializer)
      ..add(SurveillanceTypeResponse.serializer)
      ..add(SurveillanceTypeResponseData.serializer)
      ..add(SurveillanceTypeResponseDataStatusEnum.serializer)
      ..add(SurveillanceTypeStatusEnum.serializer)
      ..add(SuspectedPositivesData.serializer)
      ..add(Team.serializer)
      ..add(TeamActivityProgressResponse.serializer)
      ..add(TeamActivityProgressResponseData.serializer)
      ..add(TeamMemberActivityResponse.serializer)
      ..add(TeamMemberActivityResponseData.serializer)
      ..add(TeamMemberListResponse.serializer)
      ..add(TeamMemberProgressResponseData.serializer)
      ..add(TeamMemberRemoveDto.serializer)
      ..add(TeamMemberResponse.serializer)
      ..add(TeamMemberResponseData.serializer)
      ..add(TeamMembersCollectorListType.serializer)
      ..add(TeamProgressActivityOverviewResponse.serializer)
      ..add(TeamProgressActivityOverviewResponseData.serializer)
      ..add(TeamProgressResponseData.serializer)
      ..add(TeamProgressResponseDataCollectionCollector.serializer)
      ..add(TeamResponse.serializer)
      ..add(TeamResponseData.serializer)
      ..add(TestResultType.serializer)
      ..add(UnifiedLoginDto.serializer)
      ..add(UpdateAccessDto.serializer)
      ..add(UpdateCollectedSampleDetailsDto.serializer)
      ..add(UpdateDiseaseDto.serializer)
      ..add(UpdateKitDto.serializer)
      ..add(UpdateKitDtoStatusEnum.serializer)
      ..add(UpdateLabTestDto.serializer)
      ..add(UpdateLocationDto.serializer)
      ..add(UpdateMemberDto.serializer)
      ..add(UpdateMultipleLabTestDto.serializer)
      ..add(UpdateOwnProfileDto.serializer)
      ..add(UpdateProjectDto.serializer)
      ..add(UpdateRegionDto.serializer)
      ..add(UpdateRegionDtoRegionTypeEnum.serializer)
      ..add(UpdateRegionDtoStatusEnum.serializer)
      ..add(UpdateRoleDto.serializer)
      ..add(UpdateSampleDto.serializer)
      ..add(UpdateSampleDtoReplicatesEnum.serializer)
      ..add(UpdateSampleDtoSampleStatusEnum.serializer)
      ..add(UpdateSampleStageDetailsDto.serializer)
      ..add(UpdateSampleTypeDto.serializer)
      ..add(UpdateSampleTypeDtoStatusEnum.serializer)
      ..add(UpdateSiteDto.serializer)
      ..add(UpdateSpeciesDto.serializer)
      ..add(UpdateSurveillanceTypeDto.serializer)
      ..add(UpdateTeamDto.serializer)
      ..add(UpdateUserDto.serializer)
      ..add(UpdateVisitDto.serializer)
      ..add(UpdateVisitOnSubmitDto.serializer)
      ..add(UpdateWorkspaceDto.serializer)
      ..add(UpdateWorkspaceMemberDto.serializer)
      ..add(UploadMultipleFilesResponse.serializer)
      ..add(User.serializer)
      ..add(UserProfileResponse.serializer)
      ..add(UserProfileResponseData.serializer)
      ..add(UserProfileResponseDataRole.serializer)
      ..add(UserProfileResponseDataRoleStatusEnum.serializer)
      ..add(UserProfileResponseDataUserRole.serializer)
      ..add(UserProfileResponseDataUserRoleStatusEnum.serializer)
      ..add(UserResponse.serializer)
      ..add(UserResponseDto.serializer)
      ..add(UserResponseType.serializer)
      ..add(UserRole.serializer)
      ..add(UserRoleStatusEnum.serializer)
      ..add(UserSummaryResponse.serializer)
      ..add(UserWithTeamResponse.serializer)
      ..add(ValidateBarcodeMessage.serializer)
      ..add(VerifyOtpDto.serializer)
      ..add(VerifyOtpResponse.serializer)
      ..add(VerifyOtpResponseData.serializer)
      ..add(VerifySignupDto.serializer)
      ..add(Visit.serializer)
      ..add(VisitDataForEveryMemberType.serializer)
      ..add(VisitDataForEveryMemberTypeVisitStatusEnum.serializer)
      ..add(VisitDto.serializer)
      ..add(VisitResponse.serializer)
      ..add(VisitResponseData.serializer)
      ..add(VisitSampleData.serializer)
      ..add(VisitSiteData.serializer)
      ..add(VisitSiteLocationData.serializer)
      ..add(VisitStatus.serializer)
      ..add(VisitSummaryResponse.serializer)
      ..add(VisitSummaryResponseData.serializer)
      ..add(Workspace.serializer)
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(AnimalMetadataData)]),
          () => ListBuilder<AnimalMetadataData>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(CreateLabTestDto)]),
          () => ListBuilder<CreateLabTestDto>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(CreatePayloadDto)]),
          () => ListBuilder<CreatePayloadDto>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(VisitDto)]),
          () => ListBuilder<VisitDto>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(SampleDto)]),
          () => ListBuilder<SampleDto>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(LabTestDto)]),
          () => ListBuilder<LabTestDto>())
      ..addBuilderFactory(
          const FullType(
              BuiltList, const [const FullType(CreateSampleOnVisitDto)]),
          () => ListBuilder<CreateSampleOnVisitDto>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(DayOfWeek)]),
          () => ListBuilder<DayOfWeek>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(Disease)]),
          () => ListBuilder<Disease>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(DayOfWeek)]),
          () => ListBuilder<DayOfWeek>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(Disease)]),
          () => ListBuilder<Disease>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(DayOfWeek)]),
          () => ListBuilder<DayOfWeek>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(DayOfWeek)]),
          () => ListBuilder<DayOfWeek>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(DayOfWeek)]),
          () => ListBuilder<DayOfWeek>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(Disease)]),
          () => ListBuilder<Disease>())
      ..addBuilderFactory(
          const FullType(
              BuiltList, const [const FullType(LabTestResponseData)]),
          () => ListBuilder<LabTestResponseData>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(
              BuiltList, const [const FullType(DiseaseResponseData)]),
          () => ListBuilder<DiseaseResponseData>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(DiseaseSiteStat)]),
          () => ListBuilder<DiseaseSiteStat>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(DiseaseFreeSite)]),
          () => ListBuilder<DiseaseFreeSite>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(DiseaseStatistics)]),
          () => ListBuilder<DiseaseStatistics>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(FileUploadResult)]),
          () => ListBuilder<FileUploadResult>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(Invite)]),
          () => ListBuilder<Invite>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(JsonObject)]),
          () => ListBuilder<JsonObject>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(JsonObject)]),
          () => ListBuilder<JsonObject>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(JsonObject)]),
          () => ListBuilder<JsonObject>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(JsonObject)]),
          () => ListBuilder<JsonObject>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(KitResponseData)]),
          () => ListBuilder<KitResponseData>())
      ..addBuilderFactory(
          const FullType(
              BuiltList, const [const FullType(LabTestResponseData)]),
          () => ListBuilder<LabTestResponseData>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(LabTestResponseDto)]),
          () => ListBuilder<LabTestResponseDto>())
      ..addBuilderFactory(
          const FullType(
              BuiltList, const [const FullType(LocationResponseData)]),
          () => ListBuilder<LocationResponseData>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(MemberDto)]),
          () => ListBuilder<MemberDto>())
      ..addBuilderFactory(
          const FullType(
              BuiltList, const [const FullType(MembersActivityDataType)]),
          () => ListBuilder<MembersActivityDataType>())
      ..addBuilderFactory(
          const FullType(
              BuiltList, const [const FullType(MonitorDashboardTrendPoint)]),
          () => ListBuilder<MonitorDashboardTrendPoint>())
      ..addBuilderFactory(
          const FullType(BuiltList,
              const [const FullType(MonitorDashboardDiseasePositive)]),
          () => ListBuilder<MonitorDashboardDiseasePositive>())
      ..addBuilderFactory(
          const FullType(
              BuiltList, const [const FullType(NearbySiteResponseData)]),
          () => ListBuilder<NearbySiteResponseData>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(Permission)]),
          () => ListBuilder<Permission>())
      ..addBuilderFactory(
          const FullType(BuiltList,
              const [const FullType(ProjectDiseaseStatsResponseData)]),
          () => ListBuilder<ProjectDiseaseStatsResponseData>())
      ..addBuilderFactory(
          const FullType(
              BuiltList, const [const FullType(ProjectLocationStateType)]),
          () => ListBuilder<ProjectLocationStateType>())
      ..addBuilderFactory(
          const FullType(
              BuiltList, const [const FullType(ProjectResponseDataExtended)]),
          () => ListBuilder<ProjectResponseDataExtended>())
      ..addBuilderFactory(
          const FullType(
              BuiltList, const [const FullType(ProjectSearchResponseData)]),
          () => ListBuilder<ProjectSearchResponseData>())
      ..addBuilderFactory(
          const FullType(
              BuiltList, const [const FullType(SiteSearchResponseData)]),
          () => ListBuilder<SiteSearchResponseData>())
      ..addBuilderFactory(
          const FullType(
              BuiltList, const [const FullType(DiseaseSearchResponseData)]),
          () => ListBuilder<DiseaseSearchResponseData>())
      ..addBuilderFactory(
          const FullType(BuiltList,
              const [const FullType(ProjectStatisticByDiseasesResponseData)]),
          () => ListBuilder<ProjectStatisticByDiseasesResponseData>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(Region)]),
          () => ListBuilder<Region>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(RegionResponseData)]),
          () => ListBuilder<RegionResponseData>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(RoleResponse)]),
          () => ListBuilder<RoleResponse>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(RoleResponseData)]),
          () => ListBuilder<RoleResponseData>())
      ..addBuilderFactory(
          const FullType(
              BuiltList, const [const FullType(SampleBreakDownResponseData)]),
          () => ListBuilder<SampleBreakDownResponseData>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(SampleDto)]),
          () => ListBuilder<SampleDto>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(SampleResponseData)]),
          () => ListBuilder<SampleResponseData>())
      ..addBuilderFactory(
          const FullType(BuiltList,
              const [const FullType(SampleStatLogisticResponseData)]),
          () => ListBuilder<SampleStatLogisticResponseData>())
      ..addBuilderFactory(
          const FullType(
              BuiltList, const [const FullType(SampleTypeResponseData)]),
          () => ListBuilder<SampleTypeResponseData>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(SiteResponseData)]),
          () => ListBuilder<SiteResponseData>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(SiteStatType)]),
          () => ListBuilder<SiteStatType>())
      ..addBuilderFactory(
          const FullType(
              BuiltList, const [const FullType(SpeciesResponseData)]),
          () => ListBuilder<SpeciesResponseData>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(JsonObject)]),
          () => ListBuilder<JsonObject>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(JsonObject)]),
          () => ListBuilder<JsonObject>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(JsonObject)]),
          () => ListBuilder<JsonObject>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(JsonObject)]),
          () => ListBuilder<JsonObject>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(JsonObject)]),
          () => ListBuilder<JsonObject>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(JsonObject)]),
          () => ListBuilder<JsonObject>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(JsonObject)]),
          () => ListBuilder<JsonObject>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(LabTestDto)]),
          () => ListBuilder<LabTestDto>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(JsonObject)]),
          () => ListBuilder<JsonObject>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(JsonObject)]),
          () => ListBuilder<JsonObject>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(String)]),
          () => ListBuilder<String>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(JsonObject)]),
          () => ListBuilder<JsonObject>())
      ..addBuilderFactory(
          const FullType(
              BuiltList, const [const FullType(SurveillanceTypeResponseData)]),
          () => ListBuilder<SurveillanceTypeResponseData>())
      ..addBuilderFactory(
          const FullType(
              BuiltList, const [const FullType(SuspectedPositivesData)]),
          () => ListBuilder<SuspectedPositivesData>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(VisitSampleData)]),
          () => ListBuilder<VisitSampleData>())
      ..addBuilderFactory(
          const FullType(BuiltList,
              const [const FullType(TeamMemberActivityResponseData)]),
          () => ListBuilder<TeamMemberActivityResponseData>())
      ..addBuilderFactory(
          const FullType(BuiltList,
              const [const FullType(TeamMemberProgressResponseData)]),
          () => ListBuilder<TeamMemberProgressResponseData>())
      ..addBuilderFactory(
          const FullType(
              BuiltList, const [const FullType(TeamMemberResponseData)]),
          () => ListBuilder<TeamMemberResponseData>())
      ..addBuilderFactory(
          const FullType(
              BuiltList, const [const FullType(TeamMemberResponseData)]),
          () => ListBuilder<TeamMemberResponseData>())
      ..addBuilderFactory(
          const FullType(
              BuiltList, const [const FullType(TeamMembersCollectorListType)]),
          () => ListBuilder<TeamMembersCollectorListType>())
      ..addBuilderFactory(
          const FullType(
              BuiltList, const [const FullType(TeamProgressResponseData)]),
          () => ListBuilder<TeamProgressResponseData>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(TeamResponseData)]),
          () => ListBuilder<TeamResponseData>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(UpdateLabTestDto)]),
          () => ListBuilder<UpdateLabTestDto>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(User)]),
          () => ListBuilder<User>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(User)]),
          () => ListBuilder<User>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(User)]),
          () => ListBuilder<User>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(Disease)]),
          () => ListBuilder<Disease>())
      ..addBuilderFactory(
          const FullType(
              BuiltList, const [const FullType(ProjectResponseRegion)]),
          () => ListBuilder<ProjectResponseRegion>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(User)]),
          () => ListBuilder<User>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(Disease)]),
          () => ListBuilder<Disease>())
      ..addBuilderFactory(
          const FullType(
              BuiltList, const [const FullType(ProjectResponseRegion)]),
          () => ListBuilder<ProjectResponseRegion>())
      ..addBuilderFactory(
          const FullType(BuiltList,
              const [const FullType(UserProfileResponseDataUserRole)]),
          () => ListBuilder<UserProfileResponseDataUserRole>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(UserResponseType)]),
          () => ListBuilder<UserResponseType>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(UserRole)]),
          () => ListBuilder<UserRole>())
      ..addBuilderFactory(
          const FullType(
              BuiltList, const [const FullType(VisitDataForEveryMemberType)]),
          () => ListBuilder<VisitDataForEveryMemberType>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(VisitResponseData)]),
          () => ListBuilder<VisitResponseData>())
      ..addBuilderFactory(
          const FullType(BuiltList, const [const FullType(num)]),
          () => ListBuilder<num>()))
    .build();

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
