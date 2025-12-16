declare namespace API {
  type GetServicesRequest = BasicPageParams & {
    serviceName?: string
  }

  type GetServicesResponse = {
    id: string
    serviceName: string
    serviceDesc: string
    loadType: number
    serviceAddr: string
    qps: number
    qpd: number
    totalNode: number
  }

  type CreateServiceRequest = {
    blackList?: string
    clientIpFlowLimit?: number
    headerTransfor?: string
    ipList: string
    needHttps?: number
    needStripUri?: number
    needWebsocket?: number
    openAuth?: number
    roundType?: number
    rule?: string
    ruleType?: number
    serviceDesc: string
    serviceFlowLimit?: number
    serviceName: string
    upstreamConnectTimeout?: number
    upstreamHeaderTimeout?: number
    upstreamIdleTimeout?: number
    upstreamMaxIdle?: number
    urlRewrite?: string
    weightList: string
    whiteList?: string
    port?: number
  }

  type UpdateServiceRequest = CreateServiceRequest & {
    id: string
  }

  type ServiceInfo = {
    id: string
    serviceName: string
    serviceDesc: string
    loadType: number
    isDelete: number
    httpRule: {
      id: string
      serviceId: string
      ruleType: number
      rule: string
      needHttps: number
      needStripUri: number
      needWebsocket: number
      urlRewrite: string
      headerTransfor: string
    }
    loadBalance: {
      id: string
      serviceId: string
      checkMethod: number
      checkTimeout: number
      checkInterval: number
      roundType: number
      ipList: string
      weightList: string
      forbidList: string
      upstreamConnectTimeout: number
      upstreamHeaderTimeout: number
      upstreamIdleTimeout: number
      upstreamMaxIdle: number
    }
    accessControl: {
      blackList: string
      clientIpFlowLimit: number
      id: string
      openAuth: number
      serviceFlowLimit: number
      serviceId: string
      whiteHostName: string
      whiteList: string
    }
    grpcRule: {
      headerTransfor: string
      id: string
      port: number
      serviceId: string
    }
    tcpRule: {
      id: string
      port: number
      serviceId: string
    }
  }

  type GetServiceStatResponse = {
    today: number[]
    yesterday: number[]
  }

  type GetServicePanelResponse = {
    serviceNum: number
    todayRequestNum: number
    yesterdayRequestNum: number
    currentQPS: number
  }
}
