import 'dart:async';
import '../services/photo_upload_manager.dart';
import 'auth.dart';

PhotoUploadManager usePhotoUploadManager() {
  Future<String> uploadCallback(String localPath) async {
    final completer = Completer<String>();

    final mutation = useUploadImages(
      onSuccess: (_, urls) {
        if (urls.isNotEmpty) {
          completer.complete(urls.first);
        } else {
          completer.completeError('No URL returned from upload');
        }
      },
      onError: (_, error) {
        completer.completeError(error);
      },
    );

    mutation.mutate([localPath]);
    return completer.future;
  }

  return PhotoUploadManager(uploadCallback);
}
