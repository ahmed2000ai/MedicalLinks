# MedicalLinks — Revised Chunk 10: Hire Attribution and Placement Tracking

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

We just finished the interview invitation workflow. Now use the reference files in `Attachments/` plus the current codebase to build **Hire Attribution and Placement Tracking**.

## Reference Material

Before implementing, review these files in `Attachments/`:
- `Attachments/revised_model_roadmap.md`
- `Attachments/02_product_prd.md`
- `Attachments/05_build_brief_for_agent.md`
- `Attachments/MedicalLinks_Business_Concept_GCC_EN.pdf`

Use those files plus the current codebase as supporting context.

## Objective

Build the platform layer that records successful hires and attributes them properly so MedicalLinks can track revenue-generating placements.

This chunk should establish:
- hire / placement record creation
- attribution of the hire to the correct doctor and hospital
- optional linkage to an opportunity or direct-discovery path
- monthly salary capture
- commission percentage capture
- fee amount calculation
- placement status tracking
- admin oversight of placement records

This is the first chunk that directly supports your business model financially.

## Product Context

MedicalLinks is a GCC-focused doctor discovery and hiring platform.

Hospitals pay MedicalLinks a success fee when they hire a candidate sourced through the platform.

To support that model, the platform must accurately track:
- who was hired
- by which hospital
- under which role or sourcing context
- when the hire happened
- what salary was agreed
- what commission percentage applies
- what fee amount is due

This is not full billing yet. It is **placement attribution and fee basis tracking**.

## Scope of This Chunk

Implement:

1. placement / hire record model
2. admin and/or hospital workflow to mark a candidate as hired
3. linkage between hire and:
   - doctor
   - hospital
   - opportunity if applicable
   - shortlist/interview context if helpful
4. monthly salary capture
5. commission percentage capture
6. fee amount calculation
7. placement status tracking
8. admin placement list/detail views
9. role-based permission rules for who can create/edit/finalize hire records

Do not implement:
- invoice issuing workflow
- payment collection workflow
- external accounting integration
- replacement guarantee automation
- advanced dispute workflow
- contract document generation

## Required Placement Model

Support a clean placement record that can include:

- doctor
- hospital organization
- hospital user who initiated or recorded the hire if useful
- opportunity reference if applicable
- placement source type if useful, such as:
  - opportunity-based
  - direct-discovery
  - shortlist-based
- hire/placement date
- offered monthly salary
- commission percentage
- calculated fee amount
- placement status
- notes
- timestamps

You may refine model naming, but the meaning must remain clear.

## Required Placement Statuses

Support statuses such as:
- Draft
- Reported
- Confirmed
- Disputed
- Cancelled

You may adjust names if needed, but the system must support:
- an initial not-final state
- a confirmed/commercially valid state
- a disputed/problem state
- a cancelled/invalid state

## Required Functional Behavior

### 1. Mark Candidate as Hired
There should be a clean workflow for creating a placement record when a hospital hires a doctor.

This can come from:
- shortlist candidate pipeline
- doctor profile
- opportunity/candidate workflow
- interview outcome workflow
- admin action

The first version can prioritize hospital user and admin flows.

### 2. Capture Salary and Commission Basis
When a placement is recorded, the system should support:
- monthly salary input
- agreement-based or manually entered commission percentage
- calculated fee amount

Fee calculation should be simple and transparent:
- `fee = monthly_salary * commission_percentage`

If agreement terms exist for the hospital, use them where appropriate.

### 3. Placement Attribution
The record should make it clear whether the hire came from:
- an opportunity
- direct candidate discovery
- shortlist/interview progression
- or another internal attribution path if needed

Keep this simple but useful for later reporting and invoicing.

### 4. Placement Visibility
Admins should be able to:
- list placements
- view placement details
- review fee basis
- update status if needed

Hospital users may be allowed to:
- create/report a hire
- view hires associated with their organization

Keep role permissions explicit and controlled.

## Medical Industry / Business Requirements Relevant to This Chunk

This chunk supports the commercial side of physician hiring.

It must feel:
- contractual
- trustworthy
- operationally clear
- tied to actual hiring outcomes

Use terminology such as:
- Placement
- Hired
- Hire Date
- Monthly Salary
- Commission Percentage
- Fee Amount
- Hospital
- Doctor
- Opportunity

Avoid casual e-commerce or marketplace wording.

Do not make legal, invoicing, or regulatory claims that the system does not actually support yet.

## UI / UX Directives

The placement workflow and admin views must feel:
- professional
- operational
- high-trust
- financially clear
- simple to review

### Visual expectations
- structured forms for placement creation
- clear financial field grouping
- readable status badges
- placement list/detail pages or panels
- strong metadata presentation

### UX expectations
- hospitals/admins should understand what they are recording
- salary and fee basis should be unambiguous
- status progression should be clear
- the workflow should feel like a serious commercial record, not a casual status toggle

Use the shared design system.

## Technical Requirements

- use the existing hospital, doctor, shortlist, opportunity, and interview data where appropriate
- extend schema carefully
- keep fee calculation logic modular
- support agreement-based commission defaults if already available
- keep role permissions explicit
- prepare the data model for the next chunk: invoice/commercial record tracking

If helpful, create services/actions such as:
- createPlacementRecord
- markCandidateAsHired
- calculatePlacementFee
- listPlacementsForAdmin
- listPlacementsForHospital
- updatePlacementStatus
- getDefaultCommissionForHospital

Use different naming if a cleaner fit exists.

## Important Constraints

- Do not build invoice/payment workflows yet
- Do not build external billing/accounting integrations yet
- Do not overbuild dispute management
- Do not build guarantee/replacement workflows yet
- Keep this chunk focused on placement attribution and fee-basis tracking

## Definition of Done

- [ ] Placement/hire record model exists
- [ ] Hospitals and/or admins can create a placement record
- [ ] Doctor, hospital, and optional opportunity attribution are captured
- [ ] Monthly salary can be recorded
- [ ] Commission percentage can be recorded or defaulted appropriately
- [ ] Fee amount is calculated clearly
- [ ] Placement statuses exist and work
- [ ] Admin can review placements cleanly
- [ ] Role permissions are enforced
- [ ] Existing recruiter-first assumptions are refactored or deprecated where needed
- [ ] No invoice/payment workflow or external accounting integration was prematurely built

## Output Format

When you finish:
1. summarize what was implemented
2. list files added or changed
3. explain how placement attribution works
4. explain how salary, commission, and fee calculation work
5. explain how role permissions are enforced
6. note any assumptions
7. note anything intentionally deferred to the next chunk
8. provide any commands needed to run or test locally