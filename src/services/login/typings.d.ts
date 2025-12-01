declare namespace API {
  type GetCaptchaIdResponse = {
    captchaId: string;
  };

  type GetCaptchaImageRequest = {
    id: string;
  };

  type LoginRequest = {
    username: string;
    password: string;
    captchaId: string;
    captchaCode: string;
  };

  type LoginResponse = {
    accessToken: string;
    expiresAt: number;
    tokenType: string;
  };
}
