"use client";

import { useEffect, useMemo } from "react";
import { User } from "@/src/types/global";
import Select from "@/src/components/ui/select";

interface TeamMemberSelectProps {
  value: string;
  onChange: (memberId: string) => void;
  teamMembers: User[];
  loading?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
  currentUserId?: string;
  defaultToCurrentUser?: boolean;
  className?: string;
}

export default function TeamMemberSelect({
  value,
  onChange,
  teamMembers,
  loading = false,
  error,
  label = "Performed By",
  required = true,
  currentUserId,
  defaultToCurrentUser = true,
  className = "",
}: TeamMemberSelectProps) {
  useEffect(() => {
    if (
      defaultToCurrentUser &&
      currentUserId &&
      !value &&
      teamMembers.length > 0
    ) {
      const isCurrentUserInTeam = teamMembers.some(
        (m) => m.id === currentUserId,
      );
      if (isCurrentUserInTeam) {
        onChange(currentUserId);
      }
    }
  }, [defaultToCurrentUser, currentUserId, value, teamMembers, onChange]);

  const options = useMemo(() => {
    return teamMembers.map((member) => ({
      label: `${member.firstName} ${member.lastName}`,
      value: member.id,
    }));
  }, [teamMembers]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-1">
        <div className="w-5 h-5 rounded-full bg-blue-50/10 flex items-center justify-center text-blue-600">
          <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 10C11.6569 10 13 8.65685 13 7C13 5.34315 11.6569 4 10 4C8.34315 4 7 5.34315 7 7C7 8.65685 8.34315 10 10 10Z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M4 16C4.5 13 7 12 10 12C13 12 15.5 13 16 16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        {label} {required && <span className="text-red-400 font-bold">*</span>}
      </label>

      <Select
        name="teamMember"
        options={options}
        defaultValue={value}
        className="w-full border-grey-30 hover:border-blue-30 focus-within:border-blue-40 shadow-sm"
        placeholder={loading ? "Loading..." : "Select team member"}
        onChange={handleChange}
      />

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
