"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

import CustomModal from "@/src/components/ui/custom-modal";
import Spinner from "@/src/components/ui/spinner";
import Select from "@/src/components/ui/select";
import { updateWorkspaceMemberApi } from "@/src/app/(dashboard)/manage/workspace/actions";
import type { Role, UserRole } from "@/src/types/user";

// 4.5: edit modal - change an existing workspace member's role.
export default function EditWorkspaceMember({
  isOpen,
  onClose,
  workspaceId,
  member,
  roles,
  onUpdated,
}: {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  member: UserRole | null;
  roles: Role[];
  onUpdated: (member: UserRole) => void;
}) {
  const [roleId, setRoleId] = useState(member?.role?.id ?? "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    setRoleId(member?.role?.id ?? "");
    setError("");
  }, [member]);

  if (!member) return null;

  const handleSubmit = async () => {
    if (!roleId) {
      setError("Role is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const { success, message, data } = await updateWorkspaceMemberApi(
        workspaceId,
        member.id,
        { roleId },
      );
      if (!success) {
        toast.error(message || "Error updating member.");
        return;
      }

      toast.success("Workspace member updated successfully!");
      onUpdated(data);
      onClose();
    } catch (err) {
      toast.error((err as Error).message || "Error updating member.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleOptions = roles.map((role) => ({
    label: role.name,
    value: role.id,
  }));

  return (
    <CustomModal isOpen={isOpen}>
      <div className="w-[420px] p-6 bg-white rounded flex-col justify-start items-start gap-6 inline-flex">
        <h2 className="text-lg font-semibold text-grey-90">
          Edit Workspace Member
        </h2>

        <div className="w-full">
          <label className="mb-1 block text-xs font-medium text-grey-70">
            Role *
          </label>
          <Select
            name="roleId"
            options={roleOptions}
            defaultValue={roleId}
            placeholder="Select a role"
            onChange={(e) => {
              setRoleId(String(e.target.value));
              setError("");
            }}
          />
          {error && <p className="mt-1 text-xs text-red-30">{error}</p>}
        </div>

        <div className="flex w-full justify-end gap-2">
          <button
            type="button"
            disabled={isSubmitting}
            className="rounded-lg border border-grey-20 px-4 py-2 text-sm font-semibold text-grey-70 transition hover:bg-grey-10"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-lg bg-blue-40 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-60 disabled:opacity-50"
            onClick={handleSubmit}
          >
            {isSubmitting && <Spinner />}
            Save
          </button>
        </div>
      </div>
    </CustomModal>
  );
}
