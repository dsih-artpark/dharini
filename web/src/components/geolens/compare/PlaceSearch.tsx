"use client";

import { Loader2, MapPin, Search, X } from "lucide-react";
import type React from "react";
import { useEffect, useId, useRef, useState } from "react";

/** One place suggested by Photon. */
export interface PlaceSuggestion {
  id: string;
  name: string;
  /** Town or taluk, and state, e.g. "Aivarakandapura, Karnataka". */
  area: string;
  /** What OpenStreetMap calls it, e.g. "reservoir", "village". */
  kind: string;
  lat: number;
  lng: number;
}

// Photon: komoot's open-source geocoder over OpenStreetMap data, called from
// the browser like the top bar's Nominatim search. India only - GeoLens's
// layers and the bird forecast cover nothing else.
const PHOTON_URL = "https://photon.komoot.io/api/";
const INDIA_BBOX = "68.0,6.4,97.5,37.2"; // minLon,minLat,maxLon,maxLat
const MIN_CHARS = 3;
const DEBOUNCE_MS = 300;
const MAX_RESULTS = 6;

interface PhotonFeature {
  geometry: { coordinates: [number, number] };
  properties: {
    osm_type?: string;
    osm_id?: number;
    osm_value?: string;
    type?: string;
    name?: string;
    street?: string;
    housenumber?: string;
    city?: string;
    county?: string;
    district?: string;
    state?: string;
    countrycode?: string;
  };
}

async function searchPlaces(
  query: string,
  signal: AbortSignal,
): Promise<PlaceSuggestion[]> {
  const params = new URLSearchParams({
    q: query,
    limit: "10",
    lang: "en",
    bbox: INDIA_BBOX,
  });
  const res = await fetch(`${PHOTON_URL}?${params}`, { signal });
  if (!res.ok) throw new Error(`Photon responded ${res.status}`);
  const data: { features?: PhotonFeature[] } = await res.json();

  const seen = new Set<string>();
  const places: PlaceSuggestion[] = [];
  for (const f of data.features ?? []) {
    const p = f.properties;
    // The box also takes in parts of the neighbouring countries
    if (p.countrycode !== "IN") continue;
    const name =
      p.name ?? [p.housenumber, p.street].filter(Boolean).join(" ").trim();
    if (!name) continue;
    const local = p.city ?? p.county ?? p.district;
    const area = [local !== name ? local : undefined, p.state]
      .filter(Boolean)
      .join(", ");
    const key = `${name}|${area}`.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const [lng, lat] = f.geometry.coordinates;
    places.push({
      id: `${p.osm_type ?? ""}${p.osm_id ?? key}`,
      name,
      area,
      kind: (
        (p.osm_value === "administrative" ? p.type : p.osm_value) ?? ""
      ).replace(/_/g, " "),
      lat,
      lng,
    });
    if (places.length === MAX_RESULTS) break;
  }
  return places;
}

type Status = "idle" | "loading" | "done" | "error";

// Suggestions already fetched this session, by query. The box mounts only
// while a site is being searched, so the memory lives here, not in it.
const recent = new Map<string, PlaceSuggestion[]>();
const RECENT_MAX = 100;
const remember = (key: string, places: PlaceSuggestion[]) => {
  if (recent.size >= RECENT_MAX) recent.delete(recent.keys().next().value!);
  recent.set(key, places);
};

/**
 * "Search a place" with suggestions as you type, made to sit inside a site
 * row: it fills the row, and the suggestion list hangs under the whole row
 * (the row must be `position: relative`). Picking a place hands it to
 * `onPick`; Esc, the × or leaving it empty closes it via `onCancel`.
 */
