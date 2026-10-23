import 'package:barrel_files_annotation/barrel_files_annotation.dart';
import 'package:data_provider/data_provider.dart';
import 'package:domain/domain.dart';

import '../../base/base_repository.dart';
import 'dto/visit_dto.dart';
import 'dto/visit_mapper.dart';

/// Repository for managing visits with both API and local storage
@includeInBarrelFile
class VisitRepository extends BaseRepository {
  VisitRepository({
    required HttpClient httpClient,
  })  : _httpClient = httpClient,
        _mapper = const VisitMapper();

  final HttpClient _httpClient;
  final VisitMapper _mapper;

  static const String _basePath = '/visits';

  /// Get a visit by ID
  Future<Visit> getVisit(String id) async => handleApiError(() async {
        final Map<String, dynamic> response =
            await _httpClient.get<Map<String, dynamic>>(
          '$_basePath/$id',
        );

        final VisitDto visitDto = VisitDto.fromJson(response);
        return _mapper.toDomain(visitDto);
      });

  /// Get all visits with optional filters
  Future<List<Visit>> getVisits({
    Map<String, dynamic>? filters,
  }) async =>
      handleApiError(() async {
        final List<dynamic> response = await _httpClient.get<List<dynamic>>(
          _basePath,
          queryParameters: filters,
        );

        final List<VisitDto> dtos = response
            .map(
              (dynamic json) => VisitDto.fromJson(json as Map<String, dynamic>),
            )
            .toList();

        return _mapper.toDomainList(dtos);
      });

  /// Create a new visit
  Future<Visit> createVisit(Visit visit) async => handleApiError(() async {
        final VisitDto dto = _mapper.toDto(visit);
        final Map<String, dynamic> response =
            await _httpClient.post<Map<String, dynamic>>(
          _basePath,
          data: dto.toJson(),
        );

        final VisitDto visitDto = VisitDto.fromJson(response);
        return _mapper.toDomain(visitDto);
      });

  /// Update an existing visit
  Future<Visit> updateVisit(String id, Visit visit) async =>
      handleApiError(() async {
        final VisitDto dto = _mapper.toDto(visit);
        final Map<String, dynamic> response =
            await _httpClient.put<Map<String, dynamic>>(
          '$_basePath/$id',
          data: dto.toJson(),
        );

        final VisitDto visitDto = VisitDto.fromJson(response);
        return _mapper.toDomain(visitDto);
      });

  /// Delete a visit
  Future<void> deleteVisit(String id) async => handleApiError(() async {
        await _httpClient.delete<void>(
          '$_basePath/$id',
        );
      });

  /// Get visits by project ID
  Future<List<Visit>> getVisitsByProject(String projectId) async =>
      handleApiError(() async {
        final List<dynamic> response = await _httpClient.get<List<dynamic>>(
          '$_basePath/project/$projectId',
        );

        final List<VisitDto> dtos = response
            .map(
              (dynamic json) => VisitDto.fromJson(json as Map<String, dynamic>),
            )
            .toList();

        return _mapper.toDomainList(dtos);
      });

  /// Get visits by site ID
  Future<List<Visit>> getVisitsBySite(String siteId) async =>
      handleApiError(() async {
        final List<dynamic> response = await _httpClient.get<List<dynamic>>(
          '$_basePath/site/$siteId',
        );

        final List<VisitDto> dtos = response
            .map(
              (dynamic json) => VisitDto.fromJson(json as Map<String, dynamic>),
            )
            .toList();

        return _mapper.toDomainList(dtos);
      });

  /// Add a collector to a visit
  Future<Visit> addCollector(String visitId, String userId) async =>
      handleApiError(() async {
        final Map<String, dynamic> response =
            await _httpClient.post<Map<String, dynamic>>(
          '$_basePath/$visitId/collectors/$userId',
        );

        final VisitDto visitDto = VisitDto.fromJson(response);
        return _mapper.toDomain(visitDto);
      });

  /// Remove a collector from a visit
  Future<void> removeCollector(String visitId, String userId) async =>
      handleApiError(() async {
        await _httpClient.delete<void>(
          '$_basePath/$visitId/collectors/$userId',
        );
      });

  /// Update visit status
  Future<Visit> updateStatus(String visitId, VisitStatus status) async =>
      handleApiError(() async {
        final Map<String, dynamic> response =
            await _httpClient.put<Map<String, dynamic>>(
          '$_basePath/$visitId/status',
          data: <String, String>{'status': status.name},
        );

        final VisitDto visitDto = VisitDto.fromJson(response);
        return _mapper.toDomain(visitDto);
      });
}
