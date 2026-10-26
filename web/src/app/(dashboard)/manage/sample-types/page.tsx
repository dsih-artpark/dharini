import Breadcrumb from "@/src/components/ui/breadcrumb";
import SampleTypeManagement from "@/src/components/manage/sample-type/sample-type-management";

export default async function SampleTypesPage() {
  return (
    <div className="flex flex-col">
      <Breadcrumb
        path={[
          { name: "Manage", href: "/manage" },
          { name: "Sample Types", href: "/manage/sample-types" },
        ]}
      />
      <SampleTypeManagement />
    </div>
  );
}
