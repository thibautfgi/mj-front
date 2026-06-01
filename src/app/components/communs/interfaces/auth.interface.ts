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

/** Réponse du backend pour /login et /register */
export interface AuthResponse {
  userToken: string;
  userEmail: string;
  userFirstName: string;
  userLastName: string;
}

/** Réponse du backend pour /whoiam */
export interface WhoiamResponse {
  userEmail: string;
  userFirstName: string;
  userLastName: string;
}

