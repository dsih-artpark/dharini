"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

import CustomModal from "@/src/components/ui/custom-modal";
import Spinner from "@/src/components/ui/spinner";
import Select from "@/src/components/ui/select";
import { isValidEmail } from "@/src/utils";
import { sendWorkspaceInviteApi } from "@/src/app/(dashboard)/manage/workspace/actions";
import type { Role } from "@/src/types/user";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
}

type FormErrors = Partial<FormValues>;

// 4.5: invite modal - member list + invite requirement (calls 2.7's
// POST /invites/workspace).
export default function InviteWorkspaceMember({
  isOpen,
  onClose,
  workspaceId,
  roles,
  onInvited,
}: {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  roles: Role[];
  onInvited: () => void;
}) {
  const [formData, setFormData] = useState<FormValues>({
    firstName: "",
    lastName: "",
    email: "",
    roleId: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    setFormData({ firstName: "", lastName: "", email: "", roleId: "" });
    setErrors({});
    onClose();
  };

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};
    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!isValidEmail(formData.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!formData.roleId) {
      nextErrors.roleId = "Role is required.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      const { success, message } = await sendWorkspaceInviteApi({
        email: formData.email.trim(),
        workspaceId,
        roleId: formData.roleId,
        firstName: formData.firstName.trim() || undefined,
        lastName: formData.lastName.trim() || undefined,
      });
      if (!success) {
        toast.error(message || "Error sending invite.");
        return;
      }

      toast.success("Invite sent successfully!");
      onInvited();
      handleClose();
    } catch (error) {
      toast.error((error as Error).message || "Error sending invite.");
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
      <div className="w-[460px] p-6 bg-white rounded flex-col justify-start items-start gap-6 inline-flex">
        <h2 className="text-lg font-semibold text-grey-90">
          Invite Workspace Member
        </h2>

        <div className="flex w-full flex-col gap-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-grey-70">
                First name
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-grey-20 px-3 py-2 text-sm text-grey-80 focus:border-blue-40 focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-grey-70">
                Last name
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                }
                className="w-full rounded-lg border border-grey-20 px-3 py-2 text-sm text-grey-80 focus:border-blue-40 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-grey-70">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full rounded-lg border border-grey-20 px-3 py-2 text-sm text-grey-80 focus:border-blue-40 focus:outline-none"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-30">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-grey-70">
              Role *
            </label>
            <Select
              name="roleId"
              options={roleOptions}
              placeholder="Select a role"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  roleId: String(e.target.value),
                }))
              }
            />
            {errors.roleId && (
              <p className="mt-1 text-xs text-red-30">{errors.roleId}</p>
            )}
          </div>
        </div>

        <div className="flex w-full justify-end gap-2">
          <button
            type="button"
            disabled={isSubmitting}
            className="rounded-lg border border-grey-20 px-4 py-2 text-sm font-semibold text-grey-70 transition hover:bg-grey-10"
            onClick={handleClose}
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
            Send Invite
          </button>
        </div>
      </div>
    </CustomModal>
  );
}
