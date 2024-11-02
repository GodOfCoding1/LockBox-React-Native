import {
  LoginRequestBody,
  LoginResponse,
  RegisterRequestBody,
  RegisterResponse,
} from "@/statics/types";
import { getValueFromLocal } from "@/utlis/secure-store";
import axios from "axios";

const api = axios.create({
  baseURL: "https://lockbox.onrender.com/api/",
  timeout: 100000,
});

api.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `${getValueFromLocal("token")}`;
    return config;
  },
  (error) => Promise.reject(error)
);

const isLoggedin = async () => {
  try {
    await api.get("/user/info");
    return true;
  } catch {
    return false;
  }
};

const userInfo = async () => {
  try {
    const res = await api.get("/user/info");
    return res.data.user;
  } catch (error) {
    throw Error("some error occured");
  }
};

const loginUser = async (data: LoginRequestBody): Promise<LoginResponse> => {
  // Basic field validation
  if (!data.username || !data.password) {
    return {
      success: false,
      message: "Email and password are required.",
      token: "",
    };
  }

  try {
    const response = await api.post("user/login", data);

    // Handle successful response
    if (response.status === 200 && response.data.success) {
      return {
        success: true,
        message: "Login successful.",
        token: response.data.token, // Adjust as needed
      };
    }

    // Handle specific response status for invalid credentials
    if (response.status === 401) {
      return {
        success: false,
        message: "Invalid email or password.",
        token: "",
      };
    }

    // Handle other unexpected statuses
    return {
      success: false,
      message: "Unexpected response from server.",
      token: "",
    };
  } catch (error: any) {
    // Handle network errors
    if (error.response) {
      // Server responded with a status other than 200 range
      const status = error.response.status;

      if (status === 500) {
        return {
          success: false,
          message: "Server error. Please try again later.",
          token: "",
        };
      } else {
        return {
          success: false,
          message: `Request failed with status ${status}.`,
          token: "",
        };
      }
    } else if (error.request) {
      // Request made but no response received
      return {
        success: false,
        message: "Network error. Please check your connection.",
        token: "",
      };
    } else {
      // Error setting up the request
      return {
        success: false,
        message: `Unexpected error: ${error.message}`,
        token: "",
      };
    }
  }
};

const registerUser = async (
  data: RegisterRequestBody
): Promise<RegisterResponse> => {
  // Basic field validation
  if (!data.username || !data.password || !data.master_password) {
    return {
      success: false,
      message: "Username, password, and master password are required.",
    };
  }

  try {
    const response = await api.post("user/register", data);

    // Handle successful registration
    if (response.data.success) {
      return {
        success: true,
        message: "Registration successful.",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.data.message,
    };
  } catch (error: any) {
    console.log("inside api regitser user", error);
    // Handle network errors
    if (error.response) {
      // Server responded with a status other than 200 range
      const status = error.response.status;

      if (status === 500) {
        return {
          success: false,
          message: "Server error. Please try again later.",
        };
      } else {
        return {
          success: false,
          message: error?.response?.data
            ? error.response.data?.message
            : `Request failed with status ${status}.`,
        };
      }
    } else if (error.request) {
      // Request made but no response received
      return {
        success: false,
        message: "Network error. Please check your connection.",
      };
    } else {
      // Error setting up the request
      return {
        success: false,
        message: `Unexpected error: ${error.message}`,
      };
    }
  }
};

export { isLoggedin, userInfo, loginUser, registerUser };
