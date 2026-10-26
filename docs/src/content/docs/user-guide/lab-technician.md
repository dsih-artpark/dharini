---
title: Lab Technician Guide
description: Complete workflow guide for Lab Technicians using the Dharini web portal
sidebar:
  order: 5
---

Lab technicians use the Dharini web portal to receive samples, process them step by step, and record test results. In Dharini these users have the **Lab Member** or **Lab Admin** role. This guide covers the lab workflow from the moment a sample arrives to its final result.

## Getting Started

Log in with your email or phone number and a one-time code, and choose your workspace if asked. See [Getting Started](/user-guide/getting-started).

### Opening the Lab Screen

1. In the left-hand menu, select **Lab Processing**.
2. If you do not see **Lab Processing**, your account does not have lab access. Ask your admin.

:::note
If your role covers several projects and none is selected, the list is **read-only** and asks you to select a specific project before you can process samples.
:::

You can switch workspace at any time from the workspace name at the top of the left-hand menu.

## The Lab Screen

The lab screen has two parts: a summary at the top and the sample list below it.

### Samples in Pipeline

The summary cards show how many samples are at each stage:

- **Collected** – Samples collected in the field, not yet received at the lab
- **Received** – Samples accepted at the lab
- **Pre-processed** – Samples that have finished pre-processing
- **Extracted** – Samples that have finished extraction
- **Rejected** – Samples rejected at receiving
- **Test Results** – Samples with test results

Use the date filter (**This Month** or **Last Month**, or all time) to change the period.

### Received Samples List

Below the summary, the **Received Samples** list has a tab for each stage:

| Tab | What it contains |
| --- | --- |
| **Collected** | Samples waiting to be received at the lab |
| **Received** | Accepted samples waiting for pre-processing |
| **Virus Isolation** | Samples waiting for virus isolation (Avian Influenza) |
| **Pre-processed** | Samples waiting for extraction |
| **Extracted** | Samples waiting for testing |
| **Rejected** | Samples rejected at receiving |
| **Test Results** | Samples with finished test results |

Each row shows the **Sample ID** (barcode), **Site Name**, **Round**, **Disease**, **Location**, **Farm Type** and **Last Activity**. The **Collected** tab also shows **Collected By**.

To find samples:

1. Select **Filter** to open the filters: **Sample Barcode**, **Disease**, **Sample Type**, **Site**, **Date Range** (with quick presets such as **Today**, **Last 7 Days**, **This Month** and **Last 30 Days**), **State**, **Round**, **Batch Ref ID**, and **Test Result** (Positive, Negative or Unclear).
2. Select **Apply** to use the filters.
3. Select **Clear all filters** to start again.

Select **Columns** to show or hide columns, and use **Show** to change how many rows appear on a page.

**Actions on each row:**

- **View** – Opens the sample's details
- **Accession** – Starts processing a sample in the **Collected** tab
- **Process** – Continues processing a sample in any later stage
- **Retest** – Appears in the **Test Results** tab
- **Edit Details** – Lets team admins and lab admins correct the details of a sample

## Processing a Sample

Select **Accession** (or **Process**) on a row to open the sample. A progress bar at the top shows the steps:

**Receiving → Pre-processing → Virus Isolation → Extraction → Testing → Completed**

**Virus Isolation** only applies to Avian Influenza (AI) samples. For other diseases the process goes straight from Pre-processing to Extraction.

When you open a sample that is partway through, Dharini takes you to the step it is waiting at. Each step up to Extraction has:

- **← Back** – Go back to the previous step
- **Save & Exit** – Save your work, move the sample to the next stage, and return to the list
- **Proceed to …** – Save your work and continue to the next step straight away

The **Testing** step has only **← Back** and **Submit Results**.

:::note
**Save & Exit** and **Proceed** both move the sample forward. The only difference is where you land afterwards. After **Save & Exit** you go back to the list, and the sample appears in the next stage's tab.
:::

### Step 1: Receiving

Use this step when the physical samples arrive.

1. Check each container against the screen. Look at the packaging, labels, sample condition, storage temperature and quantity.
2. Under **Common Receiving Details**, fill in what applies to the whole batch:
   - **Receiving Date** and **Receiving Time**
   - **Storage Temperature**
   - **Storage Details**, for example the freezer and rack
   - **Reference Batch ID**
   - **Batch Reference Document** – Optionally upload an image or PDF
   - **Received By** – Choose the person who received the samples
3. In the table, decide on each sample:
   - Select **Accept**, then enter its **Volume** and unit
   - Or select **Reject**, then enter a **Reason for rejection…**
4. Select **Save & Exit**, or **Proceed to Pre-processing**.

:::caution
Every sample needs a decision before you can save. Receiving date, time and **Received By** are required if you accept any sample, and rejected samples must have a reason.
:::


**What happens after rejection:** the sample moves to the **Rejected** tab with your reason recorded. If you reject every sample, you are returned to the list. The sample's final screen reads "The sample is rejected" and shows the reason.

### Step 2: Pre-processing

Pre-processing is optional. If you do not need it, you can move straight on.

1. Under **Pre-processing Method**, choose one:
   - **Homogenisation** – Break down the sample
   - **Filtration** – Remove particles
   - **Aliquoting** – Divide into portions
   - **Pooling** – Combine samples (shown only when at least two samples of the same type are being processed)
   - To change your mind, select **Clear selection**.
2. For each sample, fill in the **Method**, **Input Vol.**, **Output Vol.** and **Remarks**.
3. Choose **Performed By**, check the **Timestamp**, and add **Additional Comments** if needed.
4. If any of the samples are Avian Influenza, choose the **Testing Type**:
   - **Virus Isolation** – Go to the virus isolation step next
   - **Extraction** – Go straight to extraction
