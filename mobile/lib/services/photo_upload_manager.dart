import 'dart:async';
import 'dart:io';
import 'package:es_client/es_client.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_image_compress/flutter_image_compress.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as path;
import 'database_service.dart';
import '../hooks/auth.dart';

typedef UploadPhotoCallback = Future<String> Function(String localPath);

class PhotoUploadResult {
  final String localPath;
  final String? s3Url;
  final String? error;

  PhotoUploadResult({
    required this.localPath,
    this.s3Url,
    this.error,
  });
}

class PhotoUploadManager {
  final UploadPhotoCallback _uploadCallback;

  /// Maximum file size in bytes (1 MB)
  static const int maxFileSize = 1 * 1024 * 1024;

  /// Target quality for compression (0-100)
  static const int compressionQuality = 80;

  /// Maximum dimension for images (width or height)
  static const int maxDimension = 1920;

  PhotoUploadManager(this._uploadCallback);

  /// Whether [pathOrUrl] is an already-uploaded remote URL rather than a local
  /// file path. Visit-level and site photos are uploaded eagerly at capture and
  /// stored as `https://…` S3 URLs; those must NOT be re-uploaded (reading a URL
  /// as a local file throws `PathNotFoundException`).
  static bool isRemoteUrl(String pathOrUrl) =>
      pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://');

  /// Compress an image
  static Future<String> compressImage(String localPath) async {
    if (kIsWeb) {
      return localPath;
    }
    try {
      final file = File(localPath);
      if (!await file.exists()) {
        debugPrint('[Compress] File does not exist: $localPath');
        return localPath;
      }

      final fileSize = await file.length();
      debugPrint(
          '[Compress] Original file size: ${(fileSize / 1024 / 1024).toStringAsFixed(2)} MB');

      // Get temp directory for compressed file
      final tempDir = await getTemporaryDirectory();
      final fileName = path.basename(localPath);
      final compressedPath = path.join(tempDir.path,
          'compressed_${DateTime.now().millisecondsSinceEpoch}_$fileName');

      debugPrint('[Compress] Compressing image to: $compressedPath');

      // Compress the image
      final compressedFile = await FlutterImageCompress.compressAndGetFile(
        localPath,
        compressedPath,
        quality: compressionQuality,
        minWidth: maxDimension,
        minHeight: maxDimension,
        keepExif: false,
      );

      if (compressedFile != null) {
        final compressedSize = await compressedFile.length();
        debugPrint(
            '[Compress] Compressed file size: ${(compressedSize / 1024 / 1024).toStringAsFixed(2)} MB');
        debugPrint(
            '[Compress] Compression ratio: ${((1 - compressedSize / fileSize) * 100).toStringAsFixed(1)}% reduction');
        return compressedFile.path;
      } else {
        debugPrint('[Compress] Compression failed, using original');
        return localPath;
      }
    } catch (e) {
      debugPrint('[Compress] Error compressing image: $e');
      return localPath; // Return original path on error
    }
  }

  /// Upload a single photo
  Future<PhotoUploadResult> uploadPhoto(String localPath) async {
    // Already-uploaded photos arrive as remote URLs (e.g. visit photos uploaded
    // at capture). They are not local files — return them as-is instead of
    // trying to read them from disk.
    if (isRemoteUrl(localPath)) {
      return PhotoUploadResult(localPath: localPath, s3Url: localPath);
    }
    try {
      final url = await _uploadCallback(localPath);
      return PhotoUploadResult(
        localPath: localPath,
        s3Url: url,
      );
    } catch (e) {
      debugPrint('Error uploading photo $localPath: $e');
      String errorMessage = e.toString();
      if (errorMessage.startsWith('Exception: ')) {
        errorMessage = errorMessage.substring(11);
      }
      return PhotoUploadResult(
        localPath: localPath,
        error: errorMessage,
      );
    }
  }

  /// Upload multiple photos concurrently with progress tracking
  Future<List<PhotoUploadResult>> uploadPhotos(
    List<String> localPaths, {
    void Function(double)? onProgress,
  }) async {
    final results = <PhotoUploadResult>[];
    int completed = 0;
    print('uploadPhotos: $localPaths');
    // Process photos in batches of 3 to avoid overwhelming the network
    const batchSize = 3;
    for (var i = 0; i < localPaths.length; i += batchSize) {
      final end = (i + batchSize < localPaths.length)
          ? i + batchSize
          : localPaths.length;
      final batch = localPaths.sublist(i, end);

      final batchResults = await Future.wait(
        batch.map((path) => uploadPhoto(path)),
      );

      results.addAll(batchResults);
      completed += batch.length;

      if (onProgress != null) {
        onProgress(completed / localPaths.length);
      }
    }
    print('photo upload results: $results');
    return results;
  }

  /// Upload a single photo with persistent mapping
  Future<PhotoUploadResult> uploadPhotoWithMapping(String localPath) async {
    // Skip already-uploaded remote URLs — they are not local files and have no
    // local→S3 mapping entry. Return the URL as the final destination.
    if (isRemoteUrl(localPath)) {
      return PhotoUploadResult(localPath: localPath, s3Url: localPath);
    }
    final existingUrl = DatabaseService.getS3UrlForPhoto(localPath);
    if (existingUrl != null) {
      return PhotoUploadResult(localPath: localPath, s3Url: existingUrl);
    }
    final result = await uploadPhoto(localPath);
    if (result.s3Url != null) {
      await DatabaseService.savePhotoS3Url(localPath, result.s3Url!);
    }
    return result;
  }

  /// Upload multiple photos with persistent mapping
  Future<List<PhotoUploadResult>> uploadPhotosWithMapping(
    List<String> localPaths, {
    void Function(double)? onProgress,
  }) async {
    final results = <PhotoUploadResult>[];
    int completed = 0;
    const batchSize = 3;
    for (var i = 0; i < localPaths.length; i += batchSize) {
      final end = (i + batchSize < localPaths.length)
          ? i + batchSize
          : localPaths.length;
      final batch = localPaths.sublist(i, end);
      final batchResults = await Future.wait(
        batch.map((path) => uploadPhotoWithMapping(path)),
      );
      results.addAll(batchResults);
      completed += batch.length;
      if (onProgress != null) {
        onProgress(completed / localPaths.length);
      }
    }
    return results;
  }

  /// Static helper for background upload using uploadImages from auth.dart
  static Future<String> uploadPhotoToApi(
      EsClient client, String localPath) async {
    final pathToUpload = await compressImage(localPath);
    final response = await uploadImages(client, [pathToUpload]);

    if (!response.success) {
      throw Exception(response.message);
    }

    if (response.data.isEmpty) {
      throw Exception('Server reported success but no file data was returned');
    }

    final firstFile = response.data.first;
    if (!firstFile.uploaded) {
      throw Exception('Server failed to process the image upload');
    }

    final url = firstFile.fileUrl ?? firstFile.publicUrl;
    if (url == null) {
      throw Exception('Image uploaded but no URL was returned by server');
    }

    return url;
  }
}
