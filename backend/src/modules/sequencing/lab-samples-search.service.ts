import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sample } from 'src/entities/sample.entity';
import { TenantScopeService } from 'src/common/authorization/tenant-scope.service';

export interface LabSampleSearchResult {
  labTestId: string;
  barcode: string;
  sampleCode: string | null;
  siteName: string;
  collectedAt: string;
  diseaseName: string;
  suggestedFileFormat: string;
  suggestedLibraryType: string;
  suggestedMethod: string;
  /** A12: the project the underlying sample belongs to, used to check the
   * caller can reach it before a sequencing job is submitted against it. */
  projectId: string | null;
}

@Injectable()
export class LabSamplesSearchService {
  constructor(
    @InjectRepository(Sample)
    private readonly sampleRepo: Repository<Sample>,
    private readonly tenantScopeService: TenantScopeService,
  ) {}

  async search(
    query: string = '',
    user?: any,
  ): Promise<LabSampleSearchResult[]> {
    try {
      const tenant = await this.tenantScopeService.forUser(user);
      // A12: fail closed rather than returning every tenant's samples when
      // the caller reaches no project (see common/functions/tenant-scope.ts).
      if (!tenant.isSystem && !tenant.projectIds.length) return [];

      let sql = `
        SELECT
          s.id as "labTestId",
          s.barcode as barcode,
          s."sampleCode" as "sampleCode",
          s."projectId" as "projectId",
          COALESCE(st.name, st."siteCode", s.barcode) as "siteName",
          COALESCE(s."collectedAt", s."collectionTime", NOW()::timestamp) as "collectedAt",
          COALESCE(d.name, 'Tested') as "diseaseName"
        FROM samples s
        LEFT JOIN sites st ON s."siteId" = st.id
        LEFT JOIN lab_tests lt ON s.id = lt."sampleId"
        LEFT JOIN diseases d ON lt."diseaseId" = d.id
        WHERE lt.id IS NOT NULL
      `;

      const params: any[] = [];

      if (!tenant.isSystem) {
        params.push(tenant.projectIds);
        // projects.id (and therefore samples.projectId) is a nanoid text
        // id, not a uuid - see Project.generateId().
        sql += ` AND s."projectId" = ANY($${params.length}::text[])`;
      }

      if (query && query.trim()) {
        params.push(`%${query.trim()}%`);
        sql += `
          AND (
            s.id::text ILIKE $${params.length}
            OR s.barcode ILIKE $${params.length}
            OR s."sampleCode" ILIKE $${params.length}
          )
        `;
      }

      sql += `
        ORDER BY s."collectedAt" DESC NULLS LAST
        LIMIT 20
      `;

      const results = await this.sampleRepo.query(sql, params);

      return results.map((row: any) => ({
        labTestId: row.labTestId,
        barcode: row.barcode || row.sampleCode || row.labTestId,
        sampleCode: row.sampleCode || null,
        siteName: row.siteName || 'Unknown Site',
        collectedAt: this.formatDate(row.collectedAt),
        diseaseName: row.diseaseName || 'Tested',
        suggestedFileFormat: 'FASTA',
        suggestedLibraryType: 'Single End',
        suggestedMethod: 'WGS',
        projectId: row.projectId || null,
      }));
    } catch (error: any) {
      console.error('Error in lab samples search:', error.message);
      return [];
    }
  }

  /**
   * Fetches a single sample by its own id, with no tenant filter - callers
   * must check the returned `projectId` against their own tenant scope
   * (`canReachProject`) before trusting or acting on the result. This keeps
   * "not found" and "not yours" indistinguishable to the caller, which is
   * deliberate (see `SequencingJobsService.handleLabSubmission`).
   */
  async findById(id: string): Promise<LabSampleSearchResult | null> {
    try {
      const sql = `
        SELECT
          s.id as "labTestId",
          s.barcode as barcode,
          s."sampleCode" as "sampleCode",
          s."projectId" as "projectId",
          COALESCE(st.name, st."siteCode", s.barcode) as "siteName",
          COALESCE(s."collectedAt", s."collectionTime", NOW()::timestamp) as "collectedAt",
          COALESCE(d.name, 'Tested') as "diseaseName"
        FROM samples s
        LEFT JOIN sites st ON s."siteId" = st.id
        LEFT JOIN lab_tests lt ON s.id = lt."sampleId"
        LEFT JOIN diseases d ON lt."diseaseId" = d.id
        WHERE s.id = $1
        LIMIT 1
      `;

      const results = await this.sampleRepo.query(sql, [id]);

      if (!results.length) return null;

      const row = results[0];

      return {
        labTestId: row.labTestId,
        barcode: row.barcode || row.sampleCode || row.labTestId,
        sampleCode: row.sampleCode || null,
        siteName: row.siteName || 'Unknown Site',
        collectedAt: this.formatDate(row.collectedAt),
        diseaseName: row.diseaseName || 'Tested',
        suggestedFileFormat: 'FASTA',
        suggestedLibraryType: 'Single End',
        suggestedMethod: 'WGS',
        projectId: row.projectId || null,
      };
    } catch (error: any) {
      console.error('Error finding sample:', error.message);
      return null;
    }
  }

  private formatDate(date: any): string {
    if (!date) return '';

    try {
      return new Date(date).toISOString().split('T')[0];
    } catch {
      return '';
    }
  }
}
