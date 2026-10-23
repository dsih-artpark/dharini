import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import { useAtom } from "jotai";
import { selectedProcessableSamplesAtom } from "@/src/store/processableSamplesAtom";
import { SampleStatusType } from "@/src/types/sample";

import SampleReceiving from "./sample-accession/sample-receiving";
import SampleExtraction from "./sample-accession/sample-extraction";
import SampleTesting from "./sample-accession/sample-testing";
import SamplePreprocessing from "./sample-accession/sample-preprocessing";
import VirusIsolation from "./sample-accession/virus-isolation";

interface BulkProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: SampleStatusType;
  onTabChange?: (tab: SampleStatusType) => void;
  onSuccess?: (nextTab?: SampleStatusType) => void;
}

export default function BulkProcessModal({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  onSuccess,
}: BulkProcessModalProps) {
  const [selectedProcessableSamples] = useAtom(selectedProcessableSamplesAtom);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  // Don't render content if not open or no samples selected
  if (!isOpen || selectedProcessableSamples.length === 0) return null;

  const handleBulkSuccess = (
    action: "exit" | "proceed" | "complete" | "back" | "skip",
    explicitNextTab?: SampleStatusType,
  ) => {
    const tabOrder: SampleStatusType[] = [
      "picked-up",
      "received",
      "virus-isolation",
      "pre-processed",
      "extracted",
      "test-report-generated",
    ];
    const currentIndex = tabOrder.indexOf(activeTab);

    let nextTab =
      explicitNextTab ||
      (currentIndex !== -1 && currentIndex < tabOrder.length - 1
        ? tabOrder[currentIndex + 1]
        : undefined);
    let prevTab = currentIndex > 0 ? tabOrder[currentIndex - 1] : undefined;

    const isAI = selectedProcessableSamples.some(
      (s) =>
        s.hasAI || s.diseases?.some((d) => d.shortName?.toUpperCase() === "AI"),
    );

    if (action === "back" && activeTab === "pre-processed" && !isAI) {
      prevTab = "received";
    }

    if (!explicitNextTab && activeTab === "virus-isolation") {
      if (action === "proceed") nextTab = "pre-processed";
      if (action === "skip") nextTab = "extracted";
      prevTab = "received";
    }

    if (
      action === "proceed" ||
      action === "skip" ||
      (action === "complete" && nextTab)
    ) {
      // Advance to targeted step
      if (nextTab && onTabChange) {
        onTabChange(nextTab);
      } else {
        if (onSuccess) onSuccess(nextTab);
        else onClose();
      }
    } else if (action === "back") {
      if (prevTab && onTabChange) {
        onTabChange(prevTab);
      } else {
        if (onSuccess) onSuccess();
        else onClose();
      }
    } else if (action === "exit" || action === "complete") {
      // Close modal and surface background tab to correct branch
      if (onSuccess) onSuccess(nextTab);
      else onClose();
    } else {
      if (onSuccess) onSuccess();
      else onClose();
    }
  };

  const getStepName = (tab: SampleStatusType) => {
    switch (tab) {
      case "picked-up":
        return "Receiving";
      case "received":
        return "Pre-processing";
      case "pre-processed":
        return "Extraction";
      case "virus-isolation":
        return "Virus Isolation";
      case "extracted":
        return "Testing";
      default:
        return "";
    }
  };

  const renderActiveForm = () => {
    switch (activeTab) {
      case "picked-up":
        return <SampleReceiving isBulkMode onBulkSuccess={handleBulkSuccess} />;
      case "received":
        return (
          <SamplePreprocessing isBulkMode onBulkSuccess={handleBulkSuccess} />
        );
      case "virus-isolation":
        return <VirusIsolation isBulkMode onBulkSuccess={handleBulkSuccess} />;
      case "pre-processed":
        return (
          <SampleExtraction isBulkMode onBulkSuccess={handleBulkSuccess} />
        );
      case "extracted":
        return <SampleTesting isBulkMode onBulkSuccess={handleBulkSuccess} />;
      default:
        return (
          <div className="p-8 text-center text-grey-60">
            Bulk processing is not available for the &quot;{activeTab}&quot;
            stage yet.
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6"
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="bg-grey-10 w-full max-w-[90vw] max-h-[90vh] rounded-2xl shadow-xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-grey-20 bg-white shrink-0 sticky top-0 z-10">
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold text-grey-80 font-noto-serif">
                  Bulk Processing Action - {getStepName(activeTab)}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-2 max-h-[84px] overflow-y-auto pr-2 custom-scrollbar">
                  <div className="text-sm font-medium text-blue-40 bg-blue-10 px-2 py-1 rounded-md shrink-0">
                    Applying to {selectedProcessableSamples.length}{" "}
                    {selectedProcessableSamples.length === 1
                      ? "sample"
                      : "samples"}
                    :
                  </div>
                  {(() => {
                    const pooledGroups = new Map<
                      string,
                      typeof selectedProcessableSamples
                    >();
                    const individualSamples: typeof selectedProcessableSamples =
                      [];

                    selectedProcessableSamples.forEach((s) => {
                      const pId = s.details?.preprocessing?.pooledId;
                      // Group if it's explicitly pooled and has a pooledId
                      if (s.isPooledSample && pId) {
                        if (!pooledGroups.has(pId)) pooledGroups.set(pId, []);
                        pooledGroups.get(pId)!.push(s);
                      } else {
                        individualSamples.push(s);
                      }
                    });

                    const elements: React.ReactNode[] = [];

                    // Render pooled groups
                    pooledGroups.forEach((samples, pId) => {
                      elements.push(
                        <div
                          key={pId}
                          className="flex items-center gap-1.5 px-2.5 py-1 bg-teal-50 border border-teal-200 rounded-md text-xs shrink-0"
                        >
                          <span className="font-medium text-teal-800">
                            Pool ID: {pId}
                          </span>
                          <span className="text-teal-600">
                            ({samples.length} samples)
                          </span>
                        </div>,
                      );
                    });

                    // Render non-pooled samples
                    individualSamples.forEach((s) => {
                      elements.push(
                        <div
                          key={s.id}
                          className="flex items-center gap-1.5 px-2.5 py-1 bg-grey-10 border border-grey-20 rounded-md text-xs shrink-0"
                        >
                          <span className="font-medium text-grey-80">
                            {s.barcode}
                          </span>
                          {s.sampleType?.name && (
                            <>
                              <span className="text-grey-40">|</span>
                              <span className="text-grey-60 truncate max-w-[150px]">
                                {s.sampleType.name}
                              </span>
                            </>
                          )}
                        </div>,
                      );
                    });

                    return elements;
                  })()}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-grey-50 hover:text-red-50 hover:bg-red-50/10 rounded-full transition-colors flex items-center justify-center"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form Content Area */}
            <div className="flex-1 overflow-y-auto w-full bg-white p-6 sm:p-8">
              <div className="w-full">{renderActiveForm()}</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
