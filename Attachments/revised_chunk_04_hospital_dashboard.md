# MedicalLinks — Revised Chunk 04: Hospital Dashboard

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

We just finished doctor privacy and visibility controls. Now use the reference files in `Attachments/` plus the current codebase to build the **Hospital Dashboard**.

## Product Direction Update

MedicalLinks is now a hospital-access talent platform.

Primary roles:
- **Doctor**
- **Hospital User**
- **Admin**

Hospitals are now first-class users of the product. They need a dedicated dashboard that helps them:
- understand their access status
- navigate the candidate pool
- manage saved candidates
- track interviews
- monitor active opportunities
- see recent activity

Recruiter is no longer a primary MVP role.

## Reference Material

Before implementing, review these files in `Attachments/`:
- `Attachments/revised_model_roadmap.md`
- `Attachments/02_product_prd.md`
- `Attachments/05_build_brief_for_agent.md`
- `Attachments/MedicalLinks_Business_Concept_GCC_EN.pdf`
- `Attachments/UI1.png`

Use those files plus the current codebase as supporting context.

## Objective

Build a hospital-user home/dashboard experience that acts as the main operational entry point for active hospital accounts.

This chunk should establish:
- hospital dashboard home page
- hospital-facing KPI/summary cards
- quick actions
- saved candidates summary
- upcoming interviews summary
- recent activity / notifications visibility
- active opportunities summary

This is not yet the full candidate-search product. It is the hospital-side home surface that prepares users for those workflows.

## Scope of This Chunk

Implement:

1. hospital dashboard route/page
2. role-based hospital-only access
3. hospital KPI/summary cards
4. quick actions panel
5. saved candidates summary
6. upcoming interviews summary
7. active opportunities summary
8. recent activity / alerts summary
9. blocked-state handling for inactive/suspended hospitals

Do not implement:
- full candidate directory/search yet
- shortlist pipeline detail yet
- hospital-to-doctor messaging workflow changes
- interview invitation creation flow
- hire tracking
- invoicing
- advanced analytics/reporting

## Required Dashboard Areas

### 1. Welcome / Header Area
Show a hospital-facing welcome section that reflects the hospital organization context.

Possible elements:
- organization name
- short operational summary
- access/plan status if useful
- quick navigation entry points

### 2. KPI / Summary Cards
Include a useful set of summary cards such as:
- visible candidate pool count placeholder or actual count if easy
- saved candidates count
- active opportunities count
- upcoming interviews count
- unread messages count if available
- recent activity count if useful

Do not overbuild analytics here. Keep it operational and simple.

### 3. Quick Actions
Add hospital-relevant actions such as:
- Browse Candidates
- View Shortlist
- Open Opportunities
- Check Interviews
- Open Messages

If some target pages are not fully built yet, use safe placeholder routes or future-ready linking.

### 4. Saved Candidates Summary
Show a compact summary of currently saved/shortlisted candidates, such as:
- recent saved candidates
- count by shortlist stage if available
- quick links to continue reviewing

If shortlist is not built yet, use a placeholder-ready summary that can be upgraded in the next chunk.

### 5. Upcoming Interviews Summary
Show upcoming interviews relevant to the hospital, including:
- candidate name or safe profile label
- specialty
- date/time
- interview format if available
- urgency

This should integrate with existing interview records where possible.

### 6. Active Opportunities Summary
Show current open opportunities for the hospital, such as:
- title
- specialty
- location
- status
- number of applications or interested candidates if available

This should help hospitals see what roles they are actively hiring for.

### 7. Recent Activity / Alerts
Show recent hospital-relevant activity, such as:
- new candidate message
- interview status update
- new saved candidate event if available
- account status / agreement notices if relevant

Keep this concise and useful.

## Blocked / Non-Active Hospital Behavior

Hospital users whose organizations are not active should not access the functional dashboard.

If the hospital account is:
- pending
- suspended
- expired
- rejected

show a clear blocked-state page or inline state with messaging such as:
- access pending approval
- agreement expired
- access suspended
- contact platform admin

This must integrate with the agreement/access logic from the prior chunk.

## Medical Industry / Business Requirements Relevant to This Chunk

This dashboard supports contract-based hospital access to a doctor discovery platform.

It should feel:
- professional
- B2B
- healthcare-specific
- high-trust
- operationally useful

Use terminology such as:
- Candidate Pool
- Saved Candidates
- Opportunities
- Interviews
- Hospital Access
- Active Roles
- Specialty
- Credential Readiness

Avoid recruiter-led wording and generic marketplace language.

Do not make false compliance or regulatory claims.

## UI / UX Directives

The hospital dashboard must feel:
- polished
- calm
- operational
- premium
- easy to scan
- clearly designed for hospital staffing teams

### Visual expectations
- use the shared design system
- card-based layout
- clean information hierarchy
- role-appropriate navigation
- subtle emphasis on important counts/actions
- no clutter

### UX expectations
- hospital users should quickly know what to do next
- quick actions should be obvious
- account/access state should be clear
- summaries should feel useful even before the full portal is complete

## Technical Requirements

- use existing role/access logic
- use hospital account/agreement status from the previous chunk
- aggregate hospital-specific data cleanly
- avoid hardcoding values where real summary logic is already available
- create reusable selectors/services where helpful

If helpful, create services such as:
- getHospitalDashboardSummary
- getHospitalQuickActions
- getHospitalSavedCandidatesSummary
- getHospitalUpcomingInterviews
- getHospitalActiveOpportunities
- getHospitalRecentActivity

Use different naming if a cleaner fit exists.

## Important Constraints

- Do not build the full candidate-search experience yet
- Do not build shortlist pipeline management yet
- Do not build interview invitation workflow yet
- Do not build hire tracking/invoicing yet
- Keep this chunk focused on the hospital home/dashboard surface

## Definition of Done

- [ ] Hospital dashboard page exists
- [ ] Hospital-only access is enforced
- [ ] Non-active hospitals see correct blocked states
- [ ] KPI/summary cards are implemented
- [ ] Quick actions are implemented
- [ ] Saved candidates summary is implemented or safely scaffolded
- [ ] Upcoming interviews summary is implemented
- [ ] Active opportunities summary is implemented
- [ ] Recent activity/alerts summary is implemented
- [ ] The dashboard feels hospital-oriented and operationally useful
- [ ] No full search, shortlist pipeline, or hire-tracking workflow was prematurely built

## Output Format

When you finish:
1. summarize what was implemented
2. list files added or changed
3. explain how hospital dashboard data is assembled
4. explain how active vs blocked hospital access is enforced
5. note any assumptions
6. note anything intentionally deferred to the next chunk
7. provide any commands needed to run or test locally