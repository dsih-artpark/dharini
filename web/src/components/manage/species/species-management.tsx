"use client";

import { useEffect, useState } from "react";
import CustomModal from "@/src/components/ui/custom-modal";
import Select from "@/src/components/ui/select";
import { toast } from "react-toastify";
import Loader from "@/src/components/ui/loader";
import {
  useIsSuperAdmin,
  useIsWorkspaceAdmin,
} from "@/src/hooks/check-permission";
import type { Species, Disease } from "@/src/types/global";
import { fetchDisease } from "@/src/app/(dashboard)/project-onboarding/loader";
import {
  getSpeciesApi,
  createSpeciesApi,
  updateSpeciesApi,
} from "@/src/app/(dashboard)/manage/species/loader";

export default function SpeciesManagement() {
  const isSuperAdmin = useIsSuperAdmin();
  const isWorkspaceAdmin = useIsWorkspaceAdmin();
  const canManage = isSuperAdmin || isWorkspaceAdmin;
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingSpecies, setEditingSpecies] = useState<Species | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    emojiIcon: "",
    abbreviation: "",
    diseaseShortNames: [] as string[],
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [spRes, dRes] = await Promise.all([
        getSpeciesApi(),
        fetchDisease(),
      ]);

      if (spRes.success) setSpeciesList(spRes.data);
      if (dRes.success) setDiseases(dRes.data);
    } catch (e: unknown) {
      const error = e as Error;
      toast.error(error.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canManage) {
      fetchData();
    }
  }, [canManage]);

  const handleOpenModal = (sp?: Species) => {
    if (sp) {
      setEditingSpecies(sp);
      setFormData({
        name: sp.name,
        emojiIcon: sp.emojiIcon || "",
        abbreviation: sp.abbreviation || "",
        diseaseShortNames: sp.diseaseShortNames || [],
      });
    } else {
      setEditingSpecies(null);
      setFormData({
        name: "",
        emojiIcon: "",
        abbreviation: "",
        diseaseShortNames: [],
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSpecies(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "abbreviation" ? value.toUpperCase() : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Name is required");
      return;
    }

    try {
      setLoading(true);
      let res;
      if (editingSpecies) {
        res = await updateSpeciesApi(editingSpecies.id, formData);
      } else {
        res = await createSpeciesApi(formData);
      }

      if (res.success) {
        toast.success(editingSpecies ? "Species updated" : "Species created");
        fetchData();
        handleCloseModal();
      }
    } catch (e: unknown) {
      const error = e as Error;
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!canManage) {
    return (
      <div className="flex h-64 justify-center items-center">
        <p className="text-grey-70 text-lg">Access Denied</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-8 lg:px-20 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-grey-80 text-xl font-semibold">Species</h2>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-blue-40 text-white rounded font-medium hover:bg-blue-50 transition"
        >
          Add Species
        </button>
      </div>

      {loading && speciesList.length === 0 ? (
        <div className="flex justify-center py-8">
          <Loader />
        </div>
      ) : (
        <div className="border border-grey-20 rounded shadow overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-grey-10 border-b border-grey-20">
                <th className="px-6 py-3 text-sm font-semibold text-grey-70">
                  Emoji
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-grey-70">
                  Name
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-grey-70">
                  Abbr
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-grey-70">
                  Diseases
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-grey-70">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {speciesList.map((sp) => (
                <tr
                  key={sp.id}
                  className="border-b border-grey-20 hover:bg-grey-5 transition"
                >
                  <td className="px-6 py-4 text-2xl">{sp.emojiIcon || "-"}</td>
                  <td className="px-6 py-4 font-medium text-grey-80">
                    {sp.name}
                  </td>
                  <td className="px-6 py-4 text-grey-70 font-mono font-bold">
                    {sp.abbreviation || "-"}
                  </td>
                  <td className="px-6 py-4 text-grey-70">
                    <div className="flex flex-wrap gap-1">
                      {sp.diseaseShortNames?.map((d, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-blue-10 text-blue-40 text-xs rounded-full"
                        >
                          {d}
                        </span>
                      )) || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleOpenModal(sp)}
                      className="text-blue-40 hover:underline text-sm font-medium"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CustomModal isOpen={isModalOpen}>
        <div className="bg-white rounded-lg p-6 w-full max-w-md flex flex-col gap-4 shadow-xl">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="text-lg font-semibold text-grey-80">
              {editingSpecies ? "Edit Species" : "Add Species"}
            </h3>
            <button
              onClick={handleCloseModal}
              className="text-grey-60 hover:text-grey-80"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-grey-70">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border border-grey-30 rounded px-3 py-2 text-grey-80 text-sm focus:outline-none focus:border-blue-40"
                placeholder="e.g. Chicken, Cattle"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-grey-70">
                Emoji Icon
              </label>
              <input
                type="text"
                name="emojiIcon"
                value={formData.emojiIcon}
                onChange={handleChange}
                className="border border-grey-30 rounded px-3 py-2 text-grey-80 text-sm focus:outline-none focus:border-blue-40"
                placeholder="e.g. 🐔, 🐄"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-grey-70">
                Abbreviation (e.g. CH, CT)
              </label>
              <input
                type="text"
                name="abbreviation"
                value={formData.abbreviation}
                onChange={handleChange}
                className="border border-grey-30 rounded px-3 py-2 text-grey-80 text-sm focus:outline-none focus:border-blue-40 font-mono font-bold uppercase"
                placeholder="e.g. CH"
                maxLength={4}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-grey-70">
                Diseases
              </label>
              <Select
                name="diseaseShortNames"
                options={diseases.map((d) => ({
                  label: d.name,
                  value: d.shortName || d.name,
                }))}
                defaultValue={formData.diseaseShortNames}
                isMulti={true}
                placeholder="Select Diseases"
                onChange={(e) => {
                  const val = e.target.value as unknown as string[];
                  setFormData((p) => ({
                    ...p,
                    diseaseShortNames: Array.isArray(val) ? val : [val],
                  }));
                }}
                className="w-full"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-blue-40 text-white rounded py-2 font-medium hover:bg-blue-50 disabled:bg-grey-30 disabled:cursor-not-allowed transition flex justify-center items-center h-10"
            >
              {loading ? (
                <Loader />
              ) : editingSpecies ? (
                "Save Changes"
              ) : (
                "Create"
              )}
            </button>
          </form>
        </div>
      </CustomModal>
    </div>
  );
}
