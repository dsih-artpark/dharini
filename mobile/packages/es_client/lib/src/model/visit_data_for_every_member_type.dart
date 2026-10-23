//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'visit_data_for_every_member_type.g.dart';

/// VisitDataForEveryMemberType
///
/// Properties:
/// * [siteName] 
/// * [siteAddress] 
/// * [siteState] 
/// * [siteDistrict] 
/// * [visitScheduledAt] 
/// * [visitStatus] 
@BuiltValue()
abstract class VisitDataForEveryMemberType implements Built<VisitDataForEveryMemberType, VisitDataForEveryMemberTypeBuilder> {
  @BuiltValueField(wireName: r'siteName')
  String get siteName;

  @BuiltValueField(wireName: r'siteAddress')
  String get siteAddress;

  @BuiltValueField(wireName: r'siteState')
  String get siteState;

  @BuiltValueField(wireName: r'siteDistrict')
  String get siteDistrict;

  @BuiltValueField(wireName: r'visitScheduledAt')
  DateTime get visitScheduledAt;

  @BuiltValueField(wireName: r'visitStatus')
  VisitDataForEveryMemberTypeVisitStatusEnum get visitStatus;
  // enum visitStatusEnum {  upcoming,  overdue,  skipped,  completed,  };

  VisitDataForEveryMemberType._();

  factory VisitDataForEveryMemberType([void updates(VisitDataForEveryMemberTypeBuilder b)]) = _$VisitDataForEveryMemberType;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(VisitDataForEveryMemberTypeBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<VisitDataForEveryMemberType> get serializer => _$VisitDataForEveryMemberTypeSerializer();
}

class _$VisitDataForEveryMemberTypeSerializer implements PrimitiveSerializer<VisitDataForEveryMemberType> {
  @override
  final Iterable<Type> types = const [VisitDataForEveryMemberType, _$VisitDataForEveryMemberType];

  @override
  final String wireName = r'VisitDataForEveryMemberType';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    VisitDataForEveryMemberType object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'siteName';
    yield serializers.serialize(
      object.siteName,
      specifiedType: const FullType(String),
    );
    yield r'siteAddress';
    yield serializers.serialize(
      object.siteAddress,
      specifiedType: const FullType(String),
    );
    yield r'siteState';
    yield serializers.serialize(
      object.siteState,
      specifiedType: const FullType(String),
    );
    yield r'siteDistrict';
    yield serializers.serialize(
      object.siteDistrict,
      specifiedType: const FullType(String),
    );
    yield r'visitScheduledAt';
    yield serializers.serialize(
      object.visitScheduledAt,
      specifiedType: const FullType(DateTime),
    );
    yield r'visitStatus';
    yield serializers.serialize(
      object.visitStatus,
      specifiedType: const FullType(VisitDataForEveryMemberTypeVisitStatusEnum),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    VisitDataForEveryMemberType object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required VisitDataForEveryMemberTypeBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'siteName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.siteName = valueDes;
          break;
        case r'siteAddress':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.siteAddress = valueDes;
          break;
        case r'siteState':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.siteState = valueDes;
          break;
        case r'siteDistrict':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.siteDistrict = valueDes;
          break;
        case r'visitScheduledAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.visitScheduledAt = valueDes;
          break;
        case r'visitStatus':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(VisitDataForEveryMemberTypeVisitStatusEnum),
          ) as VisitDataForEveryMemberTypeVisitStatusEnum;
          result.visitStatus = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  VisitDataForEveryMemberType deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = VisitDataForEveryMemberTypeBuilder();
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


class VisitDataForEveryMemberTypeVisitStatusEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'upcoming')
  static const VisitDataForEveryMemberTypeVisitStatusEnum upcoming = _$visitDataForEveryMemberTypeVisitStatusEnum_upcoming;
  @BuiltValueEnumConst(wireName: r'overdue')
  static const VisitDataForEveryMemberTypeVisitStatusEnum overdue = _$visitDataForEveryMemberTypeVisitStatusEnum_overdue;
  @BuiltValueEnumConst(wireName: r'skipped')
  static const VisitDataForEveryMemberTypeVisitStatusEnum skipped = _$visitDataForEveryMemberTypeVisitStatusEnum_skipped;
  @BuiltValueEnumConst(wireName: r'completed')
  static const VisitDataForEveryMemberTypeVisitStatusEnum completed = _$visitDataForEveryMemberTypeVisitStatusEnum_completed;
  @BuiltValueEnumConst(wireName: r'unknown_default_open_api', fallback: true)
  static const VisitDataForEveryMemberTypeVisitStatusEnum unknownDefaultOpenApi = _$visitDataForEveryMemberTypeVisitStatusEnum_unknownDefaultOpenApi;

  static Serializer<VisitDataForEveryMemberTypeVisitStatusEnum> get serializer => _$visitDataForEveryMemberTypeVisitStatusEnumSerializer;

  const VisitDataForEveryMemberTypeVisitStatusEnum._(String name): super(name);

  static BuiltSet<VisitDataForEveryMemberTypeVisitStatusEnum> get values => _$visitDataForEveryMemberTypeVisitStatusEnumValues;
  static VisitDataForEveryMemberTypeVisitStatusEnum valueOf(String name) => _$visitDataForEveryMemberTypeVisitStatusEnumValueOf(name);
}

