import { useSetAtom } from "jotai";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import type SelectType from "react-select";
const Select = dynamic(() => import("react-select"), {
  ssr: false,
}) as unknown as typeof SelectType;

type SelectOption = { value: string; label: string };

import { createProjectApi } from "@/src/app/(dashboard)/manage/actions";
import {
  fetchDisease,
  fetchRegions,
  fetchRegionsByRegionId,
  fetchSurveillanceTypes,
} from "@/src/app/(dashboard)/project-onboarding/loader";
import Checkbox from "@/src/components/ui/checkbox";
import CustomModal from "@/src/components/ui/custom-modal";
import Spinner from "@/src/components/ui/spinner";
import { projectsAtom } from "@/src/store/projectsAtom";
import type { Disease, Region, SurveillanceType } from "@/src/types/global";
import { generateRandomCode, isValidEmail } from "@/src/utils";
import { useUserLookup } from "@/src/hooks/use-user-lookup";
import UserLookupStatusBanner from "@/src/components/ui/user-lookup-status";

interface FormValues {
  name: string;
  diseases: string[];
  surveillanceTypes: string[];
  teams: TeamData[];
}
interface FormErrors {
  name: string;
  diseases: string;
  surveillanceTypes: string;
  regions: string;
  teams: TeamData[];
  generic?: string;
}

interface TeamData {
  teamName: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  contactNumber?: string;
  isProjectViewer?: boolean;
  // Client-side only, stripped before submit: set when the team lead's
  // email/phone already belongs to an account. The parent uses it to skip
  // requiring a name that the existing user record already supplies (and
  // that the server will not overwrite).
  matchedUserId?: string | null;
}

interface AddTeamProps {
  index: number;
  defaultData: TeamData;
  onChange: (data: TeamData) => void;
  handlePrimaryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: TeamData;
  handleRemove: () => void;
  showRemove: boolean;
}

const SELECT_ALL_OPTION = { value: "__select_all__", label: "Select All" };

