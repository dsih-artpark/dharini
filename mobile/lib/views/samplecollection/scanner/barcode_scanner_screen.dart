import 'dart:async';

import 'package:audioplayers/audioplayers.dart';
import 'package:es_platform_mobile/hooks/barcode_validator.dart';
import 'package:es_platform_mobile/providers/connectivity_provider.dart';
import 'package:es_platform_mobile/services/barcode_validator_service.dart';
import 'package:es_platform_mobile/utils/extensions/index.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:vibration/vibration.dart';

import 'manual_entry_sheet.dart';
import 'scan_confirm_sheet.dart';
import 'scan_session.dart';
import 'scan_session_dock.dart';
import 'scanner_theme.dart';
import 'scanner_viewfinder.dart';

/// What the scanner is doing right now.
enum ScannerPhase {
  /// Camera live, looking for a barcode.
  scanning,

  /// Camera frozen, a barcode is in hand awaiting the collector's decision.
  confirming,

  /// Camera paused by the collector.
  paused,
}

/// A continuous barcode scanning session.
///
/// The screen stays open across many scans and returns every barcode it took
/// as a `List<String>`. Nothing is committed without an explicit tap — there is
/// no auto-proceed.
///
/// [maxCount] of 1 (the default) closes the screen as soon as one barcode is
/// accepted, which suits a single row's scan button. Anything higher keeps the
/// session open until the collector taps Done or fills every slot.
class BarcodeScannerScreen extends HookWidget {
  const BarcodeScannerScreen({
    required this.visitId,
    this.maxCount = 1,
    this.existingBarcodes,
    this.alreadyScanned = 0,
    this.totalCount,
    this.sampleType,
    super.key,
  });

  final String visitId;

  /// How many barcodes this session may take before it closes.
  final int maxCount;

  /// Barcodes already assigned elsewhere. Callers re-scanning a specific row
  /// must omit that row's own barcode so it is not read as a duplicate.
  final List<String>? existingBarcodes;

  /// Barcodes assigned before this session opened, for the progress readout.
  final int alreadyScanned;

  /// Total slots in the group, for the progress readout.
  final int? totalCount;

  /// Shown in the title so the collector knows which group they are filling.
  final String? sampleType;

