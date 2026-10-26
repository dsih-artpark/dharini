//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/json_object.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'invite_partner_dto.g.dart';

/// InvitePartnerDto
///
/// Properties:
/// * [individualContractors] - Contractors
/// * [collectors] - Collectors
/// * [projectId] 
/// * [invitedBy] 
@BuiltValue()
abstract class InvitePartnerDto implements Built<InvitePartnerDto, InvitePartnerDtoBuilder> {
  /// Contractors
  @BuiltValueField(wireName: r'individualContractors')
  BuiltList<String>? get individualContractors;

  /// Collectors
  @BuiltValueField(wireName: r'collectors')
  BuiltList<String>? get collectors;

  @BuiltValueField(wireName: r'projectId')
  JsonObject? get projectId;

  @BuiltValueField(wireName: r'invitedBy')
  JsonObject? get invitedBy;

  InvitePartnerDto._();

  factory InvitePartnerDto([void updates(InvitePartnerDtoBuilder b)]) = _$InvitePartnerDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(InvitePartnerDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<InvitePartnerDto> get serializer => _$InvitePartnerDtoSerializer();
}

class _$InvitePartnerDtoSerializer implements PrimitiveSerializer<InvitePartnerDto> {
  @override
  final Iterable<Type> types = const [InvitePartnerDto, _$InvitePartnerDto];

  @override
  final String wireName = r'InvitePartnerDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    InvitePartnerDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.individualContractors != null) {
      yield r'individualContractors';
      yield serializers.serialize(
        object.individualContractors,
        specifiedType: const FullType(BuiltList, [FullType(String)]),
      );
    }
    if (object.collectors != null) {
      yield r'collectors';
      yield serializers.serialize(
        object.collectors,
        specifiedType: const FullType(BuiltList, [FullType(String)]),
      );
    }
    if (object.projectId != null) {
      yield r'projectId';
      yield serializers.serialize(
        object.projectId,
        specifiedType: const FullType(JsonObject),
      );
    }
    if (object.invitedBy != null) {
      yield r'invitedBy';
      yield serializers.serialize(
        object.invitedBy,
        specifiedType: const FullType(JsonObject),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    InvitePartnerDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required InvitePartnerDtoBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'individualContractors':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(BuiltList, [FullType(String)]),
          ) as BuiltList<String>?;
          if (valueDes == null) continue;
          result.individualContractors.replace(valueDes);
          break;
        case r'collectors':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(BuiltList, [FullType(String)]),
          ) as BuiltList<String>?;
          if (valueDes == null) continue;
          result.collectors.replace(valueDes);
          break;
        case r'projectId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(JsonObject),
          ) as JsonObject?;
          if (valueDes == null) continue;
          result.projectId = valueDes;
          break;
        case r'invitedBy':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(JsonObject),
          ) as JsonObject?;
          if (valueDes == null) continue;
          result.invitedBy = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  InvitePartnerDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = InvitePartnerDtoBuilder();
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


