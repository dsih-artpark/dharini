import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:image_picker/image_picker.dart';

class ImagePreviewDialog extends StatelessWidget {
  final XFile? imageFile;
  final String? imageUrl;

  const ImagePreviewDialog({
    super.key,
    this.imageFile,
    this.imageUrl,
  }) : assert(imageFile != null || imageUrl != null,
            'Either imageFile or imageUrl must be provided');

  static void show(BuildContext context,
      {XFile? imageFile, String? imageUrl}) {
    showGeneralDialog(
      context: context,
      barrierColor: Colors.black.withOpacity(0.9),
      barrierDismissible: true,
      barrierLabel: 'Close',
      pageBuilder: (context, animation, secondaryAnimation) {
        return ImagePreviewDialog(imageFile: imageFile, imageUrl: imageUrl);
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: Stack(
        fit: StackFit.expand,
        children: [
          // Image Viewer
          InteractiveViewer(
            panEnabled: true,
            minScale: 0.5,
            maxScale: 4.0,
            child: Center(
              child: imageFile != null
                  ? FutureBuilder<Uint8List>(
                      future: imageFile!.readAsBytes(),
                      builder: (context, snapshot) {
                        if (snapshot.hasData) {
                          return Image.memory(snapshot.data!);
                        }
                        return const CircularProgressIndicator();
                      },
                    )
                  : CachedNetworkImage(
                      imageUrl: imageUrl!,
                      placeholder: (context, url) =>
                          const CircularProgressIndicator(),
                      errorWidget: (context, url, error) =>
                          const Icon(Icons.error, color: Colors.white),
                    ),
            ),
          ),
          // Close button
          Positioned(
            top: MediaQuery.of(context).padding.top + 16,
            right: 16,
            child: Container(
              decoration: const BoxDecoration(
                color: Colors.black54,
                shape: BoxShape.circle,
              ),
              child: IconButton(
                icon: const Icon(Icons.close, color: Colors.white, size: 24),
                onPressed: () => Navigator.of(context).pop(),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
