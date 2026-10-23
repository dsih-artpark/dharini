"use client";

import { useState } from "react";
import { useAtomValue } from "jotai";
import { Plus, AlertTriangle, Terminal } from "lucide-react";

import { currentWorkspaceAtom } from "@/src/store/currentWorkspaceAtom";
import { useIsWorkspaceAdmin } from "@/src/hooks/check-permission";
import WorkspaceSettings from "@/src/components/manage/workspace/workspace-settings";
import WorkspaceMembers from "@/src/components/manage/workspace/workspace-members";
import WorkspaceDataPurging from "@/src/components/manage/workspace/workspace-data-purging";
import WorkspaceDataPlayground from "@/src/components/manage/workspace/workspace-data-playground";
import WorkspaceDeleteAccount from "@/src/components/manage/workspace/workspace-delete-account";
import CreateProject from "@/src/components/manage/create-project";

type WorkspaceAdminTab =
  | "settings"
  | "members"
  | "purge"
  | "playground"
  | "delete-account";

// 4.5: workspace admin screen with tabs for settings, members, data purging, and data playground
export default function WorkspaceAdmin() {
  const currentWorkspace = useAtomValue(currentWorkspaceAtom);
  const isWorkspaceAdmin = useIsWorkspaceAdmin();
  const [activeTab, setActiveTab] = useState<WorkspaceAdminTab>("settings");
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  if (!isWorkspaceAdmin || !currentWorkspace) {
    return (
      <div className="dashboard-page-shell flex flex-col gap-6 bg-subtle">
        <p className="text-sm text-grey-70">
          {currentWorkspace
            ? "You do not have access to manage this workspace."
            : "Select a workspace to manage."}
        </p>
      </div>
    );
  }

  return (
    <div className="dashboard-page-shell flex flex-col gap-6 bg-subtle">
      {/* Top Banner */}
      <section className="rounded-3xl border border-grey-20 bg-white p-6 shadow-card sm:p-8">
        {activeTab === "settings" && (
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold leading-tight text-grey-90">
              Workspace Settings
            </h1>
            <p className="text-sm leading-relaxed text-grey-500">
              Manage your workspace configuration and members.
            </p>
          </div>
        )}
        {activeTab === "members" && (
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold leading-tight text-grey-90">
              Workspace Members
            </h1>
            <p className="text-sm leading-relaxed text-grey-500">
              Manage team members and their access to this workspace.
            </p>
          </div>
        )}
        {activeTab === "purge" && (
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-red-20 bg-red-10 text-red-30">
              <AlertTriangle className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col gap-0.5">
              <h1 className="text-2xl font-semibold leading-tight text-grey-90">
                Data Purging{" "}
                <span className="text-xl font-normal text-grey-50">
                  (Danger Zone)
                </span>
              </h1>
              <p className="text-sm text-grey-400">
                Permanently delete projects, sites, visits, samples, and related
                data in this workspace.
              </p>
            </div>
          </div>
        )}
        {activeTab === "playground" && (
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-primary-100 bg-primary-50 text-primary-700">
              <Terminal className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col gap-0.5">
              <h1 className="text-2xl font-semibold leading-tight text-grey-90">
                Data Playground
              </h1>
              <p className="text-sm text-grey-400">
                Preview the unified project export data and generate a
                ready-to-run cURL command for your workspace projects.
              </p>
            </div>
          </div>
        )}
        {activeTab === "delete-account" && (
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-red-20 bg-red-10 text-red-30">
              <AlertTriangle className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col gap-0.5">
              <h1 className="text-2xl font-semibold leading-tight text-grey-90">
                Delete User{" "}
                <span className="text-xl font-normal text-grey-50">
                  (Danger Zone)
                </span>
              </h1>
              <p className="text-sm text-grey-400">
                Permanently delete a user&apos;s account and revoke all their
                access in this workspace.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
            activeTab === "settings"
              ? "bg-blue-40 text-white shadow-sm"
              : "text-grey-500 hover:bg-primary-50 hover:text-grey-800"
          }`}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </button>
        <button
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
            activeTab === "members"
              ? "bg-blue-40 text-white shadow-sm"
              : "text-grey-500 hover:bg-primary-50 hover:text-grey-800"
          }`}
          onClick={() => setActiveTab("members")}
        >
          Members
        </button>
        <button
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
            activeTab === "purge"
              ? "bg-danger-600 text-white shadow-sm"
              : "text-grey-500 hover:bg-danger-50 hover:text-grey-800"
          }`}
          onClick={() => setActiveTab("purge")}
        >
          Data Purging (Danger Zone)
        </button>
        <button
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
            activeTab === "playground"
              ? "bg-blue-40 text-white shadow-sm"
              : "text-grey-500 hover:bg-primary-50 hover:text-grey-800"
          }`}
          onClick={() => setActiveTab("playground")}
        >
          Data Playground
        </button>
        <button
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
            activeTab === "delete-account"
              ? "bg-danger-600 text-white shadow-sm"
              : "text-grey-500 hover:bg-danger-50 hover:text-grey-800"
          }`}
          onClick={() => setActiveTab("delete-account")}
        >
          Delete User (Danger Zone)
        </button>
      </div>

      {/* Main Content */}
      <section className="w-full pb-20">
        {activeTab === "settings" && (
          <div className="flex flex-col gap-6">
            <WorkspaceSettings />
            <button
              type="button"
              className="w-fit inline-flex items-center justify-center gap-2 rounded-lg bg-blue-40 px-4 py-2.5 text-sm font-medium leading-[21px] text-white transition-colors hover:bg-primary-700"
              onClick={() => setIsCreateProjectOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Create New Project
            </button>
          </div>
        )}
        {activeTab === "members" && (
          <WorkspaceMembers workspaceId={currentWorkspace.id} />
        )}
        {activeTab === "purge" && (
          <WorkspaceDataPurging workspaceId={currentWorkspace.id} />
        )}
        {activeTab === "playground" && (
          <WorkspaceDataPlayground workspaceId={currentWorkspace.id} />
        )}
        {activeTab === "delete-account" && (
          <WorkspaceDeleteAccount workspaceId={currentWorkspace.id} />
        )}
      </section>

      <CreateProject
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        workspaceId={currentWorkspace.id}
      />
    </div>
  );
}
