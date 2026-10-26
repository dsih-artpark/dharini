//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:es_client/src/model/file_upload_result.dart';
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'upload_multiple_files_response.g.dart';

/// UploadMultipleFilesResponse
///
/// Properties:
/// * [success] 
/// * [message] 
/// * [data] 
@BuiltValue()
abstract class UploadMultipleFilesResponse implements Built<UploadMultipleFilesResponse, UploadMultipleFilesResponseBuilder> {
  @BuiltValueField(wireName: r'success')
  bool get success;

  @BuiltValueField(wireName: r'message')
  String get message;

  @BuiltValueField(wireName: r'data')
  BuiltList<FileUploadResult> get data;

  UploadMultipleFilesResponse._();

  factory UploadMultipleFilesResponse([void updates(UploadMultipleFilesResponseBuilder b)]) = _$UploadMultipleFilesResponse;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(UploadMultipleFilesResponseBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<UploadMultipleFilesResponse> get serializer => _$UploadMultipleFilesResponseSerializer();
}

class _$UploadMultipleFilesResponseSerializer implements PrimitiveSerializer<UploadMultipleFilesResponse> {
  @override
  final Iterable<Type> types = const [UploadMultipleFilesResponse, _$UploadMultipleFilesResponse];

  @override
  final String wireName = r'UploadMultipleFilesResponse';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    UploadMultipleFilesResponse object, {
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
      specifiedType: const FullType(BuiltList, [FullType(FileUploadResult)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    UploadMultipleFilesResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required UploadMultipleFilesResponseBuilder result,
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
            specifiedType: const FullType(BuiltList, [FullType(FileUploadResult)]),
          ) as BuiltList<FileUploadResult>;
          result.data.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  UploadMultipleFilesResponse deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = UploadMultipleFilesResponseBuilder();
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


