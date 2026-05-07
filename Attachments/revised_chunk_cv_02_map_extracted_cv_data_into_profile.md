# MedicalLinks — Revised CV Chunk 02: Map Extracted CV Data into Doctor Profile

## Refactor Instruction

This project already has an existing implementation built from the earlier recruiter-led roadmap.

Your task in this chunk is to **update and refactor the current implementation** so it aligns with the revised hospital-access business model.

Do not build a parallel second version of the same feature.
Do not leave outdated recruiter-first assumptions in place if they conflict with the new role model.
Where appropriate, refactor, hide, reroute, deprecate, or simplify old behavior so the platform moves toward the new model cleanly.

Use and extend the current doctor profile data layer and onboarding flow.

This CV-upload feature must be integrated into the existing doctor registration/onboarding flow, not implemented as a separate parallel onboarding system.

## Product Direction Update

MedicalLinks has shifted from a recruiter-led workflow tool to a hospital-access talent platform.

Primary roles are now:
- **Doctor**
- **Hospital User**
- **Admin**



## Product Direction Update

MedicalLinks is a GCC-focused doctor discovery and hiring platform.

Doctors should be able to upload a CV at the beginning of onboarding and have the extracted information used to accelerate profile completion.

## Objective

Build the second part of the AI CV onboarding feature:

- take reviewed CV extraction results
- map them into the structured doctor profile model
- prefill profile sections
- allow doctor confirmation/editing
- integrate with the existing profile builder

This chunk is about:
- mapping
- prefilling
- controlled write-back into the profile flow

## Scope of This Chunk

Implement:

1. mapping extracted CV data into the doctor profile data model
2. controlled prefill of profile sections
3. doctor confirmation step before final save
4. integration with existing doctor profile wizard / onboarding flow
5. profile completion updates based on imported data
6. partial-field handling and safe overwrites

Do not implement:
- hospital-side CV parsing
- recruiter/admin CV parsing
- unsupported document ingestion
- broad bulk import tools

## Required Functional Behavior

### 1. Mapping
Map extracted CV data into profile sections such as:
- personal details
- professional summary
- education
- training
- work experience
- licenses/certifications
- languages

### 2. Prefill
Use the extracted data to prefill profile fields/sections.

### 3. Confirmation
Before final write-back, the doctor should clearly confirm the imported data.

### 4. Partial Import
If only some sections are extracted well:
- import those sections
- leave the rest for manual completion

### 5. Safe Overwrite Rules
Do not blindly overwrite good existing data without clear logic.
Use conservative rules and make user confirmation clear.

## Medical Industry Requirements Relevant to This Chunk

The imported structure should remain suitable for physician hiring workflows:
- specialty
- medical training
- work history
- licenses
- certifications
- languages
- readiness

Do not imply verification or credential approval.

## UI / UX Directives

This should feel like:
- smart prefilling
- controlled import
- safe review
- faster onboarding

The doctor should feel assisted, not overridden.

## Technical Requirements

- reuse the current doctor profile data layer
- keep mapping logic modular
- keep extraction result format reusable
- avoid duplication of profile validation rules
- update profile completion cleanly

If helpful, create services/actions such as:
- mapCvExtractionToDoctorProfile
- applyCvExtractionToProfileDraft
- confirmCvProfileImport

Use different naming if a cleaner fit exists.

## Important Constraints

- Do not silently overwrite existing structured data
- Do not create a second profile system
- Keep this chunk focused on profile prefill and confirmation only

## Definition of Done

- [ ] Reviewed CV extraction can prefill doctor profile sections
- [ ] Mapping into the structured profile model works
- [ ] Doctor confirmation step exists before final import
- [ ] Partial import works cleanly
- [ ] Profile completion updates appropriately
- [ ] Existing profile/onboarding flow integrates cleanly
- [ ] No hospital-side or bulk-ingestion workflow was prematurely built

## Output Format

When you finish:
1. summarize what was implemented
2. list files added or changed
3. explain how extracted CV data maps into the profile
4. explain how confirmation and overwrite behavior work
5. note any assumptions
6. note anything intentionally deferred to a later chunk
7. provide any commands needed to run or test locally