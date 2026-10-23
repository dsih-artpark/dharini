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
            "Before and after values of every change to a sample, who made the change and when",
          ],
        ]}
      />

      <h3>2.5 Device, usage and technical data</h3>
      <ul>
        <li>
          <strong>Usage analytics</strong>: pages, screens and actions you use,
          collected through PostHog (details in section 2.6).
        </li>
        <li>
          <strong>Session recordings (web and mobile app)</strong>: recordings
          of on-screen activity in the web app, including the public landing
          page before you log in, and in the mobile app. They are used to
          understand how Dharini is used and to diagnose problems (details in
          section 2.6). Text and images on screen are hidden in these
          recordings.
        </li>
        <li>
          <strong>Crash and performance data</strong>: error reports, stack
          traces, performance timings, app version, device model and operating
          system.
        </li>
        <li>
          <strong>Network data</strong>: IP address and browser or device type,
          received by our servers and service providers when you use Dharini.
        </li>
      </ul>

      <h3>2.6 Analytics and session recordings (PostHog)</h3>
      <p>
        We use <strong>PostHog</strong>, an optional product analytics service
        run by PostHog Inc., to understand how Dharini is used and to find
        problems. Its data is stored on PostHog&rsquo;s servers in the{" "}
        <strong>United States</strong>. PostHog processes this data only on our
        behalf. It is not used for advertising and is not sold. PostHog
        integration is optional and can be disabled when deploying Dharini
        on-premises or on a third-party cloud infrastructure. On the web it
        runs on every page, including the public landing page and this privacy
        policy, before you log in.
      </p>
      <h4>What is recorded</h4>
      <Table
        head={["Type", "Web app", "Mobile app"]}
        rows={[
          [
            "Page and screen views",
            "Pages opened and left, with their web address",
            "Screens opened, app opened, sent to background and closed",
          ],
          [
            "Actions",
            "Clicks, form submissions, and named events such as login, dashboard viewed, lab step started or completed, sample selected",
            "Named events such as login, site creation started or completed, visit created or completed",
          ],
          [
            "Session recordings",
            "An outline of the pages you see, with all text and form inputs hidden and images blocked (map tiles stay visible), with clicks, scrolls and page changes",
            "An outline of the screens you see, with all text and images hidden, with taps, scrolls and screen changes, captured about every 0.3 seconds",
          ],
          [
            "Device and network",
            "Browser, operating system, screen size, IP address, approximate location (city or region) worked out from the IP address",
            "Device model, operating system, app version, IP address, approximate location worked out from the IP address",
          ],
          [
            "Identity",
            "User ID, role, team, project and organisation",
            "User ID, role, team, project and organisation",
          ],
        ]}
      />
      <h4>What is not sent</h4>
      <ul>
        <li>
          We do not send your name, phone number or email address to PostHog as
          analytics properties. Before error messages are sent, phone numbers,
          email addresses and OTPs are removed from them.
        </li>
        <li>Password and secure fields are always hidden in recordings.</li>
        <li>
          In the web app, all text and form inputs on screen are hidden in
          recordings and images are blocked, except map tiles. This applies to
          the landing page as well as the signed-in app.
        </li>
        <li>
          In the mobile app, all text, numbers and images on screen are hidden
          in recordings before they leave your device. Names, phone numbers,
          site owner details, animal records and lab results are not captured.
          Recordings show only the layout of each screen and where you tapped.
        </li>
        <li>
          Dharini does not share surveillance data, including animal IDs, site
          locations and details, or laboratory results, with PostHog. PostHog is
          an optional analytics service and can be disabled for on-premises
          deployments or deployments hosted on other cloud infrastructure.
        </li>
      </ul>
      <h4>How it is stored</h4>
      <ul>
        <li>
          Before you log in, events are linked to a random identifier. After you
          log in, they are linked to your Dharini user ID.
        </li>
        <li>
          On the web, PostHog keeps this identifier in your browser&rsquo;s
          local storage. On mobile, it is stored inside the app.
        </li>
        <li>
          If the mobile app is offline, events wait on the device and are sent
          when you reconnect.
        </li>
        <li>
          How long PostHog keeps analytics events and session recordings is set
          in the PostHog project of the Dharini deployment you use. Ask its
          administrator (section 8) for the period.
        </li>
      </ul>
      <h4>Your choices</h4>
      <ul>
        <li>
          To have your analytics data and recordings deleted, contact the
          administrator of the Dharini deployment you use. Their details are
          listed in section 8. When an administrator deletes your record in
          PostHog, your recordings are deleted with it.
        </li>
      </ul>
    </section>
  );
}