const AddTeam: React.FC<AddTeamProps> = ({
  index,
  defaultData,
  onChange,
  handlePrimaryChange,
  error,
  handleRemove,
  showRemove,
}) => {
  const [teamName, setTeamName] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [contactNumber, setContactNumber] = useState<string>();
  const [address, setAddress] = useState<string>("");

  const lookup = useUserLookup({ email, contactNumber });

  const showDetailFields = lookup.shouldCollectDetails;
  const matchedExistingUser =
    lookup.status === "found" && !lookup.matchedNameIsBlank;

  useEffect(() => {
    if (!matchedExistingUser || !lookup.match) return;
    setFirstName(lookup.match.firstName ?? "");
    setLastName(lookup.match.lastName ?? "");
  }, [matchedExistingUser, lookup.match]);

  // set default data
  useEffect(() => {
    setTeamName(defaultData?.teamName ?? "");
    setEmail(defaultData?.email ?? "");
    setFirstName(defaultData?.firstName ?? "");
    setLastName(defaultData?.lastName ?? "");
    setAddress(defaultData?.address ?? "");
    setContactNumber(defaultData?.contactNumber);
  }, []);

  useEffect(() => {
    onChange({
      teamName,
      email,
      firstName,
      lastName,
      contactNumber,
      address,
      matchedUserId: matchedExistingUser ? (lookup.match?.id ?? null) : null,
    });
  }, [
    teamName,
    email,
    firstName,
    lastName,
    contactNumber,
    address,
    matchedExistingUser,
    lookup.match?.id,
  ]);

  return (
    <fieldset className="relative self-stretch justify-start items-start gap-4 inline-flex flex-col border p-4">
      <legend className="text-grey-80 text-base font-medium leading-normal">
        Team {index + 1}
      </legend>
      <div className="flex self-stretch gap-4 justify-start items-start flex-col sm:flex-row">
        <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
          <label className="text-grey-80 text-base leading-normal">
            Team Name <span className="text-red-500">*</span>
          </label>
          <input
            name="teamName"
            className="w-full h-10 self-stretch grow shrink basis-0 px-3 py-2 justify-start items-center rounded border border-grey-40 flex outline-none bg-white disabled:bg-grey-10 disabled:opacity-50"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
          {error?.teamName && (
            <p className="text-red-500 text-sm">{error.teamName}</p>
          )}
        </div>
        <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
          <label className="text-grey-80 text-base leading-normal">
            Team Lead Email <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full h-10 self-stretch grow shrink basis-0 px-3 py-2 justify-start items-center rounded border border-grey-40 flex outline-none bg-white disabled:bg-grey-10 disabled:opacity-50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error?.email && (
            <p className="text-red-500 text-sm">{error.email}</p>
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
            <p className="text-sm text-grey-80 whitespace-nowrap">+91 - </p>
            <input
              type="number"
              name="contactNumber"
              className="grow shrink basis-0 self-stretch outline-none disabled:bg-grey-10 disabled:opacity-50"
              value={contactNumber ?? ""}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder=""
            />
          </div>
          {error?.contactNumber && (
            <p className="text-red-500 text-sm">{error.contactNumber}</p>
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
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          {error?.address && (
            <p className="text-red-500 text-sm">{error.address}</p>
          )}
        </div>
      </div>

      <UserLookupStatusBanner
        status={lookup.status}
        match={lookup.match}
        error={lookup.error}
      />

      {/* Existing account: show the name, don't let this form redefine it. */}
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
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            {error?.firstName && (
              <p className="text-red-500 text-sm">{error.firstName}</p>
            )}
          </div>
          <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
            <label className="text-grey-80 text-base leading-normal">
              Team Lead Last Name <span className="text-red-500">*</span>
            </label>
            <input
              name="lastName"
              className="w-full h-10 self-stretch grow shrink basis-0 px-3 py-2 justify-start items-center rounded border border-grey-40 flex outline-none bg-white disabled:bg-grey-10 disabled:opacity-50"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            {error?.lastName && (
              <p className="text-red-500 text-sm">{error.lastName}</p>
            )}
          </div>
        </div>
      )}
      <Checkbox
        id={"primary" + index}
        label={"Admin"}
        className="bg-grey-0"
        name="isProjectViewer"
        onChange={handlePrimaryChange}
        checked={defaultData?.isProjectViewer ?? false}
      />
      {showRemove && (
        <div
          className="absolute top-0 right-2 w-6 h-6 cursor-pointer"
          onClick={handleRemove}
        >
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
      )}
    </fieldset>
  );
};

export default function CreateProject({
  isOpen,
  onClose,
  workspaceId,
}: {
  isOpen: boolean;
  onClose: () => void;
  // 4.5: when set, scopes the created project to this workspace (the
  // "create new project" entry point on the workspace-admin screen).
  workspaceId?: string;
}) {
  const router = useRouter();
  const setProjects = useSetAtom(projectsAtom);
  const [projectCode, setProjectCode] = useState<string>("");
  const [formData, setFormData] = useState<FormValues>({
    name: "",
    diseases: [],
    surveillanceTypes: [],
    teams: [],
  });
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [surveillanceTypes, setSurveillanceTypes] = useState<
    SurveillanceType[]
  >([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [states, setStates] = useState<Region[]>([]);
  const [selectedStates, setSelectedStates] = useState<SelectOption[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<SelectOption[]>(
    [],
  );
  const [teamCount, setTeamCount] = useState<number>(0);
  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    diseases: "",
    surveillanceTypes: "",
    regions: "",
    teams: [],
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setProjectCode(generateRandomCode(5));
      setTeamCount(1);

      fetchDisease()
        .then((response) => {
          if (response.success) {
            setDiseases(response.data);
          }
        })
        .catch((e) => console.error("Error fetching diseases", e));
      fetchSurveillanceTypes()
        .then((response) => {
          if (response.success) {
            setSurveillanceTypes(response.data);
          }
        })
        .catch((e) => console.error("Error fetching surveillance-types", e));
      fetchRegions({ type: "state" })
        .then((response) => {
          if (response.success) {
            setStates(response.data);
          }
        })
        .catch((e) => console.error("Error fetching regions", e));
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedStates.length > 0) {
      Promise.all(
        selectedStates.map((state: { value: string }) =>
          fetchRegionsByRegionId(state.value),
        ),
      )
        .then((responses) => {
          const allDistricts = responses
            .filter((res: { success: boolean }) => res.success)
            .flatMap(
              (res: { data: { subRegions: Region[] } }) => res.data.subRegions,
            );
          setRegions(allDistricts);

          setSelectedLocations((prev: { value: string; label: string }[]) =>
            prev.filter((loc) =>
              allDistricts.some((d: Region) => d.id === loc.value),
            ),
          );
        })
        .catch((e) => console.error("Error fetching regions", e));
    } else {
      setRegions([]);
      setSelectedLocations([]);
    }
  }, [selectedStates]);

  const handleClose = () => {
    onClose();
    setFormData({
      name: "",
      diseases: [],
      surveillanceTypes: [],
      teams: [],
    });
    setErrors({
      name: "",
      diseases: "",
      surveillanceTypes: "",
      regions: "",
      teams: [],
    });
    setTeamCount(0);
    setSelectedStates([]);
    setSelectedLocations([]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDiseaseClick = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      diseases: prev.diseases.includes(id)
        ? prev.diseases.filter((diseaseId) => diseaseId !== id)
        : [...prev.diseases, id],
    }));
    setErrors((prev) => ({ ...prev, diseases: "" }));
  };

  const handleSurveillanceTypeClick = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      surveillanceTypes: prev.surveillanceTypes.includes(id)
        ? prev.surveillanceTypes.filter(
            (surveillanceTypeId) => surveillanceTypeId !== id,
          )
        : [...prev.surveillanceTypes, id],
    }));
    setErrors((prev) => ({ ...prev, surveillanceTypes: "" }));
  };

  const handleLocationSelect = (selectedOptions: unknown) => {
    const options = selectedOptions as { value: string; label: string }[];
    // Check if "Select All" was clicked
    if (options?.some((o) => o.value === SELECT_ALL_OPTION.value)) {
      setSelectedLocations(
        regions.map((region) => ({ value: region.id, label: region.name })),
      );
    } else {
      setSelectedLocations(options ?? []);
    }
    setErrors((prev) => ({ ...prev, regions: "" }));
  };

  const handleStateSelect = (selectedOptions: unknown) => {
    const options = selectedOptions as { value: string; label: string }[];
    // Check if "Select All" was clicked
    if (options?.some((o) => o.value === SELECT_ALL_OPTION.value)) {
      setSelectedStates(
        states.map((state: Region) => ({ value: state.id, label: state.name })),
      );
    } else {
      setSelectedStates(options ?? []);
    }
    setErrors((prev) => ({ ...prev, regions: "" }));
  };

  const handleTeamDataChange = (index: number) => (data: TeamData) => {
    setFormData((prev) => {
      const updatedTeamData = [...prev.teams];
      if (updatedTeamData[index]) {
        updatedTeamData[index] = { ...updatedTeamData[index], ...data };
      } else {
        updatedTeamData[index] = {
          ...data,
        } as (typeof updatedTeamData)[number];
      }
      return { ...prev, teams: updatedTeamData };
    });
  };

  const handlePrimaryChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => {
        const updatedTeamData = [...prev.teams];
        updatedTeamData[index] = {
          ...updatedTeamData[index],
          [e.target.name as keyof TeamData]: e.target.checked,
        };
        return { ...prev, teams: updatedTeamData };
      });
    };

  const handleRemoveItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      teams: prev?.teams?.filter((prev, i) => i !== index),
    }));
    setErrors((prev) => ({
      ...prev,
      teams: prev.teams?.filter((prev, i) => i !== index),
    }));
    setTeamCount((prev) => prev - 1);
  };

  const validate = () => {
    const teamErrors = formData.teams.map((fData) => {
      const teamError: TeamData = {
        teamName: "",
        email: "",
        firstName: "",
        lastName: "",
        address: "",
        contactNumber: "",
      };

      if (!fData.teamName?.trim())
        teamError.teamName = "Team name is required.";
      // An existing team lead brings their own name; only demand one when
      // this form is creating the account.
      if (!fData.matchedUserId) {
        if (!fData.firstName?.trim())
          teamError.firstName = "Team lead first name is required.";
        if (!fData.lastName?.trim())
          teamError.lastName = "Team lead last name is required.";
      }
      if (!fData.email?.trim())
        teamError.email = "Team lead email is required.";
      else if (!isValidEmail(fData.email))
        teamError.email = "Invalid email address.";
      if (fData.contactNumber?.trim() && !/^\d{10}$/.test(fData.contactNumber))
        teamError.contactNumber = "Enter a valid 10-digit Phone Number.";

      return teamError;
    });
    const newErrors: typeof errors = {
      name: "",
      diseases: "",
      surveillanceTypes: "",
      regions: "",
      teams: teamErrors,
    };
    if (!formData.name) newErrors.name = "Project name is required";
    else if (formData.name.length < 3)
      newErrors.name = "Project name must be at least 3 characters long";

    if (formData.diseases?.length < 1)
      newErrors.diseases = "Select minimum 1 disease";
    if (formData.surveillanceTypes?.length < 1)
      newErrors.surveillanceTypes = "Select minimum 1 surveillance-types";
    if (selectedStates.length < 1)
      newErrors.regions = "Select at least one state";
    else if (selectedLocations?.length < 1)
      newErrors.regions = "Select minimum 1 district";

    if (formData.teams.every((t) => !t.isProjectViewer))
      newErrors.generic = "Select any 1 team as primary";

    setErrors({ ...newErrors, teams: teamErrors });
    return Object.values(newErrors).every((error) =>
      Array.isArray(error)
        ? error.every((newError) => {
            return Object.values(newError).every((error) => !error);
          })
        : !error,
    );
  };

  const handleSubmit = async () => {
    if (validate()) {
      try {
        setIsSubmitting(true);
        const teamsData = formData.teams.map((team) => {
          // `matchedUserId` is a UI-only marker (see TeamData) and the name is
          // the existing account's, not this form's - drop both rather than
          // sending values the server is going to ignore anyway.
          const { matchedUserId, ...t } = team;
          if (!t.contactNumber) delete t.contactNumber;
          if (matchedUserId) {
            delete (t as Partial<TeamData>).firstName;
            delete (t as Partial<TeamData>).lastName;
          }
          return t;
        });
        const { success, message, data } = await createProjectApi({
          ...formData,
          teams: teamsData,
          regions: [
            ...selectedLocations.map((l) => l.value),
            ...selectedStates.map((s: { value: string }) => s.value),
          ].filter(Boolean),
          code: projectCode,
          ...(workspaceId ? { workspaceId } : {}),
        });
        if (success) {
          setProjects((projects) => [data, ...projects]);
          toast.success("Project created successfully!");
          handleClose();
          router.push(`/projects/${data.id}`);
        } else {
          const errorMsg =
            message || "Error creating project. Please try again.";
          toast.error(errorMsg);
          if (
            errorMsg.toLowerCase().includes("name") &&
            errorMsg.toLowerCase().includes("already exist")
          ) {
            setErrors((prev) => ({ ...prev, name: errorMsg }));
          }
        }
      } catch (error) {
        const errorMsg =
          (error as Error)?.message ||
          "Error creating project. Please try again.";
        toast.error(errorMsg);
        if (
          errorMsg.toLowerCase().includes("name") &&
          errorMsg.toLowerCase().includes("already exist")
        ) {
          setErrors((prev) => ({ ...prev, name: errorMsg }));
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Build state options with "Select All" at the top
  const stateOptions = [
    SELECT_ALL_OPTION,
    ...states.map((state: Region) => ({ value: state.id, label: state.name })),
  ];

  // Build district options with "Select All" at the top
  const districtOptions = [
    SELECT_ALL_OPTION,
    ...regions.map((region) => ({ value: region.id, label: region.name })),
  ];

  return (
    <CustomModal isOpen={isOpen}>
      <div className="w-full sm:w-[680px] py-6 bg-white rounded flex-col justify-start items-start gap-5 inline-flex">
        <div className="self-stretch px-7 justify-start items-center inline-flex">
          <h3 className="grow shrink basis-0 text-grey-80 text-xl font-semibold font-noto-serif leading-[26px]">
            Create New Project
          </h3>
          <div
            className="p-1 justify-center items-center flex cursor-pointer"
            onClick={handleClose}
          >
            <div className="w-5 h-5 relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M10.0006 8.82227L14.1256 4.69727L15.3039 5.8756L11.1789 10.0006L15.3039 14.1256L14.1256 15.3039L10.0006 11.1789L5.8756 15.3039L4.69727 14.1256L8.82227 10.0006L4.69727 5.8756L5.8756 4.69727L10.0006 8.82227Z"
                  fill="#284DB6"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="w-full h-px bg-grey-20" />
        <div className="max-h-[500px] self-stretch px-6 flex-col justify-start items-start gap-6 flex overflow-y-auto">
          <div className="self-stretch justify-start items-start gap-4 sm:gap-8 inline-flex flex-col sm:flex-row">
            <div className="self-stretch grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
              <label
                htmlFor="name"
                className="text-grey-80 text-base leading-normal"
              >
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                type="text"
                className="self-stretch h-10 px-3 py-2 bg-white rounded border border-grey-40 justify-start items-center gap-3 inline-flex"
                onChange={handleChange}
                value={formData.name}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>
            <div className="w-44 flex-col justify-start items-start gap-2 inline-flex">
              <label className="text-grey-80 text-base leading-normal">
                Project Code <span className="text-red-500">*</span>
              </label>
              <input
                className="self-stretch h-10 px-3 py-2 disabled:bg-grey-10 rounded border border-grey-40 justify-start items-center gap-3 inline-flex text-grey-80 text-sm leading-[21px]"
                value={projectCode}
                disabled
              />
            </div>
          </div>
          <div className="self-stretch flex-col justify-start items-start gap-4 flex">
            <div className="self-stretch flex-col justify-start items-start gap-4 flex">
              <p className="text-grey-80 text-base leading-normal">
                Applicable Diseases <span className="text-red-500">*</span>
              </p>
              <div className="self-stretch justify-start items-center gap-2 inline-flex flex-wrap">
                {diseases.map((disease) => {
                  const selected =
                    disease?.id && formData.diseases?.includes(disease.id);
                  return (
                    <div
                      key={disease.id}
                      className={`h-8 px-2 py-1 ${
                        selected ? "bg-blue-10" : "bg-white"
                      } rounded-[999px] border ${
                        selected ? "border-blue-30" : "border-grey-20"
                      }  justify-center items-center gap-1 flex cursor-pointer`}
                      onClick={() =>
                        disease?.id && handleDiseaseClick(disease.id)
                      }
                    >
                      <p className="text-grey-80 text-xs leading-[18px]">
                        {disease.name}
                      </p>
                      {selected && (
                        <div className="p-1 rounded-[999px] justify-center items-center gap-2 flex overflow-hidden">
                          <div className="w-4 h-4 relative  overflow-hidden">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                            >
                              <path
                                d="M8.00048 7.05781L11.3005 3.75781L12.2431 4.70048L8.94315 8.00048L12.2431 11.3005L11.3005 12.2431L8.00048 8.94315L4.70048 12.2431L3.75781 11.3005L7.05781 8.00048L3.75781 4.70048L4.70048 3.75781L8.00048 7.05781Z"
                                fill="#284DB6"
                              />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {errors.diseases && (
                <p className="text-red-500 text-sm">{errors.diseases}</p>
              )}
            </div>
            <div className="self-stretch flex-col justify-start items-start gap-4 flex">
              <p className="text-grey-80 text-base leading-normal">
                Surveillance Type <span className="text-red-500">*</span>
              </p>
              <div className="self-stretch justify-start items-center gap-2 inline-flex">
                {surveillanceTypes.map((surveillanceType) => {
                  const selected =
                    surveillanceType?.id &&
                    formData.surveillanceTypes?.includes(surveillanceType.id);
                  return (
                    <div
                      key={surveillanceType.id}
                      className={`h-8 px-2 py-1 ${
                        selected ? "bg-blue-10" : "bg-white"
                      } rounded-[999px] border ${
                        selected ? "border-blue-30" : "border-grey-20"
                      }  justify-center items-center gap-1 flex cursor-pointer`}
                      onClick={() =>
                        surveillanceType?.id &&
                        handleSurveillanceTypeClick(surveillanceType.id)
                      }
                    >
                      <p className="text-grey-80 text-xs leading-[18px]">
                        {surveillanceType.name}
                      </p>
                      {selected && (
                        <div className="p-1 rounded-[999px] justify-center items-center gap-2 flex overflow-hidden">
                          <div className="w-4 h-4 relative  overflow-hidden">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                            >
                              <path
                                d="M8.00048 7.05781L11.3005 3.75781L12.2431 4.70048L8.94315 8.00048L12.2431 11.3005L11.3005 12.2431L8.00048 8.94315L4.70048 12.2431L3.75781 11.3005L7.05781 8.00048L3.75781 4.70048L4.70048 3.75781L8.00048 7.05781Z"
                                fill="#284DB6"
                              />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {errors.surveillanceTypes && (
                <p className="text-red-500 text-sm">
                  {errors.surveillanceTypes}
                </p>
              )}
            </div>

            {/* State Selection */}
            <div className="self-stretch flex-col justify-start items-start gap-2 flex">
              <p className="text-grey-80 text-base leading-normal">
                State <span className="text-red-500">*</span>
              </p>
              <div className="w-full self-stretch">
                <Select<SelectOption, true>
                  className="w-full"
                  classNames={{
                    control: () => "!border-grey-40",
                    indicatorSeparator: () => "hidden",
                    option: (state) =>
                      state.data.value === SELECT_ALL_OPTION.value
                        ? "!font-semibold !text-blue-40 !border-b !border-grey-20"
                        : "",
                  }}
                  options={stateOptions}
                  onChange={handleStateSelect}
                  value={selectedStates}
                  isClearable={false}
                  isMulti
                />
              </div>
            </div>

            {/* Active Locations (Districts) Selection */}
            <div className="self-stretch flex-col justify-start items-start gap-2 flex">
              <p className="text-grey-80 text-base leading-normal">
                Active Locations (Districts){" "}
                <span className="text-red-500">*</span>
              </p>
              <div className="w-full self-stretch">
                <Select<SelectOption, true>
                  className="w-full"
                  classNames={{
                    control: () => "!border-grey-40",
                    indicatorSeparator: () => "hidden",
                    option: (state) =>
                      state.data.value === SELECT_ALL_OPTION.value
                        ? "!font-semibold !text-blue-40 !border-b !border-grey-20"
                        : "",
                  }}
                  options={districtOptions}
                  onChange={handleLocationSelect}
                  value={selectedLocations}
                  isClearable={false}
                  isMulti
                />
              </div>
              {errors.regions && (
                <p className="text-red-500 text-sm">{errors.regions}</p>
              )}
            </div>
          </div>

          {teamCount > 0
            ? Array(teamCount)
                .fill("")
                .map((_, i) => (
                  <AddTeam
                    key={i}
                    index={i}
                    onChange={handleTeamDataChange(i)}
                    handlePrimaryChange={handlePrimaryChange(i)}
                    error={errors.teams[i]}
                    handleRemove={() => handleRemoveItem(i)}
                    showRemove={i > 0 && i === teamCount - 1}
                    defaultData={formData.teams[i]}
                  />
                ))
            : ""}
          <div>
            <button
              className="h-10 px-3 py-2 bg-blue-10 rounded-lg justify-center items-center gap-2 inline-flex overflow-hidden text-blue-40 text-sm font-medium leading-[21px]"
              onClick={() => setTeamCount((prev) => prev + 1)}
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
              Add new team
            </button>
          </div>
          {errors.generic && (
            <p className="text-red-500 text-sm">{errors.generic}</p>
          )}
        </div>
        <div className="w-full h-px bg-grey-20" />
        <div className="self-stretch px-6 justify-between items-center inline-flex">
          <button
            className="grow shrink basis-0 h-12 p-3 bg-blue-40 disabled:bg-grey-50 rounded-lg justify-center items-center gap-2 flex text-white text-base leading-normal"
            onClick={handleSubmit}
            // A2: workspaceId is becoming required on POST /projects. Block
            // submission here too (defense-in-depth alongside the callers
            // disabling the affordance that opens this modal) rather than
            // firing a request the backend will now 400.
            disabled={isSubmitting || !workspaceId}
            title={
              !workspaceId
                ? "Select a workspace before creating a project."
                : undefined
            }
          >
            {isSubmitting ? <Spinner darkMode /> : "Create Project"}
          </button>
        </div>
      </div>
    </CustomModal>
  );
}
