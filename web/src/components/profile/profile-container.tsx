"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAtom, useAtomValue } from "jotai";
import { toast } from "react-toastify";
import {
  Mail,
  Phone,
  Shield,
  Building2,
  Briefcase,
  Camera,
  Check,
  RotateCcw,
  Lock,
  FolderGit2,
  Users,
  MapPin,
  Activity,
  ArrowRight,
  Layers,
} from "lucide-react";

import { userAtom } from "@/src/store/userAtom";
import { currentWorkspaceAtom } from "@/src/store/currentWorkspaceAtom";
import { updateUser } from "@/src/app/(dashboard)/project-onboarding/actions";
import { uploadImagesApi } from "@/src/app/(dashboard)/home/loader";
import { getAllProjectsApi } from "@/src/app/(dashboard)/manage/loader";
import { UserProfile } from "@/src/types/user";
import { ProjectDetail } from "@/src/types/global";
import Spinner from "@/src/components/ui/spinner";
import {
  useIsSuperAdmin,
  useIsWorkspaceAdmin,
} from "@/src/hooks/check-permission";
import { rolesForProject } from "@/src/lib/authorization/role-matching";

export default function ProfileContainer() {
  const [user, setUser] = useAtom(userAtom);
  const currentWorkspace = useAtomValue(currentWorkspaceAtom);
  const isSuperAdmin = useIsSuperAdmin();
  const isWorkspaceAdmin = useIsWorkspaceAdmin();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    contactNumber: user?.contactNumber?.toString() ?? "",
  });

  const [profilePicture, setProfilePicture] = useState<{
    file: File;
    preview: string;
    fileUrl: string;
  }>();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [saving, setSaving] = useState(false);

  // Projects list for the assigned projects section
  const [workspaceProjects, setWorkspaceProjects] = useState<ProjectDetail[]>(
    [],
  );
  const [loadingProjects, setLoadingProjects] = useState(false);

  useEffect(() => {
    if (user?.id) {
      setFormData({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        email: user.email ?? "",
        contactNumber: user.contactNumber?.toString() ?? "",
      });
    }
  }, [user]);

  // Fetch projects belonging to the active workspace
  useEffect(() => {
    let isMounted = true;
    setLoadingProjects(true);

    getAllProjectsApi({
      limit: 100,
      workspaceId: currentWorkspace?.id,
    })
      .then((res) => {
        if (isMounted && res.success) {
          setWorkspaceProjects(res.data || []);
        }
      })
      .catch((err) => {
        console.error("Failed to load projects in profile:", err);
      })
      .finally(() => {
        if (isMounted) setLoadingProjects(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentWorkspace?.id]);

  const hasUnsavedChanges = useMemo(() => {
    if (!user) return false;
    const initialPhone = user.contactNumber?.toString() ?? "";
    const currentPhone = formData.contactNumber ?? "";
    const nameChanged =
      formData.firstName.trim() !== (user.firstName ?? "").trim() ||
      formData.lastName.trim() !== (user.lastName ?? "").trim();
    const phoneChanged = currentPhone.trim() !== initialPhone.trim();
    const photoChanged = Boolean(profilePicture);

    return nameChanged || phoneChanged || photoChanged;
  }, [formData, profilePicture, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const file = files[0];
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile picture must be under 5MB.");
      return;
    }

    try {
      setUploadingPhoto(true);
      const response = await uploadImagesApi({ files: [file] });
      if (response.success && response.data?.[0]?.uploaded) {
        setProfilePicture({
          file,
          preview: URL.createObjectURL(file),
          fileUrl: response.data[0].fileUrl,
        });
        toast.success("Photo uploaded. Click 'Save Changes' to apply.");
      } else {
        toast.error(response.message || "Failed to upload image.");
      }
    } catch (err) {
      toast.error((err as Error)?.message || "Failed to upload image.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleResetForm = () => {
    if (user) {
      setFormData({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        email: user.email ?? "",
        contactNumber: user.contactNumber?.toString() ?? "",
      });
      if (profilePicture?.preview) {
        URL.revokeObjectURL(profilePicture.preview);
      }
      setProfilePicture(undefined);
      setErrors({});
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required.";
    }
    const cleanPhone = formData.contactNumber.trim();
    if (!cleanPhone) {
      newErrors.contactNumber = "Phone number is required.";
    } else if (!/^\d{10}$/.test(cleanPhone)) {
      newErrors.contactNumber = "Please enter a valid 10-digit phone number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validate()) return;
    if (!user?.id) return;

    try {
      setSaving(true);
      const payload: UserProfile = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        contactNumber:
          formData.contactNumber.trim() ===
          (user.contactNumber?.toString() ?? "")
            ? undefined
            : formData.contactNumber.trim(),
      };

      if (profilePicture?.fileUrl) {
        payload.profilePicture = profilePicture.fileUrl;
      }

      const { success, data } = await updateUser(user.id, payload);

      if (profilePicture?.preview) {
        URL.revokeObjectURL(profilePicture.preview);
      }
      setProfilePicture(undefined);

      if (success) {
        setUser((prev) => (prev ? { ...prev, ...data } : null));
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      toast.error(
        (error as Error)?.message ||
          "Error updating profile. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  // Workspace-filtered roles
  const activeRoles = useMemo(() => {
    const roles = user?.roles ?? [];
    if (!roles.length) return [];
    if (isSuperAdmin) return roles;
    if (currentWorkspace?.id) {
      const filtered = roles.filter(
        (r) =>
          r.workspace?.id === currentWorkspace.id ||
          (!r.workspace && r.role?.scope === "system"),
      );
      return filtered.length ? filtered : roles;
    }
    return roles;
  }, [user?.roles, isSuperAdmin, currentWorkspace?.id]);

  const activeRoleNames = useMemo(() => {
    if (!activeRoles.length) {
      if (isSuperAdmin) return ["Super Admin"];
      if (isWorkspaceAdmin) return ["Workspace Admin"];
      return ["Member"];
    }
    return [
      ...new Set(
        activeRoles
          .map((r) => r.role?.name?.replace(/-/g, " "))
          .filter(Boolean),
      ),
    ];
  }, [activeRoles, isSuperAdmin, isWorkspaceAdmin]);

  // Combined assigned projects list
  const displayProjects = useMemo(() => {
    // If super admin or workspace admin, they have workspace-level access to all workspace projects
    if (isSuperAdmin || isWorkspaceAdmin) {
      return workspaceProjects;
    }

    // For regular users, prioritize user.projects or projects matching user's roles in this workspace
    const userDirectProjects = user?.projects ?? [];
    if (userDirectProjects.length > 0) {
      if (currentWorkspace?.id && workspaceProjects.length > 0) {
        const inWorkspace = userDirectProjects.filter((up) =>
          workspaceProjects.some((wp) => wp.id === up.id),
        );
        return inWorkspace.length > 0 ? inWorkspace : workspaceProjects;
      }
      return userDirectProjects;
    }

    return workspaceProjects;
  }, [
    isSuperAdmin,
    isWorkspaceAdmin,
    workspaceProjects,
    user?.projects,
    currentWorkspace?.id,
  ]);

  // Helper to resolve user's role label for a specific project
  const getProjectRoleLabel = (projectId: string) => {
    const matchingRoles = rolesForProject(user, projectId);
    if (matchingRoles.length > 0) {
      return matchingRoles
        .map((r) => r.role?.name?.replace(/-/g, " "))
        .filter(Boolean)
        .join(", ");
    }
    if (isSuperAdmin) return "Super Admin (Full Access)";
    if (isWorkspaceAdmin) return "Workspace Admin";
    return "Assigned Member";
  };

  const initials =
    `${user?.firstName?.charAt(0) ?? ""}${
      user?.lastName?.charAt(0) ?? ""
    }`.toUpperCase() || "U";

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      {/* Hero Header Card */}
      <section className="relative overflow-hidden rounded-3xl border border-grey-20 bg-white p-6 shadow-card sm:p-8">
        <div className="relative z-10 flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-between">
          {/* Avatar and Basic Details */}
          <div className="flex flex-col items-center gap-5 text-center md:flex-row md:text-left">
            <div className="group relative">
              {uploadingPhoto ? (
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-teal-10 shadow-md sm:h-32 sm:w-32">
                  <Spinner />
                </div>
              ) : profilePicture?.preview || user?.profilePicture ? (
                <Image
                  className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md sm:h-32 sm:w-32"
                  src={profilePicture?.preview || user?.profilePicture || ""}
                  width={128}
                  height={128}
                  alt="Profile Photo"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-blue-10 text-3xl font-bold tracking-tight text-blue-40 shadow-md sm:h-32 sm:w-32">
                  {initials}
                </div>
              )}

              {/* Camera Trigger */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                aria-label="Upload profile picture"
                className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-blue-40 text-white shadow transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-30 disabled:opacity-50"
              >
                <Camera className="h-5 w-5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={handlePhotoSelect}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                <h1 className="text-2xl font-bold text-grey-90 sm:text-3xl">
                  {user?.firstName} {user?.lastName}
                </h1>
                {isSuperAdmin && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-purple-10 px-3 py-0.5 text-xs font-semibold text-purple-40">
                    <Shield className="h-3.5 w-3.5" />
                    Super Admin
                  </span>
                )}
                {!isSuperAdmin && isWorkspaceAdmin && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-teal-10 px-3 py-0.5 text-xs font-semibold text-teal-40">
                    <Building2 className="h-3.5 w-3.5" />
                    Workspace Admin
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-grey-60 md:justify-start">
                {user?.email && (
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="h-4 w-4 text-grey-40" />
                    {user.email}
                  </span>
                )}
                {user?.contactNumber && (
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="h-4 w-4 text-grey-40" />
                    +91 {user.contactNumber}
                  </span>
                )}
              </div>

              {currentWorkspace && (
                <div className="mt-1 flex items-center justify-center gap-2 md:justify-start">
                  <span className="text-xs text-grey-50">
                    Active Workspace:
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-grey-20 bg-grey-10 px-2.5 py-1 text-xs font-medium text-grey-80">
                    <Building2 className="h-3.5 w-3.5 text-blue-40" />
                    {currentWorkspace.name}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick status / tags */}
          <div className="flex flex-col items-center gap-2 md:items-end">
            <div className="flex flex-wrap items-center gap-2">
              {activeRoleNames.map((roleName) => (
                <span
                  key={roleName}
                  className="rounded-full border border-blue-20 bg-blue-10 px-3 py-1 text-xs font-semibold capitalize text-blue-40"
                >
                  {roleName}
                </span>
              ))}
            </div>
            {hasUnsavedChanges && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                Unsaved changes
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Main Form & Access Details Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Columns: Editable Personal & Contact Details */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <form
            onSubmit={handleSave}
            className="flex flex-col gap-6 rounded-3xl border border-grey-20 bg-white p-6 shadow-card sm:p-8"
          >
            <div>
              <h2 className="text-lg font-semibold text-grey-90">
                Personal Information
              </h2>
              <p className="mt-1 text-sm text-grey-50">
                Update your name and primary phone number.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* First Name */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="firstName"
                  className="text-sm font-medium text-grey-80"
                >
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                  className="h-10 w-full rounded-lg border border-grey-40 px-3.5 text-sm text-grey-90 placeholder:text-grey-40 outline-none transition focus:border-blue-40 focus:ring-2 focus:ring-blue-10"
                />
                {errors.firstName && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="lastName"
                  className="text-sm font-medium text-grey-80"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                  className="h-10 w-full rounded-lg border border-grey-40 px-3.5 text-sm text-grey-90 placeholder:text-grey-40 outline-none transition focus:border-blue-40 focus:ring-2 focus:ring-blue-10"
                />
                {errors.lastName && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-grey-20 pt-6">
              <h2 className="text-lg font-semibold text-grey-90">
                Contact Information
              </h2>
              <p className="mt-1 text-sm text-grey-50">
                Manage your verified contact methods.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Email Address (Read-only) */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-grey-80"
                  >
                    Email Address
                  </label>
                  <span className="inline-flex items-center gap-1 text-xs text-grey-50">
                    <Lock className="h-3 w-3" /> Read only
                  </span>
                </div>
                <div className="relative flex h-10 w-full items-center rounded-lg border border-grey-20 bg-grey-10 px-3.5 text-sm text-grey-60">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full bg-transparent outline-none cursor-not-allowed text-grey-60"
                  />
                </div>
                <p className="text-xs text-grey-50">
                  Email is linked to your authentication login account.
                </p>
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="contactNumber"
                  className="text-sm font-medium text-grey-80"
                >
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="flex h-10 w-full items-center rounded-lg border border-grey-40 bg-white px-3.5 transition focus-within:border-blue-40 focus-within:ring-2 focus-within:ring-blue-10">
                  <span className="text-sm font-medium text-grey-60 mr-2">
                    +91
                  </span>
                  <input
                    id="contactNumber"
                    name="contactNumber"
                    type="tel"
                    maxLength={10}
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    placeholder="10-digit number"
                    className="w-full bg-transparent text-sm text-grey-90 placeholder:text-grey-40 outline-none"
                  />
                </div>
                {errors.contactNumber && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.contactNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="mt-4 flex flex-wrap items-center justify-end gap-3 border-t border-grey-20 pt-6">
              <button
                type="button"
                onClick={handleResetForm}
                disabled={!hasUnsavedChanges || saving}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-grey-30 bg-white px-4 text-sm font-medium text-grey-70 transition hover:bg-grey-10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RotateCcw className="h-4 w-4" />
                Cancel / Reset
              </button>

              <button
                type="submit"
                disabled={!hasUnsavedChanges || saving}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-40 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Spinner />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right 1 Column: Roles, Workspace & Organization Overview */}
        <div className="flex flex-col gap-6">
          {/* Workspace Membership Card */}
          <div className="flex flex-col gap-4 rounded-3xl border border-grey-20 bg-white p-6 shadow-card">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-10 text-blue-40">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-grey-90">
                  Workspace Membership
                </h3>
                <p className="text-xs text-grey-50">
                  Current workspace context
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-grey-20 bg-grey-10 p-4">
              <p className="text-xs uppercase tracking-wider text-grey-50 font-medium">
                Active Workspace
              </p>
              <p className="mt-1 text-sm font-semibold text-grey-90">
                {currentWorkspace?.name ?? "No Workspace Selected"}
              </p>
              {currentWorkspace?.id && (
                <p className="mt-0.5 text-xs text-grey-50 truncate">
                  ID: {currentWorkspace.id}
                </p>
              )}
            </div>

            {/* Team assignment if applicable */}
            {user?.team?.teamName && (
              <div className="rounded-xl border border-grey-20 bg-grey-10 p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-grey-60" />
                  <p className="text-xs uppercase tracking-wider text-grey-50 font-medium">
                    Assigned Team
                  </p>
                </div>
                <p className="mt-1 text-sm font-semibold text-grey-90">
                  {user.team.teamName}
                </p>
              </div>
            )}

            {/* Organization info if present */}
            {user?.organization?.organizationName && (
              <div className="rounded-xl border border-grey-20 bg-grey-10 p-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-grey-60" />
                  <p className="text-xs uppercase tracking-wider text-grey-50 font-medium">
                    Organization
                  </p>
                </div>
                <p className="mt-1 text-sm font-semibold text-grey-90">
                  {user.organization.organizationName}
                </p>
              </div>
            )}
          </div>

          {/* Assigned Roles Card */}
          <div className="flex flex-col gap-4 rounded-3xl border border-grey-20 bg-white p-6 shadow-card">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-10 text-purple-40">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-grey-90">
                  Roles & Privileges
                </h3>
                <p className="text-xs text-grey-50">
                  Granted system privileges
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              {activeRoles.length > 0 ? (
                activeRoles.map((roleItem, idx) => (
                  <div
                    key={roleItem.id || idx}
                    className="flex items-center justify-between rounded-xl border border-grey-20 bg-grey-10 p-3"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium capitalize text-grey-90">
                        {roleItem.role?.name?.replace(/-/g, " ") || "Role"}
                      </span>
                      <span className="text-xs text-grey-50">
                        Scope: {roleItem.role?.scope || "General"}
                      </span>
                    </div>
                    <span className="rounded-md border border-grey-20 bg-white px-2 py-0.5 text-xs font-medium uppercase text-grey-70">
                      {roleItem.role?.scope || "Active"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-grey-20 bg-grey-10 p-3 text-sm text-grey-60">
                  {isSuperAdmin
                    ? "System-wide Administrator"
                    : "Standard Member"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full-width Assigned Projects Section */}
      <section className="flex flex-col gap-6 rounded-3xl border border-grey-20 bg-white p-6 shadow-card sm:p-8">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-10 text-teal-40">
              <FolderGit2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-grey-90">
                  Assigned Projects
                </h2>
                <span className="rounded-full bg-grey-10 border border-grey-20 px-2.5 py-0.5 text-xs font-semibold text-grey-70">
                  {displayProjects.length}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-grey-50">
                Projects and operational assignments associated with your
                account in this workspace.
              </p>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {loadingProjects ? (
          <div className="flex h-44 w-full items-center justify-center rounded-2xl border border-dashed border-grey-30 bg-grey-10">
            <Spinner />
          </div>
        ) : displayProjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {displayProjects.map((project) => {
              const roleLabel = getProjectRoleLabel(project.id);
              const regionsList = (project.regions || [])
                .map((r) => r.name)
                .filter(Boolean);
              const diseasesList = (project.diseases || [])
                .map((d) => d.name)
                .filter(Boolean);

              return (
                <div
                  key={project.id}
                  className="group flex flex-col justify-between rounded-2xl border border-grey-20 bg-white p-5 shadow-sm transition-all hover:border-blue-30 hover:shadow-md"
                >
                  <div className="flex flex-col gap-3.5">
                    {/* Card Header: Title & Code */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col gap-1">
                        <h3 className="text-base font-bold text-grey-90 group-hover:text-blue-40 transition-colors line-clamp-1">
                          {project.name}
                        </h3>
                        {project.code && (
                          <span className="font-mono text-xs text-grey-50 font-medium">
                            {project.code}
                          </span>
                        )}
                      </div>
                      <span className="shrink-0 rounded-full border border-blue-20 bg-blue-10 px-2.5 py-0.5 text-xs font-semibold capitalize text-blue-40">
                        {roleLabel}
                      </span>
                    </div>

                    {/* Metadata Items */}
                    <div className="flex flex-col gap-2.5 border-t border-grey-20 pt-3 text-xs text-grey-60">
                      {/* Diseases */}
                      {diseasesList.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Activity className="h-3.5 w-3.5 shrink-0 text-grey-40" />
                          <div className="flex flex-wrap gap-1.5">
                            {diseasesList.slice(0, 3).map((diseaseName) => (
                              <span
                                key={diseaseName}
                                className="rounded-md bg-grey-10 border border-grey-20 px-2 py-0.5 font-medium text-grey-70"
                              >
                                {diseaseName}
                              </span>
                            ))}
                            {diseasesList.length > 3 && (
                              <span className="text-grey-50 font-medium">
                                +{diseasesList.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Regions */}
                      {regionsList.length > 0 && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-grey-40" />
                          <span className="truncate font-medium text-grey-70">
                            {regionsList.slice(0, 2).join(", ")}
                            {regionsList.length > 2 &&
                              ` +${regionsList.length - 2} more`}
                          </span>
                        </div>
                      )}

                      {/* Site count */}
                      {typeof project.totalSiteCount === "number" && (
                        <div className="flex items-center gap-2">
                          <Layers className="h-3.5 w-3.5 shrink-0 text-grey-40" />
                          <span className="font-medium text-grey-70">
                            {project.totalSiteCount}{" "}
                            {project.totalSiteCount === 1 ? "Site" : "Sites"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer: View Project Link */}
                  <div className="mt-4 border-t border-grey-20 pt-3">
                    <Link
                      href={`/projects/${project.id}`}
                      className="inline-flex w-full items-center justify-between rounded-lg bg-grey-10 px-3 py-2 text-xs font-semibold text-blue-40 transition hover:bg-blue-10 hover:text-blue-50"
                    >
                      <span>View Project Dashboard</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-grey-30 bg-grey-10/50 py-12 text-center">
            <FolderGit2 className="h-10 w-10 text-grey-40" />
            <h3 className="text-sm font-semibold text-grey-80">
              No Projects Assigned
            </h3>
            <p className="max-w-sm text-xs text-grey-50">
              You currently do not have any active project assignments in this
              workspace.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
