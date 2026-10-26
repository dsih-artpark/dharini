import { AxiosError } from "axios";
import apiClient from "@/src/libs/apiClient";
import type { ApiResponse } from "@/src/types/global";
import {
  ProjectComparisonData,
  SiteComparisonData,
  SampleTypeComparisonData,
} from "@/src/types/statistics";

export const getProjectComparisonApi = async (params: {
  workspaceId?: string;
  projectId?: string[];
  diseaseId?: string | string[];
  sampleTypeId?: string | string[];
  stateId?: string | string[];
  districtId?: string | string[];
  startDate?: string;
  endDate?: string;
}): Promise<ApiResponse<ProjectComparisonData>> => {
  try {
    const response = await apiClient.get(`/statistics/project-comparison`, {
      params,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch project comparison statistics.");
  }
};

export const getSiteComparisonApi = async (params: {
  projectId?: string;
  site1Id: string;
  site2Id: string;
  sampleTypeId?: string | string[];
  startDate?: string;
  endDate?: string;
}): Promise<ApiResponse<SiteComparisonData>> => {
  try {
    const response = await apiClient.get(`/statistics/site-comparison`, {
      params,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch site comparison statistics.");
  }
};

export const getSampleTypeComparisonApi = async (params: {
  projectId?: string;
  sampleType1Id: string;
  sampleType2Id: string;
  siteId?: string | string[];
  stateId?: string | string[];
  startDate?: string;
  endDate?: string;
}): Promise<ApiResponse<SampleTypeComparisonData>> => {
  try {
    const response = await apiClient.get(`/statistics/sample-type-comparison`, {
      params,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch sample type comparison statistics.");
  }
};
