//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'site_type.g.dart';

class SiteType extends EnumClass {

  @BuiltValueEnumConst(wireName: r'private')
  static const SiteType private = _$private;
  @BuiltValueEnumConst(wireName: r'government')
  static const SiteType government = _$government;
  @BuiltValueEnumConst(wireName: r'corporate')
  static const SiteType corporate = _$corporate;
  @BuiltValueEnumConst(wireName: r'unknown_default_open_api', fallback: true)
  static const SiteType unknownDefaultOpenApi = _$unknownDefaultOpenApi;

  static Serializer<SiteType> get serializer => _$siteTypeSerializer;

  const SiteType._(String name): super(name);

  static BuiltSet<SiteType> get values => _$values;
  static SiteType valueOf(String name) => _$valueOf(name);
}

/// Optionally, enum_class can generate a mixin to go with your enum for use
/// with Angular. It exposes your enum constants as getters. So, if you mix it
/// in to your Dart component class, the values become available to the
/// corresponding Angular template.
///
/// Trigger mixin generation by writing a line like this one next to your enum.
abstract class SiteTypeMixin = Object with _$SiteTypeMixin;

