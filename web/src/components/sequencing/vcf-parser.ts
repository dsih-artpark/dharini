import type { SequencingVariant } from "@/src/app/(dashboard)/sequencing/sequencing-processing-types";

export type ImpactLevel = "HIGH" | "MODERATE" | "LOW" | "MODIFIER";

export const IMPACT_RANKS: Record<ImpactLevel, number> = {
  HIGH: 4,
  MODERATE: 3,
  LOW: 2,
  MODIFIER: 1,
};

export interface SnpEffAnnotation {
  allele: string;
  effect: string;
  impact: ImpactLevel;
  geneName: string;
  geneId: string;
  featureType: string;
  featureId: string;
  transcriptBioType: string;
  rank: string;
  hgvsC: string;
  hgvsP: string;
  cdnaPos: string;
  cdsPos: string;
  aaPos: string;
  distance: string;
  warnings: string;
}

export interface ParsedVcfVariant {
  id: string;
  chrom: string;
  pos: number;
  ref: string;
  alt: string;
  qual: number | null;
  filter: string;
  type: "snp" | "del" | "ins" | "complex" | "mnp" | "other";
  depth: number | null;
  alleleFreq: number | null;
  alleleCount: number | null;
  refCount: number | null;
  alleleBalance: number | null;
  primaryAnnotation: SnpEffAnnotation;
  allAnnotations: SnpEffAnnotation[];
  lof?: {
    geneName: string;
    geneId: string;
    transcriptCount: number;
    percentAffected: number;
  };
  nmd?: {
    geneName: string;
    geneId: string;
    transcriptCount: number;
    percentAffected: number;
  };
  genotype?: string;
}

export interface DynamicGeneInfo {
  name: string;
  chrom: string;
  start: number;
  end: number;
  variantCount: number;
  variants: ParsedVcfVariant[];
  impactCounts: Record<ImpactLevel, number>;
  primaryImpact: ImpactLevel;
  effects: string[];
}

export interface ParsedVcfDataset {
  chrom: string;
  genomeLength: number;
  variants: ParsedVcfVariant[];
  genes: DynamicGeneInfo[];
  stats: {
    total: number;
    byImpact: Record<ImpactLevel, number>;
    byEffect: Record<string, number>;
    byType: Record<string, number>;
    meanDepth: number;
    maxDepth: number;
    snpCount: number;
    indelCount: number;
  };
}

const VALID_IMPACTS: Set<string> = new Set(["HIGH", "MODERATE", "LOW", "MODIFIER"]);

export function normalizeImpact(impact: string | undefined): ImpactLevel {
  const upper = (impact || "").toUpperCase();
  return VALID_IMPACTS.has(upper) ? (upper as ImpactLevel) : "MODIFIER";
}

function determineMutationType(
  ref: string,
  alt: string,
  rawType?: string
): "snp" | "del" | "ins" | "complex" | "mnp" | "other" {
  if (rawType) {
    const lower = rawType.toLowerCase();
    if (lower === "snp") return "snp";
    if (lower === "del" || lower === "deletion") return "del";
    if (lower === "ins" || lower === "insertion") return "ins";
    if (lower === "complex") return "complex";
    if (lower === "mnp") return "mnp";
  }
  if (ref.length === 1 && alt.length === 1) return "snp";
  if (ref.length > alt.length) return "del";
  if (ref.length < alt.length) return "ins";
  if (ref.length === alt.length && ref.length > 1) return "mnp";
  return "complex";
}

function parseAnnString(annStr: string): SnpEffAnnotation[] {
  if (!annStr) return [];
  const entries = annStr.split(",");
  return entries.map((entry) => {
    const parts = entry.split("|");
    return {
      allele: parts[0] || "",
      effect: parts[1] || "unknown",
      impact: normalizeImpact(parts[2]),
      geneName: parts[3] || "Intergenic",
      geneId: parts[4] || "",
      featureType: parts[5] || "",
      featureId: parts[6] || "",
      transcriptBioType: parts[7] || "",
      rank: parts[8] || "",
      hgvsC: parts[9] || "",
      hgvsP: parts[10] || "",
      cdnaPos: parts[11] || "",
      cdsPos: parts[12] || "",
      aaPos: parts[13] || "",
      distance: parts[14] || "",
      warnings: parts[15] || "",
    };
  });
}

