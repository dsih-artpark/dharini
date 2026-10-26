enum UserType {
  superAdmin,
  admin,
  collector;

  factory UserType.fromString(String value) => UserType.values.firstWhere(
        (UserType type) => type.name.toLowerCase() == value.toLowerCase(),
        orElse: () => throw ArgumentError('Invalid user type: $value'),
      );
}
