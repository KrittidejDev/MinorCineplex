import axios, { AxiosRequestConfig } from "axios";
import { BASE_API } from "./apiConfig";
import { toast } from "react-toastify";

// --- ตัวแปร logout function ที่ inject จาก AuthContext
let logoutFn: null | (() => void) = null;

// ฟังก์ชันนี้ให้ AuthProvider inject logout เข้ามา
export const setLogoutHandler = (fn: () => void) => {
  logoutFn = fn;
};

const getConfig = (token: string | null): AxiosRequestConfig => ({
  baseURL: BASE_API,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});

const getConfigFormData = (
  token: string | null,
  callback?: (percent: number) => void
): AxiosRequestConfig => ({
  baseURL: BASE_API,
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${token}`,
    token: token ?? "",
  },
  onUploadProgress: function (progressEvent: any) {
    let percentCompleted = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );
    callback && callback(percentCompleted);
  },
});

const axiosSuccess = (result: any) => result.data;

const axiosError = (error: any) => {
  console.error("axios error =>", error);

  if (error?.response?.status === 403) {
    toast.error("เซสชันของคุณหมดอายุแล้ว กรุณาเข้าสู่ระบบใหม่");

    if (logoutFn) {
      logoutFn(); // ✅ logout จาก context
    } else {
      window.location.href = "/login";
    }
    return error.response;
  }

  if (error?.code === "ERR_NETWORK") {
    toast.error("มีปัญหาการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง");
    return error.response;
  }

  return error.response;
};

const axiosService = async (
  type: string,
  url: string,
  params?: any,
  callback?: (percent: number) => void
) => {
  const token = localStorage.getItem("token");
  const config = getConfig(token);
  const configFormData = getConfigFormData(token, callback);

  switch (type) {
    case "get":
      if (params) config.params = params;
      return axios.get(url, config).then(axiosSuccess).catch(axiosError);
    case "getDownload":
      if (params) config.params = params;
      return axios
        .get(url, { ...config, responseType: "blob" })
        .then(axiosSuccess)
        .catch(axiosError);
    case "post":
      return axios
        .post(url, params, config)
        .then(axiosSuccess)
        .catch(axiosError);
    case "put":
      return axios
        .put(url, params, config)
        .then(axiosSuccess)
        .catch(axiosError);
    case "patch":
      return axios
        .patch(url, params, config)
        .then(axiosSuccess)
        .catch(axiosError);
    case "delete":
      return axios
        .delete(url, { ...config, data: params })
        .then(axiosSuccess)
        .catch(axiosError);
    case "post_formdata":
      return axios
        .post(url, params, configFormData)
        .then(axiosSuccess)
        .catch(axiosError);
    case "put_formdata":
      return axios
        .put(url, params, configFormData)
        .then(axiosSuccess)
        .catch(axiosError);
    default:
      return false;
  }
};

const apiService = {
  get: (url: string, params?: any) => axiosService("get", url, params),
  getDownload: (url: string, params?: any) =>
    axiosService("getDownload", url, params),
  post: (url: string, params?: any) => axiosService("post", url, params),
  put: (url: string, params?: any) => axiosService("put", url, params),
  delete: (url: string, params?: any) => axiosService("delete", url, params),
  post_formdata: (
    url: string,
    params: any,
    callback?: (percent: number) => void
  ) => axiosService("post_formdata", url, params, callback),
  put_formdata: (
    url: string,
    params: any,
    callback?: (percent: number) => void
  ) => axiosService("put_formdata", url, params, callback),
  patch: (url: string, params?: any) => axiosService("patch", url, params),
};

export default apiService;
