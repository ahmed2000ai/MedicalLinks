# MedicalLinks — Revised Chunk 02: Hospital Agreement and Account Activation

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

We just finished the role and access model reset. Now use the reference files in `Attachments/` plus the current codebase to build the **Hospital Agreement and Account Activation** layer.

## Product Direction Update

MedicalLinks is now a hospital-access talent platform.

Primary roles:
- **Doctor**
- **Hospital User**
- **Admin**

Hospital users should not get full platform access automatically. They should gain access only after platform approval and agreement activation.

Recruiter is no longer a primary MVP role.

## Reference Material

Before implementing, review these files in `Attachments/`:
- `Attachments/revised_model_roadmap.md`
- `Attachments/01_go_to_market_plan.md`
- `Attachments/02_product_prd.md`
- `Attachments/05_build_brief_for_agent.md`
- `Attachments/MedicalLinks_Business_Concept_GCC_EN.pdf`

Use those files plus the current codebase as supporting context.

## Objective

Build the admin-controlled hospital activation and agreement framework that determines whether a hospital can access the doctor pool and platform features.

This chunk should establish:
- hospital account approval flow
- hospital access status
- agreement metadata
- hospital activation/deactivation controls
- admin-only management UI for these controls

This is not yet the full hospital self-service portal. It is the access-control and commercial gatekeeping layer.

## Scope of This Chunk

Implement:

1. hospital account status model
2. agreement/commercial metadata model
3. admin workflow to approve/reject/activate hospitals
4. admin workflow to suspend or expire hospital access
5. internal page(s) to review and manage hospital account status
6. role-based protection for admin-only access
7. hospital access gating based on status

Do not implement:
- hospital candidate search yet
- shortlist features
- hospital-to-doctor messaging
- interview invitation workflow
- invoicing
- hire tracking
- subscription billing
- public hospital signup marketing flow beyond what already exists

## Required Hospital Status Model

Support clear statuses such as:
- `pending`
- `active`
- `suspended`
- `expired`
- `rejected`

You may refine naming if needed, but the model must clearly support:
- waiting for approval
- active access
- revoked access
- expired agreement
- rejected account

## Required Agreement Metadata

Support admin-managed agreement fields such as:
- hospital organization reference
- commission percentage
- agreement start date
- agreement end date
- notes
- service active flag if needed
- optional feature access flags if helpful

For now, this does not need to support full legal-document storage or invoicing logic.

## Required Functional Behavior

### 1. Hospital Account Review
Admins should be able to:
- view hospital organizations
- see current access status
- review and update agreement terms
- approve or reject pending hospitals

### 2. Hospital Activation
Admins should be able to:
- activate hospital access
- suspend access
- mark access expired
- reactivate if appropriate

### 3. Hospital Access Gating
Hospital users should only be able to access the hospital-side platform if their hospital account is in an allowed active state.

If not active, they should see a clear and professional blocked/pending/suspended message.

### 4. Admin Oversight UI
Provide a clean admin-facing management surface for:
- hospital list with status
- hospital detail/edit page or panel
- agreement metadata view/edit
- activation controls

## Medical Industry / Business Requirements Relevant to This Chunk

This is a contract-based B2B access model.

The platform must support:
- controlled hospital access
- commercial agreement awareness
- admin oversight
- hospital activation only after review
- later fee tracking per agreement

Use terminology such as:
- Hospital
- Agreement
- Commission Percentage
- Active Access
- Suspended Access
- Expired Agreement
- Admin Review

Avoid generic marketplace language.

Do not make false legal or regulatory claims.

## UI / UX Directives

The admin workflow must feel:
- professional
- operational
- high-trust
- clear
- easy to scan

### Visible states for hospital users
If a hospital user is not active, show a clean and clear status page/message, such as:
- account pending review
- agreement expired
- access suspended
- contact platform admin

### Admin UI expectations
- clean list/detail layout
- clear status badges
- clear form fields for agreement metadata
- safe action controls for status changes

Use the existing design system.

## Technical Requirements

- use the existing schema and extend carefully
- implement hospital status and agreement data cleanly
- use typed validation where relevant
- keep business logic modular
- protect admin-only management routes
- ensure hospital-user access checks can be reused by future hospital portal features

If helpful, create services/actions such as:
- getHospitalAccountStatus
- updateHospitalAccountStatus
- updateHospitalAgreement
- listHospitalsForAdmin
- canHospitalAccessPlatform

Use different naming if a cleaner fit exists.

## Important Constraints

- Do not build hospital candidate search yet
- Do not build shortlist/interview/hire workflows yet
- Do not build invoice/payment workflows yet
- Do not overbuild contract management
- Keep this chunk focused on access control and agreement metadata only

## Definition of Done

- [ ] Hospital account status model exists
- [ ] Agreement metadata model exists
- [ ] Admin can review and update hospital status
- [ ] Admin can set agreement metadata
- [ ] Active vs blocked hospital access is enforced
- [ ] Hospital users see clear blocked/pending/suspended states when appropriate
- [ ] Admin-only access is enforced for management screens
- [ ] No search, shortlist, interview, or invoicing workflow was prematurely built

## Output Format

When you finish:
1. summarize what was implemented
2. list files added or changed
3. explain how hospital activation and agreement handling works
4. explain how hospital access gating is enforced
5. note any assumptions
6. note anything intentionally deferred to the next chunk
7. provide any commands needed to run or test locally