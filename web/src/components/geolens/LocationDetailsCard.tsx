import React, { useMemo } from "react";
import { ExternalLink, X } from "lucide-react";
import Image from "next/image";
import type {
  Site,
  BirdObservation,
  PoultryFarm,
} from "@/src/app/(dashboard)/geolens/types";
import type { WeatherData } from "@/src/app/(dashboard)/geolens/loader";
import { haversineKm } from "@/src/app/(dashboard)/geolens/utils/geo";
import type { NearestWetlandResult } from "@/src/app/(dashboard)/geolens/utils/geo";
import { SITE_COLORS } from "./tabs/CompareTab";

interface LocationDetailsCardProps {
  searchPin: Site;
  searchWeather: WeatherData | null;
  searchBirds: BirdObservation[];
  searchFarms: PoultryFarm[];
  nearestWetland: NearestWetlandResult | null;
  searchWetlandArea: number;
  radius: number;
  onClose: () => void;
  onAssignToSite: (slot: "A" | "B") => void;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h4 className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-grey-60">
        {title}
      </h4>
      {children}
    </section>
  );
}

function Tile({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="rounded-lg bg-grey-10 px-2.5 py-2">
      <b className="block text-lg font-semibold tabular-nums text-grey-80">
        {value}
      </b>
      <span className="text-[11px] text-grey-60">{label}</span>
    </div>
  );
}

function ListBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-2 max-h-[150px] overflow-y-auto rounded-lg border border-grey-20">
      {children}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-2 rounded-lg bg-grey-10 p-2.5 text-xs text-grey-60">
      {children}
    </div>
  );
}

