import { AxiosError } from "axios";
import apiClient from "@/src/libs/apiClient";
import type { ApiResponse, globalSearchResponse } from "@/src/types/global";

export const getGlobalSearchApi = async (params: {
  searchText: string;
}): Promise<ApiResponse<globalSearchResponse>> => {
  try {
    const response = await apiClient.get("/search", { params });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to search projects/sites.");
  }
};
