import { AxiosError } from "axios";
import apiClient from "@/src/libs/apiClient";
import type { ApiResponse } from "@/src/types/global";
import type { Role, UserRole } from "@/src/types/user";

// 4.5: workspace members list (GET /workspaces/:workspaceId/members, 2.6).
export const getWorkspaceMembersApi = async (
  workspaceId: string,
): Promise<ApiResponse<UserRole[]>> => {
  try {
    const response = await apiClient.get(`/workspaces/${workspaceId}/members`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch workspace members.");
  }
};

// 4.5: GET /roles (2.9's minimal fix - any logged-in user may list roles) -
// used to populate the role picker when inviting/editing a workspace member.
// The caller is responsible for filtering to scope === "workspace", since
// this endpoint returns every role in the system.
export const getRolesApi = async (): Promise<ApiResponse<Role[]>> => {
  try {
    const response = await apiClient.get("/roles");
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch roles.");
  }
};
