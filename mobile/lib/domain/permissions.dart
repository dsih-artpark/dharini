/// Represents the resource or area the permission applies to.
enum Subject {
  All('all'),
  Team('team'),
  TeamMember('team-member'),
  Project('project'),
  Site('site'),
  CollectionPlan('collection-plan'),
  Visit('visit'),
  Sample('sample'),
  SampleTest('sample-test'),
  User('user');

  const Subject(this.value);
  final String value;

  /// Creates a Subject from its string representation.
  /// Returns null if the string does not match any known subject.
  static Subject? fromString(String? value) {
    if (value == null) return null;
    for (final subject in Subject.values) {
      if (subject.value == value) {
        return subject;
      }
    }
    print("Warning: Unknown permission subject encountered: $value");
    return null; // Or throw an error if strict handling is needed
  }
}

/// Represents the type of operation allowed by a permission.
enum UserAction {
  Manage('manage'), // Represents all actions (create, read, update, delete)
  Read('read'),
  Create('create'),
  Update('update'),
  Delete('delete');

  const UserAction(this.value);
  final String value;

  /// Creates an Action from its string representation.
  /// Returns null if the string does not match any known action.
  static UserAction? fromString(String? value) {
    if (value == null) return null;
    for (final action in UserAction.values) {
      if (action.value == value) {
        return action;
      }
    }
    print("Warning: Unknown permission action encountered: $value");
    return null; // Or throw an error if strict handling is needed
  }
}
