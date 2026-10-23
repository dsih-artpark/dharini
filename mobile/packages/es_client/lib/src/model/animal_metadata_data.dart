//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:es_client/src/model/animal_metadata_species.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'animal_metadata_data.g.dart';

/// AnimalMetadataData
///
/// Properties:
/// * [id] 
/// * [animalTagId] 
/// * [birdId] 
/// * [species] 
/// * [breed] 
/// * [ageYears] 
/// * [ageMonths] 
/// * [gender] 
/// * [vaccinationStage] 
/// * [diseaseHistory] 
/// * [averageMilkProductionPerDayWithinOneYear] 
/// * [averageMilkProductionPerDayBeforeOneYear] 
/// * [feverObserved] 
/// * [firstNoticedDate] 
/// * [vectors] 
/// * [dropInFeedIntake] 
/// * [dropInWaterIntake] 
/// * [dropInEggProduction] 
/// * [createdAt] 
@BuiltValue()
abstract class AnimalMetadataData implements Built<AnimalMetadataData, AnimalMetadataDataBuilder> {
  @BuiltValueField(wireName: r'id')
  String get id;

  @BuiltValueField(wireName: r'animalTagId')
  String? get animalTagId;

  @BuiltValueField(wireName: r'birdId')
  String? get birdId;

  @BuiltValueField(wireName: r'species')
  AnimalMetadataSpecies? get species;

  @BuiltValueField(wireName: r'breed')
  String? get breed;

  @BuiltValueField(wireName: r'ageYears')
  num? get ageYears;

  @BuiltValueField(wireName: r'ageMonths')
  num? get ageMonths;

  @BuiltValueField(wireName: r'gender')
  String? get gender;

  @BuiltValueField(wireName: r'vaccinationStage')
  String? get vaccinationStage;

  @BuiltValueField(wireName: r'diseaseHistory')
  BuiltList<String>? get diseaseHistory;

  @BuiltValueField(wireName: r'averageMilkProductionPerDayWithinOneYear')
  num? get averageMilkProductionPerDayWithinOneYear;

  @BuiltValueField(wireName: r'averageMilkProductionPerDayBeforeOneYear')
  num? get averageMilkProductionPerDayBeforeOneYear;

  @BuiltValueField(wireName: r'feverObserved')
  bool get feverObserved;

  @BuiltValueField(wireName: r'firstNoticedDate')
  DateTime? get firstNoticedDate;

  @BuiltValueField(wireName: r'vectors')
  BuiltList<String>? get vectors;

  @BuiltValueField(wireName: r'dropInFeedIntake')
  bool get dropInFeedIntake;

  @BuiltValueField(wireName: r'dropInWaterIntake')
  bool get dropInWaterIntake;

  @BuiltValueField(wireName: r'dropInEggProduction')
  bool get dropInEggProduction;

  @BuiltValueField(wireName: r'createdAt')
  DateTime get createdAt;

  AnimalMetadataData._();

  factory AnimalMetadataData([void updates(AnimalMetadataDataBuilder b)]) = _$AnimalMetadataData;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(AnimalMetadataDataBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<AnimalMetadataData> get serializer => _$AnimalMetadataDataSerializer();
}

class _$AnimalMetadataDataSerializer implements PrimitiveSerializer<AnimalMetadataData> {
  @override
  final Iterable<Type> types = const [AnimalMetadataData, _$AnimalMetadataData];

