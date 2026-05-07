# MedicalLinks — Revised Chunk 11: Commercial Records and Invoice Tracking

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

We just finished hire attribution and placement tracking. Now use the reference files in `Attachments/` plus the current codebase to build **Commercial Records and Invoice Tracking**.

## Reference Material

Before implementing, review these files in `Attachments/`:
- `Attachments/revised_model_roadmap.md`
- `Attachments/02_product_prd.md`
- `Attachments/05_build_brief_for_agent.md`
- `Attachments/MedicalLinks_Business_Concept_GCC_EN.pdf`

Use those files plus the current codebase as supporting context.

## Objective

Build the platform layer that tracks the commercial side of successful placements after hire attribution has been recorded.

This chunk should establish:
- invoice-ready commercial records
- invoice status tracking
- admin-side commercial review
- linkage between placements and commercial records
- support for agreed commission terms
- support for fee basis visibility and payment follow-up states

This is not full accounting software. It is a **platform-level commercial tracking layer** that supports your success-fee business model.

## Product Context

MedicalLinks is a GCC-focused doctor discovery and hiring platform.

Hospitals pay MedicalLinks upon successful placement. After a hire is recorded, the platform should support a clean commercial workflow for tracking:
- which placement generated a fee
- what fee amount is due
- whether an invoice has been drafted/issued/paid
- whether a record is overdue, waived, or in dispute
- internal notes and follow-up state

This is the operational layer that turns successful hires into trackable revenue.

## Scope of This Chunk

Implement:

1. commercial/invoice record model
2. linkage between placement and commercial record
3. invoice/commercial status tracking
4. admin-facing list/detail views for commercial records
5. hospital-facing limited visibility if appropriate
6. support for notes and follow-up state
7. support for agreement-based defaults where relevant
8. role-based permission controls

Do not implement:
- external accounting integrations
- Stripe/payment gateway integration
- automatic invoice PDF generation unless already trivial and safe
- tax/VAT engine
- legal contract generation
- replacement guarantee automation
- advanced dispute-resolution workflow

## Required Commercial Record Model

Support a clean commercial record that can include:

- placement reference
- hospital organization
- doctor reference
- opportunity reference if applicable
- invoice/commercial status
- monthly salary basis
- commission percentage
- fee amount
- currency if useful
- invoice issue date
- invoice due date
- payment received date
- notes
- timestamps

You may refine naming, but the meaning must remain clear.

## Required Status Model

Support statuses such as:
- Draft
- Issued
- Paid
- Overdue
- Waived
- Disputed
- Cancelled

You may refine names slightly, but the model must support:
- pre-issue internal state
- active issued state
- paid state
- overdue follow-up state
- waived/cancelled exceptions
- disputed/problem cases

## Required Functional Behavior

### 1. Create Commercial Record from Placement
The system should support creating a commercial record from an existing confirmed placement.

This can happen:
- automatically when placement reaches a commercially valid status
- or via explicit admin action

Choose the safer/more maintainable approach for the current codebase.

### 2. Fee Basis Visibility
Each commercial record should clearly show:
- monthly salary
- commission percentage
- fee amount calculation
- linked placement

This should be readable and auditable from the platform’s perspective.

### 3. Invoice Status Handling
Admins should be able to:
- move a record between statuses
- record issue date
- record due date
- record payment date
- add notes
- mark waived/disputed/cancelled when needed

### 4. Admin Commercial Views
Provide an admin-facing way to:
- list commercial records
- filter by status
- open a detail view
- review linked placement context
- see what still needs follow-up

### 5. Hospital Visibility
If appropriate and clean, hospital users may be allowed to see a limited commercial summary for their own placements, such as:
- placement fee status
- issued / paid / overdue state

If that would create instability or product confusion right now, it may be safely deferred or kept minimal.

## Medical Industry / Business Requirements Relevant to This Chunk

This workflow supports success-fee physician placement.

It must feel:
- professional
- contractual
- operationally clear
- commercially trustworthy

Use terminology such as:
- Placement
- Commercial Record
- Invoice Status
- Commission Percentage
- Fee Amount
- Issued
- Paid
- Overdue
- Hospital
- Doctor

Avoid generic ecommerce or consumer billing language.

Do not make tax, legal, or regulatory claims the platform does not truly support.

## UI / UX Directives

The commercial tracking UI must feel:
- structured
- internal/admin-friendly
- financially clear
- high-trust
- easy to review

### Visual expectations
- clear status badges
- readable list/detail structure
- grouped fee-basis fields
- notes area
- linked placement context
- good filtering for status

### UX expectations
- admins should quickly understand what is due, what is paid, and what needs attention
- financial fields should be unambiguous
- status changes should feel intentional and safe
- the UI should feel like internal commercial ops, not generic shopping-cart billing

Use the shared design system.

## Technical Requirements

- build on top of the placement model from the previous chunk
- keep fee and status logic modular
- support agreement-based defaults where already available
- enforce role-based access carefully
- avoid hardcoding assumptions that will block future invoice generation/export

If helpful, create services/actions such as:
- createCommercialRecordFromPlacement
- listCommercialRecordsForAdmin
- getCommercialRecordDetail
- updateCommercialRecordStatus
- updateCommercialRecordDates
- markCommercialRecordPaid
- getOutstandingCommercialSummary

Use different naming if a cleaner fit exists.

## Important Constraints

- Do not build external billing/accounting integrations yet
- Do not build tax/VAT logic yet
- Do not build invoice PDF generation unless already trivial and clearly stable
- Do not overbuild dispute/legal workflow
- Keep this chunk focused on internal commercial record and invoice-status tracking

## Definition of Done

- [ ] Commercial/invoice record model exists
- [ ] Commercial records can be created from placements or placement context
- [ ] Monthly salary, commission percentage, and fee amount are visible
- [ ] Invoice/commercial statuses are implemented
- [ ] Admin can list and review commercial records
- [ ] Admin can update invoice/commercial statuses and key dates
- [ ] Role permissions are enforced
- [ ] Placement linkage is clear
- [ ] Existing recruiter-first assumptions are refactored or deprecated where needed
- [ ] No external accounting/payment integration or advanced tax/legal workflow was prematurely built

## Output Format

When you finish:
1. summarize what was implemented
2. list files added or changed
3. explain how commercial records are created and linked to placements
4. explain how invoice/commercial statuses and dates are handled
5. explain how role permissions are enforced
6. note any assumptions
7. note anything intentionally deferred to the next chunk
8. provide any commands needed to run or test locally