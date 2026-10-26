class Address {
  const Address({
    required this.line1,
    required this.district,
    required this.city,
    required this.pincode,
    this.line2,
  });
  final String line1;
  final String? line2;
  final String district;
  final String city;
  final String pincode;

  Address copyWith({
    String? line1,
    String? line2,
    String? district,
    String? city,
    String? pincode,
  }) =>
      Address(
        line1: line1 ?? this.line1,
        line2: line2 ?? this.line2,
        district: district ?? this.district,
        city: city ?? this.city,
        pincode: pincode ?? this.pincode,
      );
}
