import 'dart:convert';
import 'package:hive/hive.dart';
import '../models/visit_draft.dart';

class VisitDraftRepository {
  static const String boxName = 'visitDrafts';
  static const int kDraftExpiryDays = 7; // Draft expiry variable configurable per User request

  static Future<Box<String>> get _box async {
    return Hive.isBoxOpen(boxName)
        ? Hive.box<String>(boxName)
        : await Hive.openBox<String>(boxName);
  }

  /// Saves or updates an existing draft in Hive
  static Future<void> saveDraft(VisitDraft draft) async {
    final box = await _box;
    final updatedDraft = draft.copyWith(updatedAt: DateTime.now());
    await box.put(updatedDraft.visitId, jsonEncode(updatedDraft.toJson()));
    print('[VisitDraftRepository] Saved draft for visitId: ${updatedDraft.visitId}, stepIndex: ${updatedDraft.stepIndex}');
  }

  /// Retrieves a draft by visitId
  static Future<VisitDraft?> getDraft(String visitId) async {
    final box = await _box;
    final jsonStr = box.get(visitId);
    if (jsonStr == null) return null;
    try {
      final decoded = jsonDecode(jsonStr);
      return VisitDraft.fromJson(decoded);
    } catch (e) {
      print('[VisitDraftRepository] Error deserializing draft for visitId $visitId: $e');
      return null;
    }
  }

  /// Deletes a draft from Hive (e.g. after successful submission)
  static Future<void> deleteDraft(String visitId) async {
    final box = await _box;
    await box.delete(visitId);
    print('[VisitDraftRepository] Deleted draft for visitId: $visitId');
  }

  /// Checks if a draft exists for a visitId
  static Future<bool> hasDraft(String visitId) async {
    final box = await _box;
    return box.containsKey(visitId);
  }

  /// Returns all active drafts
  static Future<List<VisitDraft>> getAllDrafts() async {
    final box = await _box;
    final drafts = <VisitDraft>[];
    for (final key in box.keys) {
      final jsonStr = box.get(key);
      if (jsonStr != null) {
        try {
          final decoded = jsonDecode(jsonStr);
          drafts.add(VisitDraft.fromJson(decoded));
        } catch (e) {
          print('[VisitDraftRepository] Error parsing draft for key $key: $e');
        }
      }
    }
    return drafts;
  }

  /// Performs cleanup of drafts older than the configured expiry duration
  static Future<void> cleanExpiredDrafts() async {
    try {
      final box = await _box;
      final now = DateTime.now();
      final keysToDelete = <String>[];
      for (final key in box.keys) {
        final jsonStr = box.get(key);
        if (jsonStr != null) {
          try {
            final decoded = jsonDecode(jsonStr);
            final draft = VisitDraft.fromJson(decoded);
            final difference = now.difference(draft.updatedAt).inDays;
            if (difference >= kDraftExpiryDays) {
              keysToDelete.add(draft.visitId);
            }
          } catch (e) {
            print('[VisitDraftRepository] Error parsing draft for expiration check: $e');
            // If it's corrupted, we mark it for deletion
            keysToDelete.add(key.toString());
          }
        }
      }
      if (keysToDelete.isNotEmpty) {
        await box.deleteAll(keysToDelete);
        print('[VisitDraftRepository] Cleaned up ${keysToDelete.length} expired/corrupted drafts: $keysToDelete');
      }
    } catch (e) {
      print('[VisitDraftRepository] Error cleaning expired drafts: $e');
    }
  }
}
