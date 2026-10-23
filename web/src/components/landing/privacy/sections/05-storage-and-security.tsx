import React from "react";
import { Table } from "../policy-ui";

export default function StorageAndSecurity() {
  return (
    <section id="storage-and-security">
      <h2>5. How information is stored and secured</h2>
      <p>
        For the Dharini service we host, your information is stored in
        Dharini&rsquo;s own database and file storage on servers in AWS
        ap-south-1 (Mumbai, India). If your organisation runs Dharini on its own
        servers, your information is stored wherever your organisation chooses
        to host it. In both cases, a small amount of data is kept for a short
        time on your device so the apps work offline and you stay signed in.
      </p>
      <h3>5.1 Where information is stored</h3>
      <Table
        head={["Store", "What it holds", "How it is protected"]}
        rows={[
          [
            "Central database (PostgreSQL with PostGIS)",
            "User accounts, invitations, sites, visits, questionnaires, animal details, samples, lab results, sequencing records, audit trail, location coordinates",
            "Access only through the Dharini backend; role-based permissions; database credentials kept in server configuration",
          ],
          [
            "File storage (S3-compatible object storage)",
            "Profile pictures, site, visit and sample photos, lab reports, batch documents, genomic sequence files",
            "Files are private; viewing or downloading uses links that expire after 1 hour; upload links expire after 5 minutes",
          ],
          [
            "Temporary cache (Redis)",
            "Failed OTP attempt counters, background job queues, application cache",
            "Short-lived entries; not exposed to the internet",
          ],
          [
            "Mobile app, secure storage",
            "Your login token",
            "Stored in the device’s secure keystore (Android Keystore)",
          ],
          [
            "Mobile app, offline storage",
            "Sites, visits and submissions recorded while offline, and a queue of changes waiting to sync",
            "Kept on the device until synced to the server; removed when you log out or uninstall the app",
          ],
          [
            "Web browser, cookie",
            "Your login token",
            "HTTP-only cookie that expires about 8 days after you log in (the 7-day session plus a 1-day grace period)",
          ],
          [
            "Web browser, local storage",
            "Selected workspace and project, analytics identifiers",
            "Stays in your browser; cleared when you log out or clear browser data",
          ],
        ]}
      />
      <h3>5.2 How we protect it</h3>
      <ul>
        <li>
          <strong>No passwords.</strong> You log in with a one-time password
          sent to your phone or email. Each OTP expires after 3 minutes, and
          repeated wrong attempts are blocked.
        </li>
        <li>
          <strong>Signed sessions.</strong> After login you receive a signed
          access token. Sessions last 7 days on both web and mobile.
        </li>
        <li>
          <strong>Role-based access.</strong> What you can see and change
          depends on your role, team, project and workspace. Data from one
          workspace is not visible to users of another.
        </li>
        <li>
          <strong>Encryption in transit.</strong> Data travelling between the
          apps and our servers is sent over HTTPS (TLS).
        </li>
        <li>
          <strong>Audit trail.</strong> Every change to a sample record is
          logged with the user and time.
        </li>
        <li>
          <strong>Limited staff access.</strong> Only authorised administrators
          can access the servers and database.
        </li>
      </ul>
      <h3>5.3 If personal data is breached</h3>
      <p>
        We keep an incident-response procedure for personal data breaches. If a
        breach affects personal data in Dharini:
      </p>
      <ul>
        <li>
          We contain the incident, find out what data and which people are
          affected, and record it in an internal breach register.
        </li>
        <li>
          We tell the organisation running your project without delay, and
          within 24 hours of confirming the breach, so it can meet its own
          duties.
        </li>
        <li>
          The organisation running the project informs each affected person
          and the Data Protection Board of India without delay, and sends the
          Board a detailed report within 72 hours, as the Digital Personal Data
          Protection Act, 2023 and the DPDP Rules, 2025 require.
        </li>
        <li>
          Cyber security incidents are also reported to CERT-In within the time
          it requires.
        </li>
        <li>
          Each notice describes what happened and when, what data is involved,
          the likely impact, the steps taken, and who to contact.
        </li>
      </ul>
    </section>
  );
}
