import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import CustomModal from "@/src/components/ui/custom-modal";
import { DEFAULT_CENTER } from "@/src/components/ui/map.utils";
const MapRenderer = dynamic(() => import("@/src/components/ui/map-renderer"), {
  ssr: false,
});
export default function EditMapLocationModal({
  isOpen,
  onClose,
  location: initialLocation = DEFAULT_CENTER,
  onLocationUpdate,
}: {
  isOpen: boolean;
  onClose: () => void;
  location?: [number, number];
  onLocationUpdate: (newLocation: {
    latitude: string;
    longitude: string;
  }) => void;
}) {
  const [location, setLocation] = useState<[number, number]>(initialLocation);
  // Tracks whether the user has dragged the marker in the current open session,
  // so a live coordinate update from the parent (e.g. an in-flight geocode
  // lookup resolving) doesn't get silently dropped on save, but also doesn't
  // stomp on a drag the user already made.
  const hasDraggedRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      hasDraggedRef.current = false;
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !hasDraggedRef.current) {
      setLocation(initialLocation);
    }
  }, [isOpen, initialLocation[0], initialLocation[1]]);

  const handleSave = () => {
    onLocationUpdate({
      latitude: "" + location[0],
      longitude: "" + location[1],
    });
    onClose();
  };

  return (
    <CustomModal isOpen={isOpen}>
      <div className="w-[680px] bg-white flex-col justify-start items-start gap-8 inline-flex">
        {/* header */}
        <div className="self-stretch h-[72px] px-7 pt-5 pb-6 bg-white rounded-tl-lg rounded-tr-lg border-b border-grey-20 justify-between items-center inline-flex">
          <h3 className="grow shrink basis-0 text-grey-80 text-xl font-semibold font-noto-serif leading-[26px]">
            Edit Map Region
          </h3>
          <div
            className="p-1 rounded-[999px] justify-center items-center gap-2 flex cursor-pointer"
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
        {isOpen && (
          <div className="self-stretch flex flex-col h-[400px] mx-6 border border-grey-20 rounded overflow-y-auto ">
            <MapRenderer
              location={location}
              dragMarker={true}
              onLocationUpdate={(newLocation) => {
                hasDraggedRef.current = true;
                setLocation(newLocation);
              }}
            />
          </div>
        )}
        {/* footer */}
        <div className="self-stretch px-7 pt-5 pb-6 bg-white rounded-bl-lg rounded-br-lg border-t border-grey-20 justify-end items-center inline-flex">
          <div className="grow shrink basis-0 self-stretch justify-end items-center flex">
            <div className="justify-start items-center gap-5 flex">
              <button
                className="p-3 bg-white rounded-lg border border-blue-40 justify-center items-center gap-2 flex text-blue-40 text-base leading-normal"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="p-3 bg-blue-40 rounded-lg justify-center items-center gap-2 flex text-white text-base leading-normal"
                onClick={handleSave}
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
