/**
 * Structured audit logger for admin operations.
 *
 * Writes JSON-formatted log entries to the server console.
 * In production, these can be piped to a log aggregator
 * (e.g. Vercel Log Drains, Datadog, Sentry).
 */

export interface AuditLogEntry {
  timestamp: string;
  action: string;
  userId: string;
  userEmail: string;
  details?: Record<string, unknown>;
}

/**
 * Log an admin action with structured metadata.
 *
 * @param action    - The operation performed (e.g. "project.create", "insight.delete")
 * @param userId    - The authenticated user's ID
 * @param userEmail - The authenticated user's email
 * @param details   - Optional additional context (e.g. project ID, slug)
 */
export function logAdminAction(
  action: string,
  userId: string,
  userEmail: string,
  details?: Record<string, unknown>
) {
  const entry: AuditLogEntry = {
    timestamp: new Date().toISOString(),
    action,
    userId,
    userEmail,
    ...(details ? { details } : {}),
  };

  // Structured JSON log — easily parseable by log aggregators
  console.log(`[AUDIT] ${JSON.stringify(entry)}`);
}
