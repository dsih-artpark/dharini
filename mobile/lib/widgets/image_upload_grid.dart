import 'dart:typed_data';

import 'package:design_system/design_system.dart';
import 'package:es_platform_mobile/hooks/auth.dart';
import 'package:es_platform_mobile/providers/connectivity_provider.dart';
import 'package:es_platform_mobile/utils/image_picker_helper.dart';
import 'package:es_platform_mobile/widgets/image_preview_dialog.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:image_picker/image_picker.dart';

/// A self-contained image upload grid widget.
///
/// Handles picking, uploading, and displaying images. All upload state
/// (in-flight, failed, retry, offline-queued) is managed internally.
/// The parent receives the canonical list of successfully uploaded URLs
/// via [onChanged] and only needs to store that list for form submission.
///
/// **Offline behaviour:**
/// - Picking images while offline: images are queued locally. The thumbnail
///   shows a "Queued / Waiting for connection" overlay with a wifi_off icon.
/// - When connectivity is restored, all queued images are **automatically
///   retried** without any user action.
/// - If an image fails while online, a manual "Retry" overlay is shown.
/// - Removing an image always works regardless of connectivity.
///
/// Usage (create flows):
/// ```dart
/// ImageUploadGrid(
///   onChanged: (urls) => uploadedPhotoUrls.value = urls,
/// )
/// ```
///
/// Usage (edit flows with pre-existing server URLs):
/// ```dart
/// ImageUploadGrid(
///   initialUrls: site.photos?.toList() ?? [],
///   onChanged: (urls) => uploadedPhotoUrls.value = urls,
/// )
/// ```
/// Whether [url] is the uploaded form of the local file at [localPath].
///
/// Before sending, a picked file is compressed to `compressed_<ts>_<name>` and
/// the server keeps that name in the returned URL, so the original basename is
/// always a substring of the URL. The grid uses this rule to hide a local
/// thumbnail once its upload finishes, and [ImageUploadGrid]'s remove handler
/// uses the *same* rule so removing the URL also drops the local copy. Keeping
/// both on one rule is what prevents the "tap × twice to delete" bug.
@visibleForTesting
bool urlMatchesLocalFile(String url, String localPath) =>
    url.contains(localPath.split('/').last);

class ImageUploadGrid extends HookWidget {
  /// Pre-existing remote URLs to display on first render (e.g. loaded from API).
  final List<String> initialUrls;

  /// Called whenever the set of uploaded URLs changes — on upload success,
  /// on removal, or when an initial URL is deleted.
  final void Function(List<String> urls) onChanged;

  /// Image quality passed to the image picker (0–100).
  final int imageQuality;

  const ImageUploadGrid({
    super.key,
    this.initialUrls = const [],
    required this.onChanged,
    this.imageQuality = 70,
  });

