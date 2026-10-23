// ignore_for_file: unused_element

import 'package:design_system/design_system.dart';
import 'package:es_client/es_client.dart';
import 'package:es_platform_mobile/bootstrap.dart';
import 'package:es_platform_mobile/hooks/auth.dart';
import 'package:es_platform_mobile/services/analytics_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import 'package:hive/hive.dart';

import '../../utils/configs/constants.dart';
import '../../utils/extensions/validator.dart';
import './onboarding/header.dart';

class Login extends HookWidget {
  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;

    // The single identifier field backs both login types; the selected type
    // decides keyboard, prefix, validation and which API field is sent.
    final identifierController = useTextEditingController();
    final identifier = useState('');
    final loginType = useState('phone'); // 'phone' | 'email'
    final apiBaseUrl = dotenv.env['API_BASE_URL'];

    final environments = [
      {'name': 'Staging', 'url': apiBaseUrl},
    ];

    String findEnvName(String url) {
      return environments.firstWhere((env) => env['url'] == url,
          orElse: () => environments.first)['name']!;
    }

    // Initialize with Dev environment by default
    final selectedUrl = useState(environments[0]['url']!);
    final selectedEnvName = useState(environments[0]['name']!);

    // Initialize base URL with Dev environment by default
    // This should be your global base URL that your API service uses
    final baseUrl = useState(environments[0]['url']!);

    // Keep [identifier] in sync with the controller. This also fires when we
    // clear() the controller on a login-type switch, resetting [identifier].
    useEffect(() {
      void listener() {
        identifier.value = identifierController.text;
      }

      identifierController.addListener(listener);
      return () => identifierController.removeListener(listener);
    }, [identifierController]);

    final tapCount = useState(0);
    final showCustomUrl = useState(false);
    final customUrlController = useTextEditingController();
    final urlError = useState<String?>(null);

    // Switch between email and phone, clearing any half-typed value so a phone
    // number never bleeds into the email field (or vice-versa).
    void switchLoginType(String type) {
      if (loginType.value == type) return;
      loginType.value = type;
      identifierController.clear();
      identifier.value = '';
    }

    // Called each time logo is tapped
    void handleLogoTap() {
      if (showCustomUrl.value) return; // Already unlocked

      tapCount.value += 1;

      if (tapCount.value >= 7) {
        showCustomUrl.value = true;
        showToast(context, 'Custom server endpoint unlocked!');
      } else if (tapCount.value >= 2) {
        final remaining = 7 - tapCount.value;

        showToast(context, 'Click $remaining more times to customize endpoint');
      }
    }

    // URL validation function
    bool isValidUrl(String url) {
      try {
        final uri = Uri.parse(url);
        return uri.hasScheme &&
            uri.hasAuthority &&
            (uri.scheme == 'http' || uri.scheme == 'https');
      } catch (e) {
        return false;
      }
    }

    // ---- Form pieces ----

