import apiClient from "@/src/libs/apiClient";
import type {
  ApiResponse,
  LookupUserResult,
  ProjectDetail,
  ProjectStatistic,
  User,
} from "@/src/types/global";
import type { DiseaseWiseSampleStat } from "@/src/types/statistics";
import { ProjectTeamUsersResponse, Team } from "@/src/types/teams";
import { Role } from "@/src/types/user";
import { AxiosError } from "axios";

// Get all projects
export const getAllProjectsApi = async (params: {
  disease?: string;
  region?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  workspaceId?: string;
}): Promise<ApiResponse<ProjectDetail[]>> => {
  try {
    const response = await apiClient.get("/projects", { params });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch projects list.");
  }
};

// Get project statistics
export const getProjectStatisticsApi = async (params?: {
  workspaceId?: string;
}): Promise<ApiResponse<ProjectStatistic[]>> => {
  try {
    const response = await apiClient.get("/projects/statistics", {
      params,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch projects statistics.");
  }
};

// Download csv for projects
export const downloadCsvProjectsApi = async (): Promise<Blob> => {
  try {
    const response = await apiClient.get("/projects/download-csv", {
      responseType: "blob",
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to download csv for projects.");
  }
};

// Get sample statistics
export const getSampleStatisticsApi = async (): Promise<
  ApiResponse<DiseaseWiseSampleStat[]>
> => {
  try {
    const response = await apiClient.get(
      "/statistics/disease-wise-sample-stat",
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch samples statistics.");
  }
};

// Get all project teams
export const getTeamsByProjectIdApi = async (
  projectId: string,
): Promise<ApiResponse<Team[]>> => {
  try {
    const response = await apiClient.get(`/projects/${projectId}/teams`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch project teams.");
  }
};

// Get available roles
export const getAvailableRolesApi = async (
  projectId: string,
): Promise<ApiResponse<Role[]>> => {
  try {
    const response = await apiClient.get(
      `/projects/${projectId}/teams/available-roles`,
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch project teams.");
  }
};

export const getProjectTeamUserRolesApi = async (): Promise<
  ApiResponse<Role[]>
> => {
  try {
    const response = await apiClient.get("/projects/team-users/roles");
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch user roles.");
  }
};

// Get team member
export const getTeamMembersApi = async (
  projectId: string,
  teamId: string,
): Promise<ApiResponse<User[]>> => {
  try {
    const response = await apiClient.get(
      `/projects/${projectId}/teams/${teamId}/members`,
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch team member.");
  }
};

export const getSuperAdminsApi = async (): Promise<ApiResponse<User[]>> => {
  try {
    const response = await apiClient.get("/users/super-admins");
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch super admins.");
  }
};

export const getProjectTeamUsersApi = async (params?: {
  projectId?: string;
  workspaceId?: string;
}): Promise<ApiResponse<ProjectTeamUsersResponse>> => {
  try {
    const response = await apiClient.get("/projects/team-users", { params });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch project users.");
  }
};

// Identity check backing the "add a user" forms. The forms ask for an
// email/phone first and call this before showing any detail fields, so an
// admin adding someone who already exists sees that person's stored name
// instead of re-typing it (and, previously, silently renaming them).
//
// A miss is a normal answer, not an error: the endpoint returns
// `{ exists: false }` and the caller reveals the empty detail fields.
export const lookupUserApi = async (params: {
  email?: string;
  contactNumber?: string;
}): Promise<ApiResponse<LookupUserResult>> => {
  try {
    const response = await apiClient.get("/users/lookup", { params });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to check whether this user already exists.");
  }
};
