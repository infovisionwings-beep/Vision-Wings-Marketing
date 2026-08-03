# Implementation Checklist

**Vision Wings Marketing — website legal pages**
Prepared: 03 August 2026

---

## Important

These are drafting templates, not legal advice. I'm not a lawyer. Before publishing, have a practising advocate review them against your actual entity structure, tax registration and client contracts — particularly the Terms of Service, Refund Policy and the liability cap. An hour of professional review is cheap relative to one disputed retainer.

---

## 1. Placeholders to fill (appear across all eight files)

| Placeholder | What to enter |
|---|---|
| `[LEGAL ENTITY NAME]` | The registered name, e.g. "Vision Wings Marketing" or the proprietor's name if unregistered |
| `[sole proprietorship / LLP / private limited company]` | Your actual structure |
| `[FULL ADDRESS] ... [PIN]` | Registered/principal place of business, Varanasi |
| `[DD Month YYYY]` | Effective date — same date across all eight |
| `[NAME]` (Grievance Officer) | A named individual, legally required |
| `[grievance@visionwingsmarketing.com]` | Set up this alias, or substitute the Gmail |
| `[accessibility@visionwingsmarketing.com]` | Set up, or substitute |
| `[7 / 15] days`, `[50]%`, `[1.5]%`, `[30] days` etc. | Your actual commercial terms — must match your signed client agreements |
| `[Vercel Analytics / other]` | Only the analytics tools you actually run |
| GSTIN | Add to Terms Clause 6 and invoices if registered |

**Rule:** delete any clause describing something you don't do. A cookie table listing a Meta Pixel you never installed is a false statement in a published policy.

---

## 2. Consistency between policies and reality

The Refund Policy numbers must match the retainer agreement you drafted for Hotel RG Residency. If that agreement says 30 days' notice and the website says 15, the client's lawyer will pick whichever helps them. Reconcile before publishing.

---

## 3. Things I noticed on the live site worth fixing

**a) Placeholder case studies presented as real work.** The site shows Lumina Health, Aero Dynamics, Vertex Capital, Aura Neurotech, Sovereign Wealth and Kura Sound, plus a testimonial claiming 400% YoY growth. Alongside them sit what look like genuine clients — Hotel RG Residency, Mayur Enterprises, SrijanKr. If the first group is demo content, publishing it as portfolio work is exposure under the Consumer Protection Act, 2019 and the CCPA misleading-advertisement guidelines, and no disclaimer clause fully cures a fabricated testimonial. Three real case studies beat six invented ones. Either replace them with actual client work or label the section clearly as concept/demonstration work.

**b) Two different contact emails.** The footer shows `hello@visionwing.agency` in one render and `info.visionwings@gmail.com` in another. Legal pages need one authoritative address, and a domain address (`info@visionwingsmarketing.com`) reads considerably better than Gmail on a contract page.

**c) `og:url` points to `visionwing.com`, not `visionwingsmarketing.com`.** That's an SEO problem, and it also muddies which domain your Terms actually govern. Fix the metadata to the canonical domain.

**d) The site has a `/login` area.** That means you hold account credentials, which raises the stakes on the Privacy Policy's security section and makes the DPDP breach-notification duty real rather than theoretical. Make sure passwords are hashed (bcrypt/argon2), not encrypted or stored plain.

**e) Existing `/privacy` and `/terms` links.** Check what's currently served there — if placeholder text from a template is live, replace it before adding the other six pages.

---

## 4. Deployment

**URLs** (link all eight in the footer, cross-referenced as written in the drafts):

```
/privacy          Privacy Policy
/terms            Terms of Service
/cookies          Cookie Policy
/refund-policy    Refund & Cancellation Policy
/disclaimer       Disclaimer
/copyright        Copyright Policy
/accessibility    Accessibility Statement
/acceptable-use   Acceptable Use Policy
```

**On a Next.js site:** these are markdown; render via MDX or paste into page components. Keep `Last Updated` visible at the top of each page — courts and clients both care when a term was published.

**Cookie banner:** the Cookie Policy commits you to "Accept all / Reject all / Manage preferences" with equal prominence. If your banner currently only has "Accept", the policy is describing something that doesn't exist. Fix the banner or soften the policy — the first is better.

**Contact form:** add a consent checkbox — unticked by default — with text like *"I agree to Vision Wings processing my details to respond to this enquiry, as described in the Privacy Policy."* DPDP consent must be affirmative; a pre-ticked box isn't consent.

**Terms acceptance:** for the signup flow, use an unticked checkbox referencing Terms and Privacy Policy, and log the timestamp and version accepted.

**Versioning:** keep dated copies of each policy when you revise. If a dispute concerns work done in March, you need the March version, not today's.

---

## 5. Review cadence

Annually, and whenever you add a tracking tool, a payment method, an account feature, or a new service line.
