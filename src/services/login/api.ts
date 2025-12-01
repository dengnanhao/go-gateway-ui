import request from "@/utils/request";

export const getCaptchaId = (): Promise<
  BasicFetchResult<API.GetCaptchaIdResponse>
> => {
  return request({
    url: "/api/v1/captcha/id",
    method: "GET",
  });
};

export const login = (
  data: API.LoginRequest
): Promise<BasicFetchResult<API.LoginResponse>> => {
  return request({
    url: "/api/v1/login",
    method: "POST",
    data,
  });
};
