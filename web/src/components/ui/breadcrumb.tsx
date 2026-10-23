"use client";

import { Fragment } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useIsSuperAdmin } from "@/src/hooks/check-permission";

type Crumb = {
  name: string;
  href: string;
};

export default function Breadcrumb({
  path = [],
  className,
}: {
  path: Crumb[];
  className?: string;
}) {
  const router = useRouter();
  const isSuperAdmin = useIsSuperAdmin();

  const paths = isSuperAdmin
    ? [{ name: "Projects", href: "/manage" }, ...path]
    : path;

  return (
    <div
      className={`px-4 sm:px-8 lg:px-20 py-3 bg-grey-10 border-b border-grey-20 justify-start items-center gap-3 inline-flex ${className}`}
    >
      {paths.length > 1 && (
        <div
          className="w-5 h-5 relative cursor-pointer"
          onClick={() => router.back()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M9.02268 10.0006L13.1477 14.1256L11.9693 15.3039L6.66602 10.0006L11.9693 4.69727L13.1477 5.8756L9.02268 10.0006Z"
              fill="#889096"
            />
          </svg>
        </div>
      )}
      <div className="flex items-center justify-start gap-2 flex-wrap">
        {paths.map((crumb, i) => (
          <Fragment key={i}>
            {i === paths.length - 1 ? (
              <p className="text-grey-70 text-sm leading-normal">
                {crumb.name}
              </p>
            ) : (
              <Link
                href={crumb.href}
                className="text-blue-40 text-sm leading-normal hover:underline hover:cursor-pointer"
              >
                {crumb.name}
              </Link>
            )}
            {i < paths.length - 1 && (
              <span className="text-grey-70 text-sm leading-normal">/</span>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
