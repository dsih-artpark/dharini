import { useEffect, useMemo, useState } from "react";
import { useAtomValue } from "jotai";

import { userAtom } from "@/src/store/userAtom";
import { getAllProjectsApi } from "@/src/app/(dashboard)/manage/loader";
import {
  fetchProjectRegions,
  fetchRegionsByRegionId,
} from "@/src/app/(dashboard)/project-onboarding/loader";
import { getProjectSitesApi } from "@/src/app/(dashboard)/projects/[id]/sites/loader";
import { getProjectSampleTypesApi } from "@/src/app/(dashboard)/monitor/loader";
import type { Disease, Region } from "@/src/types/global";
import type { SampleType } from "@/src/types/sample";
import type { FilterType } from "@/src/types/statistics";

export interface SelectOption {
  label: string;
  value: string | number;
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
}

export function useSurveillanceFilters() {
  const user = useAtomValue(userAtom);

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

  // Load projects, regions (states) and sample types on mount.
  // Backend scopes projects to the user automatically.
  useEffect(() => {
    if (!user) return;

    const fetchFilters = async () => {
      const [regionsResponse, sampleTypeResponse, projectsResponse] =
        await Promise.all([
          fetchProjectRegions(),
          getProjectSampleTypesApi(),
          getAllProjectsApi({ limit: 1000 }),
        ]);

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
  }, [user]);

  // Load sites for the selected project (or the user's own project).
  useEffect(() => {
    const isSuperAdmin = user?.roles?.[0]?.role?.scope === "system";
    const projectId = selectedProjectId || user?.project?.id || "";

    if (!projectId && !isSuperAdmin) return;

    getProjectSitesApi(projectId, {
      disease: "",
      siteType: "",
      startDate: "",
      endDate: "",
      search: "",
      testResult: "",
    })
      .then((response) => {
        if (response.success) {
          setAllSites(
            (response.data || [])
              .filter((site) => site.id && site.name)
              .map((site) => ({
                id: site.id as string,
                name: site.name as string,
                stateId: site.location?.region?.parentRegion?.id || undefined,
                districtId: site.location?.region?.id || undefined,
              })),
          );
        }
      })
      .catch((error) => console.error("Error fetching sites", error));
  }, [user, selectedProjectId]);

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
    activeFilterCount,
    selectedStateRegion,
  };
}
