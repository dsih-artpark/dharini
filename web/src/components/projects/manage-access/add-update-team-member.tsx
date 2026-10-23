import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";

import CustomModal from "@/src/components/ui/custom-modal";
import { getAvailableRolesApi } from "@/src/app/(dashboard)/manage/loader";
import {
  addTeamMemberApi,
  updateTeamMemberApi,
} from "@/src/app/(dashboard)/manage/actions";
import { Role } from "@/src/types/user";
import { User } from "@/src/types/global";
import Select from "@/src/components/ui/select";
import { isValidEmail } from "@/src/utils";
import Spinner from "@/src/components/ui/spinner";
import { useUserLookup } from "@/src/hooks/use-user-lookup";
import UserLookupStatusBanner from "@/src/components/ui/user-lookup-status";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  contactNumber?: string;
}
type FormErrors = Partial<FormValues>;

export default function AddUpdateTeamMember({
  isOpen,
  onClose,
  teamId,
  onAddMember,
  onUpdateMember,
  defaultMemberData,
}: {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  defaultMemberData?: Partial<User>;
  onAddMember: (memberData: Partial<User>) => void;
  onUpdateMember: (memberData: Partial<User>) => void;
}) {
  const { id } = useParams<{ id: string }>();

  const [roles, setRoles] = useState<Role[]>([]);
  const [formData, setFormData] = useState<FormValues>({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    contactNumber: undefined,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Editing an existing member already knows who it is - the identity check
  // is only for deciding whether an *added* member is a new person.
  const isEditing = Boolean(defaultMemberData?.id);

  const lookup = useUserLookup({
    email: formData.email,
    contactNumber: formData.contactNumber,
    enabled: isOpen && !isEditing,
  });

  // Show the name fields once we know the identity is free (or the account is
  // a nameless stub). When a real account matches, its name is displayed
  // read-only instead - re-typing it here used to rename that person in every
  // project they belong to.
  const showDetailFields = isEditing || lookup.shouldCollectDetails;
  const matchedExistingUser =
    lookup.status === "found" && !lookup.matchedNameIsBlank;

  // Mirror the matched account's name into the form so the read-only display
  // and the submitted payload agree. The server ignores these for an existing
  // user, but sending a stale value would still be misleading.
  useEffect(() => {
    if (!matchedExistingUser || !lookup.match) return;
    setFormData((prev) => ({
      ...prev,
      firstName: lookup.match?.firstName ?? "",
      lastName: lookup.match?.lastName ?? "",
    }));
    setErrors((prev) => ({ ...prev, firstName: "", lastName: "" }));
  }, [matchedExistingUser, lookup.match]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getAvailableRolesApi(id);
        if (response.success) {
          setRoles(response.data);
        }
      } catch (e) {
        toast.error((e as Error)?.message ?? "Error fetching data");
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        firstName: defaultMemberData?.firstName ?? "",
        lastName: defaultMemberData?.lastName ?? "",
        email: defaultMemberData?.email ?? "",
        role:
          (defaultMemberData?.roles && defaultMemberData?.roles[0].role?.id) ??
          "",
        contactNumber: defaultMemberData?.contactNumber,
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: typeof errors = {
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      contactNumber: "",
    };

    // Only demand a name when this form is the one supplying it. For a
    // matched account the name comes from the existing user record, and the
    // server will not overwrite it regardless of what is sent.
    if (showDetailFields) {
      if (!formData.firstName.trim())
        newErrors.firstName = "First Name is required.";
      if (!formData.lastName.trim())
        newErrors.lastName = "Last Name is required.";
    }
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!isValidEmail(formData.email))
      newErrors.email = "Invalid email address.";
    if (!formData.role.trim()) newErrors.role = "Role is required.";
    // if (!formData.contactNumber.trim())
    //   newErrors.contactNumber = "Contact Number is required.";
    if (
      formData.contactNumber?.trim() &&
      !/^\d{10}$/.test(formData.contactNumber)
    )
      newErrors.contactNumber = "Enter a valid 10-digit Phone Number.";

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async () => {
    if (validate()) {
      try {
        setIsSubmitting(true);

        if (defaultMemberData?.id) {
          // Update

          const { success, message, data } = await updateTeamMemberApi(
            id,
            teamId,
            defaultMemberData?.id,
            {
              ...formData,
              firstName:
                formData.firstName !== defaultMemberData.firstName
                  ? formData.firstName
                  : undefined,
              lastName:
                formData.lastName !== defaultMemberData.lastName
                  ? formData.lastName
                  : undefined,
              role:
                !defaultMemberData?.roles ||
                (defaultMemberData?.roles &&
                  formData.role !== defaultMemberData?.roles[0].role?.id)
                  ? formData.role
                  : undefined,
              email:
                formData.email !== defaultMemberData.email
                  ? formData.email
                  : undefined,
              contactNumber:
                !defaultMemberData.contactNumber ||
                (defaultMemberData.contactNumber &&
                  formData.contactNumber !== defaultMemberData.contactNumber)
                  ? formData.contactNumber
                    ? formData.contactNumber
                    : null
                  : undefined,
            },
          );
          if (success) {
            if (data.id) onUpdateMember(data);
            toast.success("Team member updated successfully!");
            onClose();
          } else {
            toast.error(
              message || "Error updating team member. Please try again.",
            );
          }
        } else {
          // create

          const { success, message, data } = await addTeamMemberApi(
            id,
            teamId,
            {
              ...formData,
              // Don't send a name for someone who already has an account. The
              // server refuses to rename an existing user anyway; omitting it
              // keeps the request honest about what this form is doing.
              firstName: matchedExistingUser ? undefined : formData.firstName,
              lastName: matchedExistingUser ? undefined : formData.lastName,
              project: id,
            },
          );
          if (success) {
            if (data.id) onAddMember(data);
            toast.success("Team member added successfully!");
            onClose();
          } else {
            toast.error(
              message || "Error adding team member. Please try again.",
            );
          }
        }
      } catch (error) {
        toast.error(
          (error as Error)?.message ||
            "Error adding team member. Please try again.",
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <CustomModal isOpen={isOpen}>
      <div className="w-full sm:w-[680px] py-6 bg-white rounded flex-col justify-start items-start gap-5 inline-flex overflow-hidden">
        <div className="self-stretch px-7 justify-start items-center gap-9 inline-flex">
          <div className="grow shrink basis-0 h-7 justify-start items-center gap-2 flex">
            <h3 className="grow shrink basis-0 text-grey-80 text-xl font-semibold font-noto-serif leading-relaxed">
              {defaultMemberData ? "Update Member details" : "Add Member"}
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
        <div className="self-stretch  h-px border-t border-grey-20" />
        <div className="self-stretch px-6 flex-col justify-start items-start gap-10 flex">
          <div className="flex self-stretch gap-4 justify-start items-start flex-col sm:flex-row">
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
              <label className="text-grey-80 text-base leading-normal">
                Role <span className="text-red-500">*</span>
              </label>
              <Select
                name="role"
                className="w-full h-10 self-stretch disabled:bg-grey-10 disabled:opacity-50"
                onChange={handleChange}
                defaultValue={formData.role}
                options={roles.map((role) => ({
                  label: role.name,
                  value: role.id,
                }))}
                placeholder=""
              />
              {errors?.role && (
                <p className="text-red-500 text-sm">{errors.role}</p>
              )}
            </div>
            <div className="flex grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
              <label className="text-grey-80 text-base leading-normal">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                name="email"
                className="w-full h-10 self-stretch grow shrink basis-0 px-3 py-2 justify-start items-center rounded border border-grey-40 flex outline-none bg-white disabled:bg-grey-10 disabled:opacity-50"
                value={formData.email}
                onChange={handleChange}
              />
              {errors?.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
          </div>
          <div className="flex self-stretch gap-4 justify-start items-start flex-col sm:flex-row">
            <div className="self-stretch grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
              <label className="text-grey-80 text-base leading-normal">
                Phone Number{" "}
                <span className="text-grey-70 text-xs">(optional)</span>
              </label>

              <div className="h-10 self-stretch w-full px-3 py-2 bg-white items-center flex grow shrink basis-0 border border-grey-40 rounded gap-2">
                <p>+91 - </p>
                <input
                  type="number"
                  name="contactNumber"
                  className="grow shrink basis-0 self-stretch outline-none disabled:bg-grey-10 disabled:opacity-50"
                  value={formData.contactNumber ?? ""}
                  onChange={handleChange}
                  placeholder=""
                />
              </div>
              {errors?.contactNumber && (
                <p className="text-red-500 text-sm">{errors.contactNumber}</p>
              )}
            </div>
            <div className="self-stretch grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
              {/*  */}
            </div>
          </div>

          {!isEditing && (
            <UserLookupStatusBanner
              status={lookup.status}
              match={lookup.match}
              error={lookup.error}
            />
          )}

          {/* An existing account's name is shown, not edited. Changing it here
              would rename that person in every project they belong to. */}
          {matchedExistingUser && !isEditing && (
            <div className="flex self-stretch gap-4 justify-start items-start flex-col sm:flex-row">
              <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
                <label className="text-grey-80 text-base leading-normal">
                  Name
                </label>
                <div className="w-full h-10 self-stretch px-3 py-2 items-center rounded border border-grey-20 bg-grey-10 text-grey-70 flex">
                  {[lookup.match?.firstName, lookup.match?.lastName]
                    .filter(Boolean)
                    .join(" ")}
                </div>
                <p className="text-grey-60 text-xs">
                  Edit this from the member&apos;s profile — it applies
                  everywhere they appear.
                </p>
              </div>
              <div className="grow shrink basis-0" />
            </div>
          )}

          {showDetailFields && (
            <div className="flex self-stretch gap-4 justify-start items-start flex-col sm:flex-row">
              <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
                <label className="text-grey-80 text-base leading-normal">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="firstName"
                  className="w-full h-10 self-stretch grow shrink basis-0 px-3 py-2 justify-start items-center rounded border border-grey-40 flex outline-none bg-white disabled:bg-grey-10 disabled:opacity-50"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors?.firstName && (
                  <p className="text-red-500 text-sm">{errors.firstName}</p>
                )}
              </div>
              <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
                <label className="text-grey-80 text-base leading-normal">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="lastName"
                  className="w-full h-10 self-stretch grow shrink basis-0 px-3 py-2 justify-start items-center rounded border border-grey-40 flex outline-none bg-white disabled:bg-grey-10 disabled:opacity-50"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors?.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName}</p>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="self-stretch  h-px border-t border-grey-20" />
        <div className="self-stretch px-7 justify-end items-center inline-flex">
          <button
            className="p-3 bg-blue-40 rounded-lg justify-center items-center gap-2 flex overflow-hidden text-white text-base font-medium leading-normal disabled:bg-grey-40"
            onClick={handleSubmit}
            disabled={isSubmitting || lookup.isResolving}
          >
            {isSubmitting && <Spinner />}
            Save
          </button>
        </div>
      </div>
    </CustomModal>
  );
}
