//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'create_payload_dto.g.dart';

/// CreatePayloadDto
///
/// Properties:
/// * [project] 
/// * [name] 
/// * [farmType] 
/// * [siteType] 
/// * [siteOwnerName] 
/// * [siteOwnerNumber] 
/// * [workerNumber] 
/// * [address] 
/// * [regionId] 
/// * [pinCode] 
/// * [latitude] 
/// * [longitude] 
/// * [comment] 
/// * [photos] 
@BuiltValue()
abstract class CreatePayloadDto implements Built<CreatePayloadDto, CreatePayloadDtoBuilder> {
  @BuiltValueField(wireName: r'project')
  String get project;

  @BuiltValueField(wireName: r'name')
  String get name;

  @BuiltValueField(wireName: r'farmType')
  String get farmType;

  @BuiltValueField(wireName: r'siteType')
  String get siteType;

  @BuiltValueField(wireName: r'siteOwnerName')
  String get siteOwnerName;

  @BuiltValueField(wireName: r'siteOwnerNumber')
  String get siteOwnerNumber;

  @BuiltValueField(wireName: r'workerNumber')
  num get workerNumber;

  @BuiltValueField(wireName: r'address')
  String get address;

  @BuiltValueField(wireName: r'regionId')
  String get regionId;

  @BuiltValueField(wireName: r'pinCode')
  String? get pinCode;

  @BuiltValueField(wireName: r'latitude')
  num get latitude;

  @BuiltValueField(wireName: r'longitude')
  num get longitude;

  @BuiltValueField(wireName: r'comment')
  String get comment;

  @BuiltValueField(wireName: r'photos')
  BuiltList<String> get photos;

  CreatePayloadDto._();

  factory CreatePayloadDto([void updates(CreatePayloadDtoBuilder b)]) = _$CreatePayloadDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(CreatePayloadDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<CreatePayloadDto> get serializer => _$CreatePayloadDtoSerializer();
}

class _$CreatePayloadDtoSerializer implements PrimitiveSerializer<CreatePayloadDto> {
  @override
  final Iterable<Type> types = const [CreatePayloadDto, _$CreatePayloadDto];

  @override
  final String wireName = r'CreatePayloadDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    CreatePayloadDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'project';
    yield serializers.serialize(
      object.project,
      specifiedType: const FullType(String),
    );
    yield r'name';
    yield serializers.serialize(
      object.name,
      specifiedType: const FullType(String),
    );
    yield r'farmType';
    yield serializers.serialize(
      object.farmType,
      specifiedType: const FullType(String),
    );
    yield r'siteType';
    yield serializers.serialize(
      object.siteType,
      specifiedType: const FullType(String),
    );
    yield r'siteOwnerName';
    yield serializers.serialize(
      object.siteOwnerName,
      specifiedType: const FullType(String),
    );
    yield r'siteOwnerNumber';
    yield serializers.serialize(
      object.siteOwnerNumber,
      specifiedType: const FullType(String),
    );
    yield r'workerNumber';
    yield serializers.serialize(
      object.workerNumber,
      specifiedType: const FullType(num),
    );
    yield r'address';
    yield serializers.serialize(
      object.address,
      specifiedType: const FullType(String),
    );
    yield r'regionId';
    yield serializers.serialize(
      object.regionId,
      specifiedType: const FullType(String),
    );
    yield r'pinCode';
    yield object.pinCode == null ? null : serializers.serialize(
      object.pinCode,
      specifiedType: const FullType.nullable(String),
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
    yield r'comment';
    yield serializers.serialize(
      object.comment,
      specifiedType: const FullType(String),
    );
    yield r'photos';
    yield serializers.serialize(
      object.photos,
      specifiedType: const FullType(BuiltList, [FullType(String)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    CreatePayloadDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required CreatePayloadDtoBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'project':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.project = valueDes;
          break;
        case r'name':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.name = valueDes;
          break;
        case r'farmType':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.farmType = valueDes;
          break;
        case r'siteType':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.siteType = valueDes;
          break;
        case r'siteOwnerName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.siteOwnerName = valueDes;
          break;
        case r'siteOwnerNumber':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.siteOwnerNumber = valueDes;
          break;
        case r'workerNumber':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.workerNumber = valueDes;
          break;
        case r'address':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.address = valueDes;
          break;
        case r'regionId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.regionId = valueDes;
          break;
        case r'pinCode':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.pinCode = valueDes;
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
        case r'comment':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.comment = valueDes;
          break;
        case r'photos':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(String)]),
          ) as BuiltList<String>;
          result.photos.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  CreatePayloadDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = CreatePayloadDtoBuilder();
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


