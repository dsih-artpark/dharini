"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";

import { getProjectTeamUsersApi } from "@/src/app/(dashboard)/manage/loader";
import { deleteUserAccountApi } from "@/src/app/(dashboard)/manage/workspace/actions";
import CustomModal from "@/src/components/ui/custom-modal";
import Spinner from "@/src/components/ui/spinner";
import type { ProjectTeamUser } from "@/src/types/teams";

// Same one-row-per-person collapse as the Team & User Management page
// (src/app/(dashboard)/team/page.tsx) - the flat API returns one row per
// project/team membership, but account deletion acts on the whole person.
type GroupedUser = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  contactNumber?: string | null;
  memberships: string[];
};

function initials(user: GroupedUser) {
  const first = user.firstName?.charAt(0) ?? "";
  const last = user.lastName?.charAt(0) ?? "";
  return `${first}${last}`.toUpperCase() || "-";
}

interface WorkspaceDeleteAccountProps {
  // Omit for a super-admin view across every workspace they can reach -
  // getProjectTeamUsersApi already scopes to the caller's own reach when no
  // workspaceId is passed (same convention team/page.tsx relies on).
  workspaceId?: string;
}

export default function WorkspaceDeleteAccount({
  workspaceId,
}: WorkspaceDeleteAccountProps) {
  const [users, setUsers] = useState<ProjectTeamUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [target, setTarget] = useState<GroupedUser | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const { success, message, data } = await getProjectTeamUsersApi(
        workspaceId ? { workspaceId } : undefined,
      );
      if (!success) {
        toast.error(message || "Error fetching users.");
        return;
      }
      setUsers(data.users);
    } catch (error) {
      toast.error((error as Error).message || "Error fetching users.");
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const groupedUsers = useMemo(() => {
    const grouped = new Map<string, GroupedUser>();

    users.forEach((user) => {
      const projectName = user.project?.name ?? user.projects?.[0]?.name;
      const membership = [projectName, user.team?.teamName]
        .filter(Boolean)
        .join(" / ");

      const existing = grouped.get(user.id);
      if (existing) {
        if (membership) existing.memberships.push(membership);
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
        memberships: membership ? [membership] : [],
      });
    });

    const query = search.trim().toLowerCase();
    const all = Array.from(grouped.values());
    const filtered = query
      ? all.filter((user) =>
          [user.firstName, user.lastName, user.email]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(query),
        )
      : all;

    return filtered.sort((a, b) =>
      `${a.firstName ?? ""} ${a.lastName ?? ""}`.localeCompare(
        `${b.firstName ?? ""} ${b.lastName ?? ""}`,
      ),
    );
  }, [users, search]);

  const closeConfirm = () => {
    if (isDeleting) return;
    setTarget(null);
    setConfirmText("");
  };

  const handleDelete = async () => {
    if (!target) return;
    setIsDeleting(true);
    try {
      const { success, message } = await deleteUserAccountApi(target.id);
      if (!success) {
        toast.error(message || "Error deleting user account.");
        return;
      }
      toast.success("User account deleted successfully.");
      setTarget(null);
      setConfirmText("");
      fetchUsers();
    } catch (error) {
      toast.error((error as Error).message || "Error deleting user account.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="relative flex w-full flex-col items-start justify-start overflow-hidden rounded-2xl border border-grey-20 bg-white shadow-card">
      <div className="flex w-full flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-grey-90">
            Delete User Account
          </h2>
          <p className="text-sm leading-[21px] text-grey-70">
            Permanently delete a user&apos;s account and revoke all their
            access in this workspace. This cannot be undone.
          </p>
        </div>
        <div className="relative w-full sm:max-w-[280px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-grey-60" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name or email"
            className="h-10 w-full rounded-lg border border-grey-20 bg-white pl-10 pr-3 text-sm text-grey-80 outline-none transition placeholder:text-grey-60 focus:border-blue-40"
          />
        </div>
      </div>

      <div className="w-full border-t border-grey-20">
        <div className="grid grid-cols-[1.2fr_1.2fr_1fr_1.4fr_120px] gap-4 border-b border-grey-20 bg-grey-10 px-5 py-3 text-xs font-semibold uppercase text-grey-70 sm:px-6">
          <span>Name</span>
          <span>Email</span>
          <span>Phone</span>
          <span>Project / Team</span>
          <span className="text-right">Action</span>
        </div>

        {isLoading ? (
          <div className="flex w-full items-center justify-center p-10">
            <Spinner />
          </div>
        ) : groupedUsers.length === 0 ? (
          <div className="p-6 text-sm text-grey-70">No users found.</div>
        ) : (
          groupedUsers.map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-[1.2fr_1.2fr_1fr_1.4fr_120px] items-center gap-4 border-b border-grey-20 px-5 py-3 text-sm text-grey-80 last:border-b-0 sm:px-6"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-30 text-xs font-bold text-white">
                  {initials(user)}
                </span>
                {user.firstName ?? "-"} {user.lastName ?? ""}
              </span>
              <span className="truncate">{user.email ?? "-"}</span>
              <span>{user.contactNumber ?? "-"}</span>
              <span className="truncate text-grey-70">
                {user.memberships.join(", ") || "-"}
              </span>
              <span className="flex justify-end">
                <button
                  type="button"
                  className="rounded-lg border border-red-20 px-3 py-1.5 text-xs font-semibold text-red-30 transition hover:bg-red-10"
                  onClick={() => {
                    setTarget(user);
                    setConfirmText("");
                  }}
                >
                  Delete Account
                </button>
              </span>
            </div>
          ))
        )}
      </div>

      <CustomModal isOpen={!!target}>
        <div className="w-[calc(100vw-32px)] max-w-[480px] rounded-xl bg-white p-6 shadow-2xl">
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3 rounded-lg border border-red-20 bg-red-10 p-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-30" />
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-red-30">
                  Delete{" "}
                  {[target?.firstName, target?.lastName]
                    .filter(Boolean)
                    .join(" ") || "this user"}
                  &apos;s account?
                </p>
                <p className="text-sm text-grey-70">
                  This permanently revokes their login and removes their
                  contact details. This action is irreversible.
                </p>
              </div>
            </div>

            {target?.email && (
              <div>
                <label className="mb-2 block text-sm font-medium text-grey-80">
                  Type &ldquo;{target.email}&rdquo; to confirm deletion
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(event) => setConfirmText(event.target.value)}
                  placeholder={target.email}
                  className="w-full rounded-lg border border-grey-20 px-3 py-2 text-sm outline-none focus:border-blue-40"
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                disabled={isDeleting}
                className="rounded-lg border border-grey-20 px-4 py-2 text-sm font-semibold text-grey-70 transition hover:bg-grey-10"
                onClick={closeConfirm}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={
                  isDeleting || !target?.email || confirmText !== target.email
                }
                className="flex items-center gap-2 rounded-lg bg-danger-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-danger-700 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={handleDelete}
              >
                {isDeleting && <Spinner />}
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </CustomModal>
    </section>
  );
}
