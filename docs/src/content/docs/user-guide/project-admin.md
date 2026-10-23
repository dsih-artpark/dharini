---
title: Project Admin Guide
description: Complete workflow guide for workspace and project administrators using the Dharini web portal
---

Admins use the Dharini web portal to set up projects, manage people, schedule and monitor visits, track results, and export data. This guide covers the admin workflows.

Which buttons you see depends on your role:

- **Workspace Admins** can do everything inside their workspace, including creating projects and inviting people to the workspace.
- **Team Admins** manage their team's members, sites, visits and samples.
- **Project Admins** see a project's dashboards, sites, visits and samples. Some buttons that change data (such as **Create Site**) only appear if your role allows them.

If a button in this guide is missing for you, your role does not include it. Ask a workspace admin.

## Getting Started

### Logging In

1. Go to the web portal: [https://in.dharini.artpark.ai/](https://in.dharini.artpark.ai/)
2. Choose **Email** or **Phone** and enter the address or number registered for you.
3. Select **Send OTP**, enter the 6-digit code, and select **Verify & Login**.
4. If you belong to more than one workspace, choose one from the **Select a workspace** list. If you belong to only one, you go straight to **Home**.

There are no passwords in Dharini. A code is valid for 3 minutes. If it does not arrive, wait for the countdown and select **Resend OTP**.

### Creating a New Workspace (First-Time Set-Up)

If your organization is new to Dharini, one person can create the workspace:

1. On the login page, select **Signup**.
2. Enter your **First name** and **Last name**, your **Organisation name** and a **Workspace name**.
3. Choose **Email** or **Phone**, enter it, and select **Send OTP**.
4. Enter the code to finish. You become the Workspace Admin of the new workspace.

### Accepting an Invitation

When someone invites you, you receive a link.

- **Workspace invitation:** The link opens a **Welcome to your new workspace** screen. Enter your **First name** and **Last name** and select **Continue**.
- **Project invitation:** The link accepts the invite and opens a project set-up checklist. See [Setting Up a Project After an Invitation](#setting-up-a-project-after-an-invitation).

If the link says **Invalid Token**, it has expired or was already used. Ask the person who invited you to send a new one.

### Finding Your Way Around

The left-hand menu has two groups, **Monitor** and **Manage**, with these items:

| Menu item | What it is |
| --- | --- |
| **Home** | A summary of your projects, diseases and sites |
| **Dashboard** | The Disease Surveillance Dashboard with filters and trends |
| **Geolens** | A map of sites, wetlands, farms and bird data |
| **Comparison** | Charts for comparing projects, sites and sample types |
| **Lab Processing** | The lab flow (only if your role includes it) |
| **SNP Analysis** | Sequencing uploads and results |
| **Projects** | Create and manage projects, sites, teams and visits |
| **Team & User Management** | Add users and change roles |
| **Settings** | Workspace or system settings (see below) |

At the top of the menu, the workspace name shows where you are working. Select it to switch workspace. Workspace Admins can also create a new workspace from this list by choosing **New Workspace** and entering a **Workspace name**.

Select your name or picture, then **View Profile** to see your details, your roles and your assigned projects, and to edit your name, phone number and photo. **Log Out** is in the same menu.

## Projects

### Viewing Projects

Select **Projects** in the menu. The **Projects** page lists the projects in your workspace, with totals at the top. You can filter the list by disease and location, and by period (**This Month** or **Last Month**). Select **Download Data** to export a CSV file of the projects.

Select a project to open its page. A project page shows:

- Project details, the project admin, and its locations
- **Samples** totals: **Total**, **Collected & Shipped**, **Pending Diagnosis**, **Tested Positive** and **Tested Negative**
- **Sites** – A short list with a **View All Sites** link
- **Team Allocation & Progress** – With a **View All Team Members** link
- **Download Data** to export the project's data as a CSV file

At the top of the project page, the buttons are **Edit Project Details**, **Manage Access**, **Upload Data** and **Create Site**. You only see the ones your role allows.

### Creating a Project

Workspace Admins create projects. Make sure the right workspace is selected first.

1. On the **Projects** page, select **Create a Project**.
2. Under **Create New Project**, fill in:
   - The project name. The project code is filled in for you.
   - **Applicable Diseases** – Select one or more
   - **Surveillance Type** – For example Clinical or Environmental
   - The states and the **Active Locations (Districts)**. You can use **Select All**.
3. Add a team for each group of people. Select **Add new team** and enter:
   - **Team Name**
   - **Team Lead Email**. If this person already has a Dharini account, their name is filled in. Otherwise enter the **Team Lead First Name** and **Team Lead Last Name**.
   - **Phone Number** and **Team address**
4. Select **Create Project**.

### Editing a Project

1. Open the project and select **Edit Project Details**.
2. Change the diseases, surveillance types or locations.
3. Save your changes. You see "Project details updated successfully!".

### Managing Sample Types and Species

Workspace Admins and Super Admins also see **Manage Sample Types** and **Manage Species** on the **Projects** page. Use these to add or change the sample types and animal species that collectors can choose from.

## Setting Up a Project After an Invitation

If you were invited as the admin of a new project, the invitation link opens a checklist titled "Follow the steps below to kickstart your project". Select a step to open it. Each step has **Save & Exit** (save and come back later) and **Proceed**.

1. **Add personal details** – Your name, organization, designation and contact number
2. **Add project details** – **Applicable Diseases**, **Surveillance Type** and **Active Locations**
3. **Add logistics details** – Choose which activities are done by partners: **Sample Collection**, **Testing & Diagnosis**, **Sequencing**, or none ("None, we handle everything within our organization")
4. **Add your team** – **Invite Partners**. For each partner organization (**Collection Organisation**, **Diagnostic Laboratory** or **Sequencing Laboratory**), enter the **Organisation Name** and **Admin Email ID**. For a long list, select **Import List** and upload an .xls or .csv file. Select **Invite & Proceed** to send the invitations.
5. **Add process details** – Choose which group adds sample details: **Collectors** or **Laboratory**
6. **Upload data** – Import existing records (see [Importing Existing Data](#importing-existing-data)). Select **Finish** when done.

## Teams and People

### Managing Team Access

1. Open the project and select **Manage Access**.
2. To add a team, select **Add Team** and fill in the team details, including the team lead.
3. For each team, the table lists members with their **Email**, **Name**, **Phone Number**, **Roles** and **Actions**. From there you can add a member, edit a member or delete a member. Confirm the **Delete A Team Member?** message to remove someone.
4. To change a team's details, use the edit option on the team and select **Update Team**.

**Available team roles:**

- **Team Admin** – Manages the team
- **Collector Admin** – A lead collector. Also sees the **Team** tab in the mobile app
- **Collector** – Field data collection
- **Lab Admin** – Manages lab people and processes samples
- **Lab Member** – Processes samples in the lab
- **Team Member** – General team member
- **Project Admin** – Views the project

### Adding Members from the Team Progress Page

1. From the project page, select **View All Team Members**.
2. Select **Add Members**.
3. Enter email addresses under **Team Members**, or upload a list with **Import List** (.xls or .csv).
4. Select **Proceed** to send the invitations.

### Adding and Changing Users Across Projects

Select **Team & User Management** in the menu.

- Use the search box to find a project and see its users.
- To add a person, select **Add User**. Choose the **Role** and the **Project**, and enter their email, phone number and name.
- To change a person's role, select **Edit Role**, pick the new role, and save.

### Inviting People to the Workspace (Workspace Admins)

1. Select **Settings**, then the **Members** tab.
2. Select **Invite Member**.
3. Enter **First name**, **Last name** and the email address, choose a role, and select **Send Invite**.
4. Use the edit icon on a member to change their role and **Save**. Use the remove icon to remove them from the workspace.

You can rename the workspace under **Settings**, then **Settings**, using **Rename**.

## Sites and Collection Plans

### Creating a Site

1. Open the project and select **Create Site**.
2. Enter the site details: the site name, the diseases monitored, the farm type and sub-type, the **Name of Owner / Caretaker**, **Phone Number**, and **No. of Workers**.
3. Enter the address (you can search for it) and state, district and pincode, and the latitude and longitude. Select **Edit Map Region** to adjust the location on the map.
4. Select **Proceed**.
5. Set the **Collection Plan**:
   - Under **Assigning Collectors**, choose the collectors for this site
   - Under **Collection Plan**, choose how often the site is visited: **Once**, **Daily**, **Weekly**, **Fortnightly**, **Monthly** or **Quarterly**, plus the days, time and duration
6. Select **Save**.

Collectors see the site and its scheduled visits in the mobile app under **Upcoming Visits**.

### Viewing and Editing Sites

1. Open the project and select **View All Sites**. The list shows each site's district, last scheduled visit, farm type, sub-type, collector, test result and status.
2. Select a site to open its page. It shows the site details, address, photos and comments, the **Collection Plan**, and the **Assigned Collectors**.
3. Use the edit icon to change the site details.
4. Select **Update Collection Plan** (on the site list or the site page) to change the collectors, frequency or duration.

### Scheduled Visits

On a site's page, the visit list shows each scheduled visit with a status badge:

- **Scheduled** – Coming up
- **Overdue** – The date has passed and the visit was not done
- **Rescheduled** – The date was moved. The card shows "Moved from" the old date.
- **Completed** – The visit is done

Use the **Upcoming** and **Past** buttons to switch lists. Select **Edit plan** to change the plan.

**Rescheduling a visit:**

1. Under **Upcoming**, select the **Reschedule visit** icon on the visit.
2. In the **Reschedule Visit** window, check the **Current Scheduled Date** and pick a new date. Dates in the past cannot be chosen.
3. Select **Confirm Reschedule**.

A completed visit cannot be rescheduled. Collectors can mark an overdue visit as skipped in the mobile app. A skipped visit is not counted as a completed visit.

### Past Visits

The **Past Visits** list shows each visit with the **No. of Samples**, **Suspected Positives** and **Status**. Filter by disease and site type, choose **This Month** or **Last Month**, and select **Download Data** to export a CSV file.

## Monitoring Results

### Home

**Home** shows your projects with **Visited Sites**, **Positive Sites** and **Samples Tested**, a section for each disease, and a list of site details. Select **Open Dashboard** or **View Dashboard** to go deeper.

### Dashboard

The **Disease Surveillance Dashboard** gives weekly collection and result monitoring.

1. Use the filters at the top to narrow down by project, state, district, disease, subtype, site, sample type or result. Select **Reset** to clear them.
2. Read the headline numbers: **Total Samples Collected**, **Samples Processed**, **Positivity Rate** and **Inconclusive Results**.
3. Switch the trend chart between **Aggregated**, **Site-wise** and **Sample-wise**.
4. Use the map to see **Sites with Confirmed Positives** and **Sites with No Positive Detection**.

### GeoLens

**Geolens** is a map for exploring sites and their surroundings.

1. Search for a place in **Search location...**.
2. Turn map layers on or off in the side panel, such as **Wetlands**, **Poultry Farms** and **Heatmap (Bird Density)**.
3. Select a location to see **Location Details**: current weather, bird counts and species, and nearby wetlands.
4. To compare two sites, select a location and choose **Set as Site A** or **Set as Site B**. The **Site Comparison** panel shows both side by side.

### Comparison

**Comparison** has three tabs:

- **Project Comparison** – Compare sample positivity across projects
- **Sitewise Comparison** – Compare two sites within a project
- **Sample Comparison** – Compare two sample types

Pick the items to compare in the filters, then read the charts and tables.

## Sequencing (SNP Analysis)

The **SNP Analysis** menu item opens the **Sequencing** page, where you upload sequence files and see the results.

1. Select **Upload sequence files**. The **New sequencing submission** window opens.
2. Choose the **Project**.
3. Choose the **Sample source**:
   - **Lab sample** – Pick a sample already in the lab system
   - **NCBI accession** – Enter a **GenBank accession** and Dharini fetches its details
   - **New sample** – Enter a sample that is not in the lab system yet
4. Select **Continue**, then choose a processing pipeline and select **Continue**.
5. Upload the reads file (and any other files the pipeline asks for), fill in any settings, and start the run. "Run started" confirms it.

The **Sequencing records** table lists your submissions and their status: **Completed**, **In progress**, **Queued**, **Failed** or **Cancelled**. Filter by status, select **Download CSV** to export, and select a record to see its pipeline stages, errors and, once finished, the **Analysis Results & Visualization**. If a run fails or is cancelled, re-submit the file.

## Importing Existing Data

You can bring in existing collection and lab records from Excel.

1. Open the project and select **Upload Data**. (This is also step 6 of the project set-up checklist.)
2. Choose the **Collection Data** tab or the **Lab Data** tab.
3. Choose the **Disease** group: **FMD / LSD** or **Avian Influenza (AI)**.
4. Select **Download template (.xlsx)** and fill in the template.
5. Select **Upload File** and choose your file, then select **Upload**. Only .xlsx files made from the template are accepted.

If the file has problems, Dharini lists each issue by row and column, and says "nothing was imported". Fix the file and upload it again. When the upload works, you see how many rows were imported.

:::note
**Lab Data** can only be imported for samples that already have collection data, either uploaded earlier or in the same session. Import **Collection Data** first.
:::

## Exporting Data

You can download CSV files from several places. Look for the **Download Data** button on:

- The **Projects** page and each project page
- **All Sites**
- A site's **Past Visits**
- The team progress page
- The sequencing page (**Download CSV**)

### Data Playground (Workspace Admins and Super Admins)

The **Data Playground** gives you the full project export and a ready-made command for pulling the same data from another tool.

1. Select **Settings**, then **Data Playground**.
2. Tick one or more projects. Use **Select all**, **Clear**, or the filter box.
3. Choose the **Response Type**: **json** or **csv**.
4. Select **Run** to preview the records in a table, or **Run & Download CSV** to download a file.
5. Copy the command shown below if you want to run the same request from another program.

## Settings

**Settings** is different for different roles.

- **Workspace Admins** see **Workspace Settings** with tabs for **Settings** (rename the workspace), **Members**, **Data Purging (Danger Zone)**, **Data Playground** and **Delete User (Danger Zone)**. They can also use **Create New Project** from here.
- **Super Admins** see the tabs **Access Management**, **Data Purging (Danger Zone)**, **Data Playground** and **Delete User (Danger Zone)**. Under **Access Management** (**Manage Super Admins**), they can add or remove other super admins using **Add Super Admin**.

### Data Purging (Danger Zone)

:::danger
Purging permanently deletes data and cannot be undone.
:::

Data Purging deletes a project, site, visit or sample, together with everything linked to it.

1. Open **Settings**, then **Data Purging (Danger Zone)**.
2. Choose the **Project**. To purge only part of it, also choose a **Site**, **Visit** or **Sample**.
3. Check the details shown on the right to be sure it is the right item.
4. Type the name shown to confirm, and select **Purge Data & Cascades**.

### Deleting a User (Danger Zone)

**Delete User (Danger Zone)** removes a person's account. They can no longer log in. Find the user with **Search name or email**, select **Delete Account**, and confirm.

## Best Practices

### Project Setup

- Define the diseases, locations and teams before you create sites
- Set visit frequencies that your collectors can realistically meet
- Import old data only after the project and its sites are set up

### Team Management

- Review team members regularly and remove people who have left
- Check the **Overdue** visits on each site and reschedule where needed
- Give each person the lowest role that lets them do their job

### Data Quality

- Check **Rejected** samples in the lab and talk to the collection team about why
- Use the Dashboard filters to look for unusual results
- Use **Purge** only when you are sure. Download your data first.

## Troubleshooting

For common issues and their solutions, see the [Troubleshooting Guide](/user-guide/troubleshooting).

## Next Steps

- [Learn about Field Collector workflows](/user-guide/field-collector)
- [Learn about Lab Technician workflows](/user-guide/lab-technician)
- [View Troubleshooting Guide](/user-guide/troubleshooting)
- [Return to User Guide Overview](/user-guide/)
