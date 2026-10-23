"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import ProjectInfo from "@/src/components/project-onboarding/project-info";
import AddPersonalDetails from "@/src/components/project-onboarding/add-personal-details";
import AddProjectDetails from "@/src/components/project-onboarding/add-project-details";
import AddLogisticsDetails from "@/src/components/project-onboarding/add-logistics-details";
import AddTeam from "@/src/components/project-onboarding/add-team";
import AddProcessDetails from "@/src/components/project-onboarding/add-process-details";
import UploadData from "@/src/components/project-onboarding/upload-data";
import CustomModal from "@/src/components/ui/custom-modal";
import Link from "next/link";

const TOTAL_STEPS = 6;

export default function Onboarding() {
  const { projectId } = useParams<{ projectId: string }>();
  const router = useRouter();

  const [onboardingModal, setOnboardingModal] = useState<{
    visible: boolean;
    step: number;
  }>({ visible: false, step: 1 });
  const [completedSteps, setCompletedSteps] = useState<number>(0);

  const openModal = (step: number) => {
    setOnboardingModal({ visible: true, step });
  };

  const handleStepComplete = (completedStep: number, forceExit: boolean) => {
    setCompletedSteps(completedStep);
    setOnboardingModal((prev) => ({
      ...prev,
      visible: prev.step === TOTAL_STEPS || forceExit ? false : true,
      step: completedStep + 1,
    }));
    if (completedStep === 6) {
      router.replace(`/projects/${projectId}`);
    }
  };

  const goToPastStep = () => {
    setOnboardingModal((prev) => ({
      ...prev,
      step: prev.step > 1 ? prev.step - 1 : 1,
    }));
  };

  const handleClose = () => {
    setOnboardingModal((prev) => ({ ...prev, visible: false }));
  };

  return (
    <div className="w-full self-stretch bg-blue-10 rounded-lg flex-col justify-start items-center gap-14 inline-flex">
      <ProjectInfo />
      <div className="flex-col justify-start items-center gap-10 flex mb-20">
        <h2 className="self-stretch text-grey-80 text-2xl font-semibold font-noto-serif leading-[31.20px]">
          Follow the steps below to kickstart your project
        </h2>
        <div className="self-stretch justify-start items-center gap-6 inline-flex">
          <div className="w-4 self-stretch flex-col justify-center items-center gap-0.5 inline-flex">
            {Array(TOTAL_STEPS)
              .fill("")
              .map((_, i) => {
                return (
                  <React.Fragment key={i}>
                    {i > 0 && (
                      <div className="w-px h-20 relative">
                        <div className="w-px h-20 left-0 top-0 absolute bg-grey-40" />
                      </div>
                    )}
                    <div className="justify-center items-center inline-flex">
                      {i < completedSteps ? (
                        <div className="w-5 h-5 relative bg-blue-40 rounded-full">
                          <div className="w-[7.50px] h-[7.50px] left-[6.25px] top-[6.25px] absolute bg-white rounded-full" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 relative rounded-full border border-grey-60" />
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
          </div>
          <div className="grow shrink basis-0 flex-col justify-start items-start gap-6 inline-flex">
            <div
              className="self-stretch p-4 bg-white rounded border border-grey-40 justify-start items-start gap-3 inline-flex cursor-pointer"
              onClick={() => completedSteps >= 0 && openModal(1)}
            >
              <div className="self-stretch pt-1 justify-start items-start gap-2.5 flex">
                <div
                  className={`p-3 ${
                    completedSteps >= 1 ? "bg-orange-10" : "bg-grey-10"
                  } rounded-[999px] justify-start items-center gap-2.5 flex`}
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
                        d="M16.6654 18.333H14.9987V16.6663C14.9987 16.0033 14.7353 15.3674 14.2665 14.8986C13.7976 14.4297 13.1617 14.1663 12.4987 14.1663H7.4987C6.83566 14.1663 6.19977 14.4297 5.73093 14.8986C5.26209 15.3674 4.9987 16.0033 4.9987 16.6663V18.333H3.33203V16.6663C3.33203 15.5613 3.77102 14.5015 4.55242 13.7201C5.33382 12.9387 6.39363 12.4997 7.4987 12.4997H12.4987C13.6038 12.4997 14.6636 12.9387 15.445 13.7201C16.2264 14.5015 16.6654 15.5613 16.6654 16.6663V18.333ZM9.9987 10.833C9.34209 10.833 8.69191 10.7037 8.08528 10.4524C7.47865 10.2011 6.92746 9.83283 6.46316 9.36854C5.99887 8.90425 5.63057 8.35305 5.3793 7.74642C5.12803 7.1398 4.9987 6.48962 4.9987 5.83301C4.9987 5.1764 5.12803 4.52622 5.3793 3.91959C5.63057 3.31296 5.99887 2.76177 6.46316 2.29747C6.92746 1.83318 7.47865 1.46488 8.08528 1.21361C8.69191 0.962337 9.34209 0.833008 9.9987 0.833008C11.3248 0.833008 12.5965 1.35979 13.5342 2.29747C14.4719 3.23516 14.9987 4.50693 14.9987 5.83301C14.9987 7.15909 14.4719 8.43086 13.5342 9.36854C12.5965 10.3062 11.3248 10.833 9.9987 10.833ZM9.9987 9.16634C10.8828 9.16634 11.7306 8.81515 12.3557 8.19003C12.9808 7.56491 13.332 6.71706 13.332 5.83301C13.332 4.94895 12.9808 4.10111 12.3557 3.47599C11.7306 2.85086 10.8828 2.49967 9.9987 2.49967C9.11464 2.49967 8.2668 2.85086 7.64167 3.47599C7.01655 4.10111 6.66536 4.94895 6.66536 5.83301C6.66536 6.71706 7.01655 7.56491 7.64167 8.19003C8.2668 8.81515 9.11464 9.16634 9.9987 9.16634Z"
                        fill={completedSteps >= 1 ? "#11181C" : "#B7BDC2"}
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="grow shrink basis-0 flex-col justify-start items-start gap-0.5 inline-flex">
                <p
                  className={`grow shrink basis-0 ${
                    completedSteps >= 1 ? "text-grey-80" : "text-grey-50"
                  } text-xl leading-[30px]`}
                >
                  Add personal details
                </p>
                <p
                  className={`self-stretch ${
                    completedSteps >= 1 ? "text-grey-70" : "text-grey-50"
                  } text-sm leading-[21px]`}
                >
                  Supporting text provides additional context or information.
                </p>
              </div>
              <div className="pt-0.5 w-5 h-5 relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M10.9766 9.99962L6.85156 5.87462L8.0299 4.69629L13.3332 9.99962L8.0299 15.303L6.85156 14.1246L10.9766 9.99962Z"
                    fill="#11181C"
                  />
                </svg>
              </div>
            </div>

            <div
              className="self-stretch p-4 bg-white rounded border border-grey-40 justify-start items-start gap-3 inline-flex cursor-pointer"
              onClick={() => completedSteps >= 1 && openModal(2)}
            >
              <div className="self-stretch pt-1 justify-start items-start gap-2.5 flex">
                <div
                  className={`p-3 ${
                    completedSteps >= 2 ? "bg-green-10" : "bg-grey-10"
                  } rounded-[999px] justify-start items-center gap-2.5 flex`}
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
                        d="M4.16667 15.8334H5.345L13.1067 8.07174L11.9283 6.8934L4.16667 14.6551V15.8334ZM17.5 17.5001H2.5V13.9642L13.6958 2.7684C13.8521 2.61218 14.064 2.52441 14.285 2.52441C14.506 2.52441 14.7179 2.61218 14.8742 2.7684L17.2317 5.1259C17.3879 5.28218 17.4757 5.4941 17.4757 5.71507C17.4757 5.93604 17.3879 6.14796 17.2317 6.30424L7.7025 15.8334H17.5V17.5001ZM13.1067 5.71507L14.285 6.8934L15.4633 5.71507L14.285 4.53674L13.1067 5.71507Z"
                        fill={completedSteps >= 2 ? "#11181C" : "#B7BDC2"}
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="grow shrink basis-0 flex-col justify-start items-start gap-0.5 inline-flex">
                <p
                  className={`grow shrink basis-0 ${
                    completedSteps >= 2 ? "text-grey-80" : "text-grey-50"
                  } text-xl leading-[30px]`}
                >
                  Add project details
                </p>
                <p
                  className={`self-stretch ${
                    completedSteps >= 2 ? "text-grey-70" : "text-grey-50"
                  } text-sm leading-[21px]`}
                >
                  Supporting text provides additional context or information.
                </p>
              </div>
              <div className="self-stretch pt-0.5 justify-start items-start gap-2.5 flex">
                <div className="w-5 h-5 relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M10.9766 9.99962L6.85156 5.87462L8.0299 4.69629L13.3332 9.99962L8.0299 15.303L6.85156 14.1246L10.9766 9.99962Z"
                      fill="#11181C"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div
              className="self-stretch p-4 bg-white rounded border border-grey-40 justify-start items-start gap-3 inline-flex cursor-pointer"
              onClick={() => completedSteps >= 2 && openModal(3)}
            >
              <div className="self-stretch pt-1 justify-start items-start gap-2.5 flex">
                <div
                  className={`p-3 ${
                    completedSteps >= 3 ? "bg-purple-10" : "bg-grey-10"
                  } rounded-[999px] justify-start items-center gap-2.5 flex`}
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
                        d="M4.16667 15.8334H5.345L13.1067 8.07174L11.9283 6.8934L4.16667 14.6551V15.8334ZM17.5 17.5001H2.5V13.9642L13.6958 2.7684C13.8521 2.61218 14.064 2.52441 14.285 2.52441C14.506 2.52441 14.7179 2.61218 14.8742 2.7684L17.2317 5.1259C17.3879 5.28218 17.4757 5.4941 17.4757 5.71507C17.4757 5.93604 17.3879 6.14796 17.2317 6.30424L7.7025 15.8334H17.5V17.5001ZM13.1067 5.71507L14.285 6.8934L15.4633 5.71507L14.285 4.53674L13.1067 5.71507Z"
                        fill={completedSteps >= 3 ? "#11181C" : "#B7BDC2"}
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="grow shrink basis-0 flex-col justify-start items-start gap-0.5 inline-flex">
                <p
                  className={`grow shrink basis-0 ${
                    completedSteps >= 3 ? "text-grey-80" : "text-grey-50"
                  } text-xl leading-[30px]`}
                >
                  Add logistics details
                </p>
                <p
                  className={`self-stretch ${
                    completedSteps >= 3 ? "text-grey-70" : "text-grey-50"
                  } text-sm leading-[21px]`}
                >
                  Supporting text provides additional context or information.
                </p>
              </div>
              <div className="self-stretch pt-0.5 justify-start items-start gap-2.5 flex">
                <div className="w-5 h-5 relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M10.9766 9.99962L6.85156 5.87462L8.0299 4.69629L13.3332 9.99962L8.0299 15.303L6.85156 14.1246L10.9766 9.99962Z"
                      fill="#11181C"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div
              className="self-stretch p-4 bg-white rounded border border-grey-40 justify-start items-start gap-3 inline-flex cursor-pointer"
              onClick={() => completedSteps >= 3 && openModal(4)}
            >
              <div className="self-stretch pt-1 justify-start items-start gap-2.5 flex">
                <div
                  className={`p-3 ${
                    completedSteps >= 4 ? "bg-teal-10" : "bg-grey-10"
                  } rounded-[999px] justify-start items-center gap-2.5 flex`}
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
                        d="M10.0013 9.16699C11.1064 9.16699 12.1662 9.60598 12.9476 10.3874C13.729 11.1688 14.168 12.2286 14.168 13.3337V18.3337H12.5013V13.3337C12.5013 12.696 12.2577 12.0824 11.8202 11.6184C11.3828 11.1545 10.7845 10.8752 10.148 10.8378L10.0013 10.8337C9.36363 10.8336 8.75004 11.0773 8.28609 11.5147C7.82213 11.9522 7.54288 12.5504 7.50547 13.187L7.5013 13.3337V18.3337H5.83464V13.3337C5.83464 12.2286 6.27362 11.1688 7.05502 10.3874C7.83643 9.60598 8.89623 9.16699 10.0013 9.16699ZM4.58464 11.667C4.81714 11.667 5.04297 11.6945 5.25964 11.7453C5.11716 12.1695 5.03278 12.611 5.0088 13.0578L5.0013 13.3337V13.4053C4.90551 13.3711 4.80588 13.3487 4.70464 13.3387L4.58464 13.3337C4.2739 13.3337 3.97431 13.4494 3.74429 13.6583C3.51426 13.8673 3.3703 14.1544 3.34047 14.4637L3.33464 14.5837V18.3337H1.66797V14.5837C1.66797 13.8101 1.97526 13.0682 2.52224 12.5213C3.06922 11.9743 3.81109 11.667 4.58464 11.667ZM15.418 11.667C16.1915 11.667 16.9334 11.9743 17.4804 12.5213C18.0273 13.0682 18.3346 13.8101 18.3346 14.5837V18.3337H16.668V14.5837C16.668 14.2729 16.5522 13.9733 16.3433 13.7433C16.1344 13.5133 15.8473 13.3693 15.538 13.3395L15.418 13.3337C15.2721 13.3337 15.1321 13.3587 15.0013 13.4045V13.3337C15.0013 12.7787 14.9113 12.2453 14.7438 11.747C14.9596 11.6945 15.1855 11.667 15.418 11.667ZM4.58464 6.66699C5.13717 6.66699 5.66707 6.88649 6.05777 7.27719C6.44848 7.66789 6.66797 8.19779 6.66797 8.75033C6.66797 9.30286 6.44848 9.83276 6.05777 10.2235C5.66707 10.6142 5.13717 10.8337 4.58464 10.8337C4.0321 10.8337 3.5022 10.6142 3.1115 10.2235C2.7208 9.83276 2.5013 9.30286 2.5013 8.75033C2.5013 8.19779 2.7208 7.66789 3.1115 7.27719C3.5022 6.88649 4.0321 6.66699 4.58464 6.66699ZM15.418 6.66699C15.9705 6.66699 16.5004 6.88649 16.8911 7.27719C17.2818 7.66789 17.5013 8.19779 17.5013 8.75033C17.5013 9.30286 17.2818 9.83276 16.8911 10.2235C16.5004 10.6142 15.9705 10.8337 15.418 10.8337C14.8654 10.8337 14.3355 10.6142 13.9448 10.2235C13.5541 9.83276 13.3346 9.30286 13.3346 8.75033C13.3346 8.19779 13.5541 7.66789 13.9448 7.27719C14.3355 6.88649 14.8654 6.66699 15.418 6.66699ZM4.58464 8.33366C4.47413 8.33366 4.36815 8.37756 4.29001 8.4557C4.21187 8.53384 4.16797 8.63982 4.16797 8.75033C4.16797 8.86083 4.21187 8.96681 4.29001 9.04495C4.36815 9.12309 4.47413 9.16699 4.58464 9.16699C4.69514 9.16699 4.80112 9.12309 4.87926 9.04495C4.9574 8.96681 5.0013 8.86083 5.0013 8.75033C5.0013 8.63982 4.9574 8.53384 4.87926 8.4557C4.80112 8.37756 4.69514 8.33366 4.58464 8.33366ZM15.418 8.33366C15.3075 8.33366 15.2015 8.37756 15.1233 8.4557C15.0452 8.53384 15.0013 8.63982 15.0013 8.75033C15.0013 8.86083 15.0452 8.96681 15.1233 9.04495C15.2015 9.12309 15.3075 9.16699 15.418 9.16699C15.5285 9.16699 15.6345 9.12309 15.7126 9.04495C15.7907 8.96681 15.8346 8.86083 15.8346 8.75033C15.8346 8.63982 15.7907 8.53384 15.7126 8.4557C15.6345 8.37756 15.5285 8.33366 15.418 8.33366ZM10.0013 1.66699C10.8854 1.66699 11.7332 2.01818 12.3583 2.6433C12.9834 3.26842 13.3346 4.11627 13.3346 5.00033C13.3346 5.88438 12.9834 6.73223 12.3583 7.35735C11.7332 7.98247 10.8854 8.33366 10.0013 8.33366C9.11725 8.33366 8.2694 7.98247 7.64428 7.35735C7.01916 6.73223 6.66797 5.88438 6.66797 5.00033C6.66797 4.11627 7.01916 3.26842 7.64428 2.6433C8.2694 2.01818 9.11725 1.66699 10.0013 1.66699ZM10.0013 3.33366C9.55928 3.33366 9.13535 3.50925 8.82279 3.82181C8.51023 4.13437 8.33464 4.5583 8.33464 5.00033C8.33464 5.44235 8.51023 5.86628 8.82279 6.17884C9.13535 6.4914 9.55928 6.66699 10.0013 6.66699C10.4433 6.66699 10.8673 6.4914 11.1798 6.17884C11.4924 5.86628 11.668 5.44235 11.668 5.00033C11.668 4.5583 11.4924 4.13437 11.1798 3.82181C10.8673 3.50925 10.4433 3.33366 10.0013 3.33366Z"
                        fill={completedSteps >= 4 ? "#11181C" : "#B7BDC2"}
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="grow shrink basis-0 flex-col justify-start items-start gap-0.5 inline-flex">
                <div className="self-stretch justify-center items-center gap-4 inline-flex">
                  <p
                    className={`grow shrink basis-0 ${
                      completedSteps >= 4 ? "text-grey-80" : "text-grey-50"
                    } text-xl leading-[30px]`}
                  >
                    Add your team
                  </p>
                </div>
                <p
                  className={`self-stretch ${
                    completedSteps >= 4 ? "text-grey-70" : "text-grey-50"
                  } text-sm leading-[21px]`}
                >
                  Supporting text provides additional context or information.
                </p>
              </div>
              <div className="self-stretch pt-0.5 justify-start items-start gap-2.5 flex">
                <div className="w-5 h-5 relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M10.9766 9.99962L6.85156 5.87462L8.0299 4.69629L13.3332 9.99962L8.0299 15.303L6.85156 14.1246L10.9766 9.99962Z"
                      fill="#11181C"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div
              className="self-stretch p-4 bg-white rounded border border-grey-40 justify-start items-start gap-3 inline-flex cursor-pointer"
              onClick={() => completedSteps >= 4 && openModal(5)}
            >
              <div className="self-stretch pt-1 justify-start items-start gap-2.5 flex">
                <div
                  className={`p-3 ${
                    completedSteps >= 5 ? "bg-coral-10" : "bg-grey-10"
                  } rounded-[999px] justify-start items-center gap-2.5 flex`}
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
                        d="M10.0013 9.16699C11.1064 9.16699 12.1662 9.60598 12.9476 10.3874C13.729 11.1688 14.168 12.2286 14.168 13.3337V18.3337H12.5013V13.3337C12.5013 12.696 12.2577 12.0824 11.8202 11.6184C11.3828 11.1545 10.7845 10.8752 10.148 10.8378L10.0013 10.8337C9.36363 10.8336 8.75004 11.0773 8.28609 11.5147C7.82213 11.9522 7.54288 12.5504 7.50547 13.187L7.5013 13.3337V18.3337H5.83464V13.3337C5.83464 12.2286 6.27362 11.1688 7.05502 10.3874C7.83643 9.60598 8.89623 9.16699 10.0013 9.16699ZM4.58464 11.667C4.81714 11.667 5.04297 11.6945 5.25964 11.7453C5.11716 12.1695 5.03278 12.611 5.0088 13.0578L5.0013 13.3337V13.4053C4.90551 13.3711 4.80588 13.3487 4.70464 13.3387L4.58464 13.3337C4.2739 13.3337 3.97431 13.4494 3.74429 13.6583C3.51426 13.8673 3.3703 14.1544 3.34047 14.4637L3.33464 14.5837V18.3337H1.66797V14.5837C1.66797 13.8101 1.97526 13.0682 2.52224 12.5213C3.06922 11.9743 3.81109 11.667 4.58464 11.667ZM15.418 11.667C16.1915 11.667 16.9334 11.9743 17.4804 12.5213C18.0273 13.0682 18.3346 13.8101 18.3346 14.5837V18.3337H16.668V14.5837C16.668 14.2729 16.5522 13.9733 16.3433 13.7433C16.1344 13.5133 15.8473 13.3693 15.538 13.3395L15.418 13.3337C15.2721 13.3337 15.1321 13.3587 15.0013 13.4045V13.3337C15.0013 12.7787 14.9113 12.2453 14.7438 11.747C14.9596 11.6945 15.1855 11.667 15.418 11.667ZM4.58464 6.66699C5.13717 6.66699 5.66707 6.88649 6.05777 7.27719C6.44848 7.66789 6.66797 8.19779 6.66797 8.75033C6.66797 9.30286 6.44848 9.83276 6.05777 10.2235C5.66707 10.6142 5.13717 10.8337 4.58464 10.8337C4.0321 10.8337 3.5022 10.6142 3.1115 10.2235C2.7208 9.83276 2.5013 9.30286 2.5013 8.75033C2.5013 8.19779 2.7208 7.66789 3.1115 7.27719C3.5022 6.88649 4.0321 6.66699 4.58464 6.66699ZM15.418 6.66699C15.9705 6.66699 16.5004 6.88649 16.8911 7.27719C17.2818 7.66789 17.5013 8.19779 17.5013 8.75033C17.5013 9.30286 17.2818 9.83276 16.8911 10.2235C16.5004 10.6142 15.9705 10.8337 15.418 10.8337C14.8654 10.8337 14.3355 10.6142 13.9448 10.2235C13.5541 9.83276 13.3346 9.30286 13.3346 8.75033C13.3346 8.19779 13.5541 7.66789 13.9448 7.27719C14.3355 6.88649 14.8654 6.66699 15.418 6.66699ZM4.58464 8.33366C4.47413 8.33366 4.36815 8.37756 4.29001 8.4557C4.21187 8.53384 4.16797 8.63982 4.16797 8.75033C4.16797 8.86083 4.21187 8.96681 4.29001 9.04495C4.36815 9.12309 4.47413 9.16699 4.58464 9.16699C4.69514 9.16699 4.80112 9.12309 4.87926 9.04495C4.9574 8.96681 5.0013 8.86083 5.0013 8.75033C5.0013 8.63982 4.9574 8.53384 4.87926 8.4557C4.80112 8.37756 4.69514 8.33366 4.58464 8.33366ZM15.418 8.33366C15.3075 8.33366 15.2015 8.37756 15.1233 8.4557C15.0452 8.53384 15.0013 8.63982 15.0013 8.75033C15.0013 8.86083 15.0452 8.96681 15.1233 9.04495C15.2015 9.12309 15.3075 9.16699 15.418 9.16699C15.5285 9.16699 15.6345 9.12309 15.7126 9.04495C15.7907 8.96681 15.8346 8.86083 15.8346 8.75033C15.8346 8.63982 15.7907 8.53384 15.7126 8.4557C15.6345 8.37756 15.5285 8.33366 15.418 8.33366ZM10.0013 1.66699C10.8854 1.66699 11.7332 2.01818 12.3583 2.6433C12.9834 3.26842 13.3346 4.11627 13.3346 5.00033C13.3346 5.88438 12.9834 6.73223 12.3583 7.35735C11.7332 7.98247 10.8854 8.33366 10.0013 8.33366C9.11725 8.33366 8.2694 7.98247 7.64428 7.35735C7.01916 6.73223 6.66797 5.88438 6.66797 5.00033C6.66797 4.11627 7.01916 3.26842 7.64428 2.6433C8.2694 2.01818 9.11725 1.66699 10.0013 1.66699ZM10.0013 3.33366C9.55928 3.33366 9.13535 3.50925 8.82279 3.82181C8.51023 4.13437 8.33464 4.5583 8.33464 5.00033C8.33464 5.44235 8.51023 5.86628 8.82279 6.17884C9.13535 6.4914 9.55928 6.66699 10.0013 6.66699C10.4433 6.66699 10.8673 6.4914 11.1798 6.17884C11.4924 5.86628 11.668 5.44235 11.668 5.00033C11.668 4.5583 11.4924 4.13437 11.1798 3.82181C10.8673 3.50925 10.4433 3.33366 10.0013 3.33366Z"
                        fill={completedSteps >= 5 ? "#11181C" : "#B7BDC2"}
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="grow shrink basis-0 flex-col justify-start items-start gap-0.5 inline-flex">
                <div className="self-stretch justify-center items-center gap-4 inline-flex">
                  <p
                    className={`grow shrink basis-0 ${
                      completedSteps >= 5 ? "text-grey-80" : "text-grey-50"
                    } text-xl leading-[30px]`}
                  >
                    Add process details
                  </p>
                </div>
                <p
                  className={`self-stretch ${
                    completedSteps >= 5 ? "text-grey-70" : "text-grey-50"
                  } text-sm leading-[21px]`}
                >
                  Supporting text provides additional context or information.
                </p>
              </div>
              <div className="self-stretch pt-0.5 justify-start items-start gap-2.5 flex">
                <div className="w-5 h-5 relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M10.9766 9.99962L6.85156 5.87462L8.0299 4.69629L13.3332 9.99962L8.0299 15.303L6.85156 14.1246L10.9766 9.99962Z"
                      fill="#11181C"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div
              className="self-stretch p-4 bg-white rounded border border-grey-40 justify-start items-start gap-3 inline-flex cursor-pointer"
              onClick={() => completedSteps >= 5 && openModal(6)}
            >
              <div className="self-stretch pt-1 justify-start items-start gap-2.5 flex">
                <div
                  className={`p-3 ${
                    completedSteps >= 6 ? "bg-orange-10" : "bg-grey-10"
                  } rounded-[999px] justify-start items-center gap-2.5 flex`}
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
                        d="M4.16667 15.8334H15.8333V9.16671H4.16667V15.8334ZM4.16667 7.50004H15.8333V4.16671H4.16667V7.50004ZM10.8333 12.5H9.16667V14.1667H10.8333V12.5Z"
                        fill={completedSteps >= 6 ? "#11181C" : "#B7BDC2"}
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="grow shrink basis-0 flex-col justify-start items-start gap-0.5 inline-flex">
                <p
                  className={`grow shrink basis-0 ${
                    completedSteps >= 6 ? "text-grey-80" : "text-grey-50"
                  } text-xl leading-[30px]`}
                >
                  Upload data
                </p>
                <p
                  className={`self-stretch ${
                    completedSteps >= 6 ? "text-grey-70" : "text-grey-50"
                  } text-sm leading-[21px]`}
                >
                  Migrate collection and lab data from your previous platform.
                </p>
              </div>
              <div className="self-stretch pt-0.5 justify-start items-start gap-2.5 flex">
                <div className="w-5 h-5 relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M10.9766 9.99962L6.85156 5.87462L8.0299 4.69629L13.3332 9.99962L8.0299 15.303L6.85156 14.1246L10.9766 9.99962Z"
                      fill="#11181C"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        {completedSteps === TOTAL_STEPS && (
          <Link
            href={"/manage"}
            replace={true}
            className="underline text-blue-40"
          >
            Explore projects
          </Link>
        )}
      </div>

      <CustomModal isOpen={onboardingModal.visible}>
        {onboardingModal.step === 1 && (
          <AddPersonalDetails
            onClose={handleClose}
            handleStepComplete={handleStepComplete}
          />
        )}
        {onboardingModal.step === 2 && (
          <AddProjectDetails
            onClose={handleClose}
            handleStepComplete={handleStepComplete}
            goToPastStep={goToPastStep}
          />
        )}
        {onboardingModal.step === 3 && (
          <AddLogisticsDetails
            onClose={handleClose}
            handleStepComplete={handleStepComplete}
            goToPastStep={goToPastStep}
          />
        )}
        {onboardingModal.step === 4 && (
          <AddTeam
            onClose={handleClose}
            handleStepComplete={handleStepComplete}
            goToPastStep={goToPastStep}
          />
        )}
        {onboardingModal.step === 5 && (
          <AddProcessDetails
            onClose={handleClose}
            handleStepComplete={handleStepComplete}
            goToPastStep={goToPastStep}
          />
        )}
        {onboardingModal.step === 6 && (
          <UploadData
            projectId={projectId}
            onClose={handleClose}
            handleStepComplete={handleStepComplete}
            goToPastStep={goToPastStep}
          />
        )}
      </CustomModal>
    </div>
  );
}
