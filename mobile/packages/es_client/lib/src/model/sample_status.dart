//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'sample_status.g.dart';

class SampleStatus extends EnumClass {

  @BuiltValueEnumConst(wireName: r'pending')
  static const SampleStatus pending = _$pending;
  @BuiltValueEnumConst(wireName: r'picked-up')
  static const SampleStatus pickedUp = _$pickedUp;
  @BuiltValueEnumConst(wireName: r'received')
  static const SampleStatus received = _$received;
  @BuiltValueEnumConst(wireName: r'pre-processed')
  static const SampleStatus preProcessed = _$preProcessed;
  @BuiltValueEnumConst(wireName: r'virus-isolation')
  static const SampleStatus virusIsolation = _$virusIsolation;
  @BuiltValueEnumConst(wireName: r'extracted')
  static const SampleStatus extracted = _$extracted;
  @BuiltValueEnumConst(wireName: r'tested')
  static const SampleStatus tested = _$tested;
  @BuiltValueEnumConst(wireName: r'rejected')
  static const SampleStatus rejected = _$rejected;
  @BuiltValueEnumConst(wireName: r'test-report-generated')
  static const SampleStatus testReportGenerated = _$testReportGenerated;
  @BuiltValueEnumConst(wireName: r'unknown_default_open_api', fallback: true)
  static const SampleStatus unknownDefaultOpenApi = _$unknownDefaultOpenApi;

  static Serializer<SampleStatus> get serializer => _$sampleStatusSerializer;

  const SampleStatus._(String name): super(name);

  static BuiltSet<SampleStatus> get values => _$values;
  static SampleStatus valueOf(String name) => _$valueOf(name);
}

/// Optionally, enum_class can generate a mixin to go with your enum for use
/// with Angular. It exposes your enum constants as getters. So, if you mix it
/// in to your Dart component class, the values become available to the
/// corresponding Angular template.
///
/// Trigger mixin generation by writing a line like this one next to your enum.
abstract class SampleStatusMixin = Object with _$SampleStatusMixin;

