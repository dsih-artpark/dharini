import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useAtom } from "jotai";
import { toast } from "react-toastify";

import CustomModal from "@/src/components/ui/custom-modal";
import { siteAtom } from "@/src/store/siteAtom";
import { updateSiteApi } from "@/src/app/(dashboard)/projects/[id]/create-site/actions";
import { uploadImagesApi } from "@/src/app/(dashboard)/home/loader";
import Spinner from "@/src/components/ui/spinner";

export default function PhotosCommentsModal({
  projectId,
  isOpen,
  onClose,
}: {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { siteId } = useParams<{ id: string; siteId: string }>();

  const [site, setSite] = useAtom(siteAtom);
  const [comment, setComment] = useState("");
  const [photos, setPhotos] = useState<
    { file: File; preview: string; fileUrl: string }[]
  >([]);
  const [errors, setErrors] = useState({
    comment: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    if (site && siteId === site?.id) {
      setComment(site.comment ?? "");
    }
  }, [site?.id]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length) {
      setUploading(true);
      const response = await uploadImagesApi({ files });
      if (response.success) {
        setPhotos((prevPhotos) => [
          ...prevPhotos,
          ...files.map((file, index) => ({
            file,
            preview: URL.createObjectURL(file),
            fileUrl: response.data[index].uploaded
              ? response.data[index].fileUrl
              : "",
          })),
        ]);
      } else {
        toast.error(response.message || "Error uploading images.");
      }
    } else {
      toast.error("No files selected.");
    }
    setUploading(false);
  };

  const removePhoto = (index: number) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors: typeof errors = {
      comment: "",
    };

    if (!comment.trim()) newErrors.comment = "Comment is required.";
    else if (comment.length < 2 || comment.length > 200)
      newErrors.comment = "Comment must be between 2 and 200 characters long.";

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async () => {
    if (validate()) {
      try {
        setLoading(true);
        const payload = {
          comment,
          photos: photos.map((p) => p.fileUrl),
        };
        const { success, message, data } = await updateSiteApi(
          projectId,
          siteId,
          payload,
        );
        // Cleanup
        photos.forEach((photo) => URL.revokeObjectURL(photo.preview));
        setPhotos([]);
        setSite({ ...site, ...data });
        if (success) {
          toast.success("Site details updated successfully!");
          if (onClose) onClose();
        } else {
          toast.error(message || "Error updating site. Please try again.");
        }
      } catch (error) {
        toast.error(
          (error as Error)?.message || "Error updating site. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <CustomModal isOpen={isOpen}>
      <div className="w-full sm:min-w-[500px] sm:max-w-[60%] overflow-hidden rounded-2xl border border-grey-20 bg-white shadow-xl flex-col justify-start items-start inline-flex">
        {/* header */}
        <div className="self-stretch px-5 py-4 sm:px-6 bg-white border-b border-grey-20 justify-between items-center inline-flex">
          <h3 className="grow shrink basis-0 text-grey-80 text-xl font-semibold font-noto-serif leading-[26px]">
            Photos & Comments
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

        <div className="self-stretch flex-col justify-start items-start gap-5 flex px-5 py-5 sm:px-6 overflow-y-auto bg-grey-10">
          <div className="self-stretch justify-start items-start gap-2 inline-flex flex-wrap">
            {site?.photos?.map((photo, i) => {
              return (
                <div
                  key={i}
                  className="w-[104px] h-[104px] overflow-hidden bg-blue-10 rounded-lg border border-grey-20 justify-center items-center flex shadow-sm"
                >
                  <Image
                    className="w-[104px] h-[104px] object-cover"
                    src={photo}
                    width={104}
                    height={104}
                    alt="site photo"
                  />
                </div>
              );
            })}
            {photos?.map((photo, i) => {
              return (
                <div
                  key={i}
                  className="relative w-[104px] h-[104px] overflow-visible bg-blue-10 rounded-lg border border-grey-20 justify-center items-center flex shadow-sm"
                >
                  <div
                    className="w-6 h-6 p-1 bg-white border border-grey-20 rounded-full absolute right-[-6px] top-[-6px] flex items-center justify-center cursor-pointer shadow-sm transition hover:bg-red-10"
                    onClick={() => removePhoto(i)}
                  >
                    <svg
                      fill="#000000"
                      height="20"
                      width="20"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <g>
                          <g>
                            <polygon points="512,59.076 452.922,0 256,196.922 59.076,0 0,59.076 196.922,256 0,452.922 59.076,512 256,315.076 452.922,512 512,452.922 315.076,256 "></polygon>{" "}
                          </g>
                        </g>
                      </g>
                    </svg>
                  </div>
                  <Image
                    className="w-[104px] h-[104px] rounded-lg object-cover"
                    src={photo.preview}
                    width={104}
                    height={104}
                    alt="site photo"
                  />
                </div>
              );
            })}
            {/* On click upload photo */}
            <label className="w-[104px] h-[104px] bg-white rounded-lg border border-dashed border-blue-40 justify-center items-center gap-1 flex overflow-hidden cursor-pointer shadow-sm transition hover:bg-blue-10">
              <input
                type="file"
                accept="image/png, image/gif, image/jpeg"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="w-6 h-6 relative overflow-hidden">
                {uploading ? (
                  <Spinner />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M21 15V18H24V20H21V23H19V20H16V18H19V15H21ZM21.008 3C21.556 3 22 3.445 22 3.993V13.342C21.3576 13.1151 20.6813 12.9994 20 13V5H4L4.001 19L13.293 9.707C13.465 9.53448 13.694 9.43073 13.9371 9.41526C14.1802 9.39979 14.4206 9.47367 14.613 9.623L14.706 9.708L18.252 13.258C17.4766 13.4943 16.7572 13.8851 16.1369 14.407C15.5167 14.9288 15.0086 15.5709 14.6432 16.2944C14.2779 17.0179 14.0628 17.808 14.0111 18.6169C13.9593 19.4258 14.0719 20.2368 14.342 21.001L2.992 21C2.72881 20.9997 2.4765 20.895 2.29049 20.7088C2.10448 20.5226 2 20.2702 2 20.007V3.993C2.00183 3.73038 2.1069 3.47902 2.29251 3.29322C2.47813 3.10742 2.72938 3.00209 2.992 3H21.008ZM8 7C8.53043 7 9.03914 7.21071 9.41421 7.58579C9.78929 7.96086 10 8.46957 10 9C10 9.53043 9.78929 10.0391 9.41421 10.4142C9.03914 10.7893 8.53043 11 8 11C7.46957 11 6.96086 10.7893 6.58579 10.4142C6.21071 10.0391 6 9.53043 6 9C6 8.46957 6.21071 7.96086 6.58579 7.58579C6.96086 7.21071 7.46957 7 8 7Z"
                      fill="#284DB6"
                    />
                  </svg>
                )}
              </div>
            </label>
          </div>
          <div className="self-stretch flex-col justify-start items-start gap-2 flex rounded-xl border border-grey-20 bg-white p-4 shadow-sm">
            <label className="text-grey-80 text-base leading-normal">
              Comments <span className="text-red-500">*</span>
            </label>
            <textarea
              className="self-stretch min-h-[120px] p-3 bg-white rounded-lg border border-grey-20 justify-start items-start inline-flex resize-none outline-none transition focus:border-blue-40 focus:ring-2 focus:ring-blue-10"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={200}
            />
            <div className="self-stretch justify-end items-start inline-flex">
              <p className="text-grey-70 text-xs leading-[18px]">
                {comment.length ?? 0}/200
              </p>
            </div>
            {errors.comment && (
              <p className="text-red-500 text-sm">{errors.comment}</p>
            )}
          </div>
        </div>

        {/* footer */}
        <div className="self-stretch px-5 py-4 sm:px-6 bg-white border-t border-grey-20 justify-end items-center inline-flex">
          <div className="grow shrink basis-0 self-stretch justify-end items-center flex">
            <div className="justify-start items-center gap-5 flex">
              <button
                className="px-4 py-2.5 bg-white rounded-lg border border-blue-40 justify-center items-center gap-2 flex text-blue-40 text-base leading-normal transition hover:bg-blue-10 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2.5 bg-blue-40 rounded-lg justify-center items-center gap-2 flex text-white text-base leading-normal transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleSubmit}
                disabled={loading}
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
