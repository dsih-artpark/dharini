import { AxiosError } from "axios";
import apiClient from "@/src/libs/apiClient";
import type {
  ApiResponse,
  ProjectDetail,
  PartnerOrganization,
  Disease,
  SurveillanceType,
  Region,
  ProjectInvite,
} from "@/src/types/global";
import { SampleType } from "@/src/types/sample";

export const getProjectDetail = async (
  projectId: string,
): Promise<ApiResponse<ProjectDetail>> => {
  try {
    const response = await apiClient.get(`/projects/${projectId}`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("An unknown error occurred while fetching project detail.");
  }
};

export const fetchOrganizations = async (): Promise<
  ApiResponse<PartnerOrganization[]>
> => {
  try {
    const response = await apiClient.get(`/organizations`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("An unknown error occurred while fetching project detail.");
  }
};

export const fetchDisease = async (): Promise<ApiResponse<Disease[]>> => {
  try {
    const response = await apiClient.get(`/disease`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("An unknown error occurred while fetching disease.");
  }
};

export const fetchSurveillanceTypes = async (): Promise<
  ApiResponse<SurveillanceType[]>
> => {
  try {
    const response = await apiClient.get(`/surveillance-type`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(
      "An unknown error occurred while fetching surveillance-types.",
    );
  }
};

export const fetchSampleTypes = async (): Promise<
  ApiResponse<SampleType[]>
> => {
  try {
    const response = await apiClient.get(`/sample-type`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("An unknown error occurred while fetching sample types.");
  }
};

export const fetchRegions = async (
  params: {
    type: string;
  } = { type: "district" },
): Promise<ApiResponse<Region[]>> => {
  try {
    const response = await apiClient.get(`/regions`, { params });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("An unknown error occurred while fetching regions.");
  }
};

export const fetchRegionsByRegionId = async (
  regionId: string,
): Promise<ApiResponse<{ subRegions: Region[] }>> => {
  try {
    const response = await apiClient.get(`/regions/${regionId}`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("An unknown error occurred while fetching regions.");
  }
};

export const fetchProjectRegions = async (): Promise<ApiResponse<Region[]>> => {
  try {
    const response = await apiClient.get(`/regions/project-location`, {});
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(
      "An unknown error occurred while fetching project regions.",
    );
  }
};

export const fetchProjectInvites = async (
  project: string,
): Promise<ApiResponse<ProjectInvite[]>> => {
  try {
    const response = await apiClient.get(`/invites`, {
      params: { project },
    });
    // remove 'project-admin' invites
    response.data.data = response.data.data
      .filter((d: ProjectInvite) => d.userType !== "project-admin")
      .filter((d: ProjectInvite) => d.organization);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(
      "An unknown error occurred while fetching project invites.",
    );
  }
};
