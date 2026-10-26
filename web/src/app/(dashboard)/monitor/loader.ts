import { AxiosError } from "axios";
import apiClient from "@/src/libs/apiClient";
import type {
  ApiResponse,
  SiteWiseSampleStat,
  SurveillanceType,
} from "@/src/types/global";
import type { ExploreSite } from "@/src/types/site";
import {
  DiseaseWisePositiveSampleStat,
  DiseaseWisePositiveSitesStat,
  MonitorDashboardData,
  SiteWiseAnalysisData,
  DiseaseWiseAnalysisData,
  SampleWiseAnalysisData,
  FilterType,
} from "@/src/types/statistics";

export type AnalysisApiParams = FilterType & {
  workspaceId?: string;
  page?: number;
  limit?: number;
};

// Get site-wise samples statistics
export const getSiteWiseSamplesStatisticsApi = async (params: {
  disease: string;
  region: string;
  startDate: string;
  endDate: string;
}): Promise<ApiResponse<SiteWiseSampleStat[]>> => {
  try {
    const response = await apiClient.get(
      `/statistics/site-wise-samples-breakdown`,
      {
        params,
      },
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch site-wise sample statistics.");
  }
};

// Download csv for site-wise samples statistics
export const downloadCsvSiteWiseSamplesStatisticsApi = async (params: {
  disease: string;
  region: string;
  startDate: string;
  endDate: string;
}): Promise<Blob> => {
  try {
    const response = await apiClient.get(
      `/statistics/site-wise-samples-breakdown/download-csv`,
      {
        params,
        responseType: "blob",
      },
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to download csv for site-wise sample breakdown.");
  }
};

export type ExploreSitesPeriod = "overall" | "year" | "month";

export const getSiteStatByTestResultAndDiseaseApi = async (params: {
  regionId: string[];
  surveillanceType?: string;
  disease: string[];
  startDate: string;
  endDate: string;
  siteId?: string[];
  sampleTypeId?: string[];
  testResult?: string[];
  variant?: string[];
  projectId?: string;
  workspaceId?: string;
  period?: ExploreSitesPeriod;
  year?: string;
  month?: string;
}): Promise<ApiResponse<ExploreSite>> => {
  try {
    const response = await apiClient.get(`/statistics/explore-sites`, {
      params,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch sites stat by test-result and disease.");
  }
};

export const getSurveillanceTypesApi = async (): Promise<
  ApiResponse<SurveillanceType[]>
> => {
  try {
    const response = await apiClient.get(`/surveillance-type`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch surveillance-types.");
  }
};

export const getDiseaseWisePositiveSamplesStatApi = async (params: {
  startDate?: string;
  endDate?: string;
}): Promise<ApiResponse<{ diseaseStats: DiseaseWisePositiveSampleStat }>> => {
  try {
    const response = await apiClient.get(
      `/statistics/disease-wise-positive-samples`,
      {
        params,
      },
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch disease-wise sample stat.");
  }
};

export const getDiseaseWisePositiveSitesStatApi = async (params: {
  diseaseId?: string | string[];
  startDate?: string;
  endDate?: string;
}): Promise<ApiResponse<{ siteStats: DiseaseWisePositiveSitesStat[] }>> => {
  try {
    const response = await apiClient.get(`/statistics/most-positive-sites`, {
      params,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch disease-wise sample stat.");
  }
};

export const getMonitorDashboardStatsApi = async (params: {
  workspaceId?: string;
  projectId?: string;
  diseaseId?: string | string[];
  siteId?: string | string[];
  sampleTypeId?: string | string[];
  testResult?: string | string[];
  variant?: string | string[];
  startDate?: string;
  endDate?: string;
  stateId?: string | string[];
  districtId?: string | string[];
  subdistrictId?: string | string[];
}): Promise<ApiResponse<MonitorDashboardData>> => {
  try {
    const response = await apiClient.get(`/statistics/monitor-dashboard`, {
      params,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch monitor dashboard statistics.");
  }
};

export const getSiteWiseAnalysisApi = async (
  params: AnalysisApiParams,
): Promise<ApiResponse<SiteWiseAnalysisData[]>> => {
  try {
    const response = await apiClient.get(`/statistics/site-wise-analysis`, {
      params,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch site-wise analysis.");
  }
};

export const getDiseaseWiseAnalysisApi = async (
  params: AnalysisApiParams,
): Promise<ApiResponse<DiseaseWiseAnalysisData[]>> => {
  try {
    const response = await apiClient.get(`/statistics/disease-wise-analysis`, {
      params,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch disease-wise analysis.");
  }
};

export const getSampleWiseAnalysisApi = async (
  params: AnalysisApiParams,
): Promise<ApiResponse<SampleWiseAnalysisData[]>> => {
  try {
    const response = await apiClient.get(`/statistics/sample-wise-analysis`, {
      params,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch sample-wise analysis.");
  }
};

export const getProjectSampleTypesApi = async (): Promise<
  ApiResponse<{ id: string; name: string }[]>
> => {
  try {
    const response = await apiClient.get(`/statistics/project-sample-types`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch project sample types.");
  }
};
