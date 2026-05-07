# MedicalLinks — Revised Chunk 12: Opportunity Model and Navigation Cleanup

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

We just finished commercial records and invoice tracking. Now use the reference files in `Attachments/` plus the current codebase to complete the **Opportunity Model and Navigation Cleanup**.

## Reference Material

Before implementing, review these files in `Attachments/`:
- `Attachments/revised_model_roadmap.md`
- `Attachments/01_go_to_market_plan.md`
- `Attachments/02_product_prd.md`
- `Attachments/05_build_brief_for_agent.md`
- `Attachments/MedicalLinks_Business_Concept_GCC_EN.pdf`
- `Attachments/Landing_Page.png`
- `Attachments/UI1.png`
- `Attachments/UI2.png`

Use those files plus the current codebase as supporting context.

## Objective

Clean up the product so the current implementation feels coherent under the revised business model.

This chunk should establish:
- a discovery-first product structure
- a cleaner opportunity model that supports both:
  - doctor-applies-to-opportunity
  - hospital-discovers-doctor-directly
- final navigation cleanup across doctor, hospital, and admin roles
- removal or de-emphasis of outdated recruiter-centric and application-first assumptions
- consistent dashboard/home-entry behavior
- clearer role-based information architecture

This is a consolidation/refinement chunk that makes the platform feel like **one product built for the new business model**, instead of a layered mix of old and new assumptions.

## Product Context

MedicalLinks is now a GCC-focused doctor discovery and hiring platform.

Opportunities still matter, but they are no longer the only center of the product.

The platform now supports two primary connection paths:

### Path A — Opportunity-led
- doctor browses opportunity
- doctor applies
- hospital/admin tracks candidate progression

### Path B — Discovery-led
- hospital searches doctor pool
- hospital shortlists doctor
- hospital messages doctor
- hospital invites doctor to interview
- hire is recorded and fee is tracked

Both paths should coexist, but the product should no longer feel trapped inside an old recruiter/application-first structure.

## Scope of This Chunk

Implement:

1. opportunity model cleanup/refinement
2. navigation cleanup across all roles
3. route cleanup / renaming where needed
4. doctor dashboard/nav cleanup
5. hospital dashboard/nav cleanup
6. admin dashboard/nav cleanup
7. de-emphasis or removal of outdated recruiter-first UX
8. alignment of CTA labels, menu labels, and product wording
9. entry-point cleanup so each role lands in the correct “home”
10. consistency pass across role-based product surfaces

Do not implement:
- brand new major workflows unrelated to cleanup
- external integrations
- advanced analytics/BI suite
- subscription billing
- multilingual rollout
- a full redesign of every page from scratch

## Required Opportunity Model Cleanup

Refine the current opportunity model so it supports the revised platform direction.

### Requirements
- opportunities remain available as a valid path for doctors
- hospitals may still manage opportunities
- doctors may still browse and apply where relevant
- but opportunities should no longer be treated as the only core connection model
- direct hospital discovery of doctors must remain a first-class path

### Practical cleanup goals
- remove wording or assumptions that imply every interaction must start with an application
- ensure doctor profile, shortlist, messaging, interview, and hire flows can work independently of opportunities
- allow opportunity linkage where useful, but do not force it where direct discovery is the real path

### If needed
Introduce or refine concepts such as:
- optional opportunity linkage in hospital workflows
- source/origin labels for outreach or placements
- cleaner distinction between:
  - application-driven workflow
  - direct discovery workflow

Keep the model practical and stable.

## Required Navigation / Information Architecture Cleanup

Review and clean all role-based navigation and home-entry logic.

### Doctor navigation should prioritize
- Dashboard
- My Profile
- Documents / Credentials
- Messages
- Interviews
- Opportunities (if still relevant)
- Settings

### Hospital navigation should prioritize
- Dashboard
- Candidate Pool
- Shortlist
- Messages
- Interviews
- Opportunities
- Placement / Hiring records if appropriate
- Settings

