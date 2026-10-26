import React, { useState, useEffect, ChangeEvent } from "react";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";

import CustomModal from "@/src/components/ui/custom-modal";
import { updateTeamApi } from "@/src/app/(dashboard)/manage/actions";
// import Checkbox from "@/src/components/ui/checkbox";
import Spinner from "@/src/components/ui/spinner";
import { Team } from "@/src/types/teams";

interface FormValues {
  teamName: string;
  address: string;
  isProjectViewer?: boolean;
}
type FormErrors = Partial<FormValues>;

export default function EditTeam({
  visible,
  onClose,
  team,
  onTeamUpdated,
}: {
  visible: boolean;
  onClose: () => void;
  team?: Team;
  onTeamUpdated: (team: Team) => void;
}) {
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<FormValues>({
    teamName: "",
    address: "",
    // isProjectViewer: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (visible) {
      setFormData({
        teamName: team?.teamName ?? "",
        address: team?.address ?? "",
        // isProjectViewer: team?.isProjectViewer ?? false,
      });
      setErrors({});
    }
  }, [visible]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    if (name === "isProjectViewer") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: typeof errors = {
      teamName: "",
      address: "",
    };

    if (!formData.teamName.trim())
      newErrors.teamName = "Team Name is required.";

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async () => {
    if (validate()) {
      try {
        setIsSubmitting(true);
        if (!team?.id) {
          throw new Error("Team not found.");
        }
        const { success, message, data } = await updateTeamApi(id, team?.id, {
          ...formData,
          logo: "",
        });
        if (success) {
          onTeamUpdated({ ...data });
          toast.success("Team updated successfully!");
          onClose();
        } else {
          toast.error(message || "Error updating team. Please try again.");
        }
      } catch (error) {
        toast.error(
          (error as Error)?.message || "Error updating team. Please try again.",
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
              Update Team
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
            {/* second input */}
          </div>

          <div className="flex self-stretch gap-4 justify-start items-start flex-col sm:flex-row">
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
          {/* <Checkbox
            id={"updateIsProjectViewer"}
            label={"Admin"}
            className="bg-grey-0"
            name="isProjectViewer"
            onChange={handleChange}
            checked={formData.isProjectViewer}
          /> */}
        </div>

        <div className="self-stretch h-px border-t border-grey-20" />

        <div className="self-stretch px-7 justify-end items-center inline-flex">
          <button
            className="p-3 bg-blue-40 rounded-lg justify-center items-center gap-2 flex overflow-hidden text-white text-base font-medium leading-normal disabled:bg-grey-40"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting && <Spinner />} Save
          </button>
        </div>
      </div>
    </CustomModal>
  );
}
