import CustomModal from "@/src/components/ui/custom-modal";
import CollectionPlanForm from "@/src/components/projects/sites/create-site/collection-plan-form";

export default function UpdateCollectionPlanModal({
  isOpen,
  onClose,
  siteId,
}: {
  isOpen: boolean;
  onClose: () => void;
  siteId?: string;
}) {
  return (
    <CustomModal isOpen={isOpen}>
      <div className="w-full sm:w-[680px] overflow-hidden rounded-2xl border border-grey-20 bg-white shadow-xl flex-col justify-start items-start inline-flex">
        {/* header */}
        <div className="self-stretch px-5 py-4 sm:px-6 bg-white border-b border-grey-20 justify-between items-center inline-flex">
          <h3 className="grow shrink basis-0 text-grey-80 text-xl font-semibold font-noto-serif leading-[26px]">
            Update Collection Plans
          </h3>
          <div
            className="h-9 w-9 rounded-full border border-grey-20 bg-grey-10 justify-center items-center gap-2 flex cursor-pointer transition hover:bg-blue-10"
            onClick={onClose}
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
                  d="M9.99865 8.82227L14.1236 4.69727L15.302 5.8756L11.177 10.0006L15.302 14.1256L14.1236 15.3039L9.99865 11.1789L5.87365 15.3039L4.69531 14.1256L8.82031 10.0006L4.69531 5.8756L5.87365 4.69727L9.99865 8.82227Z"
                  fill="#284DB6"
                />
              </svg>
            </div>
          </div>
        </div>
        {isOpen && (
          <CollectionPlanForm
            className="max-h-[500px] px-5 py-5 sm:px-6 overflow-y-auto bg-white"
            onClose={onClose}
            siteId={siteId}
          />
        )}
      </div>
    </CustomModal>
  );
}
