# MedicalLinks GCC Build Brief for Agent

## Mission
Build the first working version of **MedicalLinks**, a bilingual physician recruitment web app for GCC hospital hiring.

## Outcome
The app should let MedicalLinks:
- capture doctor leads
- qualify candidates
- manage hospital roles
- track licensing and onboarding readiness
- match doctors to roles
- run live placements end-to-end

## Business context
This product is intentionally **operations-first**.
It should support a high-trust recruitment workflow before becoming a marketplace.

## v1 principles
1. GCC-first
2. Doctors-only
3. Candidate friction must be low
4. Admin control must be high
5. English and Arabic supported from day one
6. Licensing-readiness and process transparency are core product concepts

## User roles
- public visitor
- candidate doctor
- admin / recruiter
- hospital contact

## Must-have features

### Public website
- homepage with clear value proposition
- separate sections for hospitals and doctors
- bilingual language toggle
- CTA to apply as candidate
- CTA to request hiring support as hospital

### Candidate features
- quick apply form
- full profile form
- CV upload
- document upload
- application status view
- bilingual labels and validation messages

### Admin features
- candidate table with filters
- role table with filters
- candidate detail page
- role detail page
- match candidates to roles
- set readiness label
- internal notes
- status pipeline
- reminders / next action date
- country-specific licensing notes

### Hospital features
- role intake form
- secure shortlist review link or simple login
- ability to leave feedback on candidate profiles

## Suggested information architecture
- public marketing pages
- protected candidate area
- protected admin dashboard
- protected hospital shortlist pages

## Candidate statuses
- new
- screening
- qualified
- nurture
- interview
- offer
- onboarding
- hired
- rejected
- on hold

## Role statuses
- intake
- active
- shortlist sent
- interviewing
- offer stage
- onboarding
- filled
- paused
- closed

## Readiness labels
- ready now
- near ready
- future pipeline
- not a fit

## Core fields that must exist
- specialty
- current grade
- years of experience
- English level
- Arabic level
- preferred GCC countries
- licensing status
- dataflow / exam status
- relocation willingness
- earliest start date
- document completeness

## Matching logic
Implement rules-based matching first.
Do not overengineer AI in v1.

Hard filters:
- specialty fit
- grade fit
- minimum experience
- language threshold
- target country preference
- licensing feasibility
- availability window

Soft ranking:
- relocation flexibility
- readiness label
- document completeness
- compensation alignment
- exact specialty match

## UX constraints
- mobile-friendly candidate forms
- autosave on longer forms
- progress indicator
- simple admin dashboard
- clean bilingual copy structure
- role-based permissions

## Suggested implementation approach
- use a modern full-stack framework
- use relational data storage
- support secure file uploads
- prepare for localization from the start
- keep business logic modular by country

## Deliverables expected from the agent
1. app architecture
2. database schema
3. authentication and roles
4. public pages
5. candidate flow
6. admin dashboard
7. hospital role intake
8. shortlist workflow
9. seed data / demo mode if possible
10. deployment instructions

## Non-goals for v1
- deep AI scoring
- open marketplace browsing
- payment processing
- invoicing
- native mobile apps
- integrations with hospital ATS systems

## Important product notes
- References should be optional in quick apply and gathered later.
- Family-related questions should be optional.
- The app should support different GCC hiring and licensing workflows.
- The platform should be usable manually by a small recruiting team before scale.
