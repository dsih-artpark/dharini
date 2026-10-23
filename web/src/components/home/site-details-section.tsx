"use client";
import { useAtomValue } from "jotai";
import { homeDataAtom, homeDataLoadingAtom } from "@/src/store/homeDataAtom";
import Loader from "@/src/components/ui/loader";

export default function SiteDetailsSection() {
  const homeData = useAtomValue(homeDataAtom);
  const loading = useAtomValue(homeDataLoadingAtom);

  const siteDetails = homeData?.siteDetails ?? [];

  return (
    <section className="flex flex-col gap-6 rounded-2xl border border-grey-20 bg-white p-5 shadow-card sm:p-6">
      <h2 className="text-2xl font-semibold leading-tight text-grey-90 sm:text-[32px]">
        Site Details
      </h2>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader />
        </div>
      )}

      {!loading && siteDetails.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-grey-10 border-b border-grey-20">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-grey-70 uppercase tracking-wider whitespace-nowrap">
                  Site Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-grey-70 uppercase tracking-wider whitespace-nowrap">
                  Project Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-grey-70 uppercase tracking-wider whitespace-nowrap">
                  Samples Collected
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-grey-70 uppercase tracking-wider whitespace-nowrap">
                  Disease
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-grey-70 uppercase tracking-wider whitespace-nowrap">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-grey-10">
              {siteDetails.map((row, index) => (
                <tr key={index} className="hover:bg-grey-5 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-grey-90">
                    {row.siteName}
                  </td>
                  <td className="px-6 py-4 text-sm text-grey-70">
                    {row.projectName}
                  </td>
                  <td className="px-6 py-4 text-sm text-grey-70">
                    {row.samplesCollected}
                  </td>
                  <td className="px-6 py-4 text-sm text-grey-70">
                    {row.diseases}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        row.status === "Positive"
                          ? "bg-red-10 text-red-60"
                          : row.status === "Negative"
                            ? "bg-green-10 text-green-60"
                            : row.status === "Inconclusive"
                              ? "bg-yellow-10 text-yellow-60"
                              : "bg-grey-10 text-grey-60"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && siteDetails.length === 0 && (
        <div className="text-center py-12">
          <p className="text-grey-60">No site details available.</p>
        </div>
      )}
    </section>
  );
}
