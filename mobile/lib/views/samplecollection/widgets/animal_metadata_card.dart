import 'package:design_system/design_system.dart';
import 'package:es_client/es_client.dart';
import 'package:es_platform_mobile/hooks/species.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';

/// The display-relevant bits pulled out of a `clinicalMetadata` map.
///
/// The metadata keys differ by disease — avian flu uses `birdId`/`species_AI`,
/// while FMD/LSD use `animalTagId`/`species` — and a reused existing animal is
/// stored with `animalTagId`/`birdId`/`species`. This reads whichever variant
/// is present so the card doesn't need to know the disease.
///
/// Kept as a plain, dependency-free value object so the (key-variant) parsing
/// is unit-testable without a widget or species lookup.
class AnimalCardInfo {
  /// Animal Tag ID or Bird ID, whichever is present (tag preferred).
  final String? identifier;

  /// Human label for [identifier] — `'Tag'` or `'Bird'`.
  final String? identifierLabel;

  /// Species UUID, to be resolved to a readable name by the caller.
  final String? speciesId;

  const AnimalCardInfo({
    this.identifier,
    this.identifierLabel,
    this.speciesId,
  });

  /// True when there is nothing worth showing.
  bool get isEmpty =>
      (identifier == null || identifier!.isEmpty) &&
      (speciesId == null || speciesId!.isEmpty);

  factory AnimalCardInfo.fromMetadata(Map<String, dynamic>? metadata) {
    if (metadata == null) return const AnimalCardInfo();

    String? read(String key) {
      final value = metadata[key];
      if (value == null) return null;
      final str = value.toString().trim();
      return str.isEmpty ? null : str;
    }

    final tag = read('animalTagId');
    final bird = read('birdId');

    String? identifier;
    String? label;
    if (tag != null) {
      identifier = tag;
      label = 'Tag';
    } else if (bird != null) {
      identifier = bird;
      label = 'Bird';
    }

    return AnimalCardInfo(
      identifier: identifier,
      identifierLabel: label,
      speciesId: read('species') ?? read('species_AI'),
    );
  }
}

/// A compact, read-only card showing which animal the current samples belong
/// to (identifier + species). Shown on the sample-selection and barcode-entry
/// screens so a collector always knows the animal — important when the app has
/// crashed mid-flow and they can no longer step back to the metadata screen.
///
/// Self-hides (renders nothing) when [metadata] has no animal identifier or
/// species, so callers can drop it in unconditionally.
class AnimalMetadataCard extends HookWidget {
  final Map<String, dynamic>? metadata;

  const AnimalMetadataCard({Key? key, required this.metadata})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    final info = AnimalCardInfo.fromMetadata(metadata);
    if (info.isEmpty) return const SizedBox.shrink();

    // Resolve species id → name + emoji from the cached species list. If it
    // hasn't loaded yet (or is offline), the species part is simply omitted.
    final speciesQuery = useSpecies();
    String? speciesName;
    String? speciesEmoji;
    if (info.speciesId != null) {
      final species = speciesQuery.data ?? const <SpeciesResponseData>[];
      for (final s in species) {
        if (s.id == info.speciesId) {
          speciesName = s.name;
          speciesEmoji = s.emojiIcon;
          break;
        }
      }
    }

    // Build the bold detail line: "Tag ABC123  ·  Cattle".
    final segments = <String>[];
    if (info.identifier != null) {
      segments.add('${info.identifierLabel} ${info.identifier}');
    }
    if (speciesName != null) {
      segments
          .add(speciesEmoji != null ? '$speciesEmoji $speciesName' : speciesName);
    }
    // speciesId present but not yet resolved and no identifier → generic label.
    final detail = segments.isEmpty ? 'Selected animal' : segments.join('  ·  ');

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.primaryLight.withValues(alpha: 0.04),
        borderRadius: BorderRadius.circular(12),
        border:
            Border.all(color: AppColors.primaryLight.withValues(alpha: 0.15)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: AppColors.primaryLight.withValues(alpha: 0.08),
              shape: BoxShape.circle,
            ),
            child: speciesEmoji != null
                ? Text(speciesEmoji, style: const TextStyle(fontSize: 18))
                : const Icon(Icons.pets,
                    size: 18, color: AppColors.primaryLight),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Collecting samples for',
                  style: AppTypography.textTheme.bodyB4Regular.copyWith(
                    color: AppColors.textWeak,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  detail,
                  style: AppTypography.textTheme.bodyB2SemiBold.copyWith(
                    color: AppColors.textStrong,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
