import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useAtom } from "jotai";

import { updateProject } from "@/src/app/(dashboard)/project-onboarding/actions";
import { projectAtom } from "@/src/store/projectAtom";

type AddProcessDetailsProps = {
  onClose: () => void;
  handleStepComplete: (completedStep: number, forceExit: boolean) => void;
  goToPastStep: () => void;
};

export default function AddProcessDetails({
  onClose,
  handleStepComplete,
  goToPastStep,
}: AddProcessDetailsProps) {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useAtom(projectAtom);

  const [processDetail, setProcessDetail] = useState<string | null>();
  const [errors, setErrors] = useState({
    processDetail: "",
  });

  useEffect(() => {
    if (project?.processDetail) {
      setProcessDetail(project?.processDetail);
    }
  }, [project?.id]);

  const validate = () => {
    const newErrors: typeof errors = {
      processDetail: "",
    };
    if (!processDetail) newErrors.processDetail = "Select any one option";

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async (forceExit: boolean) => {
    if (validate()) {
      try {
        if (projectId && processDetail) {
          const { success, data } = await updateProject(projectId, {
            processDetail,
          });
          if (success) {
            setProject((p) => ({ ...p, ...data }));
            handleStepComplete(5, forceExit);
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
            Add Process Details
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

      <div className="self-stretch px-6 py-1 flex-col justify-start items-start gap-6 inline-flex">
        <div className="self-stretch h-32 flex-col justify-start items-start gap-4 flex">
          <div className="text-grey-80 text-base leading-normal">
            Which entity is primarily responsible for adding metadata to
            samples?
          </div>
          <div className="self-stretch px-0.5 rounded flex-col justify-start items-start gap-2 flex overflow-hidden">
            <div className="self-stretch px-3 py-2 bg-blue-10 rounded justify-start items-center gap-2 inline-flex">
              <input
                type="radio"
                id="Collectors"
                className="relative peer shrink-0 appearance-none bg-white border border-grey-60 rounded-lg accent-blue-40 checked:border-blue-800 checked:border-[5px] w-4 h-4 cursor-pointer checked"
                name="process"
                value={"collector"}
                onChange={(e) => setProcessDetail(e.target.value)}
                checked={processDetail === "collector"}
              />
              <label
                htmlFor={"Collectors"}
                className="min-w-1/5 self-stretch text-grey-80 text-base leading-normal cursor-pointer"
              >
                Collectors
              </label>
            </div>
            <div className="self-stretch px-3 py-2 bg-blue-10 rounded justify-start items-center gap-2 inline-flex">
              <input
                type="radio"
                id="Laboratory"
                className="relative peer shrink-0 appearance-none bg-white border border-grey-60 rounded-lg accent-blue-40 checked:border-blue-800 checked:border-[5px] w-4 h-4 cursor-pointer checked"
                name="process"
                value={"laboratory"}
                onChange={(e) => setProcessDetail(e.target.value)}
                checked={processDetail === "laboratory"}
              />
              <label
                htmlFor={"Laboratory"}
                className="min-w-1/5 self-stretch text-grey-80 text-base leading-normal cursor-pointer"
              >
                Laboratory
              </label>
            </div>
          </div>
        </div>
        {errors.processDetail && (
          <p className="text-red-500 text-sm">{errors.processDetail}</p>
        )}
      </div>
      {/*  */}

      <div className="self-stretch px-7 pt-5 pb-6 bg-white rounded-bl-lg rounded-br-lg border-t border-grey-20 justify-between items-center inline-flex overflow-hidden">
        <p className="text-center text-grey-70 text-sm leading-[21px]">
          Step 5 of 5
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
