import { useEffect, useMemo, useRef, useState } from "react";
import { useAtomValue } from "jotai";

import { userAtom } from "@/src/store/userAtom";
import { currentWorkspaceAtom } from "@/src/store/currentWorkspaceAtom";
import { getAllProjectsApi } from "@/src/app/(dashboard)/manage/loader";
import {
  fetchProjectRegions,
  fetchRegionsByRegionId,
} from "@/src/app/(dashboard)/project-onboarding/loader";
import { getProjectSitesApi } from "@/src/app/(dashboard)/projects/[id]/sites/loader";
import { getProjectSampleTypesApi } from "@/src/app/(dashboard)/monitor/loader";
import type { Disease, Region } from "@/src/types/global";
import type { SampleType } from "@/src/types/sample";
import type { Site } from "@/src/types/site";
import type { FilterType } from "@/src/types/statistics";

export interface SelectOption {
  label: string;
  value: string | number;
}

export const RESULT_OPTIONS: SelectOption[] = [
  { label: "Positive", value: "positive" },
  { label: "Negative", value: "negative" },
  { label: "Inconclusive", value: "unclear" },
];

export type FilterGroupKey =
  | "stateId"
  | "districtId"
  | "diseaseId"
  | "siteId"
  | "sampleTypeId"
  | "testResult";

export interface FilterChip {
  key: FilterGroupKey | "projectId";
  name: string;
  value: string;
}

interface ProjectLite {
  id: string;
  name: string;
  diseases: Disease[];
  regions: Region[];
}

interface SiteLite {
  id: string;
  name: string;
  stateId?: string;
  districtId?: string;
  lat?: number;
  lng?: number;
}

