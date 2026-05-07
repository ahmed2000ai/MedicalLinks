# MedicalLinks — Revised Chunk 01: Role and Access Model Reset

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

## Reference Material

Before implementing, review these files in `Attachments/`:
- `Attachments/revised_model_roadmap.md`
- `Attachments/01_go_to_market_plan.md`
- `Attachments/02_product_prd.md`
- `Attachments/05_build_brief_for_agent.md`
- `Attachments/MedicalLinks_Business_Concept_GCC_EN.pdf`

Use those files plus the current codebase as supporting context.

## Objective

Refactor the platform’s role model and access-control structure so the app is centered on:

- **Doctor**
- **Hospital User**
- **Admin**

This chunk is about:
- roles
- permissions
- route guards
- navigation
- dashboard entry behavior
- auth/session role handling where necessary

It is **not yet** about building the full hospital portal or search experience.

## Scope of This Chunk

Implement:

1. updated role model
2. role enum / type cleanup
3. access-control cleanup
4. route guard updates
5. navigation updates
6. login/session role handling updates if needed
7. dashboard entry-point updates by role
8. removal, hiding, or deprecation of recruiter-first user-facing flows
9. transitional compatibility handling for any legacy recruiter data or routes that still exist

Do not implement:
- hospital agreement workflow
- hospital candidate search
- shortlist features
- interview invitation workflow
- hire tracking
- invoice logic
- new messaging behavior
- large new pages beyond what is needed for route/access cleanup

## Required Role Model

### 1. Doctor
This is the applicant/candidate side of the platform.

Doctor users should have access to:
- landing page entry
- login
- doctor dashboard
- profile
- documents/credentials
- doctor-side messages
- doctor-side interview views
- opportunities/applications only where still relevant in the current transition state

Doctor users should not see:
- recruiter dashboard
- recruiter navigation
- hospital-only pages
- admin-only pages

### 2. Hospital User
This becomes a first-class product role.

Hospital users should have access to:
- landing page entry
- login
- hospital dashboard placeholder or current best equivalent
- future hospital search/discovery areas
- hospital-side communication areas where relevant later

Hospital users should not see:
- doctor-only profile editing flows
- recruiter dashboard
- admin-only pages

If the hospital dashboard does not exist yet, create a safe placeholder route and entry behavior.

### 3. Admin
Admin remains the internal control role.

Admin users should have access to:
- admin/internal management areas
- platform oversight areas
- future agreement and commercial tracking areas
- any transitional access needed while refactoring

Admins may retain broad access, but keep it explicit and clean.

### 4. Recruiter
Recruiter is no longer a primary MVP role.

For this chunk:
- remove recruiter from user-facing navigation where possible
- stop using recruiter as the main routing assumption
- stop treating recruiter as the main internal actor in new user-facing flows
- do not fully delete recruiter-related code if it would create instability
- instead, safely deprecate, hide, reroute, or collapse recruiter behavior behind admin where appropriate

The goal is to stop the product from behaving as if recruiter is a main actor.

## Required Refactor Outcomes

### 1. Role Definitions
Update role enums/types/constants/session typing so the system is centered on:
- doctor
- hospital
- admin

If recruiter still exists in legacy data or code, handle it safely and explicitly.

### 2. Route Guards
Refactor access control so routes are aligned to the new role model.

Examples:
- doctor routes stay doctor-only
- hospital routes become hospital-user accessible
- admin routes remain admin-only
- recruiter-only routes should be removed, hidden, redirected, or absorbed appropriately

### 3. Navigation
Update role-based nav so:
- doctors see doctor-relevant items
- hospital users see hospital-relevant items
- admins see admin/internal items
- recruiter-first nav items are removed or hidden from normal use

### 4. Post-Login Behavior
Update role-based redirect behavior so:
- doctor ? doctor dashboard
- hospital user ? hospital dashboard placeholder or current best hospital landing area
- admin ? admin/internal dashboard

Do not continue routing new users into recruiter-centric flows.

### 5. Dashboard Entry Logic
Ensure the app’s main role-aware entry behavior reflects the new product model.

If necessary:
- rename dashboard labels
- adjust route names
- create a hospital dashboard placeholder page
- simplify old recruiter/dashboard assumptions

### 6. Legacy Cleanup Behavior
Where old recruiter-first assumptions exist, prefer:
- rerouting
- hiding
- deprecating
- aliasing to admin/internal behavior
- or simplifying route access

Do not leave obviously conflicting recruiter-first UX visible to end users.

## Medical Industry Requirements Relevant to This Chunk

This platform now supports:
- doctor candidate discovery
- hospital self-service access
- admin oversight

Use terminology such as:
- Doctor
- Hospital User
- Admin
- Candidate Pool
- Opportunity
- Interview
- Credential Readiness

Avoid continuing recruiter-led language where it no longer matches the business model.

Do not make false compliance or regulatory claims.

## UI / UX Directives

This chunk is mainly structural, but any visible UI changes must feel:
- clean
- professional
- medical-grade
- role-appropriate
- calm and clear

### UX expectations
- users should not be confused by irrelevant nav items
- hospital users should feel like first-class platform users
- doctors should not see internal/hospital features
- admin should retain clear platform oversight access
- outdated recruiter-first UX should not remain visible where it conflicts with the new model

If you create placeholder pages during this refactor, keep them clean and minimal.

## Technical Requirements

- update role enums/types/constants
- update session typing and auth checks if needed
- update role guard utilities
- update route protection
- update sidebar/header navigation logic
- update login redirect logic
- preserve stability of the current app while refactoring
- prefer safe migration paths over risky deletions

If old recruiter code is deeply embedded, prefer:
- deprecating
- hiding
- rerouting
- aliasing to admin/internal behavior

rather than large unstable deletions in this chunk

## Suggested Transitional Strategy

Use a conservative refactor strategy:
- keep legacy recruiter code only where needed for system stability
- remove recruiter from primary user-facing flows
- align visible product behavior to doctor/hospital/admin
- document any temporary compatibility shims or aliases you introduce

## Important Constraints

- Do not build the actual hospital candidate-search portal yet
- Do not build agreement logic yet
- Do not build shortlist/interview/hire workflows yet
- Do not over-delete legacy recruiter code if it may break the app
- Focus on role model reset and access alignment only

## Definition of Done

Before considering this chunk complete, verify all of the following:

- [ ] The primary role model is now doctor / hospital user / admin
- [ ] Recruiter is no longer treated as a primary user-facing role
- [ ] Role enums/types/constants are updated cleanly
- [ ] Session/auth role handling is aligned to the new model
- [ ] Route guards are aligned to the new role model
- [ ] Navigation is aligned to the new role model
- [ ] Post-login redirects are aligned to the new role model
- [ ] Hospital user has a valid entry route or placeholder dashboard
- [ ] Doctor experience still works
- [ ] Admin experience still works
- [ ] Legacy recruiter-first visible UX has been removed, hidden, rerouted, or safely deprecated where appropriate
- [ ] The refactor does not introduce broken role-routing behavior
- [ ] No hospital agreement, shortlist, interview-invite, or hire-tracking features were prematurely built

## Output Format

When you finish:
1. summarize what was implemented
2. list files added or changed
3. explain how the role/access model now works
4. explain how recruiter was handled during the refactor
5. explain how post-login routing now works
6. list any transitional compatibility shims, aliases, or deprecated paths left in place
7. note any assumptions
8. note anything intentionally deferred to the next chunk
9. provide any commands needed to run or test locally