import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const Select = dynamic(() => import("react-select"), {
  ssr: false,
});
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useAtom } from "jotai";
import {
  fetchDisease,
  fetchSurveillanceTypes,
  fetchRegions,
} from "@/src/app/(dashboard)/project-onboarding/loader";
import type { Disease, Region, SurveillanceType } from "@/src/types/global";
import { updateProject } from "@/src/app/(dashboard)/project-onboarding/actions";
import { projectAtom } from "@/src/store/projectAtom";

type AddProjectDetailsProps = {
  onClose: () => void;
  handleStepComplete: (completedStep: number, forceExit: boolean) => void;
  goToPastStep: () => void;
};

export default function AddProjectDetails({
  onClose,
  handleStepComplete,
  goToPastStep,
}: AddProjectDetailsProps) {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useAtom(projectAtom);

  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [surveillanceTypes, setSurveillanceTypes] = useState<
    SurveillanceType[]
  >([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]);
  const [selectedSurveillanceTypes, setSelectedSurveillanceTypes] = useState<
    string[]
  >([]);
  const [selectedLocations, setSelectedLocations] = useState<
    { value: string; label: string }[]
  >([]);
  const [errors, setErrors] = useState({
    diseases: "",
    surveillanceTypes: "",
    regions: "",
  });

  useEffect(() => {
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
    fetchRegions()
      .then((response) => {
        if (response.success) {
          setRegions(response.data);
        }
      })
      .catch((e) => console.error("Error fetching regions", e));
  }, []);

  useEffect(() => {
    if (project) {
      setSelectedDiseases(project?.diseases?.map((d) => d.id));
      setSelectedSurveillanceTypes(project.surveillanceTypes.map((s) => s.id));
      setSelectedLocations(
        project.regions.map((l) => ({ value: l.id, label: l.name })),
      );
    }
  }, [project?.id]);

  const handleDiseaseClick = (id: string) => {
    setSelectedDiseases((prev) =>
      prev.includes(id)
        ? prev.filter((diseaseId) => diseaseId !== id)
        : [...prev, id],
    );
    setErrors((prev) => ({ ...prev, diseases: "" }));
  };

  const handleSurveillanceTypeClick = (id: string) => {
    setSelectedSurveillanceTypes((prev) =>
      prev.includes(id)
        ? prev.filter((SurveillanceTypeId) => SurveillanceTypeId !== id)
        : [...prev, id],
    );
    setErrors((prev) => ({ ...prev, surveillanceTypes: "" }));
  };

  const handleLocationSelect = (selectedOptions: unknown) => {
    setSelectedLocations(
      selectedOptions as {
        value: string;
        label: string;
      }[],
    );
    setErrors((prev) => ({ ...prev, regions: "" }));
  };

  const validate = () => {
    const newErrors: typeof errors = {
      diseases: "",
      surveillanceTypes: "",
      regions: "",
    };

    if (selectedDiseases?.length < 1)
      newErrors.diseases = "Select minimum 1 disease";
    if (selectedSurveillanceTypes?.length < 1)
      newErrors.surveillanceTypes = "Select minimum 1 surveillance-types";
    if (selectedLocations?.length < 1)
      newErrors.regions = "Select minimum 1 region";

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async (forceExit: boolean) => {
    if (validate()) {
      try {
        if (projectId) {
          const { success, data } = await updateProject(projectId, {
            diseases: selectedDiseases,
            surveillanceTypes: selectedSurveillanceTypes,
            regions: selectedLocations.map((l) => l.value),
          });
          if (success) {
            setProject((p) => ({ ...p, ...data }));
            handleStepComplete(2, forceExit);
          }
        }
      } catch (error) {
        toast.error(
          (error as Error)?.message ||
            "Error updating project. Please try again.",
        );
      }
    }
  };

  return (
    <div className="w-[680px] pt-6 bg-white rounded flex-col justify-start items-start gap-6 inline-flex overflow-hidden">
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
            Add Project Details
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
      <div className="self-stretch px-6 py-1 flex-col justify-start items-start gap-6 flex">
        <div className="self-stretch flex-col justify-start items-start gap-4 flex">
          <p className="text-grey-80 text-base leading-normal font-semibold">
            Applicable Diseases
          </p>
          <div className="self-stretch justify-start items-center gap-2 inline-flex">
            {diseases.map((disease) => {
              const selected =
                disease?.id && selectedDiseases.includes(disease.id);
              return (
                <div
                  key={disease.id}
                  className={`h-8 px-2 py-1 ${
                    selected ? "bg-blue-10" : "bg-white"
                  } rounded-[999px] border ${
                    selected ? "border-blue-30" : "border-grey-20"
                  }  justify-center items-center gap-1 flex cursor-pointer`}
                  onClick={() => disease?.id && handleDiseaseClick(disease.id)}
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
          <p className="text-grey-80 text-base leading-normal font-semibold">
            Surveillance Type
          </p>
          <div className="self-stretch justify-start items-center gap-2 inline-flex">
            {surveillanceTypes.map((surveillanceType) => {
              const selected =
                surveillanceType?.id &&
                selectedSurveillanceTypes.includes(surveillanceType.id);
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
            <p className="text-red-500 text-sm">{errors.surveillanceTypes}</p>
          )}
        </div>
        <div className="self-stretch flex-col justify-start items-start gap-2 flex">
          <div className="self-stretch justify-start items-center gap-1 inline-flex">
            <p className="text-grey-80 text-base leading-normal font-semibold">
              Active Locations
            </p>
            <div className="w-3 h-3 relative  overflow-hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M6 11C3.2385 11 1 8.7615 1 6C1 3.2385 3.2385 1 6 1C8.7615 1 11 3.2385 11 6C11 8.7615 8.7615 11 6 11ZM6 10C7.06087 10 8.07828 9.57857 8.82843 8.82843C9.57857 8.07828 10 7.06087 10 6C10 4.93913 9.57857 3.92172 8.82843 3.17157C8.07828 2.42143 7.06087 2 6 2C4.93913 2 3.92172 2.42143 3.17157 3.17157C2.42143 3.92172 2 4.93913 2 6C2 7.06087 2.42143 8.07828 3.17157 8.82843C3.92172 9.57857 4.93913 10 6 10ZM5.5 3.5H6.5V4.5H5.5V3.5ZM5.5 5.5H6.5V8.5H5.5V5.5Z"
                  fill="#11181C"
                />
              </svg>
            </div>
          </div>
          <div className="self-stretch justify-start items-center gap-2 inline-flex flex-wrap">
            <div className="w-full self-stretch">
              <Select
                className="w-full"
                classNames={{
                  control: () => "!border-grey-40",
                  indicatorSeparator: () => "hidden",
                }}
                styles={{
                  menuList: (provided) => ({
                    ...provided,
                    maxHeight: "110px",
                    overflowY: "auto",
                  }),
                }}
                options={regions.map((region) => ({
                  value: region.id,
                  label: region.name,
                }))}
                onChange={handleLocationSelect}
                value={selectedLocations}
                isClearable={false}
                isMulti
              />
            </div>
          </div>
          {errors.regions && (
            <p className="text-red-500 text-sm">{errors.regions}</p>
          )}
          {/* <div className="self-stretch pl-2 pr-3 py-2 bg-white rounded border border-grey-40 justify-start items-center gap-3 inline-flex">
              <div className="grow shrink basis-0 h-8 justify-start items-center gap-1 flex">
                <div className="pl-4 pr-2 py-1 bg-blue-10 rounded-[999px] border border-blue-30 justify-start items-center gap-1 flex">
                  <p className="text-grey-80 text-xs leading-[18px]">
                    Hyderabad
                  </p>
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
                </div>
                <div className="pl-4 pr-2 py-1 bg-blue-10 rounded-[999px] border border-blue-30 justify-start items-center gap-1 flex">
                  <p className="text-grey-80 text-xs leading-[18px]">
                    Secunderabad
                  </p>
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
                </div>
                <div className="px-2 py-1 bg-blue-10 rounded-[999px] border border-grey-20 justify-start items-center gap-1 flex">
                  <p className="text-grey-80 text-xs leading-[18px]">+2</p>
                </div>
              </div>
              <div className="p-1 rounded-[999px] justify-center items-center gap-2 flex overflow-hidden">
                <div className="w-5 h-5 relative  overflow-hidden">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M9.99865 10.9766L14.1236 6.85156L15.302 8.0299L9.99865 13.3332L4.69531 8.0299L5.87365 6.85156L9.99865 10.9766Z"
                      fill="#284DB6"
                    />
                  </svg>
                </div>
              </div>
            </div> */}
        </div>
      </div>
      <div className="self-stretch px-7 pt-5 pb-6 bg-white rounded-bl-lg rounded-br-lg border-t border-grey-20 justify-between items-center inline-flex overflow-hidden">
        <p className="text-center text-grey-70 text-sm leading-[21px]">
          Step 2 of 5
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
