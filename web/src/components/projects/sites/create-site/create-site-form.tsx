"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import { useAtom } from "jotai";
import dynamic from "next/dynamic";

import { generateRandomCode } from "@/src/utils";
import {
  createSiteApi,
  updateSiteApi,
} from "@/src/app/(dashboard)/projects/[id]/create-site/actions";
import { getSiteDetailApi } from "@/src/app/(dashboard)/projects/[id]/sites/loader";
import { Region } from "@/src/types/global";
import type { Site } from "@/src/types/site";
import {
  DISEASE_SITE_CONFIG,
  SiteTypeOption,
  SITE_TYPES,
} from "@/src/utils/constant";
import { siteAtom } from "@/src/store/siteAtom";
import { projectAtom } from "@/src/store/projectAtom";
const MapRenderer = dynamic(() => import("@/src/components/ui/map-renderer"), {
  ssr: false,
});
import EditMapLocationModal from "@/src/components/projects/sites/edit-map-location";
import Select from "@/src/components/ui/select";

const AI_DISEASE_SHORT_NAME = "AI";

// Stored as strings, not booleans: older mobile APKs parse this field as String
const COLLECTION_CONSENT_OPTIONS = [
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
];

// ── Nominatim result type ──────────────────────────────────────────────────
type NominatimResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    postcode?: string;
    state?: string;
    // India uses several fields for district-level
    county?: string;
    state_district?: string;
    district?: string;
  };
};

/** Case-insensitive fuzzy match: return first item whose name contains the query */
function fuzzyMatch<T extends { name: string; id: string }>(
  items: T[],
  query: string | undefined,
): T | undefined {
  if (!query) return undefined;
  const q = query.toLowerCase().trim();
  return (
    items.find((i) => i.name.toLowerCase() === q) ??
    items.find((i) => i.name.toLowerCase().includes(q)) ??
    items.find((i) => q.includes(i.name.toLowerCase()))
  );
}

/** Parses a coordinate string, returning undefined for empty/non-finite input */
function toFiniteNumber(value: string): number | undefined {
  if (!value.trim()) return undefined;
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
}

