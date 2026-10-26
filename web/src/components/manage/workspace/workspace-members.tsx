"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import Spinner from "@/src/components/ui/spinner";
import {
  getRolesApi,
  getWorkspaceMembersApi,
} from "@/src/app/(dashboard)/manage/workspace/loader";
import InviteWorkspaceMember from "@/src/components/manage/workspace/invite-workspace-member";
import EditWorkspaceMember from "@/src/components/manage/workspace/edit-workspace-member";
import RemoveWorkspaceMember from "@/src/components/manage/workspace/remove-workspace-member";
import type { Role, UserRole } from "@/src/types/user";

// 4.5: workspace member list + invite/edit/remove, mirrors the
// manage-super-admins.tsx pattern but scoped to a single workspace
// (GET/PATCH/DELETE /workspaces/:workspaceId/members, POST /invites/workspace).
export default function WorkspaceMembers({
  workspaceId,
}: {
  workspaceId: string;
}) {
  const [members, setMembers] = useState<UserRole[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<UserRole | null>(null);
  const [removingMember, setRemovingMember] = useState<UserRole | null>(null);

  const fetchMembers = useCallback(async () => {
    try {
      const { success, message, data } =
        await getWorkspaceMembersApi(workspaceId);
      if (!success) {
        toast.error(message || "Error fetching workspace members.");
        return;
      }
      setMembers(data);
    } catch (error) {
      toast.error(
        (error as Error).message || "Error fetching workspace members.",
      );
    }
  }, [workspaceId]);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      setIsLoading(true);
      try {
        const [membersRes, rolesRes] = await Promise.all([
          getWorkspaceMembersApi(workspaceId),
          getRolesApi(),
        ]);

        if (!isMounted) return;

        if (membersRes.success) {
          setMembers(membersRes.data);
        } else {
          toast.error(
            membersRes.message || "Error fetching workspace members.",
          );
        }

        if (rolesRes.success) {
          setRoles(rolesRes.data.filter((role) => role.scope === "workspace"));
        } else {
          toast.error(rolesRes.message || "Error fetching roles.");
        }
      } catch (error) {
        if (isMounted) {
          toast.error(
            (error as Error).message || "Error fetching workspace data.",
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [workspaceId]);

  const memberLabel = (member: UserRole) => {
    const name = [member.user?.firstName, member.user?.lastName]
      .filter(Boolean)
      .join(" ");
    return name || member.user?.email || "this member";
  };

  return (
    <section className="relative flex w-full flex-col items-start justify-start overflow-hidden rounded-2xl border border-grey-20 bg-white shadow-card">
      <div className="flex w-full items-center justify-between p-5 sm:p-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-grey-90">
            Workspace Members
          </h2>
          <p className="text-sm leading-[21px] text-grey-70">
            Invite people to this workspace and manage their access.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-40 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-60"
          onClick={() => setIsInviteOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Invite Member
        </button>
      </div>

      <div className="w-full border-t border-grey-20">
        <div className="grid grid-cols-[1.35fr_1fr_1fr_96px] gap-4 border-b border-grey-20 bg-grey-10 px-5 py-3 text-xs font-semibold uppercase text-grey-70 sm:px-6">
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span className="text-right">Actions</span>
        </div>

        {isLoading ? (
          <div className="flex w-full items-center justify-center p-10">
            <Spinner />
          </div>
        ) : members.length === 0 ? (
          <div className="p-6 text-sm text-grey-70">
            No members yet. Invite someone to get started.
          </div>
        ) : (
          members.map((member) => (
            <div
              key={member.id}
              className="grid grid-cols-[1.35fr_1fr_1fr_96px] items-center gap-4 border-b border-grey-20 px-5 py-3 text-sm text-grey-80 last:border-b-0 sm:px-6"
            >
              <span>
                {[member.user?.firstName, member.user?.lastName]
                  .filter(Boolean)
                  .join(" ") || "-"}
              </span>
              <span className="truncate">{member.user?.email ?? "-"}</span>
              <span>{member.role?.name ?? "-"}</span>
              <span className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  aria-label="Edit member role"
                  className="text-grey-70 transition hover:text-blue-40"
                  onClick={() => setEditingMember(member)}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Remove member"
                  className="text-grey-70 transition hover:text-red-30"
                  onClick={() => setRemovingMember(member)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </span>
            </div>
          ))
        )}
      </div>

      <InviteWorkspaceMember
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        workspaceId={workspaceId}
        roles={roles}
        onInvited={fetchMembers}
      />

      <EditWorkspaceMember
        isOpen={!!editingMember}
        onClose={() => setEditingMember(null)}
        workspaceId={workspaceId}
        member={editingMember}
        roles={roles}
        onUpdated={(updated) => {
          setMembers((prev) =>
            prev.map((m) => (m.id === updated.id ? updated : m)),
          );
        }}
      />

      {removingMember && (
        <RemoveWorkspaceMember
          isOpen={!!removingMember}
          onClose={() => setRemovingMember(null)}
          workspaceId={workspaceId}
          memberId={removingMember.id}
          memberLabel={memberLabel(removingMember)}
          onRemoved={() => {
            setMembers((prev) =>
              prev.filter((m) => m.id !== removingMember.id),
            );
          }}
        />
      )}
    </section>
  );
}
