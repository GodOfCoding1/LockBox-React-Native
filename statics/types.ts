export interface LoginRequestBody {
  username: string;
  password: string;
}

export interface RegisterRequestBody {
  username: string;
  email?: string;
  password: string;
  master_password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string; // Adjust type based on expected data from the API
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: any; // Adjust type based on the expected response structure
}
