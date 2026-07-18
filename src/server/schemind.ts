/**
 * schemind-instrumented fetch for calls to the external backend
 * (BACKEND_ENDPOINT_URL). Learns each endpoint's response shape at runtime
 * and logs a drift report the moment the shape silently changes.
 *
 * @see https://www.npmjs.com/package/@aminoxix/schemind
 */
import {
  createSchemindFetch,
  SnapshotStore,
  formatReport,
  type ObserveResult,
} from "@aminoxix/schemind";
import { LocalStorageDriver } from "@aminoxix/schemind/node";

const isDev = process.env.NODE_ENV === "development";

const logObservation = ({ endpoint, report, created }: ObserveResult) => {
  if (created) {
    if (isDev) console.info(`[schemind] baseline created for ${endpoint}`);
    return;
  }
  if (!report || report.changes.length === 0) {
    if (isDev) console.info(`[schemind] ${endpoint} — shape stable ✓`);
    return;
  }

  const log = report.severity === "breaking" ? console.error : console.warn;
  log(`[schemind] shape drift on ${endpoint}\n${formatReport(report, false)}`);
};

export const schemindFetch = createSchemindFetch({
  // Persist baselines to .schemind/snapshots in dev so they survive
  // restarts; serverless filesystems are read-only, so prod stays in-memory.
  store: isDev
    ? new SnapshotStore(new LocalStorageDriver(".schemind/snapshots"))
    : undefined,
  onObserve: logObservation,
  onError: (error) => {
    if (isDev) console.error("[schemind]", error);
  },
});
