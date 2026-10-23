import Breadcrumb from "@/src/components/ui/breadcrumb";
import SpeciesManagement from "@/src/components/manage/species/species-management";

export default async function SpeciesPage() {
  return (
    <div className="flex flex-col">
      <Breadcrumb
        path={[
          { name: "Manage", href: "/manage" },
          { name: "Species", href: "/manage/species" },
        ]}
      />
      <SpeciesManagement />
    </div>
  );
}
