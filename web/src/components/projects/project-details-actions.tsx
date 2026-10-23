"use client";
import { useAtom } from "jotai";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { useHasPermission } from "@/src/hooks/check-permission";
import EditProjectDetailsModal, {
  type EditProjectDetailsPayload,
} from "@/src/components/projects/edit-project-details";
import { projectAtom } from "@/src/store/projectAtom";
import { updateProjectDetailsApi } from "@/src/app/(dashboard)/projects/[id]/loader";

export default function ProjectDetailActions() {
  const { id } = useParams<{ id: string }>();
  const hasPermission = useHasPermission();
  const [project, setProject] = useAtom(projectAtom);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const allowCreateSite = hasPermission("create", "site", id);
  const allowUpdateProject = hasPermission("update", "project", id);
  // Matches the backend policy on the data-import routes.
  const allowUploadData = hasPermission("create", "data-import", id);

  const handleSaveProjectDetails = async (
    payload: EditProjectDetailsPayload,
  ) => {
    try {
      const response = await updateProjectDetailsApi(id, payload);
      setProject(response.data);
      setIsEditModalOpen(false);
      toast.success("Project details updated successfully!");
    } catch (error) {
      toast.error(
        (error as Error)?.message ||
          "Error updating project details. Please try again.",
      );
      throw error;
    }
  };

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-grey-20 bg-white px-6 py-6 shadow-card">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-grey-90">Quick Actions</h2>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {allowUpdateProject && (
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary-500 transition-colors hover:bg-primary-50"
            >
              Edit Project Details
            </button>
          )}
          <Link
            href={`/projects/${id}/manage-access`}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary-500 transition-colors hover:bg-primary-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M4.11398 12.0003C4.25172 11.61 4.50714 11.272 4.84505 11.0329C5.18296 10.7938 5.58671 10.6654 6.00065 10.6654C6.41459 10.6654 6.81834 10.7938 7.15625 11.0329C7.49416 11.272 7.74958 11.61 7.88732 12.0003H14.6673V13.3337H7.88732C7.74958 13.724 7.49416 14.062 7.15625 14.3011C6.81834 14.5402 6.41459 14.6686 6.00065 14.6686C5.58671 14.6686 5.18296 14.5402 4.84505 14.3011C4.50714 14.062 4.25172 13.724 4.11398 13.3337H1.33398V12.0003H4.11398ZM8.11398 7.33367C8.25172 6.94331 8.50714 6.60529 8.84505 6.36619C9.18296 6.12709 9.58671 5.9987 10.0007 5.9987C10.4146 5.9987 10.8183 6.12709 11.1563 6.36619C11.4942 6.60529 11.7496 6.94331 11.8873 7.33367H14.6673V8.667H11.8873C11.7496 9.05735 11.4942 9.39538 11.1563 9.63447C10.8183 9.87357 10.4146 10.002 10.0007 10.002C9.58671 10.002 9.18296 9.87357 8.84505 9.63447C8.50714 9.39538 8.25172 9.05735 8.11398 8.667H1.33398V7.33367H8.11398ZM4.11398 2.667C4.25172 2.27664 4.50714 1.93862 4.84505 1.69952C5.18296 1.46043 5.58671 1.33203 6.00065 1.33203C6.41459 1.33203 6.81834 1.46043 7.15625 1.69952C7.49416 1.93862 7.74958 2.27664 7.88732 2.667H14.6673V4.00033H7.88732C7.74958 4.39069 7.49416 4.72871 7.15625 4.96781C6.81834 5.2069 6.41459 5.3353 6.00065 5.3353C5.58671 5.3353 5.18296 5.2069 4.84505 4.96781C4.50714 4.72871 4.25172 4.39069 4.11398 4.00033H1.33398V2.667H4.11398ZM6.00065 4.00033C6.17746 4.00033 6.34703 3.93009 6.47206 3.80507C6.59708 3.68005 6.66732 3.51048 6.66732 3.33366C6.66732 3.15685 6.59708 2.98728 6.47206 2.86226C6.34703 2.73724 6.17746 2.667 6.00065 2.667C5.82384 2.667 5.65427 2.73724 5.52925 2.86226C5.40422 2.98728 5.33398 3.15685 5.33398 3.33366C5.33398 3.51048 5.40422 3.68005 5.52925 3.80507C5.65427 3.93009 5.82384 4.00033 6.00065 4.00033ZM10.0007 8.667C10.1775 8.667 10.347 8.59676 10.4721 8.47174C10.5971 8.34671 10.6673 8.17714 10.6673 8.00033C10.6673 7.82352 10.5971 7.65395 10.4721 7.52893C10.347 7.4039 10.1775 7.33367 10.0007 7.33367C9.82384 7.33367 9.65427 7.4039 9.52925 7.52893C9.40422 7.65395 9.33398 7.82352 9.33398 8.00033C9.33398 8.17714 9.40422 8.34671 9.52925 8.47174C9.65427 8.59676 9.82384 8.667 10.0007 8.667ZM6.00065 13.3337C6.17746 13.3337 6.34703 13.2634 6.47206 13.1384C6.59708 13.0134 6.66732 12.8438 6.66732 12.667C6.66732 12.4902 6.59708 12.3206 6.47206 12.1956C6.34703 12.0706 6.17746 12.0003 6.00065 12.0003C5.82384 12.0003 5.65427 12.0706 5.52925 12.1956C5.40422 12.3206 5.33398 12.4902 5.33398 12.667C5.33398 12.8438 5.40422 13.0134 5.52925 13.1384C5.65427 13.2634 5.82384 13.3337 6.00065 13.3337Z"
                fill="#284DB6"
              />
            </svg>
            Manage Access
          </Link>
          {allowUploadData && (
            <Link
              href={`/upload?projectId=${id}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary-500 transition-colors hover:bg-primary-50"
            >
              Upload Data
            </Link>
          )}
          {allowCreateSite && (
            <Link
              href={`/projects/${id}/create-site`}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-40 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M7.33398 7.33398V3.33398H8.66732V7.33398H12.6673V8.66732H8.66732V12.6673H7.33398V8.66732H3.33398V7.33398H7.33398Z"
                  fill="white"
                />
              </svg>
              Create Site
            </Link>
          )}
        </div>
      </div>
      <EditProjectDetailsModal
        isOpen={isEditModalOpen}
        project={project ?? null}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProjectDetails}
      />
    </section>
  );
}
