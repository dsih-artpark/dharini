import { AxiosError } from "axios";
import apiClient from "@/src/libs/apiClient";
import { setToken } from "@/src/utils/auth";
import type { ApiResponse, ProjectDetail } from "@/src/types/global";
import type { UserProfile } from "@/src/types/user";

export const acceptProjectInvite = async (
  inviteToken: string,
): Promise<{ accessToken: string }> => {
  try {
    const response = await apiClient.post(`/invites/accept/${inviteToken}`);
    const data = response.data;
    if (data.success) {
      setToken(data.data.accessToken);
    }
    return data.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(
      "An unknown error occurred while accepting project invite.",
    );
  }
};

export const updateUser = async (
  id: string,
  payload: UserProfile,
): Promise<ApiResponse<UserProfile>> => {
  try {
    const response = await apiClient.patch(`/users/${id}`, payload);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(
      "An unknown error occurred while accepting project invite.",
    );
  }
};

export const updateProject = async (
  id: string,
  payload: {
    diseases?: string[];
    surveillanceTypes?: string[];
    regions?: string[];
    logisticDetails?: string[];
    processDetail?: string;
  },
): Promise<ApiResponse<ProjectDetail>> => {
  try {
    const response = await apiClient.patch(`/projects/${id}`, payload);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("An unknown error occurred while updating projects.");
  }
};

export const invitePartners = async (
  projectId: string,
  organizations: {
    orgType: string;
    organizationId?: string;
    organizationName: string;
    email: string;
  }[],
): Promise<ApiResponse<unknown>> => {
  try {
    const response = await apiClient.post(`/invites/partners`, {
      projectId,
      organizations,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(
      "An unknown error occurred while accepting project invite.",
    );
  }
};

export type DiseaseGroup = "AI" | "FMD_LSD";
export type ImportSection = "collection" | "lab";

export interface RowError {
  row: number;
  column?: string;
  message: string;
}

export interface ImportResult {
  success: boolean;
  importedCount: number;
  errors: RowError[];
}

export const downloadDataImportTemplate = async (
  projectId: string,
  diseaseGroup: DiseaseGroup,
  section: ImportSection
): Promise<Blob> => {
  const response = await apiClient.get(
    `/projects/${projectId}/data-import/template`,
    {
      params: { diseaseGroup, section },
      responseType: "blob",
    }
  );
  return response.data;
};

export const uploadDataImportFile = async (
  projectId: string,
  section: ImportSection,
  diseaseGroup: DiseaseGroup,
  file: File
): Promise<ApiResponse<ImportResult>> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("diseaseGroup", diseaseGroup);
  try {
    const response = await apiClient.post(
      `/projects/${projectId}/data-import/${section}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("An unknown error occurred while uploading the file.");
  }
};

