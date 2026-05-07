# MedicalLinks — Revised CV Chunk 01: CV Upload and AI Extraction at Registration

## Refactor Instruction

This project already has an existing implementation built from the earlier recruiter-led roadmap.

Your task in this chunk is to **update and refactor the current implementation** so it aligns with the revised hospital-access business model.

Do not build a parallel second version of the same feature.
Do not leave outdated recruiter-first assumptions in place if they conflict with the new role model.
Where appropriate, refactor, hide, reroute, deprecate, or simplify old behavior so the platform moves toward the new model cleanly.

This CV-upload feature must be integrated into the existing doctor registration/onboarding flow, not implemented as a separate parallel onboarding system.


## Product Direction Update

MedicalLinks has shifted from a recruiter-led workflow tool to a hospital-access talent platform.

Primary roles are now:
- **Doctor**
- **Hospital User**
- **Admin**

Doctors should be able to join the platform quickly and create a high-quality structured profile with minimal friction.

One of the most important conversion features is allowing a doctor to upload a CV in PDF format and use AI-assisted extraction to prefill their profile.

## Objective

Build the first part of the AI CV onboarding feature:

- doctor uploads CV PDF during initial registration/onboarding
- system parses and extracts structured information
- extracted information is shown in a preview/review screen
- doctor can review before confirming
- partial extraction is allowed
- extraction should not silently overwrite profile data without doctor confirmation

This chunk is about:
- upload
- parsing
- extraction
- preview

It is **not yet** about fully writing all extracted data into the final profile structure.

## Scope of This Chunk

Implement:

1. doctor-side CV upload entry point during early registration/onboarding
2. PDF upload handling
3. AI-assisted CV text parsing/extraction pipeline
4. structured extraction output format
5. extraction preview/review UI
6. error handling for invalid or unreadable files
7. loading/progress states
8. doctor-only access behavior where relevant

Do not implement:
- full final mapping into every profile section yet
- hospital-side CV parsing features
- recruiter/admin CV parsing features
- OCR-heavy multi-file document ingestion system
- non-PDF support unless already trivial
- background queue infrastructure unless absolutely necessary

## Registration Placement Requirement

This feature must be accessible at the **initial stage of doctor registration/onboarding**.

Preferred UX:
- doctor starts onboarding
- sees option to upload CV to speed up profile setup
- uploads CV PDF
- waits for extraction
- reviews extracted info
- proceeds to the next step

This should feel like a fast-start option, not a buried secondary feature.

## Required Functional Flow

### 1. Upload CV PDF
Doctor can upload a CV in PDF format.

Requirements:
- PDF only for this first version
- clear file constraints
- clear upload CTA
- clean failure message if file is invalid

### 2. Parse and Extract
The system should extract structured data from the CV.

Target fields may include:
- full name
- email
- phone
- nationality
- current location
- professional title
- specialty
- subspecialty
- summary/profile statement
- education
- residency/fellowship
- work experience
- licenses
- certifications
- languages
- current employer
- years of experience

It is acceptable for extraction to be partial.
Do not require all fields to be extracted.

### 3. Review Extracted Data
Show the doctor a structured review screen.

The doctor should be able to:
- see extracted sections
- understand what was found
- identify missing fields
- continue even if extraction is partial

At this stage, light editing in the preview is optional, but clear review is required.

### 4. Error / Fallback Handling
Handle cases such as:
- invalid file type
- unreadable PDF
- extraction failure
- weak extraction with limited fields found

Provide a fallback path:
- continue manual profile completion

## Medical Industry Requirements Relevant to This Chunk

This parser is for doctor CVs, so extraction should be optimized for physician profile structures such as:
- specialty / subspecialty
- medical education
- residency
- fellowship
- work experience
- licenses
- certifications
- languages
- GCC-relevant professional details where present

Use professional wording such as:
- Upload CV
- Extract Profile Information
- Review Extracted Details
- Continue to Profile Setup

Avoid casual or consumer language.

Do not claim:
- verified extraction
- guaranteed accuracy
- licensing approval
- credential validation

The extraction should be described as an assistive prefilling tool.

## UI / UX Directives

The onboarding experience must feel:
- modern
- medical-grade
- fast
- trustworthy
- low-friction
- clear

### UX expectations
- doctor understands why uploading a CV helps
- upload feels optional but strongly useful
- extraction feedback is visible
- review step feels safe and transparent
- fallback to manual entry is clear

### Visual expectations
- clean upload card/section
- progress/loading state during parsing
- structured extraction preview
- obvious continue action
- obvious skip/manual fallback

Use the existing design system.

## Technical Requirements

- integrate cleanly into the doctor onboarding/registration flow
- support PDF ingestion
- isolate parsing/extraction logic from UI
- define a structured extraction result format
- handle incomplete extraction gracefully
- prepare the output for the next chunk, which will map it into actual profile fields

If helpful, create services/actions such as:
- uploadDoctorCv
- extractDoctorProfileFromCv
- getCvExtractionPreview
- validateCvPdfUpload

Use different naming if a cleaner fit exists.

## Important Constraints

- Do not silently auto-save extracted data directly into the full profile without user review
- Do not build a giant multi-document ingestion system
- Do not build hospital-side parsing
- Do not overbuild OCR infrastructure
- Keep this chunk focused on CV upload, extraction, and preview

## Definition of Done

- [ ] Doctor can upload a PDF CV during early registration/onboarding
- [ ] PDF validation works
- [ ] CV extraction pipeline exists
- [ ] Structured extraction preview exists
- [ ] Partial extraction is handled gracefully
- [ ] Error/fallback states exist
- [ ] Doctor can continue even if extraction is incomplete
- [ ] The feature feels integrated into early onboarding
- [ ] No full profile-writeback logic was prematurely built

## Output Format

When you finish:
1. summarize what was implemented
2. list files added or changed
3. explain how CV upload and extraction work
4. explain what fields are extracted
5. explain how fallback/error handling works
6. note any assumptions
7. note anything intentionally deferred to the next chunk
8. provide any commands needed to run or test locally