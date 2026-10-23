export class VerifyOtpResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
  };
}
export class LoginResponse {
  success: boolean;
  message: string;
}
