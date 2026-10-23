"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { toast } from "react-toastify";
import { useAtomValue } from "jotai";

import {
  updateProjectTeamUserRoleApi,
  addTeamMemberApi,
} from "@/src/app/(dashboard)/manage/actions";
import {
  getProjectTeamUserRolesApi,
  getProjectTeamUsersApi,
  getAllProjectsApi,
  getTeamsByProjectIdApi,
} from "@/src/app/(dashboard)/manage/loader";
import CustomModal from "@/src/components/ui/custom-modal";
import Select from "@/src/components/ui/select";
import Spinner from "@/src/components/ui/spinner";
import { ProjectTeamUser } from "@/src/types/teams";
import { Role } from "@/src/types/user";
import type { ProjectDetail } from "@/src/types/global";
import type { Team } from "@/src/types/teams";
import { userAtom } from "@/src/store/userAtom";
import { currentWorkspaceAtom } from "@/src/store/currentWorkspaceAtom";
import {
  useIsSuperAdmin,
  useIsWorkspaceAdmin,
} from "@/src/hooks/check-permission";
import { isValidEmail } from "@/src/utils";
import { useUserLookup } from "@/src/hooks/use-user-lookup";
import UserLookupStatusBanner from "@/src/components/ui/user-lookup-status";

const roleLabels: Record<string, string> = {
  "project-viewer": "Team Admin",
  "team-admin": "Team Admin",
  "team-member": "Team Member",
  "lab-admin": "Lab Admin",
  "lab-member": "Lab Member",
  "collector-admin": "Collector Admin",
  collector: "Collector",
};

// Keyed by role, not by row position. Two reasons:
//  - "bg-violet-30" did not exist. `violet` is not in the palette (see
//    tailwind.config.ts) and Tailwind's own violet scale has no `30` step, so
//    the class compiled to nothing while `text-white` still applied - white
//    text on a white row. Every 5th row rendered a blank Role cell, which
//    read as "this user has no role" even though the role was there (which is
//    why Edit Role still opened with the correct one preselected).
//  - Rotating by index meant the same role got a different colour in every
//    row, so the colour carried no meaning.
const roleColors: Record<string, string> = {
  "project-viewer": "bg-blue-40 text-white",
  "team-admin": "bg-purple-30 text-white",
  "team-member": "bg-grey-60 text-white",
  "lab-admin": "bg-teal-30 text-white",
  "lab-member": "bg-green-30 text-white",
  "collector-admin": "bg-orange-30 text-white",
  collector: "bg-coral-30 text-white",
};

const FALLBACK_ROLE_COLOR = "bg-grey-60 text-white";

function formatRole(role?: string | null) {
  if (!role) return "-";
  return roleLabels[role] ?? role.replace(/-/g, " ");
}

const ALLOWED_ROLE_NAMES = [
  "team-admin",
  "collector-admin",
  "collector",
  "lab-admin",
  "lab-member",
];

// One project/team/role assignment. A person can hold several at once, and
// each is independently editable, so the row keeps the original flat record
// around to hand back to the edit modal.
type UserMembership = {
  key: string;
  role: ProjectTeamUser["role"];
  team: ProjectTeamUser["team"];
  projectName: string;
  source: ProjectTeamUser;
};

type GroupedTeamUser = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  contactNumber?: string | null;
  memberships: UserMembership[];
};

function initials(user: ProjectTeamUser) {
  const first = user.firstName?.charAt(0) ?? "";
  const last = user.lastName?.charAt(0) ?? "";
  return `${first}${last}`.toUpperCase() || "-";
}

