"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

import CustomModal from "@/src/components/ui/custom-modal";
import Spinner from "@/src/components/ui/spinner";
import { removeWorkspaceMemberApi } from "@/src/app/(dashboard)/manage/workspace/actions";

// 4.5: remove-member confirmation modal, mirrors delete-super-admin.tsx.
export default function RemoveWorkspaceMember({
  isOpen,
  onClose,
  workspaceId,
  memberId,
  memberLabel,
  onRemoved,
}: {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  memberId: string;
  memberLabel: string;
  onRemoved: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const { success, message } = await removeWorkspaceMemberApi(
        workspaceId,
        memberId,
      );
      if (!success) {
        toast.error(message || "Error removing workspace member.");
        return;
      }

      onRemoved();
      toast.success("Workspace member removed successfully!");
      onClose();
    } catch (error) {
      toast.error(
        (error as Error).message || "Error removing workspace member.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomModal isOpen={isOpen}>
      <div className="w-[460px] p-6 bg-white rounded flex-col justify-start items-start gap-8 inline-flex">
        <div className="flex-col justify-start items-start gap-4 flex">
          <h2 className="text-lg font-semibold text-grey-90">
            Remove Workspace Member
          </h2>
          <p className="text-sm leading-[21px] text-grey-70">
            Are you sure you want to remove{" "}
            <span className="font-semibold text-grey-90">{memberLabel}</span>{" "}
            from this workspace? They will lose access to this workspace and its
            projects.
          </p>
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
            className="flex items-center gap-2 rounded-lg bg-red-30 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            onClick={handleSubmit}
          >
            {isSubmitting && <Spinner />}
            Remove
          </button>
        </div>
      </div>
    </CustomModal>
  );
}
