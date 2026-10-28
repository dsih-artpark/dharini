import {
  Crosshair,
  Info,
  LayoutGrid,
  Loader2,
  type LucideIcon,
  MapPin,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  X,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import Select from "@/src/components/ui/select";
import { PlaceSearch } from "../compare/PlaceSearch";
import { formatDay, formatPercent } from "../prediction/utils";
import { CELL_KM } from "../risk/regionGrid";
import type {
  RegionList,
  RiskOutcome,
  RiskPlace,
  RiskPrediction,
} from "../risk/useRiskPrediction";
import { Hint, Step } from "./controls";

/**
 * The Risk Map side panel: where (a State / District / Sub-district, a
 * surveillance site, or a searched place - the one set last), the date, and
 * "Predict risk", which asks the disease model whether that place is a risk
 * zone on that date.
 */
export function RiskMapTab({ risk }: { risk: RiskPrediction }) {
  const { diseaseState, regions } = risk;

  if (diseaseState.status === "off") {
    return <Hint>Disease risk isn&apos;t turned on for this server.</Hint>;
  }
  if (diseaseState.status === "error") {
    return (
      <p className="text-xs text-grey-70">
        {diseaseState.message}{" "}
        <button
          type="button"
          onClick={risk.retryDisease}
          className="font-semibold text-blue-40 hover:underline"
        >
          Retry
        </button>
      </p>
    );
  }

  const disease = diseaseState.status === "ready" ? diseaseState.disease : null;
  const grid = risk.regionGrid;
  // A state isn't predicted; a region only once its cells are known, and
  // only while some still have no answer
  const canPredict =
    !!disease &&
    !!risk.place &&
    !!risk.date &&
    !risk.predicting &&
    (risk.mode === "point" ||
      (risk.mode === "grid" && !!grid && grid.toAsk > 0));
  let predictLabel = "Predict risk";
  if (grid?.running && grid.progress) {
    predictLabel = `Predicting ${grid.progress.done} / ${grid.progress.total} cells…`;
  } else if (risk.predicting) {
    predictLabel = "Predicting…";
  } else if (grid && grid.toAsk === 0) {
    predictLabel = "All cells predicted";
  } else if (grid && grid.counts.pending === 0 && grid.counts.failed > 0) {
    predictLabel = `Retry ${grid.counts.failed} failed cells`;
  }

  return (
    <>
      <Step title="Region">
        <RegionSelect
          name="riskState"
          noun="state"
          list={regions.states}
          value={regions.stateId}
          onPick={regions.pickState}
        />
        <RegionSelect
          name="riskDistrict"
          noun="district"
          list={regions.districts}
          value={regions.districtId}
          onPick={regions.pickDistrict}
          above={{ noun: "state", picked: !!regions.stateId }}
        />
        <RegionSelect
          name="riskSubdistrict"
          noun="sub-district"
          list={regions.subdistricts}
          value={regions.subdistrictId}
          onPick={regions.pickSubdistrict}
          above={{ noun: "district", picked: !!regions.districtId }}
        />
        <p className="text-[11px] text-grey-60">
          Regions: Local Government Directory (via bharatlas, CC0)
        </p>
      </Step>

      <Step title="Site">
        <SiteField risk={risk} />
      </Step>

      <Step title="Date">
        <input
          type="date"
          aria-label="Date"
          value={risk.date}
          max={risk.maxDate}
          onChange={(e) => risk.setDate(e.target.value)}
          className="min-h-9 w-full rounded-lg border border-grey-30 bg-white px-2.5 text-[13px] text-grey-80"
        />
        {disease && (
          <p className="text-[11px] text-grey-60">
            Uses the weather of the {disease.inputs.window_days} days up to this
            date.
          </p>
        )}
      </Step>

      <div className="flex flex-col gap-2">
        {risk.mode === "state" ? (
          <Hint>
            Pick a district or sub-district to predict. A whole state isn&apos;t
            predicted.
          </Hint>
        ) : risk.mode === "grid" && risk.place ? (
          <p className="text-xs text-grey-60">
            For{" "}
            <span className="font-semibold text-grey-80">
              {risk.place.name}
            </span>
            {risk.place.area && ` · ${risk.place.area}`} ·{" "}
            {grid
              ? `${grid.total} cells of ${grid.cellKm} × ${grid.cellKm} km${
                  grid.toAsk > 0
                    ? ` · ${grid.requests} request${grid.requests === 1 ? "" : "s"}`
                    : ""
                }${
                  grid.toAsk < grid.total
                    ? ` · ${grid.total - grid.toAsk} already predicted`
                    : ""
                }`
              : "loading its boundary…"}
          </p>
        ) : risk.place ? (
          <p className="text-xs text-grey-60">
            For{" "}
            <span className="font-semibold text-grey-80">
              {risk.place.name}
            </span>
            {risk.place.area && ` · ${risk.place.area}`} ·{" "}
            {risk.place.lat.toFixed(2)}° N, {risk.place.lng.toFixed(2)}° E
          </p>
        ) : (
          <p className="text-xs text-grey-60">
            Choose a region, a site or a place.
          </p>
        )}
        <button
          type="button"
          onClick={risk.predict}
          disabled={!canPredict}
          className="flex min-h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-blue-40 text-[13px] font-semibold text-white hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {risk.predicting && (
            <Loader2 size={14} aria-hidden="true" className="animate-spin" />
          )}
          {predictLabel}
        </button>
        {diseaseState.status === "loading" && (
          <p className="text-[11px] text-grey-60">Loading the risk model…</p>
        )}
      </div>

      <div role="status" aria-live="polite">
        {risk.mode === "grid" && grid && disease && (
          <RegionResult
            grid={grid}
            threshold={disease.threshold}
            windowDays={disease.inputs.window_days}
            date={risk.date}
            placeName={risk.place?.name ?? ""}
            placeArea={risk.place?.area}
            regionNoun={regions.subdistrictId ? "sub-district" : "district"}
          />
        )}
        {risk.mode === "point" && risk.predictError && (
          <p className="text-xs text-red-30">{risk.predictError}</p>
        )}
        {risk.mode === "point" && risk.outcome && disease && risk.place && (
          <PointResult
            outcome={risk.outcome}
            place={risk.place}
            windowDays={disease.inputs.window_days}
            date={risk.date}
          />
        )}
      </div>
    </>
  );
}

