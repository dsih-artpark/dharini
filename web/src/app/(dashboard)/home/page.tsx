import TopSection from "@/src/components/home/top-section";
// import ProjectSection from "@/src/components/home/project-section";
import DiseasesSection from "@/src/components/home/diseases-section";
import SiteDetailsSection from "@/src/components/home/site-details-section";
import HomeDataProvider from "@/src/components/home/home-data-provider";

export default function Home() {
  return (
    <div className="dashboard-page-shell flex flex-col gap-6 bg-subtle">
      <HomeDataProvider>
        <TopSection />
        {/* <ProjectSection /> */}
        <DiseasesSection />
        <SiteDetailsSection />
      </HomeDataProvider>
    </div>
  );
}