/** A site the user can access that has a location, for the "Pick site" dropdowns. */
export interface PickableSite {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

// Sites store a GeoJSON point ([lng, lat]); older rows only have latitude/longitude.
const siteCoords = (site: Site): { lat?: number; lng?: number } => {
  const point = site.location?.coordinates?.coordinates;
  if (point && Number.isFinite(point[0]) && Number.isFinite(point[1])) {
    return { lat: point[1], lng: point[0] };
  }
  if (Number.isFinite(site.latitude) && Number.isFinite(site.longitude)) {
    return { lat: site.latitude, lng: site.longitude };
  }
  return {};
};

export function useSurveillanceFilters() {
  const user = useAtomValue(userAtom);
  // The workspace picked in the app header; projects and sites are scoped to it.
  const workspaceId = useAtomValue(currentWorkspaceAtom)?.id;

  const [allProjects, setAllProjects] = useState<ProjectLite[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [allDiseases, setAllDiseases] = useState<Disease[]>([]);
  const [sampleTypes, setSampleTypes] = useState<SampleType[]>([]);
  const [allSites, setAllSites] = useState<SiteLite[]>([]);

  const [states, setStates] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<Region[]>([]);

  const [resetKey, setResetKey] = useState(0);

  const [filters, setFilters] = useState<FilterType>({
    stateId: [],
    districtId: [],
    diseaseId: [],
    siteId: [],
    sampleTypeId: [],
    testResult: [],
    // FilterType requires these, but geolens has no date UI — kept empty intentionally.
    startDate: "",
    endDate: "",
  });

  // Load projects, regions (states) and sample types on mount, and the
  // projects again when the workspace changes. Backend scopes projects to the
  // user automatically and narrows them to the workspace when one is given.
  useEffect(() => {
    if (!user) return;
    let active = true;

    const fetchFilters = async () => {
      const [regionsResponse, sampleTypeResponse, projectsResponse] =
        await Promise.all([
          fetchProjectRegions(),
          getProjectSampleTypesApi(),
          getAllProjectsApi({ limit: 1000, workspaceId }),
        ]);
      // A newer workspace's request is on its way
      if (!active) return;

      if (regionsResponse.success) setStates(regionsResponse.data || []);
      if (sampleTypeResponse.success)
        setSampleTypes(sampleTypeResponse.data || []);

      if (projectsResponse.success) {
        const projects = projectsResponse.data.map((p) => ({
          id: p.id,
          name: p.name,
          diseases: p.diseases,
          regions: p.regions,
        }));
        setAllProjects(projects);

        const projectDiseases: Disease[] = [];
        projects.forEach((project) => {
          project.diseases.forEach((disease) => {
            if (!projectDiseases.find((d) => d.id === disease.id)) {
              projectDiseases.push(disease);
            }
          });
        });
        projectDiseases.sort((a, b) => a.index - b.index);
        setAllDiseases(projectDiseases);
        setDiseases(projectDiseases);
      }
    };

    fetchFilters().catch((error) =>
      console.error("Error fetching filters", error),
    );
    return () => {
      active = false;
    };
  }, [user, workspaceId]);

  // Another workspace has other projects, regions, diseases and sites, so the
  // filters picked in the previous one no longer apply. Sample type and
  // result aren't tied to a workspace and stay.
  const lastWorkspaceRef = useRef(workspaceId);
  useEffect(() => {
    if (lastWorkspaceRef.current === workspaceId) return;
    lastWorkspaceRef.current = workspaceId;
    setSelectedProjectId("");
    setFilters((prev) => ({
      ...prev,
      projectId: undefined,
      stateId: [],
      districtId: [],
      diseaseId: [],
      siteId: [],
    }));
    // The selects are uncontrolled; remount them so they show the cleared value.
    setResetKey((k) => k + 1);
  }, [workspaceId]);

  // Load sites: the project picked in Filters; else every site the user can
  // reach in the selected workspace (GET /sites?workspaceId - the server still
  // applies the user's own access scope, so this covers workspace admins
  // without widening anyone's access). With no workspace selected: the
  // user's own project, or every site for a super-admin.
  useEffect(() => {
    if (!user) return;
    const isSuperAdmin = user.roles?.[0]?.role?.scope === "system";
    const projectId =
      selectedProjectId || (workspaceId ? "" : user.project?.id || "");

    if (!projectId && !workspaceId && !isSuperAdmin) {
      setAllSites([]);
      return;
    }

    let active = true;
    getProjectSitesApi(projectId, {
      disease: "",
      siteType: "",
      startDate: "",
      endDate: "",
      search: "",
      testResult: "",
      // Used by GET /sites; GET /projects/:id/sites ignores it
      workspaceId,
    })
      .then((response) => {
        if (!active) return;
        if (response.success) {
          setAllSites(
            (response.data || [])
              .filter((site) => site.id && site.name)
              .map((site) => ({
                id: site.id as string,
                name: site.name as string,
                stateId: site.location?.region?.parentRegion?.id || undefined,
                districtId: site.location?.region?.id || undefined,
                ...siteCoords(site),
              })),
          );
        }
      })
      .catch((error) => console.error("Error fetching sites", error));
    return () => {
      active = false;
    };
  }, [user, selectedProjectId, workspaceId]);

  // Load districts for the selected state — only those that actually have sites.
  useEffect(() => {
    const stateId = Array.isArray(filters.stateId)
      ? filters.stateId[0]
      : filters.stateId;

    if (!stateId) {
      setDistricts([]);
      return;
    }

    fetchRegionsByRegionId(stateId)
      .then((response) => {
        if (response.success) {
          const allDistricts = response.data?.subRegions || [];
          const selectedStates = Array.isArray(filters.stateId)
            ? filters.stateId
            : [filters.stateId];
          const siteDistrictIds = new Set(
            allSites
              .filter(
                (site) => site.stateId && selectedStates.includes(site.stateId),
              )
              .map((site) => site.districtId)
              .filter(Boolean),
          );
          setDistricts(allDistricts.filter((d) => siteDistrictIds.has(d.id)));
        }
      })
      .catch((error) => console.error("Error fetching districts", error));
  }, [filters.stateId, allSites]);

  // When the project changes, recompute states + diseases and reset downstream filters.
  useEffect(() => {
    if (!selectedProjectId) {
      setStates([]);
      setDistricts([]);
      setDiseases(allDiseases);
      fetchProjectRegions()
        .then((r) => {
          if (r.success) setStates(r.data || []);
        })
        .catch(console.error);
      setFilters((prev) => ({
        ...prev,
        projectId: undefined,
        stateId: [],
        districtId: [],
        diseaseId: [],
        siteId: [],
      }));
      return;
    }

    const project = allProjects.find((p) => p.id === selectedProjectId);
    if (!project) return;

    const projectStates = project.regions.filter(
      (r) => r.regionType === "state" || !r.parentRegion,
    );
    setStates(projectStates);
    setDistricts([]);

    const projectDiseases = [...project.diseases].sort(
      (a, b) => a.index - b.index,
    );
    setDiseases(projectDiseases);

    setFilters((prev) => ({
      ...prev,
      projectId: selectedProjectId,
      stateId: [],
      districtId: [],
      diseaseId: [],
      siteId: [],
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProjectId, allProjects, allDiseases]);

  const filteredSites = useMemo(() => {
    const selectedStates = Array.isArray(filters.stateId)
      ? filters.stateId
      : filters.stateId
        ? [filters.stateId]
        : [];
    if (selectedStates.length === 0) return allSites;
    return allSites.filter(
      (site) => site.stateId && selectedStates.includes(site.stateId),
    );
  }, [allSites, filters.stateId]);

  // Sites for the "Pick site" dropdowns: follow the Project/State filters (via
  // filteredSites) and the District filter, and need a location to fly to.
  const pickableSites = useMemo<PickableSite[]>(() => {
    const districtIds = Array.isArray(filters.districtId)
      ? filters.districtId
      : filters.districtId
        ? [filters.districtId]
        : [];
    return filteredSites
      .filter(
        (site) =>
          districtIds.length === 0 ||
          (site.districtId && districtIds.includes(site.districtId)),
      )
      .filter(
        (site): site is SiteLite & { lat: number; lng: number } =>
          Number.isFinite(site.lat) && Number.isFinite(site.lng),
      )
      .map(({ id, name, lat, lng }) => ({ id, name, lat, lng }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredSites, filters.districtId]);

  const handleFilterChange = (name: string, value: string | string[]) => {
    setFilters((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "stateId") {
        next.districtId = [];
        next.siteId = [];
      }
      return next;
    });
  };

  const resetFilters = () => {
    setResetKey((k) => k + 1);
    setSelectedProjectId("");
    setFilters({
      projectId: undefined,
      stateId: [],
      districtId: [],
      diseaseId: [],
      siteId: [],
      sampleTypeId: [],
      testResult: [],
      startDate: "",
      endDate: "",
    });
  };

  const projectOptions = useMemo<SelectOption[]>(
    () => [
      { label: "All Projects", value: "" },
      ...allProjects.map((p) => ({ label: p.name, value: p.id })),
    ],
    [allProjects],
  );
  const stateOptions = useMemo<SelectOption[]>(
    () => states.map((s) => ({ label: s.name, value: s.id })),
    [states],
  );
  const districtOptions = useMemo<SelectOption[]>(
    () => districts.map((d) => ({ label: d.name, value: d.id })),
    [districts],
  );
  const diseaseOptions = useMemo<SelectOption[]>(
    () => diseases.map((d) => ({ label: d.shortName || d.name, value: d.id })),
    [diseases],
  );
  const siteOptions = useMemo<SelectOption[]>(
    () => filteredSites.map((s) => ({ label: s.name, value: s.id })),
    [filteredSites],
  );
  const sampleTypeOptions = useMemo<SelectOption[]>(
    () => sampleTypes.map((s) => ({ label: s.name, value: s.id })),
    [sampleTypes],
  );

  const activeFilterCount = useMemo(() => {
    const groups: (string | string[] | undefined)[] = [
      filters.projectId,
      filters.stateId,
      filters.districtId,
      filters.diseaseId,
      filters.siteId,
      filters.sampleTypeId,
      filters.testResult,
    ];
    return groups.filter((g) => (Array.isArray(g) ? g.length > 0 : !!g)).length;
  }, [filters]);

  // One removable chip per active filter group, shown on the map.
  const activeFilterChips = useMemo<FilterChip[]>(() => {
    const labelOf = (options: SelectOption[], value: string) =>
      options.find((o) => String(o.value) === String(value))?.label ?? value;
    const chips: FilterChip[] = [];
    if (filters.projectId) {
      chips.push({
        key: "projectId",
        name: "Project",
        value: labelOf(projectOptions, filters.projectId),
      });
    }
    const groups: [FilterGroupKey, string, SelectOption[]][] = [
      ["stateId", "State", stateOptions],
      ["districtId", "District", districtOptions],
      ["diseaseId", "Disease", diseaseOptions],
      ["siteId", "Site", siteOptions],
      ["sampleTypeId", "Sample type", sampleTypeOptions],
      ["testResult", "Result", RESULT_OPTIONS],
    ];
    groups.forEach(([key, name, options]) => {
      const raw = filters[key];
      const values = Array.isArray(raw) ? raw : raw ? [raw] : [];
      if (values.length === 0) return;
      const first = labelOf(options, values[0]);
      chips.push({
        key,
        name,
        value: values.length > 1 ? `${first} +${values.length - 1}` : first,
      });
    });
    return chips;
  }, [
    filters,
    projectOptions,
    stateOptions,
    districtOptions,
    diseaseOptions,
    siteOptions,
    sampleTypeOptions,
  ]);

  const clearFilterGroup = (key: FilterGroupKey | "projectId") => {
    if (key === "projectId") {
      // The project effect resets the downstream filters.
      setSelectedProjectId("");
    } else {
      setFilters((prev) => {
        const next = { ...prev, [key]: [] };
        if (key === "stateId") {
          next.districtId = [];
          next.siteId = [];
        }
        return next;
      });
    }
    // The selects are uncontrolled; remount them so they show the cleared value.
    setResetKey((k) => k + 1);
  };

  // The selected state's Region (single-select bridge to geolens's state-name flow).
  const selectedStateRegion = useMemo(() => {
    const stateId = Array.isArray(filters.stateId)
      ? filters.stateId[0]
      : filters.stateId;
    if (!stateId) return null;
    return states.find((s) => s.id === stateId) || null;
  }, [filters.stateId, states]);

  return {
    resetKey,
    filters,
    handleFilterChange,
    resetFilters,
    selectedProjectId,
    setSelectedProjectId,
    showProjectSelector: allProjects.length > 1,
    projectOptions,
    stateOptions,
    districtOptions,
    diseaseOptions,
    siteOptions,
    sampleTypeOptions,
    pickableSites,
    activeFilterCount,
    activeFilterChips,
    clearFilterGroup,
    selectedStateRegion,
  };
}
