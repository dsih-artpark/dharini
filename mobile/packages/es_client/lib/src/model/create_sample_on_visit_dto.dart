//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/json_object.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'create_sample_on_visit_dto.g.dart';

/// CreateSampleOnVisitDto
///
/// Properties:
/// * [quantity] - Quantity
/// * [replicates] - Replicates
/// * [unit] - Unit
/// * [photos] - file path
/// * [barcode] - barcode
/// * [originalSampleBarcode] - barcode of original sample if exist
/// * [diseases] - disease id array
/// * [testDate] - when the sample is tested
/// * [collectedBy] - who tested the sample
/// * [location] - location
/// * [sampleStatus] - enum [positive, negative, unclear]
/// * [testedBy] - who has tested 
/// * [comment] - comments
/// * [sampleType] - Sample type UUID
/// * [species] - Species UUID
/// * [details] - Additional sample metadata (e.g. animal info for FMD/LSD, farm info for AI)
@BuiltValue()
abstract class CreateSampleOnVisitDto implements Built<CreateSampleOnVisitDto, CreateSampleOnVisitDtoBuilder> {
  /// Quantity
  @BuiltValueField(wireName: r'quantity')
  num? get quantity;

  /// Replicates
  @BuiltValueField(wireName: r'replicates')
  CreateSampleOnVisitDtoReplicatesEnum get replicates;
  // enum replicatesEnum {  available,  not collected,  };

  /// Unit
  @BuiltValueField(wireName: r'unit')
  String? get unit;

  /// file path
  @BuiltValueField(wireName: r'photos')
  BuiltList<String>? get photos;

  /// barcode
  @BuiltValueField(wireName: r'barcode')
  String get barcode;

  /// barcode of original sample if exist
  @BuiltValueField(wireName: r'originalSampleBarcode')
  String? get originalSampleBarcode;

  /// disease id array
  @BuiltValueField(wireName: r'diseases')
  BuiltList<JsonObject> get diseases;

  /// when the sample is tested
  @BuiltValueField(wireName: r'testDate')
  DateTime? get testDate;

  /// who tested the sample
  @BuiltValueField(wireName: r'collectedBy')
  JsonObject get collectedBy;

  /// location
  @BuiltValueField(wireName: r'location')
  String? get location;

  /// enum [positive, negative, unclear]
  @BuiltValueField(wireName: r'sampleStatus')
  CreateSampleOnVisitDtoSampleStatusEnum? get sampleStatus;
  // enum sampleStatusEnum {  pending,  picked-up,  received,  pre-processed,  virus-isolation,  extracted,  tested,  rejected,  test-report-generated,  };

  /// who has tested 
  @BuiltValueField(wireName: r'testedBy')
  String? get testedBy;

  /// comments
  @BuiltValueField(wireName: r'comment')
  String? get comment;

  /// Sample type UUID
  @BuiltValueField(wireName: r'sampleType')
  JsonObject get sampleType;

  /// Species UUID
  @BuiltValueField(wireName: r'species')
  JsonObject? get species;

  /// Additional sample metadata (e.g. animal info for FMD/LSD, farm info for AI)
  @BuiltValueField(wireName: r'details')
  JsonObject? get details;

  CreateSampleOnVisitDto._();

  factory CreateSampleOnVisitDto([void updates(CreateSampleOnVisitDtoBuilder b)]) = _$CreateSampleOnVisitDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(CreateSampleOnVisitDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<CreateSampleOnVisitDto> get serializer => _$CreateSampleOnVisitDtoSerializer();
}

class _$CreateSampleOnVisitDtoSerializer implements PrimitiveSerializer<CreateSampleOnVisitDto> {
  @override
  final Iterable<Type> types = const [CreateSampleOnVisitDto, _$CreateSampleOnVisitDto];

