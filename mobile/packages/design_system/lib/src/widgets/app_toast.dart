import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../theme/colors.dart';
import '../theme/spacing.dart';
import '../theme/typography.dart';

enum ToastVariant {
  info, // Blue
  success, // Green
  error, // Red
  warning // Yellow/Orange
}

class Toast extends StatefulWidget {
  const Toast({
    required this.message,
    super.key,
    this.variant = ToastVariant.info,
    this.action,
    this.actionLabel,
    this.duration = const Duration(seconds: 5),
    this.onDismiss,
    this.width,
    this.position,
  });

  final String message;
  final ToastVariant variant;
  final VoidCallback? action;
  final String? actionLabel;
  final Duration duration;
  final VoidCallback? onDismiss;
  final double? width;
  final Alignment? position;

  @override
  State<Toast> createState() => _ToastState();
}

class _ToastState extends State<Toast> with SingleTickerProviderStateMixin {
  bool _isVisible = true;
  bool _isHovered = false;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _startTimer();
  }

  void _startTimer() {
    _timer?.cancel();
    _timer = Timer(widget.duration, () {
      if (mounted && !_isHovered) {
        _dismiss();
      }
    });
  }

  void _dismiss() {
    setState(() => _isVisible = false);
    widget.onDismiss?.call();
  }

  IconData _getIcon() {
    switch (widget.variant) {
      case ToastVariant.info:
        return Icons.info;
      case ToastVariant.success:
        return Icons.check_circle;
      case ToastVariant.error:
        return Icons.error;
      case ToastVariant.warning:
        return Icons.warning;
    }
  }

  Color _getBackgroundColor(ThemeData theme) {
    if (_isHovered) {
      return switch (widget.variant) {
        ToastVariant.info => AppColors.infoLight.withOpacity(0.1),
        ToastVariant.success => AppColors.successLight.withOpacity(0.1),
        ToastVariant.error => AppColors.errorLight.withOpacity(0.1),
        ToastVariant.warning => AppColors.warningLight.withOpacity(0.1),
      };
    }

    return switch (widget.variant) {
      ToastVariant.info => AppColors.infoLight,
      ToastVariant.success => AppColors.successLight,
      ToastVariant.error => AppColors.errorLight,
      ToastVariant.warning => AppColors.warningLight,
    };
  }

  Color _getTextColor(ThemeData theme) => switch (widget.variant) {
        ToastVariant.info => AppColors.onInfoLight,
        ToastVariant.success => AppColors.onSuccessLight,
        ToastVariant.error => AppColors.onErrorLight,
        ToastVariant.warning => AppColors.onWarningLight,
      };

  Color _getBorderColor(ThemeData theme) => switch (widget.variant) {
        ToastVariant.info => AppColors.infoDark,
        ToastVariant.success => AppColors.successDark,
        ToastVariant.error => AppColors.errorDark,
        ToastVariant.warning => AppColors.warningDark,
      };

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);

    return Align(
      alignment: widget.position ?? Alignment.topCenter,
      child: MouseRegion(
        onEnter: (_) => setState(() => _isHovered = true),
        onExit: (_) {
          setState(() => _isHovered = false);
          _startTimer();
        },
        child: Animate(
          effects: <Effect<dynamic>>[
            SlideEffect(
              begin: const Offset(0, -1),
              end: Offset.zero,
              duration: 300.milliseconds,
              curve: Curves.easeOut,
            ),
            FadeEffect(
              begin: 0,
              end: 1,
              duration: 300.milliseconds,
            ),
          ],
          child: AnimatedOpacity(
            opacity: _isVisible ? 1.0 : 0.0,
            duration: 200.milliseconds,
            child: Container(
              width: widget.width ?? MediaQuery.of(context).size.width,
              margin: Spacing.m(2),
              padding: Spacing.pxy(2, 1),
              decoration: BoxDecoration(
                color: _getBackgroundColor(theme),
                borderRadius: BorderRadius.circular(Spacing.space(1)),
                border: Border.all(
                  color: _getBorderColor(theme),
                ),
              ),
              child: Row(
                children: <Widget>[
                  Icon(
                    _getIcon(),
                    color: _getTextColor(theme),
                    size: 20,
                  ),
                  SizedBox(width: Spacing.space(3)),
                  Expanded(
                    child: Text(
                      widget.message,
                      style: AppTypography.textTheme.bodySmall?.copyWith(
                        color: _getTextColor(theme),
                      ),
                    ),
                  ),
                  if (widget.action != null &&
                      widget.actionLabel != null) ...<Widget>[
                    SizedBox(width: Spacing.space(3)),
                    TextButton(
                      onPressed: widget.action,
                      style: TextButton.styleFrom(
                        foregroundColor: _getTextColor(theme),
                      ),
                      child: Text(
                        widget.actionLabel!,
                        style: AppTypography.textTheme.bodySmall?.copyWith(
                          color: _getTextColor(theme),
                        ),
                      ),
                    ),
                  ],
                  SizedBox(width: Spacing.space(2)),
                  IconButton(
                    icon: const Icon(Icons.close),
                    iconSize: 18,
                    onPressed: _dismiss,
                    color: _getTextColor(theme),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }
}

// Toast service to manage showing/hiding toasts
class ToastService extends ChangeNotifier {
  factory ToastService() => _instance;
  ToastService._internal();
  static final ToastService _instance = ToastService._internal();

  final List<OverlayEntry> _entries = <OverlayEntry>[];

  void show({
    required BuildContext context,
    required String message,
    ToastVariant variant = ToastVariant.info,
    VoidCallback? action,
    String? actionLabel,
    Duration duration = const Duration(seconds: 5),
    double? width,
    Alignment? position,
  }) {
    late final OverlayEntry overlay;
    overlay = OverlayEntry(
      builder: (BuildContext context) => Toast(
        message: message,
        variant: variant,
        action: action,
        actionLabel: actionLabel,
        duration: duration,
        width: width,
        position: position,
        onDismiss: () {
          _entries.remove(overlay);
          overlay.remove();
          notifyListeners();
        },
      ),
    );

    _entries.add(overlay);
    Overlay.of(context).insert(overlay);
    notifyListeners();
  }

  void dismissAll() {
    for (final OverlayEntry entry in _entries) {
      entry.remove();
    }
    _entries.clear();
    notifyListeners();
  }
}
