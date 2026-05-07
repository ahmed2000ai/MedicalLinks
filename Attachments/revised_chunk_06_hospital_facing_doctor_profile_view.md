# MedicalLinks — Revised Chunk 06: Hospital-Facing Doctor Profile View

## Refactor Instruction

This project already has an existing implementation built from the earlier recruiter-led roadmap.

Your task in this chunk is to **update and refactor the current implementation** so it aligns with the revised hospital-access business model.

Do not build a parallel second version of the same feature.
Do not leave outdated recruiter-first assumptions in place if they conflict with the new role model.
Where appropriate, refactor, hide, reroute, deprecate, or simplify old behavior so the platform moves toward the new model cleanly.

## Product Direction Update

MedicalLinks has shifted from a recruiter-led workflow tool to a hospital-access talent platform.

Primary roles are now:
- **Doctor**
- **Hospital User**
- **Admin**

Recruiter is no longer a primary product role for the current MVP and should be deprioritized or removed from user-facing workflows unless explicitly needed for internal support later.

Hospitals should be able to:
- access a candidate pool
- search and filter doctors
- shortlist doctors
- message doctors
- invite doctors to interview
- eventually mark hires

Doctors should be able to:
- create and manage profiles
- control visibility
- be discovered by hospitals
- engage with hospital outreach

Admins should be able to:
- approve hospitals
- manage agreements and access
- monitor platform activity
- track hires and fees later

We just finished candidate pool browsing and search. Now use the reference files in `Attachments/` plus the current codebase to build the **Hospital-Facing Doctor Profile View**.

## Reference Material

Before implementing, review these files in `Attachments/`:
- `Attachments/revised_model_roadmap.md`
- `Attachments/02_product_prd.md`
- `Attachments/03_candidate_intake_form_en.md`
- `Attachments/04_candidate_intake_form_ar.md`
- `Attachments/MedicalLinks_Business_Concept_GCC_EN.pdf`
- `Attachments/UI2.png`

Use those files plus the current codebase as supporting context.

## Objective

Build the hospital-side doctor profile page that allows hospital users to evaluate a candidate in a structured, professional, privacy-respecting way.

This chunk should establish:
- hospital-facing doctor profile page
- hospital-safe profile presentation
- structured physician summary
- credential and readiness visibility
- availability and preference visibility
- doctor privacy enforcement
- clear actions such as:
  - Save Candidate
  - Message Doctor
  - Invite to Interview (can be placeholder if interview invite flow is not built yet)

This is one of the most important evaluation surfaces in the product.

## Product Context

MedicalLinks is a GCC-focused doctor discovery and hiring platform.

Hospitals need more than a candidate list. They need a profile view that helps them assess:
- specialty fit
- experience level
- training background
- licensing and credential readiness
- relocation and availability
- whether to save, contact, or interview a doctor

This profile view should feel like a **high-trust hospital evaluation surface**, not a public social profile.

## Scope of This Chunk

Implement:

1. hospital-facing doctor profile route/page
2. hospital-only access behavior
3. hospital-safe doctor profile presentation
4. structured professional summary
5. education/training/work history summary
6. license/certification/credential-readiness summary
7. availability and preferences summary
8. privacy-respecting handling of personal/contact data
9. action area for hospital users
10. blocked/hidden handling when a doctor should not be visible

Do not implement:
- full shortlist pipeline yet
- full hospital-to-doctor messaging redesign
- full interview invitation workflow
- hire tracking
- invoicing
- doctor comparison view
- full contact detail unlocking workflow unless already trivial and safe

## Required Profile Areas

### 1. Header / Hero Summary
Show a strong professional candidate summary including items such as:
- professional title
- specialty
- subspecialty if available
- years of experience
- current country / region
- current role/employer summary if allowed
- open-to-opportunities status
- high-level match/readiness indicators if useful

This section should help hospital users quickly understand the candidate.

### 2. Professional Summary
Show:
- short professional overview
- current role
- current employer or organization summary if visible
- major clinical focus areas
- language summary if useful

### 3. Education and Training
Show a clean summary of:
- medical degree(s)
- residency training
- fellowship training
- institutions
- countries
- major milestones

This should be easy to scan and feel relevant to physician evaluation.

### 4. Work Experience
Show structured experience history, including:
- employer
- title
- specialty/department
- location
- dates
- current role marker
- concise role summary if available

### 5. Licenses and Certifications
Show a hospital-safe readiness summary of:
- licenses
- board certifications
- professional certifications
- GCC authority relevance where available
- expiration awareness where relevant
- high-level readiness signals

