import React from "react";
import {
  Check,
  ClipboardList,
  FlaskConical,
  PackageCheck,
  TestTubeDiagonal,
} from "lucide-react";

const iconProps = { size: 16, strokeWidth: 1.6 };

const STEPS = [
  { label: "Receiving", Icon: PackageCheck },
  { label: "Pre-processing", Icon: ClipboardList },
  { label: "Virus Isolation", Icon: FlaskConical },
  { label: "Extraction", Icon: FlaskConical },
  { label: "Testing", Icon: TestTubeDiagonal },
  { label: "Completed", Icon: Check },
];

export default function AccessionProgressbar({
  stepIndex,
}: {
  stepIndex: number;
}) {
  const lastIndex = STEPS.length - 1;
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {STEPS.map((step, index) => {
        const isCompleted =
          stepIndex > index || (stepIndex === lastIndex && index === lastIndex);
        const isActive = stepIndex === index && !isCompleted;
        const Icon = step.Icon;

        return (
          <React.Fragment key={step.label}>
            <div className="flex items-center gap-2">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
                  isCompleted
                    ? "bg-blue-40 text-white border-blue-40"
                    : isActive
                      ? "bg-blue-10 text-blue-50 border-blue-40 shadow-sm"
                      : "bg-white text-grey-60 border-grey-30"
                }`}
              >
                {isCompleted ? (
                  <Check size={16} strokeWidth={1.8} />
                ) : (
                  <Icon {...iconProps} />
                )}
              </div>
              <div className="flex flex-col">
                <p
                  className={`font-medium text-sm ${
                    isActive ? "text-blue-50" : "text-grey-70"
                  }`}
                >
                  {step.label}
                </p>
                {isCompleted && (
                  <p className="text-[11px] text-green-30">Done</p>
                )}
                {isActive && (
                  <p className="text-[11px] text-grey-60">In progress</p>
                )}
              </div>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`h-px w-8 ${
                  stepIndex > index ? "bg-blue-40" : "bg-grey-20"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