function parseLofString(lofStr: string) {
  const match = lofStr.match(/\(?([^|]+)\|([^|]+)\|([^|]+)\|([^)]+)\)?/);
  if (!match) return undefined;
  return {
    geneName: match[1],
    geneId: match[2],
    transcriptCount: parseInt(match[3], 10) || 0,
    percentAffected: parseFloat(match[4]) || 0,
  };
}

/**
 * Parses raw annotated VCF text on the fly.
 */
export function parseAnnotatedVcf(vcfText: string): ParsedVcfDataset {
  const lines = vcfText.split("\n");
  let detectedChrom = "NC_003027.1";
  let detectedGenomeLength = 0;

  const variants: ParsedVcfVariant[] = [];
  let totalDepth = 0;
  let depthCount = 0;
  let maxDepth = 0;

  const impactCounts: Record<ImpactLevel, number> = {
    HIGH: 0,
    MODERATE: 0,
    LOW: 0,
    MODIFIER: 0,
  };
  const effectCounts: Record<string, number> = {};
  const typeCounts: Record<string, number> = {};
  let snpCount = 0;
  let indelCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (line.startsWith("##")) {
      if (line.startsWith("##contig=")) {
        const idMatch = line.match(/ID=([^,>]+)/);
        const lenMatch = line.match(/length=(\d+)/);
        if (idMatch) detectedChrom = idMatch[1];
        if (lenMatch) detectedGenomeLength = parseInt(lenMatch[1], 10);
      }
      continue;
    }

    if (line.startsWith("#")) {
      continue;
    }

    const cols = line.split("\t");
    if (cols.length < 8) continue;

    const [chrom, posStr, , ref, alt, qualStr, filter, infoStr] = cols;
    const pos = parseInt(posStr, 10);
    if (Number.isNaN(pos)) continue;

    if (!detectedChrom || detectedChrom === "NC_003027.1") {
      detectedChrom = chrom;
    }

    const qual = qualStr === "." ? null : parseFloat(qualStr);

    const infoPairs = infoStr.split(";");
    const infoMap: Record<string, string> = {};
    for (const pair of infoPairs) {
      const eqIdx = pair.indexOf("=");
      if (eqIdx !== -1) {
        infoMap[pair.substring(0, eqIdx)] = pair.substring(eqIdx + 1);
      } else {
        infoMap[pair] = "true";
      }
    }

    const depth = infoMap.DP ? parseInt(infoMap.DP, 10) : null;
    if (depth !== null && !Number.isNaN(depth)) {
      totalDepth += depth;
      depthCount++;
      if (depth > maxDepth) maxDepth = depth;
    }

    const alleleCount = infoMap.AO ? parseInt(infoMap.AO, 10) : null;
    const refCount = infoMap.RO ? parseInt(infoMap.RO, 10) : null;
    const alleleBalance = infoMap.AB ? parseFloat(infoMap.AB) : null;

    let alleleFreq: number | null = null;
    if (infoMap.AF) {
      alleleFreq = parseFloat(infoMap.AF);
    } else if (alleleCount !== null && depth && depth > 0) {
      alleleFreq = Math.min(1, Math.max(0, alleleCount / depth));
    }

    const allAnnotations = parseAnnString(infoMap.ANN || "");
    
    // Pick the most clinically/biologically significant annotation
    let primaryAnnotation: SnpEffAnnotation = allAnnotations[0] || {
      allele: alt,
      effect: "intergenic_variant",
      impact: "MODIFIER",
      geneName: "Intergenic",
      geneId: "",
      featureType: "",
      featureId: "",
      transcriptBioType: "",
      rank: "",
      hgvsC: "",
      hgvsP: "",
      cdnaPos: "",
      cdsPos: "",
      aaPos: "",
      distance: "",
      warnings: "",
    };

    // If multiple annotations exist, select the highest impact tier
    for (const ann of allAnnotations) {
      if ((IMPACT_RANKS[ann.impact] || 0) > (IMPACT_RANKS[primaryAnnotation.impact] || 0)) {
        primaryAnnotation = ann;
      }
    }

    const mutType = determineMutationType(ref, alt, infoMap.TYPE);
    typeCounts[mutType] = (typeCounts[mutType] || 0) + 1;
    if (mutType === "snp" || mutType === "mnp") {
      snpCount++;
    } else {
      indelCount++;
    }

    let genotype: string | undefined;
    if (cols.length >= 10) {
      const formatKeys = cols[8].split(":");
      const sampleVals = cols[9].split(":");
      const gtIdx = formatKeys.indexOf("GT");
      if (gtIdx !== -1 && sampleVals[gtIdx]) {
        genotype = sampleVals[gtIdx];
      }
    }

    const lof = infoMap.LOF ? parseLofString(infoMap.LOF) : undefined;
    const nmd = infoMap.NMD ? parseLofString(infoMap.NMD) : undefined;

    impactCounts[primaryAnnotation.impact] =
      (impactCounts[primaryAnnotation.impact] || 0) + 1;
    effectCounts[primaryAnnotation.effect] =
      (effectCounts[primaryAnnotation.effect] || 0) + 1;

    variants.push({
      id: `${chrom}:${pos}:${ref}>${alt}_${variants.length}`,
      chrom,
      pos,
      ref,
      alt,
      qual,
      filter,
      type: mutType,
      depth,
      alleleFreq,
      alleleCount,
      refCount,
      alleleBalance,
      primaryAnnotation,
      allAnnotations,
      lof,
      nmd,
      genotype,
    });
  }

  const maxPosObserved = variants.reduce((max, v) => Math.max(max, v.pos), 0);
  if (detectedGenomeLength <= 0) {
    detectedGenomeLength = Math.max(maxPosObserved + 2000, 150773);
  }

  // Group variants by Gene on the fly
  const geneMap = new Map<string, DynamicGeneInfo>();

  for (const v of variants) {
    const geneName = v.primaryAnnotation.geneName || "Intergenic";
    if (!geneMap.has(geneName)) {
      geneMap.set(geneName, {
        name: geneName,
        chrom: v.chrom,
        start: v.pos,
        end: v.pos,
        variantCount: 0,
        variants: [],
        impactCounts: { HIGH: 0, MODERATE: 0, LOW: 0, MODIFIER: 0 },
        primaryImpact: v.primaryAnnotation.impact,
        effects: [],
      });
    }

    const g = geneMap.get(geneName)!;
    g.start = Math.min(g.start, v.pos);
    g.end = Math.max(g.end, v.pos);
    g.variantCount++;
    g.variants.push(v);
    g.impactCounts[v.primaryAnnotation.impact]++;

    if (v.primaryAnnotation.impact === "HIGH") g.primaryImpact = "HIGH";
    else if (v.primaryAnnotation.impact === "MODERATE" && g.primaryImpact !== "HIGH") {
      g.primaryImpact = "MODERATE";
    } else if (
      v.primaryAnnotation.impact === "LOW" &&
      g.primaryImpact !== "HIGH" &&
      g.primaryImpact !== "MODERATE"
    ) {
      g.primaryImpact = "LOW";
    }

    if (!g.effects.includes(v.primaryAnnotation.effect)) {
      g.effects.push(v.primaryAnnotation.effect);
    }
  }

  const genes = Array.from(geneMap.values())
    .map((g) => {
      if (g.start === g.end) {
        return {
          ...g,
          start: Math.max(1, g.start - 150),
          end: g.end + 150,
        };
      }
      return g;
    })
    .sort((a, b) => a.start - b.start);

  return {
    chrom: detectedChrom,
    genomeLength: detectedGenomeLength,
    variants: variants.sort((a, b) => a.pos - b.pos),
    genes,
    stats: {
      total: variants.length,
      byImpact: impactCounts,
      byEffect: effectCounts,
      byType: typeCounts,
      meanDepth: depthCount > 0 ? Math.round(totalDepth / depthCount) : 0,
      maxDepth: maxDepth || 30,
      snpCount,
      indelCount,
    },
  };
}

