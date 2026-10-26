import { AxiosError } from "axios";
import apiClient from "@/src/libs/apiClient";
import type {
  ApiResponse,
  ProjectDetail,
  SiteStatisticsByStatus,
} from "@/src/types/global";
import type { EditProjectDetailsPayload } from "@/src/components/projects/edit-project-details";
import { TeamProgress, TeamMemberProgress } from "@/src/types/teams";

// Get project detail
export const getProjectDetailApi = async (
  id: string,
): Promise<ApiResponse<ProjectDetail>> => {
  try {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch project detail.");
  }
};

export const updateProjectDetailsApi = async (
  id: string,
  payload: EditProjectDetailsPayload,
): Promise<ApiResponse<ProjectDetail>> => {
  try {
    const response = await apiClient.patch(`/projects/${id}`, payload);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to update project details.");
  }
};

// Download csv for project detail
export const downloadCsvProjectDetailApi = async (
  id: string,
): Promise<Blob> => {
  try {
    const response = await apiClient.get(`/projects/${id}/download-csv`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch project detail.");
  }
};

// Get sites statistics
export const getSitesStatisticsByStatusApi = async (
  id: string,
  params: { disease: string; startDate: string; endDate: string },
): Promise<ApiResponse<SiteStatisticsByStatus>> => {
  try {
    const response = await apiClient.get(
      `/projects/${id}/sites-statistics-by-status`,
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

export const getTeamProgressApi = async (
  id: string,
  params: {
    sort?: string;
    sortOrder?: "asc" | "desc";
    page: number;
    limit?: number;
  },
): Promise<ApiResponse<TeamProgress[]>> => {
  try {
    const response = await apiClient.get(`/projects/${id}/team-progress`, {
      params,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch team progress");
  }
};

export const getTeamMemberProgressApi = async (
  id: string,
  params: {
    diseaseId?: string;
    startDate?: string;
    endDate?: string;
    sort?: string;
    sortOrder?: "asc" | "desc";
    page: number;
    limit?: number;
  },
): Promise<ApiResponse<TeamMemberProgress[]>> => {
  try {
    const response = await apiClient.get(
      `/projects/${id}/team-member-progress`,
      { params },
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch team member progress");
  }
};

export const downloadCsvTeamMemberProgressApi = async (
  id: string,
  params: { diseaseId?: string; startDate?: string; endDate?: string },
): Promise<Blob> => {
  try {
    const response = await apiClient.get(
      `/projects/${id}/team-member-progress/download-csv`,
      {
        params,
        responseType: "blob",
      },
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to download CSV for team member progress.");
  }
};
