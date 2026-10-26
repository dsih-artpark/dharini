import 'package:barrel_files_annotation/barrel_files_annotation.dart';
import 'package:data_provider/data_provider.dart';
import 'package:domain/domain.dart';

import '../../base/base_repository.dart';
import 'dto/site_dto.dart';
import 'dto/site_mapper.dart';

/// Repository for managing sites with both API and local storage
@includeInBarrelFile
class SiteRepository extends BaseRepository {
  SiteRepository({
    required HttpClient httpClient,
  })  : _httpClient = httpClient,
        _mapper = const SiteMapper();

  final HttpClient _httpClient;
  final SiteMapper _mapper;

  static const String _basePath = '/sites';

  /// Get a site by ID
  Future<Site> getSite(String id) async => handleApiError(() async {
        final Map<String, dynamic> response =
            await _httpClient.get<Map<String, dynamic>>(
          '$_basePath/$id',
        );

        final SiteDto siteDto = SiteDto.fromJson(response);
        return _mapper.toDomain(siteDto);
      });

  /// Get all sites with optional filters
  Future<List<Site>> getSites({
    Map<String, dynamic>? filters,
  }) async =>
      handleApiError(() async {
        final List<dynamic> response = await _httpClient.get<List<dynamic>>(
          _basePath,
          queryParameters: filters,
        );

        final List<SiteDto> dtos = response
            .map(
              (dynamic json) => SiteDto.fromJson(json as Map<String, dynamic>),
            )
            .toList();

        return _mapper.toDomainList(dtos);
      });

  /// Create a new site
  Future<Site> createSite(Site site) async => handleApiError(() async {
        final SiteDto dto = _mapper.toDto(site);
        final Map<String, dynamic> response =
            await _httpClient.post<Map<String, dynamic>>(
          _basePath,
          data: dto.toJson(),
        );

        final SiteDto siteDto = SiteDto.fromJson(response);
        return _mapper.toDomain(siteDto);
      });

  /// Update an existing site
  Future<Site> updateSite(String id, Site site) async =>
      handleApiError(() async {
        final SiteDto dto = _mapper.toDto(site);
        final Map<String, dynamic> response =
            await _httpClient.put<Map<String, dynamic>>(
          '$_basePath/$id',
          data: dto.toJson(),
        );

        final SiteDto siteDto = SiteDto.fromJson(response);
        return _mapper.toDomain(siteDto);
      });

  /// Delete a site
  Future<void> deleteSite(String id) async => handleApiError(() async {
        await _httpClient.delete<void>(
          '$_basePath/$id',
        );
      });

  /// Add a collector to a site
  Future<Site> addCollector(String siteId, String userId) async =>
      handleApiError(() async {
        final Map<String, dynamic> response =
            await _httpClient.post<Map<String, dynamic>>(
          '$_basePath/$siteId/collectors/$userId',
        );

        final SiteDto siteDto = SiteDto.fromJson(response);
        return _mapper.toDomain(siteDto);
      });

  /// Remove a collector from a site
  Future<void> removeCollector(String siteId, String userId) async =>
      handleApiError(() async {
        await _httpClient.delete<void>(
          '$_basePath/$siteId/collectors/$userId',
        );
      });

  /// Upload site photos
  Future<Site> uploadPhotos(String siteId, List<String> photoUrls) async =>
      handleApiError(() async {
        final Map<String, dynamic> response =
            await _httpClient.post<Map<String, dynamic>>(
          '$_basePath/$siteId/photos',
          data: <String, List<String>>{'photos': photoUrls},
        );

        final SiteDto siteDto = SiteDto.fromJson(response);
        return _mapper.toDomain(siteDto);
      });

  /// Remove a photo from a site
  Future<void> removePhoto(String siteId, String photoUrl) async =>
      handleApiError(() async {
        await _httpClient.delete<void>(
          '$_basePath/$siteId/photos',
          data: <String, String>{'photo': photoUrl},
        );
      });

  /// Get sites by project ID
  Future<List<Site>> getSitesByProject(String projectId) async =>
      handleApiError(() async {
        final List<dynamic> response = await _httpClient.get<List<dynamic>>(
          '$_basePath/project/$projectId',
        );

        final List<SiteDto> dtos = response
            .map(
              (dynamic json) => SiteDto.fromJson(json as Map<String, dynamic>),
            )
            .toList();

        return _mapper.toDomainList(dtos);
      });
}
