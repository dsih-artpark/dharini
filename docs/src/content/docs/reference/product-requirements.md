---
title: Product Requirements & Specifications
description: Product requirements, user roles, workflows, and functional specifications for the Dharini One Health surveillance platform
---

This document describes what Dharini does, who it is for, and the product requirements it is built to meet. It focuses on product and business requirements. For deployment, infrastructure, and technical specifications, see [Software Requirements & Specifications](/reference/requirements/) and [Platform Architecture](/reference/architecture/).

## 1. Problem Statement

Surveillance of zoonotic and transboundary animal diseases, such as Avian Influenza, Foot & Mouth Disease, and Lumpy Skin Disease, depends on a long chain of handoffs. Field teams collect environmental and clinical samples at farms, markets, water bodies, and other sites. The samples travel to laboratories for processing and testing, and program managers need the results quickly to detect and respond to outbreaks.

In many programs this chain is still run on paper forms, spreadsheets, and messaging apps. This leads to:

- **Lost traceability:** samples cannot be reliably linked back to the site, visit, collector, and time of collection.
- **Transcription errors and missing metadata:** GPS coordinates, sample types, and host details are recorded inconsistently or not at all.
- **Slow feedback loops:** program managers learn about positive results days or weeks after collection, with no consolidated view across sites or regions.
- **Poor field coverage:** collection schedules are hard to plan, track, and enforce, and missed visits go unnoticed.
- **Connectivity gaps:** field sites are often in low- or no-network areas, where online-only tools fail.

Dharini replaces this fragmented process with a single connected platform. It covers the full sample lifecycle, from scheduled field visits and offline collection through laboratory processing, testing, reporting, and genomic analysis, to real-time surveillance dashboards and geospatial risk context.

## 2. Product Goals

| # | Goal |
|---|------|
| G1 | Provide end-to-end traceability of every sample from collection to test report. |
| G2 | Enable reliable data collection in the field, including in areas without network connectivity. |
| G3 | Standardize sample and host metadata using recognized surveillance data standards. |
| G4 | Give program managers real-time visibility into field coverage, laboratory throughput, and positive findings. |
| G5 | Support multiple independent organizations on one deployment, with strict data separation between them. |
| G6 | Protect sensitive operational, location, and personal data through role-based access and privacy controls. |

## 3. Target Users and Stakeholders

### 3.1 Primary users

| User | Description | Primary interface |
|------|-------------|-------------------|
| **Field collectors** | Staff who visit sites, collect samples, and record site, host, and sample metadata. They often work in rural areas with limited connectivity. | Mobile app (Android) |
| **Field team leads** | Supervisors who manage collector teams, create sites, set collection plans, and track team progress. | Mobile app, web |
| **Laboratory staff** | Technicians and lab managers who receive, process, and test samples, and issue reports. | Web |
| **Project and program managers** | People who plan surveillance projects, onboard partner organizations, manage teams, and monitor results. | Web |
| **Workspace administrators** | People who administer an organization's workspace, its projects, and its members. | Web |
| **Platform administrators** | Operators of a Dharini deployment who manage the platform across all workspaces. | Web |

### 3.2 Stakeholders

- **Government animal husbandry and public health agencies** running disease surveillance programs
- **Research institutions** conducting One Health and environmental surveillance studies
- **Sample collection organizations** contracted to run field operations
- **Diagnostic and reference laboratories**, including NABL-accredited laboratories
- **Sequencing and genomics laboratories** analyzing positive samples
- **Funders and program sponsors** needing evidence of coverage and outcomes

## 4. Scope

### 4.1 In scope

- Environmental and clinical (animal) sample surveillance
- Multi-organization workspaces with projects, teams, partner organizations, and sites
- Scheduled and ad-hoc field visits with offline mobile data collection
- Laboratory sample accession, processing, testing, and reporting
- Genomic sequencing submission and variant (SNP) analysis
- Surveillance dashboards, comparisons, and geospatial context layers
- Role-based access control and user administration

### 4.2 Out of scope (current release)

