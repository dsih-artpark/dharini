# Security Policy

Dharini is a One Health disease surveillance platform that handles sensitive operational data, including sample records, laboratory results, field-collected information, and precise location data. We take the security of this data and of the people who use the platform seriously, and we appreciate the efforts of security researchers and contributors who help us keep it safe.

## Supported Versions

Security fixes are applied to the current production release only.

| Version                    | Supported |
| -------------------------- | --------- |
| Current production release | Yes       |
| Older unsupported releases | No        |

If you are running a self-hosted deployment, please upgrade to the latest release before reporting an issue.

## Reporting a Vulnerability

> **Do not report security vulnerabilities through public GitHub issues, pull requests, or discussions.**

Please report vulnerabilities privately by email to **[dharini-support@artpark.in](mailto:dharini-support@artpark.in)**.

We especially want to hear about:

- Authentication or authorization bypass
- Privilege escalation (for example, a field collector gaining project admin or lab access)
- Sensitive data exposure (health, location, personal, or surveillance data)
- Insecure direct object references (accessing another project's, workspace's, or user's records)
- OTP or authentication weaknesses (brute force, replay, bypass, token handling)
- File upload vulnerabilities
- Injection vulnerabilities (SQL, command, template, script)
- Secrets accidentally exposed in the repository, its history, builds, or logs
- Vulnerable dependencies that are exploitable in Dharini

## What to Include in a Report

To help us triage quickly, please include:

- **Affected component:** backend API, web app, mobile app, docs site, or deployment configuration, plus the version or commit if known
- **Steps to reproduce:** a clear, minimal sequence of requests or actions
- **Impact assessment:** what an attacker could achieve and what data or users are affected
- **Logs or screenshots** that support the report, **with all personal data, tokens, OTPs, and credentials removed**

If you accessed any real data while investigating, tell us what you saw, and do not keep or share it.

## Response Process

When you submit a report, we will:

1. **Acknowledge** receipt within a reasonable timeframe, typically within 5 business days.
2. **Investigate** the report to confirm the issue and assess its severity and impact, and keep you informed of progress.
3. **Remediate** confirmed vulnerabilities, prioritized by severity, and rotate any credentials that may have been exposed.
4. **Notify** you when a fix is released and credit you in the release notes, if you wish.

## Disclosure Policy

We follow a coordinated disclosure process:

- Please give us a reasonable opportunity to investigate and release a fix before any public disclosure.
- We will agree on a disclosure date with you once a fix is available.
- Public disclosure should not include sensitive data, working credentials, or details that would put unpatched deployments at undue risk.

We will not take action against researchers who act in good faith, follow this policy, avoid privacy violations and service disruption, and do not access or modify data beyond what is needed to demonstrate the issue.

## Scope

**In scope**

- Source code in this repository: `backend/`, `web/`, `mobile/`, and `docs/`
- Deployment configuration in this repository (Docker Compose, nginx, CI workflows)
- Official Dharini deployments operated by the project maintainers

**Out of scope**

- Denial-of-service or volumetric attacks
- Social engineering, phishing, or physical attacks against staff, partners, or field teams
- Vulnerabilities in third-party services or platforms (report these to the vendor)
- Misconfigurations in self-hosted deployments not caused by Dharini's code or default configuration
- Findings without demonstrated security impact, such as missing headers or version banners on their own

**Testing guidelines:** use a local instance or your own test accounts wherever possible. Never access, modify, or exfiltrate other users' data, and never run automated scans against production systems.

## Security Best Practices for Contributors

Contributors must **never commit**:

- API keys
- Tokens (JWTs, access tokens, personal access tokens)
- Passwords or database credentials
- OTPs, including test OTPs from real accounts
- Production data or database dumps
- Personal information (names, phone numbers, addresses, health or location records)

Also:

- Keep secrets in local `.env` files, which are git-ignored. Only add placeholder values to `.env.example`.
- Never enable test or bypass settings (such as `ALLOW_FIXED_OTP`) in production.
- Do not log OTPs, tokens, credentials, or personal data. Redact them in error messages and logs.
- Use synthetic or anonymized data in tests, fixtures, screenshots, and documentation.
- Enforce authorization on every new endpoint, and scope queries to the caller's project or workspace.
- Validate and sanitize all input, especially file uploads and query parameters.
- Keep dependencies up to date, and review Dependabot and `npm audit` findings.

If you accidentally commit a secret, **report it immediately** to [dharini-support@artpark.in](mailto:dharini-support@artpark.in) so it can be rotated. Removing it in a later commit is not enough, because it remains in git history.
