import request from "@/utils/request";

export const getServices = (
  params: API.GetServicesRequest
): Promise<BasicPageResult<API.GetServicesResponse>> => {
  return request({
    url: "/api/v1/services",
    method: "GET",
    params,
  });
};
