import { AxiosError } from "axios";
import apiClient from "@/src/libs/apiClient";
import type { ApiResponse, SiteStatisticsByDisease } from "@/src/types/global";
import type { Site } from "@/src/types/site";

// Get sites statistics by diseases
export const getSitesStatisticsByDiseasesApi = async (
  id: string,
  params?: { startDate: string; endDate: string },
): Promise<ApiResponse<SiteStatisticsByDisease[]>> => {
  try {
    const response = await apiClient.get(
      `/projects/${id}/sites-statistics-by-diseases`,
      { params },
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch sites statistics by status.");
  }
};

// Get sites
export const getProjectSitesApi = async (
  projectId: string,
  params: {
    disease: string;
    siteType: string;
    startDate: string;
    endDate: string;
    search: string;
    testResult: string;
    workspaceId?: string;
  },
): Promise<ApiResponse<Site[]>> => {
  try {
    const url = projectId ? `/projects/${projectId}/sites` : `/sites`;
    const response = await apiClient.get(url, {
      params,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch sites list.");
  }
};

// Get site detail
export const getSiteDetailApi = async (
  projectId: string,
  siteId: string,
): Promise<ApiResponse<Site>> => {
  try {
    const response = await apiClient.get(
      `/projects/${projectId}/sites/${siteId}`,
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch site detail.");
  }
};
