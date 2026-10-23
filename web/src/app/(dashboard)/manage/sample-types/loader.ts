import apiClient from "@/src/libs/apiClient";
import type { ApiResponse } from "@/src/types/global";
import type { SampleType } from "@/src/types/sample";
import { AxiosError } from "axios";

export interface CreateSampleTypeInput {
  name: string;
  emojiIcon?: string;
  surveillanceType: string;
  diseaseShortNames?: string[];
}

export interface SurveillanceType {
  id: string;
  name: string;
}

export const getSampleTypesApi = async (): Promise<
  ApiResponse<SampleType[]>
> => {
  try {
    const response = await apiClient.get("/sample-type");
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch sample types.");
  }
};

export const createSampleTypeApi = async (
  data: CreateSampleTypeInput,
): Promise<ApiResponse<SampleType>> => {
  try {
    const response = await apiClient.post("/sample-type", data);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to create sample type.");
  }
};

export const updateSampleTypeApi = async (
  id: string,
  data: Partial<CreateSampleTypeInput>,
): Promise<ApiResponse<SampleType>> => {
  try {
    const response = await apiClient.patch(`/sample-type/${id}`, data);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to update sample type.");
  }
};

export const getSurveillanceTypesApi = async (): Promise<
  ApiResponse<SurveillanceType[]>
> => {
  try {
    const response = await apiClient.get("/surveillance-type");
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch surveillance types.");
  }
};