  @override
  final String wireName = r'AnimalMetadataData';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    AnimalMetadataData object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(String),
    );
    if (object.animalTagId != null) {
      yield r'animalTagId';
      yield serializers.serialize(
        object.animalTagId,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.birdId != null) {
      yield r'birdId';
      yield serializers.serialize(
        object.birdId,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.species != null) {
      yield r'species';
      yield serializers.serialize(
        object.species,
        specifiedType: const FullType.nullable(AnimalMetadataSpecies),
      );
    }
    if (object.breed != null) {
      yield r'breed';
      yield serializers.serialize(
        object.breed,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.ageYears != null) {
      yield r'ageYears';
      yield serializers.serialize(
        object.ageYears,
        specifiedType: const FullType.nullable(num),
      );
    }
    if (object.ageMonths != null) {
      yield r'ageMonths';
      yield serializers.serialize(
        object.ageMonths,
        specifiedType: const FullType.nullable(num),
      );
    }
    if (object.gender != null) {
      yield r'gender';
      yield serializers.serialize(
        object.gender,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.vaccinationStage != null) {
      yield r'vaccinationStage';
      yield serializers.serialize(
        object.vaccinationStage,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.diseaseHistory != null) {
      yield r'diseaseHistory';
      yield serializers.serialize(
        object.diseaseHistory,
        specifiedType: const FullType.nullable(BuiltList, [FullType(String)]),
      );
    }
    if (object.averageMilkProductionPerDayWithinOneYear != null) {
      yield r'averageMilkProductionPerDayWithinOneYear';
      yield serializers.serialize(
        object.averageMilkProductionPerDayWithinOneYear,
        specifiedType: const FullType.nullable(num),
      );
    }
    if (object.averageMilkProductionPerDayBeforeOneYear != null) {
      yield r'averageMilkProductionPerDayBeforeOneYear';
      yield serializers.serialize(
        object.averageMilkProductionPerDayBeforeOneYear,
        specifiedType: const FullType.nullable(num),
      );
    }
    yield r'feverObserved';
    yield serializers.serialize(
      object.feverObserved,
      specifiedType: const FullType(bool),
    );
    if (object.firstNoticedDate != null) {
      yield r'firstNoticedDate';
      yield serializers.serialize(
        object.firstNoticedDate,
        specifiedType: const FullType.nullable(DateTime),
      );
    }
    if (object.vectors != null) {
      yield r'vectors';
      yield serializers.serialize(
        object.vectors,
        specifiedType: const FullType.nullable(BuiltList, [FullType(String)]),
      );
    }
    yield r'dropInFeedIntake';
    yield serializers.serialize(
      object.dropInFeedIntake,
      specifiedType: const FullType(bool),
    );
    yield r'dropInWaterIntake';
    yield serializers.serialize(
      object.dropInWaterIntake,
      specifiedType: const FullType(bool),
    );
    yield r'dropInEggProduction';
    yield serializers.serialize(
      object.dropInEggProduction,
      specifiedType: const FullType(bool),
    );
    yield r'createdAt';
    yield serializers.serialize(
      object.createdAt,
      specifiedType: const FullType(DateTime),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    AnimalMetadataData object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required AnimalMetadataDataBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'id':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.id = valueDes;
          break;
        case r'animalTagId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.animalTagId = valueDes;
          break;
        case r'birdId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.birdId = valueDes;
          break;
        case r'species':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(AnimalMetadataSpecies),
          ) as AnimalMetadataSpecies?;
          if (valueDes == null) continue;
          result.species.replace(valueDes);
          break;
        case r'breed':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.breed = valueDes;
          break;
        case r'ageYears':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
          result.ageYears = valueDes;
          break;
        case r'ageMonths':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
          result.ageMonths = valueDes;
          break;
        case r'gender':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.gender = valueDes;
          break;
        case r'vaccinationStage':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.vaccinationStage = valueDes;
          break;
        case r'diseaseHistory':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(BuiltList, [FullType(String)]),
          ) as BuiltList<String>?;
          if (valueDes == null) continue;
          result.diseaseHistory.replace(valueDes);
          break;
        case r'averageMilkProductionPerDayWithinOneYear':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
          result.averageMilkProductionPerDayWithinOneYear = valueDes;
          break;
        case r'averageMilkProductionPerDayBeforeOneYear':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
          result.averageMilkProductionPerDayBeforeOneYear = valueDes;
          break;
        case r'feverObserved':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.feverObserved = valueDes;
          break;
        case r'firstNoticedDate':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(DateTime),
          ) as DateTime?;
          if (valueDes == null) continue;
          result.firstNoticedDate = valueDes;
          break;
        case r'vectors':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(BuiltList, [FullType(String)]),
          ) as BuiltList<String>?;
          if (valueDes == null) continue;
          result.vectors.replace(valueDes);
          break;
        case r'dropInFeedIntake':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.dropInFeedIntake = valueDes;
          break;
        case r'dropInWaterIntake':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.dropInWaterIntake = valueDes;
          break;
        case r'dropInEggProduction':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.dropInEggProduction = valueDes;
          break;
        case r'createdAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.createdAt = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  AnimalMetadataData deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = AnimalMetadataDataBuilder();
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


