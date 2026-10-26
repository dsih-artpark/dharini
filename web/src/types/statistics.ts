import { Disease, Region } from "@/src/types/global";

export type DiseaseWisePositiveSampleStat = {
  [key: string]: {
    totalSamples: number;
    testedSamples: number;
  };
};

export type DiseaseWisePositiveSitesStat = {
  district: string;
  positiveCount: number;
  totalSiteCount: number;
};

export type DiseaseWiseSampleStat = {
  name: string;
  totalCollected: number;
  totalUnclear: number;
  totalPositive: number;
  totalNegative: number;
};

export type MonitorDashboardSummary = {
  totalSamples: number;
  processedSamples: number;
  positivityRate: number;
  positiveSamples?: number;
  negativeSamples?: number;
  positiveSites: number;
  inconclusiveSamples: number;
};

export type MonitorDashboardTrendPoint = {
  period: string;
  totalSamples: number;
  positiveSamples: number;
  negativeSamples: number;
  siteName?: string;
};

export type SampleTypeTrendPoint = {
  period: string;
  sampleTypeName: string;
  totalSamples: number;
};

export type MonitorDashboardDiseasePositive = {
  diseaseId: string;
  diseaseName: string;
  diseaseShortName: string;
  diseaseIndex: number;
  positiveSamples: number;
};

export type MonitorDashboardData = {
  summary: MonitorDashboardSummary;
  trend: MonitorDashboardTrendPoint[];
  siteTrend: MonitorDashboardTrendPoint[];
  sampleTypeTrend: SampleTypeTrendPoint[];
  diseasePositive: MonitorDashboardDiseasePositive[];
};

export type ProjectWithStat = {
  id: string;
  name: string;
  code: string;
  diseases: Disease[];
  regions: Region[];
  sitesCount: number;
  notVisitedSites: number;
  visitedSites: number;
  totalSiteCount: number;
  diseaseStatistics: {
    diseaseName: string;
    diseaseShortName: string;
    diseaseIndex: number;
    positiveSamples: number;
    totalSamples: number;
  }[];
};

export type SiteWiseAnalysisData = {
  siteId: string;
  siteName: string;
  siteType: string;
  farmType: string;
  state: string;
  district: string;
  block: string;
  village: string;
  address: string;
  totalSamples: number;
  positiveSamples: number;
  unclearSamples: number;
  negativeSamples: number;
  pendingSamples: number;
  positivityRate: number;
  avgCtValue: number | null;
  lastSampleDate: string | null;
};

export type DiseaseWiseAnalysisData = {
  diseaseId: string;
  diseaseName: string;
  totalSamples: number;
  positiveSamples: number;
  negativeSamples: number;
  positivityRate: number;
};

export type SampleWiseAnalysisData = {
  sampleId: string;
  barcode: string;
  siteName: string;
  diseaseName: string;
  round?: number | null;
  collectedAt: string;
  sampleType: string;
  status: string;
  result: string;
};

export type SiteDetailsData = {
  siteName: string;
  projectName: string;
  samplesCollected: number;
  diseases: string;
  status: string;
};

export type HomeLast30DaysData = {
  sites: { totalPresent: number; totalPositive: number };
  visits: { totalPresent: number; totalVisited: number };
  samples: { totalPresent: number; totalTested: number };
  diseaseStats: DiseaseWiseSampleStat[];
  siteDetails: SiteDetailsData[];
};

export type FilterType = {
  projectId?: string;
  stateId: string | string[];
  districtId: string | string[];
  diseaseId: string | string[];
  siteId: string | string[];
  sampleTypeId: string | string[];
  testResult: string | string[];
  variant?: string | string[];
  startDate: string;
  endDate: string;
};

export type ProjectComparisonProject = {
  id: string;
  name: string;
  code: string;
};

export type ProjectComparisonData = {
  summary: {
    totalSamples: number;
    positiveSamples: number;
    positivityRate: number;
    totalProjects: number;
    sampleTypeCount: number;
  };
  projects: ProjectComparisonProject[];
  sampleTypeAverages: {
    sampleTypeId: string;
    name: string;
    avgPositivity: number;
    positiveCount: number;
    totalCount: number;
  }[];
  perProjectTrend: { month: string; byProject: Record<string, number> }[];
  diseasesInScope: {
    id: string;
    name: string;
    shortName: string;
    index: number;
  }[];
  perProjectDiseaseTrend: {
    month: string;
    byProjectDisease: Record<string, number>;
  }[];
  perDiseaseTrend: {
    month: string;
    byDisease: Record<string, number>;
  }[];
  diseaseDistribution: {
    diseaseId: string;
    name: string;
    shortName: string;
    positiveCount: number;
    totalCount: number;
    percentage: number;
  }[];
  sampleTypeDistribution: {
    sampleTypeId: string;
    name: string;
    positiveCount: number;
    totalCount: number;
    percentage: number;
  }[];
  matrix: {
    sampleTypeId: string;
    name: string;
    byProject: Record<
      string,
      { rate: number; positiveCount: number; totalCount: number } | null
    >;
    overallAverage: number;
  }[];
};

export type ComparisonFilterType = {
  projectId: string[];
  stateId: string | string[];
  districtId: string | string[];
  diseaseId: string | string[];
  sampleTypeId: string | string[];
  startDate: string;
  endDate: string;
};

export type SiteComparisonSite = { id: string; name: string };

export type SiteComparisonData = {
  sites: SiteComparisonSite[];
  summary: Record<
    string,
    { totalSamples: number; positiveSamples: number; positivityRate: number }
  >;
  sampleTypesCompared: string[];
  trend: {
    month: string;
    bySite: Record<string, { rate: number; positiveCount: number }>;
  }[];
  sampleTypeMatrix: {
    sampleTypeId: string;
    name: string;
    bySite: Record<string, number | null>;
  }[];
};

export type SampleTypeComparisonEntity = { id: string; name: string };

export type SampleTypeComparisonData = {
  sampleTypes: SampleTypeComparisonEntity[];
  summary: Record<
    string,
    { totalSamples: number; positiveSamples: number; positivityRate: number }
  >;
  trend: {
    month: string;
    byType: Record<string, { rate: number; positiveCount: number }>;
  }[];
  byProject: {
    projectId: string;
    projectName: string;
    byType: Record<string, number | null>;
  }[];
  diseaseComparison: {
    diseaseId: string;
    name: string;
    shortName: string;
    byType: Record<string, { positiveCount: number; percentage: number }>;
  }[];
};
