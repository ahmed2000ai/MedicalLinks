# MedicalLinks — Revised Chunk 09: Interview Invitation Workflow

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

We just finished hospital-to-doctor messaging. Now use the reference files in `Attachments/` plus the current codebase to build the **Interview Invitation Workflow**.

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

Build the hospital-to-doctor interview invitation workflow so hospital users can move shortlisted candidates into a structured interview process inside the platform.

This chunk should establish:
- interview invitation creation by hospital users
- doctor-side accept / decline / request-reschedule behavior
- interview detail view
- interview status tracking
- integration with shortlist and messaging
- hospital-side interview management
- doctor-side interview visibility

This is a key step in turning candidate discovery into actual hiring activity.

## Product Context

MedicalLinks is a GCC-focused doctor discovery and hiring platform.

Hospitals need to be able to:
- invite shortlisted doctors to interview
- propose interview details
- track interview status
- follow up if the doctor responds

Doctors need to be able to:
- receive interview invitations
- review interview details
- accept, decline, or request rescheduling
- track upcoming interviews

This is not a generic calendar feature. It is a **structured hiring-interview workflow**.

## Scope of This Chunk

Implement:

1. hospital interview invitation creation
2. doctor interview invitation response flow
3. interview detail page or panel
4. interview status model
5. upcoming interviews views/summaries
6. shortlist integration
7. messaging/context integration where useful
8. role-based permissions for hospital users, doctors, and admin

Do not implement:
- external calendar integrations
- Google Calendar / Outlook sync
- video meeting provider integrations
- hire attribution
- invoicing
- complex interviewer panel management
- hospital team collaboration beyond the current hospital-user model

## Required Interview Workflow

### 1. Invite to Interview
Hospital users should be able to initiate an interview from:
- shortlist
- hospital-facing doctor profile
- message thread if clean and useful

An interview invitation should be tied to:
- hospital user / hospital organization
- doctor
- optional opportunity context
- timestamps
- interview status

### 2. Interview Details
Support fields such as:
- title or interview label
- date
- time
- timezone
- format:
  - virtual
  - in-person
- location or meeting instructions
- optional notes or agenda summary

Keep the first version practical and structured.

### 3. Doctor Response
Doctors should be able to:
- accept
- decline
- request reschedule or indicate they need a different time

You may simplify rescheduling into a status or notes field if needed, but doctors must have a clear way not to silently ignore an invite.

### 4. Status Tracking
Support clear interview statuses such as:
- Invited
- Accepted
- Declined
- Reschedule Requested
- Confirmed
- Completed
- Cancelled

You may refine labels slightly, but keep them simple and operational.

### 5. Upcoming Interviews Views
Both sides should be able to see upcoming interviews in a structured way.

Hospital users should see:
- upcoming interviews they scheduled
- candidate
- date/time
- status

Doctors should see:
- upcoming interview invitations
- confirmed interviews
- response-needed items

### 6. Shortlist Integration
Interview actions should connect cleanly with shortlist stages.
For example:
- moving a candidate into `Interview Invited`
- updating stage after interview acceptance or completion

Keep this integration practical and not overly complicated.

## Messaging / Notification Integration

This chunk should use the existing messaging/notification layer where appropriate.

At minimum:
- doctor receives a notification of a new interview invitation
- hospital user sees response state changes
- doctor can access the invitation from a clear entry point

Do not overbuild notification rules beyond what is needed for MVP.

## Medical Industry / Business Requirements Relevant to This Chunk

This workflow must feel like a professional GCC healthcare hiring process.

It should support:
- hospital-driven outreach
- structured scheduling
- clear next-step tracking
- professional candidate communication
- operational visibility for both sides

Use terminology such as:
- Interview Invitation
- Upcoming Interview
- Confirmed Interview
- Reschedule Requested
- Candidate
- Hospital User
- Opportunity
- Next Steps

Avoid generic social/event-app language.

Do not make false compliance or regulatory claims.

## UI / UX Directives

The interview workflow must feel:
- professional
- calm
- hospital-friendly
- doctor-friendly
- clear
- high-trust

### Visual expectations
- clear interview cards or list rows
- readable status badges
- obvious response actions for doctors
- clear detail view with schedule information
- clean connection to shortlist and messaging where relevant

### UX expectations
- hospitals should be able to invite candidates without confusion
- doctors should immediately understand:
  - who invited them
  - for what context
  - when it is
  - what they need to do
- response actions should be very clear
- upcoming interviews should be easy to review

Use the shared design system.

## Technical Requirements

- refactor and extend existing interview/application structures where sensible instead of building a disconnected second model
- keep interview logic modular
- enforce role and hospital account permissions
- keep interview status handling deterministic
- support future hire attribution, but do not build it yet

If helpful, create services/actions such as:
- createInterviewInvitation
- listUpcomingInterviewsForHospital
- listUpcomingInterviewsForDoctor
- respondToInterviewInvitation
- updateInterviewStatus
- canHospitalInviteDoctorToInterview

Use different naming if a cleaner fit exists.

## Important Constraints

- Do not build external calendar integrations yet
- Do not build video meeting integrations yet
- Do not build hire attribution yet
- Do not build invoicing yet
- Keep this chunk focused on interview invitations and responses inside the platform

## Definition of Done

- [ ] Hospital users can invite doctors to interview
- [ ] Doctors can accept, decline, or request reschedule
- [ ] Interview details are stored and shown clearly
- [ ] Interview statuses work cleanly
- [ ] Upcoming interviews are visible to both sides
- [ ] Shortlist integration works cleanly
- [ ] Notifications/messages are integrated where appropriate
- [ ] Role and hospital-account permissions are enforced
- [ ] Existing recruiter-first interview assumptions are refactored or deprecated where needed
- [ ] The workflow feels professional and useful for hiring
- [ ] No external calendar integration, hire-tracking, or invoicing flow was prematurely built

## Output Format

When you finish:
1. summarize what was implemented
2. list files added or changed
3. explain how the interview invitation workflow works
4. explain how doctor responses and status tracking work
5. explain how shortlist/messaging integration works
6. note any assumptions
7. note anything intentionally deferred to the next chunk
8. provide any commands needed to run or test locally