//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'team_progress_activity_overview_response_data.g.dart';

/// TeamProgressActivityOverviewResponseData
///
/// Properties:
/// * [activeMembers] 
/// * [collectedSamples] 
@BuiltValue()
abstract class TeamProgressActivityOverviewResponseData implements Built<TeamProgressActivityOverviewResponseData, TeamProgressActivityOverviewResponseDataBuilder> {
  @BuiltValueField(wireName: r'activeMembers')
  num get activeMembers;

  @BuiltValueField(wireName: r'collectedSamples')
  num get collectedSamples;

  TeamProgressActivityOverviewResponseData._();

  factory TeamProgressActivityOverviewResponseData([void updates(TeamProgressActivityOverviewResponseDataBuilder b)]) = _$TeamProgressActivityOverviewResponseData;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(TeamProgressActivityOverviewResponseDataBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<TeamProgressActivityOverviewResponseData> get serializer => _$TeamProgressActivityOverviewResponseDataSerializer();
}

class _$TeamProgressActivityOverviewResponseDataSerializer implements PrimitiveSerializer<TeamProgressActivityOverviewResponseData> {
  @override
  final Iterable<Type> types = const [TeamProgressActivityOverviewResponseData, _$TeamProgressActivityOverviewResponseData];

  @override
  final String wireName = r'TeamProgressActivityOverviewResponseData';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    TeamProgressActivityOverviewResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'activeMembers';
    yield serializers.serialize(
      object.activeMembers,
      specifiedType: const FullType(num),
    );
    yield r'collectedSamples';
    yield serializers.serialize(
      object.collectedSamples,
      specifiedType: const FullType(num),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    TeamProgressActivityOverviewResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required TeamProgressActivityOverviewResponseDataBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'activeMembers':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.activeMembers = valueDes;
          break;
        case r'collectedSamples':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.collectedSamples = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  TeamProgressActivityOverviewResponseData deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = TeamProgressActivityOverviewResponseDataBuilder();
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