Do not claim actual verification or approval unless that is truly implemented.

### 6. Preferences and Availability
Show relevant fields such as:
- preferred GCC countries
- relocation willingness
- visa sponsorship need
- availability timing
- compensation expectation if visible in the current business rules

### 7. Document / Credential Readiness Summary
Show a professional summary such as:
- key credentials present
- missing items if the current privacy/business model allows hospitals to know that
- readiness state or document completeness summary

Do not expose raw sensitive document contents broadly unless already intended by platform rules.

## Privacy and Visibility Requirements

This chunk must strictly respect the doctor privacy and visibility controls built previously.

Hospitals should only see:
- doctors who are discoverable
- fields that are allowed for hospital-facing display
- hospital-safe profile information

Hospitals should **not** automatically see unrestricted personal contact details such as:
- private email
- direct phone
- other sensitive personal data

If a doctor is:
- hidden
- paused
- not discoverable
- restricted by country visibility rules

then the hospital-facing profile route should not expose the profile normally.
Handle this with a clean not-available / access-restricted experience.

## Actions / CTAs

Add a hospital-side action area with clear actions such as:
- Save Candidate
- Message Doctor
- Invite to Interview

If the full downstream workflow is not fully built yet:
- the actions can be safely scaffolded
- or can link into the next-step pages if already available

The profile should clearly support decision-making even before all downstream features are complete.

## Medical Industry / Business Requirements Relevant to This Chunk

This profile view must support physician evaluation in a GCC hospital hiring context.

Important concepts include:
- specialty and subspecialty
- structured medical education and training
- experience and level
- board certification
- GCC licensing relevance
- readiness for hiring
- relocation and visa fit

Use terminology such as:
- Doctor
- Specialty
- Fellowship
- Board Certification
- Licensing Readiness
- Credential Readiness
- Availability
- Candidate Profile

Avoid consumer-social-network language.

Do not make false compliance, verification, or regulatory claims.

## UI / UX Directives

Use the shared design system and take visual inspiration from `Attachments/UI2.png` for:
- information hierarchy
- detail presentation
- metadata grouping
- side action panel structure
- readability of dense professional information

The page must feel:
- premium
- medical-grade
- hospital-friendly
- credible
- efficient to scan
- information-rich without clutter

### Visual expectations
- clear header summary
- structured cards or sections
- concise metadata rows
- readable badges/status indicators
- action panel or side rail
- strong whitespace and section hierarchy

### UX expectations
- hospital users should quickly understand who the doctor is
- profile should support screening and shortlisting decisions
- privacy boundaries should feel intentional and trustworthy
- the page should feel like a hiring product, not a resume dump

## Technical Requirements

- use the existing doctor profile data, privacy settings, and credential/document readiness logic
- keep hospital-facing data selection separate from raw doctor profile access
- build a clear hospital-safe profile view model/selector
- enforce hospital-only access and doctor discoverability checks
- keep logic modular and reusable for future shortlist/messaging/interview workflows

If helpful, create services/selectors such as:
- getHospitalSafeDoctorProfile
- canHospitalViewDoctorProfile
- buildDoctorReadinessSummaryForHospital
- getDoctorProfileActionsForHospital

Use different naming if a cleaner fit exists.

## Important Constraints

- Do not expose unrestricted personal contact details
- Do not build the full shortlist pipeline yet
- Do not build the full messaging/interview workflow yet
- Do not build hire tracking or commercial workflows yet
- Keep this chunk focused on the hospital-facing doctor profile evaluation experience

## Definition of Done

- [ ] Hospital-facing doctor profile page exists
- [ ] Hospital-only access is enforced
- [ ] Doctor discoverability/privacy rules are enforced
- [ ] Professional summary is implemented
- [ ] Education/training summary is implemented
- [ ] Work experience summary is implemented
- [ ] License/certification/readiness summary is implemented
- [ ] Preferences/availability summary is implemented
- [ ] Personal contact details remain appropriately protected
- [ ] Hospital actions are implemented or safely scaffolded
- [ ] The profile feels professional, medical-grade, and useful for hospital evaluation
- [ ] No full shortlist, messaging workflow redesign, or hire-tracking flow was prematurely built

## Output Format

When you finish:
1. summarize what was implemented
2. list files added or changed
3. explain how the hospital-facing doctor profile works
4. explain what hospitals can and cannot see
5. explain how discoverability/privacy rules are enforced
6. note any assumptions
7. note anything intentionally deferred to the next chunk
8. provide any commands needed to run or test locally