5. Select **Save & Exit** or **Proceed to Virus Isolation** or **Proceed to Extraction**.

If you do not choose a method, Dharini records that pre-processing was skipped.

#### Pooling samples

Pooling combines several samples of the same type into one pool that is tested as a single unit.

1. Choose **Pooling**.
2. Tick the samples that belong in the first pool in the **Select Samples to Pool** table. You can use the **Quick pool** buttons, for example **All Blood (4)**, to pool every sample of one type.
3. Enter the **Pooled Volume** and the **Pooled ID** (for example POOL-2026-001).
4. Select **Done** to lock the pool. Select **Edit** on a locked pool to change it.
5. Start another pool by ticking more samples. A pool can only contain samples of the same type, and every pool needs at least two samples.

From here on, a pool is shown as one line wherever **Sample ID / Pool** appears.

### Step 3: Virus Isolation (Avian Influenza only)

This step records isolation and titre results for AI samples.

1. For each sample or pool, record the **HA Test**, **Inoculation**, **Harvesting**, **HA Titre**, **HI Titre**, **HA subtype**, **N subtype**, **Storage** and **Volume**.
2. Select **Save & Exit** or **Proceed to Extraction**.

If you want to skip both virus isolation and extraction for these samples, select **Skip to Testing**. If a batch has no AI samples, the screen says "No AI samples in this batch" and you can carry on to the next step.

### Step 4: Extraction

This step records how nucleic acid was extracted.

1. Under **Common Extraction Parameters**, fill in what is the same for the whole batch:
   - **Nucleic Acid Extracted** (the type)
   - The **Extraction Method/Kit**. If it is not on the list, choose **Other** and type the name.
   - **Storage Temperature** and **Storage Details**
   - **Extracted By**
2. Add any **Additional Custom Parameters** with a **Parameter Name** and **Measured Value**.
3. In the table, for each sample or pool, fill in **Vol. Used**, **Vol. Remaining**, **PCR Vol.** and the **Extraction Date**, plus elution volume, concentration and purity readings.
4. Select **Save & Exit** or **Proceed to Testing**.

### Step 5: Testing

Testing shows one card for each disease in the batch. Select a card to open it.

1. Under **Common Testing Parameters**, choose the **kit/protocol** (or **Other / Add custom kit** and type the name), enter the **Primary Screening Target**, and choose **Tested By**.
2. Under **Step 1: Target Gene Screening**, set a **Result** for each sample or pool: **Pending**, **Positive**, **Negative** or **Unclear**. You can also record the **CT Value**, **Viral Load**, **Variant** and **Viral Copies** and the **Result Date**.
3. For diseases that need it, **Step 2: Individual Subtyping** lets you record the gene, CT value, result and viral copies for each target. The **Subtype** is filled in automatically from the positive targets.
4. Optionally, use **Upload Test Report (Optional)** to attach a test report file (up to 25 MB).
5. Select **Submit Results**.

Dharini warns you if a kit or protocol is missing or a sample has no result.

### Step 6: Completed

The last screen says "The sample process is completed successfully". Select **Back to Lists** to return. The sample now appears in the **Test Results** tab.

## Processing Many Samples at Once

You can process a whole batch together at the **Collected**, **Received**, **Virus Isolation**, **Pre-processed** and **Extracted** stages.

1. Open the tab for the stage you want to work on.
2. Tick the samples. Use the checkbox in the header row to select all the samples on the page.
3. Select **Process Selected**. The **Bulk Processing Action** window opens with the form for that step, applied to all the selected samples.
4. Fill in the form and save, exactly as for a single sample.

While samples are ticked, the **Accession** and **Process** buttons on single rows are switched off. Select **Clear selection** to go back.

## Retesting

If a sample needs to be tested again:

1. Open the **Test Results** tab.
2. Select **Retest** on the sample.
3. The **Retest Sample** window shows **Previous Tests** and a form for the new results: **Kit/Protocol**, **Tested By**, **CT Value**, **Variant**, storage details and comments.
4. Select **Submit Retest Results**.

## Test Report Files

### Test Reports Uploaded at Testing

If you attached a report file during the testing step, it stays linked to that sample.

## Correcting Sample Details

Lab admins and team admins can correct the details recorded for a sample after the fact.

1. Find the sample in the list.
2. Select **Edit Details**.
3. Change the fields for the stages that have been completed, for example receiving details, pre-processing, extraction or isolation values.
4. Save the changes.

## Quality and Traceability

Every step records who did it and when. Use **View** on any sample to see its field details (site, collector, collection date, photos) alongside all lab steps and results.

### Best Practices

- Check the barcode on the container against the screen before you accept the sample
- Give a clear **Reason for rejection** so field teams can learn from it
- Enter data as you work to avoid backlogs
- Use the same terms and units every time
- Choose the right **Performed By** name for each step

## Tips for Efficient Lab Operations

### Daily Workflow

- Start with the **Collected** tab and receive new samples
- Work through the tabs from left to right, moving samples to the next stage
- Use **Process Selected** for batches
- Check the **Test Results** tab for finished samples and retests

## Troubleshooting

For common issues and their solutions, see the [Troubleshooting Guide](/user-guide/troubleshooting).

## Next Steps

- [Dashboards & Analysis](/user-guide/dashboard): see results across the project
- [SNP Analysis](/user-guide/snp-analysis): submit sequences for positive samples
- [Team Admin Guide](/user-guide/team-admin)
- [Troubleshooting Guide](/user-guide/troubleshooting)
- [Return to User Guide Overview](/user-guide/)
