import 'package:flutter/material.dart';

import '../theme/corners.dart';
import '../theme/spacing.dart';

class Downloadable extends StatelessWidget {
  const Downloadable({
    required this.fileUrl,
    required this.fileName,
    required this.onTap,
    super.key,
    this.fileType,
  });

  /// The URL of the file to download
  final String fileUrl;

  /// The name of the file to display
  final String fileName;

  /// Optional file type override. If not provided, will be inferred from extension
  final String? fileType;

  /// Callback when the widget is tapped
  final VoidCallback onTap;

  /// Get file type from extension if not provided
  String get _fileType {
    if (fileType != null) return fileType!.toUpperCase();

    // Simple extension extraction without external dependency
    final int lastDot = fileUrl.lastIndexOf('.');
    if (lastDot != -1 && lastDot < fileUrl.length - 1) {
      return fileUrl.substring(lastDot + 1).toUpperCase();
    }
    return 'FILE';
  }

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;

    return Card(
      elevation: 0,
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(
        borderRadius: Corners.borderSm,
        side: BorderSide(color: colorScheme.outline),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: Corners.borderSm,
        child: IntrinsicHeight(
          child: Row(
            children: <Widget>[
              // File Icon
              Container(
                padding: Spacing.p(4),
                decoration: BoxDecoration(
                  color: Colors.transparent,
                  borderRadius: Corners.borderSm,
                  border: Border(right: BorderSide(color: colorScheme.outline)),
                ),
                child: Center(
                  child: Icon(
                    Icons.insert_drive_file_outlined,
                    color: colorScheme.primary,
                  ),
                ),
              ),
              // File Details
              Expanded(
                child: Padding(
                  padding: Spacing.p(4),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      Text(
                        fileName,
                        style: theme.textTheme.bodyMedium?.copyWith(
                          color: colorScheme.onSurfaceVariant,
                          fontWeight: FontWeight.w500,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      SizedBox(height: Spacing.space(1)),
                      Text(
                        _fileType,
                        style: theme.textTheme.labelSmall?.copyWith(
                          color: colorScheme.onSurface,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              // Arrow Icon
              Padding(
                padding: Spacing.p(4),
                child: Icon(
                  Icons.chevron_right,
                  color: colorScheme.onSurfaceVariant,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
