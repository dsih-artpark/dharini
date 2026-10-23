---
title: Introduction
description: Introduction to the Dharini platform for environmental field sampling and One Health surveillance
---

Dharini is a comprehensive, mobile-first digital platform designed for end-to-end environmental field sampling workflows and One Health surveillance. It replaces traditional paper-based processes with a guided digital system that ensures accuracy, traceability, and accountability across the entire sample lifecycle—from field collection to laboratory analysis and reporting.

## What is Dharini?

Dharini is a full-stack application that connects field operations, laboratory workflows, and administrative oversight into one unified system. The platform is built to support public health surveillance, environmental monitoring, and disease tracking programs that require rigorous sample management and geospatial data collection.

### Key Capabilities

- **Field Data Collection**: Mobile-first interface for collectors to record samples, site information, and metadata in the field
- **Offline-First Architecture**: Works seamlessly in low or no network areas with automatic synchronization
- **Sample Tracking**: Complete traceability from collection through laboratory testing to final reporting
- **Laboratory Management**: Streamlined workflows for sample intake, quality control, testing, and reporting
- **Geospatial Integration**: Built-in GPS tracking and PostGIS integration for location-based analytics
- **Real-Time Monitoring**: Live dashboards for project administrators to oversee operations
- **Quality Assurance**: Enforced mandatory fields, duplicate prevention, and audit trails
- **GeoLens**: Map view that overlays surveillance sites on environmental and risk layers (water bodies, wetlands, poultry farms, livestock markets) with bird-observation and weather lookups
- **Genomic Sequencing**: Upload sequence files or import NCBI accessions, run them through an external analysis pipeline, and review variants and results
- **Workspaces and Self-Serve Signup**: Organizations sign up on their own, get a workspace, and invite members and partner organizations into roles
- **Bulk Data Import**: Load existing collection and lab records from XLSX templates
- **Data Playground**: Preview and export project data as JSON or CSV, with the matching API call shown

## Platform Architecture

Dharini is built as a modern monorepo containing:

- **Backend API** (NestJS): REST API with TypeORM, PostgreSQL, and Redis (job queue and cache)
- **Web Frontend** (Next.js): Responsive web dashboard for administrators and lab technicians
- **Mobile App** (Flutter): Cross-platform mobile application for field collectors
- **APK Distribution Server**: Manages mobile app versioning and distribution
- **Database** (PostgreSQL with PostGIS): Spatial database with geospatial extensions
- **Infrastructure**: Docker-based orchestration for development and production

## Who Should Use Dharini?

Dharini is designed around three main groups of users. Access is controlled by roles (for example collector, lab member, team admin, workspace admin and super admin) that apply at system, workspace, project or team scope. Partner sequencing labs have their own role.

### Field Collectors

Use the mobile application to:

- Collect samples at assigned or new sites
- Capture GPS coordinates and timestamps automatically
- Scan QR codes on sample containers
- Take photos of sites and samples
- Work offline and sync when connectivity is restored

[Learn more about Field Collector workflows →](/user-guide/field-collector)

### Lab Technicians

Use the web dashboard to:

- Receive and accession samples from the field
- Accept or reject samples based on quality standards
- Record extraction and testing information
- Upload test report files
- Track sample status through the laboratory pipeline

[Learn more about Lab Technician workflows →](/user-guide/lab-technician)

### Project Administrators

Use the management portal to:

- Create and manage projects
- Assign teams, sites, and collection schedules
- Monitor sample progress and KPIs in real time
- Manage users and roles
- Generate reports and analytics

[Learn more about Project Admin workflows →](/user-guide/project-admin)

## Key Benefits

### Data Integrity

Ensures **traceability of all samples** from collection to lab testing through:

- Mandatory metadata fields (GPS, timestamp, collector ID)
- Barcode/QR code-based sample identification
- Complete audit trails for all changes
- Automated validation and error prevention

### Operational Efficiency

Reduces sample processing time compared to manual methods by:

