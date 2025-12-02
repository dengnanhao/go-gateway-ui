type BasicPageParams = {
  current: number;
  pageSize: number;
  orderStr?: string;
  orderType?: "desc" | "asc";
};

type BasicPageResult<T> = {
  success: bool;
  total: number;
  data: T[];
  error: {
    code: number;
    detail: string;
    id: string;
    status: string;
  };
};

type BasicFetchResult<T> = {
  data: T;
  success: bool;
  error: {
    code: number;
    detail: string;
    id: string;
    status: string;
  };
};

type ExportResponse = {
  data: Blob;
  status: number;
  statusText: string;
  headers: {
    "content-disposition": string;
    "content-type": string;
    [key: string]: string;
  };
};

type TablePagination = {
  current: number;
  pageSize: number;
  total?: number;
};
