import React from "react";
import { Table } from "../policy-ui";

export default function HowWeCollect() {
  return (
    <section id="how-we-collect">
      <h2>3. How we collect information</h2>
      <p>
        Most information is typed in or captured by authorised users. The rest
        comes automatically from the apps and devices.
      </p>
      <ul>
        <li>
          <strong>From you</strong>: when you log in, complete your profile,
          accept an invitation, or enter a site, visit, sample and lab data.
        </li>
        <li>
          <strong>From other users</strong>: administrators who invite you, and
          field collectors who record site owner details and consent.
        </li>
        <li>
          <strong>From your device</strong>: location, camera and photos, only
          after you grant permission.
        </li>
        <li>
          <strong>Automatically</strong>: crash reports and network data.
        </li>
        <li>
          <strong>From public sources</strong>: weather, bird-sighting and map
          data for a site&rsquo;s location.
        </li>
      </ul>
      <h3>Device permissions (mobile app)</h3>
      <Table
        head={["Permission", "Why we ask", "When it is used"]}
        rows={[
          [
            "Precise and approximate location",
            "To record where a site is and where a visit was completed",
            "When you register a site or complete a visit",
          ],
          [
            "Camera",
            "To scan sample barcodes and QR codes, and take site, visit and sample photos",
            "When you open the scanner or take a photo",
          ],
          [
            "Photos and files",
            "To attach existing photos and export data files",
            "When you choose a file",
          ],
          ["Vibration", "To confirm a successful scan", "During scanning"],
        ]}
      />
      <p>
        You can turn off any permission in your device settings. Some features,
        such as site registration or barcode scanning, will not work without it.
      </p>
    </section>
  );
}
