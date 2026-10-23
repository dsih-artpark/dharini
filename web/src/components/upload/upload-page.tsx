"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAtomValue } from "jotai";
import { FileUp } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { userAtom } from "@/src/store/userAtom";
import { currentWorkspaceAtom } from "@/src/store/currentWorkspaceAtom";
import { getWorkspaceProjects } from "@/src/app/(root)/workspaces/loader";
import { canInContext } from "@/src/lib/authorization/role-matching";
import UploadDataPanel from "@/src/components/project-onboarding/upload-data-panel";
import Select from "@/src/components/ui/select";
import Spinner from "@/src/components/ui/spinner";
import type { ProjectDetail } from "@/src/types/global";

const projectLabel = (project: ProjectDetail) =>
  `${project.name}${project.code ? ` (${project.code})` : ""}`;

// The selected project lives only in `?projectId=` - never in userAtom /
// projectAtom / localStorage - so this page can't shift the project context
// other pages (Lab, Monitor, ...) resolve from.
export default function UploadPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const user = useAtomValue(userAtom);
  const currentWorkspace = useAtomValue(currentWorkspaceAtom);

  const [workspaceProjects, setWorkspaceProjects] = useState<ProjectDetail[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const lastWorkspaceIdRef = useRef<string | undefined>(undefined);

  const requestedProjectId = searchParams.get("projectId") ?? "";

  const setProjectInUrl = (projectId: string) => {
    router.replace(
      projectId
        ? `${pathname}?projectId=${encodeURIComponent(projectId)}`
        : pathname,
    );
  };

  // Projects of the workspace the switcher points at. The backend already
  // restricts this list to what the caller can reach.
  useEffect(() => {
    const workspaceId = currentWorkspace?.id;
    if (!workspaceId) {
      setWorkspaceProjects([]);
      setHasLoaded(false);
      return;
    }

    // Switching workspace invalidates a project picked in the previous one;
    // drop it so the default selection below runs again instead of showing
    // a misleading "no access" notice.
    if (
      lastWorkspaceIdRef.current &&
      lastWorkspaceIdRef.current !== workspaceId
    ) {
      router.replace(pathname);
    }
    lastWorkspaceIdRef.current = workspaceId;

    let isCurrent = true;
    setIsLoading(true);
    setHasLoaded(false);
    getWorkspaceProjects(workspaceId)
      .then((projects) => {
        if (isCurrent) setWorkspaceProjects(projects);
      })
      .catch(() => {
        if (isCurrent) setWorkspaceProjects([]);
      })
      .finally(() => {
        if (!isCurrent) return;
        setIsLoading(false);
        setHasLoaded(true);
      });

    return () => {
      isCurrent = false;
    };
  }, [currentWorkspace?.id]);

  // Same check as the backend's @CheckPolicies on the data-import routes,
  // evaluated per project with an explicit id (there is no /projects/:id
  // route segment here for useHasPermission to infer one from).
  const uploadableProjects = useMemo(
    () =>
      workspaceProjects.filter((project) =>
        canInContext(user, "create", "data-import", {
          projectId: project.id,
          workspaceId: currentWorkspace?.id,
        }),
      ),
    [workspaceProjects, user, currentWorkspace?.id],
  );

  const options = useMemo(
    () =>
      uploadableProjects.map((project) => ({
        label: projectLabel(project),
        value: project.id,
      })),
    [uploadableProjects],
  );

  const isRequestedAllowed = uploadableProjects.some(
    (project) => project.id === requestedProjectId,
  );
  const selectedProjectId = isRequestedAllowed ? requestedProjectId : "";
  const isRequestDenied =
    hasLoaded && !!requestedProjectId && !isRequestedAllowed;

  // No project in the URL: preselect the user's own project when it's
  // uploadable here, otherwise the only option, otherwise make them choose.
  useEffect(() => {
    if (!hasLoaded || requestedProjectId) return;
    const primaryId = user?.project?.id;
    const fallbackId =
      primaryId && uploadableProjects.some((p) => p.id === primaryId)
        ? primaryId
        : uploadableProjects.length === 1
          ? uploadableProjects[0].id
          : "";
    if (fallbackId) setProjectInUrl(fallbackId);
  }, [hasLoaded, requestedProjectId, uploadableProjects, user?.project?.id]);

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = String(e.target.value ?? "");
    if (value && value !== selectedProjectId) setProjectInUrl(value);
  };

  const renderBody = () => {
    if (!user || isLoading || (currentWorkspace?.id && !hasLoaded)) {
      return (
        <div className="flex justify-center rounded-2xl border border-grey-20 bg-white p-10 shadow-card">
          <Spinner />
        </div>
      );
    }

    if (!currentWorkspace?.id) {
      return (
        <EmptyState
          title="No workspace selected"
          message="Select a workspace from the sidebar to upload data."
        />
      );
    }

    if (uploadableProjects.length === 0) {
      return (
        <EmptyState
          title="No projects available for upload"
          message="You don't have permission to import data into any project in this workspace. Contact your workspace admin if you need access."
        />
      );
    }

    return (
      <>
        <div className="flex flex-col gap-3 rounded-2xl border border-grey-20 bg-white p-5 shadow-card sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex flex-col gap-1">
            <p className="text-lg font-semibold text-grey-90">Project</p>
            <p className="text-sm leading-[21px] text-grey-70">
              Data is imported into the project you select here.
            </p>
          </div>
          <div className="w-full sm:w-[320px]">
            {uploadableProjects.length === 1 ? (
              <p className="text-base font-medium text-grey-90">
                {projectLabel(uploadableProjects[0])}
              </p>
            ) : (
              <Select
                name="uploadProjectPicker"
                className="w-full"
                defaultValue={selectedProjectId}
                options={options}
                placeholder="Select a project"
                onChange={handleProjectChange}
                isClearable={false}
                disabled={isUploading}
              />
            )}
          </div>
        </div>

        {isRequestDenied && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            You don&apos;t have upload access to the requested project. Select
            another project to continue.
          </div>
        )}

        <section className="flex flex-col gap-6 rounded-2xl border border-grey-20 bg-white py-6 shadow-card">
          <div className="flex flex-col gap-1 px-5 sm:px-6">
            <h1 className="text-2xl font-semibold leading-tight text-grey-90 sm:text-[32px]">
              Upload Data
            </h1>
            <p className="text-sm leading-[21px] text-grey-70">
              Download the template, fill it in, and upload it to import
              collection or lab data.
            </p>
          </div>
          {selectedProjectId ? (
            <UploadDataPanel
              key={selectedProjectId}
              projectId={selectedProjectId}
              onUploadingChange={setIsUploading}
            />
          ) : (
            <div className="px-5 sm:px-6">
              <div className="flex min-h-[240px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-grey-20 bg-grey-10 px-6 py-10 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-10">
                  <FileUp className="h-7 w-7 text-blue-40" aria-hidden="true" />
                </div>
                <div className="flex max-w-md flex-col gap-1">
                  <p className="text-lg font-semibold text-grey-90">
                    Ready to Import Data
                  </p>
                  <p className="text-sm leading-[21px] text-grey-70">
                    Select a project above to download templates and upload
                    collection or laboratory data.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      </>
    );
  };

  return (
    <div className="dashboard-page-shell flex flex-col gap-6 bg-subtle">
      {renderBody()}
    </div>
  );
}

function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-grey-20 bg-white p-6 shadow-card">
      <p className="text-lg font-semibold text-grey-90">{title}</p>
      <p className="text-sm leading-[21px] text-grey-70">{message}</p>
    </div>
  );
}