  @override
  Widget build(BuildContext context) {
    // ─── Connectivity ────────────────────────────────────────────────────────
    // Reading context.isOnline inside build() means the widget rebuilds
    // automatically whenever connectivity changes.
    final isOnline = context.isOnline;

    // ─── Internal state ──────────────────────────────────────────────────────
    final selectedFiles = useState<List<XFile>>([]);
    final uploadedUrls = useState<List<String>>(List.from(initialUrls));
    final uploadingPaths = useState<Set<String>>({});
    // Tracks paths that need uploading but haven't succeeded yet.
    // Visual state derived at render time using isOnline:
    //   - offline  → "Queued"  (wifi_off icon, will auto-retry on reconnect)
    //   - online   → "Failed"  (refresh icon, tap to retry)
    final pendingPaths = useState<Set<String>>({});

    // ─── Sync initialUrls when parent data loads async ───────────────────────
    useEffect(() {
      if (initialUrls.isNotEmpty && uploadedUrls.value.isEmpty) {
        uploadedUrls.value = List.from(initialUrls);
        onChanged(uploadedUrls.value);
      }
      return null;
    }, [initialUrls]);

    // ─── Upload mutation ─────────────────────────────────────────────────────
    final uploadMutation = useUploadImages(
      onSuccess: (paths, urls) {
        uploadedUrls.value = [...uploadedUrls.value, ...urls];
        uploadingPaths.value = uploadingPaths.value.difference(paths.toSet());
        pendingPaths.value = pendingPaths.value.difference(paths.toSet());
        onChanged(uploadedUrls.value);
      },
      onError: (paths, error) {
        // Move from in-flight → pending (offline = queued, online = failed).
        uploadingPaths.value = uploadingPaths.value.difference(paths.toSet());
        pendingPaths.value = {...pendingPaths.value, ...paths};
        // Only show snackbar when online; offline failures auto-queue silently.
        if (isOnline) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                '${paths.length} image(s) failed to upload. Tap the retry button to try again.',
              ),
              backgroundColor: Colors.red,
            ),
          );
        }
      },
    );

    // ─── Auto-retry on connectivity restore ──────────────────────────────────
    final wasOnline = useRef<bool?>(null);
    useEffect(() {
      final cameOnline = wasOnline.value == false && isOnline;
      wasOnline.value = isOnline;

      if (cameOnline && pendingPaths.value.isNotEmpty) {
        // Device just came back online — auto-retry every queued/failed path.
        final toRetry = List<String>.from(pendingPaths.value);
        pendingPaths.value = {};
        uploadingPaths.value = {...uploadingPaths.value, ...toRetry};
        uploadMutation.mutate(toRetry);

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Connection restored. Uploading ${toRetry.length} queued image(s)…',
            ),
            backgroundColor: Colors.green,
            duration: const Duration(seconds: 3),
          ),
        );
      }
      return null;
    }, [isOnline]);

    // ─── Helpers ─────────────────────────────────────────────────────────────
    void _pickImages() {
      ImagePickerHelper.showImageSourceDialog(
        context,
        imageQuality: imageQuality,
        onImagesSelected: (images) {
          selectedFiles.value = [...selectedFiles.value, ...images];
          final paths = images.map((f) => f.path).toList();

          if (isOnline) {
            // Online: attempt upload immediately.
            pendingPaths.value = pendingPaths.value.difference(paths.toSet());
            uploadingPaths.value = {...uploadingPaths.value, ...paths};
            uploadMutation.mutate(paths);
          } else {
            // Offline: queue them — they will auto-upload on reconnect.
            pendingPaths.value = {...pendingPaths.value, ...paths};
          }
        },
      );
    }

    void _retryUpload(String path) {
      if (!isOnline) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              'You are offline. Your image will upload automatically when connection is restored.',
            ),
            backgroundColor: Colors.orange,
          ),
        );
        return;
      }
      pendingPaths.value = pendingPaths.value.difference({path});
      uploadingPaths.value = {...uploadingPaths.value, path};
      uploadMutation.mutate([path]);
    }

    void _removeUploadedUrl(String url) {
      uploadedUrls.value = uploadedUrls.value.where((u) => u != url).toList();
      // The uploaded image is also retained as a local XFile so its thumbnail
      // can render instantly from disk. The grid hides that local copy while a
      // matching URL exists — so once the URL is gone we must drop the local
      // copy too, otherwise it resurfaces as a separate tile and the user has
      // to tap × a second time to actually delete the image.
      selectedFiles.value = selectedFiles.value
          .where((f) => !urlMatchesLocalFile(url, f.path))
          .toList();
      onChanged(uploadedUrls.value);
    }

    void _removeSelectedFile(XFile file) {
      selectedFiles.value =
          selectedFiles.value.where((f) => f.path != file.path).toList();
      uploadingPaths.value = uploadingPaths.value.difference({file.path});
      pendingPaths.value = pendingPaths.value.difference({file.path});
    }

    XFile? getLocalFileForUrl(String url) {
      final urlFileName = url.split('/').last.split('?').first;
      for (final file in selectedFiles.value) {
        final localFileName = file.path.split('/').last;
        // Check if the URL filename contains the local filename
        if (urlFileName.contains(localFileName)) {
          return file;
        }
      }
      return null;
    }

    final hasContent =
        uploadedUrls.value.isNotEmpty || selectedFiles.value.isNotEmpty;

    // ─── Build ────────────────────────────────────────────────────────────────
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Offline banner — shown when user has pending uploads
        if (!isOnline && pendingPaths.value.isNotEmpty)
          Container(
            margin: const EdgeInsets.only(bottom: 8),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: Colors.orange.shade50,
              border: Border.all(color: Colors.orange.shade200),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              children: [
                Icon(Icons.wifi_off, size: 16, color: Colors.orange.shade700),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    '${pendingPaths.value.length} image(s) will upload when you\'re back online.',
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.orange.shade800,
                    ),
                  ),
                ),
              ],
            ),
          ),

        // Thumbnail grid
        if (hasContent)
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              // ── Already-uploaded (remote URL) thumbnails ────────────────
              ...uploadedUrls.value.map(
                (url) {
                  final localFile = getLocalFileForUrl(url);
                  return _RemoteImageTile(
                    url: url,
                    localFile: localFile,
                    onRemove: () => _removeUploadedUrl(url),
                    onPreview: () {
                      if (localFile != null) {
                        ImagePreviewDialog.show(context, imageFile: localFile);
                      } else {
                        ImagePreviewDialog.show(context, imageUrl: url);
                      }
                    },
                  );
                },
              ),

              // ── Local (in-flight / pending / uploaded) thumbnails ───────
              ...selectedFiles.value
                  .where((file) => !uploadedUrls.value
                      .any((url) => urlMatchesLocalFile(url, file.path)))
                  .map((file) {
                final isUploading = uploadingPaths.value.contains(file.path);
                final isPending =
                    !isUploading && pendingPaths.value.contains(file.path);

                return _LocalImageTile(
                  file: file,
                  isUploading: isUploading,
                  isPending: isPending,
                  isOnline: isOnline,
                  onRemove: () => _removeSelectedFile(file),
                  onRetry: () => _retryUpload(file.path),
                  onPreview: () =>
                      ImagePreviewDialog.show(context, imageFile: file),
                );
              }),
            ],
          ),

        if (hasContent) const SizedBox(height: 8),

        // Add Photos button
        TextButton.icon(
          onPressed: _pickImages,
          icon: const Icon(
            Icons.add_a_photo,
            size: 16,
            color: AppColors.primaryLight,
          ),
          label: Text(
            !hasContent ? 'Add Photos' : 'Add More Photos',
            style: AppTypography.textTheme.bodyB3Medium
                .copyWith(color: AppColors.primaryLight),
          ),
          style: TextButton.styleFrom(padding: EdgeInsets.zero),
        ),
      ],
    );
  }
}

