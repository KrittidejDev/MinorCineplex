import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosProgressEvent,
} from "axios";
import { BASE_API } from "./apiConfig";

// let logoutFn: null | (() => void) = null;

// ตั้งฟังก์ชัน logout handler
// export const setLogoutHandler = (fn: () => void) => {
//   logoutFn = fn;
// };

// Config ปกติ (JSON)
const getConfig = (token: string | null): AxiosRequestConfig => ({
  baseURL: BASE_API,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token ?? ""}`,
  },
});

// Config สำหรับ FormData + Upload progress
const getConfigFormData = (
  token: string | null,
  callback?: (percent: number) => void
): AxiosRequestConfig => ({
  baseURL: BASE_API,
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${token ?? ""}`,
  },
  onUploadProgress: (progressEvent: AxiosProgressEvent) => {
    if (progressEvent.total) {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      callback?.(percentCompleted);
    }
  },
});

// Response success
// const axiosSuccess = <T>(res: AxiosResponse<T>) => res.data;

// Response error handler
const axiosError = (error: AxiosError) => {
  // Handle specific error for PUT_UPDATE_PROFILE
  if (
    error.config?.url?.includes("/users/") &&
    error.config?.method === "put"
  ) {
    throw error;
    // Handle specific error for AUTH
  }
  if (error.config?.url?.includes("/auth/register")) {
    throw error;
  }
  // if (error.response?.status === 403) {
  //   toast.error("เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่");
  //   if (logoutFn) logoutFn();
  //   else window.location.href = "/login";
  // } else if (error.code === "ERR_NETWORK") {
  //   toast.error("มีปัญหาการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง");
  // }
  console.error("API Error:", error);
  return error.response;
};

export type RequestType =
  | "get"
  | "getDownload"
  | "post"
  | "put"
  | "patch"
  | "delete"
  | "post_formdata"
  | "put_formdata";

export const axiosService = async <TResponse, TParams = unknown>(
  type: RequestType,
  url: string,
  params?: TParams,
  callback?: (percent: number) => void
): Promise<TResponse | Blob | false | AxiosResponse | void> => {
  const token = localStorage.getItem("token");
  const config = getConfig(token);
  const configFormData = getConfigFormData(token, callback);

  try {
    switch (type) {
      case "get":
        if (params) config.params = params as Record<string, unknown>;
        return (await axios.get<TResponse>(url, config)).data;
      case "getDownload":
        if (params) config.params = params as Record<string, unknown>;
        return (await axios.get<Blob>(url, { ...config, responseType: "blob" }))
          .data;
      case "post":
        return (await axios.post<TResponse>(url, params, config)).data;
      case "put":
        return (await axios.put<TResponse>(url, params, config)).data;
      case "patch":
        return (await axios.patch<TResponse>(url, params, config)).data;
      case "delete":
        return (await axios.delete<TResponse>(url, { ...config, data: params }))
          .data;
      case "post_formdata":
        return (await axios.post<TResponse>(url, params, configFormData)).data;
      case "put_formdata":
        return (await axios.put<TResponse>(url, params, configFormData)).data;
      default:
        return false;
    }
  } catch (err) {
    return axiosError(err as AxiosError);
  }
};

// Service wrapper
const apiService = {
  get: <T>(url: string, params?: Record<string, unknown>) =>
    axiosService<T>("get", url, params),
  getDownload: (url: string, params?: Record<string, unknown>) =>
    axiosService<Blob>("getDownload", url, params),
  post: <T, P = unknown>(url: string, params?: P) =>
    axiosService<T, P>("post", url, params),
  put: <T, P = unknown>(url: string, params?: P) =>
    axiosService<T, P>("put", url, params),
  patch: <T, P = unknown>(url: string, params?: P) =>
    axiosService<T, P>("patch", url, params),
  delete: <T, P = unknown>(url: string, params?: P) =>
    axiosService<T, P>("delete", url, params),
  post_formdata: <T>(
    url: string,
    params: FormData,
    callback?: (percent: number) => void
  ) => axiosService<T>("post_formdata", url, params, callback),
  put_formdata: <T>(
    url: string,
    params: FormData,
    callback?: (percent: number) => void
  ) => axiosService<T>("put_formdata", url, params, callback),
};

export default apiService;
