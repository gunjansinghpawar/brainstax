// USER OBJECT
export interface AuthUser {
  _id: string;
  name: string;
  email?: string;
  role: string;
  isFirstLogin: boolean;
  companies?: string[];
}

// LOGIN REQUEST
export interface LoginRequest {
  email: string;
  password: string;
}

// LOGIN SUCCESS RESPONSE
export interface LoginSuccessResponse {
  success: true;
  message: string;
  data: {
    user: AuthUser;
    token: string;
  };
}

// LOGIN ERROR RESPONSE
export interface LoginErrorResponse {
  success: false;
  message: string;
}

// CHANGE PASSWORD REQUEST
export interface ChangePasswordRequest {
  newPassword: string;
}

// CHANGE PASSWORD SUCCESS RESPONSE
export interface ChangePasswordSuccess {
  success: true;
  message: string;
}

// CHANGE PASSWORD ERROR RESPONSE
export interface ChangePasswordError {
  success: false;
  message: string;
}
