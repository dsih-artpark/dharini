// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'animal_metadata_species.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$AnimalMetadataSpecies extends AnimalMetadataSpecies {
  @override
  final String id;
  @override
  final String name;
  @override
  final String? emojiIcon;

  factory _$AnimalMetadataSpecies(
          [void Function(AnimalMetadataSpeciesBuilder)? updates]) =>
      (AnimalMetadataSpeciesBuilder()..update(updates))._build();

  _$AnimalMetadataSpecies._(
      {required this.id, required this.name, this.emojiIcon})
      : super._();
  @override
  AnimalMetadataSpecies rebuild(
          void Function(AnimalMetadataSpeciesBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  AnimalMetadataSpeciesBuilder toBuilder() =>
      AnimalMetadataSpeciesBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is AnimalMetadataSpecies &&
        id == other.id &&
        name == other.name &&
        emojiIcon == other.emojiIcon;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, name.hashCode);
    _$hash = $jc(_$hash, emojiIcon.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'AnimalMetadataSpecies')
          ..add('id', id)
          ..add('name', name)
          ..add('emojiIcon', emojiIcon))
        .toString();
  }
}

class AnimalMetadataSpeciesBuilder
    implements Builder<AnimalMetadataSpecies, AnimalMetadataSpeciesBuilder> {
  _$AnimalMetadataSpecies? _$v;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  String? _emojiIcon;
  String? get emojiIcon => _$this._emojiIcon;
  set emojiIcon(String? emojiIcon) => _$this._emojiIcon = emojiIcon;

  AnimalMetadataSpeciesBuilder() {
    AnimalMetadataSpecies._defaults(this);
  }

  AnimalMetadataSpeciesBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _name = $v.name;
      _emojiIcon = $v.emojiIcon;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(AnimalMetadataSpecies other) {
    _$v = other as _$AnimalMetadataSpecies;
  }

  @override
  void update(void Function(AnimalMetadataSpeciesBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  AnimalMetadataSpecies build() => _build();

  _$AnimalMetadataSpecies _build() {
    final _$result = _$v ??
        _$AnimalMetadataSpecies._(
          id: BuiltValueNullFieldError.checkNotNull(
              id, r'AnimalMetadataSpecies', 'id'),
          name: BuiltValueNullFieldError.checkNotNull(
              name, r'AnimalMetadataSpecies', 'name'),
          emojiIcon: emojiIcon,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
