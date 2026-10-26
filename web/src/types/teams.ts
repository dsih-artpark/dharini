import { User } from "./global";
import { Role } from "./user";

export type Team = {
  id: string;
  teamName: string;
  isProjectViewer: boolean;
  email: string;
  address: string;
  status: number;
  members: Partial<User>[];
};

export type TeamProgressStats = {
  totalPendingSampleCount: number;
  totalCompletedSampleCount: number;
};

export type TeamProgress = {
  id: string;
  name: string;
  pendingVisitCount: number;
  completedVisitCount: number;
  totalTeamMemberCount: number;
  photos: string[];
};

export type TeamMemberActivity = {
  id: string;
  firstName: string;
  lastName: string;
  totalCollected: number;
  totalReceived: number;
  totalExtracted: number;
  totalTested: number;
  totalTestReportGenerated: number;
};

export type TeamMemberProgress = {
  userId: string;
  firstName: string;
  lastName: string;
  siteId: string;
  siteName: string;
  pendingVisitCount: number;
  completedVisitCount: number;
  totalCollected: number;
  totalReceived: number;
  totalExtracted: number;
  totalTested: number;
  totalReportGenerated: number;
};

export type ProjectTeamUser = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  contactNumber?: string | null;
  role?: Pick<Role, "id" | "name" | "scope"> | null;
  team?: {
    id: string;
    teamName: string;
  } | null;
  project?: {
    id: string;
    name: string;
  } | null;
  projects?: {
    id: string;
    name: string;
  }[];
};

export type ProjectTeamUsersResponse = {
  users: ProjectTeamUser[];
  canEditRole: boolean;
};
