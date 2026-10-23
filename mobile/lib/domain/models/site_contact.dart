import 'phone.dart';

class Contact {
  const Contact({
    required this.firstName,
    required this.lastName,
    required this.phone,
  });
  final String firstName;
  final String lastName;
  final Phone phone;

  String get fullName => '$firstName $lastName';

  Contact copyWith({
    String? firstName,
    String? lastName,
    Phone? phone,
  }) =>
      Contact(
        firstName: firstName ?? this.firstName,
        lastName: lastName ?? this.lastName,
        phone: phone ?? this.phone,
      );
}
