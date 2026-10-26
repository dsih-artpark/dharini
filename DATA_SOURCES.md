# Data Sources

Dharini's code is licensed under the [Apache License 2.0](LICENSE). The
datasets in this repository are **not** covered by that licence: each keeps the
licence of its source, listed below. Software, fonts, images and online services
are listed separately in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

Last reviewed: 2026-10-21.

## Summary

| Dataset                                         | File                                                          | Source                                                     | Licence                                       |
| ----------------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------- | --------------------------------------------- |
| [Water bodies of India](#water-bodies-of-india) | `backend/src/seeder/data/india_natural_water_only.geojson.gz` | OpenStreetMap                                              | ODbL-1.0                                      |
| [States and districts](#states-and-districts)   | `backend/regions.sql`                                         | Local Government Directory, Government of India            | Free reuse with credit (LGD copyright policy) |
| [Wetland inventory](#wetland-inventory)         | `backend/src/seeder/data/wetlands_merged.csv.gz`              | National Wetland Inventory and Assessment, MoEFCC and ISRO | Free reuse with credit (portal terms)         |
| [India state outlines](#india-state-outlines)   | `web/public/maps/india.geojson`                               | SimpleMaps                                                 | CC-BY-4.0                                     |

Two map layers ship without data; see
[Layers you supply yourself](#layers-you-supply-yourself).

---

## Water bodies of India

- **File:** `backend/src/seeder/data/india_natural_water_only.geojson.gz`
- **Contents:** 304,861 outlines of water bodies (lakes, ponds, reservoirs,
  river banks), wetlands and glaciers in India
- **Source:** [OpenStreetMap](https://www.openstreetmap.org), via the
  [Geofabrik](https://download.geofabrik.de/asia/india.html) India extract
  (shapefile download, water areas layer `gis_osm_water_a_free_1`)
- **Retrieved:** May 2026
- **Licence:** [Open Database License 1.0](https://opendatacommons.org/licenses/odbl/1-0/)
  (ODbL-1.0)
- **Required credit:** "© OpenStreetMap contributors". The GeoLens map shows it
  whenever the layer is visible
- **Changes made:** converted to GeoJSON; compressed
- **Used by:** the GeoLens water and wetland outline layer, loaded into the
  database by the seeder
- **Personal data:** none
- **Share-alike:** ODbL requires that improved versions of this data that we
  publish are also offered under ODbL

## States and districts

- **File:** `backend/regions.sql`
- **Contents:** India, its 36 states and union territories and 784 districts,
  with Local Government Directory (LGD) codes and the country, state and
  district hierarchy
- **Source:** [Local Government Directory](https://lgdirectory.gov.in),
  Ministry of Panchayati Raj, Government of India: the "All States of India"
  and "All Districts of India" Excel reports from the
  [Download Directory](https://lgdirectory.gov.in/downloadDirectory.do)
- **Retrieved:** 21 October 2026
- **Licence:** the LGD
  [copyright policy](https://lgdirectory.gov.in/copyRightPolicy.do) allows its
  material to be reproduced free of charge in any format, if it is reproduced
  accurately, is not used in a derogatory or misleading context and the source
  is prominently acknowledged. This is not a standard open data licence. It
  does not cover material the site marks as third-party copyright. The
  [terms and conditions](https://lgdirectory.gov.in/termsconditions.do) add
  that the content is not a statement of law and that the Ministry is not
  liable for its use
- **Required credit:** "Source: Local Government Directory, Ministry of
  Panchayati Raj, Government of India (lgdirectory.gov.in)"
- **Changes made:** converted from Excel to SQL. A state's local-language name
  is the one in LGD's states report. LGD's districts report has no
  local-language name, so a district's local name is its English name
- **Used by:** location pickers, filters and reports; the backend loads it
  into an empty `regions` table at startup
- **Personal data:** none

---

## Wetland inventory

- **File:** `backend/src/seeder/data/wetlands_merged.csv.gz`
- **Contents:** 220,095 wetlands in 37 states and union territories: district,
  centre coordinates, wetland type, area in hectares, name (where known) and
  whether the wetland was present in 2006-07 and 2017-18
- **Source:** National Wetland Inventory and Assessment (NWIA) 2017-18, mapped
  by the Space Applications Centre (SAC), Indian Space Research Organisation
  (ISRO), from Resourcesat-2/2A LISS-III satellite data, and published by the
  Ministry of Environment, Forest and Climate Change (MoEFCC) on the
  [Wetlands of India Portal](https://indianwetlands.in/resources-and-e-learning/national-wetland-inventory-assessment/)
  as the
  [Wetlands 2017-18 inventory list (PDF)](https://indianwetlands.in/uploads/Wetlands201718_inventory%20list_moef.pdf)
- **Retrieved:** May 2026, as state-wise files. The page each file came from
  was not recorded. On 21 October 2026 the whole file was checked against the
  published PDF list: both have the same 220,095 records, numbered 1 to 220,095
- **Licence:** the portal's
  [copyright policy](https://indianwetlands.in/copyright-policy/) and
  [terms and conditions](https://indianwetlands.in/terms-and-conditions/) allow
  its material to be reproduced free of charge in any format, if it is
  reproduced accurately, is not used in a derogatory or misleading context and
  the source is prominently acknowledged. This is not a standard open data
  licence. It does not cover material the portal marks as third-party
  copyright
- **Required credit:** "Source: Ministry of Environment, Forest and Climate
  Change, Government of India, Wetlands of India Portal (indianwetlands.in).
  National Wetland Inventory and Assessment, Space Applications Centre, ISRO"
- **Changes made:** state-wise files merged into one, "&" in state names
  written as "AND", compressed. After the check against the PDF, values that
  differed were set to the PDF's: 259 longitudes, 184 latitudes, 1,318 areas
  and 1 wetland type code (for example, 44 coordinates that had lost their
  decimal point), and district names that were cut off or garbled were
  replaced by the PDF's full names. The 2006-07 to 2017-18 status matched
  the PDF wherever the PDF could be read and was left as it was. Wetland names
  are as in the original files and were not checked against the PDF. Two rows
  whose name had slipped into the area column were restored
- **Used by:** the GeoLens wetland points and the nearest-wetland search, loaded
  into the database by the seeder
- **Personal data:** none

---

## India state outlines

- **File:** `web/public/maps/india.geojson`
- **Contents:** outlines of India's 36 states and union territories
- **Source:** [SimpleMaps](https://simplemaps.com/gis/country/in) free India
  GIS file (GeoJSON). "GIS Files Copyright 2024 Pareto Software, LLC"
- **Retrieved:** February 2026
- **Licence:** [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/)
  (CC-BY-4.0)
- **Required credit:** "simplemaps.com", with a link. The GeoLens map shows it
  with the state borders
- **Changes made:** removed the `source` property from each feature
- **Used by:** the state borders on the GeoLens map
- **Personal data:** none
- **Boundaries:** follow India's official map. Some state names are outdated
  ("Orissa", "Uttaranchal")

## Layers you supply yourself

Dharini and its Docker images do not include poultry farm or livestock market
lists. To show these layers, put your own files in the
[`geolens-data`](geolens-data/README.md) folder; the README there has the steps.
Use data you have the right to use, and leave phone numbers and email addresses
empty unless you have a lawful basis to store them.

| Layer             | File name                            | Columns, in order                                                                                                                            | Table                |
| ----------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| Poultry farms     | `list-of-poultry-farms-in-india.csv` | `name`, `address`, `phone`, `email`, `lat`, `lng`, `url`, `rating_count`, `star_count`, `country`, `state`, `city`, `zip`                    | `bio_poultry_farms`  |
| Livestock markets | `cattle-market.csv`                  | `market_name`, `operating_day`, `latitude`, `longitude`, `lgd_district`, `district`, `lgd_state`, `state`, and optionally `remark` (ignored) | `bio_cattle_markets` |

---

## Adding data to this repository

- **Record every dataset here**, in the same pull request that adds it.
- **Public is not the same as free to republish.** The source's licence or
  terms decide. Data that is purchased, or copied from Google Maps or similar
  services, normally cannot be republished.
- **Do not add personal data**, such as the names, phone numbers or email
  addresses of individuals.
- **Prefer open data licences** accepted by the Digital Public Goods Alliance:
  CC0-1.0, PDDL-1.0, CC-BY-4.0, CC-BY-SA-4.0, ODC-By-1.0 and ODbL-1.0.
