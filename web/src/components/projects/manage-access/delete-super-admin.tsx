"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

import CustomModal from "@/src/components/ui/custom-modal";
import { deleteSuperAdminApi } from "@/src/app/(dashboard)/manage/actions";

export default function DeleteSuperAdmin({
  isOpen,
  onClose,
  userId,
  isSelf,
  onRemoved,
}: {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  isSelf: boolean;
  onRemoved: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const { success, message } = await deleteSuperAdminApi(userId);
      if (!success) {
        toast.error(message || "Error removing super admin.");
        return;
      }

      onRemoved();
      toast.success(
        isSelf
          ? "You have been removed from super admins."
          : "Super admin removed successfully!",
      );
      onClose();
    } catch (error) {
      toast.error((error as Error).message || "Error removing super admin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomModal isOpen={isOpen}>
      <div className="w-[460px] p-6 bg-white rounded flex-col justify-start items-start gap-8 inline-flex">
        <div className="flex-col justify-start items-start gap-4 flex">
          <div className="p-2 bg-red-10 rounded-[99px] justify-start items-center flex">
            <div className="w-6 h-6 relative overflow-hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M4 8H20V21C20 21.2652 19.8946 21.5196 19.7071 21.7071C19.5196 21.8946 19.2652 22 19 22H5C4.73478 22 4.48043 21.8946 4.29289 21.7071C4.10536 21.5196 4 21.2652 4 21V8ZM6 10V20H18V10H6ZM9 12H11V18H9V12ZM13 12H15V18H13V12ZM7 5V3C7 2.73478 7.10536 2.48043 7.29289 2.29289C7.48043 2.10536 7.73478 2 8 2H16C16.2652 2 16.5196 2.10536 16.7071 2.29289C16.8946 2.48043 17 2.73478 17 3V5H22V7H2V5H7ZM9 4V5H15V4H9Z"
                  fill="#A1221B"
                />
              </svg>
            </div>
          </div>
          <div className="self-stretch flex-col justify-start items-center gap-2 flex">
            <p className="self-stretch text-grey-80 text-xl font-semibold font-noto-serif leading-relaxed">
              Remove Super Admin?
            </p>
            <p className="self-stretch text-grey-70 text-base leading-normal">
              {isSelf
                ? "You are about to remove your own super admin access. This is only allowed when another super admin remains active."
                : "This will remove the selected user from active super admin access."}
            </p>
          </div>
        </div>
        <div className="self-stretch flex-col justify-start items-start gap-2 flex">
          <button
            className="self-stretch p-3 bg-white rounded-lg border border-blue-40 justify-center items-center gap-2 inline-flex overflow-hidden text-blue-40 text-base leading-normal disabled:opacity-50"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            className="self-stretch p-3 bg-red-30 rounded-lg justify-center items-center gap-2 inline-flex overflow-hidden text-white text-base leading-normal disabled:opacity-50"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            Remove
          </button>
        </div>
      </div>
    </CustomModal>
  );
}
