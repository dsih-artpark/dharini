export default function ConfigureAccess() {
  return (
    <div className="w-full self-stretch rounded border border-grey-20 flex-col justify-start items-start inline-flex overflow-hidden">
      <div className="self-stretch p-6 bg-white border-b border-grey-20 justify-start items-start inline-flex">
        <h1 className="text-grey-90 text-[32px] font-semibold font-noto-serif leading-[41.60px]">
          Configure Access Groups
        </h1>
      </div>
      <div className="self-stretch p-6 bg-white border-b border-grey-20 flex-col justify-start items-start gap-12 flex">
        <div className="self-stretch flex-col justify-start items-start gap-4 flex">
          <div className="self-stretch justify-between items-center inline-flex">
            <p className="text-grey-80 text-xl font-semibold font-noto-serif leading-relaxed">
              Organisations
            </p>
            <button className="py-1 rounded-lg justify-start items-center gap-2 flex overflow-hidden text-blue-40 text-sm leading-[21px]">
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
          <div className="self-stretch flex-col justify-start items-start flex">
            <div className="self-stretch px-4 py-2 bg-grey-10 border-b border-grey-20 justify-start items-center gap-10 inline-flex">
              <div className="w-[200px] justify-start items-center flex">
                <p className="text-grey-70 text-sm leading-[21px]">Name</p>
              </div>
              <div className="w-[250px] justify-start items-center flex">
                <p className="text-grey-70 text-sm leading-[21px]">
                  Primary Roles
                </p>
              </div>
              <div className="grow shrink basis-0 h-[21px] justify-center items-center gap-2.5 flex">
                <div className="text-grey-70 text-sm leading-[21px]">
                  Accesses & Permissions
                </div>
              </div>
              <div className="justify-start items-center gap-2.5 flex">
                <div className="text-grey-70 text-sm leading-[21px]">
                  Delete
                </div>
              </div>
            </div>
            <div className="bg-grey-10 self-stretch px-4 border-b border-grey-20 justify-start items-center gap-10 inline-flex">
              <div className="w-[200px]" />
              <div className="w-[250px]" />
              <div className="grow shrink basis-0 self-stretch py-2 justify-end items-center gap-2 inline-flex">
                <div className="grow shrink basis-0 h-[21px] justify-center items-center flex">
                  <p className="text-grey-70 text-sm leading-[21px]">
                    Collection
                  </p>
                </div>
                <div className="self-stretch w-px h-[21px] relative border-r border-grey-20" />
                <div className="grow shrink basis-0 justify-center items-center flex">
                  <p className="text-grey-70 text-sm leading-[21px]">
                    Metadata Entry
                  </p>
                </div>
                <div className="self-stretch w-px h-[21px] relative border-r border-grey-20" />
                <div className="grow shrink basis-0 justify-center items-center flex">
                  <p className="text-grey-70 text-sm leading-[21px]">Testing</p>
                </div>
                <div className="self-stretch w-px h-[21px] relative border-r border-grey-20" />
                <div className="grow shrink basis-0 justify-center items-center flex">
                  <p className="text-grey-70 text-sm leading-[21px]">
                    Sequencing
                  </p>
                </div>
                <div className="self-stretch w-px h-[21px] relative border-r border-grey-20" />
                <div className="grow shrink basis-0 justify-center items-center flex">
                  <p className="text-grey-70 text-sm leading-[21px]">
                    Monitoring
                  </p>
                </div>
              </div>
              <div className="w-11" />
            </div>
            <AccessItem />
            <AccessItem />
            <AccessItem />
            <AccessItem />
            <AccessItem />
          </div>
        </div>
      </div>
    </div>
  );
}

function AccessItem() {
  return (
    <div className="self-stretch p-4 bg-white border-b border-grey-20 justify-start items-center gap-10 inline-flex">
      <div className="w-[200px] flex-col justify-center items-start inline-flex">
        <div className="w-[200px] justify-start items-center inline-flex">
          <p className="self-stretch text-grey-80 text-base leading-normal">
            AccessName
          </p>
        </div>
      </div>
      <div className="w-[250px] flex-col justify-start items-start gap-2 inline-flex">
        <div className="self-stretch h-10 px-3 py-2 bg-white rounded border border-grey-40 justify-start items-center gap-3 inline-flex">
          <select className="grow shrink basis-0 custom-select text-grey-80 text-sm leading-[21px] outline-none">
            <option>Collection</option>
          </select>
        </div>
      </div>
      <div className="grow shrink basis-0 self-stretch justify-start items-center gap-2 flex">
        <div className="grow shrink basis-0 justify-center items-center flex">
          <input
            type="checkbox"
            className="accent-blue-40 w-4 h-4 cursor-pointer checked"
          />
        </div>
        <div className="self-stretch w-px h-10 relative border-r border-grey-20" />
        <div className="grow shrink basis-0 justify-center items-center flex">
          <input
            type="checkbox"
            className="accent-blue-40 w-4 h-4 cursor-pointer checked"
          />
        </div>
        <div className="self-stretch w-px h-10 relative border-r border-grey-20" />
        <div className="grow shrink basis-0 justify-center items-center flex">
          <input
            type="checkbox"
            className="accent-blue-40 w-4 h-4 cursor-pointer checked"
          />
        </div>
        <div className="self-stretch w-px h-10 relative border-r border-grey-20" />
        <div className="grow shrink basis-0 justify-center items-center flex">
          <input
            type="checkbox"
            className="accent-blue-40 w-4 h-4 cursor-pointer checked"
          />
        </div>
        <div className="self-stretch w-px h-10 relative border-r border-grey-20" />
        <div className="grow shrink basis-0 justify-center items-center flex">
          <input
            type="checkbox"
            className="accent-blue-40 w-4 h-4 cursor-pointer checked"
          />
        </div>
      </div>
      <div className="w-11 justify-center items-center flex">
        <div className="w-5 h-5 relative overflow-hidden cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M3.33464 6.66797H16.668V17.5013C16.668 17.7223 16.5802 17.9343 16.4239 18.0906C16.2676 18.2468 16.0556 18.3346 15.8346 18.3346H4.16797C3.94696 18.3346 3.73499 18.2468 3.57871 18.0906C3.42243 17.9343 3.33464 17.7223 3.33464 17.5013V6.66797ZM5.0013 8.33464V16.668H15.0013V8.33464H5.0013ZM7.5013 10.0013H9.16797V15.0013H7.5013V10.0013ZM10.8346 10.0013H12.5013V15.0013H10.8346V10.0013ZM5.83464 4.16797V2.5013C5.83464 2.28029 5.92243 2.06833 6.07871 1.91205C6.23499 1.75577 6.44696 1.66797 6.66797 1.66797H13.3346C13.5556 1.66797 13.7676 1.75577 13.9239 1.91205C14.0802 2.06833 14.168 2.28029 14.168 2.5013V4.16797H18.3346V5.83464H1.66797V4.16797H5.83464ZM7.5013 3.33464V4.16797H12.5013V3.33464H7.5013Z"
              fill="#A1221B"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
