import { Project } from 'src/entities/project.entity';

export interface ProjectWithStats extends Project {
  visitedSites: number;
  notVisitedSites: number;
  diseaseStatistics: {
    diseaseShortName: string;
    totalSamples: number;
    positiveSamples: number;
  }[];
}
