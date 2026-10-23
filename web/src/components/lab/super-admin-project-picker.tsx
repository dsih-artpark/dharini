"use client";

import { useEffect, useMemo, useState } from "react";
import { useAtom } from "jotai";
import { toast } from "react-toastify";

import { userAtom } from "@/src/store/userAtom";
import { labAllProjectsAtom } from "@/src/store/labAllProjectsAtom";
import { getAllProjectsApi } from "@/src/app/(dashboard)/manage/loader";
import { currentWorkspaceAtom } from "@/src/store/currentWorkspaceAtom";
import Select from "@/src/components/ui/select";
import type { ProjectDetail } from "@/src/types/global";
import {
  ALL_PROJECTS_ID,
  getStoredSuperAdminProjectId,
  isSuperAdminLabFlowEnabled,
  isUserSuperAdmin,
  resolveSuperAdminProject,
  storeSuperAdminProjectId,
} from "@/src/lib/super-admin-lab-flow";
import { useAtomValue } from "jotai";

export default function SuperAdminProjectPicker() {
  const [user, setUser] = useAtom(userAtom);
  const [isAll, setIsAll] = useAtom(labAllProjectsAtom);
  const [projects, setProjects] = useState<ProjectDetail[]>(
    user?.projects ?? [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const currentWorkspace = useAtomValue(currentWorkspaceAtom);

  const isSuperAdmin = isUserSuperAdmin(user);
  // Show the picker for super-admins (via feature flag) OR for any user
  // who belongs to more than one project.
  const isSuperAdminFlow = isSuperAdminLabFlowEnabled() && isSuperAdmin;

  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      try {
        const response = await getAllProjectsApi({
          page: 1,
          limit: 500,
          ...(currentWorkspace?.id ? { workspaceId: currentWorkspace.id } : {}),
        });
        if (!response.success) return;

        setProjects(response.data);

        if (isSuperAdmin) {
          const selectedProject = resolveSuperAdminProject(
            response.data,
            getStoredSuperAdminProjectId(),
            user?.project?.id,
          );
          setUser((previous) =>
            previous
              ? {
                  ...previous,
                  projects: response.data,
                  project: selectedProject ?? previous.project,
                }
              : previous,
          );
        } else {
          // B10: resync to a project that actually belongs to the *new*
          // workspace's list. Previously this only set a default when no
          // project was selected yet, and otherwise left `user.project`
          // untouched — so switching workspaces kept the Lab flow pinned to
          // a project from the old workspace.
          const projectStillInWorkspace = response.data.some(
            (project) => project.id === user?.project?.id,
          );
          setUser((previous) =>
            previous
              ? {
                  ...previous,
                  projects: response.data,
                  project: projectStillInWorkspace
                    ? previous.project
                    : response.data[0],
                }
              : previous,
          );
        }
      } catch (error) {
        toast.error((error as Error).message || "Failed to load projects");
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, [currentWorkspace?.id]);

  useEffect(() => {
    if (isSuperAdminFlow) {
      setIsAll(getStoredSuperAdminProjectId() === ALL_PROJECTS_ID);
    }
  }, [isSuperAdminFlow, setIsAll]);

  const options = useMemo(() => {
    const projectOptions = projects.map((project) => ({
      label: `${project.name}${project.code ? ` (${project.code})` : ""}`,
      value: project.id,
    }));
    if (isSuperAdminFlow) {
      return [
        { label: "All Projects", value: ALL_PROJECTS_ID },
        ...projectOptions,
      ];
    }
    return projectOptions;
  }, [projects, isSuperAdminFlow]);

  // Show only when user has more than 1 project, or is a super-admin
  if (projects.length <= 1 && !isSuperAdminFlow) return null;

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    if (isSuperAdminFlow && value === ALL_PROJECTS_ID) {
      storeSuperAdminProjectId(ALL_PROJECTS_ID);
      setIsAll(true);
      return;
    }

    const nextProject = projects.find((project) => project.id === value);
    if (!nextProject) return;

    if (isSuperAdminFlow) {
      storeSuperAdminProjectId(nextProject.id);
    }
    setIsAll(false);
    setUser((previous) =>
      previous
        ? {
            ...previous,
            projects,
            project: nextProject,
          }
        : previous,
    );
  };

  return (
    <div>
      <div className="flex flex-col gap-3 rounded-2xl border border-grey-20 bg-white p-5 shadow-card sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex flex-col gap-1">
          <p className="text-lg font-semibold text-grey-90">Lab Project</p>
          <p className="text-sm leading-[21px] text-grey-70">
            Choose the project context you want to use for the lab flow.
          </p>
        </div>
        <div className="w-full sm:w-[320px]">
          <Select
            name="labProjectPicker"
            className="w-full"
            defaultValue={
              isSuperAdminFlow && isAll ? ALL_PROJECTS_ID : user?.project?.id
            }
            options={options}
            placeholder={isLoading ? "Loading projects..." : "Select a project"}
            onChange={handleProjectChange}
            isClearable={false}
          />
        </div>
      </div>
    </div>
  );
}
