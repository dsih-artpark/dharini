# es_client.api.AuthApi

## Load the API package
```dart
import 'package:es_client/api.dart';
```

All URIs are relative to *http://localhost:4000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**authControllerLogin**](AuthApi.md#authcontrollerlogin) | **POST** /auth/login-with-email | 
[**authControllerLoginUnified**](AuthApi.md#authcontrollerloginunified) | **POST** /auth/login | 
[**authControllerLoginWithPhone**](AuthApi.md#authcontrollerloginwithphone) | **POST** /auth/login-with-phone | 
[**authControllerResendEmailOtp**](AuthApi.md#authcontrollerresendemailotp) | **POST** /auth/resend-email-otp | 
[**authControllerResendPhoneOtp**](AuthApi.md#authcontrollerresendphoneotp) | **POST** /auth/resend-phone-otp | 
[**authControllerSignup**](AuthApi.md#authcontrollersignup) | **POST** /auth/signup | 
[**authControllerVerify**](AuthApi.md#authcontrollerverify) | **POST** /auth/verify-otp | 
[**authControllerVerifySignup**](AuthApi.md#authcontrollerverifysignup) | **POST** /auth/signup/verify | 


# **authControllerLogin**
> LoginResponse authControllerLogin(emailLoginDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getAuthApi();
final EmailLoginDto emailLoginDto = ; // EmailLoginDto | 

try {
    final response = api.authControllerLogin(emailLoginDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AuthApi->authControllerLogin: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **emailLoginDto** | [**EmailLoginDto**](EmailLoginDto.md)|  | 

### Return type

[**LoginResponse**](LoginResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerLoginUnified**
> LoginResponse authControllerLoginUnified(unifiedLoginDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getAuthApi();
final UnifiedLoginDto unifiedLoginDto = ; // UnifiedLoginDto | 

try {
    final response = api.authControllerLoginUnified(unifiedLoginDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AuthApi->authControllerLoginUnified: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **unifiedLoginDto** | [**UnifiedLoginDto**](UnifiedLoginDto.md)|  | 

### Return type

[**LoginResponse**](LoginResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerLoginWithPhone**
> LoginResponse authControllerLoginWithPhone(phoneLoginDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getAuthApi();
final PhoneLoginDto phoneLoginDto = ; // PhoneLoginDto | 

try {
    final response = api.authControllerLoginWithPhone(phoneLoginDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AuthApi->authControllerLoginWithPhone: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **phoneLoginDto** | [**PhoneLoginDto**](PhoneLoginDto.md)|  | 

### Return type

[**LoginResponse**](LoginResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerResendEmailOtp**
> LoginResponse authControllerResendEmailOtp(emailLoginDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getAuthApi();
final EmailLoginDto emailLoginDto = ; // EmailLoginDto | 

try {
    final response = api.authControllerResendEmailOtp(emailLoginDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AuthApi->authControllerResendEmailOtp: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **emailLoginDto** | [**EmailLoginDto**](EmailLoginDto.md)|  | 

### Return type

[**LoginResponse**](LoginResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerResendPhoneOtp**
> LoginResponse authControllerResendPhoneOtp(phoneLoginDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getAuthApi();
final PhoneLoginDto phoneLoginDto = ; // PhoneLoginDto | 

try {
    final response = api.authControllerResendPhoneOtp(phoneLoginDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AuthApi->authControllerResendPhoneOtp: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **phoneLoginDto** | [**PhoneLoginDto**](PhoneLoginDto.md)|  | 

### Return type

[**LoginResponse**](LoginResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerSignup**
> LoginResponse authControllerSignup(signupDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getAuthApi();
final SignupDto signupDto = ; // SignupDto | 

try {
    final response = api.authControllerSignup(signupDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AuthApi->authControllerSignup: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **signupDto** | [**SignupDto**](SignupDto.md)|  | 

### Return type

[**LoginResponse**](LoginResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerVerify**
> VerifyOtpResponse authControllerVerify(verifyOtpDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getAuthApi();
final VerifyOtpDto verifyOtpDto = ; // VerifyOtpDto | 

try {
    final response = api.authControllerVerify(verifyOtpDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AuthApi->authControllerVerify: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **verifyOtpDto** | [**VerifyOtpDto**](VerifyOtpDto.md)|  | 

### Return type

[**VerifyOtpResponse**](VerifyOtpResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerVerifySignup**
> VerifyOtpResponse authControllerVerifySignup(verifySignupDto)



### Example
```dart
import 'package:es_client/api.dart';

final api = EsClient().getAuthApi();
final VerifySignupDto verifySignupDto = ; // VerifySignupDto | 

try {
    final response = api.authControllerVerifySignup(verifySignupDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AuthApi->authControllerVerifySignup: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **verifySignupDto** | [**VerifySignupDto**](VerifySignupDto.md)|  | 

### Return type

[**VerifyOtpResponse**](VerifyOtpResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

