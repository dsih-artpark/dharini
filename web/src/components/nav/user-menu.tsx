"use client";

import { logout } from "@/src/app/(root)/actions";
import { useSetAtom } from "jotai";
import Link from "next/link";
import { currentWorkspaceAtom } from "@/src/store/currentWorkspaceAtom";

export default function UserMenu({ onClose }: { onClose?: () => void }) {
  const setCurrentWorkspace = useSetAtom(currentWorkspaceAtom);

  const handleLogoutClick = () => {
    onClose?.();
    setCurrentWorkspace(null);
    logout();
  };

  return (
    <div className="absolute bottom-[64px] right-4 z-[120] inline-flex min-w-[220px] flex-col items-start justify-start rounded-xl border border-grey-20 bg-white shadow-dropdown overflow-hidden">
      <Link
        href="/profile"
        onClick={onClose}
        className="self-stretch px-4 py-3 border-b border-grey-20 justify-start items-center gap-2.5 inline-flex cursor-pointer transition hover:bg-grey-10 text-grey-80 hover:text-grey-90"
      >
        <div className="w-4 h-4 relative overflow-hidden flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M7.99998 14.6667C4.31798 14.6667 1.33331 11.682 1.33331 8.00004C1.33331 4.31804 4.31798 1.33337 7.99998 1.33337C11.682 1.33337 14.6666 4.31804 14.6666 8.00004C14.6666 11.682 11.682 14.6667 7.99998 14.6667ZM4.67531 12.1707C5.61901 12.9252 6.79177 13.3353 7.99998 13.3334C9.31331 13.3334 10.5153 12.8587 11.4446 12.072C11.0105 11.6265 10.4913 11.2726 9.918 11.0312C9.34466 10.7899 8.72873 10.6659 8.10665 10.6667C7.4617 10.666 6.82365 10.7993 6.23296 11.0582C5.64226 11.3171 5.11183 11.6959 4.67531 12.1707ZM3.74398 11.2134C4.30428 10.6188 4.98043 10.1452 5.73074 9.82185C6.48105 9.49852 7.28963 9.33228 8.10665 9.33337C8.89441 9.33235 9.67462 9.48695 10.4025 9.78829C11.1303 10.0896 11.7915 10.5318 12.348 11.0894C12.9187 10.2861 13.2557 9.34047 13.3217 8.35732C13.3876 7.37417 13.1799 6.39196 12.7216 5.51968C12.2633 4.64739 11.5723 3.91912 10.7253 3.41567C9.87826 2.91222 8.90831 2.65327 7.92305 2.66754C6.93779 2.68182 5.97575 2.96876 5.14366 3.49655C4.31157 4.02433 3.64195 4.77231 3.20911 5.65751C2.77626 6.54271 2.59711 7.53052 2.69152 8.51134C2.78594 9.49217 3.15023 10.4277 3.74398 11.214V11.2134ZM7.99998 8.66671C7.29274 8.66671 6.61446 8.38576 6.11436 7.88566C5.61426 7.38556 5.33331 6.70728 5.33331 6.00004C5.33331 5.2928 5.61426 4.61452 6.11436 4.11442C6.61446 3.61433 7.29274 3.33337 7.99998 3.33337C8.70722 3.33337 9.3855 3.61433 9.8856 4.11442C10.3857 4.61452 10.6666 5.2928 10.6666 6.00004C10.6666 6.70728 10.3857 7.38556 9.8856 7.88566C9.3855 8.38576 8.70722 8.66671 7.99998 8.66671ZM7.99998 7.33337C8.3536 7.33337 8.69274 7.1929 8.94279 6.94285C9.19284 6.6928 9.33331 6.35366 9.33331 6.00004C9.33331 5.64642 9.19284 5.30728 8.94279 5.05723C8.69274 4.80718 8.3536 4.66671 7.99998 4.66671C7.64636 4.66671 7.30722 4.80718 7.05717 5.05723C6.80712 5.30728 6.66665 5.64642 6.66665 6.00004C6.66665 6.35366 6.80712 6.6928 7.05717 6.94285C7.30722 7.1929 7.64636 7.33337 7.99998 7.33337Z"
              fill="#11181C"
            />
          </svg>
        </div>
        <p className="self-stretch text-grey-80 text-sm font-medium leading-normal">
          View Profile
        </p>
      </Link>

      <Link
        href="/settings"
        onClick={onClose}
        className="self-stretch px-4 py-3 border-b border-grey-20 justify-start items-center gap-2.5 inline-flex cursor-pointer transition hover:bg-grey-10 text-grey-80 hover:text-grey-90"
      >
        <div className="w-4 h-4 relative overflow-hidden flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M6.66683 1.33337H9.3335L9.78016 3.12004C10.1375 3.26671 10.4802 3.46671 10.7868 3.72004L12.5468 3.17337L13.8802 5.50671L12.4535 6.70671C12.4935 6.92004 12.5202 7.12671 12.5202 7.33337C12.5202 7.54004 12.4935 7.74671 12.4535 7.96004L13.8802 9.16004L12.5468 11.4934L10.7868 10.9467C10.4802 11.2 10.1375 11.4 9.78016 11.5467L9.3335 13.3334H6.66683L6.22016 11.5467C5.86283 11.4 5.52016 11.2 5.2135 10.9467L3.4535 11.4934L2.12016 9.16004L3.54683 7.96004C3.50683 7.74671 3.48016 7.54004 3.48016 7.33337C3.48016 7.12671 3.50683 6.92004 3.54683 6.70671L2.12016 5.50671L3.4535 3.17337L5.2135 3.72004C5.52016 3.46671 5.86283 3.26671 6.22016 3.12004L6.66683 1.33337ZM8.00016 9.33337C9.10473 9.33337 10.0002 8.43794 10.0002 7.33337C10.0002 6.2288 9.10473 5.33337 8.00016 5.33337C6.89559 5.33337 6.00016 6.2288 6.00016 7.33337C6.00016 8.43794 6.89559 9.33337 8.00016 9.33337Z"
              fill="#11181C"
            />
          </svg>
        </div>
        <p className="self-stretch text-grey-80 text-sm font-medium leading-normal">
          Settings
        </p>
      </Link>

      <button
        type="button"
        onClick={handleLogoutClick}
        className="self-stretch px-4 py-3 justify-start items-center gap-2.5 inline-flex cursor-pointer transition hover:bg-grey-10 text-grey-80 hover:text-red-600 w-full text-left"
      >
        <div className="w-4 h-4 relative overflow-hidden flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M3.33335 14.6667C3.15654 14.6667 2.98697 14.5965 2.86195 14.4714C2.73693 14.3464 2.66669 14.1769 2.66669 14V2.00004C2.66669 1.82323 2.73693 1.65366 2.86195 1.52864C2.98697 1.40361 3.15654 1.33337 3.33335 1.33337H12.6667C12.8435 1.33337 13.0131 1.40361 13.1381 1.52864C13.2631 1.65366 13.3334 1.82323 13.3334 2.00004V4.00004H12V2.66671H4.00002V13.3334H12V12H13.3334V14C13.3334 14.1769 13.2631 14.3464 13.1381 14.4714C13.0131 14.5965 12.8435 14.6667 12.6667 14.6667H3.33335ZM12 10.6667V8.66671H7.33335V7.33337H12V5.33337L15.3334 8.00004L12 10.6667Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <p className="self-stretch text-sm font-medium leading-normal">
          Log Out
        </p>
      </button>
    </div>
  );
}