export default function TeamUserManagementPage() {
  const [users, setUsers] = useState<ProjectTeamUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [canEditRole, setCanEditRole] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<ProjectTeamUser | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [projectSearch, setProjectSearch] = useState("");

  const user = useAtomValue(userAtom);
  const currentWorkspace = useAtomValue(currentWorkspaceAtom);
  const isSuperAdmin = useIsSuperAdmin();
  const isWorkspaceAdmin = useIsWorkspaceAdmin();

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [addUserForm, setAddUserForm] = useState({
    role: "",
    email: "",
    firstName: "",
    lastName: "",
    projectId: "",
    teamId: "",
    contactNumber: "",
  });
  const [addUserErrors, setAddUserErrors] = useState<Record<string, string>>(
    {},
  );
  const [projects, setProjects] = useState<ProjectDetail[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Identity-first: check the email/phone before asking for a name, so an
  // admin adding someone who already exists reuses that account instead of
  // re-typing (and previously overwriting) their name.
  const lookup = useUserLookup({
    email: addUserForm.email,
    contactNumber: addUserForm.contactNumber,
    enabled: showAddUserModal,
  });

  const showAddUserDetailFields = lookup.shouldCollectDetails;
  const matchedExistingUser =
    lookup.status === "found" && !lookup.matchedNameIsBlank;

  useEffect(() => {
    if (!matchedExistingUser || !lookup.match) return;
    setAddUserForm((prev) => ({
      ...prev,
      firstName: lookup.match?.firstName ?? "",
      lastName: lookup.match?.lastName ?? "",
    }));
    setAddUserErrors((prev) => ({ ...prev, firstName: "", lastName: "" }));
  }, [matchedExistingUser, lookup.match]);

  const filteredRoles = useMemo(
    () => roles.filter((role) => ALLOWED_ROLE_NAMES.includes(role.name)),
    [roles],
  );

  useEffect(() => {
    if (showAddUserModal) {
      if (isSuperAdmin) {
        getAllProjectsApi({
          page: 1,
          limit: 1000,
          ...(currentWorkspace?.id ? { workspaceId: currentWorkspace.id } : {}),
        })
          .then((res) => {
            if (res.success) setProjects(res.data);
          })
          .catch(() => {});
      } else if (isWorkspaceAdmin) {
        // Workspace admins are not direct project members (user.projects is
        // empty for them), but the backend GET /projects scopes the response
        // to the workspace(s) they administer. Pass the currently-selected
        // workspace so the list is further narrowed to just that workspace.
        getAllProjectsApi({
          page: 1,
          limit: 1000,
          ...(currentWorkspace?.id ? { workspaceId: currentWorkspace.id } : {}),
        })
          .then((res) => {
            if (res.success) setProjects(res.data);
          })
          .catch(() => {});
      } else if (user?.projects) {
        setProjects(user.projects);
      }
    }
  }, [
    showAddUserModal,
    isSuperAdmin,
    isWorkspaceAdmin,
    currentWorkspace?.id,
    user,
  ]);

  useEffect(() => {
    if (addUserForm.projectId) {
      getTeamsByProjectIdApi(addUserForm.projectId)
        .then((res) => {
          if (res.success) setTeams(res.data);
        })
        .catch(() => {});
      setAddUserForm((prev) => ({ ...prev, teamId: "" }));
    } else {
      setTeams([]);
    }
  }, [addUserForm.projectId]);

  const handleAddUserChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setAddUserForm((prev) => ({ ...prev, [name]: value }));
    if (addUserErrors[name]) {
      setAddUserErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const openAddUserModal = () => {
    setAddUserForm({
      role: "",
      email: "",
      firstName: "",
      lastName: "",
      projectId: "",
      teamId: "",
      contactNumber: "",
    });
    setAddUserErrors({});
    setTeams([]);
    setShowAddUserModal(true);
  };

  const closeAddUserModal = () => {
    if (isSubmitting) return;
    setShowAddUserModal(false);
  };

  const validateAddUserForm = () => {
    const errors: Record<string, string> = {};
    if (!addUserForm.role) errors.role = "Role is required.";
    if (!addUserForm.email.trim()) errors.email = "Email is required.";
    else if (!isValidEmail(addUserForm.email))
      errors.email = "Invalid email address.";
    // Only required when this form is creating the account; a matched user
    // brings their own name, which the server will not overwrite.
    if (showAddUserDetailFields) {
      if (!addUserForm.firstName.trim())
        errors.firstName = "First Name is required.";
      if (!addUserForm.lastName.trim())
        errors.lastName = "Last Name is required.";
    }
    if (!addUserForm.projectId) errors.projectId = "Project is required.";
    if (!addUserForm.teamId) errors.teamId = "Team is required.";
    if (
      addUserForm.contactNumber.trim() &&
      !/^\d{10}$/.test(addUserForm.contactNumber)
    )
      errors.contactNumber = "Enter a valid 10-digit Phone Number.";
    setAddUserErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddUserSubmit = async () => {
    if (!validateAddUserForm()) return;
    setIsSubmitting(true);
    try {
      const { success, message } = await addTeamMemberApi(
        addUserForm.projectId,
        addUserForm.teamId,
        {
          project: addUserForm.projectId,
          email: addUserForm.email,
          firstName: matchedExistingUser ? undefined : addUserForm.firstName,
          lastName: matchedExistingUser ? undefined : addUserForm.lastName,
          // The form collects this but never sent it, so a number typed here
          // was silently dropped.
          contactNumber: addUserForm.contactNumber.trim() || undefined,
          role: addUserForm.role,
        },
      );
      if (success) {
        toast.success("User added successfully!");
        setShowAddUserModal(false);
        fetchUsers();
      } else {
        toast.error(message || "Failed to add user.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add user.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = useMemo(() => {
    const query = projectSearch.trim().toLowerCase();
    const nextUsers = query
      ? users.filter((user) =>
          (user.project?.name ?? user.projects?.[0]?.name ?? "")
            .toLowerCase()
            .includes(query),
        )
      : users;

    return [...nextUsers].sort((a, b) =>
      `${a.firstName ?? ""} ${a.lastName ?? ""}`.localeCompare(
        `${b.firstName ?? ""} ${b.lastName ?? ""}`,
      ),
    );
  }, [projectSearch, users]);

  // The API returns one row per membership (a user_roles row), so someone in
  // two projects arrived as two rows with their name, email and phone
  // repeated. Collapse to one row per person and let the per-membership
  // columns stack instead - the identity is the thing that is actually
  // unique, and repeating it made the table read as if there were more
  // users than there are.
  //
  // Grouped after filtering, not before, so a project search still narrows
  // to the matching memberships rather than showing every membership of any
  // user who matched.
  const groupedUsers = useMemo(() => {
    const grouped = new Map<string, GroupedTeamUser>();

    filteredUsers.forEach((user) => {
      const projectId = user.project?.id ?? user.projects?.[0]?.id ?? "";
      const membership: UserMembership = {
        key: `${projectId}:${user.team?.id ?? "none"}`,
        role: user.role,
        team: user.team,
        projectName: user.project?.name ?? user.projects?.[0]?.name ?? "-",
        source: user,
      };

      const existing = grouped.get(user.id);
      if (existing) {
        existing.memberships.push(membership);
        // A membership may carry contact details the other one lacks.
        existing.email ??= user.email;
        existing.contactNumber ??= user.contactNumber;
        return;
      }

      grouped.set(user.id, {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        contactNumber: user.contactNumber,
        memberships: [membership],
      });
    });

    return Array.from(grouped.values());
  }, [filteredUsers]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const [usersResponse, rolesResponse] = await Promise.all([
        getProjectTeamUsersApi({
          // Scope to the currently selected workspace when one is active.
          // Super-admins see all workspaces by default; passing workspaceId
          // narrows their view to just that workspace's projects/users.
          ...(currentWorkspace?.id ? { workspaceId: currentWorkspace.id } : {}),
        }),
        getProjectTeamUserRolesApi(),
      ]);

      setUsers(usersResponse.data.users);
      setCanEditRole(usersResponse.data.canEditRole);
      setRoles(rolesResponse.data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load users.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentWorkspace?.id]);

  const openEditModal = (user: ProjectTeamUser) => {
    setEditingUser(user);
    setSelectedRoleId(user.role?.id ?? "");
  };

  const closeEditModal = () => {
    if (updatingKey) return;
    setEditingUser(null);
    setSelectedRoleId("");
  };

  const handleRoleSave = async () => {
    if (!editingUser?.project?.id || !editingUser.team?.id || !selectedRoleId) {
      return;
    }

    const key = `${editingUser.project.id}:${editingUser.team.id}:${editingUser.id}`;
    setUpdatingKey(key);
    try {
      await updateProjectTeamUserRoleApi(editingUser.id, {
        roleId: selectedRoleId,
        projectId: editingUser.project.id,
        teamId: editingUser.team.id,
      });

      const nextRole = roles.find((role) => role.id === selectedRoleId);
      setUsers((prev) =>
        prev.map((item) =>
          item.id === editingUser.id &&
          item.project?.id === editingUser.project?.id &&
          item.team?.id === editingUser.team?.id
            ? { ...item, role: nextRole ?? item.role }
            : item,
        ),
      );
      setEditingUser(null);
      setSelectedRoleId("");
      toast.success("User role updated successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update user role.",
      );
    } finally {
      setUpdatingKey(null);
    }
  };

  return (
    <div className="dashboard-page-shell bg-subtle">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-grey-90">
            Team &amp; User Management
          </h1>
          <p className="mt-2 text-sm text-grey-70">
            Manage users and field teams in one place.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddUserModal}
          className="h-11 shrink-0 rounded-lg bg-blue-40 px-5 text-sm font-semibold text-white transition hover:bg-blue-50"
        >
          Add User
        </button>
      </div>

      <div className="mb-6 flex flex-col gap-4 border-b border-grey-20 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex border-b-2 border-blue-40 px-4 pb-3 text-sm font-semibold text-blue-40">
          Users ({groupedUsers.length})
        </div>
        <div className="relative mb-3 w-full sm:max-w-[320px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-grey-60" />
          <input
            type="search"
            value={projectSearch}
            onChange={(event) => setProjectSearch(event.target.value)}
            placeholder="Search project"
            className="h-10 w-full rounded-lg border border-grey-20 bg-white pl-10 pr-3 text-sm text-grey-80 outline-none transition placeholder:text-grey-60 focus:border-blue-40"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-grey-20 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-grey-10 text-xs font-semibold uppercase text-grey-70">
              <tr>
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Phone</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Team</th>
                <th className="px-5 py-4">Project</th>
                {canEditRole && <th className="px-5 py-4">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-grey-20">
              {loading ? (
                <tr>
                  <td
                    className="px-5 py-8 text-center text-grey-60"
                    colSpan={canEditRole ? 7 : 6}
                  >
                    Loading users...
                  </td>
                </tr>
              ) : groupedUsers.length ? (
                groupedUsers.map((user) => {
                  // Every per-membership cell renders the same stack of
                  // fixed-height entries separated by the same divider, so
                  // the Nth line of Role, Team, Project and Action always
                  // belong to the same assignment.
                  const entry =
                    "flex min-h-[3.25rem] items-center px-5 py-2";

                  return (
                    <tr key={user.id} className="text-grey-80">
                      {/* Identity spans the whole row, so it is aligned to the
                          first assignment line rather than centred against a
                          stack whose height varies per person. */}
                      <td className="p-0 align-top">
                        <div className={`${entry} gap-3`}>
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-30 text-xs font-bold text-white">
                            {initials(user)}
                          </div>
                          <span className="font-semibold text-blue-40">
                            {user.firstName ?? "-"} {user.lastName ?? ""}
                          </span>
                        </div>
                      </td>
                      <td className="p-0 align-top">
                        <div className={entry}>{user.email ?? "-"}</div>
                      </td>
                      <td className="p-0 align-top">
                        <div className={entry}>{user.contactNumber ?? "-"}</div>
                      </td>

                      <td className="p-0 align-top">
                        <div className="divide-y divide-grey-10">
                          {user.memberships.map((membership) => (
                            <div key={membership.key} className={entry}>
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                                  membership.role?.name
                                    ? (roleColors[membership.role.name] ??
                                      FALLBACK_ROLE_COLOR)
                                    : FALLBACK_ROLE_COLOR
                                }`}
                              >
                                {formatRole(membership.role?.name)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="p-0 align-top">
                        <div className="divide-y divide-grey-10">
                          {user.memberships.map((membership) => (
                            <div key={membership.key} className={entry}>
                              {membership.team?.teamName ?? "-"}
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="p-0 align-top">
                        <div className="divide-y divide-grey-10">
                          {user.memberships.map((membership) => (
                            <div key={membership.key} className={entry}>
                              {membership.projectName}
                            </div>
                          ))}
                        </div>
                      </td>

                      {canEditRole && (
                        <td className="p-0 align-top">
                          <div className="divide-y divide-grey-10">
                            {user.memberships.map((membership) => (
                              <div key={membership.key} className={entry}>
                                <button
                                  type="button"
                                  className="text-sm font-semibold text-blue-40 transition hover:text-blue-50"
                                  onClick={() => openEditModal(membership.source)}
                                >
                                  Edit Role
                                </button>
                              </div>
                            ))}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    className="px-5 py-8 text-center text-grey-60"
                    colSpan={canEditRole ? 7 : 6}
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CustomModal isOpen={!!editingUser}>
        <div className="w-[calc(100vw-32px)] max-w-[630px] overflow-hidden rounded-xl bg-white shadow-2xl">
          <div className="flex items-start justify-between border-b border-grey-20 px-7 py-6">
            <div>
              <h2 className="text-xl font-semibold text-grey-90">Edit User</h2>
              <p className="mt-2 text-sm text-grey-70">
                {editingUser?.firstName ?? "-"} {editingUser?.lastName ?? ""} ·{" "}
                {editingUser?.email ?? "-"}
              </p>
            </div>
            <button
              type="button"
              aria-label="Close edit user modal"
              className="flex h-8 w-8 items-center justify-center rounded-md text-grey-60 transition hover:bg-grey-10 hover:text-grey-90"
              onClick={closeEditModal}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-7 py-6">
            <label
              htmlFor="team-user-role"
              className="mb-3 block text-xs font-bold uppercase tracking-[0.08em] text-grey-70"
            >
              Role
            </label>
            <select
              id="team-user-role"
              className="h-11 w-full rounded-lg border border-grey-20 bg-white px-4 text-sm font-medium capitalize text-grey-80 outline-none transition focus:border-blue-40"
              value={selectedRoleId}
              onChange={(event) => setSelectedRoleId(event.target.value)}
            >
              <option value="" disabled>
                Select role
              </option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {formatRole(role.name)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 border-t border-grey-20 bg-grey-10 px-7 py-4">
            <button
              type="button"
              className="h-11 rounded-lg border border-grey-20 bg-white px-6 text-sm font-semibold text-grey-90 transition hover:bg-grey-10"
              onClick={closeEditModal}
            >
              Cancel
            </button>
            <button
              type="button"
              className="h-11 rounded-lg bg-blue-40 px-6 text-sm font-semibold text-white transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!selectedRoleId || !!updatingKey}
              onClick={handleRoleSave}
            >
              {updatingKey ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </CustomModal>

      <CustomModal isOpen={showAddUserModal}>
        <div className="w-[calc(100vw-32px)] max-w-[680px] overflow-hidden rounded-xl bg-white shadow-2xl">
          <div className="flex items-start justify-between border-b border-grey-20 px-7 py-6">
            <h2 className="text-xl font-semibold text-grey-90">Add User</h2>
            <button
              type="button"
              aria-label="Close add user modal"
              className="flex h-8 w-8 items-center justify-center rounded-md text-grey-60 transition hover:bg-grey-10 hover:text-grey-90"
              onClick={closeAddUserModal}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-col gap-6 px-7 py-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-grey-70">
                  Role <span className="text-red-500">*</span>
                </label>
                <Select
                  name="role"
                  placeholder="Select role"
                  className="w-full"
                  options={filteredRoles.map((role) => ({
                    label: formatRole(role.name),
                    value: role.id,
                  }))}
                  defaultValue={addUserForm.role}
                  onChange={handleAddUserChange}
                />
                {addUserErrors.role && (
                  <p className="mt-1 text-sm text-red-500">
                    {addUserErrors.role}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-grey-70">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  value={addUserForm.email}
                  onChange={handleAddUserChange}
                  placeholder="Enter email"
                  className="h-11 w-full rounded-lg border border-grey-20 bg-white px-4 text-sm text-grey-80 outline-none transition placeholder:text-grey-60 focus:border-blue-40"
                />
                {addUserErrors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {addUserErrors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-grey-70">
                  Project <span className="text-red-500">*</span>
                </label>
                <Select
                  name="projectId"
                  placeholder="Select project"
                  className="w-full"
                  options={projects.map((p) => ({
                    label: p.name,
                    value: p.id,
                  }))}
                  defaultValue={addUserForm.projectId}
                  onChange={handleAddUserChange}
                />
                {addUserErrors.projectId && (
                  <p className="mt-1 text-sm text-red-500">
                    {addUserErrors.projectId}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-grey-70">
                  Team <span className="text-red-500">*</span>
                </label>
                <Select
                  name="teamId"
                  placeholder={
                    addUserForm.projectId
                      ? "Select team"
                      : "Select a project first"
                  }
                  className="w-full"
                  options={teams.map((t) => ({
                    label: t.teamName,
                    value: t.id,
                  }))}
                  defaultValue={addUserForm.teamId}
                  onChange={handleAddUserChange}
                />
                {addUserErrors.teamId && (
                  <p className="mt-1 text-sm text-red-500">
                    {addUserErrors.teamId}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-grey-70">
                  Phone Number <span className="text-grey-45">(optional)</span>
                </label>
                <div className="flex h-11 items-center gap-2 rounded-lg border border-grey-20 bg-white px-4">
                  <span className="text-sm text-grey-60">+91</span>
                  <input
                    name="contactNumber"
                    type="number"
                    value={addUserForm.contactNumber}
                    onChange={handleAddUserChange}
                    placeholder="Enter phone number"
                    className="h-full flex-1 text-sm text-grey-80 outline-none placeholder:text-grey-60"
                  />
                </div>
                {addUserErrors.contactNumber && (
                  <p className="mt-1 text-sm text-red-500">
                    {addUserErrors.contactNumber}
                  </p>
                )}
              </div>
              <div className="flex-1" />
            </div>

            <UserLookupStatusBanner
              status={lookup.status}
              match={lookup.match}
              error={lookup.error}
            />

            {/* An existing account's name is shown, not edited - it is that
                person's identity in every project they belong to. */}
            {matchedExistingUser && (
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-grey-70">
                    Name
                  </label>
                  <div className="flex h-11 w-full items-center rounded-lg border border-grey-20 bg-grey-10 px-4 text-sm text-grey-70">
                    {[lookup.match?.firstName, lookup.match?.lastName]
                      .filter(Boolean)
                      .join(" ")}
                  </div>
                  <p className="mt-1 text-xs text-grey-60">
                    Edit this from their profile — it applies everywhere they
                    appear.
                  </p>
                </div>
                <div className="flex-1" />
              </div>
            )}

            {showAddUserDetailFields && (
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-grey-70">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="firstName"
                    value={addUserForm.firstName}
                    onChange={handleAddUserChange}
                    placeholder="Enter first name"
                    className="h-11 w-full rounded-lg border border-grey-20 bg-white px-4 text-sm text-grey-80 outline-none transition placeholder:text-grey-60 focus:border-blue-40"
                  />
                  {addUserErrors.firstName && (
                    <p className="mt-1 text-sm text-red-500">
                      {addUserErrors.firstName}
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-grey-70">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="lastName"
                    value={addUserForm.lastName}
                    onChange={handleAddUserChange}
                    placeholder="Enter last name"
                    className="h-11 w-full rounded-lg border border-grey-20 bg-white px-4 text-sm text-grey-80 outline-none transition placeholder:text-grey-60 focus:border-blue-40"
                  />
                  {addUserErrors.lastName && (
                    <p className="mt-1 text-sm text-red-500">
                      {addUserErrors.lastName}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t border-grey-20 bg-grey-10 px-7 py-4">
            <button
              type="button"
              className="h-11 rounded-lg border border-grey-20 bg-white px-6 text-sm font-semibold text-grey-90 transition hover:bg-grey-10"
              onClick={closeAddUserModal}
            >
              Cancel
            </button>
            <button
              type="button"
              className="flex h-11 items-center gap-2 rounded-lg bg-blue-40 px-6 text-sm font-semibold text-white transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting || lookup.isResolving}
              onClick={handleAddUserSubmit}
            >
              {isSubmitting && <Spinner />}
              {isSubmitting ? "Adding..." : "Add User"}
            </button>
          </div>
        </div>
      </CustomModal>
    </div>
  );
}
