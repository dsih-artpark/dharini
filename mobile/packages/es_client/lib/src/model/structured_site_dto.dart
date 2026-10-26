//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:es_client/src/model/sample_dto.dart';
import 'package:es_client/src/model/lab_test_dto.dart';
import 'package:es_client/src/model/visit_dto.dart';
import 'package:built_collection/built_collection.dart';
import 'package:es_client/src/model/create_payload_dto.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'structured_site_dto.g.dart';

/// StructuredSiteDto
///
/// Properties:
/// * [sites] 
/// * [visits] 
/// * [samples] 
/// * [labTests] 
@BuiltValue()
abstract class StructuredSiteDto implements Built<StructuredSiteDto, StructuredSiteDtoBuilder> {
  @BuiltValueField(wireName: r'sites')
  BuiltList<CreatePayloadDto> get sites;

  @BuiltValueField(wireName: r'visits')
  BuiltList<VisitDto> get visits;

  @BuiltValueField(wireName: r'samples')
  BuiltList<SampleDto> get samples;

  @BuiltValueField(wireName: r'labTests')
  BuiltList<LabTestDto> get labTests;

  StructuredSiteDto._();

  factory StructuredSiteDto([void updates(StructuredSiteDtoBuilder b)]) = _$StructuredSiteDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(StructuredSiteDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<StructuredSiteDto> get serializer => _$StructuredSiteDtoSerializer();
}

class _$StructuredSiteDtoSerializer implements PrimitiveSerializer<StructuredSiteDto> {
  @override
  final Iterable<Type> types = const [StructuredSiteDto, _$StructuredSiteDto];

  @override
  final String wireName = r'StructuredSiteDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    StructuredSiteDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'sites';
    yield serializers.serialize(
      object.sites,
      specifiedType: const FullType(BuiltList, [FullType(CreatePayloadDto)]),
    );
    yield r'visits';
    yield serializers.serialize(
      object.visits,
      specifiedType: const FullType(BuiltList, [FullType(VisitDto)]),
    );
    yield r'samples';
    yield serializers.serialize(
      object.samples,
      specifiedType: const FullType(BuiltList, [FullType(SampleDto)]),
    );
    yield r'labTests';
    yield serializers.serialize(
      object.labTests,
      specifiedType: const FullType(BuiltList, [FullType(LabTestDto)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    StructuredSiteDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required StructuredSiteDtoBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'sites':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(CreatePayloadDto)]),
          ) as BuiltList<CreatePayloadDto>;
          result.sites.replace(valueDes);
          break;
        case r'visits':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(VisitDto)]),
          ) as BuiltList<VisitDto>;
          result.visits.replace(valueDes);
          break;
        case r'samples':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(SampleDto)]),
          ) as BuiltList<SampleDto>;
          result.samples.replace(valueDes);
          break;
        case r'labTests':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(LabTestDto)]),
          ) as BuiltList<LabTestDto>;
          result.labTests.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  StructuredSiteDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = StructuredSiteDtoBuilder();
    final serializedList = (serialized as Iterable<Object?>).toList();
    final unhandled = <Object?>[];
    _deserializeProperties(
      serializers,
      serialized,
      specifiedType: specifiedType,
      serializedList: serializedList,
      unhandled: unhandled,
      result: result,
    );
    return result.build();
  }
}


