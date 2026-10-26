import React, { useState, useEffect, ChangeEvent } from "react";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";

import CustomModal from "@/src/components/ui/custom-modal";
import { getTeamMembersApi } from "@/src/app/(dashboard)/manage/loader";
import { addTeamApi } from "@/src/app/(dashboard)/manage/actions";
import Checkbox from "@/src/components/ui/checkbox";
import Spinner from "@/src/components/ui/spinner";
import { Team } from "@/src/types/teams";
import { isValidEmail } from "@/src/utils";
import { useUserLookup } from "@/src/hooks/use-user-lookup";
import UserLookupStatusBanner from "@/src/components/ui/user-lookup-status";

interface FormValues {
  email: string;
  teamName: string;
  firstName: string;
  lastName: string;
  address: string;
  contactNumber?: string;
}
type FormErrors = Partial<FormValues>;

export default function AddTeam({
  visible,
  onClose,
  onTeamAdded,
}: {
  visible: boolean;
  onClose: () => void;
  onTeamAdded: (team: Team) => void;
}) {
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<FormValues>({
    email: "",
    teamName: "",
    firstName: "",
    lastName: "",
    address: "",
    contactNumber: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isProjectViewer, setIsProjectViewer] = useState<boolean>(false);

  // The team lead is a user account like any other. If they already exist,
  // their name belongs to them - this form must not redefine it.
  const lookup = useUserLookup({
    email: formData.email,
    contactNumber: formData.contactNumber,
    enabled: visible,
  });

  const showDetailFields = lookup.shouldCollectDetails;
  const matchedExistingUser =
    lookup.status === "found" && !lookup.matchedNameIsBlank;

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
    if (visible) {
      setFormData({
        teamName: "",
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        contactNumber: "",
      });
      setIsProjectViewer(false);
      setErrors({});
    }
  }, [visible]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: typeof errors = {
      firstName: "",
      lastName: "",
      teamName: "",
      email: "",
      address: "",
      contactNumber: "",
    };

    if (!formData.teamName.trim())
      newErrors.teamName = "Team Name is required.";
    // Required only when this form is actually supplying the name; a matched
    // account brings its own.
    if (showDetailFields) {
      if (!formData.firstName.trim())
        newErrors.firstName = "First Name is required.";
      if (!formData.lastName.trim())
        newErrors.lastName = "Last Name is required.";
    }
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!isValidEmail(formData.email))
      newErrors.email = "Invalid email address.";

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
        const { success, message, data } = await addTeamApi(id, {
          ...formData,
          contactNumber: formData.contactNumber
            ? formData.contactNumber
            : undefined,
          isProjectViewer,
        });
        if (success) {
          if (data.id) {
            const { data: members } = await getTeamMembersApi(id, data.id);
            onTeamAdded({ ...data, members });
          }
          toast.success("Team added successfully!");
          onClose();
        } else {
          toast.error(message || "Error adding team. Please try again.");
        }
      } catch (error) {
        toast.error(
          (error as Error)?.message || "Error adding team. Please try again.",
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <CustomModal isOpen={visible}>
      <div className="w-full sm:w-[680px] py-6 bg-white rounded flex-col justify-start items-start gap-5 inline-flex overflow-hidden">
        <div className="self-stretch px-7 justify-start items-center gap-9 inline-flex">
          <div className="grow shrink basis-0 h-7 justify-start items-center gap-2 flex">
            <h3 className="grow shrink basis-0 text-grey-80 text-xl font-semibold font-noto-serif leading-relaxed">
              Add Team
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

        <div className="self-stretch px-6 flex-col justify-start items-start gap-6 flex">
          <div className="flex self-stretch gap-4 justify-start items-start flex-col sm:flex-row">
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
              <label className="text-grey-80 text-base leading-normal">
                Team Name <span className="text-red-500">*</span>
              </label>
              <input
                name="teamName"
                value={formData.teamName}
                className="w-full h-10 self-stretch grow shrink basis-0 px-3 py-2 justify-start items-center rounded border border-grey-40 flex outline-none bg-white disabled:bg-grey-10 disabled:opacity-50"
                onChange={handleChange}
              />
              {errors?.teamName && (
                <p className="text-red-500 text-sm">{errors.teamName}</p>
              )}
            </div>
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
              <label className="text-grey-80 text-base leading-normal">
                Team Lead Email <span className="text-red-500">*</span>
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
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
              <label className="text-grey-80 text-base leading-normal">
                Phone Number{" "}
                <span className="text-grey-70 text-xs">(optional)</span>
              </label>
              <div className="h-10 self-stretch w-full px-3 py-2 bg-white items-center flex grow shrink basis-0 border border-grey-40 rounded gap-2">
                <p className="text-sm text-grey-80 placeholder:text-grey-70">
                  +91 -{" "}
                </p>
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
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
              <label className="text-grey-80 text-base leading-normal">
                Team address{" "}
                <span className="text-grey-70 text-xs">(optional)</span>
              </label>
              <input
                name="address"
                className="w-full h-10 self-stretch grow shrink basis-0 px-3 py-2 justify-start items-center rounded border border-grey-40 flex outline-none bg-white disabled:bg-grey-10 disabled:opacity-50"
                value={formData.address}
                onChange={handleChange}
              />
              {errors?.address && (
                <p className="text-red-500 text-sm">{errors.address}</p>
              )}
            </div>
          </div>
          <UserLookupStatusBanner
            status={lookup.status}
            match={lookup.match}
            error={lookup.error}
          />

          {/* An existing account's name is shown, not edited - it is that
              person's identity across every project, not a per-team label. */}
          {matchedExistingUser && (
            <div className="flex self-stretch gap-4 justify-start items-start flex-col sm:flex-row">
              <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
                <label className="text-grey-80 text-base leading-normal">
                  Team Lead
                </label>
                <div className="w-full h-10 self-stretch px-3 py-2 items-center rounded border border-grey-20 bg-grey-10 text-grey-70 flex">
                  {[lookup.match?.firstName, lookup.match?.lastName]
                    .filter(Boolean)
                    .join(" ")}
                </div>
                <p className="text-grey-60 text-xs">
                  Edit this from their profile — it applies everywhere they
                  appear.
                </p>
              </div>
              <div className="grow shrink basis-0" />
            </div>
          )}

          {showDetailFields && (
            <div className="flex self-stretch gap-4 justify-start items-start flex-col sm:flex-row">
              <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
                <label className="text-grey-80 text-base leading-normal">
                  Team Lead First Name <span className="text-red-500">*</span>
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
                  Team Lead Last Name <span className="text-red-500">*</span>
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

          <Checkbox
            id={"primary"}
            label={"Admin"}
            className="bg-grey-0"
            name="isProjectViewer"
            onChange={(e) => setIsProjectViewer(e.target.checked)}
            checked={isProjectViewer}
          />
        </div>

        <div className="self-stretch h-px border-t border-grey-20" />

        <div className="self-stretch px-7 justify-end items-center inline-flex">
          <button
            className="p-3 bg-blue-40 rounded-lg justify-center items-center gap-2 flex overflow-hidden text-white text-base font-medium leading-normal disabled:bg-grey-40"
            onClick={handleSubmit}
            disabled={isSubmitting || lookup.isResolving}
          >
            {isSubmitting ? <Spinner /> : "Save"}
          </button>
        </div>
      </div>
    </CustomModal>
  );
}