- Individual human patient records or clinical case management
- Laboratory inventory management (reagents, equipment, stock)
- In-app messaging and push notifications
- iOS mobile app and multilingual interfaces. See [Section 10](#10-current-limitations-and-roadmap).

## 5. Core Concepts

| Concept | Description |
|---------|-------------|
| **Workspace** | An organization's tenant. All projects, members, and data within a workspace are isolated from other workspaces. |
| **Project** | A surveillance program within a workspace, defined by its target diseases, surveillance types, and active locations (state and districts). |
| **Team** | A group of users (collectors or lab staff) who work on one or more projects. |
| **Site** | A physical location where samples are collected, such as a farm or market. It has GPS coordinates, a farm type, a site type (government, private, or corporate), owner details, and collection consent. |
| **Collection plan** | A recurring schedule for a site: collector, start date, frequency (once, daily, weekly, fortnightly, monthly, or quarterly), duration, and preferred days. |
| **Visit** | A single trip to a site by a collector. Visits are `upcoming`, `overdue`, `skipped`, or `completed`, and can be rescheduled. |
| **Sample** | A specimen collected during a visit, identified by a barcode and linked to a site, visit, team, sample type, and optionally a species and animal host. |
| **Surveillance type** | **Environmental** (e.g. wastewater, soil, feed, dung) or **Clinical** (e.g. nasal swab, blood, cloacal swab). |
| **Lab test** | A test for a specific disease on a sample or sample pool, with a result of `pending`, `positive`, `negative`, or `unclear`. |
| **Sequencing submission** | A request to run a sample's sequence data through a genomic analysis pipeline. |

Field-level definitions and the ontologies behind them are documented in [Data Standards & Ontology Reference](/reference/data-standards/).

## 6. User Roles and Permissions

Dharini uses role-based access control. Each role has a **scope** that decides how far its permissions reach. A user can hold several roles, and the broadest applicable scope takes precedence.

| Scope | Reach |
|-------|-------|
| System | The entire deployment |
| Workspace | All projects and members in one workspace |
| Project | One project |
| Team | One team, within the projects it works on |

### 6.1 Roles

| Role | Scope | Summary of permissions |
|------|-------|------------------------|
| **Super admin** (`super-admin`) | System | Full access to all workspaces and data. Manages platform-wide reference data, other super admins, and permanent data deletion. |
| **Workspace admin** (`workspace-admin`) | Workspace | Manages the workspace, its members, projects, teams, sites, collection plans, visits, samples, lab tests, sample types, and species. Assigns workspace roles. |
| **Project admin** (`project-viewer`) | Project | Named as a project's admin (the **Admin** box when a project or team is created) and shown in the app as Project Admin. Read-only access to the project's teams, sites, collection plans, visits, samples, and test results; can submit sequencing data. |
| **Team admin** (`team-admin`) | Team | Manages the team and its members. Creates and updates sites, collection plans, visits, samples, and lab tests. |
| **Collector admin** (`collector-admin`) | Team | Leads a field team. Manages team members and creates and updates sites, collection plans, visits, and samples. Read-only access to lab results. |
| **Collector** (`collector`) | Team | Creates and updates sites, collection plans, visits, and samples. Read-only access to lab results. |
| **Lab admin** (`lab-admin`) | Team | Leads a laboratory team. Manages team members, processes samples, and records test results. |
| **Lab member** (`lab-member`) | Team | Processes samples and records test results. |

### 6.2 How user-guide personas map to roles

| Persona in the [User Guide](/user-guide/) | System roles |
|-------------------------------------------|--------------|
| Field Collector | `collector`, `collector-admin` |
| Lab Technician | `lab-member`, `lab-admin` |
| Team Admin | `workspace-admin`, `team-admin`, `project-viewer` (the Project Admin, read-only) |

### 6.3 Access rules

- **AR-1:** Users can only see and act on data in the workspaces, projects, and teams they hold roles in.
- **AR-2:** Every request that touches project data is checked on the server against the user's roles for that specific project.
- **AR-3:** Users can only change roles or accounts of users below them in scope, and only within the workspace, project, or team they administer.
- **AR-4:** The platform prevents removing the last active super admin or the last active admin of a workspace.
- **AR-5:** The web and mobile apps show only the navigation and actions a user has permission to use. For example, recording lab results requires permission to update lab tests.

## 7. Key Workflows

### 7.1 Organization and project onboarding

1. A new organization signs up with a name, organization, workspace name, and an email address or phone number verified by one-time password (OTP). This creates a **workspace** with the signer as workspace admin.
2. Users who belong to several workspaces choose one after signing in, and can switch at any time.
3. The workspace admin creates a **project** with a name, applicable diseases, surveillance type, state, and active districts, and can create a first team with its lead.
4. Invited project leads complete a guided **project onboarding**:
   1. Personal details
   2. Project details: diseases, surveillance type, active locations
   3. Logistics: which activities are outsourced (sample collection, testing and diagnosis, sequencing)
   4. Team: invite partner organizations as collection organizations, diagnostic labs, or sequencing labs
   5. Process: whether metadata is added by collectors or by the laboratory
5. Admins invite members into roles by email from the web, or from the mobile app by choosing a phone contact. Invitations expire and are accepted through a secure link.

### 7.2 Site setup and collection planning

1. A team lead or collector creates a **site** from the web or mobile app. They record the site name, applicable diseases, farm type and sub-type, site type, owner or caretaker, contact number, and number of workers.
2. The location is set by address search, the device's current GPS position, or dragging a pin on a map, and is linked to the state, district, and pincode.
3. A **collection plan** sets the collector, start date, frequency, duration, and preferred days. Collectors are assigned to the site.
4. Site records can hold collection consent, photos, and comments.

### 7.3 Visit scheduling

1. Dharini automatically generates `upcoming` visits for sites whose collection plan is due, and assigns them to the planned collector and team.
2. Visits past their scheduled date that were not completed are shown as `overdue`.
3. Upcoming visits can be **rescheduled** to a future date, and past-due visits can be marked **skipped**. The original date is kept for tracking.
4. Collectors can also start **ad-hoc visits** at a nearby site, found by GPS distance, or at a new site.

### 7.4 Field sample collection (mobile)

1. The collector opens an upcoming visit or starts a new one. An unfinished visit can be resumed from a saved draft.
2. **Visit details:** the collector selects the diseases under surveillance and answers disease-specific questions, such as flock or herd size, vaccination, mortality, and production drops. They also record suspected positives and active infections, with photos and comments.
3. **Collection type:** clinical, environmental, or both.
4. **Clinical collection:** the collector selects an animal already registered at the site or registers a new one (tag or bird ID, breed, age, sex, vaccination, fever observed), then chooses sample types and counts.
5. **Environmental collection:** the collector answers an environmental questionnaire (water source and storage, stagnant water, floor and soil conditions, and similar) and chooses sample types and counts.
6. **Sample identification:** each sample is identified by scanning its barcode or QR code with the camera, entering it manually, or bulk-generating barcodes from a prefix. Quantity, unit, replicates, photos, and comments can be recorded per sample. Duplicate barcodes are rejected.
7. **Review and submit:** the collector reviews the whole visit and submits it.
8. All of this works **offline**. Records are saved on the device and synchronized automatically when connectivity returns.

See the [Field Collector Guide](/user-guide/field-collector/) for step-by-step instructions.

### 7.5 Laboratory processing (web)

Lab staff work from a sample list filtered by status, disease, sample type, site, date, region, batch, accession ID, and test result. They can process one sample at a time or select several and **process them in bulk**. Each stage records who performed it and when.

| Stage | What is recorded | Sample status |
|-------|------------------|---------------|
| Receiving | Receipt date and time, storage temperature and details, batch reference ID and document. Each sample is **accepted**, with an accession ID and received volume, or **rejected** with a reason. | `received` or `rejected` |
| Pre-processing | Homogenisation, filtration, aliquoting, and pooling steps, each with method, input and output volumes, and remarks. Then choose the next pathway. | `pre-processed` |
| Virus isolation | For Avian Influenza samples: inoculation and harvest dates, HA test, HA and HI titres, H and N subtypes, NDV, volume, and storage. Optional. | `virus-isolation` |
| Extraction | Nucleic acid type, extraction kit, date, concentration, elution volume, purity ratios, volumes used and remaining, and storage | `extracted` |
| Testing | Per disease: kit or protocol, screening target, result, Ct value, viral load, variant or subtype, result date, and an optional result file | `test-report-generated` |

Samples can be **pooled** during pre-processing. A pool contains one sample type, and its final status is applied to every sample in it. Samples can be **retested**, with previous test results kept for reference.

See the [Lab Technician Guide](/user-guide/lab-technician/) for step-by-step instructions.

### 7.6 Genomic sequencing and SNP analysis

1. Lab staff create a **sequencing submission** from a lab sample, an NCBI GenBank accession, or a new sample, and upload the sequence files.
2. Large sequence files are uploaded directly to secure storage.
3. The submission runs through an external genomic analysis pipeline with selectable parameters. Its progress is tracked as `submitted`, `processing`, `completed`, `failed`, or `cancelled`, and failed jobs can be retried.
4. **SNP Analysis** shows run metrics (variants, SNPs, indels, impact distribution), a filterable variants table, a genome variant visualizer, and downloadable pipeline artifacts.

### 7.7 Surveillance monitoring

1. **Home** shows visited sites, positive sites, and samples tested, a per-disease breakdown of sample outcomes, and a site summary.
2. The **Dashboard** shows total samples, samples processed, positivity rate, positive sites, and inconclusive results. It includes temporal, site, and sample-type trends, disease-wise results, a geospatial distribution map, and site-, disease-, and sample-wise analysis tables. Users can filter by project, state, district, disease, variant, site, sample type, result, and date range.
3. **Comparison** compares projects, two sites, or two sample types by positivity and trends over time.
4. **GeoLens** overlays surveillance sites on environmental and risk context layers: wetlands, water boundaries, poultry farms, cattle markets, bird observation heatmaps, and current and historical weather. It includes a buffer and proximity tool and a side-by-side site comparison, which can be exported as a PDF report.
5. Team leads track **team progress and activity**, including visits pending, completed, and overdue, on the web and in the mobile app.

### 7.8 Administration

1. Admins manage team members and users, and reassign roles within their scope.
2. Workspace and super admins manage the **sample types** and **species** reference lists.
3. Admins can preview and export a project's data as JSON or CSV from the **Data Playground**.
4. Admins can delete a user account. This **anonymizes** the account, removing contact details and profile media, while keeping the scientific record intact.
5. Super admins can **permanently delete** a project, site, visit, or sample together with all dependent records, after a typed confirmation.

## 8. Functional Requirements

Requirement IDs are stable references for reviewers and contributors.

### 8.1 Authentication and accounts

| ID | Requirement |
|----|-------------|
| FR-AUTH-1 | Users sign in with a one-time password sent to their registered email address or mobile number. Dharini does not use passwords. |
| FR-AUTH-2 | New organizations can self-register, which creates a workspace and its first admin. |
| FR-AUTH-3 | Users can view and update their profile, including name, phone number, and photo. |
| FR-AUTH-4 | Users can be invited to a workspace or project role. Invitations expire and can only be accepted through their unique link. |
| FR-AUTH-5 | Users who belong to multiple workspaces can switch between them. Mobile users can switch between their projects. |
| FR-AUTH-6 | Authorized admins can delete a user account, which anonymizes the user's personal data. |

### 8.2 Workspace, project, and team management

| ID | Requirement |
|----|-------------|
| FR-PROJ-1 | Workspace admins can create and rename workspaces and manage workspace members. |
| FR-PROJ-2 | Admins can create projects with diseases, surveillance types, and active locations. |
| FR-PROJ-3 | Project leads can complete a guided onboarding that records logistics, partner organizations (collection, diagnostic, and sequencing), and who adds sample metadata. |
| FR-PROJ-4 | Admins can create teams, assign them to one or more projects, and manage team membership and roles. |
| FR-PROJ-5 | Team leads can view team member progress and activity and export them as CSV. |
| FR-PROJ-6 | Users can search across the projects, sites, and diseases they have access to. |

### 8.3 Sites and collection plans

| ID | Requirement |
|----|-------------|
| FR-SITE-1 | Users can create and edit sites with farm type, site type, owner details, address, and GPS coordinates. |
| FR-SITE-2 | Site location can be set by address search, the device's current position, or a map pin. |
| FR-SITE-3 | Users can define a collection plan for a site (collector, start date, frequency, duration, preferred days) and assign collectors. |
| FR-SITE-4 | Collectors can find nearby sites sorted by distance from their current location. |
| FR-SITE-5 | Users can view a site's details, consent, photos, comments, scheduled visits, and past visits, and export past visits as CSV. |

### 8.4 Visits

| ID | Requirement |
|----|-------------|
| FR-VISIT-1 | The system automatically creates upcoming visits from due collection plans, without creating duplicates for a site that already has an open visit. |
| FR-VISIT-2 | Visits past their scheduled date and not completed are flagged as overdue. |
| FR-VISIT-3 | Upcoming visits can be rescheduled to a future date. Completed and skipped visits cannot be rescheduled. |
| FR-VISIT-4 | Past-due upcoming visits can be marked as skipped. |
| FR-VISIT-5 | Collectors can start ad-hoc visits at existing or new sites. |
| FR-VISIT-6 | Collectors can record disease-specific visit observations, suspected positives, active infections, photos, and comments. |
| FR-VISIT-7 | An unfinished visit is saved as a draft and can be resumed. |

### 8.5 Sample collection

| ID | Requirement |
|----|-------------|
| FR-SAMP-1 | Collectors can record clinical samples, environmental samples, or both during a visit. |
| FR-SAMP-2 | Clinical samples are linked to a registered animal host with tag or bird ID, breed, age, sex, vaccination status, and fever observation. |
| FR-SAMP-3 | Environmental collection captures a structured questionnaire about site conditions. |
| FR-SAMP-4 | Sample types are filtered by surveillance type and disease, using standardized reference lists. |
| FR-SAMP-5 | Each sample is identified by a barcode or QR code, scanned with the camera in common 1D and 2D formats, entered manually, or bulk-generated from a prefix. |
| FR-SAMP-6 | A barcode cannot be used for more than one sample within the same project. Duplicates are rejected. |
| FR-SAMP-7 | Collectors can record quantity, unit, replicates, photos, and comments for each sample. |
| FR-SAMP-8 | Collectors review the full visit before submitting it. |
| FR-SAMP-9 | Admins can bulk-upload historical sample data. |

### 8.6 Offline operation

| ID | Requirement |
|----|-------------|
| FR-OFF-1 | Sites, visits, and samples can be created on the mobile app without network connectivity. |
| FR-OFF-2 | Offline records are stored on the device and synchronized automatically when connectivity returns and at regular intervals. Users can also start a sync manually. |
| FR-OFF-3 | The app shows when the user is offline and how many records are waiting to be synchronized. |
| FR-OFF-4 | Unsynchronized records are kept until they are successfully uploaded, including across logout. |
| FR-OFF-5 | Records rejected by the server stay queued with the reason shown to the user. |

### 8.7 Laboratory processing

| ID | Requirement |
|----|-------------|
| FR-LAB-1 | Lab staff can see samples for their projects, filter them by status and sample attributes, and choose which columns to display. |
| FR-LAB-2 | Lab staff can process samples one at a time or in bulk. |
| FR-LAB-3 | At receiving, lab staff can accept a sample, recording accession ID, volume, storage conditions, and batch reference, or reject it with a reason. |
| FR-LAB-4 | Lab staff can record pre-processing steps, including pooling samples of the same type. |
| FR-LAB-5 | Lab staff can record virus isolation details for Avian Influenza samples. |
| FR-LAB-6 | Lab staff can record extraction details, including kit, concentration, purity, and remaining volume. |
| FR-LAB-7 | Lab staff can record one test result per disease for each sample or pool, including result, Ct value, viral load, and variant or subtype. |
| FR-LAB-8 | Lab staff can retest a sample while keeping previous results. |
| FR-LAB-9 | Lab staff can attach a test report file to a result. |
| FR-LAB-10 | Each lab stage records who performed it and when. |
| FR-LAB-11 | Lab staff can view pipeline counts by status and export the sample list as CSV. |

### 8.8 Sequencing

| ID | Requirement |
|----|-------------|
| FR-SEQ-1 | Lab staff can create sequencing submissions from lab samples, NCBI GenBank accessions, or new samples. |
| FR-SEQ-2 | Large sequence files are uploaded directly to storage without passing through the application server. |
| FR-SEQ-3 | Users can select a pipeline and its parameters, track progress, and retry failed jobs. |
| FR-SEQ-4 | Users can view run metrics and called variants, visualize variants across the genome, and download pipeline artifacts. |
| FR-SEQ-5 | Users can export sequencing records and variants as CSV. |
| FR-SEQ-6 | Each submission has a unique, human-readable ID (`SEQ-YYYY-NNN`). |

### 8.9 Monitoring, analytics, and export

| ID | Requirement |
|----|-------------|
| FR-MON-1 | Users see headline surveillance metrics and per-disease outcomes on their home page. |
| FR-MON-2 | Users can filter surveillance dashboards by project, region, disease, variant, site, sample type, result, and date range. |
| FR-MON-3 | Users can view surveillance trends over time, by site, and by sample type, and see sites on a map. |
| FR-MON-4 | Users can compare projects, sites, and sample types. |
| FR-MON-5 | Users can view sites on a map with environmental and risk context layers, analyze proximity, and export a site comparison report as PDF. |
| FR-MON-6 | Users can export projects, project details, sites, past visits, lab samples, analysis tables, and team activity and progress as CSV. |

### 8.10 Traceability and data governance

| ID | Requirement |
|----|-------------|
| FR-GOV-1 | Every sample status change and stage edit is recorded in an audit trail, with previous and new values. |
| FR-GOV-2 | Every sample is linked to its project, site, visit, team, and collector. |
| FR-GOV-3 | Each received sample is given a unique accession ID that encodes species, sample type, and month. |
| FR-GOV-4 | Deleting a user account anonymizes their personal data while keeping sample and test records intact. |
| FR-GOV-5 | Super admins can permanently delete a project, site, visit, or sample together with all dependent records. |
| FR-GOV-6 | Reference data (diseases, surveillance types, sample types, species, regions) is centrally managed and follows the [Data Standards](/reference/data-standards/). |

## 9. Non-Functional Requirements

Measurable technical targets (response times, scalability, and infrastructure) are defined in [Software Requirements & Specifications](/reference/requirements/). This section describes product-level expectations.

### 9.1 Security

- **NFR-SEC-1:** All access requires authentication, except explicitly public pages and endpoints such as login, signup, invitation acceptance, and health checks.
- **NFR-SEC-2:** One-time passwords expire after 3 minutes. Repeated wrong attempts are temporarily blocked, and login requests are rate-limited.
- **NFR-SEC-3:** Access to every record is enforced on the server by role and scope, not only hidden in the user interface.
- **NFR-SEC-4:** Vulnerabilities are handled through a private, coordinated disclosure process. See the repository's `SECURITY.md`.

### 9.2 Privacy and data protection

- **NFR-PRIV-1:** Personal data collected about users is limited to what is needed to operate the platform: name, contact details, organization, and role.
- **NFR-PRIV-2:** Workspace data is isolated. Users in one workspace cannot see another workspace's data.
- **NFR-PRIV-3:** Precise site locations, owner contact details, test results, and surveillance data are treated as sensitive and are only visible to authorized roles.
- **NFR-PRIV-4:** Personal data, credentials, and one-time passwords must not be written to application logs or sent in error reports to third-party services such as Sentry.

### 9.3 Reliability and offline use

- **NFR-REL-1:** Field data must never be lost because of poor connectivity. It is kept on the device until it is successfully synchronized.
- **NFR-REL-2:** Synchronization preserves the order of dependent records, so a new site is uploaded before visits and samples that reference it.
- **NFR-REL-3:** Scheduled background jobs (visit generation, sequencing status reconciliation) recover automatically from missed runs or interrupted deliveries.

### 9.4 Usability

- **NFR-USE-1:** The mobile workflow guides collectors step by step and validates required information before submission.
- **NFR-USE-2:** Users only see the navigation and actions relevant to their role.
- **NFR-USE-3:** Non-production environments display a clear banner so test data is not mistaken for real surveillance data.

### 9.5 Interoperability and standards

- **NFR-INT-1:** Data fields follow recognized standards and ontologies (PHA4GE, WOAH, Government of India LGD codes, NDLM). See [Data Standards](/reference/data-standards/).
- **NFR-INT-2:** The platform exposes a documented REST API (OpenAPI) for integration.
- **NFR-INT-3:** Data can be exported in open formats: CSV and JSON for datasets, and PDF for the site comparison report.

### 9.6 Deployability

- **NFR-DEP-1:** The platform can be self-hosted by an implementing organization using containerized deployment. See the [Administrator Guide](/administrator-guide/).
- **NFR-DEP-2:** SMS, email, and storage providers are configurable, so deployments are not locked to a single vendor.

## 10. Current Limitations and Roadmap

| Area | Current state | Direction |
|------|---------------|-----------|
| Mobile platforms | Android only | iOS support planned |
| Languages | English only | Multilingual interface (including Hindi, Kannada, and Telugu) planned |
| Account deletion | Performed by an authorized admin | Self-service deletion request under consideration |
| Notifications | No in-app or push notifications | Under consideration |
| Accessibility | No formal WCAG conformance claim | Accessibility improvements planned |

## 11. Related Documentation

- [Introduction](/introduction/): platform overview
- [User Guide](/user-guide/): role-based instructions for collectors, lab technicians, and admins
- [Administrator Guide](/administrator-guide/): deployment and operations
- [Platform Architecture](/reference/architecture/): system components and data flow
- [Software Requirements & Specifications](/reference/requirements/): technical requirements and specifications
- [Data Standards & Ontology Reference](/reference/data-standards/): field definitions and ontologies
