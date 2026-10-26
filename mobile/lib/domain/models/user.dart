import 'email.dart';
import 'entity.dart';
import 'phone.dart';
import 'user_type.dart';

class User extends Entity {
  // Reference to Organisation

  const User({
    required super.id,
    required this.type,
    required this.email,
    required this.phone,
    required this.firstName,
    required this.lastName,
    required this.language,
    required this.organisationId,
    this.profilePhoto,
  });
  final UserType type;
  final Email email;
  final Phone phone;
  final String firstName;
  final String lastName;
  final String language;
  final String? profilePhoto;
  final String organisationId;

  String get fullName => '$firstName $lastName';

  User copyWith({
    String? id,
    UserType? type,
    Email? email,
    Phone? phone,
    String? firstName,
    String? lastName,
    String? language,
    String? organisationId,
    String? profilePhoto,
  }) =>
      User(
        id: id ?? this.id,
        type: type ?? this.type,
        email: email ?? this.email,
        phone: phone ?? this.phone,
        firstName: firstName ?? this.firstName,
        lastName: lastName ?? this.lastName,
        language: language ?? this.language,
        organisationId: organisationId ?? this.organisationId,
        profilePhoto: profilePhoto ?? this.profilePhoto,
      );
}
