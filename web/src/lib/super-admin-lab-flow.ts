import { env } from "@/env";
import type { ProjectDetail } from "@/src/types/global";
import type { UserProfile } from "@/src/types/user";

const STORAGE_KEY = "super-admin-lab-project-id";

export const ALL_PROJECTS_ID = "all";

export const isAllProjectsId = (id?: string | null) => id === ALL_PROJECTS_ID;

export const isSuperAdminLabFlowEnabled = () =>
  env.SUPER_ADMIN_LAB_FLOW === "true";

export const isUserSuperAdmin = (user?: Pick<UserProfile, "roles"> | null) =>
  user?.roles?.some((role) => role.role?.name === "super-admin") || false;

export const getStoredSuperAdminProjectId = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_KEY);
};

export const storeSuperAdminProjectId = (projectId: string) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, projectId);
};

export const resolveSuperAdminProject = (
  projects: ProjectDetail[],
  preferredProjectId?: string | null,
  fallbackProjectId?: string | null,
) =>
  projects.find((project) => project.id === preferredProjectId) ||
  projects.find((project) => project.id === fallbackProjectId) ||
  projects[0] ||
  null;
