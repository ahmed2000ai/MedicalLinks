# MedicalLinks — Revised Chunk 08: Hospital-to-Doctor Messaging

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

We just finished shortlist and candidate pipeline. Now use the reference files in `Attachments/` plus the current codebase to build **Hospital-to-Doctor Messaging**.

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

Refactor and extend the current messaging functionality so it supports the revised business model where **hospital users can directly message doctors** through the platform.

This chunk should establish:
- hospital-to-doctor conversations
- doctor-side receipt and reply flow
- thread list and conversation detail views
- unread/read handling
- candidate-linked conversation context
- role-aware messaging permissions
- messaging entry points from hospital candidate search/profile/shortlist

This should feel like a **professional recruitment communication workflow**, not a casual chat app.

## Product Context

MedicalLinks is a GCC-focused doctor discovery and hiring platform.

Hospitals need to be able to:
- reach out to promising doctors
- continue conversations with shortlisted candidates
- coordinate next steps toward interviews

Doctors need to be able to:
- receive hospital outreach
- respond professionally
- maintain control over communication inside the platform

This is now a core hospital workflow, not an internal recruiter-only function.

## Scope of This Chunk

Implement:

1. hospital-to-doctor message initiation
2. conversation/thread list for hospital users
3. conversation/thread list for doctors
4. conversation detail UI
5. send/reply message behavior
6. unread/read tracking
7. contextual linking from candidate search/profile/shortlist
8. role-based messaging permissions
9. admin oversight hooks if needed but lightweight

Do not implement:
- interview invitation workflow
- hire attribution
- invoicing
- external email/SMS delivery
- real-time websocket architecture unless already trivial
- attachment uploads in chat unless already cleanly supported
- hospital partner multi-team collaboration beyond current user context

## Required Messaging Capabilities

### 1. Conversation Initiation
Hospital users should be able to start a conversation with a doctor from:
- candidate search results
- hospital-facing doctor profile
- shortlist page

The conversation should be clearly tied to:
- hospital user / hospital organization
- doctor
- timestamps
- optionally context such as the originating candidate or opportunity if clean to support

### 2. Conversation Lists
Both hospital users and doctors should have access to:
- list of conversations
- last message preview
- unread indicator
- updated timestamp
- other participant summary

### 3. Conversation Detail
Support:
- message history
- send new message
- reply within thread
- readable timestamps
- sender alignment/role clarity
- professional layout

### 4. Unread / Read Handling
Support:
- unread count
- mark-as-read on open or equivalent
- unread badges in navigation or page context
- clean summary visibility

### 5. Role Permissions
Messaging should be allowed between:
- hospital user ? doctor

Admin may have oversight access only if helpful and clean, but do not overbuild this.

Do not continue old recruiter-first messaging assumptions if they conflict with the new model.

## Required Integration Points

Messaging should connect naturally to:
- candidate search
- hospital-facing doctor profile
- shortlist
- doctor dashboard/messages area
- hospital dashboard/messages area if present

The feature should feel like a natural next step after discovering and saving a candidate.

## Privacy / Trust Requirements

This chunk must preserve doctor trust and privacy.

Requirements:
- hospitals can message doctors through the platform
- hospitals should not automatically get unrestricted private email/phone exposure
- doctors should receive communication inside platform channels
- role permissions must be enforced
- inactive/suspended hospitals should not be able to message doctors
- doctors who are not discoverable should not be newly messageable through hospital discovery flows unless already in a legitimate existing thread context

Do not expose personal contact details broadly.

## Medical Industry / Business Requirements Relevant to This Chunk

This messaging system must feel like professional medical recruitment communication.

Use terminology such as:
- Candidate
- Doctor
- Hospital User
- Conversation
- Outreach
- Follow-up
- Recruitment Message
- Next Steps

Avoid consumer-chat or social-app language.

Do not make false compliance or regulatory claims.

## UI / UX Directives

Use the existing MedicalLinks design system and build a messaging experience that feels:
- calm
- professional
- premium
- healthcare-appropriate
- easy to scan
- operationally clear

### Visual expectations
- clean inbox/thread list
- strong conversation hierarchy
- readable message bubbles or rows
- subtle unread indicators
- concise participant/context metadata
- clear compose/reply area

### UX expectations
- hospital users should be able to initiate outreach quickly
- doctors should clearly understand which hospital is contacting them
- threads should be easy to resume
- messaging should feel businesslike, not casual

## Technical Requirements

- refactor existing messaging where needed rather than building a parallel second messaging system
- keep messaging logic modular
- enforce role and hospital account access rules
- support conversation lookup by user and role cleanly
- avoid scattering unread logic across components
- prepare the model for later interview invitation context, but do not build that flow yet

If helpful, create services/actions such as:
- startConversationWithDoctor
- listConversationsForHospitalUser
- listConversationsForDoctor
- getConversationThread
- sendConversationMessage
- markConversationAsRead
- canHospitalMessageDoctor

Use different naming if a cleaner fit exists.

## Important Constraints

- Do not build interview invitation workflow yet
- Do not build external email/SMS delivery
- Do not over-engineer real-time infrastructure
- Do not expose private contact details broadly
- Keep this chunk focused on in-platform hospital-to-doctor messaging

## Definition of Done

- [ ] Hospital users can initiate conversations with doctors
- [ ] Doctors can view and reply to hospital messages
- [ ] Conversation lists exist for both sides
- [ ] Conversation detail view exists
- [ ] Unread/read handling works
- [ ] Messaging is reachable from search/profile/shortlist where appropriate
- [ ] Role and hospital account permissions are enforced
- [ ] Doctor privacy boundaries are preserved
- [ ] Existing recruiter-first messaging assumptions are refactored or deprecated where needed
- [ ] The messaging experience feels professional and useful for hospital outreach
- [ ] No interview invitation, hire-tracking, or external messaging workflow was prematurely built

## Output Format

When you finish:
1. summarize what was implemented
2. list files added or changed
3. explain how hospital-to-doctor messaging works
4. explain how permissions and privacy are enforced
5. explain how messaging integrates with search/profile/shortlist
6. note any assumptions
7. note anything intentionally deferred to the next chunk
8. provide any commands needed to run or test locally