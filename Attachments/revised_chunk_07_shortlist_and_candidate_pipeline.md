# MedicalLinks — Revised Chunk 07: Shortlist and Candidate Pipeline

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

We just finished the hospital-facing doctor profile view. Now use the reference files in `Attachments/` plus the current codebase to build the **Shortlist and Candidate Pipeline** for hospital users.

## Reference Material

Before implementing, review these files in `Attachments/`:
- `Attachments/revised_model_roadmap.md`
- `Attachments/02_product_prd.md`
- `Attachments/05_build_brief_for_agent.md`
- `Attachments/MedicalLinks_Business_Concept_GCC_EN.pdf`
- `Attachments/UI1.png`
- `Attachments/UI2.png`

Use those files plus the current codebase as supporting context.

## Objective

Build the hospital-side shortlist and candidate pipeline workflow.

This chunk should establish:
- save/favorite candidate behavior
- shortlist page for hospital users
- shortlist pipeline stages
- movement of candidates through internal hospital stages
- hospital notes/tags where useful
- clear candidate management workflow before interviews and hires

This is a core hospital workflow and one of the most important parts of the revised business model.

## Product Context

MedicalLinks is a GCC-focused doctor discovery and hiring platform.

Hospitals should not only browse candidates; they must also be able to:
- save interesting doctors
- organize them into a shortlist
- move them through internal review stages
- add internal notes
- prepare for outreach, interviews, and hiring decisions

This is not a recruiter CRM. It is a **hospital-side candidate pipeline** tied to doctor discovery.

## Scope of This Chunk

Implement:

1. save/favorite candidate action
2. shortlist page for hospital users
3. shortlist pipeline stages
4. move candidate between shortlist stages
5. candidate cards/rows inside shortlist views
6. optional hospital-side notes/tags if clean and stable
7. hospital-only access enforcement
8. integration from doctor search/profile into shortlist

Do not implement:
- full hospital-to-doctor messaging workflow changes
- interview invitation workflow
- hire attribution
- invoicing
- candidate comparison tooling
- advanced analytics

## Required Shortlist Capabilities

### 1. Save Candidate
Hospital users should be able to save/favorite a doctor from:
- search results
- hospital-facing doctor profile

This should create a persistent shortlist record tied to:
- hospital organization or hospital user context
- doctor
- current shortlist stage
- timestamps

### 2. Shortlist Page
Create a hospital-facing shortlist page where users can:
- view saved candidates
- filter or group them by stage
- open a candidate profile
- move candidates through pipeline stages
- remove candidates from shortlist if needed

### 3. Pipeline Stages
Support a clean hospital-side candidate pipeline such as:
- Saved
- Reviewing
- Interview Invited
- Interview Completed
- Offer Consideration
- Hired
- Rejected

You may refine labels slightly, but keep them simple, hospital-appropriate, and operational.

### 4. Stage Movement
Hospital users should be able to move candidates between stages safely and clearly.

This can be implemented with:
- dropdown stage selector
- move action menu
- lightweight kanban-style grouping
- grouped list sections

Choose the clearest option for the current codebase and design system.

### 5. Notes / Tags
If clean and stable, support lightweight internal notes or tags for shortlist items, such as:
- strong fit
- follow up next week
- needs licensing clarification
- awaiting internal review

Keep this lightweight. Do not build a full commenting system yet.

### 6. Remove / Archive from Shortlist
Allow hospital users to:
- remove a candidate from shortlist
- or archive/reject them within the shortlist workflow

Choose a clear, maintainable pattern.

## Required Integration Points

This chunk should connect cleanly with:
- hospital candidate search results
- hospital-facing doctor profile page
- hospital dashboard shortlist summary
- upcoming interview logic later

The shortlist should feel like a natural continuation of discovery, not an isolated feature.

## Medical Industry / Business Requirements Relevant to This Chunk

This shortlist workflow must support physician hiring realities such as:
- specialty-first evaluation
- credential-readiness follow-up
- internal hospital review steps
- candidate organization before contact/interview
- controlled progression toward hiring

Use terminology such as:
- Saved Candidate
- Shortlist
- Reviewing
- Interview Invited
- Offer Consideration
- Hired
- Rejected
- Candidate Pipeline

Avoid recruiter-led CRM language where it conflicts with the new product direction.

Do not make false compliance or regulatory claims.

## UI / UX Directives

The shortlist experience must feel:
- premium
- hospital-friendly
- calm
- operational
- easy to scan
- action-oriented

### Visual expectations
- clean candidate cards or rows
- stage badges / grouped sections
- strong metadata hierarchy
- clear stage controls
- quick access to doctor profile
- notes/tags presented cleanly if included

### UX expectations
- hospitals should be able to save and organize candidates quickly
- stage progression should be obvious
- the shortlist should support real hiring workflow, not just bookmarking
- privacy boundaries must remain respected

Use the shared design system.

## Technical Requirements

- use the new role/access model
- use hospital context cleanly
- keep shortlist logic modular
- support stage transitions cleanly
- enforce doctor visibility rules where relevant
- avoid duplicating data already available from doctor profile/search
- prepare the data model for later messaging/interview/hire flows

If helpful, create services/actions such as:
- saveCandidateToShortlist
- removeCandidateFromShortlist
- listShortlistedCandidatesForHospital
- moveCandidateToShortlistStage
- updateShortlistCandidateNotes
- getHospitalShortlistSummary

Use different naming if a cleaner fit exists.

## Important Constraints

- Do not build full messaging workflow changes yet
- Do not build interview invitation flow yet
- Do not build hire attribution or invoicing yet
- Do not overbuild notes/comments
- Keep this chunk focused on shortlist and internal hospital candidate organization

## Definition of Done

- [ ] Hospital users can save/favorite candidates
- [ ] Shortlist page exists
- [ ] Hospital-only access is enforced
- [ ] Saved candidates are persisted correctly
- [ ] Pipeline stages are implemented
- [ ] Candidates can be moved between stages
- [ ] Candidate cards/rows show useful information
- [ ] Remove/archive/reject behavior is handled cleanly
- [ ] Optional notes/tags are implemented cleanly or safely deferred
- [ ] Search/profile pages integrate with shortlist actions
- [ ] The shortlist feels useful and professional for hospital hiring workflow
- [ ] No messaging workflow redesign, interview invitation workflow, or hire-tracking flow was prematurely built

## Output Format

When you finish:
1. summarize what was implemented
2. list files added or changed
3. explain how shortlist saving and pipeline stages work
4. explain how hospital-only access is enforced
5. explain how shortlist integrates with search/profile/dashboard
6. note any assumptions
7. note anything intentionally deferred to the next chunk
8. provide any commands needed to run or test locally