export default function CreateSiteForm({
  className,
  onSiteCreated,
  onClose,
}: {
  className?: string;
  onSiteCreated?: (site: Site, forceExit?: boolean) => void;
  onClose?: () => void;
}) {
  const { id, siteId } = useParams<{ id: string; siteId: string }>();
  const siteCode = generateRandomCode(5);

  const [siteData, setSiteData] = useState({
    name: "",
    farmType: "",
    siteSubType: "",
    siteType: "",
    siteOwnerName: "",
    siteOwnerNumber: "",
    workerNumber: "",
    address: "",
    district: "",
    state: "",
    pinCode: "",
    latitude: "",
    longitude: "",
    collectionCollector: "",
    // New sites default to Yes; edit prefills the saved value instead
    collectionConsent: siteId ? "" : "true",
  });

  const [errors, setErrors] = useState({
    name: "",
    farmType: "",
    siteType: "",
    collectionConsent: "",
    diseases: "",
    address: "",
    district: "",
    state: "",
    pinCode: "",
    latitude: "",
    longitude: "",
  });

  const [selectedDiseaseIds, setSelectedDiseaseIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [states, setStates] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<Region[]>([]);
  const [selectedStateDistrict, setSelectedStateDistrict] = useState<{
    state?: string;
    district?: string;
  }>();
  const [shouldFetchLatLong, setShouldFetchLatLong] = useState<boolean>(true);
  const shouldFetchLatLongRef = useRef(shouldFetchLatLong);
  useEffect(() => {
    shouldFetchLatLongRef.current = shouldFetchLatLong;
  }, [shouldFetchLatLong]);
  const latLongFetchIdRef = useRef(0);
  const lastValidLocationRef = useRef<[number, number] | undefined>(undefined);
  const [site, setSite] = useAtom(siteAtom);
  const [project] = useAtom(projectAtom);

  // Address autocomplete state
  const [addressSuggestions, setAddressSuggestions] = useState<
    NominatimResult[]
  >([]);
  const [addressInputValue, setAddressInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [addressSearching, setAddressSearching] = useState(false);
  const addressDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const addressContainerRef = useRef<HTMLDivElement>(null);
  // Holds a district name from Nominatim to auto-select after districts load
  const pendingDistrictNameRef = useRef<string | null>(null);

  // Click outside to close address suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        addressContainerRef.current &&
        !addressContainerRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Nominatim address search
  const searchAddress = useCallback((query: string) => {
    if (query.length < 3) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    if (addressDebounceRef.current) clearTimeout(addressDebounceRef.current);
    addressDebounceRef.current = setTimeout(async () => {
      try {
        setAddressSearching(true);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6&countrycodes=in&q=${encodeURIComponent(query)}`,
        );
        const data: NominatimResult[] = await res.json();
        setAddressSuggestions(data);
        setShowSuggestions(data.length > 0);
      } catch {
        // Silently fail — user can still type manually
      } finally {
        setAddressSearching(false);
      }
    }, 400);
  }, []);

  const handleAddressInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddressInputValue(value);
    setSiteData((prev) => ({ ...prev, address: value }));
    setErrors((prev) => ({ ...prev, address: "" }));
    searchAddress(value);
  };

  const handleAddressSelect = (result: NominatimResult) => {
    const shortAddress = result.display_name;
    setAddressInputValue(shortAddress);

    // Try to auto-match state
    const nominatimStateName = result.address?.state;
    const matchedState = fuzzyMatch(states, nominatimStateName);

    // The district name from Nominatim (India uses state_district or county)
    const nominatimDistrictName =
      result.address?.state_district ??
      result.address?.district ??
      result.address?.county;

    setSiteData((prev) => ({
      ...prev,
      address: shortAddress,
      latitude: result.lat,
      longitude: result.lon,
      pinCode: result.address?.postcode ?? prev.pinCode,
      // Auto-select state if matched; reset district so it re-fetches
      state: matchedState ? matchedState.id : prev.state,
      district: "", // will be auto-set once districts load
    }));

    // Store district name for async matching after districts load
    pendingDistrictNameRef.current = nominatimDistrictName ?? null;

    // If state matched, trigger district fetch
    if (matchedState) {
      setSelectedStateDistrict((prev) => ({
        ...prev,
        state: matchedState.name,
        district: undefined,
      }));
    }

    // Prevent the state/district hook from overwriting lat/long
    setShouldFetchLatLong(false);
    setErrors((prev) => ({
      ...prev,
      address: "",
      latitude: "",
      longitude: "",
    }));
    setAddressSuggestions([]);
    setShowSuggestions(false);
  };

  // Disease-based site types
  const availableSiteTypes = useMemo<SiteTypeOption[]>(() => {
    if (selectedDiseaseIds.length === 0) return [];
    const selectedDiseases = (project?.diseases ?? []).filter((d) =>
      selectedDiseaseIds.includes(d.id),
    );

    // Merge site types from all selected diseases (deduplicate by value)
    const seen = new Set<string>();
    const merged: SiteTypeOption[] = [];
    for (const disease of selectedDiseases) {
      const config = DISEASE_SITE_CONFIG[disease.shortName] ?? [];
      for (const option of config) {
        if (!seen.has(option.value)) {
          seen.add(option.value);
          merged.push(option);
        }
      }
    }
    return merged;
  }, [selectedDiseaseIds, project?.diseases]);

  const availableSubTypes = useMemo(
    () =>
      availableSiteTypes.find((t) => t.value === siteData.farmType)?.subTypes ??
      [],
    [siteData.farmType, availableSiteTypes],
  );

  useEffect(() => {
    if (
      siteData.farmType &&
      availableSiteTypes.length > 0 &&
      !availableSiteTypes.find((t) => t.value === siteData.farmType)
    ) {
      setSiteData((prev) => ({ ...prev, farmType: "", siteSubType: "" }));
    }
  }, [availableSiteTypes]);

  useEffect(() => {
    if (availableSubTypes.length === 0 && siteData.siteSubType) {
      setSiteData((prev) => ({ ...prev, siteSubType: "" }));
    }
  }, [availableSubTypes]);

  // useEffect(() => {
  //   if (!states.length) {
  //     fetchRegions({ type: "state" })
  //       .then((response) => {
  //         if (response.success) setStates(response.data);
  //       })
  //       .catch(console.error);
  //   }
  // }, []);

  // useEffect(() => {
  //   if (siteData?.state) {
  //     fetchRegionsByRegionId(siteData.state)
  //       .then((response) => {
  //         if (response.success) {
  //           const subRegions: Region[] = response.data.subRegions;
  //           setDistricts(subRegions);

  //           // Auto-select district if we have a pending name from address pick
  //           if (pendingDistrictNameRef.current) {
  //             const matched = fuzzyMatch(subRegions, pendingDistrictNameRef.current);
  //             if (matched) {
  //               setSiteData((prev) => ({ ...prev, district: matched.id }));
  //               setSelectedStateDistrict((prev) => ({
  //                 ...prev,
  //                 district: matched.name,
  //               }));
  //             }
  //             pendingDistrictNameRef.current = null;
  //           }
  //         }
  //       })
  //       .catch(console.error);
  //   }
  // }, [siteData?.state]);
  // Replace these two useEffects:

  // Derive states from project.regions
  useEffect(() => {
    const projectStates = (project?.regions ?? []).filter(
      (r) => r.regionType === "state",
    );
    setStates(projectStates);
  }, [project?.regions]);

  // Derive districts from project.regions filtered by selected state
  useEffect(() => {
    if (!siteData.state) {
      setDistricts([]);
      return;
    }
    const projectDistricts = (project?.regions ?? []).filter(
      (r) =>
        r.regionType === "district" && r.parentRegion?.id === siteData.state,
    );
    setDistricts(projectDistricts);

    // Auto-select district if we have a pending name from address pick
    if (pendingDistrictNameRef.current) {
      const matched = fuzzyMatch(
        projectDistricts,
        pendingDistrictNameRef.current,
      );
      if (matched) {
        setSiteData((prev) => ({ ...prev, district: matched.id }));
        setSelectedStateDistrict((prev) => ({
          ...prev,
          district: matched.name,
        }));
      }
      pendingDistrictNameRef.current = null;
    }
  }, [siteData.state, project?.regions]);

  useEffect(() => {
    if (site && siteId === site?.id) {
      const addr = site.address ?? "";
      setAddressInputValue(addr);
      setSiteData((prev) => ({
        ...prev,
        name: site.name ?? "",
        farmType: site.farmType ?? "",
        siteSubType: site.siteSubType ?? "",
        siteType: site.siteType ?? "",
        siteOwnerName: site.siteOwnerName ?? "",
        siteOwnerNumber: String(site.siteOwnerNumber ?? ""),
        workerNumber: String(site.workerNumber ?? ""),
        // Unrecorded (pre-existing) sites stay unselected so the user must choose
        collectionConsent: COLLECTION_CONSENT_OPTIONS.some(
          (option) => option.value === site.collectionConsent,
        )
          ? (site.collectionConsent as string)
          : "",
        address: addr,
        district: site.location?.region?.id ?? "",
        state: site.location?.region?.parentRegion?.id ?? "",
        pinCode: String(site.pinCode ?? ""),
        latitude:
          site.location?.coordinates?.coordinates?.[1] != null
            ? String(site.location.coordinates.coordinates[1])
            : "",
        longitude:
          site.location?.coordinates?.coordinates?.[0] != null
            ? String(site.location.coordinates.coordinates[0])
            : "",
      }));
      if (site.diseases && site.diseases.length > 0) {
        setSelectedDiseaseIds(site.diseases.map((d) => d.id));
      }
      setShouldFetchLatLong(false);
      setSelectedStateDistrict({
        state: site.location?.region?.parentRegion?.name ?? "",
        district: site.location?.region?.name ?? "",
      });
    }
  }, [site?.id]);

  // Auto-fill lat/long from state+district when NOT set by address picker
  useEffect(() => {
    if (shouldFetchLatLong && selectedStateDistrict?.district) {
      const requestId = ++latLongFetchIdRef.current;
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          `${selectedStateDistrict.district},${selectedStateDistrict.state}`,
        )}`,
      )
        .then((res) => res.json())
        .then((data) => {
          // Ignore this response if a newer district lookup has started, or
          // if the user has since set coordinates manually (typed/dragged/address-picked)
          if (
            requestId !== latLongFetchIdRef.current ||
            !shouldFetchLatLongRef.current
          ) {
            return;
          }
          if (data.length > 0) {
            setSiteData((prev) => ({
              ...prev,
              latitude: data[0].lat,
              longitude: data[0].lon,
            }));
          }
        })
        .catch(() => {
          // Silently fail — user can still enter coordinates manually
        });
    }
  }, [selectedStateDistrict?.district]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const label =
      "label" in e.target ? (e.target as { label: string }).label : "";
    const newValues: Record<string, string> = { [name]: value };
    if (name === "state" || name === "district") {
      setSelectedStateDistrict((prev) => ({ ...prev, [name]: label }));
    }
    if (name === "latitude" || name === "longitude") {
      setShouldFetchLatLong(false);
    }
    if (value && name === "state") newValues.district = "";
    if (name === "farmType") newValues.siteSubType = "";
    setSiteData((prev) => ({ ...prev, ...newValues }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // const handleDiseaseToggle = (diseaseId: string) => {
  //   //setSelectedDiseaseIds((prev) => prev.includes(diseaseId) ? [] : [diseaseId]);
  //   // Fixed - true multi-select (toggle individual items)
  //   setSelectedDiseaseIds((prev) =>
  //     prev.includes(diseaseId)
  //       ? prev.filter((id) => id !== diseaseId)
  //       : [...prev, diseaseId]
  //   );
  //   setErrors((prev) => ({ ...prev, diseases: "" }));
  // };

  const handleDiseaseToggle = (diseaseId: string) => {
    const clickedDisease = projectDiseases.find((d) => d.id === diseaseId);
    const isAI = clickedDisease?.shortName === AI_DISEASE_SHORT_NAME;

    setSelectedDiseaseIds((prev) => {
      // Clicking an already-selected disease → deselect it
      if (prev.includes(diseaseId)) {
        return prev.filter((id) => id !== diseaseId);
      }

      if (isAI) {
        // AI can only be selected alone — clear everything else
        return [diseaseId];
      }

      // FMD / LSD: remove AI if it was selected, then add this one
      const withoutAI = prev.filter((id) => {
        const d = projectDiseases.find((p) => p.id === id);
        return d?.shortName !== AI_DISEASE_SHORT_NAME;
      });
      return [...withoutAI, diseaseId];
    });

    setErrors((prev) => ({ ...prev, diseases: "" }));
  };
  const validate = () => {
    const newErrors = {
      name: "",
      farmType: "",
      siteType: "",
      collectionConsent: "",
      diseases: "",
      address: "",
      district: "",
      state: "",
      pinCode: "",
      latitude: "",
      longitude: "",
    };

    if (!siteData.name.trim()) newErrors.name = "Site name is required.";
    if (!siteData.collectionConsent)
      newErrors.collectionConsent = "Collection consent is required.";
    if (!siteId && !siteData.farmType)
      newErrors.farmType = "Farm type is required.";
    if (!siteId && selectedDiseaseIds.length === 0)
      newErrors.diseases = "Please select at least one disease.";
    if (!siteData.address.trim()) newErrors.address = "Address is required.";
    if (!siteData.district) newErrors.district = "District is required.";
    if (!siteData.state) newErrors.state = "State is required.";
    if (siteData.pinCode && !/^\d{6}$/.test(siteData.pinCode.trim())) {
      newErrors.pinCode = "Pincode must be exactly 6 digits.";
    }
    const latitudeValue = toFiniteNumber(siteData.latitude);
    if (latitudeValue === undefined) {
      newErrors.latitude = "Valid latitude is required.";
    } else if (latitudeValue < -90 || latitudeValue > 90) {
      newErrors.latitude = "Latitude must be between -90 and 90.";
    }
    const longitudeValue = toFiniteNumber(siteData.longitude);
    if (longitudeValue === undefined) {
      newErrors.longitude = "Valid longitude is required.";
    } else if (longitudeValue < -180 || longitudeValue > 180) {
      newErrors.longitude = "Longitude must be between -180 and 180.";
    }

    setErrors(newErrors);

    console.log(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const buildPayload = () => ({
    siteCode,
    ...siteData,
    siteType: siteData.siteType || undefined,
    // The API rejects "", so an unanswered consent is omitted
    collectionConsent: siteData.collectionConsent || undefined,
    diseaseIds: selectedDiseaseIds,
    siteOwnerNumber: siteData.siteOwnerNumber
      ? Number(siteData.siteOwnerNumber)
      : undefined,
    workerNumber: siteData.workerNumber
      ? Number(siteData.workerNumber)
      : undefined,
    pinCode: siteData.pinCode ? Number(siteData.pinCode) : undefined,
    latitude: Number(siteData.latitude),
    longitude: Number(siteData.longitude),
    regionId: siteData.district,
  });

  const handleCreateSubmit = async (forceExit?: boolean) => {
    if (!validate()) return;
    try {
      setLoading(true);
      const { success, message, data } = await createSiteApi(
        id,
        buildPayload(),
      );
      if (success && data.id) {
        toast.success("Site created successfully!");
        const { data: created } = await getSiteDetailApi(id, data.id);
        if (onSiteCreated) onSiteCreated(created, forceExit);
      } else {
        toast.error(message || "Error creating site. Please try again.");
      }
    } catch (error) {
      toast.error(
        (error as Error)?.message || "Error creating site. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubmit = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      const payload = buildPayload() as Record<string, unknown>;
      delete payload.diseaseIds;
      payload.state = undefined;
      payload.district = undefined;
      const { success, message } = await updateSiteApi(id, siteId, payload);
      const { data: siteDetail } = await getSiteDetailApi(id, siteId);
      setSite({ ...site, ...siteDetail });
      if (success) {
        toast.success("Site details updated successfully!");
        if (onClose) onClose();
      } else {
        toast.error(message || "Error updating site. Please try again.");
      }
    } catch (error) {
      toast.error(
        (error as Error)?.message || "Error updating site. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const projectDiseases = project?.diseases ?? [];

  // Keep showing the last valid position while the user is mid-edit on one
  // of the two coordinate fields, instead of falling back to the map default.
  const mapLocation = useMemo<[number, number] | undefined>(() => {
    const lat = toFiniteNumber(siteData.latitude);
    const lng = toFiniteNumber(siteData.longitude);
    if (lat !== undefined && lng !== undefined) {
      lastValidLocationRef.current = [lat, lng];
      return [lat, lng];
    }
    return lastValidLocationRef.current;
  }, [siteData.latitude, siteData.longitude]);

  return (
    <>
      <div
        className={
          "w-full flex-col justify-start items-start gap-6 flex " + className
        }
      >
        {/* ── Site Name ── */}
        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          <label className="text-sm font-medium text-grey-80">
            Name of Site <span className="text-red-500">*</span>
          </label>
          <div className="flex h-10 items-center gap-3 self-stretch rounded-lg border border-grey-40 bg-white px-3 py-2">
            <input
              name="name"
              className="w-full text-grey-80 placeholder:text-grey-70 text-sm leading-[21px] outline-none bg-transparent"
              placeholder="Enter site name"
              onChange={handleChange}
              value={siteData.name}
            />
          </div>
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* ── Disease Selection ── */}
        {!siteId && (
          <div className="self-stretch flex flex-col justify-start items-start gap-2">
            <label className="text-sm font-medium text-grey-80">
              Diseases <span className="text-red-500">*</span>
            </label>
            <p className="text-grey-60 text-sm">
              Select the diseases this site is being monitored for.
            </p>
            {projectDiseases.length === 0 ? (
              <p className="text-grey-50 text-sm italic">
                No diseases configured for this project.
              </p>
            ) : (
              <div className="self-stretch px-0.5 rounded justify-start items-start gap-3 flex flex-wrap">
                {projectDiseases.map((disease) => {
                  const isChecked = selectedDiseaseIds.includes(disease.id);
                  return (
                    <button
                      key={disease.id}
                      type="button"
                      onClick={() => handleDiseaseToggle(disease.id)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
                        isChecked
                          ? "bg-blue-40 border-primary-500 text-white"
                          : "bg-white border-grey-20 text-grey-70 hover:border-primary-500 hover:bg-primary-50"
                      }`}
                    >
                      {disease.shortName || disease.name}
                    </button>
                  );
                })}
              </div>
            )}
            {errors.diseases && (
              <p className="text-red-500 text-sm">{errors.diseases}</p>
            )}
          </div>
        )}

        {/* ── Farm Type (disease-based) ── */}
        {!siteId && selectedDiseaseIds.length > 0 && (
          <div className="self-stretch flex flex-col justify-start items-start gap-2">
            <label className="self-stretch text-sm font-medium text-grey-80">
              Farm Type <span className="text-red-500">*</span>
            </label>
            {availableSiteTypes.length === 0 ? (
              <p className="text-grey-50 text-sm italic">
                No Farm types configured for the selected disease(s).
              </p>
            ) : (
              <div className="self-stretch px-0.5 rounded justify-start items-start gap-3 flex flex-wrap">
                {availableSiteTypes.map((siteTypeOption) => (
                  <div
                    key={siteTypeOption.value}
                    className="flex min-w-[140px] flex-1 max-w-xs cursor-pointer items-center gap-2 rounded-lg bg-grey-10 px-3 py-2 border border-transparent hover:border-grey-30 transition-all"
                    onClick={() => {
                      setSiteData((prev) => ({
                        ...prev,
                        farmType: siteTypeOption.value,
                        siteSubType: "",
                      }));
                      setErrors((prev) => ({ ...prev, farmType: "" }));
                    }}
                  >
                    <input
                      type="radio"
                      id={siteTypeOption.value}
                      className="pointer-events-none relative peer h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-lg border border-grey-50 accent-primary-500 checked:border-[5px] checked:border-primary-700"
                      name="farmType"
                      value={siteTypeOption.value}
                      readOnly
                      checked={siteTypeOption.value === siteData["farmType"]}
                    />
                    <label
                      htmlFor={siteTypeOption.value}
                      className="pointer-events-none self-stretch cursor-pointer text-sm font-medium text-grey-80"
                    >
                      {siteTypeOption.label}
                    </label>
                  </div>
                ))}
              </div>
            )}
            {errors.farmType && (
              <p className="text-red-500 text-sm">{errors.farmType}</p>
            )}
          </div>
        )}

        {/* ── Sub-Type ── */}
        {!siteId && availableSubTypes.length > 0 && (
          <div className="self-stretch flex flex-col justify-start items-start gap-2">
            <label className="self-stretch text-sm font-medium text-grey-80">
              Sub-type
            </label>
            <div className="self-stretch px-0.5 rounded justify-start items-start gap-3 flex flex-wrap">
              {availableSubTypes.map((sub) => (
                <div
                  key={sub.value}
                  className="flex min-w-[140px] flex-1 max-w-xs cursor-pointer items-center gap-2 rounded-lg bg-grey-10 px-3 py-2 border border-transparent hover:border-grey-30 transition-all"
                  onClick={() => {
                    setSiteData((prev) => ({
                      ...prev,
                      siteSubType:
                        prev.siteSubType === sub.value ? "" : sub.value,
                    }));
                  }}
                >
                  <input
                    type="radio"
                    id={`subtype_${sub.value}`}
                    className="pointer-events-none relative peer h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-lg border border-grey-50 accent-primary-500 checked:border-[5px] checked:border-primary-700"
                    name="siteSubType"
                    value={sub.value}
                    readOnly
                    checked={sub.value === siteData["siteSubType"]}
                  />
                  <label
                    htmlFor={`subtype_${sub.value}`}
                    className="pointer-events-none self-stretch cursor-pointer text-sm font-medium text-grey-80"
                  >
                    {sub.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Site Type (Govt/Private/Corporate) ── */}
        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          <label className="text-sm font-medium text-grey-80">Site Type</label>
          <div className="self-stretch px-0.5 rounded justify-start items-start gap-3 flex flex-wrap">
            {SITE_TYPES.map((type) => (
              <div
                key={type}
                className="flex min-w-[140px] flex-1 max-w-xs cursor-pointer items-center gap-2 rounded-lg bg-grey-10 px-3 py-2 border border-transparent hover:border-grey-30 transition-all"
                onClick={() => {
                  setSiteData((prev) => ({
                    ...prev,
                    siteType: prev.siteType === type ? "" : type,
                  }));
                  setErrors((prev) => ({ ...prev, siteType: "" }));
                }}
              >
                <input
                  type="radio"
                  id={`sitetype_${type}`}
                  className="pointer-events-none relative peer h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-lg border border-grey-50 accent-primary-500 checked:border-[5px] checked:border-primary-700"
                  name="siteType"
                  value={type}
                  readOnly
                  checked={type === siteData["siteType"]}
                />
                <label
                  htmlFor={`sitetype_${type}`}
                  className="pointer-events-none self-stretch cursor-pointer capitalize text-sm font-medium text-grey-80"
                >
                  {type}
                </label>
              </div>
            ))}
          </div>
          {errors.siteType && (
            <p className="text-red-500 text-sm">{errors.siteType}</p>
          )}
        </div>

        {/* ── Collection Consent (Yes/No) ── */}
        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          <label className="text-sm font-medium text-grey-80">
            Collection Consent <span className="text-red-500">*</span>
          </label>
          <p className="text-grey-60 text-sm">
            Has the site owner consented to sample collection?
          </p>
          <div className="self-stretch px-0.5 rounded justify-start items-start gap-3 flex flex-wrap">
            {COLLECTION_CONSENT_OPTIONS.map((option) => (
              <div
                key={option.value}
                className="flex min-w-[140px] flex-1 max-w-xs cursor-pointer items-center gap-2 rounded-lg bg-grey-10 px-3 py-2 border border-transparent hover:border-grey-30 transition-all"
                onClick={() => {
                  setSiteData((prev) => ({
                    ...prev,
                    collectionConsent: option.value,
                  }));
                  setErrors((prev) => ({ ...prev, collectionConsent: "" }));
                }}
              >
                <input
                  type="radio"
                  id={`consent_${option.value}`}
                  className="pointer-events-none relative peer h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-lg border border-grey-50 accent-primary-500 checked:border-[5px] checked:border-primary-700"
                  name="collectionConsent"
                  value={option.value}
                  readOnly
                  checked={option.value === siteData.collectionConsent}
                />
                <label
                  htmlFor={`consent_${option.value}`}
                  className="pointer-events-none self-stretch cursor-pointer text-sm font-medium text-grey-80"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
          {errors.collectionConsent && (
            <p className="text-red-500 text-sm">{errors.collectionConsent}</p>
          )}
        </div>

        {/* ── Owner & Phone & Workers (3 columns evenly distributed) ── */}
        <div className="w-full self-stretch flex flex-col sm:flex-row gap-4 items-start">
          <div className="flex-1 w-full flex flex-col items-start gap-2">
            <label className="text-sm font-medium text-grey-80">
              Name of Owner / Caretaker
            </label>
            <div className="flex h-10 items-center gap-3 self-stretch rounded-lg border border-grey-40 bg-white px-3 py-2">
              <input
                name="siteOwnerName"
                className="w-full text-grey-80 placeholder:text-grey-70 text-sm leading-[21px] outline-none bg-transparent"
                placeholder="Enter name"
                onChange={handleChange}
                value={siteData.siteOwnerName}
              />
            </div>
          </div>
          <div className="flex-1 w-full flex flex-col items-start gap-2">
            <label className="text-sm font-medium text-grey-80">
              Phone Number
            </label>
            <div className="flex h-10 items-center gap-2 self-stretch rounded-lg border border-grey-40 bg-white px-3 py-2">
              <span className="shrink-0 text-sm font-medium text-grey-70">
                +91
              </span>
              <input
                type="number"
                name="siteOwnerNumber"
                className="w-full text-sm text-grey-80 outline-none placeholder:text-grey-70 bg-transparent"
                placeholder="Enter phone number"
                onChange={handleChange}
                value={siteData.siteOwnerNumber}
              />
            </div>
          </div>
          <div className="flex-1 w-full flex flex-col items-start gap-2">
            <label className="text-sm font-medium text-grey-80">
              No. of Workers
            </label>
            <div className="flex h-10 items-center gap-3 self-stretch rounded-lg border border-grey-40 bg-white px-3 py-2">
              <input
                type="number"
                name="workerNumber"
                className="w-full text-grey-80 placeholder:text-grey-70 text-sm leading-[21px] outline-none bg-transparent"
                placeholder="Enter workers' number"
                onChange={handleChange}
                value={siteData.workerNumber}
              />
            </div>
          </div>
        </div>

        {/* ── Address with Autocomplete ── */}
        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          <label className="text-sm font-medium text-grey-80">
            Address <span className="text-red-500">*</span>
          </label>
          <div ref={addressContainerRef} className="self-stretch relative">
            <div className="self-stretch h-10 px-3 py-2 bg-white rounded-lg border border-grey-40 justify-start items-center gap-3 flex w-full">
              <input
                name="address"
                className="w-full text-grey-80 placeholder:text-grey-70 text-sm leading-[21px] outline-none bg-transparent"
                placeholder="Search for an address…"
                onChange={handleAddressInput}
                value={addressInputValue}
                autoComplete="off"
                onFocus={() => {
                  if (addressSuggestions.length > 0) setShowSuggestions(true);
                }}
              />
              {addressSearching && (
                <div className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
              )}
            </div>

            {/* Suggestions dropdown */}
            {showSuggestions && (
              <ul className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-grey-20 rounded-lg shadow-lg overflow-hidden max-h-60 overflow-y-auto">
                {addressSuggestions.map((result) => (
                  <li
                    key={result.place_id}
                    className="cursor-pointer border-b border-grey-10 px-3 py-2.5 text-sm text-grey-80 last:border-b-0 hover:bg-primary-50"
                    onMouseDown={() => handleAddressSelect(result)}
                  >
                    {result.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address}</p>
          )}
        </div>

        {/* ── State / District / Pincode (3 columns evenly distributed) ── */}
        <div className="w-full self-stretch flex flex-col sm:flex-row gap-4 items-start">
          <div className="flex-1 w-full flex flex-col items-start gap-2">
            <label className="text-sm font-medium text-grey-80">
              State <span className="text-red-500">*</span>
            </label>
            <Select
              name="state"
              className="self-stretch w-full"
              onChange={handleChange}
              defaultValue={siteData.state}
              options={states.map((state) => ({
                label: state.name,
                value: state.id,
              }))}
              placeholder="Select state"
            />
            {errors.state && (
              <p className="text-red-500 text-sm">{errors.state}</p>
            )}
          </div>
          <div className="flex-1 w-full flex flex-col items-start gap-2">
            <label className="text-sm font-medium text-grey-80">
              District <span className="text-red-500">*</span>
            </label>
            <Select
              name="district"
              className="self-stretch w-full"
              onChange={handleChange}
              defaultValue={siteData.district}
              options={districts.map((region) => ({
                label: region.name,
                value: region.id,
              }))}
              placeholder={
                !siteData.state ? "Select state first" : "Select district"
              }
            />
            {errors.district && (
              <p className="text-red-500 text-sm">{errors.district}</p>
            )}
          </div>
          <div className="flex-1 w-full flex flex-col items-start gap-2">
            <label className="text-sm font-medium text-grey-80">Pincode</label>
            <div className="flex h-10 items-center gap-3 self-stretch rounded-lg border border-grey-40 bg-white px-3 py-2">
              <input
                type="number"
                name="pinCode"
                className="w-full text-grey-80 placeholder:text-grey-70 text-sm leading-[21px] outline-none bg-transparent"
                placeholder="Enter pincode"
                onChange={handleChange}
                value={siteData.pinCode}
              />
            </div>
            {errors.pinCode && (
              <p className="text-red-500 text-sm">{errors.pinCode}</p>
            )}
          </div>
        </div>

        {/* ── Latitude & Longitude (2 columns evenly distributed) ── */}
        <div className="w-full self-stretch flex flex-col sm:flex-row gap-4 items-start">
          <div className="flex-1 w-full flex flex-col items-start gap-2">
            <label className="text-sm font-medium text-grey-80">
              Latitude <span className="text-red-500">*</span>
            </label>
            <div className="flex h-10 items-center gap-3 self-stretch rounded-lg border border-grey-40 bg-white px-3 py-2">
              <input
                type="number"
                step="any"
                name="latitude"
                className="w-full text-grey-80 placeholder:text-grey-70 text-sm leading-[21px] outline-none bg-transparent"
                placeholder="Enter latitude (e.g. 20.5937)"
                onChange={handleChange}
                value={siteData.latitude}
              />
            </div>
            {errors.latitude && (
              <p className="text-red-500 text-sm">{errors.latitude}</p>
            )}
          </div>
          <div className="flex-1 w-full flex flex-col items-start gap-2">
            <label className="text-sm font-medium text-grey-80">
              Longitude <span className="text-red-500">*</span>
            </label>
            <div className="flex h-10 items-center gap-3 self-stretch rounded-lg border border-grey-40 bg-white px-3 py-2">
              <input
                type="number"
                step="any"
                name="longitude"
                className="w-full text-grey-80 placeholder:text-grey-70 text-sm leading-[21px] outline-none bg-transparent"
                placeholder="Enter longitude (e.g. 78.9629)"
                onChange={handleChange}
                value={siteData.longitude}
              />
            </div>
            {errors.longitude && (
              <p className="text-red-500 text-sm">{errors.longitude}</p>
            )}
          </div>
        </div>

        {/* ── Map ── */}
        <div className="relative flex-1 self-stretch rounded-xl border border-grey-20">
          <button
            className="z-10 inline-flex items-center gap-2 rounded-lg border border-primary-500 bg-white px-3 py-1 text-sm text-primary-500 transition-colors hover:bg-primary-50 absolute bottom-[15px] left-[15px]"
            onClick={() => setIsOpen(true)}
            type="button"
          >
            <div className="w-4 h-4 relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
              >
                <path
                  d="M3.33333 13.1667H4.276L10.4853 6.95739L9.54267 6.01472L3.33333 12.2241V13.1667ZM14 14.5001H2V11.6714L10.9567 2.71472C11.0817 2.58974 11.2512 2.51953 11.428 2.51953C11.6048 2.51953 11.7743 2.58974 11.8993 2.71472L13.7853 4.60072C13.9103 4.72574 13.9805 4.89528 13.9805 5.07206C13.9805 5.24883 13.9103 5.41837 13.7853 5.54339L6.162 13.1667H14V14.5001ZM10.4853 5.07206L11.428 6.01472L12.3707 5.07206L11.428 4.12939L10.4853 5.07206Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            Edit Map Region
          </button>
          <div className="relative w-full h-56 rounded overflow-hidden">
            <MapRenderer location={mapLocation} />
          </div>
        </div>
      </div>

      {/* ── Actions ── */}
      {!siteId ? (
        <div className="inline-flex items-center justify-end gap-3 pt-3">
          <button
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary-500 bg-white px-4 py-2.5 text-sm font-medium text-primary-500 transition-colors hover:bg-primary-50"
            onClick={() => handleCreateSubmit(true)}
            type="button"
          >
            Save &amp; Exit
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-40 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:bg-grey-50"
            onClick={() => handleCreateSubmit(false)}
            disabled={loading}
            type="button"
          >
            Proceed
          </button>
        </div>
      ) : (
        <div className="inline-flex items-center justify-end gap-3 rounded-bl-lg rounded-br-lg border-t border-grey-20 bg-white px-7 pt-5 pb-6">
          <div className="flex items-center justify-end gap-5">
            <button
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary-500 bg-white px-4 py-2.5 text-sm font-medium text-primary-500 transition-colors hover:bg-primary-50"
              onClick={onClose}
              disabled={loading}
              type="button"
            >
              Cancel
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-40 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
              onClick={handleUpdateSubmit}
              disabled={loading}
              type="button"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      <EditMapLocationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        location={mapLocation}
        onLocationUpdate={(newLocation) => {
          setShouldFetchLatLong(false);
          setSiteData((prev) => ({ ...prev, ...newLocation }));
          setErrors((prev) => ({ ...prev, latitude: "", longitude: "" }));
        }}
      />
    </>
  );
}
