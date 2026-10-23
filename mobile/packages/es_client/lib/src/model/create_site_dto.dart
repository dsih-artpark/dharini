//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:es_client/src/model/day_of_week.dart';
import 'package:es_client/src/model/site_type.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'create_site_dto.g.dart';

/// CreateSiteDto
///
/// Properties:
/// * [collectionDayOfWeek] 
/// * [collectionStartDate] - The date when collection visits should start
/// * [farmType] - Type of farm/site based on the disease (e.g. Poultry Farm, Wetland, Cattle Farm)
/// * [siteSubType] - Sub-type of the farm/site (e.g. Broiler, Breeder, Layer, Backyard)
/// * [siteType] 
/// * [photos] - file path
/// * [regionId] - ID of the region
/// * [latitude] - latitude
/// * [longitude] - longitude
/// * [collectionCollector] - collectionCollector id
/// * [collectionConsent] - Site owner's collection consent: 'true' or 'false'
/// * [diseaseIds] - IDs of diseases to associate with this site (subset of project diseases)
/// * [name] 
/// * [siteCode] 
/// * [collectionFrequencyInterval] 
/// * [collectionFrequency] 
/// * [collectionTime] 
/// * [collectionDuration] 
/// * [siteOwnerName] 
/// * [siteOwnerNumber] 
/// * [workerNumber] 
/// * [address] 
/// * [pinCode] 
/// * [comment] 
/// * [block] 
/// * [village] 
@BuiltValue()
abstract class CreateSiteDto implements Built<CreateSiteDto, CreateSiteDtoBuilder> {
  @BuiltValueField(wireName: r'collectionDayOfWeek')
  BuiltList<DayOfWeek>? get collectionDayOfWeek;

  /// The date when collection visits should start
  @BuiltValueField(wireName: r'collectionStartDate')
  DateTime? get collectionStartDate;

  /// Type of farm/site based on the disease (e.g. Poultry Farm, Wetland, Cattle Farm)
  @BuiltValueField(wireName: r'farmType')
  String? get farmType;

  /// Sub-type of the farm/site (e.g. Broiler, Breeder, Layer, Backyard)
  @BuiltValueField(wireName: r'siteSubType')
  String? get siteSubType;

  @BuiltValueField(wireName: r'siteType')
  SiteType? get siteType;
  // enum siteTypeEnum {  private,  government,  corporate,  };

  /// file path
  @BuiltValueField(wireName: r'photos')
  BuiltList<String> get photos;

  /// ID of the region
  @BuiltValueField(wireName: r'regionId')
  String get regionId;

  /// latitude
  @BuiltValueField(wireName: r'latitude')
  num get latitude;

  /// longitude
  @BuiltValueField(wireName: r'longitude')
  num get longitude;

  /// collectionCollector id
  @BuiltValueField(wireName: r'collectionCollector')
  String get collectionCollector;

  /// Site owner's collection consent: 'true' or 'false'
  @BuiltValueField(wireName: r'collectionConsent')
  String? get collectionConsent;

  /// IDs of diseases to associate with this site (subset of project diseases)
  @BuiltValueField(wireName: r'diseaseIds')
  BuiltList<String>? get diseaseIds;

  @BuiltValueField(wireName: r'name')
  String get name;

  @BuiltValueField(wireName: r'siteCode')
  String? get siteCode;

  @BuiltValueField(wireName: r'collectionFrequencyInterval')
  num? get collectionFrequencyInterval;

  @BuiltValueField(wireName: r'collectionFrequency')
  num? get collectionFrequency;

  @BuiltValueField(wireName: r'collectionTime')
  String? get collectionTime;

  @BuiltValueField(wireName: r'collectionDuration')
  num? get collectionDuration;

  @BuiltValueField(wireName: r'siteOwnerName')
  String? get siteOwnerName;

  @BuiltValueField(wireName: r'siteOwnerNumber')
  String? get siteOwnerNumber;

  @BuiltValueField(wireName: r'workerNumber')
  num? get workerNumber;

  @BuiltValueField(wireName: r'address')
  String? get address;

  @BuiltValueField(wireName: r'pinCode')
  num? get pinCode;

  @BuiltValueField(wireName: r'comment')
  String? get comment;

  @BuiltValueField(wireName: r'block')
  String? get block;

  @BuiltValueField(wireName: r'village')
  String? get village;

  CreateSiteDto._();

  factory CreateSiteDto([void updates(CreateSiteDtoBuilder b)]) = _$CreateSiteDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(CreateSiteDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<CreateSiteDto> get serializer => _$CreateSiteDtoSerializer();
}

class _$CreateSiteDtoSerializer implements PrimitiveSerializer<CreateSiteDto> {
  @override
  final Iterable<Type> types = const [CreateSiteDto, _$CreateSiteDto];

