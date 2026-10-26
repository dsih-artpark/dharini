//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:es_client/src/model/lab_test_dto.dart';
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'sample_dto.g.dart';

/// SampleDto
///
/// Properties:
/// * [sampleId] 
/// * [barcode] 
/// * [replicates] 
/// * [comment] 
/// * [diseases] 
/// * [photos] 
/// * [latitude] 
/// * [longitude] 
/// * [labTests] 
@BuiltValue()
abstract class SampleDto implements Built<SampleDto, SampleDtoBuilder> {
  @BuiltValueField(wireName: r'sampleId')
  String get sampleId;

  @BuiltValueField(wireName: r'barcode')
  String get barcode;

  @BuiltValueField(wireName: r'replicates')
  String get replicates;

  @BuiltValueField(wireName: r'comment')
  String get comment;

  @BuiltValueField(wireName: r'diseases')
  BuiltList<String> get diseases;

  @BuiltValueField(wireName: r'photos')
  BuiltList<String> get photos;

  @BuiltValueField(wireName: r'latitude')
  num get latitude;

  @BuiltValueField(wireName: r'longitude')
  num get longitude;

  @BuiltValueField(wireName: r'labTests')
  BuiltList<LabTestDto> get labTests;

  SampleDto._();

  factory SampleDto([void updates(SampleDtoBuilder b)]) = _$SampleDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(SampleDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<SampleDto> get serializer => _$SampleDtoSerializer();
}

class _$SampleDtoSerializer implements PrimitiveSerializer<SampleDto> {
  @override
  final Iterable<Type> types = const [SampleDto, _$SampleDto];

  @override
  final String wireName = r'SampleDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    SampleDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'sampleId';
    yield serializers.serialize(
      object.sampleId,
      specifiedType: const FullType(String),
    );
    yield r'barcode';
    yield serializers.serialize(
      object.barcode,
      specifiedType: const FullType(String),
    );
    yield r'replicates';
    yield serializers.serialize(
      object.replicates,
      specifiedType: const FullType(String),
    );
    yield r'comment';
    yield serializers.serialize(
      object.comment,
      specifiedType: const FullType(String),
    );
    yield r'diseases';
    yield serializers.serialize(
      object.diseases,
      specifiedType: const FullType(BuiltList, [FullType(String)]),
    );
    yield r'photos';
    yield serializers.serialize(
      object.photos,
      specifiedType: const FullType(BuiltList, [FullType(String)]),
    );
    yield r'latitude';
    yield serializers.serialize(
      object.latitude,
      specifiedType: const FullType(num),
    );
    yield r'longitude';
    yield serializers.serialize(
      object.longitude,
      specifiedType: const FullType(num),
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
    SampleDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required SampleDtoBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'sampleId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.sampleId = valueDes;
          break;
        case r'barcode':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.barcode = valueDes;
          break;
        case r'replicates':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.replicates = valueDes;
          break;
        case r'comment':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.comment = valueDes;
          break;
        case r'diseases':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(String)]),
          ) as BuiltList<String>;
          result.diseases.replace(valueDes);
          break;
        case r'photos':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(String)]),
          ) as BuiltList<String>;
          result.photos.replace(valueDes);
          break;
        case r'latitude':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.latitude = valueDes;
          break;
        case r'longitude':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.longitude = valueDes;
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
  SampleDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = SampleDtoBuilder();
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


