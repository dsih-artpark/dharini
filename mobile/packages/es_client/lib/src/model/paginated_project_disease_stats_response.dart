//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:es_client/src/model/project_disease_stats_response_data.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'paginated_project_disease_stats_response.g.dart';

/// PaginatedProjectDiseaseStatsResponse
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
abstract class PaginatedProjectDiseaseStatsResponse implements Built<PaginatedProjectDiseaseStatsResponse, PaginatedProjectDiseaseStatsResponseBuilder> {
  @BuiltValueField(wireName: r'success')
  bool get success;

  @BuiltValueField(wireName: r'message')
  String get message;

  @BuiltValueField(wireName: r'data')
  BuiltList<ProjectDiseaseStatsResponseData> get data;

  @BuiltValueField(wireName: r'total')
  num? get total;

  @BuiltValueField(wireName: r'page')
  num? get page;

  @BuiltValueField(wireName: r'limit')
  num? get limit;

  @BuiltValueField(wireName: r'totalPages')
  num? get totalPages;

  PaginatedProjectDiseaseStatsResponse._();

  factory PaginatedProjectDiseaseStatsResponse([void updates(PaginatedProjectDiseaseStatsResponseBuilder b)]) = _$PaginatedProjectDiseaseStatsResponse;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(PaginatedProjectDiseaseStatsResponseBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<PaginatedProjectDiseaseStatsResponse> get serializer => _$PaginatedProjectDiseaseStatsResponseSerializer();
}

class _$PaginatedProjectDiseaseStatsResponseSerializer implements PrimitiveSerializer<PaginatedProjectDiseaseStatsResponse> {
  @override
  final Iterable<Type> types = const [PaginatedProjectDiseaseStatsResponse, _$PaginatedProjectDiseaseStatsResponse];

  @override
  final String wireName = r'PaginatedProjectDiseaseStatsResponse';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    PaginatedProjectDiseaseStatsResponse object, {
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
      specifiedType: const FullType(BuiltList, [FullType(ProjectDiseaseStatsResponseData)]),
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
    PaginatedProjectDiseaseStatsResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required PaginatedProjectDiseaseStatsResponseBuilder result,
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
            specifiedType: const FullType(BuiltList, [FullType(ProjectDiseaseStatsResponseData)]),
          ) as BuiltList<ProjectDiseaseStatsResponseData>;
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
  PaginatedProjectDiseaseStatsResponse deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = PaginatedProjectDiseaseStatsResponseBuilder();
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


