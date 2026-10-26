import 'package:test/test.dart';
import 'package:es_client/es_client.dart';


/// tests for ProjectsApi
void main() {
  final instance = EsClient().getProjectsApi();

  group(ProjectsApi, () {
    // Create Team Member
    //
    //Future<TeamMemberResponse> projectsControllerAddMember(String teamId, String projectId, CreateMemberDto createMemberDto) async
    test('test projectsControllerAddMember', () async {
      // TODO
    });

    //Future<TeamMemberListResponse> projectsControllerAddMembersList(String teamId, CreateMembersListDto createMembersListDto) async
    test('test projectsControllerAddMembersList', () async {
      // TODO
    });

    //Future<ProjectResponse> projectsControllerCreate(CreateProjectDto createProjectDto) async
    test('test projectsControllerCreate', () async {
      // TODO
    });

    //Future<ListLabTestResponse> projectsControllerCreateLabTest(String sampleId, String projectId, CreateMultipleLabTestDto createMultipleLabTestDto) async
    test('test projectsControllerCreateLabTest', () async {
      // TODO
    });

    // Create Sample
    //
    //Future<SampleResponse> projectsControllerCreateSample(String projectId, CreateSampleDto createSampleDto) async
    test('test projectsControllerCreateSample', () async {
      // TODO
    });

    // Create Site
    //
    //Future<SiteResponse> projectsControllerCreateSite(String projectId, CreateSiteDto createSiteDto) async
    test('test projectsControllerCreateSite', () async {
      // TODO
    });

    // Create Team
    //
    //Future<TeamResponse> projectsControllerCreateTeam(String projectId, CreateTeamDto createTeamDto) async
    test('test projectsControllerCreateTeam', () async {
      // TODO
    });

    //Future<VisitResponse> projectsControllerCreateVisit(String projectId, CreateVisitDto createVisitDto) async
    test('test projectsControllerCreateVisit', () async {
      // TODO
    });

    //Future<PaginatedProjectResponse> projectsControllerFindAll({ String disease }) async
    test('test projectsControllerFindAll', () async {
      // TODO
    });

    //Future<PaginatedSampleResponse> projectsControllerFindAllSamples(String projectId, { num limit, num page, String endDate, String startDate, String sampleStatus, String sampleTypeId, String search, String visitId, String siteId, String diseaseId }) async
    test('test projectsControllerFindAllSamples', () async {
      // TODO
    });

    //Future<ProjectStatisticByDiseaseResponse> projectsControllerFindAllSites(String id, String projectId) async
    test('test projectsControllerFindAllSites', () async {
      // TODO
    });

    //Future<ListTeamResponse> projectsControllerFindAllTeams({ String projectId }) async
    test('test projectsControllerFindAllTeams', () async {
      // TODO
    });

    //Future<VisitResponse> projectsControllerFindById(String visitId, String siteId, String projectId) async
    test('test projectsControllerFindById', () async {
      // TODO
    });

    //Future<ProjectResponse> projectsControllerFindOne(String projectId) async
    test('test projectsControllerFindOne', () async {
      // TODO
    });

    //Future<SampleResponse> projectsControllerFindOneSample(String sampleId, String projectId) async
    test('test projectsControllerFindOneSample', () async {
      // TODO
    });

    //Future<SiteResponse> projectsControllerFindSite(String siteId, String projectId) async
    test('test projectsControllerFindSite', () async {
      // TODO
    });

    //Future<ListSiteResponse> projectsControllerFindSites(String projectId, { String search, String farmType, String filterBy, String endDate, String startDate, String siteType, String disease, String testResult, String project }) async
    test('test projectsControllerFindSites', () async {
      // TODO
    });

    //Future<TeamResponse> projectsControllerFindTeam(String teamId, String projectId) async
    test('test projectsControllerFindTeam', () async {
      // TODO
    });

    //Future<LabTestResponse> projectsControllerGetLabTest(String labTestId, String sampleId, String projectId) async
    test('test projectsControllerGetLabTest', () async {
      // TODO
    });

    //Future<SampleStatLogisticResponse> projectsControllerGetLabTestStats(String projectId, { String endDate, String startDate }) async
    test('test projectsControllerGetLabTestStats', () async {
      // TODO
    });

    //Future<ListLabTestResponse> projectsControllerGetLabTests(String sampleId, String projectId) async
    test('test projectsControllerGetLabTests', () async {
      // TODO
    });

    //Future<ListSiteResponse> projectsControllerGetNearbyLocations(num lat, num lon, num radius, String projectId, num longitude, num latitude, { bool assignedTo, BuiltList<String> farmType, String filterBy }) async
    test('test projectsControllerGetNearbyLocations', () async {
      // TODO
    });

    //Future<FetchAllUserResponse> projectsControllerGetProjectCollectors(String projectId) async
    test('test projectsControllerGetProjectCollectors', () async {
      // TODO
    });

    //Future<ProjectStatisticBySiteResponse> projectsControllerGetSitesStatisticsByStatus(String projectId, String disease, String startDate, String endDate) async
    test('test projectsControllerGetSitesStatisticsByStatus', () async {
      // TODO
    });

    //Future<TeamProgressActivityOverviewResponse> projectsControllerGetTeamActivityOverview(String teamId, { String endDate, String startDate }) async
    test('test projectsControllerGetTeamActivityOverview', () async {
      // TODO
    });

    //Future<ListTeamMemberResponse> projectsControllerGetTeamMembers(String teamId, String projectId) async
    test('test projectsControllerGetTeamMembers', () async {
      // TODO
    });

    //Future<PaginatedTeamMemberResponse> projectsControllerGetTeamMembersFieldView(String teamId) async
    test('test projectsControllerGetTeamMembersFieldView', () async {
      // TODO
    });

    //Future<TeamMemberActivityResponse> projectsControllerGetTeamMembersVisitActivity(String teamId, { String endDate, String startDate }) async
    test('test projectsControllerGetTeamMembersVisitActivity', () async {
      // TODO
    });

    //Future<ListAvailableRoleResponse> projectsControllerGetTeamRoles(String projectId) async
    test('test projectsControllerGetTeamRoles', () async {
      // TODO
    });

    // Visit Summary for Site
    //
    //Future<VisitSummaryResponse> projectsControllerGetVisitSummary(String siteId, String projectId, { String endDate, String startDate }) async
    test('test projectsControllerGetVisitSummary', () async {
      // TODO
    });

    //Future<PaginatedVisitResponse> projectsControllerGetVisits(String projectId, { num limit, num page, String visitStatus, bool assignedTo, bool isCompleted, String endDate, String startDate, String siteType, String disease, String siteId }) async
    test('test projectsControllerGetVisits', () async {
      // TODO
    });

    //Future projectsControllerRemoveMember(String memberId, String teamId, String projectId) async
    test('test projectsControllerRemoveMember', () async {
      // TODO
    });

    //Future<RemovedTeamMemberResponse> projectsControllerRemoveMembersList(String teamId, TeamMemberRemoveDto teamMemberRemoveDto) async
    test('test projectsControllerRemoveMembersList', () async {
      // TODO
    });

    //Future<ProjectStatisticsResponse> projectsControllerStatistics() async
    test('test projectsControllerStatistics', () async {
      // TODO
    });

    //Future<SubmitVisitResponse> projectsControllerSubmitVisit(String visitId, SubmitVisitDto submitVisitDto) async
    test('test projectsControllerSubmitVisit', () async {
      // TODO
    });

    //Future<ProjectResponse> projectsControllerUpdate(String id, String projectId, UpdateProjectDto updateProjectDto) async
    test('test projectsControllerUpdate', () async {
      // TODO
    });

    //Future<ListLabTestResponse> projectsControllerUpdateLabTest(String sampleId, String labTestId, UpdateMultipleLabTestDto updateMultipleLabTestDto) async
    test('test projectsControllerUpdateLabTest', () async {
      // TODO
    });

    //Future<TeamMemberResponse> projectsControllerUpdateMember(String memberId, String teamId, String projectId, UpdateMemberDto updateMemberDto) async
    test('test projectsControllerUpdateMember', () async {
      // TODO
    });

    //Future<SampleResponse> projectsControllerUpdateSample(String sampleId, String projectId, UpdateSampleDto updateSampleDto) async
    test('test projectsControllerUpdateSample', () async {
      // TODO
    });

    //Future<SiteResponse> projectsControllerUpdateSite(String siteId, String projectId, UpdateSiteDto updateSiteDto) async
    test('test projectsControllerUpdateSite', () async {
      // TODO
    });

    //Future<TeamResponse> projectsControllerUpdateTeam(String teamId, String projectId, UpdateTeamDto updateTeamDto) async
    test('test projectsControllerUpdateTeam', () async {
      // TODO
    });

    //Future<VisitResponse> projectsControllerUpdateVisit(String visitId, String projectId, UpdateVisitDto updateVisitDto) async
    test('test projectsControllerUpdateVisit', () async {
      // TODO
    });

  });
}