  @override
  final String wireName = r'CreateSampleOnVisitDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    CreateSampleOnVisitDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.quantity != null) {
      yield r'quantity';
      yield serializers.serialize(
        object.quantity,
        specifiedType: const FullType(num),
      );
    }
    yield r'replicates';
    yield serializers.serialize(
      object.replicates,
      specifiedType: const FullType(CreateSampleOnVisitDtoReplicatesEnum),
    );
    if (object.unit != null) {
      yield r'unit';
      yield serializers.serialize(
        object.unit,
        specifiedType: const FullType(String),
      );
    }
    if (object.photos != null) {
      yield r'photos';
      yield serializers.serialize(
        object.photos,
        specifiedType: const FullType(BuiltList, [FullType(String)]),
      );
    }
    yield r'barcode';
    yield serializers.serialize(
      object.barcode,
      specifiedType: const FullType(String),
    );
    if (object.originalSampleBarcode != null) {
      yield r'originalSampleBarcode';
      yield serializers.serialize(
        object.originalSampleBarcode,
        specifiedType: const FullType(String),
      );
    }
    yield r'diseases';
    yield serializers.serialize(
      object.diseases,
      specifiedType: const FullType(BuiltList, [FullType(JsonObject)]),
    );
    if (object.testDate != null) {
      yield r'testDate';
      yield serializers.serialize(
        object.testDate,
        specifiedType: const FullType(DateTime),
      );
    }
    yield r'collectedBy';
    yield serializers.serialize(
      object.collectedBy,
      specifiedType: const FullType(JsonObject),
    );
    if (object.location != null) {
      yield r'location';
      yield serializers.serialize(
        object.location,
        specifiedType: const FullType(String),
      );
    }
    if (object.sampleStatus != null) {
      yield r'sampleStatus';
      yield serializers.serialize(
        object.sampleStatus,
        specifiedType: const FullType(CreateSampleOnVisitDtoSampleStatusEnum),
      );
    }
    if (object.testedBy != null) {
      yield r'testedBy';
      yield serializers.serialize(
        object.testedBy,
        specifiedType: const FullType(String),
      );
    }
    if (object.comment != null) {
      yield r'comment';
      yield serializers.serialize(
        object.comment,
        specifiedType: const FullType(String),
      );
    }
    yield r'sampleType';
    yield serializers.serialize(
      object.sampleType,
      specifiedType: const FullType(JsonObject),
    );
    if (object.species != null) {
      yield r'species';
      yield serializers.serialize(
        object.species,
        specifiedType: const FullType(JsonObject),
      );
    }
    if (object.details != null) {
      yield r'details';
      yield serializers.serialize(
        object.details,
        specifiedType: const FullType(JsonObject),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    CreateSampleOnVisitDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required CreateSampleOnVisitDtoBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'quantity':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
          result.quantity = valueDes;
          break;
        case r'replicates':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(CreateSampleOnVisitDtoReplicatesEnum),
          ) as CreateSampleOnVisitDtoReplicatesEnum;
          result.replicates = valueDes;
          break;
        case r'unit':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.unit = valueDes;
          break;
        case r'photos':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(BuiltList, [FullType(String)]),
          ) as BuiltList<String>?;
          if (valueDes == null) continue;
          result.photos.replace(valueDes);
          break;
        case r'barcode':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.barcode = valueDes;
          break;
        case r'originalSampleBarcode':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.originalSampleBarcode = valueDes;
          break;
        case r'diseases':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(JsonObject)]),
          ) as BuiltList<JsonObject>;
          result.diseases.replace(valueDes);
          break;
        case r'testDate':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(DateTime),
          ) as DateTime?;
          if (valueDes == null) continue;
          result.testDate = valueDes;
          break;
        case r'collectedBy':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(JsonObject),
          ) as JsonObject;
          result.collectedBy = valueDes;
          break;
        case r'location':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.location = valueDes;
          break;
        case r'sampleStatus':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(CreateSampleOnVisitDtoSampleStatusEnum),
          ) as CreateSampleOnVisitDtoSampleStatusEnum?;
          if (valueDes == null) continue;
          result.sampleStatus = valueDes;
          break;
        case r'testedBy':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.testedBy = valueDes;
          break;
        case r'comment':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.comment = valueDes;
          break;
        case r'sampleType':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(JsonObject),
          ) as JsonObject;
          result.sampleType = valueDes;
          break;
        case r'species':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(JsonObject),
          ) as JsonObject?;
          if (valueDes == null) continue;
          result.species = valueDes;
          break;
        case r'details':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(JsonObject),
          ) as JsonObject?;
          if (valueDes == null) continue;
          result.details = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  CreateSampleOnVisitDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = CreateSampleOnVisitDtoBuilder();
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