export function PlaceSearch({
  label,
  onPick,
  onCancel,
}: {
  /** Accessible name, e.g. "Search a place for Site A". */
  label: string;
  onPick: (place: PlaceSuggestion) => void;
  onCancel: () => void;
}) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlaceSuggestion[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState(-1);

  const q = query.trim();
  const tooShort = q.length < MIN_CHARS;

  // Ask Photon once typing pauses; a newer query cancels the older request.
  useEffect(() => {
    if (tooShort) {
      setResults([]);
      setStatus("idle");
      setActive(-1);
      return;
    }
    const key = q.toLowerCase();
    const known = recent.get(key);
    if (known) {
      setResults(known);
      setStatus("done");
      setActive(known.length > 0 ? 0 : -1);
      return;
    }
    const controller = new AbortController();
    setStatus("loading");
    const timer = setTimeout(() => {
      searchPlaces(q, controller.signal)
        .then((found) => {
          remember(key, found);
          setResults(found);
          setStatus("done");
          setActive(found.length > 0 ? 0 : -1);
        })
        .catch(() => {
          if (controller.signal.aborted) return;
          setResults([]);
          setStatus("error");
        });
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [q, tooShort]);

  // A click elsewhere closes the list, and closes the search if it's empty.
  // Capture phase: the map's controls stop their clicks from bubbling.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return;
      setOpen(false);
      if (!rootRef.current?.querySelector("input")?.value.trim()) onCancel();
    };
    document.addEventListener("mousedown", onDown, true);
    return () => document.removeEventListener("mousedown", onDown, true);
  }, [onCancel]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const n = results.length;
    if (e.key === "ArrowDown" && n > 0) {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (i + 1) % n);
    } else if (e.key === "ArrowUp" && n > 0) {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (i <= 0 ? n - 1 : i - 1));
    } else if (e.key === "Enter") {
      if (open && active >= 0 && results[active]) {
        e.preventDefault();
        onPick(results[active]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      if (open && !tooShort) setOpen(false);
      else onCancel();
    }
  };

  const showList = open && !tooShort && status !== "idle";

  return (
    <div ref={rootRef} className="flex min-w-0 flex-1 items-center gap-1.5">
      <Search size={14} aria-hidden="true" className="shrink-0 text-grey-60" />
      <input
        type="text"
        role="combobox"
        aria-label={label}
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={
          showList && active >= 0 ? `${listId}-${active}` : undefined
        }
        placeholder="Search a place in India"
        autoComplete="off"
        spellCheck={false}
        // Opened on purpose from the row's search button
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[13px] text-grey-80 outline-none placeholder:text-grey-50"
      />
      {status === "loading" && (
        <Loader2
          size={14}
          aria-label="Searching"
          className="shrink-0 animate-spin text-grey-60"
        />
      )}
      <button
        type="button"
        onClick={onCancel}
        aria-label="Close place search"
        title="Close place search"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-grey-60 hover:bg-black/5 hover:text-grey-80"
      >
        <X size={15} />
      </button>

      {showList && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-grey-30 bg-white shadow-xl">
          <ul
            id={listId}
            role="listbox"
            aria-label={`${label}: suggestions`}
            className="max-h-[240px] overflow-y-auto"
          >
            {results.map((r, i) => (
              <li
                key={r.id}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                // Keep focus in the box so the list doesn't close first
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onPick(r)}
                onMouseEnter={() => setActive(i)}
                className={`flex cursor-pointer items-start gap-2 px-3 py-2 ${
                  i === active ? "bg-blue-10" : ""
                }`}
              >
                <MapPin
                  size={14}
                  aria-hidden="true"
                  className={`mt-0.5 shrink-0 ${i === active ? "text-blue-40" : "text-grey-60"}`}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-2">
                    <span className="truncate text-[13px] font-semibold text-grey-80">
                      {r.name}
                    </span>
                    {r.kind && (
                      <span className="shrink-0 text-[11px] capitalize text-grey-60">
                        {r.kind}
                      </span>
                    )}
                  </span>
                  {r.area && (
                    <span className="block truncate text-[11px] text-grey-60">
                      {r.area}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
          {status === "loading" && results.length === 0 && (
            <p className="px-3 py-2.5 text-xs text-grey-60">Searching…</p>
          )}
          {status === "done" && results.length === 0 && (
            <p className="px-3 py-2.5 text-xs text-grey-60">
              No places in India match &ldquo;{q}&rdquo;.
            </p>
          )}
          {status === "error" && (
            <p className="px-3 py-2.5 text-xs text-grey-70">
              Place search isn&apos;t available right now. Try again, or click
              the map.
            </p>
          )}
          <p className="border-t border-grey-20 bg-grey-10 px-3 py-1.5 text-[10px] text-grey-60">
            Places by{" "}
            <a
              href="https://photon.komoot.io"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Photon
            </a>{" "}
            (komoot) · ©{" "}
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              OpenStreetMap
            </a>{" "}
            contributors
          </p>
        </div>
      )}
    </div>
  );
}