  @override
  Widget build(BuildContext context) {
    final BarcodeValidatorService validator = useBarcodeValidator();

    // Created once for the life of the screen: a fresh `existingBarcodes` list
    // identity from a rebuild must not reset a session in progress.
    final ScanSession session = useMemoized(
      () => ScanSession(
        maxCount: maxCount,
        existingBarcodes: existingBarcodes ?? const <String>[],
        alreadyScanned: alreadyScanned,
        totalCount: totalCount,
      ),
    );

    // Rebuild trigger for the session's internal list.
    final ValueNotifier<int> revision = useState(0);
    void touch() => revision.value++;

    final ValueNotifier<ScannerPhase> phase = useState(ScannerPhase.scanning);
    final ValueNotifier<String> candidate = useState('');
    final ValueNotifier<ScanVerdict> verdict = useState(ScanVerdict.checking);
    final ValueNotifier<String?> rejection = useState<String?>(null);

    // The barcode just accepted. The camera is still pointing at it, so it is
    // ignored until a different code comes into view. This is what makes
    // back-to-back scanning feel continuous without the platform-level
    // `noDuplicates` mode, which would also block a deliberate re-scan.
    final ValueNotifier<String?> suppressed = useState<String?>(null);

    final MobileScannerController camera = useMemoized(
      () => MobileScannerController(
        formats: const <BarcodeFormat>[
          BarcodeFormat.code128,
          BarcodeFormat.code39,
          BarcodeFormat.code93,
          BarcodeFormat.qrCode,
          BarcodeFormat.dataMatrix,
          BarcodeFormat.ean13,
          BarcodeFormat.ean8,
          BarcodeFormat.upcA,
          BarcodeFormat.upcE,
        ],
        cameraResolution: const Size(1920, 1080),
        detectionSpeed: DetectionSpeed.normal,
        detectionTimeoutMs: 250,
        facing: CameraFacing.back,
        torchEnabled: false,
      ),
    );

    final AudioPlayer player = useMemoized(AudioPlayer.new);

    useEffect(() {
      return () {
        player.dispose();
        camera.dispose();
      };
    }, const <Object?>[]);

    final AnimationController sweep = useAnimationController(
      duration: const Duration(milliseconds: 2000),
    );
    final bool reducedMotion = ScannerTheme.prefersReducedMotion(context);
    final bool isLive = phase.value == ScannerPhase.scanning;

    useEffect(() {
      if (isLive && !reducedMotion) {
        sweep.repeat();
      } else {
        sweep.stop();
      }
      return null;
    }, <Object?>[isLive, reducedMotion, sweep]);

    Future<void> buzz(int milliseconds) async {
      try {
        if (await Vibration.hasVibrator()) {
          await Vibration.vibrate(duration: milliseconds);
        }
      } catch (_) {
        // Haptics are a nicety; a device without them must not break a scan.
      }
    }

    Future<void> chime() async {
      try {
        await player.play(AssetSource('sounds/beep.mp3'));
      } catch (_) {
        // Same: audio feedback is optional.
      }
    }

    Future<void> startCamera() async {
      try {
        await camera.start();
      } catch (_) {
        // Thrown when the controller is already disposed or mid-teardown.
      }
    }

    Future<void> stopCamera() async {
      try {
        await camera.stop();
      } catch (_) {}
    }

    /// Closes the scanner, handing back everything taken so far. Used by Done,
    /// the back button, and the final accept of a full session — a partial
    /// session is never discarded.
    void finish() {
      if (!context.mounted) return;
      context.pop(session.accepted);
    }

    void backToScanning() {
      candidate.value = '';
      rejection.value = null;
      verdict.value = ScanVerdict.checking;
      phase.value = ScannerPhase.scanning;
    }

    /// Takes a barcode through the duplicate and remote checks and parks it in
    /// the confirm sheet. This is the only place validation happens; callers no
    /// longer re-check what the scanner already cleared.
    Future<void> present(String raw) async {
      final String code = raw.trim();
      if (code.isEmpty) return;

      candidate.value = code;
      rejection.value = null;
      verdict.value = ScanVerdict.checking;
      phase.value = ScannerPhase.confirming;
      await stopCamera();

      final ScanRejection? local = session.check(code);
      if (local != null) {
        rejection.value = session.messageFor(local, code);
        verdict.value = ScanVerdict.rejected;
        unawaited(buzz(400));
        return;
      }

      if (context.isOnline) {
        try {
          final String? error = await validator.validate(code);
          if (!context.mounted) return;
          if (error != null) {
            rejection.value = error;
            verdict.value = ScanVerdict.rejected;
            unawaited(buzz(400));
            return;
          }
        } catch (_) {
          // The barcode could not be checked against the project. Say so and
          // refuse it rather than accepting an unverified code, which is what
          // the previous build did.
          if (!context.mounted) return;
          rejection.value = 'Could not check this barcode against the project. '
              'Check your connection and try again.';
          verdict.value = ScanVerdict.rejected;
          unawaited(buzz(400));
          return;
        }
      }

      if (!context.mounted) return;
      verdict.value = ScanVerdict.verified;
      unawaited(buzz(90));
      unawaited(chime());
    }

    Future<void> onDetect(BarcodeCapture capture) async {
      if (phase.value != ScannerPhase.scanning) return;

      final String? raw = capture.barcodes.isEmpty
          ? null
          : capture.barcodes.first.rawValue?.trim();
      if (raw == null || raw.isEmpty) return;

      if (raw == suppressed.value) return;
      suppressed.value = null;

      await present(raw);
    }

    void accept() {
      final String code = candidate.value;
      if (session.add(code) != null) return;
      touch();
      suppressed.value = code;

      if (session.isSingleShot || session.isFull) {
        finish();
        return;
      }
      backToScanning();
      unawaited(startCamera());
    }

    void rescan() {
      // Clearing suppression is what lets the collector deliberately re-read
      // the very same label they just rejected.
      suppressed.value = null;
      backToScanning();
      unawaited(startCamera());
    }

    Future<void> enterManually() async {
      final bool wasLive = phase.value == ScannerPhase.scanning;
      if (wasLive) await stopCamera();

      final String? entered = await showManualEntrySheet(context);
      if (!context.mounted) return;

      if (entered == null) {
        if (wasLive) unawaited(startCamera());
        return;
      }
      await present(entered);
    }

    Future<void> togglePause() async {
      if (phase.value == ScannerPhase.paused) {
        phase.value = ScannerPhase.scanning;
        await startCamera();
      } else if (phase.value == ScannerPhase.scanning) {
        phase.value = ScannerPhase.paused;
        await stopCamera();
      }
    }

    return PopScope<Object?>(
      canPop: false,
      onPopInvokedWithResult: (bool didPop, Object? _) {
        if (didPop) return;
        finish();
      },
      child: Scaffold(
        backgroundColor: ScannerTheme.ground,
        body: Column(
          children: <Widget>[
            _ChromeRail(
              title: sampleType?.trim().isNotEmpty ?? false
                  ? sampleType!.trim().toUpperCase()
                  : 'SCAN BARCODE',
              progressCount: session.progressCount,
              progressTotal: session.progressTotal,
              showProgress: !session.isSingleShot,
              camera: camera,
              onBack: finish,
            ),
            Expanded(
              child: Stack(
                fit: StackFit.expand,
                children: <Widget>[
                  MobileScanner(
                    controller: camera,
                    fit: BoxFit.cover,
                    onDetect: onDetect,
                    errorBuilder: (_, MobileScannerException error, __) =>
                        _CameraError(error: error, onRetry: startCamera),
                  ),
                  ScannerViewfinder(
                    sweep: sweep,
                    status: switch (phase.value) {
                      ScannerPhase.scanning => ViewfinderStatus.live,
                      ScannerPhase.paused => ViewfinderStatus.paused,
                      ScannerPhase.confirming => switch (verdict.value) {
                          ScanVerdict.checking => ViewfinderStatus.checking,
                          ScanVerdict.verified => ViewfinderStatus.verified,
                          ScanVerdict.rejected => ViewfinderStatus.rejected,
                        },
                    },
                    barcode: candidate.value,
                    rejectionMessage: rejection.value,
                    showSweep: !reducedMotion,
                  ),
                  if (phase.value != ScannerPhase.confirming)
                    Positioned(
                      right: 16,
                      bottom: 16,
                      child: _PauseButton(
                        isPaused: phase.value == ScannerPhase.paused,
                        onPressed: togglePause,
                      ),
                    ),
                ],
              ),
            ),
            AnimatedSize(
              duration: const Duration(milliseconds: 180),
              curve: Curves.easeOut,
              alignment: Alignment.topCenter,
              child: phase.value == ScannerPhase.confirming
                  ? ScanConfirmSheet(
                      verdict: verdict.value,
                      isSingleShot: session.isSingleShot,
                      onRescan: rescan,
                      onAccept:
                          verdict.value == ScanVerdict.verified ? accept : null,
                    )
                  : ScanSessionDock(
                      accepted: session.accepted,
                      isSingleShot: session.isSingleShot,
                      onUndo: (String barcode) {
                        if (!session.remove(barcode)) return;
                        // Let the collector immediately re-scan what they just
                        // removed, rather than silently ignoring that label.
                        if (suppressed.value == barcode) {
                          suppressed.value = null;
                        }
                        touch();
                      },
                      onManualEntry: enterManually,
                      onDone: finish,
                    ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Title, torch, and the session progress hairline.
class _ChromeRail extends HookWidget {
  const _ChromeRail({
    required this.title,
    required this.progressCount,
    required this.progressTotal,
    required this.showProgress,
    required this.camera,
    required this.onBack,
  });

  final String title;
  final int progressCount;
  final int progressTotal;
  final bool showProgress;
  final MobileScannerController camera;
  final VoidCallback onBack;

  @override
  Widget build(BuildContext context) {
    final double fraction = progressTotal == 0
        ? 0
        : (progressCount / progressTotal).clamp(0.0, 1.0);

    return Container(
      color: ScannerTheme.panel,
      child: SafeArea(
        bottom: false,
        child: Column(
          children: <Widget>[
            SizedBox(
              height: 56,
              child: Row(
                children: <Widget>[
                  IconButton(
                    onPressed: onBack,
                    icon: const Icon(Icons.arrow_back_rounded,
                        color: ScannerTheme.readout),
                    tooltip: 'Back',
                  ),
                  Expanded(
                    child: Text(
                      title,
                      style: ScannerTheme.eyebrow
                          .copyWith(color: ScannerTheme.readout),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  if (showProgress)
                    Padding(
                      padding: const EdgeInsets.only(right: 4),
                      child: Text(
                        '$progressCount / $progressTotal',
                        style: ScannerTheme.barcodeChip
                            .copyWith(color: ScannerTheme.readoutWeak),
                      ),
                    ),
                  _TorchButton(camera: camera),
                ],
              ),
            ),
            if (showProgress)
              SizedBox(
                height: 2,
                child: LayoutBuilder(
                  builder: (BuildContext context, BoxConstraints c) => Stack(
                    children: <Widget>[
                      Container(color: ScannerTheme.rule),
                      AnimatedContainer(
                        duration: const Duration(milliseconds: 260),
                        curve: Curves.easeOut,
                        width: c.maxWidth * fraction,
                        color: ScannerTheme.verified,
                      ),
                    ],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

/// Reads its state from the controller rather than a local flag, so the icon
/// cannot disagree with the actual torch.
class _TorchButton extends StatelessWidget {
  const _TorchButton({required this.camera});

  final MobileScannerController camera;

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<MobileScannerState>(
      valueListenable: camera,
      builder: (BuildContext context, MobileScannerState state, _) {
        if (state.torchState == TorchState.unavailable) {
          return const SizedBox(width: 8);
        }
        final bool on = state.torchState == TorchState.on;
        return IconButton(
          tooltip: on ? 'Turn off flashlight' : 'Turn on flashlight',
          icon: Icon(
            on ? Icons.flashlight_on_rounded : Icons.flashlight_off_rounded,
            color: on ? ScannerTheme.verified : ScannerTheme.readoutWeak,
          ),
          onPressed: state.isInitialized
              ? () async {
                  try {
                    await camera.toggleTorch();
                  } catch (_) {
                    // Torch is unavailable on this device or mid-teardown.
                  }
                }
              : null,
        );
      },
    );
  }
}

class _PauseButton extends StatelessWidget {
  const _PauseButton({required this.isPaused, required this.onPressed});

  final bool isPaused;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.black.withValues(alpha: 0.55),
      shape: const CircleBorder(),
      child: InkWell(
        onTap: onPressed,
        customBorder: const CircleBorder(),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Icon(
            isPaused ? Icons.play_arrow_rounded : Icons.pause_rounded,
            size: 22,
            color: ScannerTheme.readout,
          ),
        ),
      ),
    );
  }
}

class _CameraError extends StatelessWidget {
  const _CameraError({required this.error, required this.onRetry});

  final MobileScannerException error;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    final bool denied =
        error.errorCode == MobileScannerErrorCode.permissionDenied;

    return ColoredBox(
      color: ScannerTheme.ground,
      child: Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              const Icon(Icons.no_photography_outlined,
                  size: 36, color: ScannerTheme.readoutWeak),
              const SizedBox(height: 16),
              Text(
                denied ? 'CAMERA BLOCKED' : 'CAMERA UNAVAILABLE',
                style: ScannerTheme.eyebrow,
              ),
              const SizedBox(height: 8),
              Text(
                denied
                    ? 'Allow camera access in Settings to scan barcodes. You '
                        'can still enter a barcode by hand.'
                    : 'The camera did not start. Try again, or enter the '
                        'barcode by hand.',
                textAlign: TextAlign.center,
                style: ScannerTheme.body,
              ),
              const SizedBox(height: 20),
              TextButton(
                onPressed: onRetry,
                style: TextButton.styleFrom(
                  backgroundColor: Colors.white.withValues(alpha: 0.06),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                    side: const BorderSide(color: ScannerTheme.rule),
                  ),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                ),
                child: const Text(
                  'Try again',
                  style: TextStyle(
                    color: ScannerTheme.readout,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