/**
 * Adapter to build a ParsedVcfDataset from backend SequencingVariant[] rows.
 */
export function buildDatasetFromVariants(
  variants: SequencingVariant[],
  genomeLength = 150773,
  chrom = "NC_003027.1"
): ParsedVcfDataset {
  const parsedVariants: ParsedVcfVariant[] = [];
  const impactCounts: Record<ImpactLevel, number> = {
    HIGH: 0,
    MODERATE: 0,
    LOW: 0,
    MODIFIER: 0,
  };
  const effectCounts: Record<string, number> = {};
  const typeCounts: Record<string, number> = {};
  let totalDepth = 0;
  let depthCount = 0;
  let maxDepth = 0;
  let snpCount = 0;
  let indelCount = 0;

  for (let i = 0; i < variants.length; i++) {
    const v = variants[i];
    const impact = normalizeImpact(v.impact);
    const mutType = determineMutationType(v.ref, v.alt);
    typeCounts[mutType] = (typeCounts[mutType] || 0) + 1;
    if (mutType === "snp" || mutType === "mnp") snpCount++;
    else indelCount++;

    if (v.depth !== null && v.depth !== undefined) {
      totalDepth += v.depth;
      depthCount++;
      if (v.depth > maxDepth) maxDepth = v.depth;
    }

    impactCounts[impact]++;
    const effect = v.effect || "unknown";
    effectCounts[effect] = (effectCounts[effect] || 0) + 1;

    const ann: SnpEffAnnotation = {
      allele: v.alt,
      effect,
      impact,
      geneName: v.gene || "Intergenic",
      geneId: "",
      featureType: "gene",
      featureId: v.gene || "",
      transcriptBioType: "protein_coding",
      rank: "",
      hgvsC: "",
      hgvsP: v.hgvsP || "",
      cdnaPos: "",
      cdsPos: "",
      aaPos: "",
      distance: "",
      warnings: "",
    };

    parsedVariants.push({
      id: `${v.chrom || chrom}:${v.pos}:${v.ref}>${v.alt}_${i}`,
      chrom: v.chrom || chrom,
      pos: v.pos,
      ref: v.ref,
      alt: v.alt,
      qual: null,
      filter: "PASS",
      type: mutType,
      depth: v.depth ?? null,
      alleleFreq: v.alleleFreq ?? null,
      alleleCount: null,
      refCount: null,
      alleleBalance: null,
      primaryAnnotation: ann,
      allAnnotations: [ann],
    });
  }

  // Dynamic gene groupings on the fly
  const geneMap = new Map<string, DynamicGeneInfo>();
  for (const v of parsedVariants) {
    const geneName = v.primaryAnnotation.geneName || "Intergenic";
    if (!geneMap.has(geneName)) {
      geneMap.set(geneName, {
        name: geneName,
        chrom: v.chrom,
        start: v.pos,
        end: v.pos,
        variantCount: 0,
        variants: [],
        impactCounts: { HIGH: 0, MODERATE: 0, LOW: 0, MODIFIER: 0 },
        primaryImpact: v.primaryAnnotation.impact,
        effects: [],
      });
    }

    const g = geneMap.get(geneName)!;
    g.start = Math.min(g.start, v.pos);
    g.end = Math.max(g.end, v.pos);
    g.variantCount++;
    g.variants.push(v);
    g.impactCounts[v.primaryAnnotation.impact]++;

    if (v.primaryAnnotation.impact === "HIGH") g.primaryImpact = "HIGH";
    else if (v.primaryAnnotation.impact === "MODERATE" && g.primaryImpact !== "HIGH") {
      g.primaryImpact = "MODERATE";
    } else if (
      v.primaryAnnotation.impact === "LOW" &&
      g.primaryImpact !== "HIGH" &&
      g.primaryImpact !== "MODERATE"
    ) {
      g.primaryImpact = "LOW";
    }

    if (!g.effects.includes(v.primaryAnnotation.effect)) {
      g.effects.push(v.primaryAnnotation.effect);
    }
  }

  const genes = Array.from(geneMap.values())
    .map((g) => {
      if (g.start === g.end) {
        return {
          ...g,
          start: Math.max(1, g.start - 200),
          end: g.end + 200,
        };
      }
      return g;
    })
    .sort((a, b) => a.start - b.start);

  return {
    chrom,
    genomeLength: Math.max(genomeLength, 150773),
    variants: parsedVariants.sort((a, b) => a.pos - b.pos),
    genes,
    stats: {
      total: parsedVariants.length,
      byImpact: impactCounts,
      byEffect: effectCounts,
      byType: typeCounts,
      meanDepth: depthCount > 0 ? Math.round(totalDepth / depthCount) : 0,
      maxDepth: maxDepth || 30,
      snpCount,
      indelCount,
    },
  };
}

