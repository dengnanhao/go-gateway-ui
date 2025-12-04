import axios from "axios";
import { getSession } from "@etils/tool";
import { toast } from "sonner";

const BLOB_URLS = ["/api/v1/captcha/image"];

const request = axios.create({
  baseURL: "/",
  timeout: 10000,
});

// 请求前hook
request.interceptors.request.use(
  (config) => {
    const token = getSession("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应后hook
request.interceptors.response.use(
  (response) => {
    const { status, data } = response;
    if (status !== 200) {
      toast.error("服务异常");
      return Promise.reject(response.statusText);
    }
    if (BLOB_URLS.includes(response.config.url ?? "")) {
      return response;
    }
    if (!data.success) {
      toast.error(data.error.detail);
      return Promise.reject(data.error.detail);
    } else {
      return data;
    }
  },
  (error) => {
    toast.error(error.message);
    return Promise.reject(error);
  }
);

export default request;
