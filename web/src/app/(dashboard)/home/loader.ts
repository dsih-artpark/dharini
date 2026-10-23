import { AxiosError } from "axios";
import apiClient, { convertToFormData } from "@/src/libs/apiClient";
import type { ApiResponse, uploadedFile, WeeklyStat } from "@/src/types/global";
import { HomeLast30DaysData, ProjectWithStat } from "@/src/types/statistics";

// Get weeks update
export const getWeeksUpdateApi = async (): Promise<ApiResponse<WeeklyStat>> => {
  try {
    const response = await apiClient.get("/statistics/weekly-update");
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch weekly statistics.");
  }
};

export const getHomeLast30DaysApi = async (
  projectId?: string,
  workspaceId?: string,
): Promise<ApiResponse<HomeLast30DaysData>> => {
  try {
    const params: Record<string, string> = {};
    if (projectId) params.projectId = projectId;
    if (workspaceId) params.workspaceId = workspaceId;

    const response = await apiClient.get("/statistics/home-last-30-days", {
      params,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch home last 30 days data.");
  }
};

export const uploadImagesApi = async ({
  files,
}: {
  files: File[];
}): Promise<ApiResponse<uploadedFile[]>> => {
  try {
    const formData = convertToFormData({ files });

    const response = await apiClient.post(`/media/upload-images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to upload files.");
  }
};

export const getSignedUrlApi = async (
  fileUrl: string,
): Promise<ApiResponse<string>> => {
  try {
    const response = await apiClient.get(`/media/signed-url`, {
      params: { fileUrl },
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to get signed URL.");
  }
};

// Get projects with statistics
export const getAllProjectsWithStatApi = async (params: {
  disease?: string;
  region?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<ProjectWithStat[]>> => {
  try {
    const response = await apiClient.get("/statistics/projects", { params });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch projects list.");
  }
};