    Widget buildLoginTypeToggle() {
      final isEmail = loginType.value == 'email';

      Widget segment(String label, bool selected, VoidCallback onTap) {
        return Expanded(
          child: GestureDetector(
            onTap: onTap,
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 150),
              padding: const EdgeInsets.symmetric(vertical: 10),
              decoration: BoxDecoration(
                color: selected ? AppColors.primaryLight : Colors.transparent,
                borderRadius: BorderRadius.circular(6),
              ),
              child: Center(
                child: Text(
                  label,
                  style: AppTypography.textTheme.bodyB2Medium.copyWith(
                    color: selected ? AppColors.white : AppColors.textWeak,
                  ),
                ),
              ),
            ),
          ),
        );
      }

      return Container(
        padding: const EdgeInsets.all(4),
        decoration: BoxDecoration(
          color: AppColors.blue10,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          children: [
            segment('Email', isEmail, () => switchLoginType('email')),
            segment('Phone', !isEmail, () => switchLoginType('phone')),
          ],
        ),
      );
    }

    Widget buildIdentifierField() {
      final isEmail = loginType.value == 'email';

      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(
            isEmail ? 'Email' : 'Phone Number',
            style: AppTypography.textTheme.bodyB2Medium.copyWith(
              color: AppColors.textLabelInput,
            ),
          ),
          const SizedBox(height: 8),
          Container(
            decoration: BoxDecoration(
              border: Border.all(color: const Color(0xFFE6E8EB)),
              borderRadius: BorderRadius.circular(8),
            ),
            height: 48,
            child: Row(
              children: [
                // +91 prefix only applies to phone numbers.
                if (!isEmail)
                  Container(
                    padding: const EdgeInsets.only(left: 12, right: 8),
                    child: Row(
                      children: [
                        Text(
                          '+91',
                          style:
                              AppTypography.textTheme.bodyB3Regular.copyWith(
                            color: AppColors.textLabelInput,
                          ),
                        ),
                        const SizedBox(width: 8),
                      ],
                    ),
                  ),
                Expanded(
                  child: TextField(
                    key: ValueKey(isEmail ? 'email' : 'phone'),
                    controller: identifierController,
                    keyboardType: isEmail
                        ? TextInputType.emailAddress
                        : TextInputType.phone,
                    decoration: InputDecoration(
                      hintText: isEmail ? 'example@email.com' : '(000) 000-0000',
                      hintStyle: AppTypography.textTheme.bodyB3Regular.copyWith(
                        color: AppColors.labletestgrey,
                      ),
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.symmetric(
                        vertical: 14,
                        // Email has no prefix, so pad it off the left border.
                        horizontal: isEmail ? 12 : 0,
                      ),
                    ),
                    style: AppTypography.textTheme.bodyB3Regular.copyWith(
                      color: AppColors.textLabelInput,
                    ),
                    onChanged: (value) {
                      identifier.value = value;
                    },
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 10),
          Text(
            'We will send an automated code here',
            style: AppTypography.textTheme.bodyB3Regular.copyWith(
              color: AppColors.textWeak,
            ),
          ),
        ],
      );
    }

    Widget buildCustomUrlField() {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(
            'Enter Server Endpoint URL',
            style: AppTypography.textTheme.bodyB2Medium.copyWith(
              color: AppColors.textLabelInput,
            ),
          ),
          const SizedBox(height: 8),
          TextField(
            controller: customUrlController,
            keyboardType: TextInputType.url,
            decoration: InputDecoration(
              hintText: 'https://api.example.com/',
              errorText: urlError.value,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            onChanged: (value) {
              final isValid = isValidUrl(value);
              urlError.value =
                  value.isNotEmpty && !isValid ? 'Enter a valid URL' : null;
            },
          ),
        ],
      );
    }

    return Scaffold(
      resizeToAvoidBottomInset: false,
      backgroundColor: const Color(0xFFF9F8F3), // Beige background color
      bottomNavigationBar: null, // Hide bottom navigation
      extendBody: false,
      body: Stack(
        children: <Widget>[
          // Main column layout
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              // Header section
              OnboardingHeader(onLogoTap: handleLogoTap),

              // Login form with white background
              Container(
                width: double.infinity,
                color: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    const SizedBox(height: 24),
                    Text(
                      'Login',
                      style: AppTypography.textTheme.headingH3.copyWith(
                        color: AppColors.textBlack,
                      ),
                    ),
                    const SizedBox(height: 15),
                    const Divider(
                      color: AppColors.strokeWeak,
                      height: 1,
                    ),
                    const SizedBox(height: 24),

                    // Email / Phone selector
                    buildLoginTypeToggle(),
                    const SizedBox(height: 20),

                    // Identifier input (phone with +91 prefix, or email)
                    buildIdentifierField(),

                    const SizedBox(height: 24),

                    // Custom URL field (shown after 7 clicks)
                    if (showCustomUrl.value) ...[
                      buildCustomUrlField(),
                      const SizedBox(height: 24),
                    ],

                    const SizedBox(height: 32),
                  ],
                ),
              ),

              // Expanded background area with beige color
              Expanded(
                child: Container(
                  color: const Color(0xFFF9F8F3),
                  width: double.infinity,
                ),
              ),
            ],
          ),

          // Positioned leaf background to ensure visibility on mobile
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              height: screenHeight * 0.30,
              width: double.infinity,
              decoration: const BoxDecoration(
                image: DecorationImage(
                  alignment: Alignment.bottomCenter,
                  image: AssetImage(Assets.loginLeaves),
                  fit: BoxFit.cover,
                ),
              ),
            ),
          ),

          // Bottom button (fixed at the bottom)
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
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 5,
                    offset: const Offset(0, -2),
                  ),
                ],
              ),
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: LoginButton(
                  identifier: identifier.value,
                  loginType: loginType.value,
                  showCustomUrl: showCustomUrl.value,
                  customUrlController: customUrlController,
                  urlError: urlError,
                  onToast: (message) => showToast(context, message),
                  baseUrl: baseUrl,
                  isValidUrl: isValidUrl,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  void showToast(BuildContext context, String message) {
    final overlay = Overlay.of(context);
    final entry = OverlayEntry(
      builder: (context) => Positioned(
        bottom: 100,
        left: 20,
        right: 20,
        child: Material(
          color: Colors.transparent,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: Colors.black.withOpacity(0.8),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              message,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 14, color: Colors.white),
            ),
          ),
        ),
      ),
    );

    overlay.insert(entry);
    Future.delayed(const Duration(seconds: 2), () => entry.remove());
  }
}

