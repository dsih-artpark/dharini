import { AxiosError } from "axios";

import apiClient from "@/src/libs/apiClient";
import type { ApiResponse } from "@/src/types/global";
import type { Kit, LabTest, Sample } from "@/src/types/sample";

export type UpdateCollectedSampleDetailsPayload = {
  barcode?: string;
  collectedBy?: string;
  collectionTime?: string;
};

// update sample
export const updateSampleApi = async (
  projectId: string,
  sampleId: string,
  payload: Partial<Sample>,
): Promise<ApiResponse<Sample>> => {
  try {
    const response = await apiClient.patch(
      `/projects/${projectId}/samples/${sampleId}`,
      payload,
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to update sample details.");
  }
};

export const updateCollectedSampleDetailsApi = async (
  projectId: string,
  sampleId: string,
  payload: UpdateCollectedSampleDetailsPayload,
): Promise<ApiResponse<Sample>> => {
  try {
    const response = await apiClient.post(
      `/projects/${projectId}/samples/${sampleId}/edit-details`,
      payload,
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to update collected sample details.");
  }
};

export const updateSampleStageDetailsApi = async (
  projectId: string,
  sampleId: string,
  stage: string,
  payload: Record<string, unknown>,
): Promise<ApiResponse<Sample>> => {
  try {
    const response = await apiClient.post(
      `/projects/${projectId}/samples/${sampleId}/edit-details/${stage}`,
      payload,
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to update sample details.");
  }
};

export const createLabTestApi = async (
  projectId: string,
  sampleId: string,
  payload: { labTests: Partial<LabTest>[] },
): Promise<ApiResponse<LabTest[]>> => {
  try {
    const response = await apiClient.post(
      `/projects/${projectId}/samples/${sampleId}/lab-tests`,
      payload,
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to create lab test details.");
  }
};

export const updateLabTestApi = async (
  projectId: string,
  sampleId: string,
  payload: { labTests: Partial<LabTest>[] },
): Promise<ApiResponse<LabTest[]>> => {
  try {
    const response = await apiClient.patch(
      `/projects/${projectId}/samples/${sampleId}/lab-tests`,
      payload,
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to update lab test details.");
  }
};

// Create a new kit
export const createKitApi = async (name: string): Promise<ApiResponse<Kit>> => {
  try {
    const response = await apiClient.post(`/kits`, { name });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to create kit.");
  }
};
