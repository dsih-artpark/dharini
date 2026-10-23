class ValidationHelper {
  /// Validate phone number (10 digits)
  static String? validatePhoneNumber(String? value) {
    if (value == null || value.trim().isEmpty) {
      return "Phone number is required";
    }

    String trimmedValue = value.trim();

    // Allowing phone numbers with an optional leading "0"
    if (RegExp(r'^0?[6-9]\d{9}$').hasMatch(trimmedValue)) {
      return null; // Valid number
    }

    return "Enter a valid 10-digit phone number";
  }

  /// Validate name (alphabets and numbers, min 3 characters)
  static String? validateName(String? value) {
    if (value == null || value.isEmpty) {
      return "Name is required";
    }
    if (value.trim().length < 3) {
      return "Name must be at least 3 characters";
    }
    if (!RegExp(r"^[a-zA-Z0-9\s]+$").hasMatch(value)) {
      return "Name can only contain letters, numbers, and spaces";
    }
    return null;
  }

  /// Validate address (min 5 characters)
  static String? validateAddress(String? value) {
    if (value == null || value.isEmpty) {
      return "Address is required";
    }
    if (value.length < 5) {
      return "Enter a valid address (at least 5 characters)";
    }
    return null;
  }

  /// Validate pincode (6-digit Indian format)
  static String? validatePincode(String? value) {
    if (value == null || value.isEmpty) {
      return "Pincode is required";
    }
    if (!RegExp(r'^\d{6}$').hasMatch(value)) {
      return "Enter a valid 6-digit pincode";
    }
    return null;
  }

  /// Validate number of workers (must be a positive integer)
  static String? validateWorkers(String? value) {
    if (value == null || value.isEmpty) {
      return "Number of workers is required";
    }
    if (!RegExp(r'^\d+$').hasMatch(value)) {
      return "Enter a valid number";
    }
    if (int.parse(value) <= 0) {
      return "Number of workers must be greater than zero";
    }
    return null;
  }

  /// Validate latitude (-90 to 90)
  static String? validateLatitude(String? value) {
    if (value == null || value.isEmpty) {
      return "Latitude is required";
    }
    double? lat = double.tryParse(value);
    if (lat == null || lat < -90 || lat > 90) {
      return "Enter a valid latitude (-90 to 90)";
    }
    return null;
  }

  /// Validate longitude (-180 to 180)
  static String? validateLongitude(String? value) {
    if (value == null || value.isEmpty) {
      return "Longitude is required";
    }
    double? lon = double.tryParse(value);
    if (lon == null || lon < -180 || lon > 180) {
      return "Enter a valid longitude (-180 to 180)";
    }
    return null;
  }

  /// Validate email
  static String? validateEmail(String? value) {
    if (value == null || value.isEmpty) {
      return "Email is required";
    }
    if (!RegExp(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
        .hasMatch(value)) {
      return "Enter a valid email";
    }
    return null;
  }

  /// Validate amount (must be positive)
  static String? validateAmount(String? value) {
    if (value == null || value.isEmpty) {
      return "Amount is required";
    }
    double? amount = double.tryParse(value);
    if (amount == null || amount <= 0) {
      return "Enter a valid amount greater than zero";
    }
    return null;
  }

  /// Validate duration (must be positive)
  static String? validateDuration(String? value) {
    if (value == null || value.isEmpty) {
      return "Duration is required";
    }
    int? duration = int.tryParse(value);
    if (duration == null || duration <= 0) {
      return "Enter a valid duration greater than zero";
    }
    return null;
  }

  /// Validate any non-empty input
  static String? validateRequiredField(String? value, String fieldName) {
    if (value == null || value.isEmpty) {
      return "$fieldName is required";
    }
    return null;
  }
}
