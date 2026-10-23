"use client";

import React, { useState, useEffect, useMemo } from "react";
import CustomModal from "@/src/components/ui/custom-modal";
import { ScheduleItem } from "@/src/components/projects/sites/scheduled-visits-list";
import { X, AlertCircle } from "lucide-react";

interface RescheduleVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  visit: ScheduleItem | null;
  onConfirm: (visitId: string, newDateIso: string) => Promise<void> | void;
}

export default function RescheduleVisitModal({
  isOpen,
  onClose,
  visit,
  onConfirm,
}: RescheduleVisitModalProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Minimum selectable date is today
  const todayStr = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  useEffect(() => {
    if (isOpen && visit) {
      setSelectedDate("");
      setError("");
      setIsSubmitting(false);
    }
  }, [isOpen, visit]);

  if (!isOpen || !visit) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) {
      setError("Please select a new date for this visit.");
      return;
    }
    if (selectedDate < todayStr) {
      setError("Please select today or a future date.");
      return;
    }
    try {
      setIsSubmitting(true);
      setError("");
      await onConfirm(visit.id, selectedDate);
      onClose();
    } catch (err) {
      setError(
        (err instanceof Error && err.message) || "Failed to reschedule visit.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomModal isOpen={isOpen}>
      <div className="w-full max-w-md mx-4 overflow-hidden rounded-2xl border border-grey-20 bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-grey-20 px-6 py-4 bg-white">
          <h3 className="text-lg font-semibold text-grey-90">
            Reschedule Visit
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-grey-20 text-grey-70 hover:bg-grey-10 transition active:scale-95"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {/* Current schedule info */}
          <div className="rounded-xl border border-grey-20 bg-grey-10/70 p-3.5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-grey-60 font-medium">
                Current Scheduled Date
              </span>
              <span className="text-sm font-semibold text-grey-90 mt-0.5">
                {visit.dayOfWeek}, {visit.dayNumber} {visit.monthYear}
              </span>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white border border-grey-20 text-grey-70 shadow-xs">
              {visit.status}
            </span>
          </div>

          {/* New Date Selector */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="newDate"
              className="text-xs font-semibold uppercase tracking-wider text-grey-70"
            >
              Select New Date <span className="text-red-30">*</span>
            </label>
            <input
              id="newDate"
              type="date"
              min={todayStr}
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setError("");
              }}
              className="w-full rounded-lg border border-grey-20 bg-white px-3 py-2.5 text-sm text-grey-90 shadow-xs focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-10 p-3 text-xs text-red-30">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-grey-20 pt-4 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-grey-20 bg-white px-4 py-2 text-sm font-medium text-grey-70 hover:bg-grey-10 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-40 px-5 py-2 text-sm font-medium text-white shadow-xs hover:bg-blue-50 transition active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? "Rescheduling..." : "Confirm Reschedule"}
            </button>
          </div>
        </form>
      </div>
    </CustomModal>
  );
}
