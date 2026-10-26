//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/json_object.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'lab_test_details_dto.g.dart';

/// LabTestDetailsDto
///
/// Properties:
/// * [concPeriodLeftParenthesisNgSlashLRightParenthesis] 
/// * [n260slash280Ratio] 
/// * [kit1H5CtValue] 
/// * [kit1N1CtValue] 
/// * [kit1InfluenzaACtValue] 
/// * [kit2H5CtValue] 
/// * [kit2H7CtValue] 
/// * [kit2H9CtValue] 
@BuiltValue()
abstract class LabTestDetailsDto implements Built<LabTestDetailsDto, LabTestDetailsDtoBuilder> {
  @BuiltValueField(wireName: r'Conc. (ng/µl)')
  num get concPeriodLeftParenthesisNgSlashLRightParenthesis;

  @BuiltValueField(wireName: r'260/280 Ratio')
  num get n260slash280Ratio;

  @BuiltValueField(wireName: r'Kit 1 H5 Ct Value')
  JsonObject get kit1H5CtValue;

  @BuiltValueField(wireName: r'Kit 1 N1 Ct Value')
  JsonObject get kit1N1CtValue;

  @BuiltValueField(wireName: r'Kit 1 Influenza A Ct Value')
  JsonObject get kit1InfluenzaACtValue;

  @BuiltValueField(wireName: r'Kit 2 H5 Ct Value')
  JsonObject get kit2H5CtValue;

  @BuiltValueField(wireName: r'Kit 2 H7 Ct Value')
  JsonObject get kit2H7CtValue;

  @BuiltValueField(wireName: r'Kit 2 H9 Ct Value')
  JsonObject get kit2H9CtValue;

  LabTestDetailsDto._();

  factory LabTestDetailsDto([void updates(LabTestDetailsDtoBuilder b)]) = _$LabTestDetailsDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(LabTestDetailsDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<LabTestDetailsDto> get serializer => _$LabTestDetailsDtoSerializer();
}

class _$LabTestDetailsDtoSerializer implements PrimitiveSerializer<LabTestDetailsDto> {
  @override
  final Iterable<Type> types = const [LabTestDetailsDto, _$LabTestDetailsDto];

  @override
  final String wireName = r'LabTestDetailsDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    LabTestDetailsDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'Conc. (ng/µl)';
    yield serializers.serialize(
      object.concPeriodLeftParenthesisNgSlashLRightParenthesis,
      specifiedType: const FullType(num),
    );
    yield r'260/280 Ratio';
    yield serializers.serialize(
      object.n260slash280Ratio,
      specifiedType: const FullType(num),
    );
    yield r'Kit 1 H5 Ct Value';
    yield serializers.serialize(
      object.kit1H5CtValue,
      specifiedType: const FullType(JsonObject),
    );
    yield r'Kit 1 N1 Ct Value';
    yield serializers.serialize(
      object.kit1N1CtValue,
      specifiedType: const FullType(JsonObject),
    );
    yield r'Kit 1 Influenza A Ct Value';
    yield serializers.serialize(
      object.kit1InfluenzaACtValue,
      specifiedType: const FullType(JsonObject),
    );
    yield r'Kit 2 H5 Ct Value';
    yield serializers.serialize(
      object.kit2H5CtValue,
      specifiedType: const FullType(JsonObject),
    );
    yield r'Kit 2 H7 Ct Value';
    yield serializers.serialize(
      object.kit2H7CtValue,
      specifiedType: const FullType(JsonObject),
    );
    yield r'Kit 2 H9 Ct Value';
    yield serializers.serialize(
      object.kit2H9CtValue,
      specifiedType: const FullType(JsonObject),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    LabTestDetailsDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required LabTestDetailsDtoBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'Conc. (ng/µl)':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.concPeriodLeftParenthesisNgSlashLRightParenthesis = valueDes;
          break;
        case r'260/280 Ratio':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.n260slash280Ratio = valueDes;
          break;
        case r'Kit 1 H5 Ct Value':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(JsonObject),
          ) as JsonObject;
          result.kit1H5CtValue = valueDes;
          break;
        case r'Kit 1 N1 Ct Value':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(JsonObject),
          ) as JsonObject;
          result.kit1N1CtValue = valueDes;
          break;
        case r'Kit 1 Influenza A Ct Value':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(JsonObject),
          ) as JsonObject;
          result.kit1InfluenzaACtValue = valueDes;
          break;
        case r'Kit 2 H5 Ct Value':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(JsonObject),
          ) as JsonObject;
          result.kit2H5CtValue = valueDes;
          break;
        case r'Kit 2 H7 Ct Value':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(JsonObject),
          ) as JsonObject;
          result.kit2H7CtValue = valueDes;
          break;
        case r'Kit 2 H9 Ct Value':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(JsonObject),
          ) as JsonObject;
          result.kit2H9CtValue = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  LabTestDetailsDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = LabTestDetailsDtoBuilder();
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


