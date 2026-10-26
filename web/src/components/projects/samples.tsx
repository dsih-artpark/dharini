import { formatDate } from "@/src/utils";

export default function Samples() {
  return (
    <div className="px-4 sm:px-8 lg:px-20 pt-8 pb-10 bg-white border-t border-b border-grey-20 flex-col justify-start items-start gap-6 inline-flex">
      <h1 className="text-grey-80 text-[32px] font-semibold font-noto-serif leading-[41.60px]">
        Samples
      </h1>
      <div className="self-stretch bg-white justify-between items-center inline-flex">
        <div className="justify-start items-center gap-2 flex">
          <div className="self-stretch pl-4 pr-3 py-2 bg-blue-10 rounded-[999px] border border-blue-30 justify-start items-center flex">
            <p className="text-grey-80 text-sm leading-[21px]">All</p>
          </div>
          <div className="px-4 py-2 bg-white rounded-[999px] border border-grey-20 justify-start items-center flex">
            <p className="text-grey-80 text-sm leading-[21px]">FMD</p>
          </div>
          <div className="self-stretch px-4 py-2 bg-white rounded-[999px] border border-grey-20 justify-start items-center flex">
            <p className="text-grey-80 text-sm leading-[21px]">LSD</p>
          </div>
        </div>
        <div className="justify-start items-center gap-4 flex">
          <div className="flex-col justify-start items-start gap-2 inline-flex">
            <div className="h-10 px-3 py-2 bg-white rounded border border-grey-40 justify-start items-center gap-1 inline-flex">
              <div className="justify-start items-center flex">
                <div className="w-5 h-5 relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M10.0013 18.3327C5.3988 18.3327 1.66797 14.6018 1.66797 9.99935C1.66797 5.39685 5.3988 1.66602 10.0013 1.66602C14.6038 1.66602 18.3346 5.39685 18.3346 9.99935C18.3346 14.6018 14.6038 18.3327 10.0013 18.3327ZM10.0013 16.666C11.7694 16.666 13.4651 15.9636 14.7153 14.7134C15.9656 13.4632 16.668 11.7675 16.668 9.99935C16.668 8.23124 15.9656 6.53555 14.7153 5.2853C13.4651 4.03506 11.7694 3.33268 10.0013 3.33268C8.23319 3.33268 6.5375 4.03506 5.28726 5.2853C4.03701 6.53555 3.33464 8.23124 3.33464 9.99935C3.33464 11.7675 4.03701 13.4632 5.28726 14.7134C6.5375 15.9636 8.23319 16.666 10.0013 16.666ZM10.8346 9.99935H14.168V11.666H9.16797V5.83268H10.8346V9.99935Z"
                      fill="#889096"
                    />
                  </svg>
                </div>
              </div>

              <select className="custom-select text-grey-80 text-sm leading-[21px] outline-none">
                <option>Past 3 Months</option>
                <option>Past 6 Months</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="self-stretch h-20 flex-col justify-start items-end gap-2 flex">
        <p className="self-stretch text-grey-70 text-base leading-normal">
          Total
        </p>
        <p className="self-stretch text-grey-80 text-[32px] leading-[48px]">
          295
        </p>
      </div>
      <div className="self-stretch h-[232px] flex-col justify-start items-start gap-8 flex">
        <div className="self-stretch h-[232px] flex-col justify-start items-start gap-6 flex">
          <div className="self-stretch rounded justify-start items-center inline-flex">
            <div className="w-[146px] h-[100px] bg-orange-20" />
            <div className="w-[411px] h-[100px] bg-yellow-20" />
            <div className="w-[291px] h-[100px] bg-red-20" />
            <div className="grow shrink basis-0 h-[100px] bg-green-20" />
          </div>
          <div className="self-stretch justify-start items-start gap-6 inline-flex">
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
              <div className="w-5 h-5 bg-orange-30 rounded-full border border-grey-20" />
              <p className="self-stretch text-grey-70 text-base leading-normal">
                Collected & Shipped
              </p>
              <p className="self-stretch text-grey-80 text-[32px] leading-[48px]">
                27
              </p>
            </div>
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
              <div className="w-5 h-5 bg-yellow-20 rounded-full border border-grey-20" />
              <p className="self-stretch text-grey-70 text-base leading-normal">
                Pending Diagnosis
              </p>
              <p className="self-stretch text-grey-80 text-[32px] leading-[48px]">
                90
              </p>
            </div>
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
              <div className="w-5 h-5 bg-red-20 rounded-full border border-grey-20" />
              <p className="self-stretch text-grey-70 text-base leading-normal">
                Tested Positive
              </p>
              <p className="self-stretch text-grey-80 text-[32px] leading-[48px]">
                78
              </p>
            </div>
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
              <div className="w-5 h-5 bg-green-20 rounded-full border border-grey-20" />
              <p className="self-stretch text-grey-70 text-base leading-normal">
                Tested Negative
              </p>
              <p className="self-stretch text-grey-80 text-[32px] leading-[48px]">
                100
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="self-stretch justify-start items-start gap-2 inline-flex">
        <p className="text-grey-70 text-base leading-normal">Last Updated</p>
        <p className="text-grey-70 text-base font-semibold leading-normal">
          {formatDate(new Date())}
        </p>
      </div>
    </div>
  );
}
