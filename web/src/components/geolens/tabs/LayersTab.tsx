import { Check, Crosshair } from "lucide-react";
import {
  BASE_MAPS,
  type BaseMapKey,
} from "@/src/app/(dashboard)/geolens/types";
import { LayerRow, Step, Switch } from "./controls";

// Two-tone swatch per base map so the options are recognisable at a glance.
const SWATCH: Record<BaseMapKey, [string, string]> = {
  osm: ["#F2EFE9", "#AAD3DF"],
  satellite: ["#4B5A35", "#1B3550"],
  topo: ["#EDEFDF", "#A9C9E2"],
};

interface LayersTabProps {
  baseMap: BaseMapKey;
  onBaseMapChange: (value: BaseMapKey) => void;
  showSurveillanceSites: boolean;
  setShowSurveillanceSites: (value: boolean) => void;
  surveillanceSiteCount: number;
  showPoultryLayer: boolean;
  setShowPoultryLayer: (value: boolean) => void;
  poultryCount?: number;
  isPoultryLoading: boolean;
  showCattleMarketLayer: boolean;
  setShowCattleMarketLayer: (value: boolean) => void;
  cattleMarketCount?: number;
  isCattleMarketLoading: boolean;
}

export function LayersTab(props: LayersTabProps) {
  const {
    baseMap,
    onBaseMapChange,
    showSurveillanceSites,
    setShowSurveillanceSites,
    surveillanceSiteCount,
    showPoultryLayer,
    setShowPoultryLayer,
    poultryCount,
    isPoultryLoading,
    showCattleMarketLayer,
    setShowCattleMarketLayer,
    cattleMarketCount,
    isCattleMarketLoading,
  } = props;

  return (
    <>
      <Step title="Base maps">
        <div
          role="radiogroup"
          aria-label="Base map"
          className="flex flex-col gap-2"
        >
          {BASE_MAPS.map((b) => {
            const active = b.value === baseMap;
            const [land, water] = SWATCH[b.value];
            return (
              <button
                key={b.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onBaseMapChange(b.value)}
                className={`grid grid-cols-[44px_minmax(0,1fr)_16px] items-center gap-2.5 rounded-lg border px-2.5 py-2 text-left transition-colors ${
                  active
                    ? "border-blue-40 bg-blue-10"
                    : "border-grey-20 bg-white hover:bg-grey-10"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="h-7 w-11 rounded-md border border-grey-20"
                  style={{
                    background: `linear-gradient(135deg, ${land} 0 55%, ${water} 55% 100%)`,
                  }}
                />
                <span className="min-w-0 text-[13px] font-semibold text-grey-80">
                  {b.label}
                  <span className="block text-[11px] font-normal text-grey-60">
                    {b.hint}
                  </span>
                </span>
                {active && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-40 text-white">
                    <Check size={11} strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Step>

      <Step title="Surveillance">
        <LayerRow
          icon={<Crosshair size={15} />}
          title="Surveillance sites"
          count={surveillanceSiteCount}
          hint="Red core positive, yellow negative, size by samples"
          control={
            <Switch
              label="Surveillance sites"
              checked={showSurveillanceSites}
              onChange={setShowSurveillanceSites}
            />
          }
        />
      </Step>

      <Step title="Ecological context">
        <LayerRow
          icon={<span aria-hidden="true">🐔</span>}
          title="Poultry farms"
          count={poultryCount}
          hint="All registered farms"
          loading={isPoultryLoading}
          control={
            <Switch
              label="Poultry farms"
              checked={showPoultryLayer}
              onChange={setShowPoultryLayer}
            />
          }
        />
        <LayerRow
          icon={<span aria-hidden="true">🐄</span>}
          title="Cattle markets"
          count={cattleMarketCount}
          hint="With operating day"
          loading={isCattleMarketLoading}
          control={
            <Switch
              label="Cattle markets"
              checked={showCattleMarketLayer}
              onChange={setShowCattleMarketLayer}
            />
          }
        />
      </Step>
    </>
  );
}
