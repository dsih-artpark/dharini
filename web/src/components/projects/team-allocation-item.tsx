import { useState } from "react";
import Image from "next/image";

import { TeamProgress } from "@/src/types/teams";

export default function TeamAllocationItem({ site }: { site: TeamProgress }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="min-w-fit self-stretch px-6 py-3 bg-white border-b border-grey-20 flex items-center gap-6 hover:bg-grey-10/50 transition-colors">
      <div className="w-1/2 min-w-[300px] flex items-center gap-4">
        {site.photos?.length ? (
          <>
            {isLoading && (
              <div className="absolute p-5 bg-blue-10 rounded-lg justify-center items-center gap-1 flex">
                <div className="w-6 h-6 relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="24"
                    viewBox="0 0 25 24"
                    fill="none"
                  >
                    <path
                      d="M20.5 5H4.5V19L13.792 9.706C13.9795 9.51853 14.2338 9.41321 14.499 9.41321C14.7642 9.41321 15.0185 9.51853 15.206 9.706L20.5 15.01V5ZM2.5 3.993C2.50183 3.73038 2.6069 3.47902 2.79251 3.29322C2.97813 3.10742 3.22938 3.00209 3.492 3H21.508C22.056 3 22.5 3.445 22.5 3.993V20.007C22.4982 20.2696 22.3931 20.521 22.2075 20.7068C22.0219 20.8926 21.7706 20.9979 21.508 21H3.492C3.22881 20.9997 2.9765 20.895 2.79049 20.7088C2.60448 20.5226 2.5 20.2702 2.5 20.007V3.993ZM8.5 11C7.96957 11 7.46086 10.7893 7.08579 10.4142C6.71071 10.0391 6.5 9.53043 6.5 9C6.5 8.46957 6.71071 7.96086 7.08579 7.58579C7.46086 7.21071 7.96957 7 8.5 7C9.03043 7 9.53914 7.21071 9.91421 7.58579C10.2893 7.96086 10.5 8.46957 10.5 9C10.5 9.53043 10.2893 10.0391 9.91421 10.4142C9.53914 10.7893 9.03043 11 8.5 11Z"
                      fill="#D7DBDF"
                    />
                  </svg>
                </div>
              </div>
            )}
            <Image
              className="h-16 w-16 rounded-lg object-cover"
              src={site.photos[0]}
              width={64}
              height={64}
              alt={"site photo"}
              onLoad={() => setIsLoading(false)}
            />
          </>
        ) : (
          <div className="p-5 bg-blue-10 rounded-lg justify-center items-center gap-1 flex">
            <div className="w-6 h-6 relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
              >
                <path
                  d="M20.5 5H4.5V19L13.792 9.706C13.9795 9.51853 14.2338 9.41321 14.499 9.41321C14.7642 9.41321 15.0185 9.51853 15.206 9.706L20.5 15.01V5ZM2.5 3.993C2.50183 3.73038 2.6069 3.47902 2.79251 3.29322C2.97813 3.10742 3.22938 3.00209 3.492 3H21.508C22.056 3 22.5 3.445 22.5 3.993V20.007C22.4982 20.2696 22.3931 20.521 22.2075 20.7068C22.0219 20.8926 21.7706 20.9979 21.508 21H3.492C3.22881 20.9997 2.9765 20.895 2.79049 20.7088C2.60448 20.5226 2.5 20.2702 2.5 20.007V3.993ZM8.5 11C7.96957 11 7.46086 10.7893 7.08579 10.4142C6.71071 10.0391 6.5 9.53043 6.5 9C6.5 8.46957 6.71071 7.96086 7.08579 7.58579C7.46086 7.21071 7.96957 7 8.5 7C9.03043 7 9.53914 7.21071 9.91421 7.58579C10.2893 7.96086 10.5 8.46957 10.5 9C10.5 9.53043 10.2893 10.0391 9.91421 10.4142C9.53914 10.7893 9.03043 11 8.5 11Z"
                  fill="#D7DBDF"
                />
              </svg>
            </div>
          </div>
        )}
        <div className="flex flex-col justify-center gap-1">
          <p className="text-base font-medium text-grey-80 capitalize">
            {site.name}
          </p>
        </div>
      </div>

      <div className="w-1/2 grow shrink basis-0 justify-between items-center flex gap-10">
        <div className="min-w-[100px] w-1/2 flex items-center gap-1">
          <p className="text-xl font-semibold text-grey-90">
            {site.pendingVisitCount}
          </p>
        </div>
        <div className="min-w-[100px] w-1/2 flex items-center">
          <p className="text-xl font-semibold text-grey-90">
            {site.completedVisitCount}
          </p>
        </div>
      </div>
    </div>
  );
}
