"use client";

import { useState } from "react";
import { AlertTriangle, Terminal } from "lucide-react";
import ManageSuperAdmins from "@/src/components/projects/manage-access/manage-super-admins";
import DataPurging from "@/src/components/settings/data-purging";
import ProjectDetailsPlayground from "@/src/components/settings/playground/project-details-playground";
import WorkspaceAdmin from "@/src/components/manage/workspace/workspace-admin";
import WorkspaceDeleteAccount from "@/src/components/manage/workspace/workspace-delete-account";
import {
  useIsSuperAdmin,
  useIsWorkspaceAdmin,
} from "@/src/hooks/check-permission";

type SettingsTab = "access" | "purge" | "playground" | "delete-account";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("access");
  const isSuperAdmin = useIsSuperAdmin();
  const isWorkspaceAdmin = useIsWorkspaceAdmin();

  // Workspace admins get the full workspace admin dashboard embedded here
  if (isWorkspaceAdmin && !isSuperAdmin) {
    return <WorkspaceAdmin />;
  }

  return (
    <div className="dashboard-page-shell flex flex-col gap-6 bg-subtle min-h-[calc(100vh-66px)]">
      {/* Top Banner */}
      <section className="rounded-3xl border border-grey-20 bg-white p-6 shadow-card sm:p-8">
        {activeTab === "access" && (
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold leading-tight text-grey-90">
              Settings
            </h1>
            <p className="text-sm leading-relaxed text-grey-500">
              Manage account-level configuration and super-admin access from one
              place.
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
                data.
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
                ready-to-run cURL command.
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
                Permanently delete any user&apos;s account across every
                workspace.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Tabs */}
      {isSuperAdmin && (
        <div className="flex flex-wrap gap-2">
          <button
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === "access"
                ? "bg-blue-40 text-white shadow-sm"
                : "text-grey-500 hover:bg-primary-50 hover:text-grey-800"
            }`}
            onClick={() => setActiveTab("access")}
          >
            Access Management
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
      )}

      {/* Main Panel Content */}
      <section className="w-full pb-20">
        {activeTab === "access" && <ManageSuperAdmins />}
        {activeTab === "purge" && <DataPurging />}
        {activeTab === "playground" && <ProjectDetailsPlayground />}
        {activeTab === "delete-account" && <WorkspaceDeleteAccount />}
      </section>
    </div>
  );
}
