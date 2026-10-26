---
title: Team Admin Guide
description: Complete workflow guide for workspace owners and team admins using the Dharini web portal
sidebar:
  order: 3
---

Admins use the Dharini web portal to set up projects, manage people, schedule and monitor visits, track results, and import and export data. This guide covers the admin workflows.

Which buttons you see depends on your role:

- **Workspace Admins** (the person who created the workspace) can do everything inside it, including creating projects and inviting people to the workspace.
- **Project Admins** (also called Project Viewers) follow one project's teams, sites, visits, samples and results with read-only access. They can submit sequences for SNP Analysis but cannot create or edit sites, visits or samples.
- **Team Admins** oversee a project and its teams: sites, visits, samples, results and team progress.
- **Collector Admins and Lab Admins** manage the members of their own teams.

Some buttons that change data (such as **Create Site**) only appear if your role allows them. If a button in this guide is missing for you, your role does not include it. Ask the workspace owner. See [Roles](/user-guide/getting-started#roles) for what each role does.

If you have not created an account or workspace yet, start with [Getting Started](/user-guide/getting-started). It also covers logging in, invitations and the left-hand menu.

## Projects

### Viewing Projects

Select **Projects** in the menu. The **Projects** page lists the projects in your workspace, with totals at the top. You can filter the list by disease and location, and by period (**This Month** or **Last Month**). Select **Download Data** to export a CSV file of the projects.

Select a project to open its page. A project page shows:

- Project details, the project's admin, and its locations
- **Samples** totals: **Total**, **Collected & Shipped**, **Pending Diagnosis**, **Tested Positive** and **Tested Negative**
- **Sites** – A short list with a **View All Sites** link
- **Team Allocation & Progress** – With a **View All Team Members** link
- **Download Data** to export the project's data as a CSV file

At the top of the project page, the buttons are **Edit Project Details**, **Manage Access**, **Upload Data** and **Create Site**. You only see the ones your role allows.

### Creating a Project

The person who created the workspace creates projects. Make sure the right workspace is selected first.

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
   - **Admin** – Tick this on at least one team. Its team lead becomes the project's **Project Admin**. The form will not save until one team is ticked ("Select any 1 team as primary").
4. Select **Create Project**.

### Editing a Project

1. Open the project and select **Edit Project Details**.
2. Change the diseases, surveillance types or locations.
3. Save your changes. You see "Project details updated successfully!".

### Managing Sample Types and Species

Workspace owners and Super Admins also see **Manage Sample Types** and **Manage Species** on the **Projects** page. Use these to add or change the sample types and animal species that collectors can choose from. They are defined once at the workspace level and used by every project, so set them up before you create projects.

- A **sample type** has a name, an emoji icon, an abbreviation, a surveillance type (for example Environmental or Clinical) and the diseases it applies to.
- A **species** has a name, an emoji icon, an abbreviation and the diseases it applies to.

The abbreviations are used to build sample IDs. For example, a sample type abbreviated `CL` on species `CH` produces IDs like `CH/CL/26-07/100001`. An abbreviation containing a slash, such as `NA/EN`, replaces the species part too.

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

A member's name and phone number are part of their own profile, so editing them for one project changes them everywhere that person appears.

**Available team roles:**

- **Project Admin** – Named as the project's admin. Read-only access to the project, plus SNP Analysis submissions. Set with the **Admin** box on a team, not chosen from this list
- **Team Admin** – Oversees the project and its teams
- **Collector Admin** – A lead collector. Also sees the **Team** tab in the mobile app
- **Collector** – Field data collection
- **Lab Admin** – Manages lab people and processes samples
- **Lab Member** – Processes samples in the lab

### Configure Access Groups

**Configure Access Groups** (on the **Manage Access** page) lets you define, per organisation, the primary roles and which of these accesses they have: **Collection**, **Metadata Entry**, **Testing**, **Sequencing** and **Monitoring**.

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

### Inviting People to the Workspace (Workspace Owners)

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
   - Under **Collection Plan**, set the **Collection Start Date** and choose how often the site is visited: **Once**, **Daily**, **Weekly**, **Fortnightly**, **Monthly** or **Quarterly**, plus the **preferred collection days** and the **duration** in months
6. Select **Save**.

Collectors see the site and its scheduled visits in the mobile app under **Upcoming Visits**.

### Viewing and Editing Sites

1. Open the project and select **View All Sites**. The list shows each site's district, last scheduled visit, farm type, sub-type, collector, test result and status.
2. Select a site to open its page. It shows the site details, address, photos and comments, the **Collection Plan**, and the **Assigned Collectors**.
3. Use the edit icon to change the site details or the map location, or to add photos and comments.
4. Select **Update Collection Plan** (on the site list or the site page) to change the collectors, frequency or duration.

The site page also shows statistics: total visits, samples collected, suspected positives (which need lab review) and the next scheduled visit.

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

Use the Monitor pages to follow progress and results. Each has its own guide:

- [Dashboards & Analysis](/user-guide/dashboard): **Home**, the **Disease Surveillance Dashboard** and **Comparison**
- [GeoLens](/user-guide/geolens): map layers, location details and site comparison
- [SNP Analysis](/user-guide/snp-analysis): upload sequence files and explore the results
- [Lab Technician Guide](/user-guide/lab-technician): how samples move through the lab

## Importing Existing Data

You can bring in existing collection and lab records from Excel.

1. Select **Upload Data Files** in the menu (or **Upload Data** on a project page) and pick the **Project** the data should go into. (This is also step 6 of the project set-up checklist.)
2. Choose the **Collection Data** tab or the **Lab Data** tab.
3. Choose the **Disease** group: **FMD / LSD** or **Avian Influenza (AI)**.
4. Select **Download template (.xlsx)** and fill in the template.
5. Select **Upload File** and choose your file, then select **Upload**. Only .xlsx files made from the template are accepted.

If the file has problems, Dharini lists each issue by row and column, and says "nothing was imported". Fix the file and upload it again. When the upload works, you see how many rows were imported.

:::note
**Lab Data** can only be imported for samples that already have collection data, either uploaded earlier or in the same session. Import **Collection Data** first. Each sample can have one imported result per disease. To record another result later, use **Retest** on the Lab Processing page.
:::

The import is **all or nothing**: if any row has an error, nothing is imported, and you see every error so you can fix the file in one pass.

## Exporting Data

You can download CSV files from several places. Look for the **Download Data** button on:

- The **Projects** page and each project page
- **All Sites**
- A site's **Past Visits**
- The team progress page
- The sequencing page (**Download CSV**)

### Data Playground (Workspace Owners and Super Admins)

The **Data Playground** gives you the full project export and a ready-made command for pulling the same data from another tool.

1. Select **Settings**, then **Data Playground**.
2. Tick one or more projects. Use **Select all**, **Clear**, or the filter box.
3. Choose the **Response Type**: **json** or **csv**.
4. Select **Run** to preview the records in a table, or **Run & Download CSV** to download a file.
5. Copy the command shown below if you want to run the same request from another program.

## Settings

**Settings** is different for different roles.

- **Workspace owners** see **Workspace Settings** with tabs for **Settings** (rename the workspace), **Members**, **Data Purging (Danger Zone)**, **Data Playground** and **Delete User (Danger Zone)**. They can also use **Create New Project** from here.
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
- Review **Suspected Positives** so the lab can prioritise them
- Use **Purge** only when you are sure. Download your data first.

## Troubleshooting

For common issues and their solutions, see the [Troubleshooting Guide](/user-guide/troubleshooting).

## Next Steps

- [Field Collector Guide](/user-guide/field-collector)
- [Lab Technician Guide](/user-guide/lab-technician)
- [Troubleshooting Guide](/user-guide/troubleshooting)
- [Return to User Guide Overview](/user-guide/)
