import 'package:barrel_files_annotation/barrel_files_annotation.dart';
import 'package:data_provider/data_provider.dart';
import 'package:domain/domain.dart';

import '../../base/base_repository.dart';
import 'dto/invite_dto.dart';
import 'dto/invite_mapper.dart';

/// Repository for managing invites with both API and local storage
@includeInBarrelFile
class InviteRepository extends BaseRepository {
  InviteRepository({
    required HttpClient httpClient,
  })  : _httpClient = httpClient,
        _mapper = const InviteMapper();

  final HttpClient _httpClient;
  final InviteMapper _mapper;

  static const String _basePath = '/invites';

  /// Get an invite by ID
  Future<Invite> getInvite(String id) async => handleApiError(() async {
        final Map<String, dynamic> response =
            await _httpClient.get<Map<String, dynamic>>(
          '$_basePath/$id',
        );

        final InviteDto inviteDto = InviteDto.fromJson(response);
        return _mapper.toDomain(inviteDto);
      });

  /// Get all invites with optional filters
  Future<List<Invite>> getInvites({
    Map<String, dynamic>? filters,
  }) async =>
      handleApiError(() async {
        final List<dynamic> response = await _httpClient.get<List<dynamic>>(
          _basePath,
          queryParameters: filters,
        );

        final List<InviteDto> dtos = response
            .map(
              (dynamic json) =>
                  InviteDto.fromJson(json as Map<String, dynamic>),
            )
            .toList();

        return _mapper.toDomainList(dtos);
      });

  /// Create a new invite
  Future<Invite> createInvite(Invite invite) async => handleApiError(() async {
        final InviteDto dto = _mapper.toDto(invite);
        final Map<String, dynamic> response =
            await _httpClient.post<Map<String, dynamic>>(
          _basePath,
          data: dto.toJson(),
        );

        final InviteDto inviteDto = InviteDto.fromJson(response);
        return _mapper.toDomain(inviteDto);
      });

  /// Update an existing invite
  Future<Invite> updateInvite(String id, Invite invite) async =>
      handleApiError(() async {
        final InviteDto dto = _mapper.toDto(invite);
        final Map<String, dynamic> response =
            await _httpClient.put<Map<String, dynamic>>(
          '$_basePath/$id',
          data: dto.toJson(),
        );

        final InviteDto inviteDto = InviteDto.fromJson(response);
        return _mapper.toDomain(inviteDto);
      });

  /// Delete an invite
  Future<void> deleteInvite(String id) async => handleApiError(() async {
        await _httpClient.delete<void>(
          '$_basePath/$id',
        );
      });

  /// Accept an invite
  Future<Invite> acceptInvite(String id) async => handleApiError(() async {
        final Map<String, dynamic> response =
            await _httpClient.post<Map<String, dynamic>>(
          '$_basePath/$id/accept',
        );

        final InviteDto inviteDto = InviteDto.fromJson(response);
        return _mapper.toDomain(inviteDto);
      });

  /// Reject an invite
  Future<void> rejectInvite(String id) async => handleApiError(() async {
        await _httpClient.post<void>(
          '$_basePath/$id/reject',
        );
      });

  /// Resend an invite
  Future<void> resendInvite(String id) async => handleApiError(() async {
        await _httpClient.post<void>(
          '$_basePath/$id/resend',
        );
      });
}
