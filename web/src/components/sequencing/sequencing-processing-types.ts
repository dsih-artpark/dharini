export type ProcessingStage = "uploaded" | "snp_analysis" | "report_ready";

export type SnpResults = {
  totalSnps: number;
  highImpact: number;
  moderateImpact: number;
  lowImpact: number;
  modifier: number;
};

export type SequencingProcessingJob = {
  id: string;
  sampleId: string;
  fileName: string;
  currentStage: ProcessingStage;
  progress: number;
  startTime: string;
  estimatedCompletion?: string;
  snpResults?: SnpResults;
};

export type SubmittedSequenceJob = {
  sampleId: string;
  fileNames: string[];
  fileFormat: string;
  sequencingMethod: string;
};

export type SequencingRecordStatus =
  "completed" | "in_progress" | "queued" | "failed";

export type SequencingRecord = {
  id: string;
  sampleId: string;
  siteName: string;
  pathogen: string;
  submissionDate: string;
  status: SequencingRecordStatus;
  fileFormat: string;
  libraryType: string;
  sequencingMethod: string;
  clade: string;
  lineage: string;
  mutations: string[];
  sequenceCoverage: number;
  readDepth: number;
  genBankId: string;
};
