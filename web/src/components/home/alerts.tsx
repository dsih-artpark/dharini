export default function Alerts() {
  return (
    <div className="flex-col justify-start items-start gap-2 inline-flex">
      <div className="self-stretch justify-between items-center inline-flex">
        <h3 className="text-white text-xl font-semibold font-noto-serif leading-relaxed">
          Alerts
        </h3>
        <div className="px-3 py-2 rounded-lg justify-center items-center gap-2 flex">
          <p className="text-white text-sm leading-[21px]">View All</p>
        </div>
      </div>
      <div className="self-stretch rounded border border-grey-20 flex-col justify-start items-start flex">
        <div className="self-stretch p-3 bg-white border-b border-grey-20 justify-start items-start gap-3 inline-flex">
          <div className="self-stretch pt-1 justify-start items-start flex">
            <div className="w-4 h-4 relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M9.33268 9.50068V10.894C8.7293 10.6807 8.08353 10.6153 7.44962 10.7032C6.8157 10.7912 6.21215 11.0299 5.68964 11.3995C5.16712 11.769 4.74091 12.2586 4.44679 12.827C4.15267 13.3954 3.99923 14.026 3.99935 14.666L2.66602 14.6653C2.66581 13.8513 2.85196 13.048 3.21021 12.3169C3.56847 11.5859 4.08931 10.9466 4.73283 10.448C5.37635 9.94944 6.12547 9.60477 6.92278 9.44045C7.7201 9.27612 8.54446 9.2965 9.33268 9.50002V9.50068ZM7.99935 8.66602C5.78935 8.66602 3.99935 6.87602 3.99935 4.66602C3.99935 2.45602 5.78935 0.666016 7.99935 0.666016C10.2093 0.666016 11.9993 2.45602 11.9993 4.66602C11.9993 6.87602 10.2093 8.66602 7.99935 8.66602ZM7.99935 7.33268C9.47268 7.33268 10.666 6.13935 10.666 4.66602C10.666 3.19268 9.47268 1.99935 7.99935 1.99935C6.52602 1.99935 5.33268 3.19268 5.33268 4.66602C5.33268 6.13935 6.52602 7.33268 7.99935 7.33268ZM11.9993 11.3327V9.33268H13.3327V11.3327H15.3327V12.666H13.3327V14.666H11.9993V12.666H9.99935V11.3327H11.9993Z"
                  fill="#5D7FDD"
                />
              </svg>
            </div>
          </div>
          <div className="grow shrink basis-0 flex-col justify-start items-start gap-1 inline-flex">
            <p className="grow shrink basis-0 text-grey-80 text-base leading-normal">
              New Region Added
            </p>
            <p className="self-stretch text-grey-70 text-sm leading-[21px]">
              Aurangabad
            </p>
          </div>
          <div className="self-stretch pt-0.5 justify-start items-start flex">
            <div className="w-5 h-5 relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M10.9766 10.0006L6.85156 5.8756L8.0299 4.69727L13.3332 10.0006L8.0299 15.3039L6.85156 14.1256L10.9766 10.0006Z"
                  fill="#11181C"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="self-stretch p-3 bg-white border-b border-grey-20 justify-start items-start gap-3 inline-flex">
          <div className="self-stretch pt-1 justify-start items-start flex">
            <div className="w-4 h-4 relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M9.1455 1.29883L11.6348 2.25483L11.1568 3.4995L10.5342 3.26016L10.0368 4.55683C10.5562 4.86483 10.9995 5.28616 11.3335 5.7875L12.6022 5.22283L12.3308 4.61349L13.5488 4.07149L14.6335 6.50749L13.4155 7.04949L13.1442 6.44083L11.8762 7.00549C11.9575 7.32349 12.0008 7.65749 12.0008 8.00083C12.0008 8.27149 11.9742 8.53616 11.9228 8.79216L13.2188 9.28949L13.4575 8.66749L14.7028 9.1455L13.7468 11.6348L12.5022 11.1568L12.7408 10.5348L11.4448 10.0368C11.1368 10.5562 10.7155 10.9995 10.2142 11.3335L10.7788 12.6022L11.3882 12.3308L11.9302 13.5488L9.49416 14.6335L8.95216 13.4155L9.56083 13.1442L8.99616 11.8762C8.67816 11.9575 8.34416 12.0008 8.00083 12.0008C7.72949 12.0008 7.46483 11.9742 7.20883 11.9222L6.71149 13.2188L7.33416 13.4575L6.85616 14.7028L4.36683 13.7468L4.84483 12.5022L5.46616 12.7408L5.96483 11.4448C5.4455 11.1368 5.00216 10.7155 4.66749 10.2142L3.39883 10.7788L3.67016 11.3882L2.45216 11.9302L1.36749 9.49416L2.58549 8.95216L2.85616 9.56149L4.12483 8.99616C4.04416 8.67816 4.00083 8.34416 4.00083 8.00083C4.00083 7.73016 4.02749 7.46549 4.07883 7.20949L2.78216 6.71216L2.54416 7.33416L1.29883 6.85616L2.25483 4.3675L3.4995 4.84549L3.26016 5.46749L4.55683 5.96549C4.86483 5.44549 5.28616 5.00216 5.7875 4.66749L5.22283 3.39883L4.61349 3.67016L4.07149 2.45216L6.50749 1.36816L7.04949 2.58616L6.44083 2.85749L7.00549 4.12549C7.32349 4.04416 7.65749 4.00083 8.00083 4.00083C8.27149 4.00083 8.53616 4.02749 8.79216 4.07883L9.28883 2.78216L8.66749 2.54416L9.1455 1.29883ZM8.00083 5.33416C6.52749 5.33416 5.33416 6.52749 5.33416 8.00083C5.33416 9.47416 6.52749 10.6675 8.00083 10.6675C9.47416 10.6675 10.6675 9.47416 10.6675 8.00083C10.6675 6.52749 9.47416 5.33416 8.00083 5.33416ZM7.66749 8.57816C7.98616 8.76216 8.0955 9.17016 7.9115 9.48883C7.7275 9.8075 7.31949 9.91683 7.00083 9.73283C6.68216 9.54883 6.57283 9.14083 6.75683 8.82216C6.94083 8.50349 7.34883 8.39416 7.66749 8.57816ZM9.33416 7.33416C9.70216 7.33416 10.0008 7.63283 10.0008 8.00083C10.0008 8.36883 9.70216 8.66749 9.33416 8.66749C8.96616 8.66749 8.66749 8.36883 8.66749 8.00083C8.66749 7.63283 8.96616 7.33416 9.33416 7.33416ZM7.9115 6.51283C8.0955 6.83149 7.98616 7.2395 7.66749 7.4235C7.34883 7.6075 6.94083 7.49816 6.75683 7.17949C6.57283 6.86083 6.68216 6.45283 7.00083 6.26883C7.31949 6.08483 7.7275 6.19416 7.9115 6.51283Z"
                  fill="#5D7FDD"
                />
              </svg>
            </div>
          </div>
          <div className="grow shrink basis-0 flex-col justify-start items-start gap-1 inline-flex">
            <div className="self-stretch justify-center items-center gap-4 inline-flex">
              <div className="grow shrink basis-0 text-grey-80 text-base leading-normal">
                High Positivity for FMD
              </div>
            </div>
            <div className="self-stretch text-grey-70 text-sm leading-[21px]">
              Kothrud, Maval, Haveli
            </div>
          </div>
          <div className="self-stretch pt-0.5 justify-start items-start flex">
            <div className="w-5 h-5 relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M10.9766 10.0006L6.85156 5.8756L8.0299 4.69727L13.3332 10.0006L8.0299 15.3039L6.85156 14.1256L10.9766 10.0006Z"
                  fill="#11181C"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="self-stretch p-3 bg-white border-b border-grey-20 justify-start items-start gap-3 inline-flex">
          <div className="self-stretch pt-1 justify-start items-start flex">
            <div className="w-4 h-4 relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M14.0007 7.76465V14.0007C14.0007 14.1775 13.9304 14.347 13.8054 14.4721C13.6804 14.5971 13.5108 14.6673 13.334 14.6673H2.66732C2.49051 14.6673 2.32094 14.5971 2.19592 14.4721C2.07089 14.347 2.00065 14.1775 2.00065 14.0007V7.76465C1.5702 7.27796 1.33302 6.65039 1.33399 6.00065V2.00065C1.33399 1.82384 1.40423 1.65427 1.52925 1.52925C1.65427 1.40422 1.82384 1.33398 2.00065 1.33398H14.0007C14.1775 1.33398 14.347 1.40422 14.4721 1.52925C14.5971 1.65427 14.6673 1.82384 14.6673 2.00065V6.00065C14.6673 6.67665 14.4153 7.29398 14.0007 7.76465ZM12.6673 8.58332C12.1906 8.7058 11.6892 8.69417 11.2186 8.5497C10.7481 8.40524 10.3266 8.13356 10.0007 7.76465C9.75067 8.04871 9.44296 8.27616 9.09807 8.43182C8.75318 8.58748 8.37905 8.66777 8.00065 8.66732C7.62226 8.66777 7.24813 8.58748 6.90324 8.43182C6.55835 8.27616 6.25064 8.04871 6.00065 7.76465C5.67553 8.13461 5.25407 8.40704 4.78324 8.55158C4.31241 8.69613 3.81069 8.70711 3.33399 8.58332V13.334H12.6673V8.58332ZM9.33399 6.00065C9.33399 5.82384 9.40423 5.65427 9.52925 5.52925C9.65427 5.40422 9.82384 5.33398 10.0007 5.33398C10.1775 5.33398 10.347 5.40422 10.4721 5.52925C10.5971 5.65427 10.6673 5.82384 10.6673 6.00065C10.6673 6.35427 10.8078 6.69341 11.0578 6.94346C11.3079 7.19351 11.647 7.33398 12.0007 7.33398C12.3543 7.33398 12.6934 7.19351 12.9435 6.94346C13.1935 6.69341 13.334 6.35427 13.334 6.00065V2.66732H2.66732V6.00065C2.66732 6.35427 2.8078 6.69341 3.05784 6.94346C3.30789 7.19351 3.64703 7.33398 4.00065 7.33398C4.35428 7.33398 4.69341 7.19351 4.94346 6.94346C5.19351 6.69341 5.33399 6.35427 5.33399 6.00065C5.33399 5.82384 5.40423 5.65427 5.52925 5.52925C5.65427 5.40422 5.82384 5.33398 6.00065 5.33398C6.17746 5.33398 6.34703 5.40422 6.47206 5.52925C6.59708 5.65427 6.66732 5.82384 6.66732 6.00065C6.66732 6.35427 6.8078 6.69341 7.05785 6.94346C7.30789 7.19351 7.64703 7.33398 8.00065 7.33398C8.35428 7.33398 8.69341 7.19351 8.94346 6.94346C9.19351 6.69341 9.33399 6.35427 9.33399 6.00065Z"
                  fill="#5D7FDD"
                />
              </svg>
            </div>
          </div>
          <div className="grow shrink basis-0 flex-col justify-start items-start gap-1 inline-flex">
            <div className="self-stretch justify-center items-center gap-4 inline-flex">
              <div className="grow shrink basis-0 text-grey-80 text-base leading-normal">
                OneHealth Initiative Added
              </div>
              <div className="px-2 py-1 bg-teal-20 rounded justify-center items-center flex">
                <span className="text-grey-80 text-[10px] uppercase leading-[15px] tracking-tight">
                  new project
                </span>
              </div>
            </div>
            <div className="self-stretch text-grey-70 text-sm leading-[21px]">
              FMD, LSD
            </div>
          </div>
          <div className="self-stretch pt-0.5 justify-start items-start flex">
            <div className="w-5 h-5 relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M10.9766 10.0006L6.85156 5.8756L8.0299 4.69727L13.3332 10.0006L8.0299 15.3039L6.85156 14.1256L10.9766 10.0006Z"
                  fill="#11181C"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
