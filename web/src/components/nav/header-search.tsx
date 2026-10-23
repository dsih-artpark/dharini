import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";

import { getGlobalSearchApi } from "@/src/app/(dashboard)/loader";
import { globalSearchResponse } from "@/src/types/global";
import Spinner from "@/src/components/ui/spinner";
import { toast } from "react-toastify";

export default function HeaderSearch({ darkMode }: { darkMode: boolean }) {
  const [search, setSearch] = useState<string>("");
  const [searchResult, setSearchResult] = useState<globalSearchResponse>();
  const [loading, setLoading] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const fetchSearchResult = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getGlobalSearchApi({
        searchText: search,
      });
      setSearchResult(data);
      setShowResult(true);
    } catch (e) {
      toast.error((e as Error)?.message ?? "Error fetching data");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (search) {
        fetchSearchResult();
      } else {
        setShowResult(false);
        setSearchResult(undefined);
      }
    }, 500); // debounce delay

    return () => clearTimeout(handler);
  }, [search, fetchSearchResult]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const handleClickOutsideSearch = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResult(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideSearch);

    return () =>
      document.removeEventListener("mousedown", handleClickOutsideSearch);
  }, []);

  const handleInputFocus = () => {
    setShowResult(true);
  };

  const handleSearchItemClick = () => {
    setShowResult(false);
    setSearch("");
  };

  const handleClearSearch = () => {
    setSearch("");
    setShowResult(false);
  };

  return (
    <div className="z-10 relative flex flex-col" ref={searchRef}>
      <div
        className={`w-full sm:w-[360px] self-stretch h-11 px-3 py-2 ${
          darkMode
            ? "border border-white/15 bg-white/10"
            : "border border-grey-20 bg-grey-10"
        } rounded-xl justify-start items-center gap-3 inline-flex shadow-sm`}
      >
        <div className="grow shrink basis-0 h-[21px] justify-start items-center gap-2 flex">
          <div className="w-5 h-5 relative shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
            >
              <path
                d="M15.5252 13.8469L19.0943 17.4152L17.9152 18.5943L14.3469 15.0252C13.0191 16.0895 11.3677 16.6684 9.66602 16.666C5.52602 16.666 2.16602 13.306 2.16602 9.16602C2.16602 5.02602 5.52602 1.66602 9.66602 1.66602C13.806 1.66602 17.166 5.02602 17.166 9.16602C17.1684 10.8677 16.5895 12.5191 15.5252 13.8469ZM13.8535 13.2285C14.9111 12.1409 15.5017 10.683 15.4993 9.16602C15.4993 5.94268 12.8885 3.33268 9.66602 3.33268C6.44268 3.33268 3.83268 5.94268 3.83268 9.16602C3.83268 12.3885 6.44268 14.9993 9.66602 14.9993C11.183 15.0017 12.6409 14.4111 13.7285 13.3535L13.8535 13.2285Z"
                fill={darkMode ? "#FFFFFF" : "#889096"}
              />
            </svg>
          </div>
          <input
            className={`grow shrink basis-0 outline-none bg-transparent ${
              darkMode
                ? "placeholder:text-grey-0 text-grey-0"
                : "placeholder:text-grey-60 text-grey-80"
            } text-sm font-normal leading-[21px]`}
            type="text"
            value={search}
            placeholder="Search sites, samples, projects..."
            onFocus={handleInputFocus}
            onChange={handleSearch}
          />
          {loading && <Spinner />}
          {search && !loading && (
            <div
              className="p-1 justify-center items-center flex cursor-pointer"
              onClick={handleClearSearch}
            >
              <div className="w-5 h-5 relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M10.0006 8.82227L14.1256 4.69727L15.3039 5.8756L11.1789 10.0006L15.3039 14.1256L14.1256 15.3039L10.0006 11.1789L5.8756 15.3039L4.69727 14.1256L8.82227 10.0006L4.69727 5.8756L5.8756 4.69727L10.0006 8.82227Z"
                    fill={darkMode ? "#FFFFFF" : "#284DB6"}
                  />
                </svg>
              </div>
            </div>
          )}
          {!search && !loading && (
            <div
              className={`hidden h-7 shrink-0 items-center gap-1 rounded-md border px-2 text-xs font-medium sm:flex ${
                darkMode
                  ? "border-white/15 text-white/70"
                  : "border-grey-20 bg-white text-grey-60"
              }`}
            >
              <span>⌘</span>
              <span>K</span>
            </div>
          )}
        </div>
      </div>
      {showResult && (
        <div className="absolute top-12 self-stretch w-full flex flex-col bg-white max-h-72 overflow-y-auto border border-grey-20 rounded-xl shadow-dropdown">
          {!!searchResult?.projects?.length && (
            <p className="border-b px-2 py-2 text-sm font-medium">Projects</p>
          )}
          {searchResult?.projects.map((project) => (
            <Link
              href={`/projects/${project.id}`}
              key={project.id}
              className="text-sm font-light border-b px-4 py-2 cursor-pointer"
              onClick={handleSearchItemClick}
            >
              {project.name}
            </Link>
          ))}
          {!!searchResult?.sites?.length && (
            <p className="border-b px-2 py-2 text-sm font-medium">Sites</p>
          )}
          {searchResult?.sites.map((site) => (
            <Link
              href={`/projects/${site.projectId}/sites/${site.id}`}
              key={site.id}
              className="text-sm font-light border-b px-4 py-2 cursor-pointer"
              onClick={handleSearchItemClick}
            >
              {site.name}
            </Link>
          ))}
          {!!searchResult?.diseases?.length && (
            <p className="border-b px-2 py-2 text-sm font-medium">Diseases</p>
          )}
          {searchResult?.diseases.map((disease) => (
            <Link
              href={`#`}
              key={disease.id}
              className="text-sm font-light border-b px-4 py-2 cursor-pointer"
              onClick={handleSearchItemClick}
            >
              {disease.name}
            </Link>
          ))}
          {search &&
            !loading &&
            !searchResult?.projects?.length &&
            !searchResult?.sites?.length &&
            !searchResult?.diseases?.length && (
              <div className="text-sm font-normal border-b px-4 py-2">
                No search results found
              </div>
            )}
        </div>
      )}
    </div>
  );
}
