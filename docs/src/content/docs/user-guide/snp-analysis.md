---
title: SNP Analysis
description: Submit sequence files, track analysis runs, and explore SNPs, insertions and deletions in pathogen genomes
sidebar:
  order: 8
---

The **SNP Analysis** module gives you an end-to-end workflow for identifying and interpreting genomic variation in pathogen sequences. You submit sequence data, Dharini runs it through an analysis pipeline, and you explore the variants it finds. It identifies **SNPs, insertions and deletions** and reports their predicted impact, the affected genes and the protein-level changes. An interactive whole-genome view gives an at-a-glance overview while letting you look at individual mutations in detail. This helps you quickly spot variants of concern for further investigation.

Open it from **Monitor → SNP Analysis** in the sidebar. The page is titled **Sequencing**.

:::note
The pipelines you can choose, and the file types each one accepts, are configured by your administrator. FASTA and FASTQ inputs are supported, including Illumina and Oxford Nanopore data, depending on which pipelines are set up for your deployment.
:::

## The Sequencing Records List

The page lists your **Sequencing records**: every submission with its file format and processing status (**Completed**, **In progress**, **Queued**, **Failed** or **Cancelled**). Use the status filter to narrow the list. Click a record to open its details. Use **Download CSV** to export the list.

## Submitting Sequence Data

1. Click **Upload sequence files**. The **New sequencing submission** window opens.
2. **Choose the sample.** Pick the **Project** first, then choose the **sample source**:
   - **Lab sample**: select one of the project's lab samples. You can search by sample ID, site or pathogen.
   - **NCBI accession**: enter a **GenBank accession** (for example `OQ123456`). Dharini looks it up in NCBI, fills in the sequence details and fetches the FASTA file automatically. Add a **Sample ID** and, optionally, a **Source / site**. If you see "GenBank ID not found", check the accession number.
   - **New sample**: enter a sample that is not in the lab system yet.
3. Click **Continue** and **choose a processing pipeline**.
4. **Add your files.** Upload the reads file for the pipeline you chose. Some pipelines also ask for extra inputs, such as a reference sequence. Wait until each file shows **Uploaded**.
5. Review the **pipeline parameters** and output options. The defaults are sensible for most runs.
6. Start the run.

If a file fails to upload, click **Retry**. You cannot start a run while a file is still uploading.

## Tracking a Run

Open a record to see its progress. The detail panel shows the **pipeline stages** and which one is running.

| Status | What it means |
| --- | --- |
| **Queued** | The run is waiting to start. It is not stuck. |
| **In progress** | The stages are processing. If no update arrives for a while, the status may briefly show "No signal". This usually clears on its own and does not mean the run failed. |
| **Completed** | Results are ready. |
| **Failed** | Something went wrong. The panel shows which stage failed and **Technical details**. Re-submit the file, or contact support if it keeps happening. |
| **Cancelled** | The run was stopped before finishing. Re-submit the file to run it again. |

If a run completed but its result files cannot be retrieved, the analysis itself completed. The files just could not be found for download.

## Exploring the Results

### Run Overview

**Run Overview** shows the **Run ID** (click to copy it), the **impact distribution** of the variants, and the **top functional effects**.

### Called Variants

The **Variants** table lists every variant found, with its position, gene, effect, impact, protein change (HGVS.p), read depth and allele frequency.

- Search by gene, position or effect.
- Filter by **impact**, then **Clear filters** to start over.
- Choose how many rows to show per page.
- Click the download button to export the **filtered** variants as CSV.

### Interactive Genome View

The **NextGen Visualizer** opens an interactive plot of the whole genome. It has two views:

- **Executive Summary**: the **key findings at a glance**, including disrupted genes, altered proteins and sequencing quality, a **leaderboard of the most impacted genes**, and the genome span.
- **Genome Map & Table**: the full genome overview with every mutation plotted. Colours show severity: **Critical**, **Altered**, **Silent** and **Non-Coding**.

On the map you can:

- Drag the box to **pan**, and use the zoom buttons to zoom in and out.
- Hover over a mutation to see its position, gene, effect, protein change and depth or confidence.
- Search for a gene, mutation or position.
- Click **View on Genome Map** from the leaderboard to jump to a gene.
- Click **Reset** to return to the full view, or **SVG** to export the chart.

The plot file can be a few MB, so it may take a moment to load. If it does not appear, click **Try again** or open the plot in a new browser tab.

## Tips

- Pick the pipeline that matches your sequencing platform and file type.
- Wait for each upload to finish before starting the run.
- Use the impact filter to focus on critical changes first.

## Next Steps

- [Lab Technician Guide](/user-guide/lab-technician): record the test results that lead to sequencing
- [Dashboards & Analysis](/user-guide/dashboard)
- [Return to User Guide Overview](/user-guide/)
