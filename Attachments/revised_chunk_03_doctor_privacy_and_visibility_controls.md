# MedicalLinks — Revised Chunk 03: Doctor Privacy and Visibility Controls

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

We just finished hospital agreement and account activation. Now use the reference files in `Attachments/` plus the current codebase to build **Doctor Privacy and Visibility Controls**.

## Product Direction Update

MedicalLinks is now a hospital-access talent platform.

Primary roles:
- **Doctor**
- **Hospital User**
- **Admin**

Doctors are not just applicants anymore. They are part of a searchable candidate pool. Because of that, privacy and visibility controls are now essential.

Hospitals should be able to discover doctors, but doctors must control how visible they are and what information hospitals can see.

## Reference Material

Before implementing, review these files in `Attachments/`:
- `Attachments/revised_model_roadmap.md`
- `Attachments/02_product_prd.md`
- `Attachments/03_candidate_intake_form_en.md`
- `Attachments/04_candidate_intake_form_ar.md`
- `Attachments/MedicalLinks_Business_Concept_GCC_EN.pdf`

Use those files plus the current codebase as supporting context.

## Objective

Build the doctor-side privacy and visibility system that controls how doctors appear in the hospital-access candidate pool.

This chunk should establish:
- doctor visibility settings
- open-to-opportunities status
- candidate-pool visibility controls
- contact privacy rules
- region/country visibility preferences
- hospital-facing preview vs restricted private data behavior

This is one of the most important trust features for the new product model.

## Scope of This Chunk

Implement:

1. doctor visibility settings model
2. doctor privacy settings UI
3. open-to-opportunities toggle/status
4. profile visibility states for hospital discovery
5. contact information privacy rules
6. country / market visibility preferences if appropriate
7. hospital-facing limited preview behavior
8. admin oversight hooks if needed

Do not implement:
- full hospital search UI yet
- shortlist workflow
- hospital messaging workflow
- interview invitation workflow
- hire tracking
- monetization/invoicing logic

## Required Privacy / Visibility Capabilities

### 1. Visibility State
Support doctor visibility states such as:
- visible to active hospitals
- hidden from hospital discovery
- paused / not currently open
- possibly limited/preview-only if helpful

You may refine exact labels, but the user should clearly understand whether they are discoverable or not.

### 2. Open to Opportunities
Support a doctor-facing status such as:
- actively open
- selectively open
- paused

This should influence how hospitals can discover them later.

### 3. Contact Privacy
Doctors should not expose full personal contact details by default in the hospital candidate pool.

Support rules such as:
- hospitals can see professional summary data
- direct personal contact details remain hidden by default
- personal details can remain restricted until later workflow stages if needed

At minimum, prevent uncontrolled exposure of phone/email in hospital-facing discovery views.

### 4. Visibility Preferences
Support useful controls such as:
- visible in all active GCC markets
- visible only for selected countries
- visible only when profile is complete enough
- visible only if open-to-opportunities is enabled

You can simplify if needed, but there must be meaningful privacy control.

### 5. Hospital-Facing Candidate Preview
Prepare the platform so hospitals can later see a candidate preview that includes:
- professional title
- specialty
- experience
- current region/country
- licensing/readiness summary
- high-level preferences

But excludes private personal details unless explicitly allowed.

## Medical Industry / Product Requirements Relevant to This Chunk

Because this is a doctor discovery platform:
- doctors must trust the platform before joining
- hospitals need enough information to evaluate candidate relevance
- the product must balance discoverability with privacy
- the platform should feel serious, not like an open public directory

Use terminology such as:
- Profile Visibility
- Open to Opportunities
- Candidate Pool
- Hospital Access
- Contact Privacy
- Discoverability
- Readiness

Avoid generic social-network language.

Do not make false privacy/compliance claims.

## UI / UX Directives

The doctor-facing privacy controls must feel:
- clear
- professional
- confidence-building
- easy to understand
- not intimidating

### UX expectations
Doctors should understand:
- who can see them
- what hospitals can see
- how to pause visibility
- how to control discoverability

### Suggested UI
You may add or extend a doctor settings/privacy area with:
- visibility status card
- toggle(s) or radio selection
- short explanatory text
- selected-country visibility controls if included
- preview summary of what hospitals can see

### Hospital-facing behavior
If any candidate preview is visible in this chunk, it should:
- show useful professional information
- hide private contact details
- reflect the visibility rules cleanly

Use the existing design system.

## Technical Requirements

- use the existing profile and role model
- extend schema carefully if needed
- implement privacy/visibility flags cleanly
- keep access rules reusable for future hospital search pages
- use typed validation
- avoid scattering visibility logic across components

If helpful, create services/actions such as:
- updateDoctorVisibilitySettings
- getDoctorVisibilitySettings
- isDoctorDiscoverable
- getHospitalSafeDoctorPreview

Use different naming if a cleaner fit exists.

## Important Constraints

- Do not build the full hospital search experience yet
- Do not build messaging/interview/hire workflows yet
- Do not expose personal contact details broadly
- Do not overcomplicate privacy controls beyond practical MVP needs
- Keep this chunk focused on trust, visibility, and discoverability control

## Definition of Done

- [ ] Doctors can control visibility/discoverability
- [ ] Doctors can set open-to-opportunities status
- [ ] Privacy settings UI exists
- [ ] Contact details are protected from broad hospital exposure
- [ ] Visibility preferences are stored and enforced
- [ ] The system can support hospital-safe doctor previews
- [ ] The implementation feels clear and trustworthy for doctors
- [ ] No hospital search, shortlist, messaging, or interview workflow was prematurely built

## Output Format

When you finish:
1. summarize what was implemented
2. list files added or changed
3. explain how doctor visibility and privacy controls work
4. explain what hospitals can and cannot see at this stage
5. note any assumptions
6. note anything intentionally deferred to the next chunk
7. provide any commands needed to run or test locally