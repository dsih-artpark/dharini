//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'update_team_dto.g.dart';

/// UpdateTeamDto
///
/// Properties:
/// * [teamName] - Name of the team
/// * [address] - Address of the lab
/// * [logo] - Logo of the lab
@BuiltValue()
abstract class UpdateTeamDto implements Built<UpdateTeamDto, UpdateTeamDtoBuilder> {
  /// Name of the team
  @BuiltValueField(wireName: r'teamName')
  String? get teamName;

  /// Address of the lab
  @BuiltValueField(wireName: r'address')
  String? get address;

  /// Logo of the lab
  @BuiltValueField(wireName: r'logo')
  String? get logo;

  UpdateTeamDto._();

  factory UpdateTeamDto([void updates(UpdateTeamDtoBuilder b)]) = _$UpdateTeamDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(UpdateTeamDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<UpdateTeamDto> get serializer => _$UpdateTeamDtoSerializer();
}

class _$UpdateTeamDtoSerializer implements PrimitiveSerializer<UpdateTeamDto> {
  @override
  final Iterable<Type> types = const [UpdateTeamDto, _$UpdateTeamDto];

  @override
  final String wireName = r'UpdateTeamDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    UpdateTeamDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.teamName != null) {
      yield r'teamName';
      yield serializers.serialize(
        object.teamName,
        specifiedType: const FullType(String),
      );
    }
    if (object.address != null) {
      yield r'address';
      yield serializers.serialize(
        object.address,
        specifiedType: const FullType(String),
      );
    }
    if (object.logo != null) {
      yield r'logo';
      yield serializers.serialize(
        object.logo,
        specifiedType: const FullType(String),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    UpdateTeamDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required UpdateTeamDtoBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'teamName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.teamName = valueDes;
          break;
        case r'address':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.address = valueDes;
          break;
        case r'logo':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.logo = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  UpdateTeamDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = UpdateTeamDtoBuilder();
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


