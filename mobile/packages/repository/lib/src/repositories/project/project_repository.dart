import 'package:barrel_files_annotation/barrel_files_annotation.dart';
import 'package:data_provider/data_provider.dart';
import 'package:domain/domain.dart';

import '../../base/base_repository.dart';
import 'dto/project_dto.dart';
import 'dto/project_mapper.dart';

/// Repository for managing projects with both API and local storage
@includeInBarrelFile
class ProjectRepository extends BaseRepository {
  ProjectRepository({
    required HttpClient httpClient,
  })  : _httpClient = httpClient,
        _mapper = const ProjectMapper();

  final HttpClient _httpClient;
  final ProjectMapper _mapper;

  static const String _basePath = '/projects';

  /// Get a project by ID
  Future<Project> getProject(String id) async => handleApiError(() async {
        final Map<String, dynamic> response =
            await _httpClient.get<Map<String, dynamic>>(
          '$_basePath/$id',
        );

        final ProjectDto projectDto = ProjectDto.fromJson(response);
        return _mapper.toDomain(projectDto);
      });

  /// Get all projects with optional filters
  Future<List<Project>> getProjects({
    Map<String, dynamic>? filters,
  }) async =>
      handleApiError(() async {
        final List<dynamic> response = await _httpClient.get<List<dynamic>>(
          _basePath,
          queryParameters: filters,
        );

        final List<ProjectDto> dtos = response
            .map(
              (dynamic json) =>
                  ProjectDto.fromJson(json as Map<String, dynamic>),
            )
            .toList();

        return _mapper.toDomainList(dtos);
      });

  /// Create a new project
  Future<Project> createProject(Project project) async =>
      handleApiError(() async {
        final ProjectDto dto = _mapper.toDto(project);
        final Map<String, dynamic> response =
            await _httpClient.post<Map<String, dynamic>>(
          _basePath,
          data: dto.toJson(),
        );

        final ProjectDto projectDto = ProjectDto.fromJson(response);
        return _mapper.toDomain(projectDto);
      });

  /// Update an existing project
  Future<Project> updateProject(String id, Project project) async =>
      handleApiError(() async {
        final ProjectDto dto = _mapper.toDto(project);
        final Map<String, dynamic> response =
            await _httpClient.put<Map<String, dynamic>>(
          '$_basePath/$id',
          data: dto.toJson(),
        );

        final ProjectDto projectDto = ProjectDto.fromJson(response);
        return _mapper.toDomain(projectDto);
      });

  /// Delete a project
  Future<void> deleteProject(String id) async => handleApiError(() async {
        await _httpClient.delete<void>(
          '$_basePath/$id',
        );
      });

  /// Add a member to a project
  Future<Project> addMember(String projectId, String userId) async =>
      handleApiError(() async {
        final Map<String, dynamic> response =
            await _httpClient.post<Map<String, dynamic>>(
          '$_basePath/$projectId/members/$userId',
        );

        final ProjectDto projectDto = ProjectDto.fromJson(response);
        return _mapper.toDomain(projectDto);
      });

  /// Remove a member from a project
  Future<void> removeMember(String projectId, String userId) async =>
      handleApiError(() async {
        await _httpClient.delete<void>(
          '$_basePath/$projectId/members/$userId',
        );
      });

  /// Add a site to a project
  Future<Project> addSite(String projectId, String siteId) async =>
      handleApiError(() async {
        final Map<String, dynamic> response =
            await _httpClient.post<Map<String, dynamic>>(
          '$_basePath/$projectId/sites/$siteId',
        );

        final ProjectDto projectDto = ProjectDto.fromJson(response);
        return _mapper.toDomain(projectDto);
      });

  /// Remove a site from a project
  Future<void> removeSite(String projectId, String siteId) async =>
      handleApiError(() async {
        await _httpClient.delete<void>(
          '$_basePath/$projectId/sites/$siteId',
        );
      });

  /// Complete project onboarding
  Future<Project> completeOnboarding(String projectId) async =>
      handleApiError(() async {
        final Map<String, dynamic> response =
            await _httpClient.post<Map<String, dynamic>>(
          '$_basePath/$projectId/complete-onboarding',
        );

        final ProjectDto projectDto = ProjectDto.fromJson(response);
        return _mapper.toDomain(projectDto);
      });
}
