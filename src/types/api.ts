/* ---------- AUTH TYPES ---------- */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterUserRequest {
  name: string;
  email: string;
  gender: string;
  role: string;
  phone_number: string;
}

export interface ConfirmRegistrationRequest {
  password: string;
  token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface SetPasswordRequest {
  invitation_token: string; // min length: 36
  password: string; // 8 - 16 chars
}

/* ---------- KIDS TYPES ---------- */

export interface KidRequest {
  name: string;
  age: number;
  gender: string;
  school: string;
  standard: string;
  SuccessMessageResponse?: string;
}

export interface GetKidResponse {
  id: number;
  name: string;
  age: number;
  gender: string;
  school: string;
  standard: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  SuccessMessageResponse: string;
}

export interface QuestionRequest {
  question: string;
}

export interface GetQuestionsHistoryResponse {
  id: string;
  question: string;
  answer: string;
  subject: string;
  created_at: string; // ISO datetime
}

/* ---------- USER TYPES ---------- */

export interface UserInfoResponse {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface UpdateUserRequest {
  name: string;
  gender: string;
  role: string;
  phone_number: string;
  is_active?: boolean | null;
}

export interface UserResponse {
  id?: number | null;
  message: string;
}

export interface GetUserDetailsResponse {
  id: number;
  name: string;
  email: string;
  gender: string;
  phone_number: string;
  role: string;
  created_at: string;
  created_by?: string | null;
  updated_at: string;
  updated_by?: string | null;
  is_active: boolean;
}

/* ---------- GENERIC RESPONSES ---------- */

// Generic API response wrapper
export interface ApiResponse<T> {
  status_message: string; // usually "SUCCESS"
  data: T;
}

// API response with pagination
export interface GetApiResponse<T> {
  status_message: string;
  page?: number | null;
  page_size?: number | null;
  total_items?: number | null;
  data: T;
}

// A standard success message response
export interface SuccessMessageResponse {
  id?: number | null;
  message: string;
}

/* ---------- VALIDATION ERRORS ---------- */

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail?: ValidationError[];
}

// chat apis interface
export interface ICreateChatResponse {
  title: string;
}

export interface IGetChatResponse {
  status_message: string;
  data: IGetChat[];
}

export interface IGetChat {
  id: number;
  title: string;
  created_at: string;
}

// chat response
export interface IPostChatRequest {
  question: string;
}

export interface IChatResponse {
  status_message: string;
  data: IChat;
}

export interface IChat {
  id: number;
  message: string;
}


/* ---------- KEYWORD RESTRICTION TYPES ---------- */

/**
 * Request model for creating/updating keyword restrictions
 */
export interface KeywordRestrictionRequest {
  title: string;
  keywords: string[]; // array of forbidden words
}

/**
 * Response model for keyword restriction details
 */
export interface GetKeywordRestrictionResponse {
  id: number;
  title: string;
  keywords: string[];
  created_at: string;   // ISO date-time
  created_by: string;
  updated_at: string;   // ISO date-time
  updated_by: string;
}

/**
 * Response model for a kid + their mapped keyword restriction
 */
export interface GetKidKeywordRestrictionResponse {
  kid: GetKidResponse; // already defined in your code
  keyword_restrictions: GetKeywordRestrictionResponse;
}

/**
 * Response wrapper for single KeywordRestriction
 */
export interface ApiResponse_GetKeywordRestriction {
  status_message: string;
  data: GetKeywordRestrictionResponse;
}

/**
 * Response wrapper for single KidKeywordRestriction
 */
export interface ApiResponse_GetKidKeywordRestriction {
  status_message: string;
  data: GetKidKeywordRestrictionResponse;
}

/**
 * Paginated response for listing keyword restrictions
 */
export interface GetApiResponse_KeywordRestrictions {
  status_message: string;
  page?: number | null;
  page_size?: number | null;
  total_items?: number | null;
  data: GetKeywordRestrictionResponse[];
}

/**
 * Paginated response for listing kid-to-keyword-restriction mappings
 */
export interface GetApiResponse_KidKeywordRestrictions {
  status_message: string;
  page?: number | null;
  page_size?: number | null;
  total_items?: number | null;
  data: GetKidKeywordRestrictionResponse[];
}
