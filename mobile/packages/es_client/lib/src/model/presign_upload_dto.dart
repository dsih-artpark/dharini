//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'presign_upload_dto.g.dart';

/// PresignUploadDto
///
/// Properties:
/// * [filename] 
/// * [contentLength] 
@BuiltValue()
abstract class PresignUploadDto implements Built<PresignUploadDto, PresignUploadDtoBuilder> {
  @BuiltValueField(wireName: r'filename')
  String get filename;

  @BuiltValueField(wireName: r'contentLength')
  num get contentLength;

  PresignUploadDto._();

  factory PresignUploadDto([void updates(PresignUploadDtoBuilder b)]) = _$PresignUploadDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(PresignUploadDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<PresignUploadDto> get serializer => _$PresignUploadDtoSerializer();
}

class _$PresignUploadDtoSerializer implements PrimitiveSerializer<PresignUploadDto> {
  @override
  final Iterable<Type> types = const [PresignUploadDto, _$PresignUploadDto];

  @override
  final String wireName = r'PresignUploadDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    PresignUploadDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'filename';
    yield serializers.serialize(
      object.filename,
      specifiedType: const FullType(String),
    );
    yield r'contentLength';
    yield serializers.serialize(
      object.contentLength,
      specifiedType: const FullType(num),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    PresignUploadDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required PresignUploadDtoBuilder result,
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
        case r'contentLength':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.contentLength = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  PresignUploadDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = PresignUploadDtoBuilder();
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


