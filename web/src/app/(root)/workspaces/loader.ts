import { AxiosError } from "axios";
import apiClient from "@/src/libs/apiClient";
import type { ProjectDetail, Workspace } from "@/src/types/global";

// 4.2: GET /workspaces (2.6) - the workspaces the logged-in user belongs to.
export const getMyWorkspaces = async (): Promise<Workspace[]> => {
  try {
    const response = await apiClient.get("/workspaces");
    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(
      "An unknown error occurred while fetching your workspaces.",
    );
  }
};

// POST /workspaces - create a new workspace and auto-assign caller as workspace-admin.
export const createWorkspaceApi = async (name: string): Promise<Workspace> => {
  try {
    const response = await apiClient.post("/workspaces", { name });
    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("An unknown error occurred while creating the workspace.");
  }
};

// 4.4: GET /workspaces/:workspaceId/projects - the projects belonging to a
// given workspace. Used by useCurrentProjectResolver() to derive a fallback
// "current project" for workspace-admins, who have no user.project of their
// own.
export const getWorkspaceProjects = async (
  workspaceId: string,
): Promise<ProjectDetail[]> => {
  try {
    const response = await apiClient.get(`/workspaces/${workspaceId}/projects`);
    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(
      "An unknown error occurred while fetching this workspace's projects.",
    );
  }
};
