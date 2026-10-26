import UploadDataPanel from "@/src/components/project-onboarding/upload-data-panel";

type UploadDataProps = {
  projectId: string;
  onClose: () => void;
  // Only passed when rendered as onboarding step 6; omit to render as a
  // standalone modal (e.g. from an existing project's Quick Actions).
  handleStepComplete?: (completedStep: number, forceExit: boolean) => void;
  goToPastStep?: () => void;
};

export default function UploadData({
  projectId,
  onClose,
  handleStepComplete,
  goToPastStep,
}: UploadDataProps) {
  return (
    <div className="w-[680px] pt-6 bg-white rounded flex-col justify-start items-start gap-6 inline-flex overflow-hidden">
      <div className="self-stretch px-7 justify-start items-center gap-9 inline-flex">
        <div className="grow shrink basis-0 h-7 justify-start items-center gap-2 flex">
          {goToPastStep && (
            <div
              className="p-1 rounded-[999px] justify-center items-center flex overflow-hidden cursor-pointer"
              onClick={goToPastStep}
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
                    d="M6.52203 9.16689H16.6654V10.8336H6.52203L10.992 15.3036L9.8137 16.4819L3.33203 10.0002L9.8137 3.51855L10.992 4.69689L6.52203 9.16689Z"
                    fill="#284DB6"
                  />
                </svg>
              </div>
            </div>
          )}
          <h3 className="grow shrink basis-0 text-grey-80 text-xl font-semibold font-noto-serif leading-relaxed">
            Upload Data
          </h3>
        </div>
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

      <UploadDataPanel
        projectId={projectId}
        onDone={handleStepComplete ? undefined : onClose}
      />

      <div className="self-stretch px-7 pt-5 pb-6 bg-white rounded-bl-lg rounded-br-lg border-t border-grey-20 justify-between items-center inline-flex overflow-hidden">
        {handleStepComplete ? (
          <>
            <p className="text-center text-grey-70 text-sm leading-[21px]">
              Step 6 of 6
            </p>
            <div className="justify-start items-center gap-5 flex">
              <button
                className="p-3 bg-white rounded-lg border border-blue-40 justify-center items-center gap-2 flex overflow-hidden text-blue-40 text-base leading-normal"
                onClick={() => handleStepComplete(6, true)}
              >
                Save & Exit
              </button>
              <button
                className="p-3 bg-blue-40 rounded-lg justify-center items-center gap-2 flex overflow-hidden text-white text-base leading-normal"
                onClick={() => handleStepComplete(6, false)}
              >
                Finish
              </button>
            </div>
          </>
        ) : (
          <div className="flex justify-end w-full">
            <button
              className="p-3 bg-blue-40 rounded-lg justify-center items-center gap-2 flex overflow-hidden text-white text-base leading-normal"
              onClick={onClose}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
