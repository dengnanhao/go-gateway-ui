import request from '@/utils/request'

export const getServices = (params: API.GetServicesRequest): Promise<BasicPageResult<API.GetServicesResponse>> => {
  return request({
    url: '/api/v1/services',
    method: 'GET',
    params
  })
}

export const createService = (data: API.CreateServiceRequest): Promise<BasicFetchResult<void>> => {
  return request({
    url: '/api/v1/services',
    method: 'POST',
    data
  })
}

export const createTcpService = (data: API.CreateServiceRequest): Promise<BasicFetchResult<void>> => {
  return request({
    url: '/api/v1/services/tcp',
    method: 'POST',
    data
  })
}

export const createGrpcService = (data: API.CreateServiceRequest): Promise<BasicFetchResult<void>> => {
  return request({
    url: '/api/v1/services/grpc',
    method: 'POST',
    data
  })
}

export const updateService = (data: API.UpdateServiceRequest): Promise<BasicFetchResult<void>> => {
  return request({
    url: `/api/v1/services/${data.id}`,
    method: 'PUT',
    data
  })
}

export const updateTcpService = (data: API.UpdateServiceRequest): Promise<BasicFetchResult<void>> => {
  return request({
    url: `/api/v1/services/tcp/${data.id}`,
    method: 'PUT',
    data
  })
}

export const updateGrpcService = (data: API.UpdateServiceRequest): Promise<BasicFetchResult<void>> => {
  return request({
    url: `/api/v1/services/grpc/${data.id}`,
    method: 'PUT',
    data
  })
}

export const deleteService = (id: string): Promise<BasicFetchResult<void>> => {
  return request({
    url: `/api/v1/services/${id}`,
    method: 'DELETE'
  })
}

export const getServiceInfo = (id: string): Promise<BasicFetchResult<API.ServiceInfo>> => {
  return request({
    url: `/api/v1/services/${id}`,
    method: 'GET'
  })
}

export const getServiceStat = (id: string): Promise<BasicFetchResult<API.GetServiceStatResponse>> => {
  return request({
    url: `/api/v1/services/${id}/stat`,
    method: 'GET'
  })
}

export const getServicePanel = (): Promise<BasicFetchResult<API.GetServicePanelResponse>> => {
  return request({
    url: '/api/v1/services/panel',
    method: 'GET'
  })
}

export const getFlowStat = (): Promise<BasicFetchResult<API.GetServiceStatResponse>> => {
  return request({
    url: `/api/v1/services/stat`,
    method: 'GET'
  })
}

// 获取所有服务
export const getAllServices = (): Promise<BasicFetchResult<API.ServiceInfo[]>> => {
  return request({
    url: '/api/v1/services/all',
    method: 'GET'
  })
}
