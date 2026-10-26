import { AxiosError } from "axios";
import apiClient from "@/src/libs/apiClient";
import type { ApiResponse } from "@/src/types/global";
import type { UserProfile } from "@/src/types/user";

export const fetchUserProfileApi = async (): Promise<
  ApiResponse<UserProfile>
> => {
  try {
    const response = await apiClient.get("/users/profile");
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch user profile.");
  }
};