  @override
  final String wireName = r'CreateSiteDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    CreateSiteDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.collectionDayOfWeek != null) {
      yield r'collectionDayOfWeek';
      yield serializers.serialize(
        object.collectionDayOfWeek,
        specifiedType: const FullType.nullable(BuiltList, [FullType(DayOfWeek)]),
      );
    }
    if (object.collectionStartDate != null) {
      yield r'collectionStartDate';
      yield serializers.serialize(
        object.collectionStartDate,
        specifiedType: const FullType.nullable(DateTime),
      );
    }
    if (object.farmType != null) {
      yield r'farmType';
      yield serializers.serialize(
        object.farmType,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.siteSubType != null) {
      yield r'siteSubType';
      yield serializers.serialize(
        object.siteSubType,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.siteType != null) {
      yield r'siteType';
      yield serializers.serialize(
        object.siteType,
        specifiedType: const FullType.nullable(SiteType),
      );
    }
    yield r'photos';
    yield serializers.serialize(
      object.photos,
      specifiedType: const FullType(BuiltList, [FullType(String)]),
    );
    yield r'regionId';
    yield serializers.serialize(
      object.regionId,
      specifiedType: const FullType(String),
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
    yield r'collectionCollector';
    yield serializers.serialize(
      object.collectionCollector,
      specifiedType: const FullType(String),
    );
    if (object.collectionConsent != null) {
      yield r'collectionConsent';
      yield serializers.serialize(
        object.collectionConsent,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.diseaseIds != null) {
      yield r'diseaseIds';
      yield serializers.serialize(
        object.diseaseIds,
        specifiedType: const FullType(BuiltList, [FullType(String)]),
      );
    }
    yield r'name';
    yield serializers.serialize(
      object.name,
      specifiedType: const FullType(String),
    );
    if (object.siteCode != null) {
      yield r'siteCode';
      yield serializers.serialize(
        object.siteCode,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.collectionFrequencyInterval != null) {
      yield r'collectionFrequencyInterval';
      yield serializers.serialize(
        object.collectionFrequencyInterval,
        specifiedType: const FullType.nullable(num),
      );
    }
    if (object.collectionFrequency != null) {
      yield r'collectionFrequency';
      yield serializers.serialize(
        object.collectionFrequency,
        specifiedType: const FullType.nullable(num),
      );
    }
    if (object.collectionTime != null) {
      yield r'collectionTime';
      yield serializers.serialize(
        object.collectionTime,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.collectionDuration != null) {
      yield r'collectionDuration';
      yield serializers.serialize(
        object.collectionDuration,
        specifiedType: const FullType.nullable(num),
      );
    }
    if (object.siteOwnerName != null) {
      yield r'siteOwnerName';
      yield serializers.serialize(
        object.siteOwnerName,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.siteOwnerNumber != null) {
      yield r'siteOwnerNumber';
      yield serializers.serialize(
        object.siteOwnerNumber,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.workerNumber != null) {
      yield r'workerNumber';
      yield serializers.serialize(
        object.workerNumber,
        specifiedType: const FullType.nullable(num),
      );
    }
    if (object.address != null) {
      yield r'address';
      yield serializers.serialize(
        object.address,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.pinCode != null) {
      yield r'pinCode';
      yield serializers.serialize(
        object.pinCode,
        specifiedType: const FullType.nullable(num),
      );
    }
    if (object.comment != null) {
      yield r'comment';
      yield serializers.serialize(
        object.comment,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.block != null) {
      yield r'block';
      yield serializers.serialize(
        object.block,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.village != null) {
      yield r'village';
      yield serializers.serialize(
        object.village,
        specifiedType: const FullType.nullable(String),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    CreateSiteDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required CreateSiteDtoBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'collectionDayOfWeek':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(BuiltList, [FullType(DayOfWeek)]),
          ) as BuiltList<DayOfWeek>?;
          if (valueDes == null) continue;
          result.collectionDayOfWeek.replace(valueDes);
          break;
        case r'collectionStartDate':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(DateTime),
          ) as DateTime?;
          if (valueDes == null) continue;
          result.collectionStartDate = valueDes;
          break;
        case r'farmType':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.farmType = valueDes;
          break;
        case r'siteSubType':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.siteSubType = valueDes;
          break;
        case r'siteType':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(SiteType),
          ) as SiteType?;
          if (valueDes == null) continue;
          result.siteType = valueDes;
          break;
        case r'photos':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(String)]),
          ) as BuiltList<String>;
          result.photos.replace(valueDes);
          break;
        case r'regionId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.regionId = valueDes;
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
        case r'collectionCollector':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.collectionCollector = valueDes;
          break;
        case r'collectionConsent':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.collectionConsent = valueDes;
          break;
        case r'diseaseIds':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(BuiltList, [FullType(String)]),
          ) as BuiltList<String>?;
          if (valueDes == null) continue;
          result.diseaseIds.replace(valueDes);
          break;
        case r'name':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.name = valueDes;
          break;
        case r'siteCode':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.siteCode = valueDes;
          break;
        case r'collectionFrequencyInterval':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
          result.collectionFrequencyInterval = valueDes;
          break;
        case r'collectionFrequency':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
          result.collectionFrequency = valueDes;
          break;
        case r'collectionTime':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.collectionTime = valueDes;
          break;
        case r'collectionDuration':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
          result.collectionDuration = valueDes;
          break;
        case r'siteOwnerName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.siteOwnerName = valueDes;
          break;
        case r'siteOwnerNumber':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.siteOwnerNumber = valueDes;
          break;
        case r'workerNumber':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
          result.workerNumber = valueDes;
          break;
        case r'address':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.address = valueDes;
          break;
        case r'pinCode':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
          result.pinCode = valueDes;
          break;
        case r'comment':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.comment = valueDes;
          break;
        case r'block':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.block = valueDes;
          break;
        case r'village':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.village = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  CreateSiteDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = CreateSiteDtoBuilder();
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


