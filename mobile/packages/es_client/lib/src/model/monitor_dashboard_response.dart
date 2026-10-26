//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:es_client/src/model/monitor_dashboard_response_data.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'monitor_dashboard_response.g.dart';

/// MonitorDashboardResponse
///
/// Properties:
/// * [success] 
/// * [message] 
/// * [data] 
@BuiltValue()
abstract class MonitorDashboardResponse implements Built<MonitorDashboardResponse, MonitorDashboardResponseBuilder> {
  @BuiltValueField(wireName: r'success')
  bool get success;

  @BuiltValueField(wireName: r'message')
  String get message;

  @BuiltValueField(wireName: r'data')
  MonitorDashboardResponseData get data;

  MonitorDashboardResponse._();

  factory MonitorDashboardResponse([void updates(MonitorDashboardResponseBuilder b)]) = _$MonitorDashboardResponse;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(MonitorDashboardResponseBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<MonitorDashboardResponse> get serializer => _$MonitorDashboardResponseSerializer();
}

class _$MonitorDashboardResponseSerializer implements PrimitiveSerializer<MonitorDashboardResponse> {
  @override
  final Iterable<Type> types = const [MonitorDashboardResponse, _$MonitorDashboardResponse];

  @override
  final String wireName = r'MonitorDashboardResponse';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    MonitorDashboardResponse object, {
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
      specifiedType: const FullType(MonitorDashboardResponseData),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    MonitorDashboardResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required MonitorDashboardResponseBuilder result,
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
            specifiedType: const FullType(MonitorDashboardResponseData),
          ) as MonitorDashboardResponseData;
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
  MonitorDashboardResponse deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = MonitorDashboardResponseBuilder();
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


