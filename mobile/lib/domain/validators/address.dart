import '../models/address.dart';
import 'validator.dart';

class AddressValidator implements Validator<Address> {
  @override
  ValidationResult validate(Address address) {
    final List<String> errors = <String>[];

    if (address.line1.isEmpty) {
      errors.add('Address line 1 is required');
    }

    if (address.district.isEmpty) {
      errors.add('District is required');
    }

    if (address.city.isEmpty) {
      errors.add('City is required');
    }

    if (!_isValidPincode(address.pincode)) {
      errors.add('Invalid pincode format');
    }

    return ValidationResult(
      isValid: errors.isEmpty,
      errors: errors,
    );
  }

  bool _isValidPincode(String pincode) => RegExp(r'^\d{6}$').hasMatch(pincode);
}
