import { AxiosError } from "axios";
import apiClient from "@/src/libs/apiClient";
import type { ApiResponse } from "@/src/types/global";
import { TeamMemberActivity, TeamProgressStats } from "@/src/types/teams";

export const getTeamProgressSampleStatApi = async (
  projectId: string,
): Promise<ApiResponse<TeamProgressStats>> => {
  try {
    const response = await apiClient.get(
      `/projects/${projectId}/team-activity-progress`,
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch team progress statistics.");
  }
};

export const getTeamMemberActivityApi = async (
  projectId: string,
  params: {
    diseaseId: string;
    startDate?: string;
    endDate?: string;
    page: number;
    limit?: number;
    sortOrder?: "asc" | "desc";
    sort?: string;
  },
): Promise<ApiResponse<TeamMemberActivity[]>> => {
  try {
    const response = await apiClient.get(
      `/projects/${projectId}/team-member-activity`,
      { params },
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch team member activity.");
  }
};

// Download csv for projects
export const downloadCsvTeamProgressApi = async (
  projectId: string,
  params: { diseaseId?: string; startDate?: string; endDate?: string },
): Promise<Blob> => {
  try {
    const response = await apiClient.get(
      `/projects/${projectId}/team-member-activity/download-csv`,
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
    throw new Error("Failed to download csv for team members activity.");
  }
};
