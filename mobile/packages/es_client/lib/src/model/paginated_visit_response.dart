//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:es_client/src/model/visit_response_data.dart';
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'paginated_visit_response.g.dart';

/// PaginatedVisitResponse
///
/// Properties:
/// * [totalPages] - Total number of pages
/// * [success] 
/// * [message] 
/// * [data] 
/// * [total] 
/// * [page] 
/// * [limit] 
@BuiltValue()
abstract class PaginatedVisitResponse implements Built<PaginatedVisitResponse, PaginatedVisitResponseBuilder> {
  /// Total number of pages
  @BuiltValueField(wireName: r'totalPages')
  num? get totalPages;

  @BuiltValueField(wireName: r'success')
  bool get success;

  @BuiltValueField(wireName: r'message')
  String get message;

  @BuiltValueField(wireName: r'data')
  BuiltList<VisitResponseData> get data;

  @BuiltValueField(wireName: r'total')
  num get total;

  @BuiltValueField(wireName: r'page')
  num get page;

  @BuiltValueField(wireName: r'limit')
  num get limit;

  PaginatedVisitResponse._();

  factory PaginatedVisitResponse([void updates(PaginatedVisitResponseBuilder b)]) = _$PaginatedVisitResponse;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(PaginatedVisitResponseBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<PaginatedVisitResponse> get serializer => _$PaginatedVisitResponseSerializer();
}

class _$PaginatedVisitResponseSerializer implements PrimitiveSerializer<PaginatedVisitResponse> {
  @override
  final Iterable<Type> types = const [PaginatedVisitResponse, _$PaginatedVisitResponse];

  @override
  final String wireName = r'PaginatedVisitResponse';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    PaginatedVisitResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.totalPages != null) {
      yield r'totalPages';
      yield serializers.serialize(
        object.totalPages,
        specifiedType: const FullType(num),
      );
    }
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
      specifiedType: const FullType(BuiltList, [FullType(VisitResponseData)]),
    );
    yield r'total';
    yield serializers.serialize(
      object.total,
      specifiedType: const FullType(num),
    );
    yield r'page';
    yield serializers.serialize(
      object.page,
      specifiedType: const FullType(num),
    );
    yield r'limit';
    yield serializers.serialize(
      object.limit,
      specifiedType: const FullType(num),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    PaginatedVisitResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required PaginatedVisitResponseBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'totalPages':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
          result.totalPages = valueDes;
          break;
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
            specifiedType: const FullType(BuiltList, [FullType(VisitResponseData)]),
          ) as BuiltList<VisitResponseData>;
          result.data.replace(valueDes);
          break;
        case r'total':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.total = valueDes;
          break;
        case r'page':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.page = valueDes;
          break;
        case r'limit':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.limit = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  PaginatedVisitResponse deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = PaginatedVisitResponseBuilder();
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


