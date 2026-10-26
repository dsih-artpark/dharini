import CustomModal from "@/src/components/ui/custom-modal";

export default function AddTeamMembers({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <CustomModal isOpen={isOpen}>
      <div className="w-[680px] py-6 bg-white rounded flex-col justify-start items-start gap-5 inline-flex overflow-hidden">
        <div className="self-stretch px-7 justify-start items-center gap-9 inline-flex">
          <div className="grow shrink basis-0 h-7 justify-start items-center gap-2 flex">
            <div className="grow shrink basis-0 text-grey-80 text-xl font-semibold font-noto-serif leading-relaxed">
              Add Members
            </div>
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
        <div className="h-px relative">
          <div className="w-[680px] h-px left-0 top-0 absolute bg-grey-20" />
        </div>
        <div className="self-stretch h-[200px] px-6 flex-col justify-start items-start gap-10 flex">
          <div className="self-stretch h-[66px] flex-col justify-start items-start gap-3 flex">
            <div className="self-stretch h-[66px] px-4 py-3 bg-grey-10 border border-grey-20 flex-col justify-center items-start gap-2 flex">
              <div className="self-stretch justify-start items-start gap-2 inline-flex">
                <div className="grow shrink basis-0 h-[42px] justify-start items-start gap-2 flex">
                  <div className="w-4 h-4 relative overflow-hidden">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="17"
                      viewBox="0 0 16 17"
                      fill="none"
                    >
                      <path
                        d="M8.00004 15.1654C4.31804 15.1654 1.33337 12.1807 1.33337 8.4987C1.33337 4.8167 4.31804 1.83203 8.00004 1.83203C11.682 1.83203 14.6667 4.8167 14.6667 8.4987C14.6667 12.1807 11.682 15.1654 8.00004 15.1654ZM8.00004 13.832C9.41453 13.832 10.7711 13.2701 11.7713 12.2699C12.7715 11.2697 13.3334 9.91319 13.3334 8.4987C13.3334 7.08421 12.7715 5.72766 11.7713 4.72746C10.7711 3.72727 9.41453 3.16536 8.00004 3.16536C6.58555 3.16536 5.229 3.72727 4.2288 4.72746C3.22861 5.72766 2.66671 7.08421 2.66671 8.4987C2.66671 9.91319 3.22861 11.2697 4.2288 12.2699C5.229 13.2701 6.58555 13.832 8.00004 13.832ZM7.33337 5.16536H8.66671V6.4987H7.33337V5.16536ZM7.33337 7.83203H8.66671V11.832H7.33337V7.83203Z"
                        fill="#11181C"
                      />
                    </svg>
                  </div>
                  <p className="grow shrink basis-0 self-stretch text-grey-80 text-sm font-['Geist'] leading-[21px]">
                    If you have a longer list of people to add, upload the list
                    of emails to invite. <br />
                    Accepted file formats: xls, csv
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="self-stretch flex-col justify-end items-start gap-3 flex">
            <div className="self-stretch justify-between items-center inline-flex">
              <p className="text-grey-80 text-base font-semibold font-noto-serif leading-tight">
                Team Members
              </p>
              <button className="py-1 rounded-lg justify-start items-center gap-2 flex overflow-hidden text-blue-40 text-sm font-medium font-['Geist'] leading-[21px]">
                <div className="w-4 h-4 relative overflow-hidden">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M14 2H2.00004C1.63185 2 1.33337 2.29848 1.33337 2.66667V13.3333C1.33337 13.7015 1.63185 14 2.00004 14H14C14.3682 14 14.6667 13.7015 14.6667 13.3333V2.66667C14.6667 2.29848 14.3682 2 14 2ZM8.00004 10.6667C6.89544 10.6667 6.00004 9.77127 6.00004 8.66667H2.66671V3.33333H13.3334V8.66667H10C10 9.77127 9.10464 10.6667 8.00004 10.6667ZM10.6667 6H8.66671V4H7.33337V6H5.33337L8.00004 9L10.6667 6Z"
                      fill="#284DB6"
                    />
                  </svg>
                </div>
                Import List
              </button>
            </div>
            <div className="h-px relative border-t border-grey-20"></div>
            <div className="self-stretch justify-start items-end gap-5 inline-flex">
              <div className="grow shrink basis-0 self-stretch h-10 px-3 py-2 bg-white rounded border border-grey-40 justify-start items-center gap-3 inline-flex">
                <input
                  className="grow shrink basis-0 h-[21px] justify-start items-center gap-1 flex grow shrink basis-0 text-grey-70 placeholder:text-grey-70 text-sm font-['Geist'] leading-[21px] outline-none"
                  placeholder="Enter email id"
                />
              </div>
              <button className="px-3 py-2 bg-blue-10 rounded-lg justify-center items-center flex overflow-hidden text-blue-40 text-sm font-medium font-['Geist'] leading-[21px]">
                Email Invite
              </button>
            </div>
          </div>
        </div>
        <div className="h-px relative">
          <div className="w-[680px] h-px left-0 top-0 absolute bg-grey-20" />
        </div>
        <div className="self-stretch px-7 justify-end items-center inline-flex">
          <div className="justify-start items-center flex">
            <button className="p-3 bg-blue-40 rounded-lg justify-center items-center gap-2 flex overflow-hidden text-white text-base font-medium font-['Geist'] leading-normal">
              Proceed
            </button>
          </div>
        </div>
      </div>
    </CustomModal>
  );
}
