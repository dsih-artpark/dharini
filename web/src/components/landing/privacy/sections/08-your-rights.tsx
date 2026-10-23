import React from "react";
import { GRIEVANCE_OFFICER, SUPPORT_EMAIL } from "../../content";

export default function YourRights() {
  return (
    <section id="your-rights">
      <h2>8. Your rights and choices</h2>
      <p>
        Under India&rsquo;s Digital Personal Data Protection Act, 2023 and other
        applicable laws, you can ask us to:
      </p>
      <ul>
        <li>
          <strong>Access</strong> a summary of the personal data we hold about
          you and who it has been shared with.
        </li>
        <li>
          <strong>Correct or update</strong> inaccurate or incomplete data. You
          can edit most profile details yourself on the profile page.
        </li>
        <li>
          <strong>Erase</strong> your personal data when it is no longer needed,
          unless we must keep it by law or for public-health records.
        </li>
        <li>
          <strong>Withdraw consent</strong> where we rely on it, for example for
          contact access or a site owner&rsquo;s collection consent. Withdrawing
          does not affect processing that already took place.
        </li>
        <li>
          <strong>Nominate</strong> another person to exercise your rights if
          you die or become unable to.
        </li>
        <li>
          <strong>Raise a grievance</strong> with us, and then with the Data
          Protection Board of India if you are not satisfied.
        </li>
      </ul>
      <p>You can also:</p>
      <ul>
        <li>
          turn off location, camera or contacts permissions in your device
          settings;
        </li>
        <li>
          log out to clear your login token and local data from the device;
        </li>
        <li>
          clear browser storage to remove analytics identifiers on the web, or
          ask us to stop analytics and session recording for your account and
          delete what was recorded.
        </li>
      </ul>
      <p>
        To make a request, email{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>. We will reply
        within 5 days. Site owners may contact us directly, or through the field
        team that registered their site.
      </p>
      <h3>8.1 Grievance Officer</h3>
      <p>
        For any concern about how your personal data is handled, or if your
        request is not resolved, contact our Grievance Officer. We will
        acknowledge your complaint within 5 days and resolve it within 30 days
        of receiving it. If you are not satisfied with the outcome, you may
        complain to the Data Protection Board of India.
      </p>
      <address className="grid gap-1.5 rounded-lg border border-[#e6e1f7] bg-landing-lav px-[18px] py-4 not-italic">
        <span>
          <strong>Name:</strong> {GRIEVANCE_OFFICER.name}
        </span>
        <span>
          <strong>Designation:</strong> {GRIEVANCE_OFFICER.designation}
        </span>
        <span>
          <strong>Email:</strong>{" "}
          <a href={`mailto:${GRIEVANCE_OFFICER.email}`}>
            {GRIEVANCE_OFFICER.email}
          </a>
        </span>
        <span>
          <strong>Address:</strong> ARTPARK, Ground Floor, Entrepreneurship
          Building / Innovation Centre Building (SID Building), Indian Institute
          of Science (IISc), Bengaluru, Karnataka – 560012, India
        </span>
      </address>
      <p>
        Each Dharini deployment is run by its own administrator, who handles
        privacy requests for that deployment. For the one present in ARTPARK you
        can reach out to us at the following:
      </p>
      <address className="grid gap-1.5 rounded-lg border border-[#e6e1f7] bg-landing-lav px-[18px] py-4 not-italic">
        <span>
          <strong>Administrator / organisation:</strong> ARTPARK
        </span>
        <span>
          <strong>Email:</strong>{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
        </span>
        <span>
          <strong>Address:</strong> Ground Floor, Entrepreneurship Building /
          Innovation Centre Building (SID Building), Indian Institute of Science
          (IISc), Bengaluru, Karnataka – 560012, India
        </span>
      </address>
    </section>
  );
}
