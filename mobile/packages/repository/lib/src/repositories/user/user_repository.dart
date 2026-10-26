import 'package:barrel_files_annotation/barrel_files_annotation.dart';
import 'package:data_provider/data_provider.dart';
import 'package:domain/domain.dart';

import '../../base/base_repository.dart';
import 'dto/user_dto.dart';
import 'dto/user_mapper.dart';

/// Repository for managing user data with both API and local storage
@includeInBarrelFile
class UserRepository extends BaseRepository {
  UserRepository({
    required HttpClient httpClient,
  })  : _httpClient = httpClient,
        _mapper = const UserMapper();

  final HttpClient _httpClient;
  final UserMapper _mapper;

  static const String _authPath = '/auth';
  static const String _usersPath = '/users';

  /// Verify OTP and get user data
  Future<User> verifyOtp({
    required String otp,
    String? email,
    String? phoneNumber,
  }) async =>
      handleApiError(() async {
        assert(
          (email != null) || (phoneNumber != null),
          'Either email or phone number must be provided',
        );

        final Map<String, dynamic> response =
            await _httpClient.post<Map<String, dynamic>>(
          '$_authPath/otp/verify',
          data: <String, String?>{
            if (email != null) 'email': email,
            if (phoneNumber != null) 'contact_number': phoneNumber,
            'otp': otp,
          },
          requiresAuth: false,
        );

        final Map<String, dynamic> userJson =
            response['user'] as Map<String, dynamic>;
        final UserDto userDto = UserDto.fromJson(userJson);
        return _mapper.toDomain(userDto);
      });

  /// Send OTP to the provided email
  Future<void> sendEmailOtp({
    required String email,
  }) async =>
      handleApiError(() async {
        await _httpClient.post<void>(
          '$_authPath/otp/email/send',
          data: <String, String>{'email': email},
          requiresAuth: false,
        );
      });

  /// Send OTP to the provided phone number
  Future<void> sendSmsOtp({
    required String phoneNumber,
  }) async =>
      handleApiError(() async {
        await _httpClient.post<void>(
          '$_authPath/otp/sms/send',
          data: <String, String>{'phone_number': phoneNumber},
          requiresAuth: false,
        );
      });

  /// Sign out the current user
  Future<void> signOut() async => handleApiError(() async {
        await _httpClient.post<void>(
          '$_authPath/signout',
        );
        
      });

  /// Get a user by ID
  Future<User> getUser(String id) async => handleApiError(() async {
        final Map<String, dynamic> response =
            await _httpClient.get<Map<String, dynamic>>(
          '$_usersPath/$id',
        );

        final UserDto userDto = UserDto.fromJson(response);
        return _mapper.toDomain(userDto);
      });

  /// Get all users with optional filters
  Future<List<User>> getUsers({
    Map<String, dynamic>? filters,
  }) async =>
      handleApiError(() async {
        final List<dynamic> response = await _httpClient.get<List<dynamic>>(
          _usersPath,
          queryParameters: filters,
        );

        final List<UserDto> dtos = response
            .map(
              (dynamic json) => UserDto.fromJson(json as Map<String, dynamic>),
            )
            .toList();

        return _mapper.toDomainList(dtos);
      });

  /// Create a new user
  Future<User> createUser(User user) async => handleApiError(() async {
        final UserDto dto = _mapper.toDto(user);
        final Map<String, dynamic> response =
            await _httpClient.post<Map<String, dynamic>>(
          _usersPath,
          data: dto.toJson(),
        );

        final UserDto userDto = UserDto.fromJson(response);
        return _mapper.toDomain(userDto);
      });

  /// Update an existing user
  Future<User> updateUser(String id, User user) async =>
      handleApiError(() async {
        final UserDto dto = _mapper.toDto(user);
        final Map<String, dynamic> response =
            await _httpClient.put<Map<String, dynamic>>(
          '$_usersPath/$id',
          data: dto.toJson(),
        );

        final UserDto userDto = UserDto.fromJson(response);
        return _mapper.toDomain(userDto);
      });

  /// Delete a user
  Future<void> deleteUser(String id) async => handleApiError(() async {
        await _httpClient.delete<void>(
          '$_usersPath/$id',
        );
      });
}
