"use client";

import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { toast } from "react-toastify";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { userAtom } from "@/src/store/userAtom";
import { getSuperAdminsApi } from "@/src/app/(dashboard)/manage/loader";
import AddUpdateSuperAdmin from "@/src/components/projects/manage-access/add-update-super-admin";
import DeleteSuperAdmin from "@/src/components/projects/manage-access/delete-super-admin";
import Loader from "@/src/components/ui/loader";
import type { User } from "@/src/types/global";
import {
  isSuperAdminLabFlowEnabled,
  isUserSuperAdmin,
} from "@/src/lib/super-admin-lab-flow";

export default function ManageSuperAdmins() {
  const user = useAtomValue(userAtom);
  const [superAdmins, setSuperAdmins] = useState<Partial<User>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editModal, setEditModal] = useState<{
    visible: boolean;
    user?: Partial<User>;
  }>({ visible: false });
  const [deleteModal, setDeleteModal] = useState<{
    visible: boolean;
    userId: string;
  }>({ visible: false, userId: "" });

  const shouldShow = isSuperAdminLabFlowEnabled() && isUserSuperAdmin(user);

  useEffect(() => {
    if (!shouldShow) return;

    const load = async () => {
      setIsLoading(true);
      try {
        const response = await getSuperAdminsApi();
        if (response.success) {
          setSuperAdmins(response.data);
        }
      } catch (error) {
        toast.error((error as Error).message || "Error fetching super admins");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [shouldShow]);

  if (!shouldShow) return null;

  return (
    <section className="relative mb-6 flex w-full flex-col items-start justify-start overflow-hidden rounded-2xl border border-grey-20 bg-white shadow-card">
      <div className="flex w-full flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-grey-90">
            Manage Super Admins
          </h1>
          <p className="max-w-3xl text-sm leading-[21px] text-grey-70">
            Super admins can access the lab flow across projects when this
            deployment flag is enabled.
          </p>
        </div>
        <button
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-40 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-50"
          onClick={() => setEditModal({ visible: true })}
        >
          <Plus className="h-4 w-4" />
          Add Super Admin
        </button>
      </div>
      {isLoading && (
        <div className="flex min-h-[200px] w-full items-center justify-center border-t border-grey-20">
          <Loader />
        </div>
      )}
      {!isLoading && (
        <div className="flex w-full flex-col">
          <div className="hidden w-full grid-cols-[1.35fr_1fr_1fr_96px] gap-4 border-y border-grey-20 bg-grey-10 px-6 py-3 sm:grid">
            <label className="text-xs font-bold uppercase tracking-wide text-grey-60">
              Email
            </label>
            <label className="text-xs font-bold uppercase tracking-wide text-grey-60">
              Name
            </label>
            <label className="text-xs font-bold uppercase tracking-wide text-grey-60">
              Phone Number
            </label>
            <label className="text-right text-xs font-bold uppercase tracking-wide text-grey-60">
              Actions
            </label>
          </div>
          {superAdmins.map((member) => (
            <div
              key={member.id}
              className="grid w-full gap-3 border-b border-grey-20 px-5 py-4 transition hover:bg-grey-10 sm:grid-cols-[1.35fr_1fr_1fr_96px] sm:items-center sm:gap-4 sm:px-6"
            >
              <div className="flex min-w-0 gap-3">
                <p className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-10 text-sm font-semibold capitalize leading-[21px] text-blue-40">
                  {member.email?.charAt(0)}
                </p>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-grey-50 sm:hidden">
                    Email
                  </p>
                  <p className="truncate text-sm leading-[21px] text-grey-80">
                    {member.email}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-grey-50 sm:hidden">
                  Name
                </p>
                <p className="text-sm leading-[21px] text-grey-80">
                  {member.firstName ?? "-"} {member.lastName}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-grey-50 sm:hidden">
                  Phone Number
                </p>
                <p className="text-sm leading-[21px] text-grey-80">
                  {member.contactNumber || "Not Available"}
                </p>
              </div>
              <div className="flex items-center justify-start gap-2 sm:justify-end">
                {user?.id === member.id && (
                  <p className="rounded-full bg-grey-10 px-2 py-1 text-xs font-semibold leading-none text-grey-60">
                    [You]
                  </p>
                )}
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-grey-20 text-blue-40 transition hover:bg-blue-10"
                  onClick={() => setEditModal({ visible: true, user: member })}
                  aria-label="Edit super admin"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-20 text-red-30 transition hover:bg-red-10"
                  onClick={() =>
                    setDeleteModal({
                      visible: true,
                      userId: member.id ?? "",
                    })
                  }
                  aria-label="Delete super admin"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {!superAdmins.length && (
            <div className="w-full px-6 py-10 text-center text-sm leading-[21px] text-grey-70">
              No active super admins found.
            </div>
          )}
        </div>
      )}
      <AddUpdateSuperAdmin
        isOpen={editModal.visible}
        defaultUserData={editModal.user}
        onClose={() => setEditModal({ visible: false })}
        onCreate={(member) => setSuperAdmins((prev) => [member, ...prev])}
        onUpdate={(member) =>
          setSuperAdmins((prev) =>
            prev.map((existing) =>
              existing.id === member.id ? member : existing,
            ),
          )
        }
      />
      <DeleteSuperAdmin
        isOpen={deleteModal.visible}
        userId={deleteModal.userId}
        isSelf={deleteModal.userId === user?.id}
        onClose={() => setDeleteModal({ visible: false, userId: "" })}
        onRemoved={() =>
          setSuperAdmins((prev) =>
            prev.filter((member) => member.id !== deleteModal.userId),
          )
        }
      />
    </section>
  );
}
