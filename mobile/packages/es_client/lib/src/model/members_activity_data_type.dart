//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:es_client/src/model/visit_data_for_every_member_type.dart';
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'members_activity_data_type.g.dart';

/// MembersActivityDataType
///
/// Properties:
/// * [visits] 
/// * [totalNumberOfVisitsAssigned] 
/// * [collector] 
/// * [id] 
/// * [totalNumberOfVisitsPending] 
/// * [totalNumberOfVisitsOverDue] 
@BuiltValue()
abstract class MembersActivityDataType implements Built<MembersActivityDataType, MembersActivityDataTypeBuilder> {
  @BuiltValueField(wireName: r'visits')
  BuiltList<VisitDataForEveryMemberType> get visits;

  @BuiltValueField(wireName: r'totalNumberOfVisitsAssigned')
  num get totalNumberOfVisitsAssigned;

  @BuiltValueField(wireName: r'collector')
  String get collector;

  @BuiltValueField(wireName: r'id')
  String get id;

  @BuiltValueField(wireName: r'totalNumberOfVisitsPending')
  num get totalNumberOfVisitsPending;

  @BuiltValueField(wireName: r'totalNumberOfVisitsOverDue')
  num get totalNumberOfVisitsOverDue;

  MembersActivityDataType._();

  factory MembersActivityDataType([void updates(MembersActivityDataTypeBuilder b)]) = _$MembersActivityDataType;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(MembersActivityDataTypeBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<MembersActivityDataType> get serializer => _$MembersActivityDataTypeSerializer();
}

class _$MembersActivityDataTypeSerializer implements PrimitiveSerializer<MembersActivityDataType> {
  @override
  final Iterable<Type> types = const [MembersActivityDataType, _$MembersActivityDataType];

  @override
  final String wireName = r'MembersActivityDataType';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    MembersActivityDataType object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'visits';
    yield serializers.serialize(
      object.visits,
      specifiedType: const FullType(BuiltList, [FullType(VisitDataForEveryMemberType)]),
    );
    yield r'totalNumberOfVisitsAssigned';
    yield serializers.serialize(
      object.totalNumberOfVisitsAssigned,
      specifiedType: const FullType(num),
    );
    yield r'collector';
    yield serializers.serialize(
      object.collector,
      specifiedType: const FullType(String),
    );
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(String),
    );
    yield r'totalNumberOfVisitsPending';
    yield serializers.serialize(
      object.totalNumberOfVisitsPending,
      specifiedType: const FullType(num),
    );
    yield r'totalNumberOfVisitsOverDue';
    yield serializers.serialize(
      object.totalNumberOfVisitsOverDue,
      specifiedType: const FullType(num),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    MembersActivityDataType object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required MembersActivityDataTypeBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'visits':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(VisitDataForEveryMemberType)]),
          ) as BuiltList<VisitDataForEveryMemberType>;
          result.visits.replace(valueDes);
          break;
        case r'totalNumberOfVisitsAssigned':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.totalNumberOfVisitsAssigned = valueDes;
          break;
        case r'collector':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.collector = valueDes;
          break;
        case r'id':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.id = valueDes;
          break;
        case r'totalNumberOfVisitsPending':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.totalNumberOfVisitsPending = valueDes;
          break;
        case r'totalNumberOfVisitsOverDue':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.totalNumberOfVisitsOverDue = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  MembersActivityDataType deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = MembersActivityDataTypeBuilder();
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


