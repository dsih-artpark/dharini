//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'visit_status.g.dart';

class VisitStatus extends EnumClass {

  @BuiltValueEnumConst(wireName: r'upcoming')
  static const VisitStatus upcoming = _$upcoming;
  @BuiltValueEnumConst(wireName: r'overdue')
  static const VisitStatus overdue = _$overdue;
  @BuiltValueEnumConst(wireName: r'skipped')
  static const VisitStatus skipped = _$skipped;
  @BuiltValueEnumConst(wireName: r'completed')
  static const VisitStatus completed = _$completed;
  @BuiltValueEnumConst(wireName: r'unknown_default_open_api', fallback: true)
  static const VisitStatus unknownDefaultOpenApi = _$unknownDefaultOpenApi;

  static Serializer<VisitStatus> get serializer => _$visitStatusSerializer;

  const VisitStatus._(String name): super(name);

  static BuiltSet<VisitStatus> get values => _$values;
  static VisitStatus valueOf(String name) => _$valueOf(name);
}

/// Optionally, enum_class can generate a mixin to go with your enum for use
/// with Angular. It exposes your enum constants as getters. So, if you mix it
/// in to your Dart component class, the values become available to the
/// corresponding Angular template.
///
/// Trigger mixin generation by writing a line like this one next to your enum.
abstract class VisitStatusMixin = Object with _$VisitStatusMixin;

