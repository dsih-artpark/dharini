import { AxiosError } from "axios";
import apiClient from "@/src/libs/apiClient";
import type { ApiResponse, User } from "@/src/types/global";

// Get project members
export const getProjectCollectorsApi = async (
  projectId: string,
): Promise<ApiResponse<User[]>> => {
  try {
    const response = await apiClient.get(`/projects/${projectId}/collectors`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch project members.");
  }
};
