"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import { toast } from "react-toastify";
import { Pencil } from "lucide-react";

import { currentWorkspaceAtom } from "@/src/store/currentWorkspaceAtom";
import { updateWorkspaceApi } from "@/src/app/(dashboard)/manage/workspace/actions";

// 4.5: workspace settings card - lets a workspace-admin rename their
// workspace. Updates currentWorkspaceAtom on success so the 4.3 nav
// switcher/header reflect the new name immediately, without a reload.
export default function WorkspaceSettings() {
  const [currentWorkspace, setCurrentWorkspace] = useAtom(currentWorkspaceAtom);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentWorkspace?.name ?? "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!currentWorkspace) return null;

  const startEditing = () => {
    setName(currentWorkspace.name);
    setError("");
    setIsEditing(true);
  };

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Workspace name is required.");
      return;
    }

    if (trimmed.toLowerCase() === currentWorkspace.name.trim().toLowerCase()) {
      setIsEditing(false);
      return;
    }

    try {
      setIsSubmitting(true);
      const { success, message, data } = await updateWorkspaceApi(
        currentWorkspace.id,
        { name: trimmed },
      );
      if (!success) {
        const errorMsg = message || "Error updating workspace.";
        toast.error(errorMsg);
        setError(errorMsg);
        return;
      }

      setCurrentWorkspace(data);
      toast.success("Workspace updated successfully!");
      setIsEditing(false);
    } catch (err) {
      const errorMsg = (err as Error).message || "Something went wrong.";
      toast.error(errorMsg);
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative mb-6 flex w-full flex-col items-start justify-start overflow-hidden rounded-2xl border border-grey-20 bg-white shadow-card">
      <div className="flex w-full flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-grey-90">
            Workspace Settings
          </h1>
          <p className="max-w-3xl text-sm leading-[21px] text-grey-70">
            Manage your workspace&apos;s name.
          </p>
        </div>
        {!isEditing && (
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-grey-20 px-4 py-2 text-sm font-semibold text-blue-40 transition hover:bg-blue-10"
            onClick={startEditing}
          >
            <Pencil className="h-4 w-4" />
            Rename
          </button>
        )}
      </div>

      <div className="w-full border-t border-grey-20 p-5 sm:p-6">
        {!isEditing ? (
          <p className="text-sm leading-[21px] text-grey-80">
            {currentWorkspace.name}
          </p>
        ) : (
          <div className="flex flex-col gap-3 sm:max-w-md">
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
                if (e.key === "Escape") setIsEditing(false);
              }}
              className={`w-full rounded-lg border px-3 py-2 text-sm text-grey-80 focus:outline-none ${
                error
                  ? "border-red-30 focus:border-red-30"
                  : "border-grey-20 focus:border-blue-40"
              }`}
              placeholder="Workspace name"
            />
            {error && <p className="text-xs text-red-30">{error}</p>}
            <div className="flex gap-2">
              <button
                type="button"
                disabled={isSubmitting}
                className="rounded-lg bg-blue-40 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-60 disabled:opacity-50"
                onClick={handleSubmit}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                className="rounded-lg border border-grey-20 px-4 py-2 text-sm font-semibold text-grey-70 transition hover:bg-grey-10"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
