import apiClient from "@/src/libs/apiClient";
import type { ApiResponse } from "@/src/types/global";
import type { Sample, SampleStatistics } from "@/src/types/sample";
import { AxiosError } from "axios";

// Get received samples
export const getAllSamplesApi = async (
  projectId: string,
  params: {
    search?: string;
    referenceBatchId?: string;
    accessionId?: string;
    visitId?: string;
    diseaseId?: string;
    sampleTypeId?: string;
    sampleStatus?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    sort?: string;
    sortOrder?: string;
    stateId?: string;
    round?: number;
    siteId?: string;
    testResult?: string;
    workspaceId?: string;
  },
): Promise<ApiResponse<Sample[]>> => {
  try {
    const response = await apiClient.get(`/projects/${projectId}/samples`, {
      params,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch samples list.");
  }
};

// Get max round for a project
export const getMaxRoundApi = async (
  projectId: string,
  workspaceId?: string,
): Promise<number> => {
  try {
    const response = await apiClient.get(
      `/projects/${projectId}/samples/max-round`,
      {
        params: workspaceId ? { workspaceId } : undefined,
      },
    );
    return response.data?.data ?? 0;
  } catch {
    return 0;
  }
};

// Get samples statistics
export const getSamplesStatisticsApi = async (
  projectId: string,
  params: {
    startDate?: string;
    endDate?: string;
    workspaceId?: string;
  },
): Promise<ApiResponse<SampleStatistics>> => {
  try {
    const response = await apiClient.get(
      `/projects/${projectId}/samples/lab-stats`,
      {
        params,
      },
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch samples statistics.");
  }
};
