import 'package:design_system/design_system.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:es_platform_mobile/hooks/auth.dart';
import '../container.dart';

class OnboardingAdminLandingScreen extends HookWidget {
  const OnboardingAdminLandingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final profile = useProfile();
    final project = useProject();

    // Show loading state while data is being fetched
    if (profile.isLoading || project.isLoading) {
      return Scaffold(
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF2A51A4)),
              ),
              const SizedBox(height: 16),
              Text(
                'Loading...',
                style: AppTypography.textTheme.bodyB2Regular.copyWith(
                  color: AppColors.textBlack,
                ),
              ),
            ],
          ),
        ),
      );
    }

    // Show error state if data fetch failed
    if (profile.error != null || project.error != null) {
      return Scaffold(
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(
                Icons.error_outline,
                color: Colors.red,
                size: 48,
              ),
              const SizedBox(height: 16),
              Text(
                'Failed to load data. Please try again.',
                style: AppTypography.textTheme.bodyB2Regular.copyWith(
                  color: AppColors.textBlack,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () {
                  profile.refetch();
                  project.refetch();
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF2A51A4),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: Text(
                  'Retry',
                  style: AppTypography.textTheme.buttonLarge.copyWith(
                    color: AppColors.white,
                  ),
                ),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      resizeToAvoidBottomInset: false, // Prevent layout adjustment
      bottomNavigationBar: null, // Hide bottom navigation
      extendBody: false,
      body: Stack(
        children: <Widget>[
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              OnboardingContainer(
                project: project.data?.name ?? '',
                firstName: profile.data?.firstName ?? '',
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    const SizedBox(
                      height: 20,
                    ),
                    Text(
                      'Project Details',
                      style: AppTypography.textTheme.displaySmall
                          ?.copyWith(color: AppColors.onErrorDark),
                    ),
                    const SizedBox(
                      height: 15,
                    ),
                    const Divider(
                      color: Color(0xffE6E8EB),
                    ),
                    const SizedBox(
                      height: 15,
                    ),
                    Text(
                      'PROJECT ADMIN',
                      style: AppTypography.textTheme.labelLarge
                          ?.copyWith(color: AppColors.labletestgrey),
                    ),
                    const SizedBox(
                      height: 10,
                    ),
                    Text(
                      profile.data?.firstName != null &&
                              profile.data?.lastName != null
                          ? '${profile.data?.firstName} ${profile.data?.lastName}'
                          : 'Not Available',
                      style: AppTypography.textTheme.bodySmall
                          ?.copyWith(color: AppColors.labletestblack),
                    ),
                    const SizedBox(
                      height: 10,
                    ),
                    Text(
                      'TEAM',
                      style: AppTypography.textTheme.labelLarge
                          ?.copyWith(color: AppColors.labletestgrey),
                    ),
                    const SizedBox(
                      height: 10,
                    ),
                    Text(
                      profile.data?.team?.teamName ?? 'Not Available',
                      style: AppTypography.textTheme.bodySmall
                          ?.copyWith(color: AppColors.labletestblack),
                    ),
                    const SizedBox(
                      height: 10,
                    ),
                    Text(
                      'PROJECT CODE',
                      style: AppTypography.textTheme.labelLarge
                          ?.copyWith(color: AppColors.labletestgrey),
                    ),
                    const SizedBox(
                      height: 10,
                    ),
                    Text(
                      project.data?.code ?? 'Not Available',
                      style: AppTypography.textTheme.bodySmall
                          ?.copyWith(color: AppColors.labletestblack),
                    ),
                  ],
                ),
              ),
              const SizedBox(
                height: 40,
              ),
            ],
          ),
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              padding: EdgeInsets.fromLTRB(
                16,
                16,
                16,
                16 + MediaQuery.of(context).padding.bottom,
              ),
              color: Colors.white
                  .withOpacity(0.9), // Optional semi-transparent background
              child: AppButton(
                child: const Text('Get Started'),
                onPressed: () {
                  context.go('/onboardingadminstep1');
                },
              ),
            ),
          ),
        ],
      ),
    );
  }
}
