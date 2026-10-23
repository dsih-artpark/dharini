"use client";

import { getProjectDetailApi } from "@/src/app/(dashboard)/projects/[id]/loader";
import CreateSite from "@/src/components/projects/sites/create-site/create-site-form";
import Breadcrumb from "@/src/components/ui/breadcrumb";
import Spinner from "@/src/components/ui/spinner";
import { useHasPermission } from "@/src/hooks/check-permission";
import { projectAtom } from "@/src/store/projectAtom";
import { siteAtom } from "@/src/store/siteAtom";
import { Site } from "@/src/types/site";
import { useAtom, useSetAtom } from "jotai";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function CreateSitePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useAtom(projectAtom);
  const setSiteDetail = useSetAtom(siteAtom);
  const hasPermission = useHasPermission();
  const canCreateSite = hasPermission("create", "site", id);

  const fetchProjectDetail = async () => {
    try {
      const { data } = await getProjectDetailApi(id);
      setProject(data);
    } catch (e) {
      toast.error((e as Error)?.message ?? "Error fetching data");
    }
  };

  useEffect(() => {
    if (project?.id !== id) {
      fetchProjectDetail();
    }
  }, [id]);

  const onSiteCreated = (createdSite: Site, forceExit?: boolean) => {
    setSiteDetail(createdSite);
    if (forceExit) {
      router.replace(`/projects/${id}`);
    } else {
      router.replace(`/projects/${id}/create-site/${createdSite.id}`);
    }
  };

  return (
    <div className="dashboard-page-shell flex flex-col gap-6 bg-subtle">
      <Breadcrumb
        path={[
          { name: project?.name ?? "Project", href: `/projects/${id}` },
          { name: "Create Site", href: `/projects/${id}/create-site` },
        ]}
      />
      <div className="mx-auto w-full max-w-5xl">
        {!!project ? (
          canCreateSite ? (
            <section className="flex flex-col gap-6 rounded-2xl border border-grey-20 bg-white p-6 shadow-card sm:p-8">
              <h2 className="text-2xl font-semibold leading-tight text-grey-90">
                Create Site
              </h2>
              <div className="border-t border-grey-20" />
              {project && <CreateSite onSiteCreated={onSiteCreated} />}
            </section>
          ) : (
            <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-grey-20 bg-white shadow-card">
              <p className="text-grey-70">
                You do not have permission to create site
              </p>
            </div>
          )
        ) : (
          <div className="flex min-h-[200px] items-center justify-center">
            <Spinner />
          </div>
        )}
      </div>
    </div>
  );
}
