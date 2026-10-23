import { Disease, Species, User } from "@/src/types/global";
import { LAB_TEST_RESULT } from "@/src/utils/constant";
import { Team } from "@/src/types/teams";
import { Site } from "@/src/types/site";

export type TestResultType = (typeof LAB_TEST_RESULT)[number];

export type PreprocessingStepType =
  "homogenisation" | "filtration" | "aliquoting" | "pooling";

export type PreprocessingStep = {
  type: PreprocessingStepType;
  method: string;
  customMethod?: string;
  inputVolume: string;
  inputVolumeUnit: string;
  outputVolume: string;
  outputVolumeUnit: string;
  timestamp: string;
  remarks?: string;
  pooledId?: string;
};

export type SampleStatusType =
  | "picked-up"
  | "received"
  | "pre-processed"
  | "virus-isolation"
  | "rejected"
  | "extracted"
  | "tested"
  | "test-report-generated";

export type Sample = {
  id: string;
  sampleCode: string;
  barcode: string;
  collectedAt: string;
  quantity: number;
  unit: string;
  rejectReason?: string;
  receivedAt?: string;
  receivedVolumeValue?: string;
  receivedVolumeUnit?: string;
  receivedStorageTemperature?: string;
  receivedLabStorageDetails?: string;
  referenceBatchId?: string;
  batchReferenceDocument?: string;
  accessionId?: string;
  extractionDateTime?: string;
  extractionSampleUsedValue?: string;
  extractionSampleUsedUnit?: string;
  extractionSampleRemainingValue?: string;
  extractionSampleRemainingUnit?: string;
  extractionComments?: string;
  // Pre-processing fields
  preprocessingSteps?: PreprocessingStep[];
  preprocessingDate?: string;
  preprocessingStorageTemperature?: string;
  preprocessingStorageDetails?: string;
  preprocessingPerformedBy?: User;
  pooledWith?: Sample[];
  pooledSampleIds?: string[];
  isPooledSample?: boolean;
  collectionTime: string;
  collectedBy: User;
  receivedBy?: User;
  extractedBy?: User;
  testedBy?: User;
  reportGeneratedBy?: User;
  rejectedAt: string;
  testedAt: string;
  reportGeneratedAt: string;
  updatedAt: string;
  photos: string[];
  comment: string;
  replicates: string;
  sampleStatus?: SampleStatusType;
  species?: Species;
  site: Partial<Site>;
  visit: {
    id: string;
    round?: number;
    visitedBy?: User;
    collector?: User;
  };
  project: {
    id: string;
    name: string;
  };
  sampleType: {
    id: string;
    name: string;
  };
  diseases: Disease[];
  labTests: LabTest[];
  hasAI?: boolean;
  team: Team;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any;
};

export type SampleType = {
  id: string;
  name: string;
  emojiIcon?: string | null;
  abbreviation?: string | null;
  diseaseShortNames?: string[] | null;
  surveillanceType?: {
    id: string;
    name: string;
  };
};

export type LabTest = {
  id: string;
  sample?: Sample;
  disease?: Disease | string;
  ctValue?: string;
  variant?: string;
  viralLoad?: string;
  kitOrProtocol?: string;
  labComment?: string;
  resultDate?: string;
  resultComment?: string;
  testResultReport?: string;
  testedBy: User;
  testedAt?: string;
  testResult?: TestResultType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any;
};

export type SampleStatistics = {
  totalPending: number;
  totalCollected: number;
  totalReceived: number;
  totalPreprocessed: number;
  totalRejected: number;
  totalExtracted: number;
  totalCompleted: number;
};

export type Kit = {
  id: string;
  name: string;
};

export type SubtypeKitDetail = {
  kitName?: string;
  targets?: {
    name: string;
    ctValue: string;
    result: string;
  }[];
};

export type LabSample = {
  labTestId: string; // sample.id
  barcode: string; // sample.barcode or sampleCode
  sampleCode: string | null; // sample.sampleCode
  siteName: string; // sample.site.name
  collectedAt: string; // sample.collectedAt or collectionTime
  diseaseName: string; // diseases[].name joined
  suggestedFileFormat: string; // "FASTQ"
  suggestedLibraryType: string; // "Paired End"
  suggestedMethod: string; // "WGS"
};

/**
 * ApiResponse - Standard API response wrapper
 */
export type ApiResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
  statusCode?: number;
  timestamp?: string;
  error?: string;
};
