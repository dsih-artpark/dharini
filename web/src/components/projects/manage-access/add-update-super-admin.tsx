"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import CustomModal from "@/src/components/ui/custom-modal";
import Spinner from "@/src/components/ui/spinner";
import { isValidEmail } from "@/src/utils";
import {
  createSuperAdminApi,
  updateSuperAdminApi,
} from "@/src/app/(dashboard)/manage/actions";
import type { User } from "@/src/types/global";
import { useUserLookup } from "@/src/hooks/use-user-lookup";
import UserLookupStatusBanner from "@/src/components/ui/user-lookup-status";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  contactNumber?: string;
}

type FormErrors = Partial<FormValues>;

export default function AddUpdateSuperAdmin({
  isOpen,
  onClose,
  defaultUserData,
  onCreate,
  onUpdate,
}: {
  isOpen: boolean;
  onClose: () => void;
  defaultUserData?: Partial<User>;
  onCreate: (userData: User) => void;
  onUpdate: (userData: User) => void;
}) {
  const [formData, setFormData] = useState<FormValues>({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: undefined,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(defaultUserData?.id);

  // Unlike the team forms, this one can only ever create a brand-new account:
  // the API rejects an email that already exists. Checking up front turns
  // that into immediate feedback on the identifier instead of an error after
  // the whole form has been filled in.
  const lookup = useUserLookup({
    email: formData.email,
    contactNumber: formData.contactNumber,
    enabled: isOpen && !isEditing,
  });

  const identifierTaken = lookup.status === "found";
  const showDetailFields =
    isEditing || (lookup.shouldCollectDetails && !identifierTaken);

  useEffect(() => {
    if (!isOpen) return;
    setFormData({
      firstName: defaultUserData?.firstName ?? "",
      lastName: defaultUserData?.lastName ?? "",
      email: defaultUserData?.email ?? "",
      contactNumber: defaultUserData?.contactNumber ?? undefined,
    });
    setErrors({});
  }, [defaultUserData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (showDetailFields) {
      if (!formData.firstName.trim())
        nextErrors.firstName = "First Name is required.";
      if (!formData.lastName.trim())
        nextErrors.lastName = "Last Name is required.";
    }
    if (!formData.email.trim()) nextErrors.email = "Email is required.";
    else if (!isValidEmail(formData.email))
      nextErrors.email = "Invalid email address.";

    if (
      formData.contactNumber?.trim() &&
      !/^\d{10}$/.test(formData.contactNumber)
    ) {
      nextErrors.contactNumber = "Enter a valid 10-digit Phone Number.";
    }

    // A match here is fatal, not informational - flag it on the field that
    // actually matched so the message points at the right input.
    if (identifierTaken) {
      if (lookup.match?.email &&
        lookup.match.email.toLowerCase() === formData.email.trim().toLowerCase()
      ) {
        nextErrors.email = "An account already uses this email.";
      } else {
        nextErrors.contactNumber =
          "An account already uses this phone number.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      if (defaultUserData?.id) {
        const { success, message, data } = await updateSuperAdminApi(
          defaultUserData.id,
          {
            firstName:
              formData.firstName !== defaultUserData.firstName
                ? formData.firstName
                : undefined,
            lastName:
              formData.lastName !== defaultUserData.lastName
                ? formData.lastName
                : undefined,
            email:
              formData.email !== defaultUserData.email
                ? formData.email
                : undefined,
            contactNumber:
              formData.contactNumber !== defaultUserData.contactNumber
                ? formData.contactNumber || null
                : undefined,
          },
        );

        if (!success) {
          toast.error(message || "Error updating super admin.");
          return;
        }

        onUpdate(data);
        toast.success("Super admin updated successfully!");
      } else {
        const { success, message, data } = await createSuperAdminApi(formData);
        if (!success) {
          toast.error(message || "Error creating super admin.");
          return;
        }

        onCreate(data);
        toast.success("Super admin added successfully!");
      }

      onClose();
    } catch (error) {
      toast.error((error as Error).message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomModal isOpen={isOpen}>
      <div className="w-full sm:w-[680px] py-6 bg-white rounded flex-col justify-start items-start gap-5 inline-flex overflow-hidden">
        <div className="self-stretch px-7 justify-start items-center gap-9 inline-flex">
          <div className="grow shrink basis-0 h-7 justify-start items-center gap-2 flex">
            <h3 className="grow shrink basis-0 text-grey-80 text-xl font-semibold font-noto-serif leading-relaxed">
              {defaultUserData ? "Update Super Admin" : "Add Super Admin"}
            </h3>
          </div>
          <div className="p-1 rounded-[999px] justify-center items-center gap-2 flex overflow-hidden">
            <div
              className="w-5 h-5 relative overflow-hidden cursor-pointer"
              onClick={onClose}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="21"
                viewBox="0 0 20 21"
                fill="none"
              >
                <path
                  d="M9.99999 9.32031L14.125 5.19531L15.3033 6.37365L11.1783 10.4986L15.3033 14.6236L14.125 15.802L9.99999 11.677L5.87499 15.802L4.69666 14.6236L8.82166 10.4986L4.69666 6.37365L5.87499 5.19531L9.99999 9.32031Z"
                  fill="#284DB6"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="self-stretch h-px border-t border-grey-20" />
        <div className="self-stretch px-6 flex-col justify-start items-start gap-6 flex">
          <div className="flex self-stretch gap-4 justify-start items-start flex-col sm:flex-row">
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
              <label className="text-grey-80 text-base leading-normal">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full h-10 rounded-lg border border-grey-40 px-3"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
              <label className="text-grey-80 text-base leading-normal">
                Phone Number
              </label>
              <input
                name="contactNumber"
                value={formData.contactNumber ?? ""}
                onChange={handleChange}
                className="w-full h-10 rounded-lg border border-grey-40 px-3"
              />
              {errors.contactNumber && (
                <p className="text-red-500 text-sm">{errors.contactNumber}</p>
              )}
            </div>
          </div>
          {!isEditing && (
            <UserLookupStatusBanner
              status={lookup.status}
              match={lookup.match}
              error={lookup.error}
              variant="conflict"
            />
          )}

          {showDetailFields && (
            <div className="flex self-stretch gap-4 justify-start items-start flex-col sm:flex-row">
              <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
                <label className="text-grey-80 text-base leading-normal">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full h-10 rounded-lg border border-grey-40 px-3"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">{errors.firstName}</p>
                )}
              </div>
              <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
                <label className="text-grey-80 text-base leading-normal">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full h-10 rounded-lg border border-grey-40 px-3"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName}</p>
                )}
              </div>
            </div>
          )}

          <div className="self-stretch flex justify-end gap-3">
            <button
              className="px-4 py-2 rounded-lg border border-blue-40 text-blue-40 text-sm disabled:opacity-50"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-blue-40 text-white text-sm disabled:opacity-50 flex items-center gap-2"
              onClick={handleSubmit}
              disabled={isSubmitting || lookup.isResolving || identifierTaken}
            >
              {isSubmitting && <Spinner />}
              {defaultUserData ? "Save Changes" : "Add Super Admin"}
            </button>
          </div>
        </div>
      </div>
    </CustomModal>
  );
}