/**
 * Enriches a parsed VCF dataset with backend variants if the VCF was unannotated.
 */
export function enrichDatasetWithBackendVariants(
  dataset: ParsedVcfDataset,
  backendVariants: SequencingVariant[]
): ParsedVcfDataset {
  if (!backendVariants || backendVariants.length === 0) return dataset;

  // Build index by pos
  const map = new Map<number, SequencingVariant>();
  for (const bv of backendVariants) {
    map.set(bv.pos, bv);
  }

  let enrichedCount = 0;
  const impactCounts: Record<ImpactLevel, number> = {
    HIGH: 0,
    MODERATE: 0,
    LOW: 0,
    MODIFIER: 0,
  };
  const effectCounts: Record<string, number> = {};

  const updatedVariants = dataset.variants.map((v) => {
    const match = map.get(v.pos);
    if (match && (v.primaryAnnotation.geneName === "Intergenic" || v.primaryAnnotation.impact === "MODIFIER")) {
      enrichedCount++;
      const impact = normalizeImpact(match.impact);
      const effect = match.effect || v.primaryAnnotation.effect;
      const geneName = match.gene || v.primaryAnnotation.geneName;
      const hgvsP = match.hgvsP || v.primaryAnnotation.hgvsP;

      const ann: SnpEffAnnotation = {
        ...v.primaryAnnotation,
        impact,
        effect,
        geneName,
        hgvsP,
      };

      impactCounts[impact]++;
      effectCounts[effect] = (effectCounts[effect] || 0) + 1;

      return {
        ...v,
        primaryAnnotation: ann,
        allAnnotations: [ann],
      };
    }

    impactCounts[v.primaryAnnotation.impact]++;
    effectCounts[v.primaryAnnotation.effect] =
      (effectCounts[v.primaryAnnotation.effect] || 0) + 1;
    return v;
  });

  if (enrichedCount === 0) return dataset;

  // Recompute dynamic gene groupings
  const geneMap = new Map<string, DynamicGeneInfo>();
  for (const v of updatedVariants) {
    const geneName = v.primaryAnnotation.geneName || "Intergenic";
    if (!geneMap.has(geneName)) {
      geneMap.set(geneName, {
        name: geneName,
        chrom: v.chrom,
        start: v.pos,
        end: v.pos,
        variantCount: 0,
        variants: [],
        impactCounts: { HIGH: 0, MODERATE: 0, LOW: 0, MODIFIER: 0 },
        primaryImpact: v.primaryAnnotation.impact,
        effects: [],
      });
    }

    const g = geneMap.get(geneName)!;
    g.start = Math.min(g.start, v.pos);
    g.end = Math.max(g.end, v.pos);
    g.variantCount++;
    g.variants.push(v);
    g.impactCounts[v.primaryAnnotation.impact]++;

    if (v.primaryAnnotation.impact === "HIGH") g.primaryImpact = "HIGH";
    else if (v.primaryAnnotation.impact === "MODERATE" && g.primaryImpact !== "HIGH") {
      g.primaryImpact = "MODERATE";
    } else if (
      v.primaryAnnotation.impact === "LOW" &&
      g.primaryImpact !== "HIGH" &&
      g.primaryImpact !== "MODERATE"
    ) {
      g.primaryImpact = "LOW";
    }

    if (!g.effects.includes(v.primaryAnnotation.effect)) {
      g.effects.push(v.primaryAnnotation.effect);
    }
  }

  const genes = Array.from(geneMap.values())
    .map((g) => {
      if (g.start === g.end) {
        return {
          ...g,
          start: Math.max(1, g.start - 200),
          end: g.end + 200,
        };
      }
      return g;
    })
    .sort((a, b) => a.start - b.start);

  return {
    ...dataset,
    variants: updatedVariants,
    genes,
    stats: {
      ...dataset.stats,
      byImpact: impactCounts,
      byEffect: effectCounts,
    },
  };
}
