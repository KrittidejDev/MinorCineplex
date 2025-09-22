import apiService from "./apiServices";
import { BASE_PATH_API } from "./apiConfig";

const apiPath = BASE_PATH_API;

// 1️⃣ สร้าง type สำหรับ Auth
export interface LoginParams {
  email: string;
  password: string;
}
export interface SignupParams {
  username: string;
  email: string;
  password: string;
}
export interface UpdateProfileParams {
  username?: string;
  email?: string;
  avatar?: string;
}
export interface ResetPasswordParams {
  oldPassword: string;
  newPassword: string;
}

// 2️⃣ Category
export interface CategoryParams {
  name: string;
  description?: string;
}

// 3️⃣ Article
export interface ArticleParams {
  title: string;
  content: string;
  categoryId: string;
}

// 4️⃣ File Upload
export interface FileUploadParams {
  file: File | Blob;
}

export const userService = {
  // Auth
  POST_LOGIN: (params: LoginParams) =>
    apiService.post(`${apiPath}/auth/login`, params),
  POST_LOGOUT: () => apiService.post(`${apiPath}/login/logout`),
  POST_SIGNUP: (params: SignupParams) =>
    apiService.post(`${apiPath}/auth/register`, params),
  GET_MY_PROFILE: () => apiService.get(`${apiPath}/auth/me`),
  PUT_UPDATE_PROFILE: (id: string, params: UpdateProfileParams) =>
    apiService.put(`${apiPath}/users/${id}`, params),
  RESET_PASSWORD: (id: string, params: ResetPasswordParams) =>
    apiService.patch(`${apiPath}/users/${id}/password`, params),
  GET_ADMIN_PUBLIC: () => apiService.get(`${apiPath}/users/public`),

  // Category
  GET_CATEGORY: (queryString?: string) =>
    apiService.get(`${apiPath}/categories${queryString ?? ""}`),
  GET_CATEGORY_BY_ID: (id: string) =>
    apiService.get(`${apiPath}/categories/${id}`),
  POST_CREATE_CATEGORY: (params: CategoryParams) =>
    apiService.post(`${apiPath}/categories`, params),
  PUT_EDIT_CATEGORY: (id: string, params: CategoryParams) =>
    apiService.put(`${apiPath}/categories/${id}`, params),
  DELETE_CATEGORY: (id: string) =>
    apiService.delete(`${apiPath}/categories/${id}`),

  // Article
  GET_ARTICLE: (queryString?: string) =>
    apiService.get(`${apiPath}/blogs${queryString ?? ""}`),
  GET_ARTICLE_BY_ID: (id: string) => apiService.get(`${apiPath}/blogs/${id}`),
  POST_CREATE_ARTICLE: (params: ArticleParams) =>
    apiService.post(`${apiPath}/blogs`, params),
  PUT_EDIT_ARTICLE: (id: string, params: ArticleParams) =>
    apiService.put(`${apiPath}/blogs/${id}`, params),
  DELETE_ARTICLE: (id: string) => apiService.delete(`${apiPath}/blogs/${id}`),

  // Notification
  GET_NOTIFICATION: () => apiService.get(`${apiPath}/notification`),

  // File
  POST_FILE_UPLOAD: (params: FileUploadParams) =>
    apiService.post_formdata(`${apiPath}/files/upload`, params),
  DELETE_FILE: (fileId: string) =>
    apiService.delete(`${apiPath}/files/delete/${fileId}`),
};
