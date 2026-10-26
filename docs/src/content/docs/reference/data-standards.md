---
title: Data Standards & Ontology Reference
description: Terminology, ontology, and unit standards applied across the sample-collection database schema
---

**Data Standards & Ontology Reference**

Dharini platform

_A reference guideline for terminology, ontology, and unit standards applied across the sample-collection database schema_

**Document Version 3.0**  
Status: Pending for Approval

# Document Control

| Document Title                          | Data Standards & Ontology Reference                                                                                                                                                                                                                              |
| :-------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Version**                             | 3.0                                                                                                                                                                                                                                                              |
| **Status**                              | Pending for Approval                                                                                                                                                                                                                                             |
| **Scope**                               | Terminology, ontology, and unit standards applied to the sample-collection database schema (columns table) supporting animal disease surveillance                                                                                                                |
| **Primary Standards Bodies Referenced** | PHA4GE, WOAH, LGD (Government of India), ICAR (International Committee for Animal Recording) standards, ICAR-NBAGR, and supporting international ontologies (NCBITaxon, UBERON, ENVO, UO/UCUM, ISO 8601, WGS84, SNOMED CT, LOINC, INSDC, Pango/WHO nomenclature) |
| **Document Owner**                      | Rukshat Yaduvanshi (Associate Product Manager)                                                                                                                                                                                                                   |
| **Reviewed by**                         | Dr. Lijith K M (Senior Program Manager)                                                                                                                                                                                                                          |
| **Approved By**                         | Rohit Satish (Director- Health, Data and AI)                                                                                                                                                                                                                     |
| **Review Cadence**                      | Upon major changes or significant platform updates.                                                                                                                                                                                                              |
| **Next Scheduled Review**               | Approval Date+1 Year                                                                                                                                                                                                                                             |

## Version History

| Version | Date       | Author             | Change Summary                              |
| :------ | :--------- | :----------------- | :------------------------------------------ |
| 1.0     | 21.10.2025 | Sneha Sai          | Initial version; standards mapped per field |
| 2.0     | 20.01.2026 | Rukshat Yaduvanshi | Updated version                             |
| 3.0     | 20.08.2026 | Rukshat Yaduvanshi | Updated the ontology tree                   |

# 1\. Purpose & Scope

This document is the approved reference for the terminology, ontology, and unit standards used in Dharini. Once formally adopted, it governs:

- How field values must be recorded so they can be cross-referenced against internationally and nationally recognized vocabularies.

- How data is structured for external sharing or reporting (e.g. to WOAH, national disease-control programmes) without ambiguity over terminology or units.

- Onboarding of new team members and downstream data consumers, who should treat this document as the source of truth for why a field is structured the way it is.

- Change control-any future addition or modification to the schema should be checked against this document, and this document updated in turn.

## Standards Followed

## The system follows applicable standards and data practices from PHA4GE, WOAH, the Government of India Local Government Directory (LGD), and the standard ontologies and data schemes used by the National Digital Livestock Mission (NDLM). Where these primary sources do not define field-level standards, internationally recognized domain ontologies and standards are used for areas such as species taxonomy, anatomical and environmental specimen sources, units of measurement, dates, and geographic coordinates.

## Field Tiering

Every field in Section 5 is classified into one of three tiers, so that data-quality effort is prioritized correctly:

- Mandatory: required for case identification, traceability, or regulatory reporting. Missing or non-conformant values in these fields should block record completion where feasible.
- Recommended: materially improves epidemiological or operational value, but a record remains usable without it.
- Optional: supplementary context; capture when available.

## 2\. How to Read This Document

- Section 3: Dharini Terminology & Ontology Mapping Model: the conceptual framework (disease → pathogen → species → sample type → site type) that the field-level mapping in Section 5 implements.
- Section 4: Standards Catalog: every external standard/ontology referenced anywhere in the schema, with its scope and a reference link.
- Section 5: Field-Level Standards Mapping: the standard applied to each substantive (non-internal) field, grouped by database table, with its Mandatory/Recommended/Optional tier.
- Internal system fields: primary keys, foreign keys, audit timestamps (createdAt/updatedAt), and application workflow-status enums: are excluded from Section 5, since no external ontology applies to them.

# 3\. Dharini Terminology & Ontology Mapping Model

This section defines the common semantic framework for Dharini, so that data captured across disease, pathogen, species, sample-type, and site-type domains can be consistently understood, linked, and reused across systems, datasets, and research workflows. It reflects the Phase 1 semantic ontology agreed with the research team.

## 3.1 Ontology Tree

**DHARINI SURVEILLANCE RECORD**

**› Disease — WOAH disease concept**

› FMD — Foot and mouth disease

› LSD — Lumpy skin disease

› HPAI — High pathogenicity avian influenza

**› Pathogen — NCBI Taxonomy \+ ICTV classification**

› Foot-and-mouth disease virus — NCBI Taxonomy 12110

› Lumpy skin disease virus — NCBI Taxonomy 59509

› Influenza A virus — NCBI Taxonomy 11320

