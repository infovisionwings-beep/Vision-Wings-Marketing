/**
 * Who may reach which admin section.
 *
 * This lived in three places that had no way of agreeing: a `requireAdmin` list
 * on each page, the nav array, and the dashboard tiles. The nav and the tiles
 * listed everything unconditionally, so SEO and Content Manager saw the whole
 * console and only discovered their limits by clicking into a redirect.
 *
 * Hiding a link is presentation, not protection — the `requireAdmin` call on
 * each page is still what enforces this. Both now read the same map, so a
 * section cannot be visible to a role that gets bounced out of it.
 *
 * No server-only imports here on purpose: the client nav and the server page
 * guards both need it.
 */

/** Roles that reach every section. Admin is the existing full-access role and
 *  Developer is the super admin, so neither is ever listed per-section. */
export const FULL_ACCESS_ROLES = ["Developer", "Admin"];

/**
 * Extra roles allowed into a section, keyed by route prefix. A section absent
 * from this map is full-access-only.
 *
 * The split: SEO owns written content, Content Manager owns what appears where
 * on the public site, and both upload to the shared media library.
 */
export const SECTION_ROLES: Record<string, string[]> = {
  "/admin/media": ["SEO", "Content Manager"],
  "/admin/insights": ["SEO"],
  "/admin/campaigns": ["Content Manager"],
};

/** The dashboard itself is the landing page for every admin, whatever the role. */
const ALWAYS_ALLOWED = ["/admin"];

export function canAccess(role: string | null | undefined, href: string): boolean {
  if (!role) return false;
  if (FULL_ACCESS_ROLES.includes(role)) return true;
  if (ALWAYS_ALLOWED.includes(href)) return true;

  // Longest prefix wins, so /admin/insights/new resolves to the /admin/insights
  // rule rather than matching nothing and silently denying a legitimate page.
  const match = Object.keys(SECTION_ROLES)
    .filter((prefix) => href === prefix || href.startsWith(`${prefix}/`))
    .sort((a, b) => b.length - a.length)[0];

  return match ? SECTION_ROLES[match].includes(role) : false;
}

/** The role list to hand `requireAdmin` for a section. */
export function rolesFor(section: keyof typeof SECTION_ROLES | string): string[] {
  return [...FULL_ACCESS_ROLES, ...(SECTION_ROLES[section] ?? [])];
}
