import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Project } from 'src/entities/project.entity';
import { DiseaseStatistics } from './base.response';

export class ProjectDiseaseStatsResponseData extends PickType(Project, [
  'id',
  'name',
] as const) {
  visitedSites?: number;
  notVisitedSites?: number;
  @Type(() => DiseaseStatistics)
  diseaseStatistics: DiseaseStatistics[];
  totalSiteCount?: number;
}

export class ProjectDiseaseStatsResponseType {
  docs: ProjectDiseaseStatsResponseData[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export class PaginatedProjectDiseaseStatsResponse {
  success: boolean;
  message: string;
  data: ProjectDiseaseStatsResponseData[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export class MonitorDashboardSummary {
  totalSamples: number;
  processedSamples: number;
  positivityRate: number;
  positiveSamples?: number;
  negativeSamples?: number;
  positiveSites: number;
  inconclusiveSamples: number;
}

export class MonitorDashboardTrendPoint {
  period: Date;
  totalSamples: number;
  positiveSamples: number;
  negativeSamples: number;
}

export class MonitorDashboardDiseasePositive {
  diseaseId: string;
  diseaseName: string;
  diseaseShortName: string;
  diseaseIndex: number;
  positiveSamples: number;
}

export class MonitorDashboardResponseData {
  @Type(() => MonitorDashboardSummary)
  summary: MonitorDashboardSummary;

  @Type(() => MonitorDashboardTrendPoint)
  trend: MonitorDashboardTrendPoint[];

  @Type(() => MonitorDashboardDiseasePositive)
  diseasePositive: MonitorDashboardDiseasePositive[];
}

export class MonitorDashboardResponse {
  success: boolean;
  message: string;
  @Type(() => MonitorDashboardResponseData)
  data: MonitorDashboardResponseData;
}