/**
 * A site's or searched place's answer: the probability for the 6 × 6 km
 * around it, against the risk threshold.
 */
function PointResult({
  outcome,
  place,
  windowDays,
  date,
}: {
  outcome: RiskOutcome;
  place: RiskPlace;
  windowDays: number;
  date: string;
}) {
  const noun = place.source === "site" ? "site" : "place";
  return (
    <ResultCard
      answer={{
        atRisk: outcome.atRisk,
        title: outcome.atRisk ? "High risk detected" : "No high risk detected",
        highlight: {
          value: formatPercent(outcome.probability),
          label: "Predicted probability",
        },
        stats: [
          {
            icon: Crosshair,
            label: "Risk threshold",
            value: formatPercent(outcome.threshold),
          },
          {
            icon: MapPin,
            label: "Location",
            value: `${place.lat.toFixed(2)}° N, ${place.lng.toFixed(2)}° E`,
          },
        ],
        note: `This map shows the predicted risk for the ${CELL_KM} × ${CELL_KM} km around the selected ${noun} based on weather conditions. ${
          outcome.atRisk
            ? "Its probability is at or above the risk threshold; it does not confirm that the disease is present."
            : "It does not indicate the absence of the disease, only that the area didn't reach the risk threshold."
        }`,
      }}
      subtitle={[place.name, place.area].filter(Boolean).join(" • ")}
      windowDays={windowDays}
      date={date}
      coverage={{
        title: "1 grid cell assessed",
        detail: `(${CELL_KM} × ${CELL_KM} km, centred on the ${noun})`,
      }}
    />
  );
}

/**
 * A district's or sub-district's answers: the share of its answered cells
 * the model puts at or above the risk threshold, the highest probability,
 * and how many cells were assessed.
 */
function RegionResult({
  grid,
  threshold,
  windowDays,
  date,
  placeName,
  placeArea,
  regionNoun,
}: {
  grid: NonNullable<RiskPrediction["regionGrid"]>;
  threshold: number;
  windowDays: number;
  date: string;
  placeName: string;
  placeArea?: string;
  /** "district" or "sub-district" */
  regionNoun: string;
}) {
  const { counts } = grid;
  const answered = counts.risk + counts.not_risk;
  if (answered === 0 && counts.failed === 0 && !grid.error) return null;

  const atRisk = counts.risk > 0;
  return (
    <ResultCard
      answer={
        answered > 0
          ? {
              atRisk,
              title: atRisk
                ? "High-risk areas detected"
                : "No high-risk areas detected",
              highlight: {
                value: formatPercent(counts.risk / answered),
                label: "Area classified as high risk",
              },
              stats: [
                {
                  icon: TrendingUp,
                  label: "Highest predicted probability",
                  value:
                    grid.maxProbability !== null
                      ? formatPercent(grid.maxProbability)
                      : "–",
                },
                {
                  icon: Crosshair,
                  label: "Risk threshold",
                  value: formatPercent(threshold),
                },
              ],
              note: `This map shows the predicted risk for the selected ${regionNoun} based on weather conditions. ${
                atRisk
                  ? "Red cells exceeded the risk threshold; it does not confirm that the disease is present."
                  : "It does not indicate the absence of the disease, only that no areas exceeded the risk threshold."
              }`,
            }
          : null
      }
      subtitle={[placeName, placeArea].filter(Boolean).join(" • ")}
      windowDays={windowDays}
      date={date}
      coverage={{
        title:
          answered === grid.total
            ? `${grid.total} grid cells assessed`
            : `${answered} of ${grid.total} grid cells assessed`,
        detail: `(${grid.cellKm} × ${grid.cellKm} km each)${
          counts.failed > 0 ? ` · ${counts.failed} with no data` : ""
        }`,
      }}
      error={grid.error}
    />
  );
}

