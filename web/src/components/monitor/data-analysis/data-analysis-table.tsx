"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import Loader from "@/src/components/ui/loader";
import Select from "@/src/components/ui/select";
import {
  getSiteWiseAnalysisApi,
  getDiseaseWiseAnalysisApi,
  getSampleWiseAnalysisApi,
} from "@/src/app/(dashboard)/monitor/loader";
import {
  SiteWiseAnalysisData,
  DiseaseWiseAnalysisData,
  SampleWiseAnalysisData,
  FilterType,
} from "@/src/types/statistics";

interface DataAnalysisTableProps {
  filters: FilterType;
  workspaceId?: string;
}

type TabType = "site-wise" | "disease-wise" | "sample-wise";

export default function DataAnalysisTable({
  filters,
  workspaceId,
}: DataAnalysisTableProps) {
  const [activeTab, setActiveTab] = useState<TabType>("site-wise");
  const [data, setData] = useState<
    (SiteWiseAnalysisData | DiseaseWiseAnalysisData | SampleWiseAnalysisData)[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [hoveredAddress, setHoveredAddress] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab, page, limit, filters, workspaceId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let response;
      const params = {
        ...filters,
        workspaceId,
        page,
        limit,
      };

      if (activeTab === "site-wise") {
        response = await getSiteWiseAnalysisApi(params);
      } else if (activeTab === "disease-wise") {
        response = await getDiseaseWiseAnalysisApi(params);
        console.log("Disease Wise Response:", response);
      } else if (activeTab === "sample-wise") {
        response = await getSampleWiseAnalysisApi(params);
      }

      if (response && response.success) {
        const docs = Array.isArray(response.data) ? response.data : [];
        setData(docs);
        setTotalPages(response.totalPages || 1);
      } else {
        setData([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching data", error);
      setData([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const headers: Record<TabType, string[]> = {
    "site-wise": [
      "Site",
      "Farm Type",
      "State",
      "District",
      "Block",
      "Village",
      "Address",
      "Total Samples",
      "Positive",
      "Negative",
      "Unclear",
      "Pending",
      "Positivity Rate",
      "Last Sample",
    ],
    "disease-wise": ["Disease", "Total Samples", "Positive", "Negative"],
    "sample-wise": [
      "Sample ID",
      "Site",
      "Disease",
      "Round",
      "Collected At",
      "Sample Type",
      "Status",
      "Result",
    ],
  };

  const escapeCsvValue = (
    value: string | number | undefined | null,
  ): string => {
    const str = String(value ?? "");
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rowToCsvValues = (
    row:
      SiteWiseAnalysisData | DiseaseWiseAnalysisData | SampleWiseAnalysisData,
  ): string[] => {
    if (activeTab === "site-wise") {
      const item = row as SiteWiseAnalysisData;
      return [
        item.siteName || "-",
        item.farmType || "-",
        item.state || "-",
        item.district || "-",
        item.block || "-",
        item.village || "-",
        item.address || "-",
        String(item.totalSamples ?? 0),
        String(item.positiveSamples ?? 0),
        String(item.negativeSamples ?? 0),
        String(item.unclearSamples ?? 0),
        String(item.pendingSamples ?? 0),
        `${item.positivityRate ?? 0}%`,
        item.lastSampleDate
          ? new Date(item.lastSampleDate).toLocaleDateString()
          : "-",
      ];
    }
    if (activeTab === "disease-wise") {
      const item = row as DiseaseWiseAnalysisData;
      return [
        item.diseaseName || "-",
        String(item.totalSamples ?? 0),
        String(item.positiveSamples ?? 0),
        String(item.negativeSamples ?? 0),
      ];
    }
    if (activeTab === "sample-wise") {
      const item = row as SampleWiseAnalysisData;
      return [
        item.barcode || "-",
        item.siteName || "-",
        item.diseaseName || "-",
        item.round != null ? String(item.round) : "-",
        item.collectedAt
          ? new Date(item.collectedAt).toLocaleDateString()
          : "-",
        item.sampleType || "-",
        item.status ? item.status.replace(/_/g, " ") : "-",
        item.result || "-",
      ];
    }
    return [];
  };

  const truncateWords = (
    text: string | undefined | null,
    wordCount: number = 8,
  ): string => {
    if (!text) return "-";
    const words = text.trim().split(/\s+/);
    if (words.length <= wordCount) return text;
    return words.slice(0, wordCount).join(" ") + "...";
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const params = { ...filters, workspaceId, page: 1, limit: 10000 };
      let response;
      if (activeTab === "site-wise") {
        response = await getSiteWiseAnalysisApi(params);
      } else if (activeTab === "disease-wise") {
        response = await getDiseaseWiseAnalysisApi(params);
      } else if (activeTab === "sample-wise") {
        response = await getSampleWiseAnalysisApi(params);
      }

      const allData =
        response?.success && Array.isArray(response.data) ? response.data : [];
      if (allData.length === 0) {
        alert("No data available to download.");
        return;
      }

      const csvHeaders = headers[activeTab].map(escapeCsvValue).join(",");
      const csvRows = allData.map((row) =>
        rowToCsvValues(row).map(escapeCsvValue).join(","),
      );
      const csvContent = [csvHeaders, ...csvRows].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${activeTab}-analysis.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading data", error);
      alert("Failed to download data. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const renderRow = (
    row:
      SiteWiseAnalysisData | DiseaseWiseAnalysisData | SampleWiseAnalysisData,
  ) => {
    if (!row) return null;

    if (activeTab === "site-wise") {
      const item = row as SiteWiseAnalysisData;
      return (
        <>
          <td className="px-6 py-4 text-sm font-medium text-grey-90 relative">
            <span
              className="block max-w-[200px] truncate"
              onMouseEnter={(e) => {
                if (e.currentTarget.scrollWidth > e.currentTarget.clientWidth) {
                  setHoveredAddress({
                    text: item.siteName || "-",
                    x: e.clientX,
                    y: e.clientY,
                  });
                }
              }}
              onMouseMove={(e) =>
                setHoveredAddress((prev) =>
                  prev ? { ...prev, x: e.clientX, y: e.clientY } : null,
                )
              }
              onMouseLeave={() => setHoveredAddress(null)}
            >
              {item.siteName || "-"}
            </span>
          </td>
          <td className="px-6 py-4 text-sm text-grey-70">
            {item.farmType || "-"}
          </td>
          <td className="px-6 py-4 text-sm text-grey-70">
            {item.state || "-"}
          </td>
          <td className="px-6 py-4 text-sm text-grey-70">
            {item.district || "-"}
          </td>
          <td className="px-6 py-4 text-sm text-grey-70">
            {item.block || "-"}
          </td>
          <td className="px-6 py-4 text-sm text-grey-70">
            {item.village || "-"}
          </td>
          <td className="px-6 py-4 text-sm text-grey-70 relative">
            <span
              className="block max-w-[240px] truncate cursor-pointer"
              onMouseEnter={(e) =>
                setHoveredAddress({
                  text: item.address || "-",
                  x: e.clientX,
                  y: e.clientY,
                })
              }
              onMouseMove={(e) =>
                setHoveredAddress((prev) =>
                  prev ? { ...prev, x: e.clientX, y: e.clientY } : null,
                )
              }
              onMouseLeave={() => setHoveredAddress(null)}
            >
              {truncateWords(item.address, 8)}
            </span>
          </td>
          <td className="px-6 py-4 text-sm text-grey-70">
            {item.totalSamples ?? 0}
          </td>
          <td className="px-6 py-4 text-sm text-red-60 font-medium">
            {item.positiveSamples ?? 0}
          </td>
          <td className="px-6 py-4 text-sm text-green-60">
            {item.negativeSamples ?? 0}
          </td>
          <td className="px-6 py-4 text-sm text-yellow-60">
            {item.unclearSamples ?? 0}
          </td>
          <td className="px-6 py-4 text-sm text-orange-60">
            {item.pendingSamples ?? 0}
          </td>
          <td className="px-6 py-4 text-sm text-grey-90 font-semibold">
            {item.positivityRate ?? 0}%
          </td>
          <td className="px-6 py-4 text-sm text-grey-70">
            {item.lastSampleDate
              ? new Date(item.lastSampleDate).toLocaleDateString()
              : "-"}
          </td>
        </>
      );
    }

    if (activeTab === "disease-wise") {
      const item = row as DiseaseWiseAnalysisData;
      return (
        <>
          <td className="px-6 py-4 text-sm font-medium text-grey-90 relative">
            <span
              className="block max-w-[200px] truncate"
              onMouseEnter={(e) => {
                if (e.currentTarget.scrollWidth > e.currentTarget.clientWidth) {
                  setHoveredAddress({
                    text: item.diseaseName || "-",
                    x: e.clientX,
                    y: e.clientY,
                  });
                }
              }}
              onMouseMove={(e) =>
                setHoveredAddress((prev) =>
                  prev ? { ...prev, x: e.clientX, y: e.clientY } : null,
                )
              }
              onMouseLeave={() => setHoveredAddress(null)}
            >
              {item.diseaseName || "-"}
            </span>
          </td>
          <td className="px-6 py-4 text-sm text-grey-70">
            {item.totalSamples ?? 0}
          </td>
          <td className="px-6 py-4 text-sm text-red-60 font-medium">
            {item.positiveSamples ?? 0}
          </td>
          <td className="px-6 py-4 text-sm text-green-60">
            {item.negativeSamples ?? 0}
          </td>
          {/* <td className="px-6 py-4 text-sm text-grey-90 font-semibold">
            {item.positivityRate ?? 0}%
          </td> */}
        </>
      );
    }

    if (activeTab === "sample-wise") {
      const item = row as SampleWiseAnalysisData;
      return (
        <>
          <td className="px-6 py-4 text-sm font-medium text-grey-90">
            {item.barcode || "-"}
          </td>
          <td className="px-6 py-4 text-sm text-grey-70 relative">
            <span
              className="block max-w-[200px] truncate"
              onMouseEnter={(e) => {
                if (e.currentTarget.scrollWidth > e.currentTarget.clientWidth) {
                  setHoveredAddress({
                    text: item.siteName || "-",
                    x: e.clientX,
                    y: e.clientY,
                  });
                }
              }}
              onMouseMove={(e) =>
                setHoveredAddress((prev) =>
                  prev ? { ...prev, x: e.clientX, y: e.clientY } : null,
                )
              }
              onMouseLeave={() => setHoveredAddress(null)}
            >
              {item.siteName || "-"}
            </span>
          </td>
          <td className="px-6 py-4 text-sm text-grey-70">
            {item.diseaseName || "-"}
          </td>
          <td className="px-6 py-4 text-sm text-grey-70">
            {item.round ?? "-"}
          </td>
          <td className="px-6 py-4 text-sm text-grey-70">
            {item.collectedAt
              ? new Date(item.collectedAt).toLocaleDateString()
              : "-"}
          </td>
          <td className="px-6 py-4 text-sm text-grey-70">
            {item.sampleType || "-"}
          </td>
          <td className="px-6 py-4 text-sm text-grey-70 capitalize">
            {item.status ? item.status.replace(/_/g, " ") : "-"}
          </td>
          <td
            className={`px-6 py-4 text-sm font-medium uppercase ${
              item.result === "positive"
                ? "text-red-60"
                : item.result === "negative"
                  ? "text-green-60"
                  : "text-orange-60"
            }`}
          >
            {item.result || "-"}
          </td>
        </>
      );
    }
    return null;
  };

  return (
    <div className="mt-6 bg-white rounded-xl border border-grey-20 shadow-sm p-5">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-lg font-semibold text-grey-90">Data Analysis</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-grey-5 rounded-lg p-0.5 border border-grey-20">
            {(["site-wise", "disease-wise", "sample-wise"] as TabType[]).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setPage(1);
                  }}
                  className={`text-xs px-3 py-1.5 rounded-md transition-all ${
                    activeTab === tab
                      ? "bg-white text-grey-80 shadow-sm font-medium"
                      : "text-grey-60"
                  }`}
                >
                  {tab
                    .split("-")
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join("-")}
                </button>
              ),
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-grey-80">
            <span className="text-grey-60">Rows:</span>
            <Select
              name="rows"
              options={[10, 25, 50, 100].map((option) => ({
                label: String(option),
                value: option,
              }))}
              defaultValue={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              placeholder={String(limit)}
              isClearable={false}
            />
          </div>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-2 px-3 py-1.5 border border-grey-20 bg-white rounded-lg text-sm text-grey-80 hover:bg-grey-10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download
              className={`w-4 h-4 ${downloading ? "animate-bounce" : ""}`}
            />
            {downloading ? "Downloading..." : "Download"}
          </button>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-grey-10 border-b border-grey-20">
            <tr>
              {headers[activeTab].map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-semibold text-grey-70 uppercase tracking-wider whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-grey-10">
            {loading ? (
              <tr>
                <td colSpan={headers[activeTab].length} className="px-6 py-12">
                  <div className="flex justify-center items-center w-full">
                    <Loader />
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={headers[activeTab].length}
                  className="px-6 py-12 text-center text-grey-50"
                >
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index} className="hover:bg-grey-5 transition-colors">
                  {renderRow(row)}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 px-6 py-3 border-t border-grey-20 flex justify-between items-center">
        <p className="text-sm text-grey-60">
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg border border-grey-20 hover:bg-grey-5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 text-grey-80" />
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg border border-grey-20 hover:bg-grey-5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4 text-grey-80" />
          </button>
        </div>
      </div>

      {/* Address hover tooltip */}
      {hoveredAddress && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{ left: hoveredAddress.x + 16, top: hoveredAddress.y - 12 }}
        >
          <div className="bg-white text-grey-80 text-sm px-4 py-3 rounded-xl border border-grey-20 shadow-lg max-w-xs">
            {hoveredAddress.text}
          </div>
        </div>
      )}
    </div>
  );
}
