import Link from "next/link";
import type { ProjectDetail } from "@/src/types/global";
import { DISEASE_COLOR_CODE } from "@/src/utils/constant";

export default function ProjectListItem({
  project,
}: {
  project: ProjectDetail;
}) {
  const adminNames = project.projectAdmins?.length
    ? project.projectAdmins
        .map((admin) =>
          `${admin.firstName ?? ""} ${admin.lastName ?? ""}`.trim(),
        )
        .join(", ")
    : "—";

  const locations = project.regions?.length
    ? project.regions.map((r) => r?.name).join(", ")
    : "—";

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group flex flex-col rounded-xl border border-grey-20 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-grey-30"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold leading-snug text-grey-90 line-clamp-1">
            {project.name}
          </h3>
          {/* <p className="mt-1 text-xs text-grey-60 leading-5">
            Code: {project.code}
          </p> */}
        </div>
      </div>

      {/* Admin & Location */}
      <div className="mt-3 flex flex-col gap-1.5">
        {project.projectAdmins?.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-grey-70">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 20 21"
              fill="none"
              className="shrink-0"
            >
              <path
                d="M2.5 4.6625C2.5 3.74417 3.24417 3 4.1625 3H15.8375C16.7558 3 17.5 3.74417 17.5 4.6625V16.3375C17.5 16.7784 17.3248 17.2013 17.0131 17.5131C16.7013 17.8248 16.2784 18 15.8375 18H4.1625C3.72158 18 3.29871 17.8248 2.98693 17.5131C2.67516 17.2013 2.5 16.7784 2.5 16.3375V4.6625ZM4.16667 4.66667V16.3333H15.8333V4.66667H4.16667ZM6.64333 15.65C6.13082 15.428 5.64196 15.155 5.18417 14.835C5.71272 14.0159 6.4383 13.3424 7.29449 12.8762C8.15068 12.41 9.11013 12.1661 10.085 12.1667C12.085 12.1667 13.8492 13.1725 14.9 14.7058C14.451 15.038 13.9697 15.3242 13.4633 15.56C13.0774 15.025 12.5698 14.5894 11.9824 14.2892C11.395 13.989 10.7447 13.8327 10.085 13.8333C8.65583 13.8333 7.39333 14.5533 6.64333 15.65ZM10 11.3333C9.61698 11.3333 9.23771 11.2579 8.88384 11.1113C8.52997 10.9647 8.20844 10.7499 7.93761 10.4791C7.66677 10.2082 7.45193 9.88669 7.30535 9.53283C7.15877 9.17896 7.08333 8.79969 7.08333 8.41667C7.08333 8.03364 7.15877 7.65437 7.30535 7.30051C7.45193 6.94664 7.66677 6.62511 7.93761 6.35427C8.20844 6.08343 8.52997 5.86859 8.88384 5.72202C9.23771 5.57544 9.61698 5.5 10 5.5C10.7735 5.5 11.5154 5.80729 12.0624 6.35427C12.6094 6.90125 12.9167 7.64312 12.9167 8.41667C12.9167 9.19021 12.6094 9.93208 12.0624 10.4791C11.5154 11.026 10.7735 11.3333 10 11.3333ZM10 9.66667C10.3315 9.66667 10.6495 9.53497 10.8839 9.30055C11.1183 9.06613 11.25 8.74819 11.25 8.41667C11.25 8.08515 11.1183 7.7672 10.8839 7.53278C10.6495 7.29836 10.3315 7.16667 10 7.16667C9.66848 7.16667 9.35054 7.29836 9.11612 7.53278C8.8817 7.7672 8.75 8.08515 8.75 8.41667C8.75 8.74819 8.8817 9.06613 9.11612 9.30055C9.35054 9.53497 9.66848 9.66667 10 9.66667Z"
                fill="#889096"
              />
            </svg>
            <span className="truncate">{adminNames}</span>
          </div>
        )}
        {project.regions?.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-grey-70">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
              className="shrink-0"
            >
              <path
                d="M10 17.416L14.125 13.291C14.9408 12.4751 15.4963 11.4357 15.7213 10.3042C15.9463 9.17264 15.8308 7.99978 15.3892 6.93391C14.9477 5.86805 14.2 4.95704 13.2408 4.31609C12.2815 3.67514 11.1537 3.33304 10 3.33304C8.8463 3.33304 7.71851 3.67514 6.75924 4.31609C5.79997 4.95704 5.05229 5.86805 4.61076 6.93391C4.16923 7.99978 4.05368 9.17264 4.27871 10.3042C4.50374 11.4357 5.05926 12.4751 5.875 13.291L10 17.416ZM10 19.7726L4.69667 14.4693C3.64779 13.4204 2.93349 12.084 2.64411 10.6292C2.35473 9.1743 2.50326 7.66631 3.07092 6.29587C3.63858 4.92543 4.59987 3.75409 5.83324 2.92999C7.0666 2.10588 8.51665 1.66602 10 1.66602C11.4834 1.66602 12.9334 2.10588 14.1668 2.92999C15.4001 3.75409 16.3614 4.92543 16.9291 6.29587C17.4968 7.66631 17.6453 9.1743 17.3559 10.6292C17.0665 12.084 16.3522 13.4204 15.3033 14.4693L10 19.7726ZM10 10.8326C10.442 10.8326 10.866 10.657 11.1785 10.3445C11.4911 10.0319 11.6667 9.60798 11.6667 9.16595C11.6667 8.72392 11.4911 8.3 11.1785 7.98744C10.866 7.67488 10.442 7.49928 10 7.49928C9.55798 7.49928 9.13405 7.67488 8.82149 7.98744C8.50893 8.3 8.33334 8.72392 8.33334 9.16595C8.33334 9.60798 8.50893 10.0319 8.82149 10.3445C9.13405 10.657 9.55798 10.8326 10 10.8326ZM10 12.4993C9.11595 12.4993 8.2681 12.1481 7.64298 11.523C7.01786 10.8979 6.66667 10.05 6.66667 9.16595C6.66667 8.2819 7.01786 7.43405 7.64298 6.80893C8.2681 6.18381 9.11595 5.83262 10 5.83262C10.8841 5.83262 11.7319 6.18381 12.357 6.80893C12.9821 7.43405 13.3333 8.2819 13.3333 9.16595C13.3333 10.05 12.9821 10.8979 12.357 11.523C11.7319 12.1481 10.8841 12.4993 10 12.4993Z"
                fill="#889096"
              />
            </svg>
            <span className="truncate">{locations}</span>
          </div>
        )}
      </div>

      {/* Disease tags */}
      {project.diseases?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {project.diseases.map((disease) => {
            const bg =
              DISEASE_COLOR_CODE.BG_COLOR[disease.index % 6] ?? "bg-teal-20";
            return (
              <div
                key={disease.id}
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-grey-80 ${bg}`}
              >
                {disease.shortName ?? disease.name}
              </div>
            );
          })}
        </div>
      )}

      {/* Divider */}
      <div className="mt-4 border-t border-grey-20" />

      {/* Sites row */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm font-medium text-grey-70">Sites</span>
        <span className="text-xl font-bold text-grey-90">
          {project.totalSiteCount ?? 0}
        </span>
      </div>

      {/* CTA button */}
      <div className="mt-4 inline-flex items-center justify-center rounded-lg border border-grey-20 px-4 py-2.5 text-sm font-medium text-primary-500 transition-colors group-hover:border-grey-30 group-hover:bg-primary-50">
        View Project Details →
      </div>
    </Link>
  );
}