interface ResultStat {
  icon: LucideIcon;
  label: string;
  value: string;
}

/**
 * The result card a region, site or place gets: at risk or not, a headline
 * figure and two more, what was assessed, and what the result does and
 * doesn't mean. `answer` is null while the model hasn't answered yet.
 */
function ResultCard({
  answer,
  subtitle,
  windowDays,
  date,
  coverage,
  error,
}: {
  answer: {
    atRisk: boolean;
    title: string;
    highlight: { value: string; label: string };
    stats: [ResultStat, ResultStat];
    note: string;
  } | null;
  subtitle: string;
  windowDays: number;
  date: string;
  coverage: { title: string; detail: string };
  error?: string | null;
}) {
  const atRisk = !!answer?.atRisk;
  const tone = atRisk
    ? {
        pill: "bg-red-10 text-red-30",
        dot: "bg-red-30",
        card: "bg-red-10",
        badge: "bg-red-30/10 text-red-30",
        divider: "bg-red-20",
        value: "text-red-30",
      }
    : {
        pill: "bg-green-10 text-green-30",
        dot: "bg-green-30",
        card: "bg-green-10",
        badge: "bg-green-30/10 text-green-30",
        divider: "bg-green-20",
        value: "text-green-30",
      };
  const StatusIcon = atRisk ? ShieldAlert : ShieldCheck;

  return (
    <Step title="Result">
      <div className="flex flex-col gap-3 rounded-xl border border-grey-20 bg-white p-3 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-grey-60">
            <Shield size={14} aria-hidden="true" className="text-blue-40" />
            Predicted disease risk
          </span>
          {answer && (
            <span
              className={`flex flex-shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${tone.pill}`}
            >
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full ${tone.dot}`}
              />
              {atRisk ? "High risk" : "Low risk"}
            </span>
          )}
        </div>

        <div>
          {answer && (
            <h4 className="text-base font-bold leading-snug text-grey-80">
              {answer.title}
            </h4>
          )}
          <p className="text-xs text-grey-60">{subtitle}</p>
        </div>

        {answer && (
          <>
            <div
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ${tone.card}`}
            >
              <span
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${tone.badge}`}
              >
                <StatusIcon size={20} aria-hidden="true" />
              </span>
              <span
                aria-hidden="true"
                className={`w-px self-stretch ${tone.divider}`}
              />
              <span className="min-w-0">
                <span
                  className={`block text-2xl font-bold tabular-nums leading-tight ${tone.value}`}
                >
                  {answer.highlight.value}
                </span>
                <span className="block text-xs text-grey-70">
                  {answer.highlight.label}
                </span>
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="grid grid-cols-2 divide-x divide-grey-20">
                {answer.stats.map(({ icon: Icon, label, value }, i) => (
                  <div
                    key={label}
                    className={`flex gap-1.5 ${i === 0 ? "pr-2" : "pl-2"}`}
                  >
                    <Icon
                      size={16}
                      aria-hidden="true"
                      className="mt-0.5 flex-shrink-0 text-blue-40"
                    />
                    <span className="min-w-0">
                      <span className="block text-[11px] leading-tight text-grey-60">
                        {label}
                      </span>
                      <span className="block text-base font-bold tabular-nums text-grey-80">
                        {value}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-grey-60">
                Based on the preceding {windowDays} days of weather data, up to{" "}
                {formatDay(new Date(`${date}T00:00:00`))}.
              </p>
            </div>

            <div className="h-px bg-grey-20" aria-hidden="true" />
          </>
        )}

        <div className="flex items-center gap-3 rounded-lg bg-blue-10 px-3 py-2.5">
          <LayoutGrid
            size={18}
            aria-hidden="true"
            className="flex-shrink-0 text-grey-70"
          />
          <span aria-hidden="true" className="w-px self-stretch bg-grey-30" />
          <span className="min-w-0">
            <span className="block text-[13px] font-semibold text-grey-80">
              {coverage.title}
            </span>
            <span className="block text-[11px] text-grey-60">
              {coverage.detail}
            </span>
          </span>
        </div>

        {error && <p className="text-xs text-red-30">{error}</p>}

        {answer && (
          <p className="flex gap-1.5 text-[11px] text-grey-60">
            <Info
              size={13}
              aria-hidden="true"
              className="mt-px flex-shrink-0"
            />
            <span>{answer.note}</span>
          </p>
        )}
      </div>
    </Step>
  );
}

/**
 * One region dropdown. It waits for the region above it, says while its list
 * loads, and offers a retry when the list couldn't load.
 */
function RegionSelect({
  name,
  noun,
  list,
  value,
  onPick,
  above,
}: {
  name: string;
  /** e.g. "district" */
  noun: string;
  list: RegionList;
  value: string;
  onPick: (id: string) => void;
  /** The region this list sits under, when it needs one picked first. */
  above?: { noun: string; picked: boolean };
}) {
  const waiting = above && !above.picked;
  const empty = !waiting && !list.loading && list.items.length === 0;
  const options = useMemo(
    () => list.items.map((r) => ({ label: r.name, value: String(r.id) })),
    [list.items],
  );
  let placeholder = `Select ${noun}`;
  if (list.loading) placeholder = `Loading ${noun}s…`;
  else if (list.failed) placeholder = `Couldn't load ${noun}s`;
  else if (empty) placeholder = `No ${noun}s`;

  return (
    <>
      <Select
        name={name}
        className="w-full"
        options={options}
        defaultValue={value}
        onChange={(e) => onPick(String(e.target.value))}
        placeholder={placeholder}
        noResultsText={
          waiting ? `Select a ${above.noun} first` : `No matching ${noun}s`
        }
        disabled={waiting || empty}
      />
      {list.failed && (
        <p className="text-xs text-red-30">
          Couldn&apos;t load the {noun}s.{" "}
          <button
            type="button"
            onClick={list.retry}
            className="font-semibold text-blue-40 hover:underline"
          >
            Retry
          </button>
        </p>
      )}
    </>
  );
}

const ICON_BUTTON =
  "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-grey-60 hover:bg-black/5 hover:text-grey-80";

/**
 * The site row, as in Compare: the picked site or searched place, else the
 * site dropdown; a button that turns the row into the place search; and a
 * clear button.
 */
function SiteField({ risk }: { risk: RiskPrediction }) {
  const [searching, setSearching] = useState(false);
  const stopSearching = useCallback(() => setSearching(false), []);
  const options = useMemo(
    () => risk.pickableSites.map((s) => ({ label: s.name, value: s.id })),
    [risk.pickableSites],
  );
  // A region is shown in its dropdowns, not here
  const picked =
    risk.place && risk.place.source !== "region" ? risk.place : null;

  return (
    <div className="relative flex min-h-10 min-w-0 items-center gap-2 rounded-lg border border-grey-30 bg-white py-1 pl-2.5 pr-1 hover:border-grey-40">
      {searching ? (
        <PlaceSearch
          label="Search a place"
          onPick={(place) => {
            risk.pickPlace(place);
            setSearching(false);
          }}
          onCancel={stopSearching}
        />
      ) : (
        <>
          <span className="min-w-0 flex-1">
            {picked ? (
              <span className="block min-w-0">
                <span className="block truncate text-[13px] font-semibold leading-tight text-grey-80">
                  {picked.name}
                </span>
                {picked.area && (
                  <span className="block truncate text-[11px] leading-tight text-grey-60">
                    {picked.area}
                  </span>
                )}
              </span>
            ) : options.length > 0 ? (
              <Select
                name="riskSite"
                options={options}
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value) risk.pickSite(String(e.target.value));
                }}
                placeholder="Select site"
                isClearable={false}
                noResultsText="No matching sites"
                className="!h-7 w-full !min-w-0 !border-0 !bg-transparent !px-0 !py-0"
              />
            ) : (
              <span className="block truncate text-[13px] text-grey-60">
                Search a place
              </span>
            )}
          </span>
          <button
            type="button"
            onClick={() => setSearching(true)}
            aria-label="Search a place"
            title="Search a place"
            className={ICON_BUTTON}
          >
            <Search size={15} />
          </button>
          {picked && (
            <button
              type="button"
              onClick={risk.clearPlace}
              aria-label="Clear site"
              title="Clear site"
              className={ICON_BUTTON}
            >
              <X size={15} />
            </button>
          )}
        </>
      )}
    </div>
  );
}
