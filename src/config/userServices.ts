import apiService from './apiServices'
import { BASE_PATH_API } from './apiConfig'

const apiPath = BASE_PATH_API

// ----------- Types ----------------

// Auth
export interface LoginParams {
  email: string
  password: string
}
export interface SignupParams {
  username: string
  email: string
  password: string
}
export interface UpdateProfileParams {
  username?: string
  avatar_url?: string
  avatar_id?: string
}
export interface ResetPasswordParams {
  oldPassword: string
  newPassword: string
}

// Category
export interface CategoryParams {
  name: string
  description?: string
}

// Article
export interface ArticleParams {
  title: string
  content: string
  categoryId: string
}

// File
export interface FileUploadParams {
  file: File | Blob
}

// ----------- User Service ----------------
export const userService = {
  // Auth
  POST_LOGIN: (params: LoginParams) =>
    apiService.post<{ token: string }, LoginParams>(
      `${apiPath}/auth/login`,
      params
    ),
  POST_LOGOUT: () => apiService.post<void>(`${apiPath}/auth/logout`),
  POST_SIGNUP: (params: SignupParams) =>
    apiService.post<{ id: string }, SignupParams>(
      `${apiPath}/auth/register`,
      params
    ),
  GET_MY_PROFILE: (id: string) => apiService.get(`${apiPath}/users/${id}`),
  PUT_UPDATE_PROFILE: (id: string, params: UpdateProfileParams) =>
    apiService.put(`${apiPath}/users/${id}`, params),
  RESET_PASSWORD: (id: string, params: ResetPasswordParams) =>
    apiService.patch(`${apiPath}/users/${id}/password`, params),

  // Category
  // GET_CATEGORY: (query?: string) =>
  //   apiService.get(`${apiPath}/categories${query ?? ""}`),
  // GET_CATEGORY_BY_ID: (id: string) =>
  //   apiService.get(`${apiPath}/categories/${id}`),
  // POST_CREATE_CATEGORY: (params: CategoryParams) =>
  //   apiService.post(`${apiPath}/categories`, params),
  // PUT_EDIT_CATEGORY: (id: string, params: CategoryParams) =>
  //   apiService.put(`${apiPath}/categories/${id}`, params),
  // DELETE_CATEGORY: (id: string) =>
  //   apiService.delete(`${apiPath}/categories/${id}`),

  // Article
  // GET_ARTICLE: (query?: string) =>
  //   apiService.get(`${apiPath}/blogs${query ?? ""}`),
  // GET_ARTICLE_BY_ID: (id: string) => apiService.get(`${apiPath}/blogs/${id}`),
  // POST_CREATE_ARTICLE: (params: ArticleParams) =>
  //   apiService.post(`${apiPath}/blogs`, params),
  // PUT_EDIT_ARTICLE: (id: string, params: ArticleParams) =>
  //   apiService.put(`${apiPath}/blogs/${id}`, params),
  // DELETE_ARTICLE: (id: string) => apiService.delete(`${apiPath}/blogs/${id}`),

  // Notification
  // GET_NOTIFICATION: () => apiService.get(`${apiPath}/notification`),

  // booking

  GET_SHOWTIME_BOOKING: (id: string, query?: string) =>
    apiService.get(`${apiPath}/showtimes/${id}/booking${query ?? ''}`),

  // File
  POST_FILE_UPLOAD: (params: FileUploadParams) => {
    const formData = new FormData()
    formData.append('file', params.file)
    return apiService.post_formdata(`${apiPath}/file-upload`, formData)
  },

  DELETE_FILE: (fileId: string) =>
    apiService.delete(`${apiPath}/file-upload?fileId=${fileId}`),

  // Cinema
  GET_CINEMAS: (query?: string) =>
    apiService.get(`${apiPath}/cinemas${query ?? ''}`),
  GET_CINEMA_BY_ID: (id: string, query?: string) =>
    apiService.get(`${apiPath}/cinemas/detail/${id}${query ?? ''}`),

  // Coupons
  // GET สถานะ coupon ของ user
  GET_COUPON_BY_ID: (id: number) =>
    apiService.get(`${apiPath}/coupons/${id}/collect`),

  // POST รับคูปอง
  COLLECT_COUPON: (id: number) =>
    apiService.post(`${apiPath}/coupons/${id}/collect`),
  // GET coupon ที่เก็บแล้ว
  GET_COUPON_COLLECTED : () => 
    apiService.get(`${apiPath}/coupons/collected`),
  
}
