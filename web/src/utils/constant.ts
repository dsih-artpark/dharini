import { Sample } from "@/src/types/sample";

export type SiteTypeOption = {
  value: string;
  label: string;
  subTypes?: { value: string; label: string }[];
};

export const DISEASE_SITE_CONFIG: Record<string, SiteTypeOption[]> = {
  AI: [
    {
      value: "poultry_farm",
      label: "Poultry Farm",
      subTypes: [
        { value: "broiler", label: "Broiler" },
        { value: "breeder", label: "Breeder" },
        { value: "layer", label: "Layer" },
        { value: "backyard", label: "Backyard" },
      ],
    },
    { value: "wetland", label: "Wetland" },
    { value: "slaughter_house", label: "Slaughter House" },
    { value: "zoo", label: "Zoo" },
    { value: "sewage", label: "Sewage" },
    { value: "live_bird_market", label: "Live Bird Market" },
    { value: "rescue_center", label: "Rescue Center" },
    { value: "wildlife_sanctuary", label: "Wildlife Sanctuary" },
  ],
  FMD: [
    { value: "cattle_farm", label: "Cattle Farm" },
    { value: "cattle_market", label: "Cattle Market" },
    { value: "buffalo_farm", label: "Buffalo Farm" },
    { value: "slaughter_house", label: "Slaughter House" },
    { value: "bmcc", label: "BMCC" },
  ],
  LSD: [
    { value: "cattle_farm", label: "Cattle Farm" },
    { value: "cattle_market", label: "Cattle Market" },
    { value: "buffalo_farm", label: "Buffalo Farm" },
    { value: "slaughter_house", label: "Slaughter House" },
    { value: "bmcc", label: "BMCC" },
  ],
};

export const SITE_TYPES = ["private", "government", "corporate"];

export const DISEASE_COLOR_CODE = {
  BG_COLOR: [
    "bg-blue-20",
    "bg-teal-20",
    "bg-purple-10",
    "bg-orange-20",
    "bg-yellow-20",
    "bg-green-10",
    "bg-olive-20",
  ],
  CHART_COLOR: [
    "bg-blue-30",
    "bg-teal-30",
    "bg-purple-20",
    "bg-orange-30",
    "bg-yellow-20",
    "bg-green-20",
    "bg-olive-20",
  ],
  COLOR_HEX: [
    "#CDD6EF",
    "#AEE0E1",
    "#E7D2F7",
    "#F6C398",
    "#FDD591",
    "#E9F4E8",
    "#B6E88C",
  ],
};

export const SAMPLE_VOLUME_UNIT = "ml";

export const SAMPLE_UNITS = [
  { value: "L", label: "L (litre)" },
  { value: "mL", label: "mL (millilitre)" },
  { value: "µL", label: "µL (microlitre)" },
  { value: "g", label: "g (gram)" },
  { value: "mg", label: "mg (milligram)" },
  { value: "µg", label: "µg (microgram)" },
  { value: "pcs", label: "pcs (pieces)" },
];

export const LAB_TEST_RESULT = ["positive", "negative", "unclear"];

// Pre-processing method options
export const HOMOGENISATION_METHODS = [
  { value: "bead-beating", label: "Bead Beating" },
  { value: "vortex-mixing", label: "Vortex Mixing" },
  { value: "mechanical-disruption", label: "Mechanical Disruption" },
  { value: "enzymatic-digestion", label: "Enzymatic Digestion" },
  { value: "sonication", label: "Sonication" },
  { value: "other", label: "Other" },
];

export const FILTRATION_METHODS = [
  { value: "0.22um-syringe", label: "0.22 µm Syringe Filter" },
  { value: "0.45um-syringe", label: "0.45 µm Syringe Filter" },
  { value: "vacuum-filtration", label: "Vacuum Filtration" },
  { value: "centrifugal-filter", label: "Centrifugal Filter" },
  { value: "gravity-filtration", label: "Gravity Filtration" },
  { value: "other", label: "Other" },
];

