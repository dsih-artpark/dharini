import 'package:flutter/material.dart';
import '../theme/spacing.dart';

enum ProgressVariant {
  determinate,
  indeterminate,
}

class Progress extends StatefulWidget {
  const Progress({
    super.key,
    this.value,
    this.variant = ProgressVariant.determinate,
    this.height,
    this.color,
    this.backgroundColor,
    this.borderRadius,
    this.duration = const Duration(milliseconds: 1500),
    this.semanticsLabel,
    this.semanticsValue,
  }) : assert(
          variant == ProgressVariant.indeterminate || value != null,
          'Value must be provided for determinate progress',
        );

  /// The current progress value, between 0.0 and 1.0.
  /// Required for determinate variant.
  final double? value;

  /// The variant of the progress bar
  /// Defaults to [ProgressVariant.determinate]
  final ProgressVariant variant;

  /// Height of the progress bar
  /// Defaults to Spacing.space(1) which is 4
  final double? height;

  /// The color of the progress indicator
  /// Defaults to Theme.colorScheme.primary
  final Color? color;

  /// The color of the progress background
  /// Defaults to Theme.colorScheme.surface
  final Color? backgroundColor;

  /// Border radius of the progress bar
  /// Defaults to BorderRadius.circular(Spacing.space(2))
  final BorderRadius? borderRadius;

  /// Animation duration for indeterminate variant
  /// Defaults to 1500ms
  final Duration duration;

  /// Semantic label for accessibility
  final String? semanticsLabel;

  /// Semantic value for accessibility
  final String? semanticsValue;

  @override
  State<Progress> createState() => _ProgressState();
}

class _ProgressState extends State<Progress>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    if (widget.variant == ProgressVariant.indeterminate) {
      _controller = AnimationController(
        vsync: this,
        duration: widget.duration,
      );

      _animation = Tween<double>(
        begin: 0,
        end: 1,
      ).animate(
        CurvedAnimation(
          parent: _controller,
          // Use emphasized easing curve for Material 3 feel
          curve: Curves.easeInOut,
        ),
      );

      _controller.repeat();
    }
  }

  @override
  void dispose() {
    if (widget.variant == ProgressVariant.indeterminate) {
      _controller.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);

    final double effectiveHeight = widget.height ?? Spacing.space(1);
    final Color effectiveColor = widget.color ?? theme.colorScheme.primary;
    final Color effectiveBackgroundColor =
        widget.backgroundColor ?? theme.colorScheme.surface;
    final BorderRadius effectiveBorderRadius =
        widget.borderRadius ?? BorderRadius.circular(Spacing.space(2));

    return SizedBox(
      height: effectiveHeight,
      child: ClipRRect(
        borderRadius: effectiveBorderRadius,
        child: widget.variant == ProgressVariant.determinate
            ? LinearProgressIndicator(
                value: widget.value,
                backgroundColor: effectiveBackgroundColor,
                color: effectiveColor,
                semanticsLabel: widget.semanticsLabel,
                semanticsValue: widget.semanticsValue,
                borderRadius: effectiveBorderRadius,
                minHeight: effectiveHeight,
              )
            : AnimatedBuilder(
                animation: _animation,
                builder: (BuildContext context, Widget? child) => CustomPaint(
                  painter: _IndeterminateProgressPainter(
                    color: effectiveColor,
                    backgroundColor: effectiveBackgroundColor,
                    progress: _animation.value,
                  ),
                  child: const SizedBox.expand(),
                ),
              ),
      ),
    );
  }
}

class _IndeterminateProgressPainter extends CustomPainter {
  _IndeterminateProgressPainter({
    required this.color,
    required this.backgroundColor,
    required this.progress,
  });

  final Color color;
  final Color backgroundColor;
  final double progress;

  @override
  void paint(Canvas canvas, Size size) {
    final Paint paint = Paint()
      ..color = backgroundColor
      ..style = PaintingStyle.fill;

    // Draw background
    canvas.drawRect(Offset.zero & size, paint);

    // Calculate indeterminate animation
    paint.color = color;

    // First part of animation - moving right
    const double width = 0.25; // 25% of total width
    final double x = size.width * (progress * (1 + width) - width);

    canvas.drawRect(
      Rect.fromLTWH(x, 0, size.width * width, size.height),
      paint,
    );
  }

  @override
  bool shouldRepaint(_IndeterminateProgressPainter oldDelegate) =>
      oldDelegate.progress != progress ||
      oldDelegate.color != color ||
      oldDelegate.backgroundColor != backgroundColor;
}
