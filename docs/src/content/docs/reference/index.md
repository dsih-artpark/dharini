---
title: Reference
description: Technical reference documentation for Dharini platform
---

This section contains technical reference material for the Dharini platform, including architecture documentation, system requirements, and specifications.

## Documentation

### [Platform Architecture](/reference/architecture/)

Technical architecture overview covering the end-to-end data flow from mobile sample collection through laboratory processing to administrative dashboards. Includes tech stack details for all components (Flutter, NestJS, Next.js, PostgreSQL) and service dependency diagrams.

### [Software Requirements & Specifications](/reference/requirements/)

Comprehensive software specifications including runtime requirements, development environment setup, production infrastructure, dependency versions, database schema, API specifications, and security requirements.

### [Product Requirements & Specifications](/reference/product-requirements/)

Product-level requirements covering the problem Dharini solves, target users and stakeholders, user roles and permissions, key workflows, functional requirements by module, and product-level non-functional requirements.

### [API Reference](/api-reference/)

Every backend REST endpoint with its parameters, request bodies, responses and authentication, generated from the NestJS source. The raw OpenAPI 3.0 spec is available at [`/openapi/openapi.json`](/openapi/openapi.json) for use with Postman, Insomnia or OpenAPI Generator.

---

## Additional Resources

- [User Guide](/user-guide/) — Workflows for field collectors, lab technicians, and team admins
- [Administrator Guide](/administrator-guide/) — Deployment, configuration, and troubleshooting for DevOps teams
- [Introduction](/introduction/) — Platform overview and getting started

---

## For Technical Collaborators

Infrastructure documentation, deployment runbooks, and internal engineering notes are maintained separately for technical collaborators and contributing organizations. These resources are available at [engg.artpark.ai](https://engg.artpark.ai).
