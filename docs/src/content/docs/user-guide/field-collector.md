---
title: Field Collector Guide
description: Complete workflow guide for Field Collectors using the Dharini mobile app
sidebar:
  order: 4
---

Field collectors use the Dharini mobile app to collect samples and record site information directly from the field. This guide covers the workflows and features available in the mobile app.

## Getting Started

### Installing the App

1. Use the official link to download and install the latest version: [https://in.dharini.artpark.ai/download/](https://in.dharini.artpark.ai/download/)
2. Install the application on your Android phone
3. Allow the permissions when the app asks for them:
   - **Location** – Used to find nearby sites and to record where a visit took place
   - **Camera** – Used to scan sample barcodes and to take photos
   - **Contacts** – Only needed if you are a Collector Admin adding team members from your phone contacts

### Logging In

You log in with a one-time password (OTP). You can receive the OTP by **Phone** (SMS) or by **Email**.

1. Open the Dharini app. You will see the login screen.
2. At the top, choose **Email** or **Phone**.
3. Enter your registered email address or phone number.
   - It must already have been added by your team admin. If it has not, the app will not send you a code.
4. Tap **Send OTP**.
5. Enter the verification code you received, then tap **Log in**.

:::tip
If the code does not arrive, tap **Resend OTP**. If you typed the wrong email or number, tap **Change email** or **Change number** to go back. An OTP is valid for 3 minutes.
:::

:::caution
If you enter a wrong code several times in a row, the app stops accepting codes for a while. Tap **Resend OTP** to get a new code.
:::

### First-Time Setup

The first time you log in, the app shows a short welcome screen with your role and project details. Tap **Get Started** to continue. If the app asks you to set up your profile, enter your name and tap **Proceed**.

### Choosing a Project

If you are assigned to more than one project, the app asks you to **Select a project**. Projects are grouped under your workspace. Tap a project to open it. A small badge such as "2 pending" next to a project means that project has visits waiting to be uploaded.

If you are not assigned to any project yet, the app tells you to contact your administrator.

To switch to another project later, go to the **Profile** tab and tap **Switch Project**.

## Finding Your Way Around

The bottom bar has these tabs:

- **Home** – Your upcoming and past visits at a glance
- **Visits** – All your visits, in a **Pending** tab and a **Completed** tab
- **Sites** – Sites you can visit and a button to create a new site
- **Team** – Only for Collector Admins. See team progress and add or remove team members.
- **Profile** – Your details, language, project switching and log out

### Home Screen

The Home screen shows a greeting, then:

- **Upcoming Visits** – Visits scheduled for you. Tap **View All** to open the full list.
- **Past Visits** – Visits you have already completed. Tap **View All** to open the full list.
- **Add Visit** button – Starts a visit at a site (shown if your role allows creating visits)

Pull down on the Home screen to refresh your sites and visits.

At the top of the screen you will also see:

- A network indicator
- A **sync icon with a number** when visits are waiting to be uploaded. Tap it to upload them right away.

### Working in Another Language

Go to **Profile**, then **Change Language**. You can choose English, Hindi, Kannada or Telugu.

## Working with Scheduled Visits

### Step 1: Find the Visit

1. Open **Home** or the **Visits** tab.
2. In the **Pending** tab, visits are shown in two groups:
   - **Overdue Visits** – Visits whose date has passed. Each card shows how many days overdue it is.
   - **Upcoming Visits** – Visits grouped by date. Use the filter at the top to show **All Sites** or one site, and **All dates**, **This week** or **This month**.
3. A visit card may show a **Rescheduled** badge if your admin moved the date, and a **Round** badge such as "Round 2" showing which round of sampling it belongs to.

### Step 2: Open the Visit

1. Tap the visit. The **Collection Details** screen opens with the site address, contact details and the diseases being monitored.
2. Tap **Start Visit**.

If you started this visit earlier and did not finish, the app asks **Resume Visit Draft?** Tap **Resume** to carry on where you stopped, or **Start Fresh** to begin again.

### Step 3: Skip an Overdue Visit

If you cannot do an overdue visit, tap **Mark as Skipped** on its card. The app confirms with "Visit successfully marked as skipped". Tap **Revisit** instead if you want to go and complete it now.

## Starting a Visit at Any Site

If you need to visit a site that is not on your schedule:

1. On the Home screen, tap **Add Visit**.
2. On the **Select Site** screen, choose a site:
   - **Nearby Sites** shows sites close to your current location (the app needs location permission).
   - Type in **Search sites by name...** to find a site by name.
   - Without network, you will see the sites saved on your phone.
3. Tap the site, then tap **Select Existing Site**.

If the site is not in the list, tap **Create New Site** and follow the steps in the next section.

If you are offline, the visit is created on your phone and syncs later. The app says "Visit created locally. Will sync when online."

To see visits that have not yet uploaded, tap **View Pending Visits** at the bottom of the **Select Site** screen.

## Creating a New Site

1. Tap **Create New Site** (from **Add Visit**), or open the **Sites** tab and tap **Create Site**.
2. Fill in the **Site Details**:
   - **Name of Site**
   - The disease or diseases being monitored at this site
   - The farm type and the site type
   - Whether the site is **Private**, **Government** or **Corporate**
   - **No. of Workers**
3. Fill in the **Site Address**: **Address**, **State**, **District** and **Pincode**.
4. Set the location. Tap **Use My Current Location**, or type the **Latitude** and **Longitude**.
5. Under **Contact Details**, enter the contact person's **Name** and **Phone Number** (10 digits).
6. Under **Assigning Collectors**, select the collector or collectors for this site.
7. Under **Collection Plan**, set how often the site should be visited. The options are **Once**, **Daily**, **Weekly**, **Fortnightly**, **Monthly** or **Quarterly**, plus the days, time and duration.
8. Optionally add photos and comments.
9. Tap **Create Site**.

If a required field is missing, the app shows a message under it. Fix the fields and tap **Create Site** again.

If the app cannot reach the server, it says "Could not create site online. Saving offline..." and uploads the site later.

You can later change a site from its **Site Details** page, either by editing the site itself or by updating its collection plan.

## Recording Visit Details

After you start a visit (scheduled or not), the **Add Visit Details** screen opens.

1. Under **Select Diseases**, choose the diseases for this visit from the diseases linked to your project. You must choose at least one.
2. For each disease, answer the questions shown. Depending on the disease, these may include:
   - **Active Infections Present?** and **Number of Active Infections**
   - **Suspected Positives?** and **Number of Suspected Positives**
   - Details about the animals or herd at the site
3. Under **Additional Info**, tap **Add Photos** to attach photos (the site, conditions, and so on).
4. Under **Comments**, add any extra information.
5. Tap **Proceed**.

Your work is saved as a draft as you go, so if the app closes you can resume it from the same visit.

## Collecting Samples

### Step 1: Read the Guidelines

The **Guidelines for Sample Collection** screen shows tips for safe and effective collection, such as using sterile swabs and wearing protective equipment. Read them, then tap **Proceed**.

### Step 2: Choose What You Are Collecting

On the **Sample Collection** screen, under **What are you collecting?**, choose one of:

- **Clinical samples** – Samples taken from animals or birds
- **Environmental samples** – Samples taken from the surroundings, such as water or soil
- **Both** – Then choose which one to **start with**

Tap **Proceed**.

### Step 3: Clinical Samples – Animal or Bird Details

For clinical samples, the **Animal/Bird Metadata** screen opens first.

1. To record a new animal or bird, fill in its details, for example species, tag ID, vaccination and whether fever was observed. These details are attached to all the samples from this animal.
2. To reuse an animal you have already recorded at this site, open **Choose Animal ID**, pick the animal, and tap **Use Selected Animal**.
3. Tap **Continue to Sample Selection**.

### Step 4: Choose Sample Types and Counts

The **Clinical Samples** or **Environmental Samples** screen lists the sample types available for your project.

1. Under **Select types and enter count per type**, set the number of samples for each type. Use the plus and minus buttons or type a number.
2. The **Total Samples Selected** line shows your running total.
3. Tap **Proceed**.

For environmental samples, the **Environmental Data** screen may follow. It has optional **Sample Details** questions for each sample type. Fill them in and tap **Continue to Barcode Entry**.

### Step 5: Add Barcodes

The **Clinical Sample Barcodes** or **Environmental Sample Barcodes** screen has one section for each sample type. Every sample needs its own unique barcode, taken from the label on the container.

You can add barcodes in three ways.

#### Option A: Scan with the camera (one at a time)

1. On the sample's row, tap **Scan**.
2. Point the camera at the barcode. The screen says **Point at the barcode**. Tap the flashlight icon to light up a dark label.
3. When the app reads the code, it checks it. If the code is fine, it is shown as verified. Tap **Use barcode** to accept it, or **Rescan** to try again.
4. If the app shows a problem, such as "is already assigned to another sample", **Use barcode** stays greyed out. Tap **Scan another** and scan a different barcode.

#### Option B: Continuous Scan (many at once)

1. In the sample type section, choose **Continuous Scan**.
2. Tap **Start Scanning**. The screen shows how many more barcodes you need.
3. Scan a barcode, then tap **Add & continue**. Repeat. The scanned barcodes appear in a row at the bottom, and the counter at the top shows your progress.
4. To remove a barcode you scanned by mistake, tap it in the row at the bottom.
5. When you are finished, tap **Done**. The button shows how many barcodes you scanned, for example **Done · 5**.

#### Option C: Bulk Generate (labels with running numbers)

Use this when your labels are numbered in a sequence.

1. In the sample type section, choose **Bulk Generate**.
2. Enter the first barcode in **Enter prefix e.g. BMM001**.
3. Tap **Generate**. Dharini fills in a barcode for each sample by counting up from your number (BMM001, BMM002, BMM003, and so on).

#### Typing a barcode by hand

- Inside the scanner, tap **Enter manually**, type the barcode in the box, and tap **Check barcode**.
- On the barcode screen, you can also type directly into the **Barcode** box of a sample.

:::caution
Every barcode must be unique. The scanner refuses a code that was already scanned in this visit ("was already scanned in this session") or is already used for another sample ("is already assigned to another sample"). While you are offline, the app can only check against samples on your phone, so the server checks the barcodes again when you sync.
:::

If the camera does not start, the scanner tells you to allow camera access in your phone's Settings, or to try again or type the barcode instead.

### Step 6: Quantity, Replicates, Photos and Comments

For each sample row, you can also:

- Enter the **Quantity** and **Unit**
- Add a replicate: tap **Add Replicate** and enter the replicate's ID. Use this when you take more than one tube from the same sample.
- Tap **Add Photos** (or **Add More Photos**) to attach photos of the sample
- Add optional comments in **Add comments (optional)**

Tap **Save & Continue** when every sample has a barcode.

### Step 7: Add More Samples or Continue

On the barcode screen, you can tap **Add More Samples** to add another sample type to the same visit.

After you save, the **Sample Added Successfully** screen shows the total number of samples collected so far. From here you can:

- **Add another animal (Clinical)** – Record another animal or bird
- **Continue to Environmental** or **Continue to Clinical** – If you chose **Both**, move on to the other kind of sample
- **Review Visit** – Finish collecting and go to the review screen

## Reviewing and Submitting a Visit

1. On the **Visit Details** review screen, check the site details, visit date, location, disease information, and every sample (barcode, type, replicates, photos and comments).
2. Tap **Submit Visit**. The app captures your current location and validates the visit.

If the app says you are not assigned to a team, you cannot submit. Ask your admin to add you to a team.

After you tap **Submit Visit**, the app shows one of these messages:
   - **Visit saved. Syncing in background...** – You are online and the visit is uploading.
   - **Visit saved locally. Will sync when online.** – You are offline. The visit is safe on your phone and will upload later.

### The Success Screen

After you submit, the **Visit saved successfully** screen opens. At the top you may see:

- **Syncing visit to server...** – Upload in progress
- **Visit synced successfully!** – The visit is on the server
- **Sync failed. Will retry when online.** – Nothing is lost. The app will try again.

Below, **Next Step** tells you to **Deliver Samples to Lab**, with the lab team's name and address. Tap **Back to Home** when you are done.

## Viewing Sites and Visits

### Sites Tab

The **Sites** tab lists **Assigned Sites** and **All Sites**. Tap a site to open **Site Details**:

- Site address and owner or caretaker contact
- **Collection Configuration**: frequency, day and time, and **Assigned Collectors**
- **Recent Visits**
- **Photos & Comments**

From here you can edit the site or update its collection plan.

### Visits Tab

The **Visits** tab has two tabs:

- **Pending** – **Overdue Visits**, **Upcoming Visits**, and **Offline Pending Visits** (visits saved on your phone that have not uploaded yet)
- **Completed** – Visits you have finished. Tap one to open its **Visit Details**, including surveillance details, samples, photos and your comments.

## Team Tab (Collector Admins Only)

If you are a Collector Admin, the **Team** tab shows **Team Progress** with:

- A period filter: **This week**, **This month** or **3 Months**
- **Team Activity** counts for **OVERDUE**, **PENDING** and **COMPLETED** visits
- A list of members with their visits. You can use **Filter** and **Sort by**.

To add members:

1. Tap **Add New Member**.
2. Tap **Invite via Contacts** and choose people from your phone contacts.
3. Choose a role for every selected person.
4. Tap **Add Members**. Dharini sends each person an invitation by SMS.

To remove members, tap **Remove Members**.

## Profile and Settings

Open the **Profile** tab to see your name, organisation, phone number and email. From here you can:

- Edit your profile
- **Change Language**
- **Switch Project**
- **Logout**

When you tap **Logout**, the app first tries for a few seconds to upload any pending visits. Anything it cannot upload stays safely on your phone and uploads the next time the app is online.

## Working Offline

The Dharini app is designed to work without a network.

### What Works Offline

- Viewing the sites and visits that were last downloaded to your phone
- Creating sites and visits
- Collecting samples, scanning barcodes and taking photos
- Submitting visits. They are saved on your phone.

When you are offline, a banner at the top says **You are working offline. Changes will sync when online.**

### How Syncing Works

- The app uploads pending visits automatically when the network comes back, and checks again every few minutes.
- A sync icon with a number appears at the top of the Home screen while visits are waiting. Tap it to upload them immediately.
- A yellow bar with **Syncing pending visits...** shows while an upload is running.
- If a visit depends on a site that has not uploaded yet, the app says "Some visits are pending server sync. Will retry automatically." This is normal. It uploads the site first, then the visit.

### Best Practices for Offline Work

- Open the app and let it sync before you head out, so your sites and visits are up to date
- Keep your device charged. GPS and camera use a lot of battery.
- Do not uninstall the app while visits are still waiting to upload
- At the end of each field day, connect to WiFi or mobile data and wait until the sync icon disappears

:::tip
The app can store several days' worth of visits offline. Even so, sync regularly so your data is backed up on the server.
:::

## Tips for Efficient Field Collection

### Before Leaving for the Field

- Check your upcoming and overdue visits for the day
- Make sure your phone is fully charged
- Sync any pending visits
- Check that location and camera permissions are on

### During Field Collection

- Take clear photos in good light
- Check barcodes before you save them
- Fill in all required fields
- Add comments about anything unusual

### After Returning from the Field

- Connect to WiFi or mobile data
- Wait for the pending-visit number on the sync icon to disappear
- Read any sync messages that appear, and tap the sync icon to try again if one failed

## Troubleshooting

For common issues and their solutions, see the [Troubleshooting Guide](/user-guide/troubleshooting).

## Next Steps

- [Learn about Team Admin workflows](/user-guide/team-admin)
- [Learn about Lab Technician workflows](/user-guide/lab-technician)
- [View Troubleshooting Guide](/user-guide/troubleshooting)
- [Return to User Guide Overview](/user-guide/)
