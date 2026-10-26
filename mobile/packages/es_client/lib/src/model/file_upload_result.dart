//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'file_upload_result.g.dart';

/// FileUploadResult
///
/// Properties:
/// * [filename] 
/// * [uploaded] 
/// * [fileUrl] 
/// * [publicUrl] 
@BuiltValue()
abstract class FileUploadResult implements Built<FileUploadResult, FileUploadResultBuilder> {
  @BuiltValueField(wireName: r'filename')
  String get filename;

  @BuiltValueField(wireName: r'uploaded')
  bool get uploaded;

  @BuiltValueField(wireName: r'fileUrl')
  String? get fileUrl;

  @BuiltValueField(wireName: r'publicUrl')
  String? get publicUrl;

  FileUploadResult._();

  factory FileUploadResult([void updates(FileUploadResultBuilder b)]) = _$FileUploadResult;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(FileUploadResultBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<FileUploadResult> get serializer => _$FileUploadResultSerializer();
}

class _$FileUploadResultSerializer implements PrimitiveSerializer<FileUploadResult> {
  @override
  final Iterable<Type> types = const [FileUploadResult, _$FileUploadResult];

  @override
  final String wireName = r'FileUploadResult';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    FileUploadResult object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'filename';
    yield serializers.serialize(
      object.filename,
      specifiedType: const FullType(String),
    );
    yield r'uploaded';
    yield serializers.serialize(
      object.uploaded,
      specifiedType: const FullType(bool),
    );
    yield r'fileUrl';
    yield object.fileUrl == null ? null : serializers.serialize(
      object.fileUrl,
      specifiedType: const FullType.nullable(String),
    );
    yield r'publicUrl';
    yield object.publicUrl == null ? null : serializers.serialize(
      object.publicUrl,
      specifiedType: const FullType.nullable(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    FileUploadResult object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required FileUploadResultBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'filename':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.filename = valueDes;
          break;
        case r'uploaded':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.uploaded = valueDes;
          break;
        case r'fileUrl':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.fileUrl = valueDes;
          break;
        case r'publicUrl':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.publicUrl = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  FileUploadResult deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = FileUploadResultBuilder();
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


