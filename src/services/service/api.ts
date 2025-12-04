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

export const createService = (
  data: API.CreateServiceRequest
): Promise<BasicFetchResult<void>> => {
  return request({
    url: "/api/v1/services",
    method: "POST",
    data,
  });
};

export const updateService = (
  data: API.UpdateServiceRequest
): Promise<BasicFetchResult<void>> => {
  return request({
    url: `/api/v1/services/${data.id}`,
    method: "PUT",
    data,
  });
};

export const deleteService = (id: string): Promise<BasicFetchResult<void>> => {
  return request({
    url: `/api/v1/services/${id}`,
    method: "DELETE",
  });
};

export const getServiceInfo = (
  id: string
): Promise<BasicFetchResult<API.ServiceInfo>> => {
  return request({
    url: `/api/v1/services/${id}`,
    method: "GET",
  });
};
