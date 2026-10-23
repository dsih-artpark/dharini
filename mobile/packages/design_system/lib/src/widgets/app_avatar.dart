import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../theme/spacing.dart';

enum AvatarSize {
  small,
  medium,
  large,
  flexible,
}

class Avatar extends StatelessWidget {
  const Avatar({
    super.key,
    this.imageUrl,
    this.placeholder,
    this.size = AvatarSize.medium,
    this.borderRadius,
    this.backgroundColor,
    this.fit = BoxFit.cover,
    this.onTap,
  });

  /// The URL of the avatar image
  final String? imageUrl;

  /// Text to show initials from when image is not available
  final String? placeholder;

  /// Size of the avatar - defaults to medium
  final AvatarSize size;

  /// Optional border radius override
  final BorderRadius? borderRadius;

  /// Background color - defaults to theme secondary
  final Color? backgroundColor;

  /// How to fit the image within bounds
  final BoxFit fit;

  /// Optional callback when avatar is tapped
  final VoidCallback? onTap;

  double _getDimension(BuildContext context) {
    switch (size) {
      case AvatarSize.small:
        return Spacing.space(8);
      case AvatarSize.medium:
        return Spacing.space(12);
      case AvatarSize.large:
        return Spacing.space(24);
      case AvatarSize.flexible:
        return double.infinity;
    }
  }

  TextStyle _getAdaptiveTextStyle(BuildContext context) {
    final ThemeData theme = Theme.of(context);

    // Use text styles from theme
    switch (size) {
      case AvatarSize.small:
        return theme.textTheme.bodySmall!; // 14px
      case AvatarSize.medium:
        return theme.textTheme.bodyLarge!; // 20px
      case AvatarSize.large:
        return theme.textTheme.displayLarge!; // 24px
      case AvatarSize.flexible:
        return theme.textTheme.bodyLarge!; // Default to 20px
    }
  }

  String _getInitials(String text) =>
      text.substring(0, math.min(2, text.length)).toUpperCase();

  Widget _buildFallback(BuildContext context, Color bgColor) {
    if (placeholder == null) return const SizedBox.shrink();

    return Container(
      color: bgColor,
      alignment: Alignment.center,
      padding: Spacing.p(2),
      child: Text(
        _getInitials(placeholder!),
        style: _getAdaptiveTextStyle(context).copyWith(
          color: Theme.of(context).colorScheme.onPrimary,
          fontWeight: Theme.of(context).textTheme.bodyLarge!.fontWeight,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final ColorScheme colorScheme = Theme.of(context).colorScheme;

    final double avatarSize = _getDimension(context);
    final BorderRadius effectiveBorderRadius =
        borderRadius ?? BorderRadius.circular(avatarSize / 2);
    final Color effectiveBackgroundColor =
        backgroundColor ?? colorScheme.secondary;

    Widget avatar;
    if (imageUrl != null) {
      avatar = Image.network(
        imageUrl!,
        fit: fit,
        errorBuilder:
            (BuildContext context, Object error, StackTrace? stackTrace) =>
                _buildFallback(context, effectiveBackgroundColor),
      );
    } else {
      avatar = _buildFallback(context, effectiveBackgroundColor);
    }

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        customBorder: RoundedRectangleBorder(
          borderRadius: effectiveBorderRadius,
        ),
        child: Container(
          width: size == AvatarSize.flexible ? null : avatarSize,
          height: size == AvatarSize.flexible ? null : avatarSize,
          constraints: size == AvatarSize.flexible
              ? const BoxConstraints.expand()
              : null,
          decoration: BoxDecoration(
            color: effectiveBackgroundColor,
            borderRadius: effectiveBorderRadius,
          ),
          clipBehavior: Clip.antiAlias,
          child: avatar,
        ),
      ),
    );
  }
}
