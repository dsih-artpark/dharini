import React from "react";
import { Table } from "../policy-ui";

export default function Sharing() {
  return (
    <section id="sharing">
      <h2>6. Sharing and third-party services</h2>
      <p>
        We share information only with members of your project, the organisation
        running the project, the service providers below, and authorities where
        the law requires it.
      </p>
      <h3>6.1 Within Dharini</h3>
      <ul>
        <li>
          Users in your workspace and project see the sites, visits, samples and
          results they are permitted to see.
        </li>
        <li>
          Project viewers and partner teams may see aggregated maps, dashboards
          and reports.
        </li>
        <li>
          Exported reports (CSV, Excel, PDF, Word) contain the data visible to
          the user who exports them.
        </li>
      </ul>
      <h3>6.2 Service providers</h3>
      <Table
        head={["Provider", "Purpose", "Information shared"]}
        rows={[
          ["Twilio", "Sending login OTPs by SMS", "Mobile number, OTP"],
          [
            "SMTP (AWS SES, Resend as fallback)",
            "Sending login OTPs and invitations by email",
            "Email address, name, OTP or invite link",
          ],
          [
            "Sentry",
            "Crash reporting (mobile)",
            "Error details, device model, OS, app version",
          ],
          [
            "OpenWeatherMap, Open-Meteo",
            "Weather data for a site",
            "Site coordinates",
          ],
          [
            "eBird (Cornell Lab of Ornithology)",
            "Recent bird sightings near a site",
            "Site coordinates",
          ],
          [
            "OpenStreetMap, OpenTopoMap, Stadia Maps",
            "Map display and place search",
            "IP address, map area viewed, place names you search for",
          ],
          [
            "AWS",
            "Running servers, database and file storage",
            "All information stored by Dharini",
          ],
        ]}
      />
      <p>
        These providers may process data outside India. They are permitted to
        use it only to provide their service to us.
      </p>
      <h3>6.3 Legal and public-health disclosures</h3>
      <p>
        We may disclose information to government or public-health authorities
        when required by law, or to report notifiable diseases as part of a
        surveillance programme.
      </p>
    </section>
  );
}
