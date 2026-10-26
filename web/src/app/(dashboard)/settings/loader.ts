import { AxiosError } from "axios";
import apiClient from "@/src/libs/apiClient";
import type { ApiResponse } from "@/src/types/global";

export type ProjectDetailsRecord = Record<
  string,
  string | number | boolean | null
>;

export const getProjectDetailsApi = async (
  projectIds: string[],
): Promise<ApiResponse<ProjectDetailsRecord[]>> => {
  try {
    const response = await apiClient.post(
      "/projects/details",
      { projectId: projectIds },
      { params: { responseType: "json" } },
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch project details.");
  }
};

export const downloadProjectDetailsCsvApi = async (
  projectIds: string[],
): Promise<Blob> => {
  try {
    const response = await apiClient.post(
      "/projects/details",
      { projectId: projectIds },
      { params: { responseType: "csv" }, responseType: "blob" },
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to download project details CSV.");
  }
};
