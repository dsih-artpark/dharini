// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'pending_submission.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class PendingVisitSubmissionAdapter
    extends TypeAdapter<PendingVisitSubmission> {
  @override
  final int typeId = 0;

  @override
  PendingVisitSubmission read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return PendingVisitSubmission(
      id: fields[0] as String,
      data: (fields[1] as Map).cast<String, dynamic>(),
      photoFiles: (fields[2] as List).cast<String>(),
      createdAt: fields[3] as DateTime,
      isUploading: fields[4] as bool,
      error: fields[5] as String?,
      projectId: fields[6] as String?,
      workspaceId: fields[7] as String?,
    );
  }

  @override
  void write(BinaryWriter writer, PendingVisitSubmission obj) {
    writer
      ..writeByte(8)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.data)
      ..writeByte(2)
      ..write(obj.photoFiles)
      ..writeByte(3)
      ..write(obj.createdAt)
      ..writeByte(4)
      ..write(obj.isUploading)
      ..writeByte(5)
      ..write(obj.error)
      ..writeByte(6)
      ..write(obj.projectId)
      ..writeByte(7)
      ..write(obj.workspaceId);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is PendingVisitSubmissionAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