// ─── Private sub-widgets ─────────────────────────────────────────────────────

/// Thumbnail for a remote (already-uploaded) URL.
/// Works fully offline — shows the cached image and allows removal.
class _RemoteImageTile extends StatelessWidget {
  final String url;
  final XFile? localFile;
  final VoidCallback onRemove;
  final VoidCallback onPreview;

  const _RemoteImageTile({
    required this.url,
    this.localFile,
    required this.onRemove,
    required this.onPreview,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        GestureDetector(
          onTap: onPreview,
          child: ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: localFile != null
                ? FutureBuilder<Uint8List>(
                    future: localFile!.readAsBytes(),
                    builder: (context, snapshot) {
                      if (snapshot.hasData) {
                        return Image.memory(
                          snapshot.data!,
                          width: 64,
                          height: 64,
                          fit: BoxFit.cover,
                        );
                      }
                      return Container(
                        width: 64,
                        height: 64,
                        color: Colors.grey.shade200,
                      );
                    },
                  )
                : Image.network(
                    url,
                    width: 64,
                    height: 64,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Container(
                      width: 64,
                      height: 64,
                      decoration: BoxDecoration(
                        color: Colors.grey.shade200,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(Icons.broken_image, color: Colors.grey),
                    ),
                  ),
          ),
        ),
        Positioned(
          top: 0,
          right: 0,
          child: GestureDetector(
            onTap: onRemove,
            child: Container(
              width: 20,
              height: 20,
              decoration: const BoxDecoration(
                color: Colors.red,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.close, size: 12, color: Colors.white),
            ),
          ),
        ),
      ],
    );
  }
}

/// Thumbnail for a locally-selected file.
///
/// States:
/// - **Uploading**: spinner overlay (in-flight)
/// - **Pending + offline**: grey wifi_off overlay ("Queued")
/// - **Pending + online**: red refresh overlay ("Retry")
/// - **Default**: shows the image, tappable for full preview
class _LocalImageTile extends StatelessWidget {
  final XFile file;
  final bool isUploading;
  final bool isPending;
  final bool isOnline;
  final VoidCallback onRemove;
  final VoidCallback onRetry;
  final VoidCallback onPreview;

  const _LocalImageTile({
    required this.file,
    required this.isUploading,
    required this.isPending,
    required this.isOnline,
    required this.onRemove,
    required this.onRetry,
    required this.onPreview,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Base image
        GestureDetector(
          onTap: isUploading || isPending ? null : onPreview,
          child: ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: FutureBuilder<Uint8List>(
              future: file.readAsBytes(),
              builder: (context, snapshot) {
                if (snapshot.hasData) {
                  return Image.memory(
                    snapshot.data!,
                    width: 64,
                    height: 64,
                    fit: BoxFit.cover,
                  );
                }
                return Container(
                  width: 64,
                  height: 64,
                  color: Colors.grey.shade200,
                );
              },
            ),
          ),
        ),

        // Remove (×) button — always available regardless of connectivity
        Positioned(
          top: 0,
          right: 0,
          child: GestureDetector(
            onTap: onRemove,
            child: Container(
              width: 20,
              height: 20,
              decoration: const BoxDecoration(
                color: Colors.red,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.close, size: 12, color: Colors.white),
            ),
          ),
        ),

        // ── Uploading spinner overlay ──────────────────────────────────────
        if (isUploading)
          Positioned.fill(
            child: ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: Container(
                color: Colors.black54,
                child: const Center(
                  child: SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                    ),
                  ),
                ),
              ),
            ),
          ),

        // ── Pending overlay ────────────────────────────────────────────────
        // Offline → "Queued" (grey, wifi_off, auto-retries on reconnect)
        // Online  → "Failed" (red, refresh icon, manual tap to retry)
        if (isPending)
          Positioned.fill(
            child: GestureDetector(
              onTap: onRetry,
              child: ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: Container(
                  // ignore: deprecated_member_use
                  color: isOnline
                      // ignore: deprecated_member_use
                      ? Colors.red.withOpacity(0.80)
                      // ignore: deprecated_member_use
                      : Colors.grey.shade700.withOpacity(0.80),
                  child: Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          isOnline ? Icons.refresh : Icons.wifi_off,
                          color: Colors.white,
                          size: 18,
                        ),
                        const SizedBox(height: 2),
                        Text(
                          isOnline ? 'Retry' : 'Queued',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }
}
