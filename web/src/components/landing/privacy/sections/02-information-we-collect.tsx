import React from "react";
import { Table } from "../policy-ui";

export default function InformationWeCollect() {
  return (
    <section id="information-we-collect">
      <h2>2. Information we collect</h2>
      <p>
        We collect account details about users, contact details about site
        owners, precise location, surveillance and laboratory records, and
        technical data about how the apps are used.
      </p>

      <h3>2.1 Platform users</h3>
      <Table
        head={["Category", "Details"]}
        rows={[
          [
            "Identity",
            "First name, last name, designation or job title, profile picture",
          ],
          ["Contact", "Mobile number, email address, postal address"],
          [
            "Account and access",
            "User ID, role, team, project, workspace, organisation, account status, date created and updated",
          ],
          [
            "Login",
            "One-time passwords (OTPs) sent to your phone or email, their expiry time, failed attempt counts",
          ],
          [
            "Invitations",
            "Who invited you, invitee name, phone, email, team, role, project, invite token and expiry date",
          ],
          [
            "Activity records",
            "Which samples you collected, received, preprocessed, extracted, tested or reported on, and when; sites and projects you created or edited",
          ],
        ]}
      />

      <h3>2.2 Site owners and sites</h3>
      <Table
        head={["Category", "Details"]}
        rows={[
          ["Owner contact", "Site owner’s name and phone number (optional)"],
          [
            "Site details",
            "Site name and code, site type and sub-type (for example poultry farm, broiler), number of workers",
          ],
          ["Address", "Address, village, block, PIN code, region or district"],
          ["Consent", "Record of the owner’s consent to sample collection"],
          ["Photos", "Photos of the site taken during registration or visits"],
          [
            "Schedule",
            "Collection frequency, days, times, start and expiry dates, assigned collector",
          ],
        ]}
      />

      <h3>2.3 Location</h3>
      <ul>
        <li>
          <strong>Device location</strong>: precise GPS location from the mobile
          device when you register a site or complete a visit.
        </li>
        <li>
          <strong>Visit location</strong>: the coordinates where each visit was
          completed.
        </li>
        <li>
          <strong>Site and sample location</strong>: the coordinates of each
          site and sample, linked to a region or district.
        </li>
      </ul>

      <h3>2.4 Surveillance, animal and laboratory data</h3>
      <Table
        head={["Category", "Details"]}
        rows={[
          [
            "Visits",
            "Scheduled, started and completed times, round, status, collector, comments, photos",
          ],
          [
            "Questionnaires",
            "Answers to disease and environmental questionnaires, suspected positive cases",
          ],
          [
            "Animal details",
            "Tag or bird ID, species, breed, age, sex, vaccination stage, disease history, milk yield, fever, date symptoms were first noticed, vectors, drops in feed, water or egg intake",
          ],
          [
            "Samples",
            "Barcode, accession ID, sample type, quantity, habitat, collection time, storage temperature and details, rejection reasons, photos, pooling and replicate links",
          ],
          [
            "Lab results",
            "Disease tested, test result, Ct value, variant, viral load, kit or protocol, comments, result reports",
          ],
          [
            "Genomic sequencing",
            "Sequence files and metadata (platform, library type, method, file format), NCBI accession, organism and title",
          ],
          [
            "Audit trail",
            "A record of changes made to a sample during collection and laboratory processing, including previous and new values, who made the change and when",
          ],
        ]}
      />

      <h3>2.5 Device and technical data</h3>
      <ul>
        <li>
          <strong>Crash data</strong>: error reports, stack traces, app version,
          device model and operating system.
        </li>
        <li>
          <strong>Network data</strong>: IP address and browser or device type,
          received by our servers and service providers when you use Dharini.
        </li>
      </ul>
    </section>
  );
}
