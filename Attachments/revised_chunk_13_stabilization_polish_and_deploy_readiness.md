# MedicalLinks — Revised Chunk 13: Stabilization, Polish, and Deploy Readiness

## Refactor Instruction

This project already has an existing implementation built from the earlier recruiter-led roadmap.

Your task in this chunk is to **update and stabilize the current implementation** so it aligns with the revised hospital-access business model and is safe to demo, test, and iterate on.

Do not build a parallel second version of the same feature.
Do not reintroduce outdated recruiter-first assumptions.
Where appropriate, refactor, hide, reroute, deprecate, simplify, or clean up old behavior so the platform feels coherent and production-like for staging use.

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

We just finished the revised business-model refactor. Now use the reference files in `Attachments/` plus the current codebase to complete a **stabilization, polish, and deploy-readiness pass**.

## Reference Material

Before implementing, review these files in `Attachments/`:
- `Attachments/revised_model_roadmap.md`
- `Attachments/01_go_to_market_plan.md`
- `Attachments/02_product_prd.md`
- `Attachments/05_build_brief_for_agent.md`
- `Attachments/MedicalLinks_Business_Concept_GCC_EN.pdf`
- `Attachments/Landing_Page.png`

Use those files plus the current codebase as supporting context.

## Objective

Make the revised MedicalLinks product feel coherent, stable, demo-ready, and staging-ready.

This chunk should establish:
- final role-flow sanity checks
- broken-route and broken-nav cleanup
- data and empty-state cleanup
- seed/demo-data polish
- visual consistency pass
- error-handling cleanup
- permissions sanity checks
- staging-readiness cleanup
- light QA checklist support

This is not a new feature chunk. It is a **product hardening and coherence pass**.

## Scope of This Chunk

Implement:

1. role-flow sanity check and cleanup
2. route and navigation cleanup
3. empty-state and loading-state polish
4. seed/demo-data quality improvements
5. common error-state cleanup
6. permission edge-case cleanup
7. broken-link / broken-route cleanup
8. UX consistency pass across doctor, hospital, and admin surfaces
9. deploy-readiness cleanup for staging
10. concise internal README / runbook update if useful

Do not implement:
- new major business workflows
- external integrations
- advanced analytics
- production billing/payment integrations
- multilingual rollout
- major redesign from scratch

## Required Stabilization Areas

### 1. Role and Routing Sanity Check
Verify and clean up:
- doctor login flow
- hospital user login flow
- admin login flow
- post-login redirects
- protected routes
- blocked-state handling for inactive hospitals
- no old recruiter-first routes leaking into normal UX

### 2. Navigation and Layout Cleanup
Review and clean:
- doctor nav
- hospital nav
- admin nav
- menu labels
- hidden routes
- role-specific dashboard links
- layout consistency across key pages

Remove or fix:
- dead links
- duplicate links
- outdated labels
- nav items pointing to deprecated flows

### 3. Seed / Demo Data Quality
Ensure staging/demo data is useful and coherent.

Improve as needed:
- doctor demo profiles
- hospital demo accounts
- opportunities
- shortlist records
- messages
- interviews
- placements
- commercial records

The demo data should support a meaningful walkthrough of the revised business model.

### 4. Empty, Error, and Loading States
Make sure important pages have polished fallback states.

Examples:
- no candidates found
- no messages yet
- no shortlisted candidates yet
- no interviews yet
- hospital pending approval
- no commercial records yet
- no placements yet

Error states should be:
- clear
- professional
- non-technical where user-facing

### 5. Permission and Edge-Case Cleanup
Check for edge cases such as:
- doctor trying to access hospital-only route
- hospital trying to access doctor-only edit pages
- admin access working cleanly
- hidden/paused doctors not showing in hospital views
- suspended/expired hospital accounts blocked consistently
- save/message/interview actions respecting visibility and account status

### 6. Visual Consistency Pass
Without redesigning from scratch, improve coherence across:
- page headers
- section spacing
- buttons
- cards
- status badges
- side panels
- table/list states
- forms
- action bars

The product should feel like one consistent platform, not a stitched set of chunks.

### 7. Deploy / Staging Readiness
Make sure the app is ready for staging/demo use by checking:
- environment variable assumptions
- auth host trust assumptions
- Prisma/client generation stability
- migration/seed stability
- obvious build/runtime issues
- README or runbook notes for staging deployment

## Medical Industry / Business Requirements Relevant to This Chunk

The final staging product should feel like:
- a GCC doctor discovery and hiring platform
- hospital-access controlled
- trustworthy for doctors
- operationally useful for hospitals
- commercially trackable for admins

Use terminology consistently:
- Doctor
- Hospital User
- Admin
- Candidate Pool
- Shortlist
- Interview
- Placement
- Commercial Record
- Opportunity

Avoid slipping back into recruiter-led or generic marketplace language.

Do not make false compliance, regulatory, or verification claims.

## UI / UX Directives

This polish pass should make the product feel:
- stable
- coherent
- premium enough for a real co-founder demo
- easy to understand by non-technical users
- credible for both doctors and hospitals

### UX expectations
A doctor should be able to:
- log in
- understand their dashboard
- manage profile/visibility
- receive messages and interviews

A hospital user should be able to:
- log in
- understand the dashboard
- browse/search doctors
- save candidates
- message doctors
- invite to interview
- understand the placement/commercial path at a high level

An admin should be able to:
- manage hospitals
- manage agreements
- view placements and commercial records
- oversee the platform

## Technical Requirements

- fix issues in the existing codebase rather than creating new parallel flows
- keep cleanup modular and targeted
- preserve the revised business model
- avoid unnecessary schema churn unless needed for correctness
- improve staging reliability

If helpful, add or update:
- route guards
- nav configs
- demo seed logic
- empty/error state components
- deployment notes in README
- environment documentation

## Suggested Validation Checklist

Before finishing, verify at least:
- doctor can log in and use doctor flows
- hospital can log in and use hospital flows
- inactive hospital is blocked correctly
- admin can log in and use admin flows
- candidate search works
- shortlist works
- messaging works
- interview invites work
- placement tracking works
- commercial record tracking works
- no obvious dead-end navigation remains
- staging build is clean

## Important Constraints

- Do not start brand new feature work unrelated to stabilization
- Do not over-engineer QA tooling
- Do not build enterprise DevOps infrastructure
- Do not redesign the whole app
- Keep this chunk focused on stability, coherence, and demo readiness

## Definition of Done

- [ ] Role-based routing and redirects are clean
- [ ] Navigation is coherent for doctor, hospital, and admin
- [ ] Broken links/routes are fixed
- [ ] Empty/loading/error states are polished
- [ ] Demo/seed data is useful and coherent
- [ ] Key permission edge cases are handled
- [ ] Visual consistency is improved across major product areas
- [ ] Staging/deploy-readiness issues are cleaned up
- [ ] The revised product is ready for private demo/testing
- [ ] No unrelated major new feature work was introduced

## Output Format

When you finish:
1. summarize what was stabilized or polished
2. list files added or changed
3. explain the most important fixes or cleanup made
4. explain any deploy/staging-readiness changes
5. note any remaining weak points or recommended next improvements
6. note any assumptions
7. provide any commands needed to run or test locally