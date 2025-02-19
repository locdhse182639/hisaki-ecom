import axiosInstance from "./axiosConfig";

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Login Error:", error);
    throw new Error(error.response?.data?.error || "Login failed");
  }
};

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>("/auth/register", {
      name,
      email,
      password,
      confirmPassword
    });
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Registration Error:", error);
    throw new Error(error.response?.data?.error || "Registration failed");
  }
};

export const verifyEmail = async (token: string) => {
  try {
    const response = await axiosInstance.get(
      `/auth/verify-email?token=${token}`
    );
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(
      "Email Verification Error:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Verification failed.");
  }
};
