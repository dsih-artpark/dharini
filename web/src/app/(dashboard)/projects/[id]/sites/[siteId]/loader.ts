import { AxiosError } from "axios";

import apiClient from "@/src/libs/apiClient";
import type { ApiResponse } from "@/src/types/global";
import type { Visit } from "@/src/types/visit";

// Get site detail
export const getPastVisitsApi = async (
  projectId: string,
  params: {
    isCompleted: boolean;
    siteId: string;
    disease: string;
    siteType: string;
    startDate: string;
    endDate: string;
    page?: number;
    limit?: number;
  },
): Promise<ApiResponse<Visit[]>> => {
  try {
    const response = await apiClient.get(`/projects/${projectId}/visits`, {
      params,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch past visit list.");
  }
};

export const getVisitDetailApi = async (
  projectId: string,
  visitId: string,
): Promise<ApiResponse<Visit>> => {
  try {
    const response = await apiClient.get(
      `/projects/${projectId}/visits/${visitId}`,
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch visit detail.");
  }
};

// Get scheduled / upcoming visits
export const getScheduledVisitsApi = async (
  projectId: string,
  params: {
    siteId?: string;
    visitStatus?: string;
    isCompleted?: boolean;
    assignedTo?: boolean | string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  },
): Promise<ApiResponse<Visit[]>> => {
  try {
    const response = await apiClient.get(`/projects/${projectId}/visits`, {
      params,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch scheduled visits.");
  }
};

// Reschedule a specific visit
export const rescheduleVisitApi = async (
  projectId: string,
  visitId: string,
  data: {
    newScheduledDate: string;
  },
): Promise<ApiResponse<Visit>> => {
  try {
    const response = await apiClient.patch(
      `/projects/${projectId}/visits/${visitId}/reschedule`,
      data,
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to reschedule visit.");
  }
};


