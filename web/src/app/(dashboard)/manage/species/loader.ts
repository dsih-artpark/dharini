import apiClient from "@/src/libs/apiClient";
import type { ApiResponse, Species } from "@/src/types/global";
import { AxiosError } from "axios";

export interface CreateSpeciesInput {
  name: string;
  emojiIcon?: string;
  abbreviation?: string;
  diseaseShortNames?: string[];
}

export const getSpeciesApi = async (): Promise<ApiResponse<Species[]>> => {
  try {
    const response = await apiClient.get("/species");
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch species.");
  }
};

export const createSpeciesApi = async (
  data: CreateSpeciesInput,
): Promise<ApiResponse<Species>> => {
  try {
    const response = await apiClient.post("/species", data);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to create species.");
  }
};

export const updateSpeciesApi = async (
  id: string,
  data: Partial<CreateSpeciesInput>,
): Promise<ApiResponse<Species>> => {
  try {
    const response = await apiClient.patch(`/species/${id}`, data);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to update species.");
  }
};

export const deleteSpeciesApi = async (
  id: string,
): Promise<ApiResponse<void>> => {
  try {
    const response = await apiClient.delete(`/species/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to delete species.");
  }
};
