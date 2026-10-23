//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/json_object.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'submit_sequencing_job_dto.g.dart';

/// SubmitSequencingJobDto
///
/// Properties:
/// * [sourceType] 
/// * [labTestId] 
/// * [ncbiAccession] 
/// * [manualSampleBarcode] 
/// * [manualSiteName] 
/// * [fileFormat] 
/// * [libraryType] 
/// * [platform] 
/// * [sequencingMethod] 
/// * [projectId] 
/// * [pipelineId] 
/// * [inputKey] 
/// * [inputFilename] 
/// * [extraInputKeys] 
/// * [params] 
@BuiltValue()
abstract class SubmitSequencingJobDto implements Built<SubmitSequencingJobDto, SubmitSequencingJobDtoBuilder> {
  @BuiltValueField(wireName: r'sourceType')
  SubmitSequencingJobDtoSourceTypeEnum get sourceType;
  // enum sourceTypeEnum {  lab,  ncbi,  manual,  };

  @BuiltValueField(wireName: r'labTestId')
  String? get labTestId;

  @BuiltValueField(wireName: r'ncbiAccession')
  String? get ncbiAccession;

  @BuiltValueField(wireName: r'manualSampleBarcode')
  String? get manualSampleBarcode;

  @BuiltValueField(wireName: r'manualSiteName')
  String? get manualSiteName;

  @BuiltValueField(wireName: r'fileFormat')
  SubmitSequencingJobDtoFileFormatEnum? get fileFormat;
  // enum fileFormatEnum {  FASTA,  FASTQ,  };

  @BuiltValueField(wireName: r'libraryType')
  SubmitSequencingJobDtoLibraryTypeEnum? get libraryType;
  // enum libraryTypeEnum {  Single End,  Paired End,  };

  @BuiltValueField(wireName: r'platform')
  String? get platform;

  @BuiltValueField(wireName: r'sequencingMethod')
  String? get sequencingMethod;

  @BuiltValueField(wireName: r'projectId')
  String? get projectId;

  @BuiltValueField(wireName: r'pipelineId')
  String get pipelineId;

  @BuiltValueField(wireName: r'inputKey')
  String? get inputKey;

  @BuiltValueField(wireName: r'inputFilename')
  String? get inputFilename;

  @BuiltValueField(wireName: r'extraInputKeys')
  JsonObject? get extraInputKeys;

  @BuiltValueField(wireName: r'params')
  JsonObject? get params;

  SubmitSequencingJobDto._();

  factory SubmitSequencingJobDto([void updates(SubmitSequencingJobDtoBuilder b)]) = _$SubmitSequencingJobDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(SubmitSequencingJobDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<SubmitSequencingJobDto> get serializer => _$SubmitSequencingJobDtoSerializer();
}

class _$SubmitSequencingJobDtoSerializer implements PrimitiveSerializer<SubmitSequencingJobDto> {
  @override
  final Iterable<Type> types = const [SubmitSequencingJobDto, _$SubmitSequencingJobDto];

  @override
  final String wireName = r'SubmitSequencingJobDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    SubmitSequencingJobDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'sourceType';
    yield serializers.serialize(
      object.sourceType,
      specifiedType: const FullType(SubmitSequencingJobDtoSourceTypeEnum),
    );
    if (object.labTestId != null) {
      yield r'labTestId';
      yield serializers.serialize(
        object.labTestId,
        specifiedType: const FullType(String),
      );
    }
    if (object.ncbiAccession != null) {
      yield r'ncbiAccession';
      yield serializers.serialize(
        object.ncbiAccession,
        specifiedType: const FullType(String),
      );
    }
    if (object.manualSampleBarcode != null) {
      yield r'manualSampleBarcode';
      yield serializers.serialize(
        object.manualSampleBarcode,
        specifiedType: const FullType(String),
      );
    }
    if (object.manualSiteName != null) {
      yield r'manualSiteName';
      yield serializers.serialize(
        object.manualSiteName,
        specifiedType: const FullType(String),
      );
    }
    if (object.fileFormat != null) {
      yield r'fileFormat';
      yield serializers.serialize(
        object.fileFormat,
        specifiedType: const FullType(SubmitSequencingJobDtoFileFormatEnum),
      );
    }
    if (object.libraryType != null) {
      yield r'libraryType';
      yield serializers.serialize(
        object.libraryType,
        specifiedType: const FullType(SubmitSequencingJobDtoLibraryTypeEnum),
      );
    }
    if (object.platform != null) {
      yield r'platform';
      yield serializers.serialize(
        object.platform,
        specifiedType: const FullType(String),
      );
    }
    if (object.sequencingMethod != null) {
      yield r'sequencingMethod';
      yield serializers.serialize(
        object.sequencingMethod,
        specifiedType: const FullType(String),
      );
    }
    if (object.projectId != null) {
      yield r'projectId';
      yield serializers.serialize(
        object.projectId,
        specifiedType: const FullType(String),
      );
    }
    yield r'pipelineId';
    yield serializers.serialize(
      object.pipelineId,
      specifiedType: const FullType(String),
    );
    if (object.inputKey != null) {
      yield r'inputKey';
      yield serializers.serialize(
        object.inputKey,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.inputFilename != null) {
      yield r'inputFilename';
      yield serializers.serialize(
        object.inputFilename,
        specifiedType: const FullType(String),
      );
    }
    if (object.extraInputKeys != null) {
      yield r'extraInputKeys';
      yield serializers.serialize(
        object.extraInputKeys,
        specifiedType: const FullType(JsonObject),
      );
    }
    if (object.params != null) {
      yield r'params';
      yield serializers.serialize(
        object.params,
        specifiedType: const FullType(JsonObject),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    SubmitSequencingJobDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required SubmitSequencingJobDtoBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'sourceType':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(SubmitSequencingJobDtoSourceTypeEnum),
          ) as SubmitSequencingJobDtoSourceTypeEnum;
          result.sourceType = valueDes;
          break;
        case r'labTestId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.labTestId = valueDes;
          break;
        case r'ncbiAccession':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.ncbiAccession = valueDes;
          break;
        case r'manualSampleBarcode':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.manualSampleBarcode = valueDes;
          break;
        case r'manualSiteName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.manualSiteName = valueDes;
          break;
        case r'fileFormat':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(SubmitSequencingJobDtoFileFormatEnum),
          ) as SubmitSequencingJobDtoFileFormatEnum?;
          if (valueDes == null) continue;
          result.fileFormat = valueDes;
          break;
        case r'libraryType':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(SubmitSequencingJobDtoLibraryTypeEnum),
          ) as SubmitSequencingJobDtoLibraryTypeEnum?;
          if (valueDes == null) continue;
          result.libraryType = valueDes;
          break;
        case r'platform':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.platform = valueDes;
          break;
        case r'sequencingMethod':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.sequencingMethod = valueDes;
          break;
        case r'projectId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.projectId = valueDes;
          break;
        case r'pipelineId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.pipelineId = valueDes;
          break;
        case r'inputKey':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.inputKey = valueDes;
          break;
        case r'inputFilename':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.inputFilename = valueDes;
          break;
        case r'extraInputKeys':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(JsonObject),
          ) as JsonObject?;
          if (valueDes == null) continue;
          result.extraInputKeys = valueDes;
          break;
        case r'params':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(JsonObject),
          ) as JsonObject?;
          if (valueDes == null) continue;
          result.params = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  SubmitSequencingJobDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = SubmitSequencingJobDtoBuilder();
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


class SubmitSequencingJobDtoSourceTypeEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'lab')
  static const SubmitSequencingJobDtoSourceTypeEnum lab = _$submitSequencingJobDtoSourceTypeEnum_lab;
  @BuiltValueEnumConst(wireName: r'ncbi')
  static const SubmitSequencingJobDtoSourceTypeEnum ncbi = _$submitSequencingJobDtoSourceTypeEnum_ncbi;
  @BuiltValueEnumConst(wireName: r'manual')
  static const SubmitSequencingJobDtoSourceTypeEnum manual = _$submitSequencingJobDtoSourceTypeEnum_manual;
  @BuiltValueEnumConst(wireName: r'unknown_default_open_api', fallback: true)
  static const SubmitSequencingJobDtoSourceTypeEnum unknownDefaultOpenApi = _$submitSequencingJobDtoSourceTypeEnum_unknownDefaultOpenApi;

  static Serializer<SubmitSequencingJobDtoSourceTypeEnum> get serializer => _$submitSequencingJobDtoSourceTypeEnumSerializer;

  const SubmitSequencingJobDtoSourceTypeEnum._(String name): super(name);

  static BuiltSet<SubmitSequencingJobDtoSourceTypeEnum> get values => _$submitSequencingJobDtoSourceTypeEnumValues;
  static SubmitSequencingJobDtoSourceTypeEnum valueOf(String name) => _$submitSequencingJobDtoSourceTypeEnumValueOf(name);
}

class SubmitSequencingJobDtoFileFormatEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'FASTA')
  static const SubmitSequencingJobDtoFileFormatEnum FASTA = _$submitSequencingJobDtoFileFormatEnum_FASTA;
  @BuiltValueEnumConst(wireName: r'FASTQ')
  static const SubmitSequencingJobDtoFileFormatEnum FASTQ = _$submitSequencingJobDtoFileFormatEnum_FASTQ;
  @BuiltValueEnumConst(wireName: r'unknown_default_open_api', fallback: true)
  static const SubmitSequencingJobDtoFileFormatEnum unknownDefaultOpenApi = _$submitSequencingJobDtoFileFormatEnum_unknownDefaultOpenApi;

  static Serializer<SubmitSequencingJobDtoFileFormatEnum> get serializer => _$submitSequencingJobDtoFileFormatEnumSerializer;

  const SubmitSequencingJobDtoFileFormatEnum._(String name): super(name);

  static BuiltSet<SubmitSequencingJobDtoFileFormatEnum> get values => _$submitSequencingJobDtoFileFormatEnumValues;
  static SubmitSequencingJobDtoFileFormatEnum valueOf(String name) => _$submitSequencingJobDtoFileFormatEnumValueOf(name);
}

class SubmitSequencingJobDtoLibraryTypeEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'Single End')
  static const SubmitSequencingJobDtoLibraryTypeEnum singleEnd = _$submitSequencingJobDtoLibraryTypeEnum_singleEnd;
  @BuiltValueEnumConst(wireName: r'Paired End')
  static const SubmitSequencingJobDtoLibraryTypeEnum pairedEnd = _$submitSequencingJobDtoLibraryTypeEnum_pairedEnd;
  @BuiltValueEnumConst(wireName: r'unknown_default_open_api', fallback: true)
  static const SubmitSequencingJobDtoLibraryTypeEnum unknownDefaultOpenApi = _$submitSequencingJobDtoLibraryTypeEnum_unknownDefaultOpenApi;

  static Serializer<SubmitSequencingJobDtoLibraryTypeEnum> get serializer => _$submitSequencingJobDtoLibraryTypeEnumSerializer;

  const SubmitSequencingJobDtoLibraryTypeEnum._(String name): super(name);

  static BuiltSet<SubmitSequencingJobDtoLibraryTypeEnum> get values => _$submitSequencingJobDtoLibraryTypeEnumValues;
  static SubmitSequencingJobDtoLibraryTypeEnum valueOf(String name) => _$submitSequencingJobDtoLibraryTypeEnumValueOf(name);
}