**› Species / Host — controlled species concept \+ external taxonomy mapping**

› Cattle / Bos taurus

› Buffalo / Bubalus bubalis

› Bird species — species-specific taxonomy where identified

› Other One Health host species

**› Sample Type**

› Clinical / anatomical specimen → UBERON

› Blood → UBERON:0000178

› Blood serum → UBERON:0001977

› Feather → UBERON:0000022

› Saliva → UBERON:0001836

› Urine → UBERON:0001088

› Environmental specimen / matrix → ENVO

› Air → ENVO:00002005

› Soil → ENVO:00001998

› Sediment → ENVO:00002007

› Fecal material → ENVO:00002003

› Water → ENVO

› Other material vocabularies where appropriate

› Feed → FoodOn (rather than forcing into UBERON/ENVO)

**› Site Type — controlled Dharini site concepts \+ geospatial/contextual mapping**

› Poultry farm / cattle farm / wetland / laboratory / project-defined site

**› Contextual Metadata**

› Collection method — swab is a method; anatomical/environmental source is the semantic specimen concept

› Processing & storage — pooled, dry/wet, cold storage are attributes, not new sample ontology terms

› Disease-specific attributes — FMD → serotype | AI → pathogenicity \+ subtype | LSD → disease/vector context

› Vector observation — disease-dependent; especially relevant to LSD: vector, taxon, life stage, abundance, collection method

## 3.2 How the Standards Fit Together

| Dharini Domain                 | Primary Standard                                    | What It Standardises               | Example                                           |
| :----------------------------- | :-------------------------------------------------- | :--------------------------------- | :------------------------------------------------ |
| **Disease**                    | WOAH                                                | Disease/infection concept          | FMD → Infection with foot and mouth disease virus |
| **Pathogen**                   | NCBI Taxonomy \+ ICTV                               | Biological agent / taxonomy        | Influenza A virus → NCBI 11320                    |
| **Species**                    | NCBI Taxonomy / recognised terminology              | Host species identity              | Bos taurus                                        |
| **Clinical/anatomical sample** | UBERON                                              | Anatomical source / body substance | Blood → UBERON:0000178                            |
| **Environmental sample**       | ENVO                                                | Environmental material / medium    | Soil → ENVO:00001998                              |
| **Feed**                       | FoodOn                                              | Food/feed material                 | Animal feed → FoodOn                              |
| **Site type**                  | Dharini controlled vocabulary \+ geospatial context | Operational sampling location      | Poultry farm / wetland                            |

## 3.3 Core Semantic Rule: Label ≠ Concept

| A Dharini display label does not need to match an external ontology label word-for-word. The requirement is that its meaning is mapped to a stable concept. _Example: “Blood Serum” can remain the Dharini display label while mapping to UBERON:0001977._ |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

## 3.4 Sample-Type Modelling

Recommended structure: Sample record → matrix/specimen concept \+ anatomical/environmental source \+ collection method \+ processing/storage attributes.

**Worked example — Cloacal Swab:**

- Anatomical source: Cloaca → UBERON

- Collection method: Swab

- Context: host species, date, site, processing/storage

## 3.5 Disease-Specific Pipelines

| Disease  | Concept Pipeline                                                                                                                                |
| :------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| **FMD**  | WOAH disease concept → Foot-and-mouth disease virus → NCBI Taxonomy 12110 → host species → sample type → site → serotype                        |
| **LSD**  | WOAH disease concept → Lumpy skin disease virus → NCBI Taxonomy 59509 → host species → sample type → site → vector observation where applicable |
| **HPAI** | WOAH disease concept → Influenza A virus → NCBI Taxonomy 11320 → host species → sample type → site → pathogenicity/subtype                      |

## 3.6 Attributes That Are NOT Separate Sample-Ontology Terms

These describe how or where a sample was handled, not what the sample fundamentally is — they should be captured as attributes on the sample record, not as additional entries in the sample-type ontology:

- Pooling — processing attribute

- Dry/Wet — physical-state attribute

- Cold storage — storage-condition attribute

- Swab — collection method

- Site names such as "Pond 3" — site/entity identifier

- Vector presence — observation; vector taxonomy is separate

## 3.7 Terminology Governance

A central Dharini terminology master should be maintained, recording for every controlled term:

| Dharini internal ID • Display name • Preferred semantic concept • Ontology authority • External ID/URI • Synonyms • Mapping status • Version and effective dates |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------- |

User-facing labels remain usable for field collectors, while semantic identifiers provide interoperability across systems and research workflows (Section 3.3).

## 3.8 Ontology Reference Links

| Source                                            | Link                                            |
| :------------------------------------------------ | :---------------------------------------------- |
| WOAH — Terrestrial Code Chapter 1.3               | woah.org/.../en_chapitre_oie_listed_disease.htm |
| WOAH — Foot and mouth disease                     | woah.org/en/disease/foot-and-mouth-disease/     |
| WOAH — Lumpy skin disease                         | woah.org/en/disease/lumpy-skin-disease/         |
| WOAH — Avian influenza                            | woah.org/en/disease/avian-influenza/            |
| WOAH — Chapter 1.5: arthropod vector surveillance | woah.org/.../chapitre_surveillance_vector.pdf   |
| UBERON — OBO Foundry                              | obofoundry.org/ontology/uberon.html             |
| ENVO — OBO Foundry                                | obofoundry.org/ontology/envo.html               |
| NCBI Taxonomy                                     | ncbi.nlm.nih.gov/taxonomy/                      |
| ICTV Taxonomy                                     | ictv.global/taxonomy                            |

