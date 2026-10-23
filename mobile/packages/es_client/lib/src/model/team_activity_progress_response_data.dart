//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'team_activity_progress_response_data.g.dart';

/// TeamActivityProgressResponseData
///
/// Properties:
/// * [totalPendingSampleCount] 
/// * [totalCompletedSampleCount] 
@BuiltValue()
abstract class TeamActivityProgressResponseData implements Built<TeamActivityProgressResponseData, TeamActivityProgressResponseDataBuilder> {
  @BuiltValueField(wireName: r'totalPendingSampleCount')
  num get totalPendingSampleCount;

  @BuiltValueField(wireName: r'totalCompletedSampleCount')
  num get totalCompletedSampleCount;

  TeamActivityProgressResponseData._();

  factory TeamActivityProgressResponseData([void updates(TeamActivityProgressResponseDataBuilder b)]) = _$TeamActivityProgressResponseData;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(TeamActivityProgressResponseDataBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<TeamActivityProgressResponseData> get serializer => _$TeamActivityProgressResponseDataSerializer();
}

class _$TeamActivityProgressResponseDataSerializer implements PrimitiveSerializer<TeamActivityProgressResponseData> {
  @override
  final Iterable<Type> types = const [TeamActivityProgressResponseData, _$TeamActivityProgressResponseData];

  @override
  final String wireName = r'TeamActivityProgressResponseData';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    TeamActivityProgressResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'totalPendingSampleCount';
    yield serializers.serialize(
      object.totalPendingSampleCount,
      specifiedType: const FullType(num),
    );
    yield r'totalCompletedSampleCount';
    yield serializers.serialize(
      object.totalCompletedSampleCount,
      specifiedType: const FullType(num),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    TeamActivityProgressResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required TeamActivityProgressResponseDataBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'totalPendingSampleCount':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.totalPendingSampleCount = valueDes;
          break;
        case r'totalCompletedSampleCount':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.totalCompletedSampleCount = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  TeamActivityProgressResponseData deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = TeamActivityProgressResponseDataBuilder();
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


