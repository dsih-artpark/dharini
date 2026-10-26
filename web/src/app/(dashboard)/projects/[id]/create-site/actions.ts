import { AxiosError } from "axios";
import apiClient from "@/src/libs/apiClient";
import type { ApiResponse } from "@/src/types/global";
import type { Site } from "@/src/types/site";

// Create site
export const createSiteApi = async (
  projectId: string,
  payload: Site,
): Promise<ApiResponse<Site>> => {
  try {
    const response = await apiClient.post(
      `/projects/${projectId}/sites`,
      payload,
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to create site.");
  }
};

// update site
export const updateSiteApi = async (
  projectId: string,
  siteId: string,
  payload: Site,
): Promise<ApiResponse<Site>> => {
  try {
    const response = await apiClient.patch(
      `/projects/${projectId}/sites/${siteId}`,
      payload,
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to update site.");
  }
};
