import { AxiosError } from "axios";
import apiClient from "@/src/libs/apiClient";
import type { ApiResponse, ProjectDetail, User } from "@/src/types/global";
import { ProjectTeamUser, Team } from "@/src/types/teams";

// Create project
export const createProjectApi = async (payload: {
  name: string;
  code: string;
  diseases: string[];
  surveillanceTypes: string[];
  regions: string[];
  teams: {
    teamName: string;
    email: string;
    isProjectViewer?: boolean;
  }[];
  // 4.5: scopes the project to a workspace when created from the
  // workspace-admin "create new project" entry point.
  workspaceId?: string;
}): Promise<ApiResponse<ProjectDetail>> => {
  try {
    const response = await apiClient.post("/projects", payload);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to create project.");
  }
};

// Add team
export const addTeamApi = async (
  projectId: string,
  payload: {
    teamName: string;
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    contactNumber?: string;
    logo?: string;
    isProjectViewer: boolean;
  },
): Promise<ApiResponse<Team>> => {
  try {
    const response = await apiClient.post(
      `/projects/${projectId}/teams`,
      payload,
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to add team.");
  }
};

// Update team
export const updateTeamApi = async (
  projectId: string,
  teamId: string,
  payload: {
    teamName: string;
    address?: string;
    logo?: string;
    isProjectViewer?: boolean;
  },
): Promise<ApiResponse<Team>> => {
  try {
    const response = await apiClient.patch(
      `/projects/${projectId}/teams/${teamId}`,
      payload,
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to update team.");
  }
};

// Add team member
export const addTeamMemberApi = async (
  projectId: string,
  teamId: string,
  data: {
    project: string;
    email: string;
    // Optional: omitted when the email/phone already belongs to an existing
    // user, whose name is reused rather than re-entered.
    firstName?: string;
    lastName?: string;
    contactNumber?: string;
    role: string;
  },
): Promise<ApiResponse<User>> => {
  try {
    const response = await apiClient.post(
      `/projects/${projectId}/teams/${teamId}/member`,
      data,
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to add team member.");
  }
};

// Update team member
export const updateTeamMemberApi = async (
  projectId: string,
  teamId: string,
  memberId: string,
  data: {
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    contactNumber?: string | null;
  },
): Promise<ApiResponse<User>> => {
  try {
    const response = await apiClient.patch(
      `/projects/${projectId}/teams/${teamId}/member/${memberId}`,
      data,
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to add team member.");
  }
};

// Delete team member
export const deleteTeamMemberApi = async (
  projectId: string,
  teamId: string,
  memberId: string,
): Promise<ApiResponse<User>> => {
  try {
    const response = await apiClient.delete(
      `/projects/${projectId}/teams/${teamId}/member/${memberId}`,
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to add team member.");
  }
};

export const updateProjectTeamUserRoleApi = async (
  memberId: string,
  data: {
    roleId: string;
    projectId: string;
    teamId: string;
  },
): Promise<ApiResponse<ProjectTeamUser>> => {
  try {
    const response = await apiClient.patch(
      `/projects/team-users/${memberId}/role`,
      data,
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to update user role.");
  }
};

export const createSuperAdminApi = async (data: {
  email: string;
  firstName: string;
  lastName: string;
  contactNumber?: string;
}): Promise<ApiResponse<User>> => {
  try {
    const response = await apiClient.post("/users/super-admins", data);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to create super admin.");
  }
};

export const updateSuperAdminApi = async (
  userId: string,
  data: {
    email?: string;
    firstName?: string;
    lastName?: string;
    contactNumber?: string | null;
  },
): Promise<ApiResponse<User>> => {
  try {
    const response = await apiClient.patch(
      `/users/super-admins/${userId}`,
      data,
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to update super admin.");
  }
};

export const deleteSuperAdminApi = async (
  userId: string,
): Promise<ApiResponse<null>> => {
  try {
    const response = await apiClient.delete(`/users/super-admins/${userId}`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to remove super admin.");
  }
};
