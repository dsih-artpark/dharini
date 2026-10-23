import '../models/user.dart';
import 'validator.dart';

class UserValidator implements Validator<User> {
  @override
  ValidationResult validate(User user) {
    final List<String> errors = <String>[];

    if (user.firstName.isEmpty) {
      errors.add('First name cannot be empty');
    }

    if (user.lastName.isEmpty) {
      errors.add('Last name cannot be empty');
    }

    if (user.language.isEmpty) {
      errors.add('Language must be specified');
    }

    return ValidationResult(
      isValid: errors.isEmpty,
      errors: errors,
    );
  }
}
