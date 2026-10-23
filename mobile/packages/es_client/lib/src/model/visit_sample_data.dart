//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:es_client/src/model/sample_status.dart';
import 'package:built_collection/built_collection.dart';
import 'package:es_client/src/model/disease.dart';
import 'package:es_client/src/model/user.dart';
import 'package:es_client/src/model/replicate_availability.dart';
import 'package:es_client/src/model/sample_type.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'visit_sample_data.g.dart';

/// VisitSampleData
///
/// Properties:
/// * [replicates] 
/// * [sampleStatus] 
/// * [barcode] 
/// * [disease] 
/// * [sampleType] 
/// * [originalSampleId] 
/// * [id] 
/// * [sampleCode] 
/// * [collectedAt] 
/// * [quantity] 
/// * [unit] 
/// * [habitat] 
/// * [conc] 
/// * [collectionTime] 
/// * [photos] 
/// * [comment] 
/// * [rejectReason] 
/// * [receivedAt] 
/// * [receivedVolumeValue] 
/// * [receivedVolumeUnit] 
/// * [receivedLabStorageDetails] 
/// * [extractionDateTime] 
/// * [extractionSampleUsedValue] 
/// * [extractionSampleUsedUnit] 
/// * [extractionSampleRemainingValue] 
/// * [extractionSampleRemainingUnit] 
/// * [extractionComments] 
/// * [receivedBy] 
/// * [extractedBy] 
/// * [collectedBy] 
/// * [reportGeneratedBy] 
@BuiltValue()
abstract class VisitSampleData implements Built<VisitSampleData, VisitSampleDataBuilder> {
  @BuiltValueField(wireName: r'replicates')
  ReplicateAvailability? get replicates;
  // enum replicatesEnum {  available,  not collected,  };

  @BuiltValueField(wireName: r'sampleStatus')
  SampleStatus get sampleStatus;
  // enum sampleStatusEnum {  pending,  picked-up,  received,  pre-processed,  virus-isolation,  extracted,  tested,  rejected,  test-report-generated,  };

  @BuiltValueField(wireName: r'barcode')
  String get barcode;

  @BuiltValueField(wireName: r'disease')
  Disease? get disease;

  @BuiltValueField(wireName: r'sampleType')
  SampleType? get sampleType;

  @BuiltValueField(wireName: r'originalSampleId')
  String? get originalSampleId;

  @BuiltValueField(wireName: r'id')
  String get id;

  @BuiltValueField(wireName: r'sampleCode')
  String? get sampleCode;

  @BuiltValueField(wireName: r'collectedAt')
  DateTime get collectedAt;

  @BuiltValueField(wireName: r'quantity')
  num? get quantity;

  @BuiltValueField(wireName: r'unit')
  String? get unit;

  @BuiltValueField(wireName: r'habitat')
  String? get habitat;

  @BuiltValueField(wireName: r'conc')
  String? get conc;

  @BuiltValueField(wireName: r'collectionTime')
  DateTime get collectionTime;

  @BuiltValueField(wireName: r'photos')
  BuiltList<String> get photos;

  @BuiltValueField(wireName: r'comment')
  String? get comment;

  @BuiltValueField(wireName: r'rejectReason')
  String? get rejectReason;

  @BuiltValueField(wireName: r'receivedAt')
  DateTime? get receivedAt;

  @BuiltValueField(wireName: r'receivedVolumeValue')
  String? get receivedVolumeValue;

  @BuiltValueField(wireName: r'receivedVolumeUnit')
  String? get receivedVolumeUnit;

  @BuiltValueField(wireName: r'receivedLabStorageDetails')
  String? get receivedLabStorageDetails;

  @BuiltValueField(wireName: r'extractionDateTime')
  DateTime? get extractionDateTime;

  @BuiltValueField(wireName: r'extractionSampleUsedValue')
  String? get extractionSampleUsedValue;

  @BuiltValueField(wireName: r'extractionSampleUsedUnit')
  String? get extractionSampleUsedUnit;

  @BuiltValueField(wireName: r'extractionSampleRemainingValue')
  String? get extractionSampleRemainingValue;

  @BuiltValueField(wireName: r'extractionSampleRemainingUnit')
  String? get extractionSampleRemainingUnit;

  @BuiltValueField(wireName: r'extractionComments')
  String? get extractionComments;

  @BuiltValueField(wireName: r'receivedBy')
  User? get receivedBy;

