enum FarmType {
  cattle,
  poultry,
  wetland;

  factory FarmType.fromString(String value) => FarmType.values.firstWhere(
        (FarmType type) => type.name == value,
        orElse: () => throw ArgumentError('Invalid farm type: $value'),
      );
}

enum SiteType {
  private,
  corporate,
  public;

  factory SiteType.fromString(String value) => SiteType.values.firstWhere(
        (SiteType type) => type.name == value,
        orElse: () => throw ArgumentError('Invalid site type: $value'),
      );
}
