import 'package:flutter_test/flutter_test.dart';
import 'package:es_platform_mobile/services/photo_upload_manager.dart';

void main() {
  group('PhotoUploadManager.isRemoteUrl', () {
    test('detects http/https URLs and rejects local paths', () {
      expect(PhotoUploadManager.isRemoteUrl('https://s3.amazonaws.com/x.jpg'),
          isTrue);
      expect(PhotoUploadManager.isRemoteUrl('http://example.com/x.jpg'), isTrue);
      expect(PhotoUploadManager.isRemoteUrl('/data/user/0/app/cache/x.jpg'),
          isFalse);
      expect(PhotoUploadManager.isRemoteUrl('file_compressed_123_x.jpg'),
          isFalse);
    });
  });

  group('PhotoUploadManager.uploadPhoto remote-URL passthrough', () {
    test(
        'returns an already-uploaded URL as its s3Url WITHOUT invoking the upload callback',
        () async {
      var callbackInvoked = false;
      final manager = PhotoUploadManager((path) async {
        callbackInvoked = true;
        return 'unexpected-upload';
      });

      const url =
          'https://s3.ap-south-1.amazonaws.com/dsih-artpark-04-staging-data/demo/x.jpg';
      final result = await manager.uploadPhoto(url);

      expect(callbackInvoked, isFalse,
          reason: 'a URL must not be re-uploaded / read as a file');
      expect(result.error, isNull);
      expect(result.s3Url, url);
      expect(result.localPath, url);
    });

    test('still uploads genuine local paths via the callback', () async {
      String? uploadedPath;
      final manager = PhotoUploadManager((path) async {
        uploadedPath = path;
        return 'https://s3.amazonaws.com/uploaded.jpg';
      });

      final result = await manager.uploadPhoto('/data/local/photo.jpg');

      expect(uploadedPath, '/data/local/photo.jpg');
      expect(result.error, isNull);
      expect(result.s3Url, 'https://s3.amazonaws.com/uploaded.jpg');
    });
  });
}
