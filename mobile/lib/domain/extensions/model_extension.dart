import 'package:dartx/dartx.dart';
import 'package:es_client/es_client.dart';

extension SiteTypeExtension on SiteType? {
  String get text =>
      this?.name.split(" ").map((e) => e.capitalize()).join(" ") ?? "";
}
