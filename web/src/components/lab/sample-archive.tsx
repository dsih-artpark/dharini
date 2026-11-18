"use client";

import { useEffect, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import { toast } from "react-toastify";
import { Eye, SearchIcon, Trash2 } from "lucide-react";

import Select from "@/src/components/ui/select";
import Loader from "@/src/components/ui/loader";
import Pagination from "@/src/components/ui/pagination";
import DiscardedSampleDetail from "@/src/components/lab/discarded-sample-detail";
import { getDiscardedSamplesApi } from "@/src/app/(dashboard)/lab/loader";
import { fetchDisease } from "@/src/app/(dashboard)/project-onboarding/loader";
import { diseaseAtom } from "@/src/store/diseaseAtom";
import { labAllProjectsAtom } from "@/src/store/labAllProjectsAtom";
import { currentWorkspaceAtom } from "@/src/store/currentWorkspaceAtom";
import { ALL_PROJECTS_ID } from "@/src/lib/super-admin-lab-flow";
import { useCurrentProjectResolver } from "@/src/hooks/use-current-project";
import { DISEASE_COLOR_CODE } from "@/src/utils/constant";
import {
  DISCARD_STAGES,
  formatDateTime,
  getDiscardStage,
  getDiscardStageLabel,
  getLastCompletedStep,
  getUserName,
} from "@/src/utils/discard";
import type { DiscardStage, Sample } from "@/src/types/sample";

const PAGE_SIZE = 10;

const COLUMNS = [
  "Sample",
  "Accession ID",
  "Disease",
  "Stopped at",
  "Reason",
  "By / On",
  "Actions",
];

export default function SampleArchive() {
  const isAll = useAtomValue(labAllProjectsAtom);
  const currentWorkspace = useAtomValue(currentWorkspaceAtom);
  const { resolveProjectId } = useCurrentProjectResolver();
  const projectId = isAll ? ALL_PROJECTS_ID : resolveProjectId();
  const [diseases, setDiseases] = useAtom(diseaseAtom);

  const [samples, setSamples] = useState<Sample[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [diseaseId, setDiseaseId] = useState("");
  const [stage, setStage] = useState<DiscardStage | "">("");
  const [viewSample, setViewSample] = useState<Sample | null>(null);

  const hasFilters = !!(search || diseaseId || stage);

  useEffect(() => {
    if (diseases.length) return;
    fetchDisease()
      .then((response) => {
        if (response.success) setDiseases(response.data);
      })
      .catch((e) => console.error("Error fetching diseases", e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const next = searchInput.trim();
      if (next === search) return;
      setSearch(next);
      setPage(1);
    }, 400);
    return () => window.clearTimeout(timeout);
  }, [searchInput, search]);

  useEffect(() => {
    if (!projectId) return;
    let cancelled = false;
    setLoading(true);
    getDiscardedSamplesApi(projectId, {
      search: search || undefined,
      diseaseId: diseaseId || undefined,
      stage: stage || undefined,
      page,
      limit: PAGE_SIZE,
      workspaceId: currentWorkspace?.id,
    })
      .then((response) => {
        if (cancelled) return;
        setSamples(response.data || []);
        setTotalPages(response.totalPages || 0);
      })
      .catch((error) => {
        if (cancelled) return;
        setSamples([]);
        toast.error((error as Error)?.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [projectId, currentWorkspace?.id, search, diseaseId, stage, page]);

  const selectStage = (next: DiscardStage | "") => {
    setStage(next);
    setPage(1);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        {/* Filters */}
        <div className="grid grid-cols-1 gap-3 bg-grey-10 px-5 py-4 sm:px-6 md:grid-cols-[1fr_220px_220px]">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="archive-search"
              className="text-xs font-bold uppercase tracking-wider text-grey-70"
            >
              Search
            </label>
            <div className="flex h-10 items-center gap-2 rounded-lg border border-grey-40 bg-white px-3 shadow-sm transition-all focus-within:ring-2 focus-within:ring-blue-40/10 hover:border-blue-40">
              <SearchIcon className="h-4 w-4 shrink-0 text-grey-50" />
              <input
                id="archive-search"
                className="w-full bg-transparent text-sm outline-none"
                placeholder="Sample ID, accession ID, reason"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-grey-70">
              Disease
            </label>
            <Select
              name="diseaseId"
              options={diseases.map((d) => ({ label: d.name, value: d.id }))}
              defaultValue={diseaseId}
              placeholder="All diseases"
              onChange={(e) => {
                setDiseaseId(String(e.target.value || ""));
                setPage(1);
              }}
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-grey-70">
              Stopped at step
            </label>
            <Select
              name="stage"
              options={DISCARD_STAGES}
              defaultValue={stage}
              placeholder="All steps"
              onChange={(e) =>
                selectStage((e.target.value || "") as DiscardStage | "")
              }
              className="w-full"
            />
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse">
            <thead>
              <tr className="border-y border-grey-20 bg-grey-10">
                {COLUMNS.map((column, i) => (
                  <th
                    key={column}
                    className={`py-3 pr-4 text-left ${
                      i === 0 ? "pl-5 sm:pl-6" : ""
                    } ${i === COLUMNS.length - 1 ? "sm:pr-6 text-right" : ""}`}
                  >
                    <span className="text-xs font-semibold uppercase tracking-wider text-grey-70">
                      {column}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={COLUMNS.length} className="py-10">
                    <div className="flex items-center justify-center">
                      <Loader />
                    </div>
                  </td>
                </tr>
              ) : samples.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNS.length} className="py-14">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-grey-10 text-grey-60">
                        <Trash2 size={20} strokeWidth={1.8} />
                      </div>
                      <p className="text-base font-medium text-grey-80">
                        No discarded samples
                      </p>
                      <p className="text-sm text-grey-70">
                        {hasFilters
                          ? "Nothing matches these filters."
                          : "Samples discarded between Pre-processing and Testing will appear here."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                samples.map((sample) => (
                  <tr
                    key={sample.id}
                    className="border-b border-grey-20 align-top transition-colors hover:bg-grey-10"
                  >
                    {/* Sample */}
                    <td className="py-4 pl-5 pr-4 sm:pl-6">
                      <button
                        type="button"
                        onClick={() => setViewSample(sample)}
                        className="text-[15px] font-semibold text-blue-40 hover:underline"
                      >
                        {sample.barcode}
                      </button>
                      <p className="mt-0.5 max-w-[240px] truncate text-sm capitalize text-grey-70">
                        {[sample.sampleType?.name, sample.site?.name]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </td>

                    {/* Accession ID */}
                    <td className="py-4 pr-4">
                      <span className="font-mono text-sm tracking-wide text-grey-70">
                        {sample.accessionId || "—"}
                      </span>
                    </td>

                    {/* Disease */}
                    <td className="py-4 pr-4">
                      <div className="flex flex-wrap gap-1.5">
                        {sample.diseases?.length ? (
                          sample.diseases.map((disease, i) => (
                            <span
                              key={disease.id}
                              className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-grey-80 ${
                                DISEASE_COLOR_CODE.BG_COLOR[
                                  (disease.index ?? i) % 6
                                ]
                              }`}
                            >
                              {disease.shortName}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-grey-50">—</span>
                        )}
                      </div>
                    </td>

                    {/* Stopped at */}
                    <td className="py-4 pr-4">
                      <span className="inline-flex whitespace-nowrap rounded-md bg-red-10 px-2 py-0.5 text-xs font-semibold text-red-30">
                        Discarded ·{" "}
                        {getDiscardStageLabel(
                          getDiscardStage(sample.sampleStatus),
                        )}
                      </span>
                      <p className="mt-1 whitespace-nowrap text-xs text-grey-70">
                        Last done: {getLastCompletedStep(sample)}
                      </p>
                    </td>

                    {/* Reason */}
                    <td className="py-4 pr-4">
                      <p className="max-w-[280px] text-sm font-medium text-grey-80">
                        {sample.discardReason || "—"}
                      </p>
                      {sample.discardComment && (
                        <p
                          className="mt-0.5 line-clamp-2 max-w-[280px] text-xs text-grey-70"
                          title={sample.discardComment}
                        >
                          {sample.discardComment}
                        </p>
                      )}
                    </td>

                    {/* By / On */}
                    <td className="py-4 pr-4">
                      <p className="whitespace-nowrap text-sm text-grey-80">
                        {getUserName(sample.discardedBy)}
                      </p>
                      <p className="mt-0.5 whitespace-nowrap text-xs text-grey-70">
                        {formatDateTime(sample.discardedAt)}
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="py-4 pr-4 text-right sm:pr-6">
                      <button
                        type="button"
                        onClick={() => setViewSample(sample)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-grey-20 bg-white px-3 py-1.5 text-xs font-medium text-grey-70 shadow-sm transition-all hover:border-blue-30 hover:bg-blue-10/40 hover:text-blue-40"
                      >
                        <Eye size={14} strokeWidth={2} />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="overflow-hidden rounded-b-2xl">
          <Pagination
            page={page}
            totalPages={totalPages}
            goToPage={setPage}
            loading={loading}
          />
        </div>
      </div>

      {viewSample && projectId && (
        <DiscardedSampleDetail
          sample={viewSample}
          projectId={projectId}
          onClose={() => setViewSample(null)}
        />
      )}
    </div>
  );
}
