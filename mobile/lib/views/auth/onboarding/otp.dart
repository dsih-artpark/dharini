import 'package:design_system/design_system.dart';
import 'package:es_client/es_client.dart';
import 'package:es_platform_mobile/hooks/auth.dart';
import 'package:es_platform_mobile/views/auth/onboarding/header.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';

/// OTP verification screen with auto-submit functionality.
/// Automatically submits when all 6 digits are entered.
///
/// Works for both phone and email login: [identifier] is the phone number or
/// email address the OTP was sent to, and [loginType] is `'phone'` or
/// `'email'`.
class OtpScreen extends HookWidget {
  final String identifier;
  final String loginType; // 'phone' | 'email'

  const OtpScreen({
    Key? key,
    required this.identifier,
    required this.loginType,
  }) : super(key: key);

  bool get _isEmail => loginType == 'email';

  /// Builds the VerifyOtpDto from the identifier and OTP strings, setting only
  /// the field relevant to the active login type.
  VerifyOtpDto _buildVerifyDto(String otp) {
    final builder = VerifyOtpDtoBuilder()..otp = num.parse(otp);
    if (_isEmail) {
      builder.email = identifier;
    } else {
      builder.phone = num.parse(identifier);
    }
    return builder.build();
  }

  @override
  Widget build(BuildContext context) {
    final enteredOtp = useState<String?>(null);
    final hasAutoSubmitted = useState<bool>(false);

    final verifyOTP = useVerifyOTP(
      onSuccess: () => context.go('/onboarding'),
      onError: (error) {
        hasAutoSubmitted.value = false;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(error), backgroundColor: Colors.red),
        );
      },
    );

    // Helper to submit OTP
    void submitOtp(String otp) {
      if (!verifyOTP.isPending) {
        verifyOTP.mutate(_buildVerifyDto(otp));
      }
    }

    SystemChrome.setSystemUIOverlayStyle(
      const SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.dark,
      ),
    );

    return Scaffold(
      resizeToAvoidBottomInset: false,
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Stack(
          children: [
            Column(
              children: [
                const OnboardingHeader(),
                Expanded(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 24),
                        Text(
                          'Enter Verification Code',
                          style: AppTypography.textTheme.headingH3.copyWith(
                            color: AppColors.textBlack,
                          ),
                        ),
                        const SizedBox(height: 15),
                        const Divider(color: AppColors.strokeWeak, height: 1),
                        const SizedBox(height: 15),
                        Text(
                          _isEmail
                              ? 'A verification code has been sent to your email'
                              : 'A verification code has been sent to your number',
                          style: AppTypography.textTheme.bodyB3Regular.copyWith(
                            color: AppColors.textWeak,
                          ),
                        ),
                        Text(
                          _isEmail ? identifier : '+91-$identifier',
                          style: AppTypography.textTheme.bodyB3Regular.copyWith(
                            color: AppColors.textWeak,
                          ),
                        ),
                        const SizedBox(height: 8),
                        ResendOTPButton(
                          identifier: identifier,
                          loginType: loginType,
                        ),
                        const SizedBox(height: 20),
                        OtpInputRow(
                          onComplete: (otp) {
                            enteredOtp.value = otp;
                            // Auto-submit on completion (only once per OTP entry)
                            if (!hasAutoSubmitted.value) {
                              hasAutoSubmitted.value = true;
                              submitOtp(otp);
                            }
                          },
                        ),
                        const SizedBox(height: 40),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            // Login button (fixed at bottom)
            Positioned(
              bottom: 48,
              left: 0,
              right: 0,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
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
                child: AppButton(
                  isLoading: verifyOTP.isPending,
                  onPressed: enteredOtp.value == null
                      ? null
                      : () => submitOtp(enteredOtp.value!),
                  child: Text(
                    'Log in',
                    style: AppTypography.textTheme.buttonLarge.copyWith(
                      color: AppColors.white,
                    ),
                  ),
                ),
              ),
            ),
            // Change identifier link
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: GestureDetector(
                onTap: () => context.go('/auth/login'),
                child: Container(
                  alignment: Alignment.center,
                  padding: const EdgeInsets.all(16),
                  child: Text(
                    _isEmail ? 'Change email' : 'Change number',
                    style: AppTypography.textTheme.buttonLarge.copyWith(
                      color: AppColors.buttonTextDefault,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// 6-digit OTP input row with auto-focus advancement.
class OtpInputRow extends StatefulWidget {
  /// Called when all 6 digits are entered
  final Function(String) onComplete;

  const OtpInputRow({Key? key, required this.onComplete}) : super(key: key);

  @override
  State<OtpInputRow> createState() => _OtpInputRowState();
}

class _OtpInputRowState extends State<OtpInputRow> {
  late final List<TextEditingController> _controllers;
  late final List<FocusNode> _focusNodes;

  @override
  void initState() {
    super.initState();
    _controllers = List.generate(6, (_) => TextEditingController());
    _focusNodes = List.generate(6, (_) => FocusNode());
  }

  @override
  void dispose() {
    for (final c in _controllers) {
      c.dispose();
    }
    for (final f in _focusNodes) {
      f.dispose();
    }
    super.dispose();
  }

  String get _otp => _controllers.map((c) => c.text).join();

  void _onDigitChanged(int index, String value) {
    // Auto-advance to next field
    if (value.isNotEmpty && index < 5) {
      _focusNodes[index + 1].requestFocus();
    }
    // Check if OTP is complete
    if (_otp.length == 6) {
      widget.onComplete(_otp);
    }
  }

  void _handleBackspace(int index) {
    if (_controllers[index].text.isEmpty && index > 0) {
      _focusNodes[index - 1].requestFocus();
      _controllers[index - 1].clear();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: List.generate(6, (index) => _buildDigitField(index)),
    );
  }

  Widget _buildDigitField(int index) {
    return Container(
      width: 48,
      height: 48,
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: AppColors.strokeMedium),
        borderRadius: BorderRadius.circular(8),
      ),
      child: KeyboardListener(
        focusNode: FocusNode(),
        onKeyEvent: (event) {
          if (event is KeyDownEvent &&
              event.logicalKey == LogicalKeyboardKey.backspace) {
            _handleBackspace(index);
          }
        },
        child: TextField(
          controller: _controllers[index],
          focusNode: _focusNodes[index],
          keyboardType: TextInputType.number,
          textAlign: TextAlign.center,
          maxLength: 1,
          style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          decoration: const InputDecoration(
            border: InputBorder.none,
            counterText: "",
            contentPadding: EdgeInsets.zero,
          ),
          inputFormatters: [FilteringTextInputFormatter.digitsOnly],
          onChanged: (value) => _onDigitChanged(index, value),
        ),
      ),
    );
  }
}

/// Resend OTP button with loading state.
class ResendOTPButton extends HookWidget {
  final String identifier;
  final String loginType; // 'phone' | 'email'

  const ResendOTPButton({
    super.key,
    required this.identifier,
    required this.loginType,
  });

  UnifiedLoginDto _buildLoginDto() {
    return UnifiedLoginDto((b) {
      if (loginType == 'email') {
        b.email = identifier;
      } else {
        b.phone = identifier;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final resendOTP = useInitiateOTPLogin(
      onSuccess: () {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('OTP sent successfully'),
            backgroundColor: Colors.green,
          ),
        );
      },
      onError: (error) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(error), backgroundColor: Colors.red),
        );
      },
    );

    return InkWell(
      onTap: resendOTP.isPending ? null : () => resendOTP.mutate(_buildLoginDto()),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            'Resend OTP',
            style: AppTypography.textTheme.buttonSmall.copyWith(
              color: resendOTP.isPending
                  ? AppColors.textWeak
                  : AppColors.buttonTextDefault,
            ),
          ),
          if (resendOTP.isPending) ...[
            const SizedBox(width: 8),
            const SizedBox(
              width: 12,
              height: 12,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                valueColor: AlwaysStoppedAnimation<Color>(AppColors.textWeak),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
