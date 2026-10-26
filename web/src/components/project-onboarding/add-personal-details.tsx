import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAtom } from "jotai";
import dynamic from "next/dynamic";
const Select = dynamic(() => import("react-select/creatable"), {
  ssr: false,
}) as unknown as React.FC<{
  options: { value: string; label: string }[];
  onChange: (
    newValue: SingleValue<{ value: string; label: string }>,
    actionMeta: ActionMeta<{ value: string; label: string }>,
  ) => void;
  onCreateOption: (value: string) => void;
  isClearable?: boolean;
  className?: string;
  classNames?: unknown;
  styles?: StylesConfig<{ value: string; label: string }, false>;
  value: { value: string; label: string } | null | undefined;
}>;
import { SingleValue, ActionMeta, StylesConfig } from "react-select";

import { fetchOrganizations } from "@/src/app/(dashboard)/project-onboarding/loader";
import { updateUser } from "@/src/app/(dashboard)/project-onboarding/actions";
import { userAtom } from "@/src/store/userAtom";
import { partnerOrganizationsAtom } from "@/src/store/partnerOrganizationsAtom";

type AddPersonalDetailsProps = {
  onClose: () => void;
  handleStepComplete: (completedStep: number, forceExit: boolean) => void;
};

export default function AddPersonalDetails({
  onClose,
  handleStepComplete,
}: AddPersonalDetailsProps) {
  const [user, setUser] = useAtom(userAtom);
  const [organizations, setOrganizations] = useAtom(partnerOrganizationsAtom);
  const [selectedOrg, setSelectedOrg] = useState<{
    label: string;
    value: string;
  } | null>();
  const [formData, setFormData] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    organizationName: user?.organizationName ?? "",
    organizationId: user?.organization?.id ?? "",
    designation: user?.designation ?? "",
    contactNumber: user?.contactNumber?.toString() ?? "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    organizationName: "",
    designation: "",
    contactNumber: "",
  });

  useEffect(() => {
    if (user?.id) {
      setFormData({
        firstName: user?.firstName ?? "",
        lastName: user?.lastName ?? "",
        organizationName: user?.organization?.organizationName ?? "",
        organizationId: user?.organization?.id ?? "",
        designation: user?.designation ?? "",
        contactNumber: user?.contactNumber?.toString() ?? "",
      });
      setSelectedOrg({
        label: user?.organization?.organizationName ?? "",
        value: user?.organization?.id ?? "",
      });
    }
  }, [user?.id]);

  useEffect(() => {
    fetchOrganizations()
      .then((response) => {
        if (response.success) {
          setOrganizations(response.data);
        }
      })
      .catch((e) => console.error("Error fetching organizations", e));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear errors on change
  };

  const handleSelectChange = (
    selectedOption: SingleValue<{
      value: string;
      label: string;
    }>,
  ) => {
    // Reset organizationName when selection is cleared
    if (!selectedOption) {
      setFormData((prev) => ({
        ...prev,
        organizationName: "",
      }));
    }
    setSelectedOrg(selectedOption);
    setFormData((prev) => ({
      ...prev,
      organizationId: selectedOption?.value ?? "",
      organizationName: selectedOption?.label ?? "",
    }));
    setErrors((prev) => ({ ...prev, organizationName: "" }));
  };

  const handleCreate = (inputValue: string) => {
    setSelectedOrg({ label: inputValue, value: inputValue });
    setFormData((prev) => ({
      ...prev,
      organizationName: inputValue ?? "",
    }));
    setErrors((prev) => ({ ...prev, organizationName: "" }));
  };

  const validate = () => {
    const newErrors: typeof errors = {
      firstName: "",
      lastName: "",
      organizationName: "",
      designation: "",
      contactNumber: "",
    };

    if (!formData.firstName.trim())
      newErrors.firstName = "First Name is required.";
    if (!formData.lastName.trim())
      newErrors.lastName = "Last Name is required.";
    if (!formData.organizationName.trim() && !formData.organizationId?.trim())
      newErrors.organizationName = "Organization Name is required.";
    if (!formData.designation.trim())
      newErrors.designation = "Designation is required.";
    if (
      !formData.contactNumber.trim() ||
      !/^\d{10}$/.test(formData.contactNumber)
    )
      newErrors.contactNumber = "Enter a valid 10-digit Contact Number.";

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async (forceExit: boolean) => {
    if (validate()) {
      try {
        if (user?.id) {
          const { success, data } = await updateUser(user?.id, {
            ...formData,
            contactNumber: formData.contactNumber,
          });
          if (success) {
            setUser((u) => ({ ...u, ...data }));
            handleStepComplete(1, forceExit);
          }
        }
      } catch (error) {
        toast.error(
          (error as Error)?.message ||
            "Error updating personal details. Please try again.",
        );
      }
    }
  };

  return (
    <div className="w-[680px] py-6 bg-white rounded flex-col justify-start items-start gap-5 inline-flex overflow-hidden">
      <div className="self-stretch px-7 justify-start items-center gap-9 inline-flex">
        <h3 className="grow shrink basis-0 text-grey-80 text-xl font-semibold font-noto-serif leading-[26px]">
          Add Personal Details
        </h3>
        <div
          className="p-1 rounded-[999px] justify-center items-center flex overflow-hidden cursor-pointer"
          onClick={onClose}
        >
          <div className="w-5 h-5 relative overflow-hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M9.99865 8.82129L14.1236 4.69629L15.302 5.87462L11.177 9.99962L15.302 14.1246L14.1236 15.303L9.99865 11.178L5.87365 15.303L4.69531 14.1246L8.82031 9.99962L4.69531 5.87462L5.87365 4.69629L9.99865 8.82129Z"
                fill="#284DB6"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="self-stretch h-px relative border-t border-grey-20" />
      <div className="self-stretch px-6 py-1 justify-start items-start gap-6 flex flex-wrap ">
        {[
          { label: "First Name", name: "firstName", type: "text" },
          { label: "Last Name", name: "lastName", type: "text" },
          {
            label: "Organization Name",
            name: "organizationName",
            type: "select",
          },
          { label: "Designation", name: "designation", type: "text" },
          { label: "Contact Number", name: "contactNumber", type: "number" },
        ].map(({ label, name, type }) => (
          <div
            key={name}
            className="w-[48%] self-stretch flex-col justify-start items-start gap-2 inline-flex"
          >
            <label className="text-grey-80 text-base leading-normal">
              {label}
            </label>
            {type === "select" ? (
              <div className="self-stretch">
                <Select
                  className="w-full"
                  classNames={{
                    control: () => "!border-grey-40",
                  }}
                  styles={{
                    menuList: (provided) => ({
                      ...provided,
                      maxHeight: "200px",
                      overflowY: "auto",
                    }),
                  }}
                  options={organizations.map((o) => ({
                    value: o.id,
                    label: o.organizationName,
                  }))}
                  onChange={handleSelectChange}
                  onCreateOption={handleCreate}
                  value={selectedOrg}
                  isClearable
                />
              </div>
            ) : (
              <div className="self-stretch h-10 px-3 py-2 bg-white rounded border border-grey-40 justify-start items-center gap-3 inline-flex">
                <input
                  type={type}
                  name={name}
                  value={formData[name as keyof typeof formData]}
                  onChange={handleChange}
                  className="grow shrink basis-0 h-[21px] justify-start items-center gap-1 flex outline-none"
                />
              </div>
            )}
            {errors[name as keyof typeof errors] && (
              <p className="text-red-500 text-sm">
                {errors[name as keyof typeof errors]}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="self-stretch h-px relative border-t border-grey-20" />
      <div className="self-stretch px-7 justify-between items-center inline-flex">
        <p className="text-center text-grey-70 text-sm leading-[21px]">
          Step 1 of 5
        </p>
        <div className="justify-start items-center gap-5 flex">
          <button
            className="p-3 bg-white rounded-lg border border-blue-40 justify-center items-center gap-2 flex overflow-hidden text-blue-40 text-base leading-normal"
            onClick={() => handleSubmit(true)}
          >
            Save & Exit
          </button>
          <button
            className="p-3 bg-blue-40 rounded-lg justify-center items-center gap-2 flex overflow-hidden text-white text-base leading-normal"
            onClick={() => handleSubmit(false)}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}
