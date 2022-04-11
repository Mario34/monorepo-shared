import axios from "axios";
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { message } from "ant-design-vue";

interface CustomSuccessData<T> {
  errorCode: number;
  errorMsg: string;
  results: T;
  stime: number;
}

class CreateAxios {
  instance: AxiosInstance;
  constructor(options: AxiosRequestConfig) {
    this.instance = axios.create(options);
    this.interceptorsRequest();
    this.interceptorsResponse();
  }

  private interceptorsRequest() {
    this.instance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        const token = localStorage.getItem("token");
        if (token) {
          if (config.headers) {
            config.headers.token = token;
          } else {
            config.headers = { token };
          }
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );
  }

  private interceptorsResponse() {
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        const { status, data: body } = response;
        if (status === 200) {
          const { errorCode: code, errorMsg: msg, error } = body;
          if (code === 0) {
            return body;
          } else if (code === -106) {
            // 清空token
            localStorage.removeItem("token");
            window.location.href = "/login";
          } else {
            message.error(msg || error || "请求出错");
          }
          return Promise.reject(body);
        }
      },
      (error: AxiosError) => {
        const {
          data: { errorMsg: msg },
        } = error.response || {};

        message.error(msg || "服务出错");

        return Promise.reject(error);
      }
    );
  }

  get = <T>(
    url: string,
    params?: any,
    config?: AxiosRequestConfig
  ): Promise<CustomSuccessData<T>> => {
    return this.instance.get(url, {
      params,
      ...config,
    });
  };

  post = <T>(url: string, data?: any): Promise<CustomSuccessData<T>> => this.instance.post(url, data);
}

const createInstance = (options: any) => {
  return new CreateAxios({
    timeout: 6 * 1000,
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    },
    withCredentials: false,
    ...options,
  });
};

export default createInstance;
