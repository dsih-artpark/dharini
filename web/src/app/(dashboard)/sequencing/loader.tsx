import { AxiosError } from "axios";
import apiClient from "@/src/libs/apiClient";
import type { ApiResponse } from "@/src/types/global";
import type { Sample, LabSample } from "@/src/types/sample";
import type {
  ArtifactUrlResponse,
  JobProgress,
  PresignedUploadResponse,
  QueueStatus,
  SequencingArtifact,
  SequencingJob,
  SequencingPipeline,
  SequencingSubmission,
  SequencingVariant,
  SubmitSequencingJobPayload,
  SubmitSequencingJobResponse,
} from "./sequencing-processing-types";

export const getSequencingLabSamplesApi = async (
  projectId: string,
  params: { search?: string; page?: number; limit?: number } = {},
): Promise<ApiResponse<LabSample[]>> => {
  try {
    const response = await apiClient.get(`/projects/${projectId}/samples`, {
      params: {
        sampleStatus: "test-report-generated",
        limit: 100,
        sort: "collectedAt",
        sortOrder: "desc",
        ...params,
      },
    });

    const labSamples: LabSample[] = (response.data.data || []).map(
      (sample: Sample) => ({
        labTestId: sample.id,
        barcode: sample.barcode || sample.sampleCode || sample.id,
        sampleCode: sample.sampleCode || null,
        siteName: sample.site?.name || "Unknown site",
        collectedAt: sample.collectedAt || sample.collectionTime,
        diseaseName:
          sample.diseases?.map((d) => d.name).join(", ") || "Unknown",
        suggestedFileFormat: "FASTA",
        suggestedLibraryType: "Single End",
        suggestedMethod: "WGS",
      }),
    );

    return { ...response.data, data: labSamples };
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch sequencing lab samples.");
  }
};

export const getSequencingJobsApi = async (filters?: {
  submissionId?: string;
  status?: string;
  workspaceId?: string;
}): Promise<ApiResponse<SequencingJob[]>> => {
  try {
    const response = await apiClient.get("/sequencing/jobs", {
      params: filters || {},
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch sequencing jobs.");
  }
};

export const getSequencingSubmissionsApi = async (filters?: {
  status?: string;
  sourceType?: string;
  projectId?: string;
  workspaceId?: string;
}): Promise<ApiResponse<SequencingSubmission[]>> => {
  try {
    const response = await apiClient.get("/sequencing", {
      params: filters || {},
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch sequencing submissions.");
  }
};

// Presign a direct-to-S3 PUT. The returned key is what gets submitted to
// /sequencing/jobs/submit — the file itself never touches our backend.
export const presignSequencingUploadApi = async (
  filename: string,
  contentLength: number,
): Promise<ApiResponse<PresignedUploadResponse>> => {
  try {
    const response = await apiClient.post("/sequencing/uploads/presign", {
      filename,
      contentLength,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(`Failed to get an upload URL for ${filename}.`);
  }
};

export const getSequencingPipelinesApi = async (): Promise<
  ApiResponse<SequencingPipeline[]>
> => {
  try {
    const response = await apiClient.get("/sequencing/pipelines");
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch sequencing pipelines.");
  }
};

// Submit a job by reference — JSON body carrying the S3 key(s) collected from
// presigned uploads, not multipart file data.
export const submitSequencingJobApi = async (
  payload: SubmitSequencingJobPayload,
): Promise<ApiResponse<SubmitSequencingJobResponse>> => {
  try {
    const response = await apiClient.post("/sequencing/jobs/submit", payload);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to submit sequencing job.");
  }
};

export const getJobProgressApi = async (
  jobId: string,
): Promise<ApiResponse<JobProgress>> => {
  try {
    const response = await apiClient.get(`/sequencing/jobs/${jobId}/progress`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch job progress.");
  }
};

export const getSequencingQueueApi = async (): Promise<
  ApiResponse<QueueStatus>
> => {
  try {
    const response = await apiClient.get("/sequencing/queue");
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch queue status.");
  }
};

export const getJobVariantsApi = async (
  jobId: string,
): Promise<ApiResponse<SequencingVariant[]>> => {
  try {
    const response = await apiClient.get(`/sequencing/jobs/${jobId}/variants`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch variants.");
  }
};

export const getJobArtifactsApi = async (
  jobId: string,
): Promise<ApiResponse<SequencingArtifact[]>> => {
  try {
    const response = await apiClient.get(`/sequencing/jobs/${jobId}/artifacts`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch job artifacts.");
  }
};

// Mints a fresh presigned S3 GET for exactly one artifact — nothing is
// fetched until the caller actually wants to open or download it, since a
// URL minted up front expires (~1hr) before most artifacts are ever opened.
// inline=true renders in the browser (used for the visualization iframe /
// "open in new tab"); omitted, the link downloads.
export const getArtifactUrlApi = async (
  jobId: string,
  filename: string,
  inline?: boolean,
): Promise<ApiResponse<ArtifactUrlResponse>> => {
  try {
    const response = await apiClient.get(
      `/sequencing/jobs/${jobId}/artifacts/${encodeURIComponent(filename)}/url`,
      { params: inline ? { inline: true } : {} },
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(`Failed to get a link for ${filename}.`);
  }
};

// Only valid for a failed or cancelled run — the backend 400s with a
// human-readable message otherwise, surfaced as-is by the caller.
export const retrySequencingJobApi = async (
  jobId: string,
): Promise<ApiResponse<SubmitSequencingJobResponse>> => {
  try {
    const response = await apiClient.post(`/sequencing/jobs/${jobId}/retry`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to retry this run.");
  }
};

export const getNcbiPreviewApi = async (
  accession: string,
): Promise<
  ApiResponse<{
    accession: string;
    title: string;
    organism: string;
    length: number;
  }>
> => {
  try {
    const response = await apiClient.get("/sequencing/ncbi/preview", {
      params: { accession },
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch NCBI preview.");
  }
};