# 4\. Standards Catalogue

The following standards, ontologies, and controlled vocabularies are referenced across the schema.

| Standard                            | Full Name & Scope                                                                                                                                                      | Applies To (in this system)                                                                                                                                               | Reference                                                                    |
| :---------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :--------------------------------------------------------------------------- |
| **PHA4GE**                          | Public Health Alliance for Genomic Epidemiology-Contextual Data Specification & GENEPIO ontology                                                                       | Pathogen genomic surveillance metadata: sample identifiers, collection/processing/sequencing fields, questionnaire structure                                              | github.com/pha4ge/contextual-data-specification                              |
| **WOAH**                            | World Organisation for Animal Health-Terrestrial Animal Health Code, Manual of Diagnostic Tests and Vaccines for Terrestrial Animals, and the WOAH-listed disease list | Disease listing (Ch.1.3), animal ID & traceability (Ch.4.2), vaccination status terminology (Ch.1.4/4.18), validated diagnostic methods, production-system classification | woah.org                                                                     |
| **LGD**                             | Government of India Local Government Directory (Ministry of Panchayati Raj)                                                                                            | Administrative geography: country / state / district / sub-district / village hierarchy codes                                                                             | lgdirectory.gov.in                                                           |
| **NDLM /**                          | Government of India (DAHD \+ NDDB) National Digital Livestock Mission                                                                                                  | Animal identification (12-digit "Pashu Aadhaar" ear-tag ID, bovines & small ruminants), vaccination/AI/treatment event recording                                          | bharatpashudhan.ndlm.co.in                                                   |
| **ICAR-NBAGR**                      | Indian Council of Agricultural Research-National Bureau of Animal Genetic Resources (Karnal)                                                                           | Official registry of indigenous Indian livestock & poultry breeds; source of Bharat Pashudhan's breed picklist                                                            | nbagr.res.in                                                                 |
| **NCBITaxon**                       | NCBI Taxonomy database                                                                                                                                                 | Host species, vector species, and pathogen organism identifiers                                                                                                           | ncbi.nlm.nih.gov/taxonomy                                                    |
| **ICAR**                            | ICAR (International Committee for Animal Recording) standards                                                                                                          | Animal identification (12-digit "Pashu Aadhaar" ear-tag ID,                                                                                                               | https://www.icar.org/Guidelines/01-General-Rules.pdf?utm\_source=chatgpt.com |
| **ICTV**                            | International Committee on Taxonomy of Viruses                                                                                                                         | Formal taxonomic naming of viral pathogens (e.g. current species names for FMDV, LSDV)                                                                                    | ictv.global                                                                  |
| **FAO DAD-IS**                      | FAO Domestic Animal Diversity Information System                                                                                                                       | International cross-reference for livestock breed names                                                                                                                   | fao.org/dad-is                                                               |
| **PATO**                            | Phenotype And Trait Ontology                                                                                                                                           | Biological sex of animal subjects (species-agnostic)                                                                                                                      | ebi.ac.uk/ols/ontologies/pato                                                |
| **UBERON**                          | Uber-anatomy ontology-integrative, species-agnostic anatomy ontology                                                                                                   | Anatomical/clinical specimen source (blood, tissue, trachea, cloaca, feces, etc.)                                                                                         | obophenotype.github.io/uberon                                                |
| **ENVO**                            | Environment Ontology                                                                                                                                                   | Environmental specimen source and habitat (water, soil, litter, sediment, surfaces)                                                                                       | sites.google.com/site/environmentontology                                    |
| **UO / UCUM**                       | Units Ontology / Unified Code for Units of Measure                                                                                                                     | Units for all measured quantities: age, volume, temperature, concentration, weight                                                                                        | ucum.org                                                                     |
| **ISO 8601**                        | International date and time format standard                                                                                                                            | All date/time fields                                                                                                                                                      | iso.org/iso-8601-date-and-time-format.html                                   |
| **WGS84 / EPSG:4326**               | Standard geographic coordinate reference system                                                                                                                        | Latitude/longitude and spatial geometry fields                                                                                                                            | epsg.io/4326                                                                 |
| **ISO 3166**                        | International country (3166-1) and state/province (3166-2) code standard                                                                                               | Non-India administrative geography                                                                                                                                        | iso.org/iso-3166-country-codes.html                                          |
| **SNOMED CT**                       | Standardised clinical terminology                                                                                                                                      | Clinical signs/findings; laboratory result values (positive/negative/inconclusive)                                                                                        | snomed.org                                                                   |
| **LOINC**                           | Logical Observation Identifiers Names and Codes                                                                                                                        | Laboratory test identifiers (partial veterinary coverage-see Gap Register)                                                                                                | loinc.org                                                                    |
| **INSDC / ENA**                     | International Nucleotide Sequence Database Collaboration (NCBI/ENA/DDBJ)                                                                                               | Sequence accession formats; sequencing platform & library-strategy controlled vocabularies                                                                                | insdc.org                                                                    |
| **Pango / WHO nomenclature**        | Lineage and variant naming systems for viral pathogens                                                                                                                 | Genomic variant/lineage classification (disease-dependent: Pango for SARS-like viruses; WOAH/FAO serotype-clade systems for FMDV, avian influenza, etc.)                  | cov-lineages.org                                                             |
| **EDAM**                            | Bioinformatics ontology for data, operations and file formats                                                                                                          | Sequencing/bioinformatics file formats (FASTQ, BAM, VCF)                                                                                                                  | edamontology.org                                                             |
| **OSM**                             | OpenStreetMap tagging scheme                                                                                                                                           | Water-body / wetland feature classification                                                                                                                               | wiki.openstreetmap.org/wiki/Map_features                                     |
| **Ramsar / National Wetland Atlas** | Ramsar Convention Wetland Classification System; India National Wetland Atlas (ISRO-SAC)                                                                               | Wetland type classification                                                                                                                                               | ramsar.org                                                                   |

# 5\. Field-Level Standards Mapping

Grouped by database table. Only fields carrying epidemiological, clinical, geographic, or measurement meaning are listed; pure database plumbing (IDs, foreign keys, audit timestamps) is omitted-see Section 2\.

| Mandatory | Recommended | Optional |
| :-------- | :---------- | :------- |

## Animal / Host Metadata

| Field                                        | Tier            | Standard / Ontology Applied                                                                                                                                                                                                                                                                                                                                           |
| :------------------------------------------- | :-------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **animalTagId**                              | **Mandatory**   | NDLM / Bharat Pashudhan App \- 12-digit barcoded ear tag ID ('Pashu Aadhaar') issued under the Dept. of Animal Husbandry & Dairying (DAHD) National Digital Livestock Mission; currently covers bovines & small ruminants. WOAH animal identification & traceability guidance (Terrestrial Code Ch.4.2) as the international backing standard./ ICAR naming standards |
| **birdId**                                   | **Mandatory**   | WOAH animal identification & traceability guidance (Terrestrial Code Ch.4.2). NOTE: NDLM/Bharat Pashudhan's 12-digit Pashu Aadhaar ear-tag scheme currently covers bovines & small ruminants only \- poultry are NOT yet covered, so no national ID standard applies here yet.                                                                                        |
| **species_id**                               | **Mandatory**   | WOAH host-species terminology                                                                                                                                                                                                                                                                                                                                         |
| **breed**                                    | **Recommended** | ICAR-NBAGR (National Bureau of Animal Genetic Resources) Registered Breeds database \- the nodal Government of India breed registry that Bharat Pashudhan/NDLM draws its breed picklist from; FAO DAD-IS as the international cross-reference for non-Indian/global breed nomenclature.                                                                               |
| **ageYears**                                 | **Recommended** | PHA4GE GENEPIO 'host age' field pattern (value \+ unit)                                                                                                                                                                                                                                                                                                               |
| **ageMonths**                                | **Recommended** | PHA4GE GENEPIO 'host age' field pattern (value \+ unit)                                                                                                                                                                                                                                                                                                               |
| **gender**                                   | **Recommended** | PATO (Phenotype And Trait Ontology) biological-sex terms (PATO:0000384 male / PATO:0000383 female)                                                                                                                                                                                                                                                                    |
| **vaccinationStage**                         | **Mandatory**   | NDLM / Bharat Pashudhan App vaccination recording standard (captures vaccination events \- e.g. FMD under the National Animal Disease Control Programme \- against the animal's ear-tag ID); WOAH vaccination-status terminology (Terrestrial Code Ch.1.4/4.18: vaccinated/unvaccinated/unknown) as the international backing standard                                |
| **diseaseHistory**                           | **Recommended** | WOAH-listed disease names (align to diseases.code) / ICTV pathogen nomenclature                                                                                                                                                                                                                                                                                       |
| **averageMilkProductionPerDayWithinOneYear** | **Optional**    | UCUM unit code (e.g. L/d)                                                                                                                                                                                                                                                                                                                                             |
| **averageMilkProductionPerDayBeforeOneYear** | **Optional**    | UCUM unit code (e.g. L/d)                                                                                                                                                                                                                                                                                                                                             |
| **feverObserved**                            | **Mandatory**   | SNOMED CT clinical finding (Fever, 386661006\) as the underlying concept; WOAH clinical-signs terminology                                                                                                                                                                                                                                                             |
| **firstNoticedDate**                         | **Recommended** | ISO 8601 (date/time format standard); corresponds to PHA4GE/WOAH 'date of symptom onset'                                                                                                                                                                                                                                                                              |
| **vectors**                                  | **Recommended** | WOAH/FAO vector-surveillance terminology                                                                                                                                                                                                                                                                                                                              |
| **dropInFeedIntake**                         | **Optional**    | WOAH clinical/production-impact sign terminology (Terrestrial Manual)                                                                                                                                                                                                                                                                                                 |
| **dropInWaterIntake**                        | **Optional**    | WOAH clinical/production-impact sign terminology (Terrestrial Manual)                                                                                                                                                                                                                                                                                                 |
| **dropInEggProduction**                      | **Optional**    | WOAH clinical/production-impact sign terminology (Terrestrial Manual)                                                                                                                                                                                                                                                                                                 |
| **createdAt**                                | **Optional**    | ISO 8601 (date/time format standard)-system audit timestamp                                                                                                                                                                                                                                                                                                           |
| **updatedAt**                                | **Optional**    | ISO 8601 (date/time format standard)-system audit timestamp                                                                                                                                                                                                                                                                                                           |

## Species

| Field         | Tier          | Standard / Ontology Applied                                                          |
| :------------ | :------------ | :----------------------------------------------------------------------------------- |
| **name**      | **Mandatory** | NCBITaxon (NCBI Taxonomy); ITIS as an alternative; WOAH host-species terminology     |
| **createdAt** | **Optional**  | ISO 8601 (date/time format standard) (system audit timestamp, not a domain ontology) |
| **updatedAt** | **Optional**  | ISO 8601 (date/time format standard) (system audit timestamp, not a domain ontology) |

## Diseases

| Field         | Tier            | Standard / Ontology Applied                                                                                             |
| :------------ | :-------------- | :---------------------------------------------------------------------------------------------------------------------- |
| **code**      | **Mandatory**   | WOAH-listed disease code / ICTV pathogen taxonomy (align to WOAH Terrestrial & Aquatic Animal Health Code disease list) |
| **name**      | **Mandatory**   | WOAH-listed disease nomenclature; ICTV virus taxonomy for viral pathogens; PHA4GE GENEPIO 'causative agent' field       |
| **shortName** | **Recommended** | WOAH-listed disease abbreviation convention (e.g. FMD, LSD, AI) \- no single formal code list                           |
| **createdAt** | **Optional**    | ISO 8601 (date/time format standard) (system audit timestamp, not a domain ontology)                                    |
| **updatedAt** | **Optional**    | ISO 8601 (date/time format standard) (system audit timestamp, not a domain ontology)                                    |

## Sample Types

| Field                 | Tier            | Standard / Ontology Applied                                                                                                                                                                                         |
| :-------------------- | :-------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **name**              | **Mandatory**   | UBERON (for anatomical/clinical specimen sources-blood, tissue, swabs from a body site, feces, etc.) and ENVO (for environmental specimen sources-water, soil, litter, sediment, and other environmental matrices). |
| **diseaseShortNames** | **Recommended** | WOAH-listed disease abbreviations (align to diseases.shortName / diseases.code)                                                                                                                                     |
| **createdAt**         | **Optional**    | ISO 8601 (date/time format standard) (system audit timestamp, not a domain ontology)                                                                                                                                |
| **updatedAt**         | **Optional**    | ISO 8601 (date/time format standard) (system audit timestamp, not a domain ontology)                                                                                                                                |

##

##

## Samples

| Field                               | Tier            | Standard / Ontology Applied                                                                           |
| :---------------------------------- | :-------------- | :---------------------------------------------------------------------------------------------------- |
| **sampleCode**                      | **Mandatory**   | PHA4GE GENEPIO 'specimen collector sample ID' (GENEPIO:0001123) naming guidance                       |
| **collectedAt**                     | **Mandatory**   | ISO 8601 (date/time format standard); PHA4GE 'sample collection date/time'                            |
| **speciesId**                       | **Mandatory**   | NCBITaxon (NCBI Taxonomy)                                                                             |
| **quantity**                        | **Recommended** | UCUM/UO units-of-measure ontology \- pair with the 'unit' column below rather than a free-text unit   |
| **unit**                            | **Recommended** | UCUM (Unified Code for Units of Measure)                                                              |
| **habitat**                         | **Recommended** | ENVO (Environment Ontology)                                                                           |
| **conc**                            | **Optional**    | UCUM unit code (e.g. ng/uL)                                                                           |
| **rejectedAt**                      | **Optional**    | ISO 8601 (date/time format standard)                                                                  |
| **receivedAt**                      | **Recommended** | ISO 8601 (date/time format standard); PHA4GE 'sample received date'                                   |
| **receivedVolumeValue**             | **Optional**    | PHA4GE 'received specimen volume' field pattern                                                       |
| **receivedVolumeUnit**              | **Optional**    | UCUM (Unified Code for Units of Measure)                                                              |
| **receivedStorageTemperature**      | **Optional**    | UCUM unit Cel (degree Celsius)                                                                        |
| **accessionId**                     | **Recommended** | PHA4GE GENEPIO sample-accession field pattern; INSDC accession format if submitted externally         |
| **extractionDateTime**              | **Optional**    | ISO 8601 (date/time format standard)                                                                  |
| **extractionSampleUsedValue**       | **Optional**    | UCUM (Unified Code for Units of Measure)                                                              |
| **extractionSampleUsedUnit**        | **Optional**    | UCUM (Unified Code for Units of Measure)                                                              |
| **extractionSampleRemainingValue**  | **Optional**    | UCUM (Unified Code for Units of Measure)                                                              |
| **extractionSampleRemainingUnit**   | **Optional**    | UCUM (Unified Code for Units of Measure)                                                              |
| **preprocessingSteps**              | **Recommended** | PHA4GE GENEPIO 'specimen processing' / 'specimen processing details' fields                           |
| **preprocessingDate**               | **Optional**    | ISO 8601 (date/time format standard)                                                                  |
| **preprocessingStorageTemperature** | **Optional**    | UCUM unit Cel (degree Celsius)                                                                        |
| **collectionTime**                  | **Optional**    | ISO 8601 (date/time format standard)                                                                  |
| **testedAt**                        | **Recommended** | ISO 8601 (date/time format standard)                                                                  |
| **reportGeneratedAt**               | **Optional**    | ISO 8601 (date/time format standard)                                                                  |
| **replicates**                      | **Optional**    | PHA4GE GENEPIO 'experimental specimen role type' (primary specimen / replicate / subsample)           |
| **barcode**                         | **Mandatory**   | PHA4GE GENEPIO 'specimen collector sample ID' (GENEPIO:0001123)-unique specimen identifier convention |
| **createdAt**                       | **Optional**    | ISO 8601 (date/time format standard) (system audit timestamp, not a domain ontology)                  |
| **updatedAt**                       | **Optional**    | ISO 8601 (date/time format standard) (system audit timestamp, not a domain ontology)                  |

## Laboratory Tests

| Field             | Tier            | Standard / Ontology Applied                                                                                                     |
| :---------------- | :-------------- | :------------------------------------------------------------------------------------------------------------------------------ |
| **ctValue**       | **Recommended** | WOAH Manual of Diagnostic Tests 'Ct value' field pattern \- store as numeric value \+ UCUM/UO unit (cycle count),               |
| **variant**       | **Recommended** | WHO variant naming (SARS-CoV-2-type pathogens) or WOAH/FAO serotype nomenclature (e.g. FMDV O/A/Asia-1, H5Nx clade system)      |
| **viralLoad**     | **Optional**    | UCUM unit code (e.g. copies/mL)                                                                                                 |
| **kitOrProtocol** | **Mandatory**   | WOAH Manual of Diagnostic Tests and Vaccines \- validated test/protocol naming                                                  |
| **resultDate**    | **Mandatory**   | ISO 8601 (date/time format standard)                                                                                            |
| **testedAt**      | **Recommended** | ISO 8601 (date/time format standard)                                                                                            |
| **testResult**    | **Mandatory**   | LOINC answer list / SNOMED CT (Positive 10828004, Negative 260385009, Inconclusive 419984006); WOAH standard result terminology |
| **createdAt**     | **Optional**    | ISO 8601 (date/time format standard) (system audit timestamp, not a domain ontology)                                            |
| **updatedAt**     | **Optional**    | ISO 8601 (date/time format standard) (system audit timestamp, not a domain ontology)                                            |

## Sequencing Submissions

| Field                 | Tier            | Standard / Ontology Applied                                                                                                |
| :-------------------- | :-------------- | :------------------------------------------------------------------------------------------------------------------------- |
| **disease_name**      | **Mandatory**   | WOAH-listed disease name (denormalized; should trace back to diseases.code)                                                |
| **file_format**       | **Optional**    | EDAM ontology (bioinformatics file-format terms, e.g. FASTQ, BAM, VCF)                                                     |
| **library_type**      | **Recommended** | INSDC/ENA library strategy & layout-controlled vocabulary                                                                  |
| **platform**          | **Recommended** | INSDC/ENA sequencing-platform controlled vocabulary (e.g. Illumina, Oxford Nanopore); PHA4GE 'sequencing instrument' field |
| **sequencing_method** | **Recommended** | PHA4GE 'sequencing assay type' (WGS/amplicon/metagenomic) controlled vocabulary                                            |
| **ncbi_accession**    | **Optional**    | INSDC accession format (GenBank/ENA/DDBJ, or SRA/BioSample as applicable)                                                  |
| **ncbi_organism**     | **Recommended** | NCBITaxon (NCBI Taxonomy)                                                                                                  |
| **submission_date**   | **Optional**    | ISO 8601 (date/time format standard)                                                                                       |
| **created_at**        | **Optional**    | ISO 8601 (date/time format standard) (system audit timestamp, not a domain ontology)                                       |
| **updated_at**        | **Optional**    | ISO 8601 (date/time format standard) (system audit timestamp, not a domain ontology)                                       |

## Sequencing Jobs

| Field          | Tier         | Standard / Ontology Applied                                                          |
| :------------- | :----------- | :----------------------------------------------------------------------------------- |
| **created_at** | **Optional** | ISO 8601 (date/time format standard) (system audit timestamp, not a domain ontology) |
| **updated_at** | **Optional** | ISO 8601 (date/time format standard) (system audit timestamp, not a domain ontology) |

## Sites

| Field                          | Tier            | Standard / Ontology Applied                                                                                                  |
| :----------------------------- | :-------------- | :--------------------------------------------------------------------------------------------------------------------------- |
| **collectionTime**             | **Optional**    | ISO 8601 (date/time format standard)                                                                                         |
| **collectionStartDate**        | **Optional**    | ISO 8601 (date/time format standard)                                                                                         |
| **collectionLastScheduleDate** | **Optional**    | ISO 8601 (date/time format standard)                                                                                         |
| **collectionExpiryDate**       | **Optional**    | ISO 8601 (date/time format standard)                                                                                         |
| **farmType**                   | **Recommended** | WOAH poultry/livestock production-system classification (Terrestrial Manual)                                                 |
| **siteSubType**                | **Optional**    | WOAH poultry/livestock production-system classification (commercial/backyard/broiler/layer)                                  |
| **siteType**                   | **Mandatory**   | WOAH surveillance-premises classification (farm/market/slaughterhouse/wildlife) \+ PHA4GE GENEPIO 'environmental site' terms |
| **address**                    | **Mandatory**   | LGD (India Local Government Directory)                                                                                       |
| **pinCode**                    | **Recommended** | India Dept. of Posts PIN Code Directory                                                                                      |
| **block**                      | **Recommended** | LGD (India Local Government Directory)                                                                                       |
| **village**                    | **Recommended** | LGD (India Local Government Directory)                                                                                       |
| **testResult**                 | **Recommended** | LOINC answer list / SNOMED CT (Positive/Negative/Inconclusive) \- site-level rollup of lab_tests.testResult                  |
| **createdAt**                  | **Optional**    | ISO 8601 (date/time format standard) (system audit timestamp)                                                                |
| **updatedAt**                  | **Optional**    | ISO 8601 (date/time format standard) (system audit timestamp)                                                                |

## Site Types

| Field         | Tier         | Standard / Ontology Applied                                                          |
| :------------ | :----------- | :----------------------------------------------------------------------------------- |
| **createdAt** | **Optional** | ISO 8601 (date/time format standard) (system audit timestamp, not a domain ontology) |
| **updatedAt** | **Optional** | ISO 8601 (date/time format standard) (system audit timestamp, not a domain ontology) |

## Locations

| Field           | Tier            | Standard / Ontology Applied                                                          |
| :-------------- | :-------------- | :----------------------------------------------------------------------------------- |
| **regionId**    | **Mandatory**   | PHA4GE, need to check for country, state and disttrict whether its different fields  |
| **coordinates** | **Recommended** | WGS84 / EPSG:4326 (ISO 6709 geographic coordinate reference system)                  |
| **createdAt**   | **Optional**    | ISO 8601 (date/time format standard) (system audit timestamp, not a domain ontology) |
| **updatedAt**   | **Optional**    | ISO 8601 (date/time format standard) (system audit timestamp, not a domain ontology) |

## Regions (Administrative Geography)

| Field          | Tier          | Standard / Ontology Applied                                                                                                                                                                                                                    |
| :------------- | :------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **regionType** | **Mandatory** | LGD administrative hierarchy levels (country/state/district/subdistrict/village); ISO 3166-2:IN for state-level codes                                                                                                                          |
| **lgdCode**    | **Mandatory** | LGD (India Local Government Directory, Ministry of Panchayati Raj) \- already correctly referenced; this is also the geography hierarchy NDLM/Bharat Pashudhan itself uses for farmer/animal location, so no conflict between the two systems. |
| **createdAt**  | **Optional**  | ISO 8601 (date/time format standard) (system audit timestamp, not a domain ontology)                                                                                                                                                           |
| **updatedAt**  | **Optional**  | ISO 8601 (date/time format standard) (system audit timestamp, not a domain ontology)                                                                                                                                                           |

## Visits

| Field                              | Tier            | Standard / Ontology Applied                                                                                                                                                 |
| :--------------------------------- | :-------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **visitedAt**                      | **Mandatory**   | ISO 8601 (date/time format standard); PHA4GE 'sample collection date'                                                                                                       |
| **visitStartedAt**                 | **Optional**    | ISO 8601 (date/time format standard)                                                                                                                                        |
| **visitScheduledAt**               | **Optional**    | ISO 8601 (date/time format standard)                                                                                                                                        |
| **suspectedPositives**             | **Mandatory**   | WOAH case-classification terminology (suspect/probable/confirmed/negative \- Terrestrial Code Ch.1.4)                                                                       |
| **diseaseQuestionnaireData**       | **Recommended** | Structured against PHA4GE GENEPIO case/exposure questionnaire fields (clinical signs, vaccination status, movement/contact history) rather than unstructured free-form JSON |
| **environmentalQuestionnaireData** | **Recommended** | Structured against PHA4GE GENEPIO environmental/exposure fields (ENVO habitat terms, weather, water-body context) rather than unstructured free-form JSON                   |
| **completedAtCoordinates**         | **Recommended** | WGS84 / EPSG:4326 (ISO 6709 geographic coordinate reference system)                                                                                                         |
| **createdAt**                      | **Optional**    | ISO 8601 (date/time format standard) (system audit timestamp, not a domain ontology)                                                                                        |
| **updatedAt**                      | **Optional**    | ISO 8601 (date/time format standard) (system audit timestamp, not a domain ontology)                                                                                        |

##

## Surveillance Types

| Field         | Tier          | Standard / Ontology Applied                                                                             |
| :------------ | :------------ | :------------------------------------------------------------------------------------------------------ |
| **name**      | **Mandatory** | WOAH surveillance-system classification (active/passive/sentinel/risk-based \- Terrestrial Code Ch.1.4) |
| **createdAt** | **Optional**  | ISO 8601 (date/time format standard) (system audit timestamp, not a domain ontology)                    |
| **updatedAt** | **Optional**  | ISO 8601 (date/time format standard) (system audit timestamp, not a domain ontology)                    |

## Water Boundaries (Environmental)

| Field         | Tier         | Standard / Ontology Applied                                                            |
| :------------ | :----------- | :------------------------------------------------------------------------------------- |
| **osmId**     | **Optional** | OpenStreetMap (OSM) feature identifier scheme                                          |
| **code**      | **Optional** | OpenStreetMap (OSM) 'natural=water' feature classification code                        |
| **fclass**    | **Optional** | OpenStreetMap (OSM) feature-class tagging scheme                                       |
| **geometry**  | **Optional** | WGS84 / EPSG:4326 (ISO 6709 geographic coordinate reference system) (PostGIS geometry) |
| **createdAt** | **Optional** | ISO 8601 (date/time format standard) (system audit timestamp, not a domain ontology)   |
| **updatedAt** | **Optional** | ISO 8601 (date/time format standard) (system audit timestamp, not a domain ontology)   |

## Wetlands (Environmental)

| Field                      | Tier         | Standard / Ontology Applied                                                                            |
| :------------------------- | :----------- | :----------------------------------------------------------------------------------------------------- |
| **state**                  | **Optional** | LGD (India Local Government Directory)                                                                 |
| **district**               | **Optional** | LGD (India Local Government Directory)                                                                 |
| **longitude**              | **Optional** | WGS84 / EPSG:4326 (ISO 6709 geographic coordinate reference system)                                    |
| **latitude**               | **Optional** | WGS84 / EPSG:4326 (ISO 6709 geographic coordinate reference system)                                    |
| **wetlandTypeCode**        | **Optional** | Ramsar Convention Wetland Classification System, or India National Wetland Atlas (ISRO-SAC) type codes |
| **wetlandTypeDescription** | **Optional** | Ramsar Wetland Classification System / India National Wetland Atlas (ISRO-SAC) terminology             |
| **areaHa**                 | **Optional** | UCUM unit 'ha' (hectare) \- unit is implicit in the column name rather than a coded field              |
| **createdAt**              | **Optional** | ISO 8601 (date/time format standard) (system audit timestamp, not a domain ontology)                   |
| **updatedAt**              | **Optional** | ISO 8601 (date/time format standard) (system audit timestamp, not a domain ontology)                   |

##

## Poultry Farms (External Directory)

| Field         | Tier         | Standard / Ontology Applied                                                          |
| :------------ | :----------- | :----------------------------------------------------------------------------------- |
| **latitude**  | **Optional** | WGS84 / EPSG:4326 (ISO 6709 geographic coordinate reference system)                  |
| **longitude** | **Optional** | WGS84 / EPSG:4326 (ISO 6709 geographic coordinate reference system)                  |
| **country**   | **Optional** | ISO 3166-1 (country codes) / LGD (India Local Government Directory)                  |
| **state**     | **Optional** | LGD (India Local Government Directory) state code / ISO 3166-2:IN                    |
| **city**      | **Optional** | LGD (India Local Government Directory) sub-district/city code                        |
| **zip**       | **Optional** | India Dept. of Posts PIN Code Directory                                              |
| **createdAt** | **Optional** | ISO 8601 (date/time format standard) (system audit timestamp, not a domain ontology) |
| **updatedAt** | **Optional** | ISO 8601 (date/time format standard) (system audit timestamp, not a domain ontology) |

# 6\. Governance & Review

- This document is reviewed on the cadence stated in Document Control, and immediately upon any revision by a referenced standards body that affects a mapped field.

- Changes to a field's tier or applied standard must be approved by the Document Owner and recorded in Version History.

- Deliberate divergence from a source standard's own field mapping-for example, using PATO rather than PHA4GE's NCIT-based "host gender" field, because the subject is an animal, not a human patient-is documented inline in the relevant Section 5 entry rather than silently overridden.

- Where a Mandatory field's applied standard changes in a way that affects already-collected data (e.g. a WOAH disease-list revision, or NDLM extending ear-tag coverage to a new species), a migration note should be added here and the affected historical records flagged for review.
