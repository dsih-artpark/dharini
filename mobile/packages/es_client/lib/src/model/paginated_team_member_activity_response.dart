//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:es_client/src/model/team_member_activity_response_data.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'paginated_team_member_activity_response.g.dart';

/// PaginatedTeamMemberActivityResponse
///
/// Properties:
/// * [success] 
/// * [message] 
/// * [data] 
/// * [total] 
/// * [page] 
/// * [limit] 
/// * [totalPages] 
@BuiltValue()
abstract class PaginatedTeamMemberActivityResponse implements Built<PaginatedTeamMemberActivityResponse, PaginatedTeamMemberActivityResponseBuilder> {
  @BuiltValueField(wireName: r'success')
  bool get success;

  @BuiltValueField(wireName: r'message')
  String get message;

  @BuiltValueField(wireName: r'data')
  BuiltList<TeamMemberActivityResponseData> get data;

  @BuiltValueField(wireName: r'total')
  num? get total;

  @BuiltValueField(wireName: r'page')
  num? get page;

  @BuiltValueField(wireName: r'limit')
  num? get limit;

  @BuiltValueField(wireName: r'totalPages')
  num? get totalPages;

  PaginatedTeamMemberActivityResponse._();

  factory PaginatedTeamMemberActivityResponse([void updates(PaginatedTeamMemberActivityResponseBuilder b)]) = _$PaginatedTeamMemberActivityResponse;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(PaginatedTeamMemberActivityResponseBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<PaginatedTeamMemberActivityResponse> get serializer => _$PaginatedTeamMemberActivityResponseSerializer();
}

class _$PaginatedTeamMemberActivityResponseSerializer implements PrimitiveSerializer<PaginatedTeamMemberActivityResponse> {
  @override
  final Iterable<Type> types = const [PaginatedTeamMemberActivityResponse, _$PaginatedTeamMemberActivityResponse];

  @override
  final String wireName = r'PaginatedTeamMemberActivityResponse';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    PaginatedTeamMemberActivityResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'success';
    yield serializers.serialize(
      object.success,
      specifiedType: const FullType(bool),
    );
    yield r'message';
    yield serializers.serialize(
      object.message,
      specifiedType: const FullType(String),
    );
    yield r'data';
    yield serializers.serialize(
      object.data,
      specifiedType: const FullType(BuiltList, [FullType(TeamMemberActivityResponseData)]),
    );
    if (object.total != null) {
      yield r'total';
      yield serializers.serialize(
        object.total,
        specifiedType: const FullType(num),
      );
    }
    if (object.page != null) {
      yield r'page';
      yield serializers.serialize(
        object.page,
        specifiedType: const FullType(num),
      );
    }
    if (object.limit != null) {
      yield r'limit';
      yield serializers.serialize(
        object.limit,
        specifiedType: const FullType(num),
      );
    }
    if (object.totalPages != null) {
      yield r'totalPages';
      yield serializers.serialize(
        object.totalPages,
        specifiedType: const FullType(num),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    PaginatedTeamMemberActivityResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required PaginatedTeamMemberActivityResponseBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'success':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.success = valueDes;
          break;
        case r'message':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.message = valueDes;
          break;
        case r'data':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(TeamMemberActivityResponseData)]),
          ) as BuiltList<TeamMemberActivityResponseData>;
          result.data.replace(valueDes);
          break;
        case r'total':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
          result.total = valueDes;
          break;
        case r'page':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
          result.page = valueDes;
          break;
        case r'limit':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
          result.limit = valueDes;
          break;
        case r'totalPages':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
          result.totalPages = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  PaginatedTeamMemberActivityResponse deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = PaginatedTeamMemberActivityResponseBuilder();
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