- Eliminating paper-based data entry and transcription errors
- Streamlining handoffs between field and laboratory
- Automating status updates and notifications
- Providing real-time visibility into sample pipelines

### Real-Time Visibility

Admins can monitor:

- Live field activity and active collectors
- Sample status across all stages
- Site coverage and visit compliance
- Quality metrics and exceptions
- Project progress and performance indicators

### Offline-First Design

Field collectors can work in low or no network areas:

- All data collection features work offline
- Data is securely stored locally on the device
- Automatic synchronization when network is available
- Clear sync status indicators

## Technology Stack

### Backend

- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL 16 with PostGIS 3.4
- **ORM**: TypeORM
- **Cache and job queue**: Redis (no session storage; authentication uses JWT)
- **Storage**: S3-compatible: AWS S3, or self-hosted Garage
- **Email**: any SMTP server (for example AWS SES)
- **SMS**: Twilio, for OTP login
- **Authentication**: JWT-based, with OTP login

### Frontend

- **Framework**: Next.js (React)
- **Styling**: Tailwind CSS
- **State Management**: Jotai
- **API Communication**: REST

### Mobile

- **Framework**: Flutter (Dart)
- **Platforms**: Android (iOS coming soon)
- **Offline Storage**: Local Hive database with sync
- **QR Scanning**: Integrated barcode/QR support

### Infrastructure

- **Containerization**: Docker and Docker Compose
- **Reverse Proxy**: Nginx
- **Deployment**: AWS EC2, RDS, S3, or a self-hosted setup with the bundled PostgreSQL and Garage (configurable)
- **SSL**: Certbot (Let's Encrypt)

## Use Cases

Dharini is designed for:

- **Public Health Surveillance**: Disease monitoring and outbreak detection
- **Environmental Sampling**: Water quality, soil testing, air monitoring
- **Vector Surveillance**: Mosquito and vector-borne disease tracking
- **One Health Programs**: Integrated human, animal, and environmental health monitoring
- **Field Research**: Academic and research projects requiring sample management
- **Quality Assurance**: Programs requiring rigorous traceability and compliance

## Getting Started

### For Users

If you're a field collector, lab technician, or project administrator:

1. Review the [User Guide](/user-guide/) for an overview of the platform
2. Read the guide specific to your role:
   - [Field Collector Guide](/user-guide/field-collector)
   - [Lab Technician Guide](/user-guide/lab-technician)
   - [Project Admin Guide](/user-guide/project-admin)
3. Check the [Troubleshooting Guide](/user-guide/troubleshooting) if you encounter issues

### For Administrators

If you're setting up or managing a Dharini deployment:

1. Review the [Software Requirements & Specifications](/reference/requirements)
2. Follow the [Production Setup Guide](/administrator-guide/production-setup)
3. Configure [Environment Variables](/administrator-guide/environment-variables)
4. Set up the [Database](/administrator-guide/database-setup)
5. Configure [Nginx](/administrator-guide/nginx-configuration)
6. Refer to [Troubleshooting](/administrator-guide/troubleshooting) for common issues

## Project Status

Dharini is actively developed and maintained by the Data Science Innovation Hub (DSIH) team at ARTPARK, Bengaluru, India.

- **Repository**: [github.com/dsih-artpark/dharini](https://github.com/dsih-artpark/dharini) (The repository is currently private, but will be made public soon)
- **License**: [Apache License 2.0](https://github.com/dsih-artpark/dharini/blob/production/LICENSE). Third-party software and bundled data keep their own licences, listed in `THIRD_PARTY_NOTICES.md` and `DATA_SOURCES.md` in the repository
- **India Instance (Flagship)**: [https://in.dharini.artpark.ai/](https://in.dharini.artpark.ai/)

## Support

For questions, issues, or contributions:

- Review the documentation in this site
- Check the [GitHub repository](https://github.com/dsih-artpark/dharini)
- Contact your project administrator or technical support team

---

## Next Steps

- [Explore the User Guide](/user-guide/)
- [Review Software Requirements](/reference/requirements)
- [Set up a production deployment](/administrator-guide/production-setup)