  @BuiltValueField(wireName: r'extractedBy')
  User? get extractedBy;

  @BuiltValueField(wireName: r'collectedBy')
  User? get collectedBy;

  @BuiltValueField(wireName: r'reportGeneratedBy')
  User? get reportGeneratedBy;

  VisitSampleData._();

  factory VisitSampleData([void updates(VisitSampleDataBuilder b)]) = _$VisitSampleData;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(VisitSampleDataBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<VisitSampleData> get serializer => _$VisitSampleDataSerializer();
}

class _$VisitSampleDataSerializer implements PrimitiveSerializer<VisitSampleData> {
  @override
  final Iterable<Type> types = const [VisitSampleData, _$VisitSampleData];

  @override
  final String wireName = r'VisitSampleData';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    VisitSampleData object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.replicates != null) {
      yield r'replicates';
      yield serializers.serialize(
        object.replicates,
        specifiedType: const FullType.nullable(ReplicateAvailability),
      );
    }
    yield r'sampleStatus';
    yield serializers.serialize(
      object.sampleStatus,
      specifiedType: const FullType(SampleStatus),
    );
    yield r'barcode';
    yield serializers.serialize(
      object.barcode,
      specifiedType: const FullType(String),
    );
    if (object.disease != null) {
      yield r'disease';
      yield serializers.serialize(
        object.disease,
        specifiedType: const FullType(Disease),
      );
    }
    if (object.sampleType != null) {
      yield r'sampleType';
      yield serializers.serialize(
        object.sampleType,
        specifiedType: const FullType(SampleType),
      );
    }
    if (object.originalSampleId != null) {
      yield r'originalSampleId';
      yield serializers.serialize(
        object.originalSampleId,
        specifiedType: const FullType.nullable(String),
      );
    }
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(String),
    );
    if (object.sampleCode != null) {
      yield r'sampleCode';
      yield serializers.serialize(
        object.sampleCode,
        specifiedType: const FullType.nullable(String),
      );
    }
    yield r'collectedAt';
    yield serializers.serialize(
      object.collectedAt,
      specifiedType: const FullType(DateTime),
    );
    if (object.quantity != null) {
      yield r'quantity';
      yield serializers.serialize(
        object.quantity,
        specifiedType: const FullType.nullable(num),
      );
    }
    if (object.unit != null) {
      yield r'unit';
      yield serializers.serialize(
        object.unit,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.habitat != null) {
      yield r'habitat';
      yield serializers.serialize(
        object.habitat,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.conc != null) {
      yield r'conc';
      yield serializers.serialize(
        object.conc,
        specifiedType: const FullType.nullable(String),
      );
    }
    yield r'collectionTime';
    yield serializers.serialize(
      object.collectionTime,
      specifiedType: const FullType(DateTime),
    );
    yield r'photos';
    yield serializers.serialize(
      object.photos,
      specifiedType: const FullType(BuiltList, [FullType(String)]),
    );
    if (object.comment != null) {
      yield r'comment';
      yield serializers.serialize(
        object.comment,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.rejectReason != null) {
      yield r'rejectReason';
      yield serializers.serialize(
        object.rejectReason,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.receivedAt != null) {
      yield r'receivedAt';
      yield serializers.serialize(
        object.receivedAt,
        specifiedType: const FullType.nullable(DateTime),
      );
    }
    if (object.receivedVolumeValue != null) {
      yield r'receivedVolumeValue';
      yield serializers.serialize(
        object.receivedVolumeValue,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.receivedVolumeUnit != null) {
      yield r'receivedVolumeUnit';
      yield serializers.serialize(
        object.receivedVolumeUnit,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.receivedLabStorageDetails != null) {
      yield r'receivedLabStorageDetails';
      yield serializers.serialize(
        object.receivedLabStorageDetails,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.extractionDateTime != null) {
      yield r'extractionDateTime';
      yield serializers.serialize(
        object.extractionDateTime,
        specifiedType: const FullType.nullable(DateTime),
      );
    }
    if (object.extractionSampleUsedValue != null) {
      yield r'extractionSampleUsedValue';
      yield serializers.serialize(
        object.extractionSampleUsedValue,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.extractionSampleUsedUnit != null) {
      yield r'extractionSampleUsedUnit';
      yield serializers.serialize(
        object.extractionSampleUsedUnit,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.extractionSampleRemainingValue != null) {
      yield r'extractionSampleRemainingValue';
      yield serializers.serialize(
        object.extractionSampleRemainingValue,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.extractionSampleRemainingUnit != null) {
      yield r'extractionSampleRemainingUnit';
      yield serializers.serialize(
        object.extractionSampleRemainingUnit,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.extractionComments != null) {
      yield r'extractionComments';
      yield serializers.serialize(
        object.extractionComments,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.receivedBy != null) {
      yield r'receivedBy';
      yield serializers.serialize(
        object.receivedBy,
        specifiedType: const FullType.nullable(User),
      );
    }
    if (object.extractedBy != null) {
      yield r'extractedBy';
      yield serializers.serialize(
        object.extractedBy,
        specifiedType: const FullType.nullable(User),
      );
    }
    if (object.collectedBy != null) {
      yield r'collectedBy';
      yield serializers.serialize(
        object.collectedBy,
        specifiedType: const FullType.nullable(User),
      );
    }
    if (object.reportGeneratedBy != null) {
      yield r'reportGeneratedBy';
      yield serializers.serialize(
        object.reportGeneratedBy,
        specifiedType: const FullType.nullable(User),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    VisitSampleData object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required VisitSampleDataBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'replicates':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(ReplicateAvailability),
          ) as ReplicateAvailability?;
          if (valueDes == null) continue;
          result.replicates = valueDes;
          break;
        case r'sampleStatus':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(SampleStatus),
          ) as SampleStatus;
          result.sampleStatus = valueDes;
          break;
        case r'barcode':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.barcode = valueDes;
          break;
        case r'disease':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(Disease),
          ) as Disease?;
          if (valueDes == null) continue;
          result.disease.replace(valueDes);
          break;
        case r'sampleType':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(SampleType),
          ) as SampleType?;
          if (valueDes == null) continue;
          result.sampleType.replace(valueDes);
          break;
        case r'originalSampleId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.originalSampleId = valueDes;
          break;
        case r'id':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.id = valueDes;
          break;
        case r'sampleCode':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.sampleCode = valueDes;
          break;
        case r'collectedAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.collectedAt = valueDes;
          break;
        case r'quantity':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
          result.quantity = valueDes;
          break;
        case r'unit':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.unit = valueDes;
          break;
        case r'habitat':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.habitat = valueDes;
          break;
        case r'conc':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.conc = valueDes;
          break;
        case r'collectionTime':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.collectionTime = valueDes;
          break;
        case r'photos':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(String)]),
          ) as BuiltList<String>;
          result.photos.replace(valueDes);
          break;
        case r'comment':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.comment = valueDes;
          break;
        case r'rejectReason':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.rejectReason = valueDes;
          break;
        case r'receivedAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(DateTime),
          ) as DateTime?;
          if (valueDes == null) continue;
          result.receivedAt = valueDes;
          break;
        case r'receivedVolumeValue':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.receivedVolumeValue = valueDes;
          break;
        case r'receivedVolumeUnit':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.receivedVolumeUnit = valueDes;
          break;
        case r'receivedLabStorageDetails':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.receivedLabStorageDetails = valueDes;
          break;
        case r'extractionDateTime':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(DateTime),
          ) as DateTime?;
          if (valueDes == null) continue;
          result.extractionDateTime = valueDes;
          break;
        case r'extractionSampleUsedValue':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.extractionSampleUsedValue = valueDes;
          break;
        case r'extractionSampleUsedUnit':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.extractionSampleUsedUnit = valueDes;
          break;
        case r'extractionSampleRemainingValue':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.extractionSampleRemainingValue = valueDes;
          break;
        case r'extractionSampleRemainingUnit':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.extractionSampleRemainingUnit = valueDes;
          break;
        case r'extractionComments':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.extractionComments = valueDes;
          break;
        case r'receivedBy':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(User),
          ) as User?;
          if (valueDes == null) continue;
          result.receivedBy.replace(valueDes);
          break;
        case r'extractedBy':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(User),
          ) as User?;
          if (valueDes == null) continue;
          result.extractedBy.replace(valueDes);
          break;
        case r'collectedBy':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(User),
          ) as User?;
          if (valueDes == null) continue;
          result.collectedBy.replace(valueDes);
          break;
        case r'reportGeneratedBy':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(User),
          ) as User?;
          if (valueDes == null) continue;
          result.reportGeneratedBy.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  VisitSampleData deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = VisitSampleDataBuilder();
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