/** Floating card on the map for a searched location or a clicked surveillance site. */
export function LocationDetailsCard({
  searchPin,
  searchWeather,
  searchBirds,
  searchFarms,
  nearestWetland,
  searchWetlandArea,
  radius,
  onClose,
  onAssignToSite,
}: LocationDetailsCardProps) {
  const totalBirds = useMemo(
    () => searchBirds.reduce((sum, b) => sum + (b.howMany || 1), 0),
    [searchBirds],
  );

  const sortedSpecies = useMemo(() => {
    const map = new Map<string, number>();
    searchBirds.forEach((b) => {
      map.set(b.comName, (map.get(b.comName) || 0) + (b.howMany || 1));
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [searchBirds]);

  const farmsWithDistance = useMemo(
    () =>
      searchFarms
        .map((f) => ({
          ...f,
          distance: haversineKm(
            searchPin.end[0],
            searchPin.end[1],
            f.lat,
            f.lng,
          ),
        }))
        .sort((a, b) => a.distance - b.distance),
    [searchFarms, searchPin],
  );

  return (
    <aside
      aria-label="Location details"
      className="absolute right-16 top-3 z-[1050] flex max-h-[calc(100%-24px)] w-[330px] max-w-[calc(100%-76px)] flex-col overflow-hidden rounded-xl border border-grey-20 bg-white shadow-xl"
    >
      <div className="flex items-start justify-between gap-2 border-b border-grey-20 px-3.5 py-3">
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-grey-80">Location details</h3>
          <p className="mt-0.5 break-words text-xs text-grey-60">
            {searchPin.name}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          title="Close site details"
          aria-label="Close site details"
          className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-lg border border-grey-30 text-grey-70 hover:bg-grey-10"
        >
          <X size={15} />
        </button>
      </div>

      <div className="flex min-h-0 flex-col gap-3.5 overflow-y-auto px-3.5 py-3">
        <Section title="Current weather">
          {searchWeather ? (
            <div className="rounded-xl bg-gradient-to-br from-[#1a6b9e] to-[#0e4c72] p-3 text-white">
              <div className="flex items-center gap-2.5">
                {searchWeather.icon && (
                  <Image
                    src={`https://openweathermap.org/img/wn/${searchWeather.icon}@2x.png`}
                    alt={searchWeather.description}
                    width={40}
                    height={40}
                    unoptimized
                  />
                )}
                <div>
                  <div className="text-2xl font-semibold">
                    {searchWeather.temp}°C
                  </div>
                  <div className="text-[11px] capitalize opacity-90">
                    {searchWeather.description}
                  </div>
                </div>
                <div className="ml-auto text-right text-[11px]">
                  <div>Feels like {searchWeather.feelsLike}°C</div>
                  <div>Humidity: {searchWeather.humidity}%</div>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] opacity-90">
                <div>Wind: {searchWeather.windSpeed} m/s</div>
                <div>Pressure: {searchWeather.pressure} hPa</div>
              </div>
            </div>
          ) : (
            <Empty>No weather details available</Empty>
          )}
        </Section>

        <Section title="Bird observations">
          <div className="grid grid-cols-2 gap-2">
            <Tile value={totalBirds.toLocaleString()} label="Total birds" />
            <Tile value={sortedSpecies.length} label="Total species" />
          </div>
          {sortedSpecies.length > 0 ? (
            <ListBox>
              {sortedSpecies.map((item) => (
                <div
                  key={item.name}
                  className="flex justify-between gap-2 border-b border-grey-20 px-2.5 py-1.5 text-xs last:border-b-0"
                >
                  <span className="text-grey-80">{item.name}</span>
                  <span className="font-mono text-grey-60">{item.count}</span>
                </div>
              ))}
            </ListBox>
          ) : (
            <Empty>No bird species recorded.</Empty>
          )}
        </Section>

        <Section title="Poultry farms">
          <div className="grid grid-cols-2 gap-2">
            <Tile
              value={searchFarms.length}
              label={`Farms within ${radius} km`}
            />
          </div>
          {farmsWithDistance.length > 0 ? (
            <ListBox>
              {farmsWithDistance.map((f) => (
                <div
                  key={f.id}
                  className="flex justify-between gap-2 border-b border-grey-20 px-2.5 py-1.5 text-xs last:border-b-0"
                >
                  <span className="text-grey-80">{f.name}</span>
                  <span className="whitespace-nowrap font-mono text-grey-60">
                    {f.distance.toFixed(1)} km
                  </span>
                </div>
              ))}
            </ListBox>
          ) : (
            <Empty>No poultry farms within {radius}km.</Empty>
          )}
        </Section>

        <Section title="Nearest wetland">
          {nearestWetland ? (
            <div className="text-[13px]">
              <b className="font-semibold text-grey-80">
                {nearestWetland.wetland.name || "Wetland"}
              </b>
              <div className="mt-1 flex justify-between text-xs text-grey-60">
                <span>Shortest distance</span>
                <strong className="text-green-30">
                  {nearestWetland.distKm.toFixed(2)} km
                </strong>
              </div>
              <div className="mt-0.5 flex justify-between text-xs text-grey-60">
                <span>Total wetland area ({radius} km)</span>
                <strong className="text-green-30">
                  {searchWetlandArea.toFixed(2)} Ha
                </strong>
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&origin=${searchPin.end[0]},${searchPin.end[1]}&destination=${nearestWetland.wetland.lat},${nearestWetland.wetland.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#27ae60] py-2 text-xs font-semibold text-white hover:bg-[#219653]"
              >
                Get directions on Google Maps <ExternalLink size={12} />
              </a>
            </div>
          ) : (
            <Empty>No wetlands registered.</Empty>
          )}
        </Section>

        <Section title="Want to compare this site?">
          <div className="grid grid-cols-2 gap-2">
            {(["A", "B"] as const).map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => onAssignToSite(slot)}
                className="flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-grey-30 text-xs font-semibold text-grey-80 hover:bg-grey-10"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: SITE_COLORS[slot] }}
                />
                Set as Site {slot}
              </button>
            ))}
          </div>
        </Section>
      </div>
    </aside>
  );
}
