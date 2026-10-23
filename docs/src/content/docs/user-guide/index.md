---
title: Overview
description: Complete user guide for the Dharini platform
---

This guide helps new users quickly understand and start using the Dharini platform without external support. Please read the sections relevant to your role and follow the steps as you use the platform.

## Introduction

Dharini is a digital platform built to manage end-to-end disease surveillance and field sampling workflows. It replaces manual, paper-based processes with a guided digital system that ensures accuracy, traceability, and accountability.

Dharini has two parts:

- **The mobile app (Android)** – used in the field to register sites, complete scheduled visits, and collect samples. It works without internet.
- **The web portal** – used in the office and the laboratory to process samples, manage projects and teams, monitor results, and export data.

By using Dharini, organizations can:

- Collect field data in a structured and guided manner
- Track samples seamlessly from field to laboratory
- Reduce human errors and missing information
- Monitor operations and test results in near real time

## Platform Overview

Dharini connects field operations, laboratory workflows, and administrative oversight into one unified system.

### Key Benefits

#### Data Integrity

Every sample carries a barcode from the moment it is collected, so it can be traced from the field to the lab and on to its test result.

#### Operational Efficiency

Collectors, lab staff, and admins all work on the same records, so there is no re-entering of data and no paper hand-offs.

#### Real-Time Visibility

Admins can monitor visits, sample status, and test results on dashboards, maps, and comparison charts.

#### Offline-First Design

Field collectors can work in low or no network areas. Data syncs automatically once connectivity is restored.

## How Dharini Is Organized

Dharini is organized in layers. It helps to know where you sit:

- **Workspace** – your organization's space on Dharini. All projects, people and data live inside a workspace. If you belong to more than one workspace, you choose one after you log in on the web portal, and you can switch from the left-hand menu.
- **Project** – a surveillance programme for one or more diseases in selected locations (for example, a state or a set of districts).
- **Team** – a group of people inside a project (for example, a collection team or a lab team). Each team has a team lead.
- **Site** – a place where samples are collected (for example, a farm). Each site has a collection plan that says who visits, how often, and for how long.
- **Visit** – one scheduled or unscheduled trip to a site. A visit produces samples.
- **Sample** – a collected specimen with a unique barcode. Samples move through the lab and end with a test result.

## User Roles

Your role decides which screens and buttons you see. The role names below are the ones shown in Dharini.

| Role | Where you work | What you do |
| --- | --- | --- |
| **Workspace Admin** | Web portal | Creates projects, invites people, manages workspace settings, and can export or remove data |
| **Project Admin** | Web portal | Views a project's dashboards, sites, visits, samples, and team progress |
| **Team Admin** | Web portal | Manages a team's members, sites, visits, samples, and lab tests |
| **Collector Admin** | Mobile app | A lead collector who collects samples and also adds and removes team members and tracks team progress |
| **Collector** | Mobile app | Registers sites, completes visits, and collects samples |
| **Lab Admin** | Web portal | Manages lab team members and processes samples through the lab flow |
| **Lab Member** | Web portal | Processes samples through the lab flow (the day-to-day lab technician role) |

Some people hold a **Super Admin** role. Super admins manage the whole Dharini installation and can reach everything, including the system-wide **Settings** page.

:::note
A person can hold more than one role, and roles can be limited to a workspace, a project or a team. If you cannot see a menu item or button that this guide mentions, your role may not include it. Ask your admin.
:::

### [Workspace and Project Admin](/user-guide/project-admin)

Admins use the web portal to run projects and people. Depending on their role, they can:

- Create projects and set up teams
- Invite people to the workspace and to projects
- Create sites, assign collectors, and set collection plans
- Reschedule visits and keep an eye on overdue visits
- Import existing data from Excel templates
- Watch dashboards, GeoLens maps, comparison charts and sequencing results
- Download project data as CSV or through the Data Playground

[Learn more about admin workflows →](/user-guide/project-admin)

### [Field Collector](/user-guide/field-collector)

Field collectors use the Dharini mobile app to collect samples and record site information directly from the field. They can:

- See upcoming and overdue visits
- Create new sites and start visits at sites that are not on their schedule
- Record disease information, photos and comments for each visit
- Collect clinical and environmental samples and attach barcodes by scanning, bulk generation or typing
- Work offline and sync when connected
- Leave a half-finished visit and resume it later

[Learn more about Field Collector workflows →](/user-guide/field-collector)

### [Lab Technician](/user-guide/lab-technician)

Lab technicians (Lab Members and Lab Admins) use the web portal to process samples. They can:

- See samples by stage: Collected, Received, Virus Isolation, Pre-processed, Extracted, Rejected and Test Results
- Receive samples, accepting or rejecting each one
- Record pre-processing (including pooling), virus isolation, extraction and testing
- Process many samples together with **Process Selected**
- Retest samples

[Learn more about Lab Technician workflows →](/user-guide/lab-technician)

## Logging In

Dharini uses one-time passwords (OTPs), not passwords.

- **Mobile app:** choose **Email** or **Phone**, enter your registered email address or number, and enter the code that is sent to you.
- **Web portal:** choose **Email** or **Phone**, enter your registered email address or number, select **Send OTP**, then enter the 6-digit code and select **Verify & Login**.

An OTP is valid for 3 minutes. You can only log in with an email address or phone number that is already registered in Dharini. New people are normally added by an invitation from an admin. Someone setting up a brand-new organization can use **Signup** on the web login page.

## Key Logic & Guardrails

Dharini enforces rules to maintain data quality:

### Mandatory Fields

Visits and sites cannot be saved until the required fields are filled in. The app tells you what is missing.

### Duplicate Prevention

A barcode can only be used once. The mobile scanner rejects a barcode that was already scanned in the current visit or is already assigned to another sample.

### Sync Status Visibility

On the mobile app:

- A banner reading **You are working offline. Changes will sync when online.** appears when the phone has no network
- A sync icon with a number appears at the top of the Home screen when visits are waiting to be uploaded
- **Syncing pending visits...** appears while data is being uploaded
- After you submit a visit, the success screen tells you whether the visit was synced or saved to sync later

### Audit Trail

Lab steps record who performed them and when, so every sample has a traceable history.

## Support Best Practices

- Keep your app updated to the latest version
- Make sure location and camera permissions are enabled
- Open the app with a network connection at the end of each field day so that pending visits upload

## Troubleshooting

For common issues and their solutions, see the [Troubleshooting Guide](/user-guide/troubleshooting).

---

By following this guide, users can independently operate the Dharini platform efficiently and accurately.
