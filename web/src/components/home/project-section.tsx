"use client";
import Link from "next/link";
import { useAtomValue } from "jotai";
import { ChevronRight } from "lucide-react";
import ProjectStatistics from "@/src/components/home/project-statistics";
import ProjectsCarousel from "@/src/components/home/projects-carousel";
import { projectsAtom } from "@/src/store/projectsAtom";
import { useIsSuperAdmin } from "@/src/hooks/check-permission";

export default function ProjectSection() {
  const projects = useAtomValue(projectsAtom);
  const isSuperAdmin = useIsSuperAdmin();
  return (
    <section className="flex flex-col gap-6 rounded-2xl border border-grey-20 bg-white p-5 shadow-card sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="mt-2 text-2xl font-semibold leading-tight text-grey-90 sm:text-[32px]">
            {projects.length > 1 ? "Projects" : "Project"}
          </h2>
        </div>
        {isSuperAdmin && (
          <Link
            href={"/manage"}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-blue-40 transition hover:bg-blue-10"
          >
            <span>View All</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      {isSuperAdmin && <ProjectStatistics />}
      <ProjectsCarousel />
    </section>
  );
}