export const ALIQUOTING_METHODS = [
  { value: "manual-pipetting", label: "Manual Pipetting" },
  { value: "automated-liquid-handler", label: "Automated Liquid Handler" },
  { value: "multi-channel-pipette", label: "Multi-Channel Pipette" },
  { value: "other", label: "Other" },
];

// Extraction options
export const NUCLEIC_ACID_TYPES = [
  { value: "dna", label: "DNA" },
  { value: "rna", label: "RNA" },
  { value: "both", label: "Both DNA & RNA" },
];

export const EXTRACTION_METHODS = [
  { value: "other", label: "Add your kit" },
  { value: "qiagen-dneasy", label: "QIAgen DNeasy" },
  { value: "qiagen-rneasy", label: "QIAgen RNeasy" },
  { value: "promega-maxwell", label: "Promega Maxwell" },
  { value: "thermo-purelink", label: "Thermo PureLink" },
  { value: "zymo-quick-dna-rna", label: "Zymo Quick-DNA/RNA" },
  { value: "manual-phenol-chloroform", label: "Manual Phenol-Chloroform" },
];

export const STORAGE_TEMPERATURES = [
  { value: "room-temp", label: "Room Temperature (15-25°C)" },
  { value: "4c", label: "Refrigerated (2-8°C)" },
  { value: "-20c", label: "Frozen (-20°C)" },
  { value: "-80c", label: "Ultra-low (-80°C)" },
  { value: "liquid-nitrogen", label: "Liquid Nitrogen (-196°C)" },
];

export const DISEASE_BADGE_COLORS: Record<string, string> = {
  AI: "bg-orange-50 text-orange-600 border-orange-200",
  FMD: "bg-purple-50 text-purple-600 border-purple-200",
  LSD: "bg-sky-50 text-sky-600 border-sky-200",
};

// Use this mapping to show replaced status
export const SAMPLE_STATUS_MAPPING = {
  "picked-up": "collected",
  "virus-isolation": "virus isolation",
  "test-report-generated": "report generated",
};

// To get the last activity date for sample based on the sample-status
export const SAMPLE_STATUS_TO_LAB_ACTIVITY_DATE_MAP: {
  [key in string | ""]: keyof Partial<Sample>;
} = {
  "picked-up": "collectionTime",
  received: "receivedAt",
  "pre-processed": "preprocessingDate",
  "virus-isolation": "updatedAt",
  rejected: "rejectedAt",
  extracted: "extractionDateTime",
  tested: "testedAt",
  "test-report-generated": "reportGeneratedAt",
  "": "updatedAt",
};

export const OTHERS_OPTION = "__others__";

export const NON_BULK_PROCESSABLE_STATUSES = [
  "rejected",
  "test-report-generated",
];

export const SELECT_ALL_STATUSES = [
  "picked-up",
  "received",
  "pre-processed",
  "virus-isolation",
  "extracted",
  "tested",
];

export const H_GENE_OPTIONS = [
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "H7",
  "H8",
  "H9",
  "H10",
  "H11",
  "H12",
  "H13",
  "H14",
  "H15",
  "H16",
  "H17",
  "H18",
  "H19",
  "Inf A",
  "NDV",
];
export const N_GENE_OPTIONS = [
  "N1",
  "N2",
  "N3",
  "N4",
  "N5",
  "N6",
  "N7",
  "N8",
  "N9",
  "N10",
  "N11",
  "Inf A",
  "NDV",
];
export const GENE_OPTIONS = [
  ...new Set([...H_GENE_OPTIONS, ...N_GENE_OPTIONS]),
].sort();

export const SCREENING_TARGET_OPTIONS = [
  { label: "M-gene", value: "M-gene" },
  { label: "HA", value: "HA" },
  { label: "NA", value: "NA" },
  { label: "NP", value: "NP" },
];