/// Replicates
class CreateSampleOnVisitDtoReplicatesEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'available')
  static const CreateSampleOnVisitDtoReplicatesEnum available = _$createSampleOnVisitDtoReplicatesEnum_available;
  @BuiltValueEnumConst(wireName: r'not collected')
  static const CreateSampleOnVisitDtoReplicatesEnum notCollected = _$createSampleOnVisitDtoReplicatesEnum_notCollected;
  @BuiltValueEnumConst(wireName: r'unknown_default_open_api', fallback: true)
  static const CreateSampleOnVisitDtoReplicatesEnum unknownDefaultOpenApi = _$createSampleOnVisitDtoReplicatesEnum_unknownDefaultOpenApi;

  static Serializer<CreateSampleOnVisitDtoReplicatesEnum> get serializer => _$createSampleOnVisitDtoReplicatesEnumSerializer;

  const CreateSampleOnVisitDtoReplicatesEnum._(String name): super(name);

  static BuiltSet<CreateSampleOnVisitDtoReplicatesEnum> get values => _$createSampleOnVisitDtoReplicatesEnumValues;
  static CreateSampleOnVisitDtoReplicatesEnum valueOf(String name) => _$createSampleOnVisitDtoReplicatesEnumValueOf(name);
}

/// enum [positive, negative, unclear]
class CreateSampleOnVisitDtoSampleStatusEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'pending')
  static const CreateSampleOnVisitDtoSampleStatusEnum pending = _$createSampleOnVisitDtoSampleStatusEnum_pending;
  @BuiltValueEnumConst(wireName: r'picked-up')
  static const CreateSampleOnVisitDtoSampleStatusEnum pickedUp = _$createSampleOnVisitDtoSampleStatusEnum_pickedUp;
  @BuiltValueEnumConst(wireName: r'received')
  static const CreateSampleOnVisitDtoSampleStatusEnum received = _$createSampleOnVisitDtoSampleStatusEnum_received;
  @BuiltValueEnumConst(wireName: r'pre-processed')
  static const CreateSampleOnVisitDtoSampleStatusEnum preProcessed = _$createSampleOnVisitDtoSampleStatusEnum_preProcessed;
  @BuiltValueEnumConst(wireName: r'virus-isolation')
  static const CreateSampleOnVisitDtoSampleStatusEnum virusIsolation = _$createSampleOnVisitDtoSampleStatusEnum_virusIsolation;
  @BuiltValueEnumConst(wireName: r'extracted')
  static const CreateSampleOnVisitDtoSampleStatusEnum extracted = _$createSampleOnVisitDtoSampleStatusEnum_extracted;
  @BuiltValueEnumConst(wireName: r'tested')
  static const CreateSampleOnVisitDtoSampleStatusEnum tested = _$createSampleOnVisitDtoSampleStatusEnum_tested;
  @BuiltValueEnumConst(wireName: r'rejected')
  static const CreateSampleOnVisitDtoSampleStatusEnum rejected = _$createSampleOnVisitDtoSampleStatusEnum_rejected;
  @BuiltValueEnumConst(wireName: r'test-report-generated')
  static const CreateSampleOnVisitDtoSampleStatusEnum testReportGenerated = _$createSampleOnVisitDtoSampleStatusEnum_testReportGenerated;
  @BuiltValueEnumConst(wireName: r'unknown_default_open_api', fallback: true)
  static const CreateSampleOnVisitDtoSampleStatusEnum unknownDefaultOpenApi = _$createSampleOnVisitDtoSampleStatusEnum_unknownDefaultOpenApi;

  static Serializer<CreateSampleOnVisitDtoSampleStatusEnum> get serializer => _$createSampleOnVisitDtoSampleStatusEnumSerializer;

  const CreateSampleOnVisitDtoSampleStatusEnum._(String name): super(name);

  static BuiltSet<CreateSampleOnVisitDtoSampleStatusEnum> get values => _$createSampleOnVisitDtoSampleStatusEnumValues;
  static CreateSampleOnVisitDtoSampleStatusEnum valueOf(String name) => _$createSampleOnVisitDtoSampleStatusEnumValueOf(name);
}