class LoginButton extends HookWidget {
  final String identifier;
  final String loginType; // 'phone' | 'email'
  final bool showCustomUrl;
  final TextEditingController customUrlController;
  final ValueNotifier<String?> urlError;
  final Function(String) onToast;
  final ValueNotifier<String> baseUrl;
  final bool Function(String) isValidUrl;

  const LoginButton({
    required this.identifier,
    required this.loginType,
    required this.showCustomUrl,
    required this.customUrlController,
    required this.urlError,
    required this.onToast,
    required this.baseUrl,
    required this.isValidUrl,
    super.key,
  });

  bool get _isEmail => loginType == 'email';

  /// Builds the unified login payload from the active login type.
  UnifiedLoginDto _buildLoginDto() {
    return UnifiedLoginDto((b) {
      if (_isEmail) {
        b.email = identifier;
      } else {
        b.phone = identifier;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final isUpdatingUrl = useState(false);
    final shouldAutoLogin = useState(false);

    final login = useInitiateOTPLogin(
      onSuccess: () {
        shouldAutoLogin.value = false;
        // Track successful OTP send
        Analytics.loginOtpSent();
        context.go(
          '/auth/verify-otp',
          extra: <String, String>{
            'identifier': identifier,
            'loginType': loginType,
          },
        );
      },
      onError: (error) {
        isUpdatingUrl.value = false;
        shouldAutoLogin.value = false;
        Analytics.loginFailed(error);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(error),
            backgroundColor: Colors.red,
          ),
        );
      },
    );

    // Auto-trigger login after URL update
    useEffect(() {
      if (shouldAutoLogin.value && !isUpdatingUrl.value) {
        // Small delay to ensure URL is properly applied
        Future.delayed(const Duration(milliseconds: 500), () async {
          if (shouldAutoLogin.value) {
            await Hive.box('app').put('lastUsedBaseUrl', baseUrl.value);
            login.mutate(_buildLoginDto());
          }
        });
      }
      return null;
    }, [shouldAutoLogin.value, isUpdatingUrl.value]);

    return AppButton(
      size: ButtonSize.lg,
      child: Text(
        isUpdatingUrl.value
            ? 'Updating...'
            : (shouldAutoLogin.value ? 'Logging in...' : 'Send OTP'),
        style: AppTypography.textTheme.buttonLarge.copyWith(
          color: AppColors.white,
        ),
      ),
      isLoading:
          login.isPending || isUpdatingUrl.value || shouldAutoLogin.value,
      onPressed: () async {
        // Validate the identifier for the active login type.
        final validationError = _isEmail
            ? ValidationHelper.validateEmail(identifier)
            : ValidationHelper.validatePhoneNumber(identifier);
        if (validationError != null) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(validationError),
              backgroundColor: Colors.red,
            ),
          );
          return;
        }

        // Check if custom URL is provided and needs to be updated
        if (showCustomUrl) {
          final customUrl = customUrlController.text.trim();

          if (customUrl.isNotEmpty) {
            if (!isValidUrl(customUrl)) {
              urlError.value = 'Enter a valid URL';
              onToast('Invalid URL');
              return;
            }

            // Step 1: Update URL first
            isUpdatingUrl.value = true;

            try {
              // Update the base URL
              baseUrlNotifier.value = customUrl;
              baseUrl.value = customUrl; // Update local state too
              onToast('Updating server endpoint...');

              // Wait for URL to be applied
              await Future.delayed(const Duration(milliseconds: 1000));

              // Step 2: Set flag to auto-login after URL update
              isUpdatingUrl.value = false;
              shouldAutoLogin.value = true;
            } catch (e) {
              isUpdatingUrl.value = false;
              shouldAutoLogin.value = false;
              onToast('Failed to update endpoint');
            }
            return;
          }
        }
        await Hive.box('app').put('lastUsedBaseUrl', baseUrl.value);
        // Direct login if no custom URL
        login.mutate(_buildLoginDto());
      },
    );
  }
}
