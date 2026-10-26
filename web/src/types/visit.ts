import { Disease, User } from "@/src/types/global";
import { Sample } from "@/src/types/sample";

export type Visit = {
  id: string;
  questionSetId: string;
  visitedAt: string;
  visitScheduledAt: string;
  visitStatus: "upcoming" | "overdue" | "completed" | "skipped";
  isCompleted: boolean;
  rescheduledFrom?: string;
  createdAt?: string;
  totalSamples: number;
  status: number;
  suspectedPositiveCount: number;
  diseases?: Disease[];
  suspectedPositives: {
    diseaseId: string;
    sampleCount: number;
    isSuspectedPositive: boolean;
    disease?: Disease;
  }[];
  samples?: Sample[];
  visitedBy: User[];
  photos: string[];
  comment: string;
  collector: User;
};
