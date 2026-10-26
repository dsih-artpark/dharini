# Dharini Documentation

This folder contains the documentation website for Dharini, a One Health disease surveillance and sample collection platform. The site is built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build).

The published documentation is available at **[https://dharini.artpark.ai](https://dharini.artpark.ai)**.

## Documentation Categories

| Section                     | Location                                   | Audience and content                                                                              |
| --------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| **User Guide**              | `src/content/docs/user-guide/`             | Field collectors, lab technicians, and team admins: day-to-day workflows and troubleshooting   |
| **Administrator Guide**     | `src/content/docs/administrator-guide/`    | Deployers and operators: production setup, environment variables, database, nginx, troubleshooting |
| **Architecture**            | `src/content/docs/reference/architecture.mdx` | Developers and reviewers: system components and end-to-end data flow                           |
| **Requirements**            | `src/content/docs/reference/requirements.md`  | Software requirements, dependencies, and technical specifications                              |
| **Reference Documentation** | `src/content/docs/reference/`              | Data standards, ontology, and other technical reference material                                  |

## Project Structure

```
docs/
├── public/                 # Static assets served as-is (e.g. favicon)
├── src/
│   ├── assets/             # Images and diagrams embedded in pages
│   └── content/docs/       # Documentation pages (.md / .mdx)
├── astro.config.mjs        # Site configuration and sidebar
└── package.json
```

Each `.md` or `.mdx` file under `src/content/docs/` becomes a page, with its URL based on the file path. Sidebar sections are generated automatically from the `user-guide`, `administrator-guide`, and `reference` folders.

## Local Development

Requires Node.js 22 (see the repository's `.nvmrc`).

```bash
cd docs
npm install
npm run dev
```

The site will be available at http://localhost:4321 and reloads automatically as you edit.

## Production Build

```bash
npm run build
```

The static site is output to `docs/dist/`. Run `npm run preview` to check the build locally before publishing.

## Contributing

Corrections and new guides are welcome. When adding a page:

- Place it in the folder matching its category so it appears in the right sidebar section.
- Include `title` and `description` frontmatter.
- Use synthetic example data only. Never include real credentials, personal information, or health or location data.

See the repository's [CONTRIBUTING.md](../CONTRIBUTING.md) for the full contribution process.