### Admin navigation should prioritize
- Admin Dashboard
- Hospitals
- Doctors / candidate oversight if appropriate
- Agreements
- Placements
- Commercial Records
- Messages / oversight if appropriate
- Settings

### Recruiter-first navigation
- remove
- hide
- deprecate
- or reroute

Do not leave outdated recruiter-first items visible if they no longer fit the product.

## Required Label / Copy Cleanup

Update product wording so it aligns with the revised business model.

Prefer wording such as:
- Candidate Pool
- Doctors
- Hospital Access
- Shortlist
- Interview Invitation
- Placement
- Commercial Record
- Opportunity
- Hiring

Avoid outdated or misleading wording such as:
- recruiter-led assumptions in primary navigation
- terms that imply all hiring starts from job applications
- labels that no longer match the actual role model

## Required Role Home / Entry Cleanup

Ensure each role lands in the right place after login.

### Doctor
lands on:
- doctor dashboard

### Hospital User
lands on:
- hospital dashboard

### Admin
lands on:
- admin dashboard or internal overview

Also review:
- top-level redirects
- route guards
- empty states
- dashboard labels
- menu highlighting

## Medical Industry / Business Requirements Relevant to This Chunk

This cleanup must reinforce that MedicalLinks is:
- a doctor discovery and hiring platform
- hospital-access controlled
- GCC-focused
- trust-based
- commercially structured

Use terminology such as:
- Doctor
- Hospital User
- Candidate Pool
- Opportunity
- Shortlist
- Interview
- Placement
- Commercial Record

Avoid drifting back into generic recruiter CRM language unless explicitly confined to legacy admin/internal support.

Do not make false compliance or regulatory claims.

## UI / UX Directives

This is a consolidation chunk, so the UI/UX goal is coherence.

The product should feel:
- consistent
- intentional
- role-aware
- simpler
- cleaner
- more obviously aligned to the new business model

### UX expectations
- each role should immediately understand what the product is for them
- there should be fewer outdated or duplicate routes
- navigation should reflect actual priority workflows
- opportunity flows and direct-discovery flows should coexist without confusion

### Visual expectations
- preserve the existing design system
- do not redesign every screen
- focus on structural coherence, labels, and route/navigation quality

## Technical Requirements

- refactor existing routes and nav configs instead of creating parallel duplicate structures
- keep changes modular and explicit
- preserve stable existing functionality while simplifying outdated assumptions
- update role redirects, menu definitions, layout wrappers, and route guards where needed
- support both opportunity-led and direct-discovery-led workflows cleanly

If helpful, create or update helpers/config such as:
- roleHomeRouteMap
- roleNavigationConfig
- opportunitySourceType helpers
- connectionPath helpers
- placementSource labels
- route deprecation/redirect utilities

Use different naming if a cleaner fit exists.

## Important Constraints

- Do not build entirely new large features unrelated to cleanup
- Do not remove opportunities from the product
- Do not force everything through opportunities
- Do not leave recruiter-first UX visible where it conflicts with the revised model
- Keep this chunk focused on coherence, information architecture, and flow cleanup

## Definition of Done

- [ ] Opportunity model assumptions are cleaned up for the revised business model
- [ ] Direct discovery and opportunity-driven workflows can coexist cleanly
- [ ] Role-based navigation is cleaned up for doctor, hospital, and admin
- [ ] Recruiter-first visible UX is removed, hidden, rerouted, or deprecated where appropriate
- [ ] Role home/dashboard entry behavior is correct
- [ ] Labels and product wording better reflect the revised business model
- [ ] The product feels structurally coherent after the revised refactors
- [ ] Existing working functionality is preserved
- [ ] No unrelated major new feature work was introduced

## Output Format

When you finish:
1. summarize what was implemented
2. list files added or changed
3. explain how the opportunity model was cleaned up
4. explain how navigation and role home behavior were updated
5. explain what outdated recruiter-first assumptions were removed or deprecated
6. note any assumptions
7. note anything intentionally deferred to a later polish pass
8. provide any commands needed to run or test locally