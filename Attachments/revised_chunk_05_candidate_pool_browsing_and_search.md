# MedicalLinks — Revised Chunk 05: Candidate Pool Browsing and Search

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

We just finished the hospital dashboard. Now use the reference files in `Attachments/` plus the current codebase to build **Candidate Pool Browsing and Search** for hospital users.

## Product Direction Update

MedicalLinks is now a hospital-access talent platform.

Primary roles:
- **Doctor**
- **Hospital User**
- **Admin**

One of the most important monetized capabilities is hospital access to a searchable doctor pool.

Hospitals should be able to:
- browse doctors
- search by keyword
- filter by structured medical criteria
- view hospital-safe candidate cards
- save promising candidates for later review

This chunk focuses on candidate discovery, not yet the full shortlist workflow.

## Reference Material

Before implementing, review these files in `Attachments/`:
- `Attachments/revised_model_roadmap.md`
- `Attachments/02_product_prd.md`
- `Attachments/03_candidate_intake_form_en.md`
- `Attachments/04_candidate_intake_form_ar.md`
- `Attachments/MedicalLinks_Business_Concept_GCC_EN.pdf`
- `Attachments/UI1.png`
- `Attachments/UI2.png`

Use those files plus the current codebase as supporting context.

## Objective

Build the hospital-side candidate pool browsing and search experience.

This chunk should establish:
- hospital-facing doctor directory
- keyword search
- structured filters
- candidate result cards/list rows
- hospital-safe doctor preview data
- role-based access
- discoverability rules tied to doctor visibility controls

This is a core product surface and one of the most important parts of the new business model.

## Scope of This Chunk

Implement:

1. candidate directory/search page for hospital users
2. keyword search
3. filter panel/bar
4. doctor result cards or rows
5. pagination or sensible result limiting
6. hospital-safe doctor preview data
7. doctor visibility/discoverability enforcement
8. save/favorite candidate action scaffold if easy

Do not implement:
- full shortlist pipeline management yet
- full hospital-to-doctor messaging workflow changes
- interview invitation workflow
- hire tracking
- invoicing
- candidate comparison view unless trivial

## Required Search / Filter Capabilities

Support a practical search and filtering experience for hospitals using structured doctor profile data.

### Minimum filters
Support filters such as:
- specialty
- subspecialty if available
- years of experience
- post-specialty experience if available
- current country / region
- preferred GCC countries if useful
- languages spoken
- licensing authority / licensing readiness
- relocation willingness
- visa sponsorship need
- availability / open-to-opportunities status
- expected compensation range if already modeled

You may simplify the initial filter set slightly if needed, but it must still feel genuinely useful for physician discovery.

### Keyword search
Support search across relevant fields such as:
- name or alias if allowed by visibility rules
- specialty
- subspecialty
- current title
- employer
- languages
- locations

If full name visibility is restricted, the search experience should still work on hospital-safe fields.

## Required Candidate Result Presentation

Each result should feel like a hospital-facing candidate card or professional summary row.

Include useful fields such as:
- professional title
- specialty
- subspecialty if available
- years of experience
- current country
- current role/employer summary if allowed
- licensing / readiness indicators
- relocation or availability signal
- short summary
- quick action such as:
  - View Profile
  - Save Candidate

Keep contact details hidden unless explicitly allowed by privacy rules.

## Required Discoverability / Visibility Enforcement

This chunk must respect the doctor privacy and discoverability controls built in the previous chunk.

Hospitals should only see doctors who are:
- visible according to their settings
- open/discoverable as configured
- not hidden/paused
- visible in the relevant market rules if such rules are implemented

Personal contact details should not be broadly exposed.

This is one of the most important business-trust requirements.

## Save / Favorite Candidate Action

If easy and clean, include a lightweight action to:
- save/favorite candidate

This does not need to be the full shortlist workflow yet.
It can be a simple saved-state action that the next chunk expands.

If implementing this now would create instability, it can be safely scaffolded.

## Medical Industry / Business Requirements Relevant to This Chunk

This candidate search surface must support physician recruitment realities such as:
- specialty-first discovery
- licensing/readiness awareness
- structured medical credentials
- GCC relocation and sponsorship considerations
- professional trust and privacy

Use terminology such as:
- Candidate Pool
- Doctor
- Specialty
- Credential Readiness
- Licensing Readiness
- Open to Opportunities
- Relocation
- Availability

Avoid generic freelance or social-network wording.

Do not make false compliance or regulatory claims.

## UI / UX Directives

The candidate search experience must feel:
- premium
- operational
- hospital-friendly
- medical-grade
- fast to scan
- information-rich without clutter

### Visual expectations
- clean search/filter bar or side filter panel
- structured result cards/rows
- clear metadata hierarchy
- professional tags/badges
- obvious result actions
- strong empty-state and no-result handling

### UX expectations
- hospitals should find relevant candidates quickly
- filters should feel useful, not overwhelming
- results should support rapid review
- privacy boundaries should feel intentional and trustworthy

Use the shared design system.

## Technical Requirements

- use existing doctor profile data and privacy settings
- keep search/filter logic modular
- avoid burying search logic inside UI components
- use typed filter/query objects where possible
- support scalable future extension into shortlist and messaging
- ensure hospital-only access is enforced

If helpful, create services/selectors such as:
- searchDoctorsForHospital
- getHospitalSafeDoctorResults
- buildDoctorSearchFilters
- isDoctorVisibleToHospital
- saveCandidateForHospital

Use different naming if a cleaner fit exists.

## Important Constraints

- Do not build full shortlist pipeline management yet
- Do not build messaging workflow changes yet
- Do not build interview invitation workflow yet
- Do not expose private contact details broadly
- Keep this chunk focused on candidate discovery and search only

## Definition of Done

- [ ] Hospital-facing candidate directory/search page exists
- [ ] Hospital-only access is enforced
- [ ] Keyword search works
- [ ] Structured filters work
- [ ] Result cards/rows show useful hospital-safe candidate data
- [ ] Doctor privacy/discoverability rules are enforced
- [ ] Personal contact details remain protected
- [ ] Empty/no-result states are handled cleanly
- [ ] Save/favorite candidate action is implemented or safely scaffolded
- [ ] The search experience feels useful and professional for hospital users
- [ ] No shortlist pipeline, messaging workflow change, or hire-tracking flow was prematurely built

## Output Format

When you finish:
1. summarize what was implemented
2. list files added or changed
3. explain how candidate search and filters work
4. explain how doctor visibility/privacy rules are enforced
5. explain what hospitals can see in search results
6. note any assumptions
7. note anything intentionally deferred to the next chunk
8. provide any commands needed to run or test locally