"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useAtom } from "jotai";
import { userAtom } from "@/src/store/userAtom";
import CustomModal from "@/src/components/ui/custom-modal";
import { updateUser } from "@/src/app/(dashboard)/project-onboarding/actions";
import { UserProfile } from "@/src/types/user";
import { uploadImagesApi } from "@/src/app/(dashboard)/home/loader";
import Spinner from "@/src/components/ui/spinner";

export default function EditUserProfile({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [user, setUser] = useAtom(userAtom);
  const [formData, setFormData] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    // teamName: user?.teamName ?? "",
    // teamId: user?.team?.id ?? "",
    email: user?.email ?? "",
    contactNumber: user?.contactNumber?.toString() ?? "",
  });
  const [profilePicture, setProfilePicture] = useState<{
    file: File;
    preview: string;
    fileUrl: string;
  }>();
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    // teamName: "",
    email: "",
    contactNumber: "",
  });
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    if (user?.id) {
      setFormData({
        firstName: user?.firstName ?? "",
        lastName: user?.lastName ?? "",
        // teamName: user?.team?.teamName ?? "",
        // teamId: user?.team?.id ?? "",
        email: user?.email ?? "",
        contactNumber: user?.contactNumber?.toString() ?? "",
      });
    }
  }, [user?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear errors on change
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length) {
      setUploading(true);
      const response = await uploadImagesApi({ files });
      if (response.success) {
        setProfilePicture({
          file: files[0],
          preview: URL.createObjectURL(files[0]),
          fileUrl: response.data[0].uploaded ? response.data[0].fileUrl : "",
        });
      } else {
        toast.error(response.message || "Error uploading images.");
      }
    } else {
      toast.error("No files selected.");
    }
    setUploading(false);
  };

  const validate = () => {
    const newErrors: typeof errors = {
      firstName: "",
      lastName: "",
      // teamName: "",
      email: "",
      contactNumber: "",
    };

    if (!formData.firstName.trim())
      newErrors.firstName = "First Name is required.";
    // if (!formData.lastName.trim())
    //   newErrors.lastName = "Last Name is required.";
    // if (!formData.teamName.trim() && !formData.teamId?.trim())
    //   newErrors.teamName = "Team Name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (
      !formData.contactNumber.trim() ||
      !/^\d{10}$/.test(formData.contactNumber)
    )
      newErrors.contactNumber = "Enter a valid 10-digit Phone Number.";

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async () => {
    if (validate()) {
      try {
        if (user?.id) {
          const payload: UserProfile = {
            ...formData,
            contactNumber:
              formData.contactNumber &&
              formData.contactNumber === user.contactNumber
                ? undefined
                : formData.contactNumber,
          };
          if (profilePicture) {
            payload.profilePicture = profilePicture.fileUrl;
          }

          const { success, data } = await updateUser(user?.id, payload);
          // Cleanup
          if (profilePicture?.preview) {
            URL.revokeObjectURL(profilePicture.preview);
          }
          if (success) {
            console.log("data", data);
            setUser((u) => ({ ...u, ...data }));
            toast.success("Profile updated successfully.");
            onClose();
          }
        }
      } catch (error) {
        toast.error(
          (error as Error)?.message ||
            "Error updating profile details. Please try again.",
        );
      }
    }
  };

  return (
    <CustomModal isOpen={isOpen}>
      <div className="w-full sm:w-[680px] overflow-hidden rounded-2xl border border-grey-20 bg-white shadow-xl flex-col justify-start items-start inline-flex">
        <div className="self-stretch px-5 py-4 sm:px-6 bg-white border-b border-grey-20 justify-between items-center inline-flex">
          <h3 className="grow shrink basis-0 text-grey-80 text-xl font-semibold font-noto-serif leading-[26px]">
            Edit Profile
          </h3>
          <div
            className="h-9 w-9 rounded-full border border-grey-20 bg-grey-10 justify-center items-center gap-2 flex cursor-pointer transition hover:bg-blue-10"
            onClick={onClose}
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
                  d="M9.99865 8.82227L14.1236 4.69727L15.302 5.8756L11.177 10.0006L15.302 14.1256L14.1236 15.3039L9.99865 11.1789L5.87365 15.3039L4.69531 14.1256L8.82031 10.0006L4.69531 5.8756L5.87365 4.69727L9.99865 8.82227Z"
                  fill="#284DB6"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="self-stretch flex flex-col items-center h-[480px] gap-6 px-5 py-6 sm:px-6 overflow-y-auto bg-grey-10">
          <div className="relative">
            {uploading ? (
              <div className="w-[132px] h-[132px] bg-teal-10 rounded-full border-4 border-white shadow-md flex-col justify-center items-center inline-flex">
                <Spinner />
              </div>
            ) : profilePicture?.preview || user?.profilePicture ? (
              <Image
                className="w-[132px] h-[132px] rounded-full object-cover border-4 border-white shadow-md"
                src={profilePicture?.preview || user?.profilePicture || ""}
                width={132}
                height={132}
                alt="profile photo"
              />
            ) : (
              <div className="w-[132px] h-[132px] bg-teal-10 rounded-full border-4 border-white shadow-md flex-col justify-center items-center inline-flex">
                <p className="self-stretch text-center text-grey-80 text-3xl font-semibold uppercase leading-[18px] tracking-tight whitespace-nowrap">
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </p>
              </div>
            )}
            <label className="absolute bottom-1 right-1 flex items-center justify-center w-10 h-10 bg-blue-40 rounded-full border-2 border-white shadow-sm cursor-pointer transition hover:bg-blue-50">
              <input
                type="file"
                accept="image/png, image/gif, image/jpeg"
                className="hidden"
                onChange={handleFileChange}
              />
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.728 9.68608L14.314 8.27208L5 17.5861V19.0001H6.414L15.728 9.68608ZM17.142 8.27208L18.556 6.85808L17.142 5.44408L15.728 6.85808L17.142 8.27208ZM7.242 21.0001H3V16.7571L16.435 3.32208C16.6225 3.13461 16.8768 3.0293 17.142 3.0293C17.4072 3.0293 17.6615 3.13461 17.849 3.32208L20.678 6.15108C20.8655 6.33861 20.9708 6.59292 20.9708 6.85808C20.9708 7.12325 20.8655 7.37756 20.678 7.56508L7.243 21.0001H7.242Z"
                  fill="white"
                />
              </svg>
            </label>
          </div>
          <div className="self-stretch flex flex-col gap-5 rounded-xl border border-grey-20 bg-white p-4 sm:p-5 shadow-sm">
            <h3 className="font-noto-serif text-lg font-semibold text-grey-80">
              Personal Information
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-base	text-grey-80">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="firstName"
                  className="border border-grey-20 px-3 py-2.5 rounded-lg text-sm text-grey-80 placeholder:text-grey-70 outline-none transition focus:border-blue-40 focus:ring-2 focus:ring-blue-10"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">{errors.firstName}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-base	text-grey-80">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="lastName"
                  className="border border-grey-20 px-3 py-2.5 rounded-lg text-sm text-grey-80 placeholder:text-grey-70 outline-none transition focus:border-blue-40 focus:ring-2 focus:ring-blue-10"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-base	text-grey-80">
                  Team Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="teamName"
                  className="border border-grey-20 px-3 py-2.5 rounded-lg bg-grey-10 text-sm text-grey-70 placeholder:text-grey-70 disabled:cursor-not-allowed"
                  value={user?.team?.teamName}
                  // onChange={handleChange}
                  disabled
                />
                {/* {errors.teamName && (
                  <p className="text-red-500 text-sm">
                    {errors.teamName}
                  </p>
                )} */}
              </div>
            </div>
          </div>
          <div className="self-stretch flex flex-col gap-5 rounded-xl border border-grey-20 bg-white p-4 sm:p-5 shadow-sm">
            <h3 className="font-noto-serif text-lg font-semibold text-grey-80">
              Contact Information
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-base	text-grey-80">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  name="email"
                  className="border border-grey-20 px-3 py-2.5 rounded-lg bg-grey-10 text-sm text-grey-70 placeholder:text-grey-70 disabled:cursor-not-allowed"
                  value={formData.email}
                  onChange={handleChange}
                  disabled
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-base	text-grey-80">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="h-11 self-stretch w-full px-3 py-2 bg-white items-center flex grow shrink basis-0 border border-grey-20 rounded-lg gap-2 transition focus-within:border-blue-40 focus-within:ring-2 focus-within:ring-blue-10">
                  <p className="text-sm text-grey-80 placeholder:text-grey-70">
                    +91 -{" "}
                  </p>
                  <input
                    type="number"
                    name="contactNumber"
                    className="grow shrink basis-0 self-stretch outline-none text-sm text-grey-80 placeholder:text-grey-70"
                    value={formData.contactNumber ?? ""}
                    onChange={handleChange}
                    placeholder=""
                  />
                </div>
                {errors.contactNumber && (
                  <p className="text-red-500 text-sm">{errors.contactNumber}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="self-stretch px-5 py-4 sm:px-6 bg-white border-t border-grey-20 justify-end items-center inline-flex">
          <div className="grow shrink basis-0 self-stretch justify-end items-center flex">
            <div className="justify-start items-center gap-5 flex">
              <button
                className="px-4 py-2.5 bg-white rounded-lg border border-blue-40 justify-center items-center gap-2 flex text-blue-40 text-base leading-normal transition hover:bg-blue-10"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2.5 bg-blue-40 rounded-lg justify-center items-center gap-2 flex text-white text-base leading-normal transition hover:bg-blue-50"
                onClick={handleSubmit}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  );
}
