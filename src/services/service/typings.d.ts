declare namespace API {
  type GetServicesRequest = BasicPageParams & {
    serviceName?: string;
  };

  type GetServicesResponse = {
    id: string;
    serviceName: string;
    serviceDesc: string;
    loadType: number;
    serviceAddr: string;
    qps: number;
    qpd: number;
    totalNode: number;
  };
}
