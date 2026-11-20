import { SampleStatus } from 'src/common/enums/sample-status.enum';
import { TestResultType } from 'src/common/enums/test-result.enum';

// Only results on samples that have actually been through testing count. A
// sample rolled back to an earlier stage can still carry a stale result.
const REPORTED_SAMPLE_STATUSES = [
  SampleStatus.TESTED,
  SampleStatus.TEST_REPORT_GENERATED,
];

/**
 * SQL CASE resolving a site's test status: 'positive' if any reported lab test
 * is positive, else 'negative' if any is negative, else 'pending' (no tests,
 * or only pending/unclear results).
 *
 * Single source of truth for the per-site status badge in the site list and
 * the project Sites summary cards, so the two cannot disagree.
 *
 * @param siteIdColumn SQL column holding the site id, e.g. `site.id`.
 * @param diseaseParam Name of a bound query parameter holding a disease id.
 *   When given, only that disease's lab tests count; the caller must set it.
 */
export function siteTestStatusSql(
  siteIdColumn: string,
  diseaseParam?: string,
): string {
  const reportedStatuses = REPORTED_SAMPLE_STATUSES.map((s) => `'${s}'`).join(
    ', ',
  );
  const diseaseFilter = diseaseParam
    ? `AND lt."diseaseId" = :${diseaseParam}`
    : '';
  const hasResult = (result: TestResultType) => `EXISTS (
      SELECT 1 FROM samples s
      INNER JOIN lab_tests lt ON lt."sampleId" = s.id
      WHERE s."siteId" = ${siteIdColumn}
        AND s."sampleStatus" IN (${reportedStatuses})
        AND lt."testResult" = '${result}'
        ${diseaseFilter}
    )`;

  return `CASE
    WHEN ${hasResult(TestResultType.POSITIVE)} THEN '${TestResultType.POSITIVE}'
    WHEN ${hasResult(TestResultType.NEGATIVE)} THEN '${TestResultType.NEGATIVE}'
    ELSE '${TestResultType.PENDING}'
  END`;
}
