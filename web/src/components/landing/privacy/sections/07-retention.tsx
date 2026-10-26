import React from "react";
import { Table } from "../policy-ui";

export default function Retention() {
  return (
    <section id="retention">
      <h2>7. How long we keep information</h2>
      <p>
        We keep surveillance records for as long as the project needs them for
        public-health purposes, then delete them.
      </p>
      <Table
        head={["Information", "How long it is kept"]}
        rows={[
          [
            "OTPs",
            "Valid for 3 minutes; replaced when a new code is requested",
          ],
          ["Failed login attempt counters", "A few minutes"],
          [
            "File viewing and upload links",
            "1 hour (viewing), 5 minutes (upload)",
          ],
          ["Login sessions", "7 days (web and mobile). The web login cookie is kept for about 8 days"],
          ["Unaccepted invitations", "Expires after 24 hours"],
          ["User accounts", "While the project is active"],
          [
            "Sites, visits, samples, lab results and audit trail",
            "Until the project is deleted from the platform. Deleting a project automatically deletes its sites, visits, samples and results",
          ],
          [
            "Offline data on your device",
            "Until it is synced to the server, or the app is removed",
          ],
          ["Crash reports", "30 days"],
        ]}
      />
      <p>
        When a record is removed in the app, it is usually marked inactive
        rather than erased, so the audit trail stays complete. Project
        administrators can permanently delete samples, visits, sites and whole
        projects, including their linked records and files.
      </p>
    </section>
  );
}
