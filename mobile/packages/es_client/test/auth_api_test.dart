import 'package:test/test.dart';
import 'package:es_client/es_client.dart';


/// tests for AuthApi
void main() {
  final instance = EsClient().getAuthApi();

  group(AuthApi, () {
    //Future<LoginResponse> authControllerLogin(EmailLoginDto emailLoginDto) async
    test('test authControllerLogin', () async {
      // TODO
    });

    //Future<LoginResponse> authControllerLoginWithPhone(PhoneLoginDto phoneLoginDto) async
    test('test authControllerLoginWithPhone', () async {
      // TODO
    });

    //Future<LoginResponse> authControllerResendEmailOtp(EmailLoginDto emailLoginDto) async
    test('test authControllerResendEmailOtp', () async {
      // TODO
    });

    //Future<LoginResponse> authControllerResendPhoneOtp(PhoneLoginDto phoneLoginDto) async
    test('test authControllerResendPhoneOtp', () async {
      // TODO
    });

    //Future<VerifyOtpResponse> authControllerVerify(VerifyOtpDto verifyOtpDto) async
    test('test authControllerVerify', () async {
      // TODO
    });

  });
}
