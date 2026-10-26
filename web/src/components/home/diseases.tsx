"use client";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  LabelList,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    month: "Jan",
    count: 5,
    active: 2,
  },
  {
    month: "Feb",
    count: 5,
    active: 2,
  },
  {
    month: "Mar",
    count: 25,
    active: 10,
  },
  {
    month: "Apr",
    count: 25,
    active: 10,
  },
  {
    month: "May",
    count: 70,
    active: 40,
  },
  {
    month: "Jun",
    count: 97,
    active: 70,
  },
  {
    month: "Jul",
    count: 95,
    active: 70,
  },
  {
    month: "Oct",
    count: 75,
    active: 50,
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderCustomizedLabel = (props: any) => {
  const { x, y, width, value } = props;
  const radius = 10;

  return (
    <g>
      <text
        x={x + width / 2}
        y={y - radius}
        fill="#687076"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {value}
      </text>
    </g>
  );
};

export default function Diseases() {
  return (
    <div className="px-4 sm:px-8 lg:px-20 pt-8 pb-10 bg-white border-t border-b border-grey-20 flex-col justify-start items-start gap-6 inline-flex">
      <div className="self-stretch justify-between items-center inline-flex">
        <h1 className="text-grey-80 text-[32px] font-semibold font-noto-serif leading-[41.60px]">
          Diseases
        </h1>
        <div className="p-3 rounded-lg justify-center items-center gap-2 flex cursor-pointer">
          <p className="text-[#3A11B6] text-base leading-normal">
            View Dashboard
          </p>
          <div className="w-4 h-4 relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
            >
              <path
                d="M8.78047 8.50048L5.48047 5.20048L6.42314 4.25781L10.6658 8.50048L6.42314 12.7431L5.48047 11.8005L8.78047 8.50048Z"
                fill="#284DB6"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="self-stretch justify-start items-start gap-6 inline-flex">
        <div className="w-[574px] self-stretch px-5 py-4 bg-white rounded border border-grey-20 flex-col justify-start items-start gap-6 inline-flex">
          <div className="self-stretch bg-white justify-start items-center gap-3 inline-flex">
            <p className="grow shrink basis-0 text-grey-80 text-xl font-semibold font-noto-serif leading-relaxed">
              Foot & Mouth Disease
            </p>
            <div className="px-2 py-1 bg-red-10 rounded justify-center items-center gap-1 flex">
              <div className="w-4 h-4 relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M8.57707 1.99932L14.9277 12.9993C14.9862 13.1007 15.0171 13.2156 15.0171 13.3326C15.0171 13.4497 14.9863 13.5646 14.9277 13.666C14.8692 13.7673 14.7851 13.8515 14.6837 13.91C14.5824 13.9685 14.4674 13.9993 14.3504 13.9993H1.64907C1.53205 13.9993 1.41709 13.9685 1.31574 13.91C1.2144 13.8515 1.13024 13.7673 1.07173 13.666C1.01322 13.5646 0.982421 13.4497 0.982422 13.3326C0.982423 13.2156 1.01323 13.1007 1.07174 12.9993L7.4224 1.99932C7.48092 1.89798 7.56508 1.81383 7.66642 1.75532C7.76776 1.69682 7.88272 1.66602 7.99974 1.66602C8.11676 1.66602 8.23171 1.69682 8.33306 1.75532C8.4344 1.81383 8.51856 1.89798 8.57707 1.99932ZM2.80374 12.666H13.1957L7.99974 3.66599L2.80374 12.666ZM7.33307 10.666H8.6664V11.9993H7.33307V10.666ZM7.33307 5.99932H8.6664V9.33265H7.33307V5.99932Z"
                    fill="#A1221B"
                  />
                </svg>
              </div>
              <p className="text-red-30 text-[10px] uppercase leading-[15px] tracking-tight">
                needs attention
              </p>
            </div>
          </div>
          <div className="self-stretch grow shrink basis-0 flex-col justify-start items-start gap-4 flex">
            <div className="self-stretch h-[330px] px-4 py-3 bg-grey-10 flex-col justify-start items-center gap-4 flex">
              <p className="self-stretch text-grey-80 text-xs leading-[18px]">
                Samples Positivity Trend in Past 8 weeks
              </p>
              <ResponsiveContainer width={"100%"} height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="active"
                    stackId="a"
                    fill="#A1221B"
                    barSize={16}
                  />
                  <Bar
                    dataKey="count"
                    stackId="a"
                    fill="#F8F9FA"
                    stroke="#E6E8EB"
                    barSize={16}
                  >
                    <LabelList
                      dataKey="count"
                      content={renderCustomizedLabel}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="self-stretch h-[268px] flex-col justify-center items-start gap-4 flex">
              <div className="self-stretch h-[100px] flex-col justify-center items-start gap-4 flex">
                <div className="self-stretch py-2 border-b border-grey-20 justify-start items-center gap-2.5 inline-flex">
                  <p className="text-grey-80 text-sm leading-[21px]">Sites</p>
                </div>
                <div className="self-stretch justify-start items-start gap-4 inline-flex">
                  <div className="grow shrink basis-0 rounded flex-col justify-center items-start gap-1 inline-flex">
                    <div className="self-stretch justify-start items-center gap-2 inline-flex">
                      <p className="text-red-30 text-xl leading-[25px]">32</p>
                    </div>
                    <p className="text-grey-70 text-xs uppercase leading-[18px] tracking-tight">
                      Positive
                    </p>
                  </div>
                  <div className="grow shrink basis-0 rounded flex-col justify-center items-start gap-1 inline-flex">
                    <div className="self-stretch justify-start items-center gap-2 inline-flex">
                      <p className="text-grey-80 text-xl leading-[25px]">40</p>
                    </div>
                    <p className="text-grey-70 text-xs uppercase leading-[18px] tracking-tight">
                      visited
                    </p>
                  </div>
                </div>
              </div>
              <div className="self-stretch h-[152px] flex-col justify-center items-start gap-3 flex">
                <div className="self-stretch py-2 border-b border-grey-20 justify-start items-center gap-2.5 inline-flex">
                  <p className="text-grey-80 text-sm leading-[21px]">
                    Locations with High Positivity
                  </p>
                </div>
                <div className="self-stretch h-[103px] flex-col justify-start items-start gap-2 flex">
                  <div className="self-stretch px-3 py-1 bg-grey-10 rounded-sm border-l-2 border-red-20 justify-start items-center gap-3 inline-flex">
                    <p className="text-grey-80 text-sm leading-[21px]">
                      Chakan
                    </p>
                  </div>
                  <div className="self-stretch px-3 py-1 bg-grey-10 rounded-sm border-l-2 border-red-20 justify-start items-center gap-3 inline-flex">
                    <p className="text-grey-80 text-sm leading-[21px]">Maval</p>
                  </div>
                  <div className="self-stretch px-3 py-1 bg-grey-10 rounded-sm border-l-2 border-red-20 justify-start items-center gap-3 inline-flex">
                    <p className="text-grey-80 text-sm leading-[21px]">
                      Hinjewadi
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="self-stretch px-3 py-2 bg-blue-10 rounded-lg justify-between items-center inline-flex">
            <p className="grow shrink basis-0 text-blue-40 text-sm leading-[21px]">
              View FMD Data
            </p>
            <div className="w-4 h-4 relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
              >
                <path
                  d="M8.78047 8.50048L5.48047 5.20048L6.42314 4.25781L10.6658 8.50048L6.42314 12.7431L5.48047 11.8005L8.78047 8.50048Z"
                  fill="#284DB6"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="w-[682px] self-stretch flex-col justify-start items-start gap-[23px] inline-flex">
          <div className="self-stretch h-[420px] px-5 py-4 bg-white rounded border border-grey-20 flex-col justify-start items-start gap-6 flex">
            <div className="self-stretch bg-white justify-start items-center gap-3 inline-flex">
              <p className="grow shrink basis-0 text-grey-80 text-xl font-semibold font-noto-serif leading-relaxed">
                Lumpy Skin Disease
              </p>
              <div className="px-2 py-1 bg-green-10 rounded justify-center items-center gap-1 flex">
                <p className="text-green-30 text-[10px] uppercase leading-[15px] tracking-tight">
                  on track
                </p>
              </div>
            </div>
            <div className="self-stretch grow shrink basis-0 justify-start items-start gap-10 inline-flex">
              <div className="grow shrink basis-0 flex-col justify-center items-start gap-4 inline-flex">
                <div className="self-stretch py-2 border-b border-grey-20 justify-start items-center gap-2.5 inline-flex">
                  <p className="text-grey-80 text-sm leading-[21px]">Sites</p>
                </div>
                <div className="self-stretch h-[173px] flex-col justify-start items-start gap-4 flex">
                  <div className="self-stretch h-[47px] rounded flex-col justify-center items-start gap-1 flex">
                    <div className="self-stretch justify-start items-center gap-2 inline-flex">
                      <p className="text-red-30 text-xl leading-[25px]">2</p>
                    </div>
                    <p className="text-grey-70 text-xs uppercase leading-[18px] tracking-tight">
                      positive
                    </p>
                  </div>
                  <div className="self-stretch h-[47px] rounded flex-col justify-center items-start gap-1 flex">
                    <div className="self-stretch justify-start items-center gap-2 inline-flex">
                      <p className="text-grey-80 text-xl leading-[25px]">24</p>
                    </div>
                    <p className="text-grey-70 text-xs uppercase leading-[18px] tracking-tight">
                      visited
                    </p>
                  </div>
                  <div className="self-stretch h-[47px] rounded flex-col justify-center items-start gap-1 flex">
                    <div className="self-stretch justify-start items-center gap-2 inline-flex">
                      <p className="text-grey-80 text-xl leading-[25px]">8</p>
                    </div>
                    <p className="text-grey-70 text-xs uppercase leading-[18px] tracking-tight">
                      pending
                    </p>
                  </div>
                </div>
              </div>
              <div className="grow shrink basis-0 h-60 flex-col justify-start items-start gap-4 inline-flex">
                <div className="self-stretch py-2 border-b border-grey-20 justify-start items-center gap-2.5 inline-flex">
                  <p className="text-grey-80 text-sm leading-[21px]">Samples</p>
                </div>
                <div className="self-stretch grow shrink basis-0 justify-start items-end gap-4 inline-flex">
                  <div className="w-[139px] self-stretch flex-col justify-between items-start inline-flex">
                    <div className="self-stretch h-[47px] rounded flex-col justify-center items-start gap-1 flex">
                      <div className="self-stretch justify-start items-center gap-2 inline-flex">
                        <p className="text-grey-80 text-xl leading-[25px]">
                          12
                        </p>
                      </div>
                      <p className="text-grey-70 text-xs uppercase leading-[18px] tracking-tight">
                        positive
                      </p>
                    </div>
                    <div className="self-stretch h-[47px] rounded flex-col justify-center items-start gap-1 flex">
                      <div className="self-stretch justify-start items-center gap-2 inline-flex">
                        <p className="text-grey-80 text-xl leading-[25px]">
                          36
                        </p>
                      </div>
                      <p className="text-grey-70 text-xs uppercase leading-[18px] tracking-tight">
                        negative
                      </p>
                    </div>
                    <div className="self-stretch h-[47px] rounded flex-col justify-center items-start gap-1 flex">
                      <div className="self-stretch justify-start items-center gap-2 inline-flex">
                        <p className="text-grey-80 text-xl leading-[25px]">7</p>
                      </div>
                      <p className="text-grey-70 text-xs uppercase leading-[18px] tracking-tight">
                        unclear
                      </p>
                    </div>
                  </div>
                  <div className="w-[100px] self-stretch flex-col justify-start items-start gap-0.5 inline-flex">
                    <div className="self-stretch h-3 bg-red-20 rounded" />
                    <div className="self-stretch h-[84px] bg-green-20 rounded" />
                    <div className="self-stretch grow shrink basis-0 bg-grey-40 rounded" />
                  </div>
                </div>
              </div>
            </div>
            <div className="self-stretch px-3 py-2 bg-blue-10 rounded-lg justify-between items-center inline-flex">
              <p className="grow shrink basis-0 text-blue-40 text-sm leading-[21px]">
                View LSD Data
              </p>
              <div className="w-4 h-4 relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="17"
                  viewBox="0 0 16 17"
                  fill="none"
                >
                  <path
                    d="M8.78047 8.50048L5.48047 5.20048L6.42314 4.25781L10.6658 8.50048L6.42314 12.7431L5.48047 11.8005L8.78047 8.50048Z"
                    fill="#284DB6"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="self-stretch h-[420px] px-5 py-4 bg-white rounded border border-grey-20 flex-col justify-start items-center gap-6 flex">
            <div className="self-stretch bg-white justify-start items-center gap-3 inline-flex">
              <p className="grow shrink basis-0 text-grey-80 text-xl font-semibold font-noto-serif leading-relaxed">
                Avian Influenza
              </p>
              <div className="px-2 py-1 bg-green-10 rounded justify-center items-center gap-1 flex">
                <p className="text-green-30 text-[10px] uppercase leading-[15px] tracking-tight">
                  on track
                </p>
              </div>
            </div>
            <div className="grow shrink basis-0 flex-col justify-center items-center gap-2 flex">
              <div className="p-2 bg-grey-10 rounded-[99px] justify-start items-center gap-2.5 inline-flex">
                <div className="w-6 h-6 relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path d="M0 0H24V24H0V0Z" fill="#F8F9FA" />
                    <path
                      d="M17 2V4H16V18C16 20.21 14.21 22 12 22C9.79 22 8 20.21 8 18V4H7V2H17ZM14 10H10V18C10 19.105 10.895 20 12 20C13.105 20 14 19.105 14 18V10ZM13 15C13.552 15 14 15.448 14 16C14 16.552 13.552 17 13 17C12.448 17 12 16.552 12 16C12 15.448 12.448 15 13 15ZM11 12C11.552 12 12 12.448 12 13C12 13.552 11.552 14 11 14C10.448 14 10 13.552 10 13C10 12.448 10.448 12 11 12ZM14 4H10V8H14V4Z"
                      fill="#B7BDC2"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-center text-grey-50 text-sm leading-[21px]">
                No Collection has started yet
              </p>
            </div>
            <div className="self-stretch px-3 py-2 bg-blue-10 rounded-lg justify-between items-center inline-flex">
              <p className="grow shrink basis-0 text-blue-40 text-sm leading-[21px]">
                Update Collection Plan
              </p>
              <div className="w-4 h-4 relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="17"
                  viewBox="0 0 16 17"
                  fill="none"
                >
                  <path
                    d="M8.78047 8.50048L5.48047 5.20048L6.42314 4.25781L10.6658 8.50048L6.42314 12.7431L5.48047 11.8005L8.78047 8.50048Z"
                    fill="#284DB6"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
