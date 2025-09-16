import apiService from "./apiServices";
import { BASE_PATH_API } from "./apiConfig";

const apiPath = BASE_PATH_API;

export const userService = {
  POST_LOGIN: (params: any) => apiService.post(`${apiPath}/auth/login`, params),
  POST_LOGOUT: (params: any) =>
    apiService.post(`${apiPath}/login/logout`, params),
  POST_SIGNUP: (params: any) =>
    apiService.post(`${apiPath}/auth/register`, params),
  GET_MY_PROFILE: (params?: any) =>
    apiService.get(`${apiPath}/auth/me`, params),
  PUT_UPDATE_PROFILE: (id: string, params: any) =>
    apiService.put(`${apiPath}/users/${id}`, params),
  RESET_PASSWORD: (id: string, params: any) =>
    apiService.patch(`${apiPath}/users/${id}/password`, params),
  GET_ADMIN_PUBLIC: () => apiService.get(`${apiPath}/users/public`),

  // Category
  GET_CATEGORY: (queryString?: string) =>
    apiService.get(`${apiPath}/categories${queryString ? queryString : ""}`),
  GET_CATEGORY_BY_ID: (id: string, params?: any) =>
    apiService.get(`${apiPath}/categories/${id}`, params),
  POST_CREATE_CATEGORY: (params: any) =>
    apiService.post(`${apiPath}/categories`, params),
  PUT_EDIT_CATEGORY: (id: string, params: any) =>
    apiService.put(`${apiPath}/categories/${id}`, params),
  DELETE_CATEGORY: (id: string) =>
    apiService.delete(`${apiPath}/categories/${id}`),

  // Article
  GET_ARTICLE: (queryString?: string) =>
    apiService.get(`${apiPath}/blogs${queryString ? queryString : ""}`),
  GET_ARTICLE_BY_ID: (id: string, params?: any) =>
    apiService.get(`${apiPath}/blogs/${id}`, params),
  POST_CREATE_ARTICLE: (params: any) =>
    apiService.post(`${apiPath}/blogs`, params),
  PUT_EDIT_ARTICLE: (id: string, params: any) =>
    apiService.put(`${apiPath}/blogs/${id}`, params),
  DELETE_ARTICLE: (id: string) => apiService.delete(`${apiPath}/blogs/${id}`),

  // Notification
  GET_NOTIFICATION: () => apiService.get(`${apiPath}/notification`),

  // File
  POST_FILE_UPLOAD: (params: any) =>
    apiService.post_formdata(`${apiPath}/files/upload`, params),
  DELETE_FILE: (params: any) =>
    apiService.delete(`${apiPath}/files/delete`, params),
};
