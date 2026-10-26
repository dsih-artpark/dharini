import Statistics from "@/src/components/manage/statistics";
import ProjectList from "@/src/components/manage/project-list";

export default async function Manage() {
  return (
    <div className="dashboard-page-shell flex flex-col gap-6 bg-subtle">
      <Statistics />
      <ProjectList />
    </div>
  );
}
