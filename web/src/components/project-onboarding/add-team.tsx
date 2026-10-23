import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import { useAtomValue } from "jotai";
import dynamic from "next/dynamic";
const Select = dynamic(() => import("react-select"), {
  ssr: false,
}) as unknown as React.FC<{
  options: { value: string; label: string }[];
  onChange: (
    newValue: SingleValue<{ value: string; label: string }>,
    actionMeta: ActionMeta<{ value: string; label: string }>,
  ) => void;
  className?: string;
  classNames?: unknown;
  styles?: StylesConfig<{ value: string; label: string }, false>;
  value: { value: string; label: string } | null | undefined;
  isDisabled?: boolean;
}>;
const CreatableSelect = dynamic(() => import("react-select/creatable"), {
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
  isDisabled?: boolean;
}>;
import { SingleValue, ActionMeta, StylesConfig } from "react-select";

import { projectAtom } from "@/src/store/projectAtom";
import { partnerOrganizationsAtom } from "@/src/store/partnerOrganizationsAtom";
import { invitePartners } from "@/src/app/(dashboard)/project-onboarding/actions";
import { fetchProjectInvites } from "@/src/app/(dashboard)/project-onboarding/loader";

const LOGISTICS_ORG_TYPES_MAPPING = {
  "sample-collection": "collector",
  "testing-diagnosis": "laboratory",
  sequencing: "sequencing",
};

type AddTeamProps = {
  onClose: () => void;
  handleStepComplete: (completedStep: number, forceExit: boolean) => void;
  goToPastStep: () => void;
};
interface FormData {
  id?: string;
  orgType: string;
  organization?: string;
  organizationName: string;
  email: string;
}
interface InvitePartnerProps {
  defaultData: FormData;
  onChange: (data: FormData) => void;
  error: FormData;
  handleRemove: () => void;
  showRemove: boolean;
}

const InvitePartner: React.FC<InvitePartnerProps> = ({
  defaultData,
  onChange,
  error,
  handleRemove,
  showRemove,
}) => {
  const project = useAtomValue(projectAtom);
  const isInternalTeam =
    project?.logisticDetails && project?.logisticDetails[0] === "none";
  const selectiveOrgTypes = isInternalTeam
    ? Object.values(LOGISTICS_ORG_TYPES_MAPPING)
    : (project?.logisticDetails?.map(
        (l) =>
          LOGISTICS_ORG_TYPES_MAPPING[
            l as keyof typeof LOGISTICS_ORG_TYPES_MAPPING
          ],
      ) ?? []);
  const organizations = useAtomValue(partnerOrganizationsAtom);
  const [orgType, setOrgType] = useState<string>(selectiveOrgTypes[0]);
  const [organization, setOrganizationId] = useState<string>("");
  const [organizationName, setOrganizationName] = useState<string>("");
  const [email, setEmail] = useState("");

  // set default data
  useEffect(() => {
    if (defaultData) {
      setOrgType(defaultData.orgType);
      setOrganizationId(defaultData.organization ?? "");
      setOrganizationName(defaultData.organizationName);
      setEmail(defaultData.email);
    }
  }, []);

  useEffect(() => {
    onChange({
      orgType,
      organization,
      organizationName,
      email,
    });
  }, [orgType, organization, organizationName, email]);

  const getEmail = (orgId?: string) => {
    if (orgId && organizations.length > 0) {
      const selected = organizations.filter((o) => o.id === orgId);
      return selected[0]?.email;
    }
  };

  const handleSelectChange = (
    selectedOption: SingleValue<{
      value: string;
      label: string;
    }>,
  ) => {
    // Reset states when selection is cleared
    if (!selectedOption) {
      setOrganizationName("");
      setOrganizationId("");
      setEmail("");
    } else {
      setOrganizationName(selectedOption?.label);
      setOrganizationId(selectedOption?.value);
      setEmail(getEmail(selectedOption?.value) ?? "");
    }
  };

  return (
    <div className="self-stretch justify-start items-start gap-4 inline-flex">
      <div className="w-[150px] flex-col justify-start items-start gap-2 inline-flex">
        <label className="text-grey-80 text-base font-medium leading-normal">
          Type
        </label>
        <Select
          className="w-full capitalize"
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
          options={selectiveOrgTypes.map((o) => ({
            value: o,
            label: o,
          }))}
          onChange={(value: SingleValue<{ label: string; value: string }>) =>
            value && setOrgType(value?.value)
          }
          value={orgType ? { label: orgType, value: orgType } : null}
          isDisabled={!!defaultData?.id}
        />
        {error?.orgType && (
          <p className="text-red-500 text-sm">{error.orgType}</p>
        )}
      </div>
      {!isInternalTeam && (
        <div className="w-60 flex-col justify-start items-start gap-2 inline-flex">
          <label className="text-grey-80 text-base font-medium leading-normal">
            Organization
          </label>
          <CreatableSelect
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
            onCreateOption={(newValue) => {
              setOrganizationId(newValue);
              setOrganizationName(newValue);
            }}
            value={
              organizationName
                ? { label: organizationName, value: organization ?? "" }
                : null
            }
            isClearable
            isDisabled={!!defaultData?.id}
          />
          {error?.organizationName && (
            <p className="text-red-500 text-sm">{error.organizationName}</p>
          )}
        </div>
      )}
      <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
        <label className="text-grey-80 text-base font-medium leading-normal">
          {isInternalTeam ? "Email" : "Admin Email ID"}
        </label>
        <input
          className="w-full h-10 self-stretch grow shrink basis-0 px-3 py-2 justify-start items-center rounded border border-grey-40 flex outline-none bg-white disabled:bg-grey-10 disabled:opacity-50"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={organization !== organizationName || !!defaultData?.id}
        />
        {error?.email && <p className="text-red-500 text-sm">{error.email}</p>}
      </div>
      {showRemove && !defaultData?.id ? (
        <div className="w-6 h-6 mt-9 cursor-pointer" onClick={handleRemove}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M 10 2 L 9 3 L 5 3 C 4.4 3 4 3.4 4 4 C 4 4.6 4.4 5 5 5 L 7 5 L 17 5 L 19 5 C 19.6 5 20 4.6 20 4 C 20 3.4 19.6 3 19 3 L 15 3 L 14 2 L 10 2 z M 5 7 L 5 20 C 5 21.1 5.9 22 7 22 L 17 22 C 18.1 22 19 21.1 19 20 L 19 7 L 5 7 z M 9 9 C 9.6 9 10 9.4 10 10 L 10 19 C 10 19.6 9.6 20 9 20 C 8.4 20 8 19.6 8 19 L 8 10 C 8 9.4 8.4 9 9 9 z M 15 9 C 15.6 9 16 9.4 16 10 L 16 19 C 16 19.6 15.6 20 15 20 C 14.4 20 14 19.6 14 19 L 14 10 C 14 9.4 14.4 9 15 9 z"></path>
          </svg>
        </div>
      ) : (
        <div className="w-6 h-6" />
      )}
    </div>
  );
};

export default function AddTeam({
  onClose,
  handleStepComplete,
  goToPastStep,
}: AddTeamProps) {
  const { projectId } = useParams<{ projectId: string }>();
  const project = useAtomValue(projectAtom);
  const isInternalTeam =
    project?.logisticDetails && project?.logisticDetails[0] === "none";

  const [formData, setFormData] = useState<FormData[]>([]);
  const [inviteCount, setInviteCount] = useState<number>(0);
  const [errors, setErrors] = useState<FormData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchProjectInvites(projectId)
      .then((response) => {
        if (response.success) {
          setFormData(
            response.data.map((d) => ({
              id: d.id,
              orgType: d.organizationType,
              organization: d.organization,
              organizationName: d.organizationName,
              email: d.email,
            })),
          );
          setInviteCount(response.data.length + 1);
        }
      })
      .catch((e) => console.log("Error fetching invites", e));
  }, [projectId]);

  const handleFormDataChange = (index: number) => (data: FormData) => {
    setFormData((prev) => {
      const updatedFormData = [...prev];
      // If index exists, update the existing entry
      if (updatedFormData[index]) {
        updatedFormData[index] = { ...updatedFormData[index], ...data };
      } else {
        // If index doesn't exist, add a new entry at the correct index
        updatedFormData[index] = {
          ...data,
        } as (typeof updatedFormData)[number];
      }
      return updatedFormData;
    });
  };

  const validate = () => {
    const newErrors = formData.map((fData) => {
      const newError: FormData = {
        orgType: "",
        organizationName: "",
        email: "",
      };
      if (!fData.orgType?.trim()) newError.orgType = "orgType is required.";
      if (
        !isInternalTeam &&
        !fData.organization?.trim() &&
        !fData.organizationName?.trim()
      )
        newError.organizationName = "organization name is required.";
      if (!fData.email?.trim()) newError.email = "email is required.";
      return newError;
    });

    setErrors(newErrors);
    return newErrors.every((newError) => {
      return Object.values(newError).every((error) => !error);
    });
  };

  const handleSubmit = async (forceExit: boolean) => {
    if (validate()) {
      try {
        if (projectId) {
          setLoading(true);
          const { success } = await invitePartners(
            projectId,
            formData
              .filter((f) => !f.id) //Remove already existing invites
              .map((f) => ({
                ...f,
              })),
          );
          if (success) {
            handleStepComplete(4, forceExit);
          }
        }
      } catch (error) {
        toast.error(
          (error as Error)?.message ||
            "Error inviting partners. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRemoveItem = (index: number) => {
    setFormData((prev) => prev.filter((prev, i) => i !== index));
    setErrors((prev) => prev.filter((prev, i) => i !== index));
    setInviteCount((prev) => prev - 1);
  };

  return (
    <div className="w-[780px] pt-6 bg-white rounded flex-col justify-start items-start gap-6 inline-flex overflow-hidden">
      <div className="self-stretch px-7 justify-start items-center gap-9 inline-flex">
        <div className="grow shrink basis-0 h-7 justify-start items-center gap-2 flex">
          <div
            className="p-1 rounded-[999px] justify-center items-center flex overflow-hidden cursor-pointer"
            onClick={goToPastStep}
          >
            <div className="w-5 h-5 relative  overflow-hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M6.52203 9.16689H16.6654V10.8336H6.52203L10.992 15.3036L9.8137 16.4819L3.33203 10.0002L9.8137 3.51855L10.992 4.69689L6.52203 9.16689Z"
                  fill="#284DB6"
                />
              </svg>
            </div>
          </div>
          <h3 className="grow shrink basis-0 text-grey-80 text-xl font-semibold font-noto-serif leading-relaxed">
            Invite Partners
          </h3>
        </div>
        <div
          className="p-1 rounded-[999px] justify-center items-center flex overflow-hidden cursor-pointer"
          onClick={onClose}
        >
          <div className="w-5 h-5 relative  overflow-hidden">
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

      {/*  */}

      <div className="self-stretch max-h-[564px] min-h-[264px] px-6 bg-white flex-col justify-start items-start gap-10 inline-flex overflow-y-auto">
        {/* <div className="self-stretch"></div> */}
        {inviteCount > 0
          ? Array(inviteCount)
              .fill("")
              .map((_, i) => (
                <InvitePartner
                  key={i}
                  onChange={handleFormDataChange(i)}
                  error={errors[i]}
                  handleRemove={() => handleRemoveItem(i)}
                  showRemove={i > 0 && i === inviteCount - 1}
                  defaultData={formData[i]}
                />
              ))
          : ""}
        <div>
          <button
            className="h-10 px-3 py-2 bg-blue-10 rounded-lg justify-center items-center gap-2 inline-flex overflow-hidden text-blue-40 text-sm font-medium leading-[21px]"
            onClick={() => setInviteCount((prev) => prev + 1)}
          >
            <div className="w-4 h-4 relative  overflow-hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M7.33203 7.33301V3.33301H8.66536V7.33301H12.6654V8.66634H8.66536V12.6663H7.33203V8.66634H3.33203V7.33301H7.33203Z"
                  fill="#284DB6"
                />
              </svg>
            </div>
            {isInternalTeam ? "Add More" : "Add More Partner"}
          </button>
        </div>
        {/* <div className="self-stretch h-[66px] flex-col justify-start items-start gap-3 flex">
            <div className="self-stretch h-[66px] px-4 py-3 bg-grey-10 border border-grey-20 flex-col justify-center items-start gap-2 flex">
              <div className="self-stretch justify-start items-start gap-2 inline-flex">
                <div className="grow shrink basis-0 h-[42px] justify-start items-start gap-2 flex">
                  <div className="self-stretch pt-0.5 justify-start items-start gap-2.5 flex">
                    <div className="w-4 h-4 relative  overflow-hidden">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M7.9987 14.6663C4.3167 14.6663 1.33203 11.6817 1.33203 7.99967C1.33203 4.31767 4.3167 1.33301 7.9987 1.33301C11.6807 1.33301 14.6654 4.31767 14.6654 7.99967C14.6654 11.6817 11.6807 14.6663 7.9987 14.6663ZM7.9987 13.333C9.41319 13.333 10.7697 12.7711 11.7699 11.7709C12.7701 10.7707 13.332 9.41416 13.332 7.99967C13.332 6.58519 12.7701 5.22863 11.7699 4.22844C10.7697 3.22824 9.41319 2.66634 7.9987 2.66634C6.58421 2.66634 5.22766 3.22824 4.22746 4.22844C3.22727 5.22863 2.66536 6.58519 2.66536 7.99967C2.66536 9.41416 3.22727 10.7707 4.22746 11.7709C5.22766 12.7711 6.58421 13.333 7.9987 13.333ZM7.33203 4.66634H8.66536V5.99967H7.33203V4.66634ZM7.33203 7.33301H8.66536V11.333H7.33203V7.33301Z"
                          fill="#11181C"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="grow shrink basis-0 self-stretch text-grey-80 text-sm font-normal leading-[21px]">
                    If you have a longer list of people to add, upload the list
                    of emails to invite. <br />
                    Accepted file formats: xls, csv
                  </p>
                </div>
              </div>
            </div>
          </div> */}
        {/* <div className="self-stretch flex-col justify-start items-start gap-4 flex">
            <div className="self-stretch justify-between items-center inline-flex">
              <h4 className="text-grey-80 text-base font-semibold font-noto-serif leading-tight">
                Collection Organisation
              </h4>
              <button className="py-1 rounded-lg justify-start items-center gap-2 flex overflow-hidden text-blue-40 text-sm font-medium leading-[21px]">
                <div className="w-4 h-4 relative  overflow-hidden">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                  >
                    <path
                      d="M13.9987 2.5H1.9987C1.63051 2.5 1.33203 2.79848 1.33203 3.16667V13.8333C1.33203 14.2015 1.63051 14.5 1.9987 14.5H13.9987C14.3669 14.5 14.6654 14.2015 14.6654 13.8333V3.16667C14.6654 2.79848 14.3669 2.5 13.9987 2.5ZM7.9987 11.1667C6.8941 11.1667 5.9987 10.2713 5.9987 9.16667H2.66536V3.83333H13.332V9.16667H9.9987C9.9987 10.2713 9.1033 11.1667 7.9987 11.1667ZM10.6654 6.5H8.66536V4.5H7.33203V6.5H5.33203L7.9987 9.5L10.6654 6.5Z"
                      fill="#284DB6"
                    />
                  </svg>
                </div>
                Import List
              </button>
            </div>
            <div className="self-stretch h-px relative border-t border-grey-20" />
            <div className="self-stretch justify-start items-end gap-4 inline-flex">
              <div className="w-60 flex-col justify-start items-start gap-2 inline-flex">
                <label className="text-grey-80 text-base font-medium leading-normal">
                  Organisation Name
                </label>
                <div className="self-stretch h-10 px-3 py-2 bg-white rounded border border-grey-40 justify-start items-center gap-3 inline-flex">
                  <input className="grow shrink basis-0 h-[21px] justify-start items-center gap-1 flex outline-none" />
                </div>
              </div>
              <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
                <label className="text-grey-80 text-base font-medium leading-normal">
                  Admin Email ID
                </label>
                <div className="self-stretch h-10 px-3 py-2 bg-white rounded border border-grey-40 justify-start items-center gap-3 inline-flex">
                  <input className="grow shrink basis-0 h-[21px] justify-start items-center gap-1 flex outline-none" />
                </div>
              </div>
            </div>
            <button className="h-10 px-3 py-2 bg-blue-10 rounded-lg justify-center items-center gap-2 inline-flex overflow-hidden text-blue-40 text-sm font-medium leading-[21px]">
              <div className="w-4 h-4 relative  overflow-hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M7.33203 7.33301V3.33301H8.66536V7.33301H12.6654V8.66634H8.66536V12.6663H7.33203V8.66634H3.33203V7.33301H7.33203Z"
                    fill="#284DB6"
                  />
                </svg>
              </div>
              Add More Collector Orgs
            </button>
          </div> */}
        {/* 2 */}
        {/* <div className="self-stretch flex-col justify-start items-start gap-4 flex">
            <div className="self-stretch justify-between items-center inline-flex">
              <h4 className="text-grey-80 text-base font-semibold font-noto-serif leading-tight">
                Diagnostic Laboratory
              </h4>
              <button className="py-1 rounded-lg justify-start items-center gap-2 flex overflow-hidden text-blue-40 text-sm font-medium leading-[21px]">
                <div className="w-4 h-4 relative  overflow-hidden">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                  >
                    <path
                      d="M13.9987 2.5H1.9987C1.63051 2.5 1.33203 2.79848 1.33203 3.16667V13.8333C1.33203 14.2015 1.63051 14.5 1.9987 14.5H13.9987C14.3669 14.5 14.6654 14.2015 14.6654 13.8333V3.16667C14.6654 2.79848 14.3669 2.5 13.9987 2.5ZM7.9987 11.1667C6.8941 11.1667 5.9987 10.2713 5.9987 9.16667H2.66536V3.83333H13.332V9.16667H9.9987C9.9987 10.2713 9.1033 11.1667 7.9987 11.1667ZM10.6654 6.5H8.66536V4.5H7.33203V6.5H5.33203L7.9987 9.5L10.6654 6.5Z"
                      fill="#284DB6"
                    />
                  </svg>
                </div>
                Import List
              </button>
            </div>
            <div className="self-stretch h-px relative border-t border-grey-20" />
            <div className="self-stretch justify-start items-end gap-4 inline-flex">
              <div className="w-60 flex-col justify-start items-start gap-2 inline-flex">
                <label className="text-grey-80 text-base font-medium leading-normal">
                  Organisation Name
                </label>
                <div className="self-stretch h-10 px-3 py-2 bg-white rounded border border-grey-40 justify-start items-center gap-3 inline-flex">
                  <input className="grow shrink basis-0 h-[21px] justify-start items-center gap-1 flex outline-none" />
                </div>
              </div>
              <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
                <label className="text-grey-80 text-base font-medium leading-normal">
                  Admin Email ID
                </label>
                <div className="self-stretch h-10 px-3 py-2 bg-white rounded border border-grey-40 justify-start items-center gap-3 inline-flex">
                  <input className="grow shrink basis-0 h-[21px] justify-start items-center gap-1 flex outline-none" />
                </div>
              </div>
            </div>
            <button className="h-10 px-3 py-2 bg-blue-10 rounded-lg justify-center items-center gap-2 inline-flex overflow-hidden text-blue-40 text-sm font-medium leading-[21px]">
              <div className="w-4 h-4 relative  overflow-hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M7.33203 7.33301V3.33301H8.66536V7.33301H12.6654V8.66634H8.66536V12.6663H7.33203V8.66634H3.33203V7.33301H7.33203Z"
                    fill="#284DB6"
                  />
                </svg>
              </div>
              Add More Labs
            </button>
          </div> */}
        {/* 3 */}
        {/* <div className="self-stretch flex-col justify-start items-start gap-4 flex">
            <div className="self-stretch justify-between items-center inline-flex">
              <h4 className="text-grey-80 text-base font-semibold font-noto-serif leading-tight">
                Sequencing Laboratory
              </h4>
              <button className="py-1 rounded-lg justify-start items-center gap-2 flex overflow-hidden text-blue-40 text-sm font-medium leading-[21px]">
                <div className="w-4 h-4 relative  overflow-hidden">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                  >
                    <path
                      d="M13.9987 2.5H1.9987C1.63051 2.5 1.33203 2.79848 1.33203 3.16667V13.8333C1.33203 14.2015 1.63051 14.5 1.9987 14.5H13.9987C14.3669 14.5 14.6654 14.2015 14.6654 13.8333V3.16667C14.6654 2.79848 14.3669 2.5 13.9987 2.5ZM7.9987 11.1667C6.8941 11.1667 5.9987 10.2713 5.9987 9.16667H2.66536V3.83333H13.332V9.16667H9.9987C9.9987 10.2713 9.1033 11.1667 7.9987 11.1667ZM10.6654 6.5H8.66536V4.5H7.33203V6.5H5.33203L7.9987 9.5L10.6654 6.5Z"
                      fill="#284DB6"
                    />
                  </svg>
                </div>
                Import List
              </button>
            </div>
            <div className="self-stretch h-px relative border-t border-grey-20" />
            <div className="self-stretch justify-start items-end gap-4 inline-flex">
              <div className="w-60 flex-col justify-start items-start gap-2 inline-flex">
                <label className="text-grey-80 text-base font-medium leading-normal">
                  Organisation Name
                </label>
                <div className="self-stretch h-10 px-3 py-2 bg-white rounded border border-grey-40 justify-start items-center gap-3 inline-flex">
                  <input className="grow shrink basis-0 h-[21px] justify-start items-center gap-1 flex outline-none" />
                </div>
              </div>
              <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
                <label className="text-grey-80 text-base font-medium leading-normal">
                  Admin Email ID
                </label>
                <div className="self-stretch h-10 px-3 py-2 bg-white rounded border border-grey-40 justify-start items-center gap-3 inline-flex">
                  <input className="grow shrink basis-0 h-[21px] justify-start items-center gap-1 flex outline-none" />
                </div>
              </div>
            </div>
            <button className="h-10 px-3 py-2 bg-blue-10 rounded-lg justify-center items-center gap-2 inline-flex overflow-hidden text-blue-40 text-sm font-medium leading-[21px]">
              <div className="w-4 h-4 relative  overflow-hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M7.33203 7.33301V3.33301H8.66536V7.33301H12.6654V8.66634H8.66536V12.6663H7.33203V8.66634H3.33203V7.33301H7.33203Z"
                    fill="#284DB6"
                  />
                </svg>
              </div>
              Add More Labs
            </button>
          </div> */}
      </div>

      {/*  */}

      <div className="self-stretch px-7 pt-5 pb-6 bg-white rounded-bl-lg rounded-br-lg border-t border-grey-20 justify-between items-center inline-flex overflow-hidden">
        <p className="text-center text-grey-70 text-sm leading-[21px]">
          Step 4 of 5
        </p>
        <div className="justify-start items-center gap-5 flex">
          <button
            className="p-3 bg-white rounded-lg border border-blue-40 justify-center items-center gap-2 flex overflow-hidden text-blue-40 text-base leading-normal disabled:bg-grey-10"
            onClick={() => handleSubmit(true)}
            disabled={loading}
          >
            Save & Exit
          </button>
          <button
            className="p-3 bg-blue-40 rounded-lg justify-center items-center gap-2 flex overflow-hidden text-white text-base leading-normal disabled:bg-grey-10"
            onClick={() => handleSubmit(false)}
            disabled={loading}
          >
            Invite & Proceed
          </button>
        </div>
      </div>
    </div>
  );
}
