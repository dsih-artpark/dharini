import 'package:design_system/design_system.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import '../services/connectivity_service.dart';
import '../providers/connectivity_provider.dart';

/// An elegant, interactive network status indicator pill designed for headers.
///
/// Under the hood:
///  1. Displays the current online/offline status using [AppColors].
///  2. Features an organic pulsing animation when offline to alert the user.
///  3. Supports manual re-checking on tap: triggers a rotating progress circle
///     and immediately runs a real DNS ping on the singleton [ConnectivityService].
class NetworkStatusIndicator extends HookWidget {
  const NetworkStatusIndicator({super.key});

  @override
  Widget build(BuildContext context) {
    final status = context.networkStatus;
    final isOnline = status == NetworkStatus.online;
    final isChecking = useState(false);

    // Dynamic rotation animation for checking/loading state
    final rotateController = useAnimationController(
      duration: const Duration(seconds: 1),
    );

    // Pulse animation controller for the offline indicator
    final pulseController = useAnimationController(
      duration: const Duration(milliseconds: 1500),
    );

    useEffect(() {
      if (isChecking.value) {
        rotateController.repeat();
      } else {
        rotateController.stop();
      }
      return null;
    }, [isChecking.value]);

    useEffect(() {
      if (!isOnline) {
        pulseController.repeat(reverse: true);
      } else {
        pulseController.stop();
      }
      return null;
    }, [isOnline]);

    final pulseScale = useAnimation(
      Tween<double>(begin: 0.85, end: 1.0).animate(
        CurvedAnimation(parent: pulseController, curve: Curves.easeInOut),
      ),
    );

    final pulseOpacity = useAnimation(
      Tween<double>(begin: 0.6, end: 1.0).animate(
        CurvedAnimation(parent: pulseController, curve: Curves.easeInOut),
      ),
    );

    Future<void> handleManualRecheck() async {
      if (isChecking.value) return;
      isChecking.value = true;

      // Provide a slight delay so the user feels the deliberate check action
      await Future.wait([
        ConnectivityService().checkConnectivity(),
        Future.delayed(const Duration(milliseconds: 800)),
      ]);

      isChecking.value = false;
    }

    if (isOnline) {
      return AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(
          color: AppColors.successLight.withOpacity(0.15),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: AppColors.successLight.withOpacity(0.3),
            width: 1,
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 6,
              height: 6,
              decoration: const BoxDecoration(
                color: Colors.green,
                shape: BoxShape.circle,
              ),
            ),
            const SizedBox(width: 6),
            Text(
              'Online',
              style: AppTypography.textTheme.bodySmall?.copyWith(
                color: Colors.greenAccent[400],
                fontSize: 11,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      );
    }

    // Offline state (beautiful orange/amber container with manual trigger and pulse)
    return GestureDetector(
      onTap: handleManualRecheck,
      behavior: HitTestBehavior.opaque,
      child: Opacity(
        opacity: pulseOpacity,
        child: Transform.scale(
          scale: pulseScale,
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 300),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
            decoration: BoxDecoration(
              color: AppColors.warningLight,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: AppColors.onWarningLight.withOpacity(0.5),
                width: 1.2,
              ),
              boxShadow: [
                BoxShadow(
                  color: AppColors.warningDark.withOpacity(0.2),
                  blurRadius: 6,
                  spreadRadius: 1,
                ),
              ],
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (isChecking.value)
                  RotationTransition(
                    turns: rotateController,
                    child: const Icon(
                      Icons.sync,
                      size: 14,
                      color: AppColors.onWarningLight,
                    ),
                  )
                else
                  const Icon(
                    Icons.wifi_off,
                    size: 14,
                    color: AppColors.onWarningLight,
                  ),
                const SizedBox(width: 6),
                Text(
                  isChecking.value ? 'Checking...' : 'Offline Mode',
                  style: AppTypography.textTheme.bodySmall?.copyWith(
                    color: AppColors.onWarningLight,
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
