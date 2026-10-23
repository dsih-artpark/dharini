import apiClient from "@/src/libs/apiClient";
import type { ApiResponse, User } from "@/src/types/global";
import type { Sample, LabTest, Kit } from "@/src/types/sample";
import { AxiosError } from "axios";

// Get received samples
export const getSampleApi = async (
  projectId: string,
  sampleId: string,
): Promise<ApiResponse<Sample>> => {
  try {
    const response = await apiClient.get(
      `/projects/${projectId}/samples/${sampleId}`,
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch sample details.");
  }
};

export const getLabTestApi = async (
  projectId: string,
  sampleId: string,
): Promise<ApiResponse<LabTest[]>> => {
  try {
    const response = await apiClient.get(
      `/projects/${projectId}/samples/${sampleId}/lab-tests`,
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch lab test details.");
  }
};

export const getKitsApi = async (): Promise<ApiResponse<Kit[]>> => {
  try {
    const response = await apiClient.get(`/kits`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch kits list.");
  }
};

// Get team members for a project and team
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
    throw new Error("Failed to fetch team members.");
  }
};

// Get poolable samples for sample pooling
export const getPoolableSamplesApi = async (
  projectId: string,
  sampleId: string,
): Promise<ApiResponse<Sample[]>> => {
  try {
    const response = await apiClient.get(
      `/projects/${projectId}/samples/${sampleId}/poolable-samples`,
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch poolable samples.");
  }
};
