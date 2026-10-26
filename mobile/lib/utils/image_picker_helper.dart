import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

class ImagePickerHelper {
  static Future<void> _getImage({
    required ImageSource source,
    required int imageQuality,
    required void Function(List<XFile>) onImagesSelected,
  }) async {
    try {
      final XFile? image = await ImagePicker().pickImage(
        source: source,
        imageQuality: imageQuality,
      );
      if (image != null) {
        onImagesSelected([image]);
      }
    } catch (e) {
      debugPrint('Error picking image: $e');
    }
  }

  static Future<void> _getMultipleImages({
    required int imageQuality,
    required void Function(List<XFile>) onImagesSelected,
  }) async {
    try {
      final List<XFile>? images = await ImagePicker().pickMultiImage(
        imageQuality: imageQuality,
      );
      if (images != null && images.isNotEmpty) {
        onImagesSelected(images);
      }
    } catch (e) {
      debugPrint('Error picking multiple images: $e');
    }
  }

  static Future<void> showImageSourceDialog(
    BuildContext context, {
    required void Function(List<XFile>) onImagesSelected,
    int imageQuality = 70,
  }) {
    return showDialog<void>(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Select Image Source'),
          content: SingleChildScrollView(
            child: ListBody(
              children: <Widget>[
                GestureDetector(
                  child: const Padding(
                    padding: EdgeInsets.all(8.0),
                    child: Text('Camera'),
                  ),
                  onTap: () {
                    Navigator.of(context).pop();
                    _getImage(
                      source: ImageSource.camera,
                      imageQuality: imageQuality,
                      onImagesSelected: onImagesSelected,
                    );
                  },
                ),
                const Divider(),
                GestureDetector(
                  child: const Padding(
                    padding: EdgeInsets.all(8.0),
                    child: Text('Gallery (Single)'),
                  ),
                  onTap: () {
                    Navigator.of(context).pop();
                    _getImage(
                      source: ImageSource.gallery,
                      imageQuality: imageQuality,
                      onImagesSelected: onImagesSelected,
                    );
                  },
                ),
                const Divider(),
                GestureDetector(
                  child: const Padding(
                    padding: EdgeInsets.all(8.0),
                    child: Text('Gallery (Multiple)'),
                  ),
                  onTap: () {
                    Navigator.of(context).pop();
                    _getMultipleImages(
                      imageQuality: imageQuality,
                      onImagesSelected: onImagesSelected,
                    );
                  },
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
