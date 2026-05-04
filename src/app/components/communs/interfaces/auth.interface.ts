
export interface User {
  User_Id?: number;
  User_FirstName: string;
  User_LastName: string;
  User_Email: string;
  User_Password: string;
  User_Phone?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
}
