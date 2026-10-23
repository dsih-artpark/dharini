import React from "react";

export function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="mb-[18px] overflow-x-auto rounded-lg border border-landing-border">
      <table className="w-full border-collapse text-sm leading-[1.6]">
        <thead>
          <tr>
            {head.map((h) => (
              <th
                key={h}
                scope="col"
                className="border-b border-landing-border bg-landing-lav px-3.5 py-2.5 text-left font-semibold text-landing-ink"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="[&:last-child>td]:border-b-0">
              {row.map((cell, i) => (
                <td
                  key={i}
                  className="border-b border-[#ece8f8] px-3.5 py-2.5 align-top first:min-w-[150px] first:font-medium first:text-landing-ink"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// The policy text is plain semantic HTML (h2/h3/p/ul), so it is styled from
// the article wrapper instead of every element carrying its own classes.
export const POLICY_PROSE_CLASS = [
  "max-w-[760px] text-[15.5px] leading-[1.75] text-landing-ink-2",
  "[&_section]:mb-10 [&_section]:scroll-mt-[88px] [&_section]:border-b [&_section]:border-[#ece8f8] [&_section]:pb-10",
  "[&_section:last-child]:mb-0 [&_section:last-child]:border-b-0",
  "[&_h2]:mb-4 [&_h2]:font-serif [&_h2]:text-[25px] [&_h2]:leading-[1.2] [&_h2]:text-landing-ink sm:[&_h2]:text-[30px]",
  "[&_h3]:mb-3 [&_h3]:mt-[30px] [&_h3]:text-[17px] [&_h3]:font-semibold [&_h3]:text-landing-ink",
  "[&_h4]:mb-2 [&_h4]:mt-6 [&_h4]:text-[15px] [&_h4]:font-semibold [&_h4]:text-landing-ink",
  "[&_p]:mb-3.5",
  "[&_ul]:mb-3.5 [&_ul]:list-disc [&_ul]:pl-5",
  "[&_li]:mb-1.5 [&_li]:marker:text-landing-purple",
  "[&_strong]:font-semibold [&_strong]:text-landing-ink",
  "[&_a]:text-landing-purple [&_a]:underline [&_a]:underline-offset-[3px]",
].join(" ");
