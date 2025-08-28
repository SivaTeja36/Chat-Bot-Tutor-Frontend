import axios from "axios";
import {
  LoginRequest,
  LoginResponse,
  RegisterUserRequest,
  ForgotPasswordRequest,
  SetPasswordRequest,
  KidRequest,
  GetKidResponse,
  GetQuestionsHistoryResponse,
  ApiResponse,
  GetApiResponse,
  UserInfoResponse,
  SuccessMessageResponse,
  GetUserDetailsResponse,
  UpdateUserRequest,
  UserResponse,
  ConfirmRegistrationRequest,
  ICreateChatResponse,
  IGetChatResponse,
  IPostChatRequest,
  IChatResponse,
  KeywordRestrictionRequest,
  GetKeywordRestrictionResponse,
  GetKidKeywordRestrictionResponse
} from "../types/api";

const API_BASE_URL = "http://localhost:8000"; // Update this to your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ---------------- AUTH & PUBLIC USER SERVICE ---------------- */
export const authAPI = {
  login: (data: LoginRequest) =>
    api.post<ApiResponse<LoginResponse>>("/login", data),

  verifyEmail: (email: string) =>
    api.get<ApiResponse<UserResponse>>(`/users/verify-email?email=${email}`),

  sendVerification: (data: RegisterUserRequest) =>
    api.post<ApiResponse<SuccessMessageResponse>>(
      "/users/send-verification",
      data
    ),

  createUser: (data: ConfirmRegistrationRequest) =>
    api.post<ApiResponse<UserResponse>>("/users", data),

  forgotPassword: (data: ForgotPasswordRequest) =>
    api.post<ApiResponse<UserResponse>>("/users/forgot-password", data),

  setPassword: (data: SetPasswordRequest) =>
    api.post<ApiResponse<UserResponse>>("/users/set-password", data),

  getUserInfo: () => api.get<ApiResponse<UserInfoResponse>>("/users/info"),
};

/* ---------------- PROTECTED USER MANAGEMENT ---------------- */
export const usersAPI = {
  getAllUsers: (params?: {
    search?: string;
    filter_by?: string;
    filter_values?: string;
    sort_by?: string;
    order_by?: "asc" | "desc";
    page?: number;
    page_size?: number;
  }) => api.get<GetApiResponse<GetUserDetailsResponse[]>>("/users", { params }),

  getUserById: (userId: number) =>
    api.get<ApiResponse<GetUserDetailsResponse>>(`/users/data/${userId}`),

  updateUserById: (userId: number, data: UpdateUserRequest) =>
    api.put<ApiResponse<UserResponse>>(`/users/data/${userId}`, data),
};

/* ---------------- KIDS MANAGEMENT ---------------- */
export const kidsAPI = {
  createKid: (data: KidRequest) =>
    api.post<ApiResponse<SuccessMessageResponse>>("/kids", data),

  getAllKids: (params?: {
    search?: string;
    filter_by?: string;
    filter_values?: string;
    sort_by?: string;
    order_by?: "asc" | "desc";
    page?: number;
    page_size?: number;
  }) => api.get<GetApiResponse<GetKidResponse[]>>("/kids", { params }),

  getKidById: (kidId: number) =>
    api.get<ApiResponse<GetKidResponse>>(`/kids/data/${kidId}`),

  updateKid: (kidId: number, data: KidRequest) =>
    api.put<ApiResponse<SuccessMessageResponse>>(`/kids/data/${kidId}`, data),

  deleteKid: (kidId: number) =>
    api.delete<ApiResponse<SuccessMessageResponse>>(`/kids/data/${kidId}`),

  // chat apis

  createChat: (kidId: number, data: ICreateChatResponse) =>
    api.post<ApiResponse<SuccessMessageResponse>>(
      `/kids/chats?kid_id=${kidId}`,
      data
    ),

  getChat: (kidId: number) =>
    api.get<ApiResponse<IGetChatResponse>>(`/kids/chats?kid_id=${kidId}`),

  updateChat: (kidId: number, chatId: number, data: ICreateChatResponse) =>
    api.put<ApiResponse<SuccessMessageResponse>>(
      `/kids/chats/${chatId}?kid_id=${kidId}`,
      data
    ),

  deleteKChat: (kidId: number, chatId: number) =>
    api.delete<ApiResponse<SuccessMessageResponse>>(
      `kids/chats/${chatId}?kid_id=${kidId}`
    ),

  // chat apis

  // chat conversations

  createQuestion: (chatId: number, data: IPostChatRequest) =>
    api.post<ApiResponse<IChatResponse>>(
      `/kids/chats/${chatId}/conversation`,
      data
    ),

  getChatHistory: (chatId: number) =>
    api.get<ApiResponse<GetQuestionsHistoryResponse[]>>(
      `/kids/chats/${chatId}/conversation`
    ),

  // chat conversations
};

export default api;



/* ---------------- KEYWORD RESTRICTION MANAGEMENT ---------------- */
export const keywordRestrictionsAPI = {
  // Create a new keyword restriction
  createRestriction: (data: KeywordRestrictionRequest) =>
    api.post<ApiResponse<SuccessMessageResponse>>(
      "/keyword-restrictions",
      data
    ),

  // Get all keyword restrictions (with filters & pagination)
  getAllRestrictions: (params?: {
    search?: string;
    filter_by?: string;
    filter_values?: string;
    sort_by?: string;
    order_by?: "asc" | "desc";
    page?: number;
    page_size?: number;
  }) =>
    api.get<GetApiResponse<GetKeywordRestrictionResponse[]>>(
      "/keyword-restrictions",
      { params }
    ),

  // Get a single keyword restriction by ID
  getRestrictionById: (restrictionId: number) =>
    api.get<ApiResponse<GetKeywordRestrictionResponse>>(
      `/keyword-restrictions/${restrictionId}`
    ),

  // Update a keyword restriction by ID
  updateRestriction: (
    restrictionId: number,
    data: KeywordRestrictionRequest
  ) =>
    api.put<ApiResponse<SuccessMessageResponse>>(
      `/keyword-restrictions/${restrictionId}`,
      data
    ),

  // Map a keyword restriction to a kid
  mapRestrictionToKid: (restrictionId: number, kidId: number) =>
    api.post<ApiResponse<SuccessMessageResponse>>(
      `/keyword-restrictions/${restrictionId}/kids?kid_id=${kidId}`
    ),

  // Get mapped restriction for kid
  getMappedRestrictionForKid: (restrictionId: number, kidId: number) =>
    api.get<ApiResponse<GetKidKeywordRestrictionResponse>>(
      `/keyword-restrictions/${restrictionId}/kids?kid_id=${kidId}`
    ),

  // Update mapped restriction for kid
  updateMappedRestrictionForKid: (restrictionId: number, kidId: number) =>
    api.put<ApiResponse<SuccessMessageResponse>>(
      `/keyword-restrictions/${restrictionId}/kids?kid_id=${kidId}`
    ),

  // Delete mapped restriction for kid
  deleteMappedRestrictionForKid: (restrictionId: number, kidId: number) =>
    api.delete<ApiResponse<SuccessMessageResponse>>(
      `/keyword-restrictions/${restrictionId}/kids?kid_id=${kidId}`
    ),

  // Get all kids' keyword restriction mappings (paginated)
  getAllKidsKeywordRestrictions: (params?: {
    sort_by?: string;
    order_by?: "asc" | "desc";
    page?: number;
    page_size?: number;
  }) =>
    api.get<GetApiResponse<GetKidKeywordRestrictionResponse[]>>(
      "/kids-keyword-restrictions",
      { params }
    ),
};
