//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:es_client/src/model/member_dto.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'create_members_list_dto.g.dart';

/// CreateMembersListDto
///
/// Properties:
/// * [project] - Project id
/// * [teamId] - Team id
/// * [members] - Members data in list
@BuiltValue()
abstract class CreateMembersListDto implements Built<CreateMembersListDto, CreateMembersListDtoBuilder> {
  /// Project id
  @BuiltValueField(wireName: r'project')
  String get project;

  /// Team id
  @BuiltValueField(wireName: r'teamId')
  String get teamId;

  /// Members data in list
  @BuiltValueField(wireName: r'members')
  BuiltList<MemberDto> get members;

  CreateMembersListDto._();

  factory CreateMembersListDto([void updates(CreateMembersListDtoBuilder b)]) = _$CreateMembersListDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(CreateMembersListDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<CreateMembersListDto> get serializer => _$CreateMembersListDtoSerializer();
}

class _$CreateMembersListDtoSerializer implements PrimitiveSerializer<CreateMembersListDto> {
  @override
  final Iterable<Type> types = const [CreateMembersListDto, _$CreateMembersListDto];

  @override
  final String wireName = r'CreateMembersListDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    CreateMembersListDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'project';
    yield serializers.serialize(
      object.project,
      specifiedType: const FullType(String),
    );
    yield r'teamId';
    yield serializers.serialize(
      object.teamId,
      specifiedType: const FullType(String),
    );
    yield r'members';
    yield serializers.serialize(
      object.members,
      specifiedType: const FullType(BuiltList, [FullType(MemberDto)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    CreateMembersListDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required CreateMembersListDtoBuilder result,
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
        case r'teamId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.teamId = valueDes;
          break;
        case r'members':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(MemberDto)]),
          ) as BuiltList<MemberDto>;
          result.members.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  CreateMembersListDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = CreateMembersListDtoBuilder();
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


