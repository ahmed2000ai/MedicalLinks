# MedicalLinks GCC MVP Product Requirements Document

## 1) Product goal
Build a bilingual web application that helps MedicalLinks:
- collect doctor applications
- qualify candidates
- intake hospital roles
- match doctors to roles
- track licensing and onboarding readiness
- support manual recruitment operations across GCC markets

This is **not** a broad open marketplace in v1.

## 2) Primary users
1. Candidate doctor
2. MedicalLinks admin / recruiter
3. Hospital hiring contact

## 3) v1 product principle
Optimize for:
- low candidate friction
- high data quality after qualification
- strong admin control
- fast matching
- process transparency
- country-specific hiring readiness

## 4) v1 scope

### Public site
- homepage
- how it works
- for hospitals
- for doctors
- contact
- privacy / consent pages

### Candidate side
- quick apply form
- full profile form
- optional account creation
- document upload
- application status page
- bilingual UI (EN / AR)

### Admin side
- candidate list
- candidate detail view
- readiness score
- role list
- role detail view
- match suggestions
- status pipeline
- notes
- reminders
- document checklist
- search / filters

### Hospital side (lightweight v1)
- role intake form
- optional secure link to review shortlisted profiles
- feedback submission on shortlisted candidates

## 5) v1 non-goals
- public browsing of all candidates
- public browsing of all hospital roles
- payroll handling
- invoicing engine
- advanced AI ranking
- complex CRM integrations
- in-app chat system
- native mobile apps

## 6) Candidate workflow

### Step 1: Quick apply
Required fields:
- full name
- email
- phone / WhatsApp
- current country
- nationality
- medical specialty / discipline
- current grade / level
- years of experience
- English level
- Arabic level (optional)
- preferred GCC countries
- earliest start date
- CV upload
- consent checkbox

System actions:
- create candidate record
- assign intake status = new
- send confirmation email
- notify admin

### Step 2: Screening
Admin reviews:
- specialty fit
- target country fit
- communication readiness
- compensation alignment
- documentation readiness
- follow-up needs

Possible statuses:
- new
- screening
- qualified
- nurture
- rejected
- needs documents

### Step 3: Full profile
Triggered only for promising candidates.

Collect:
- identity basics
- languages
- education and specialty details
- employment history
- licensing status by country
- preferred GCC markets
- package expectations
- relocation and family readiness
- references
- documents available

## 7) Hospital workflow

### Role intake
Fields:
- hospital name
- department
- job title
- target GCC country
- city
- healthcare setting
- contract type
- required specialty
- required grade / level
- minimum years of experience
- required language profile
- licensing requirements if known
- salary range / package
- housing / transport / schooling / flights if applicable
- visa sponsorship available
- start date target
- hiring manager name
- hiring manager email
- urgency level
- notes

System actions:
- create role
- assign owner
- mark status = intake / active / paused / closed

### Shortlist workflow
Admin can:
- link candidates to a role
- mark shortlist sent
- track hospital feedback
- track interview stages
- track offer / acceptance / onboarding / start

## 8) Readiness score
The app should calculate a simple internal readiness score.

Suggested factors:
- specialty fit
- grade fit
- English communication level
- licensing feasibility for target market
- documents completeness
- compensation alignment
- relocation readiness
- notice period

Example labels:
- ready now
- near ready
- future pipeline
- not a fit

## 9) Candidate data model

### Core fields
- id
- first_name
- last_name
- email
- phone
- whatsapp
- nationality
- current_country
- current_city
- preferred_language_ui
- source_channel
- consent_timestamp

### Professional fields
- profession_type
- specialty
- subspecialty
- current_grade
- years_experience_total
- years_experience_post_specialty
- current_employment_status
- current_employer
- earliest_start_date
- notice_period

### Language fields
- english_level
- arabic_level
- other_languages

### Licensing and market readiness
- target_gcc_countries
- current_licenses
- licensing_exam_history
- target_country_license_status
- dataflow_status
- prometric_status
- classification_status
- good_standing_status

### Immigration and mobility
- passport_country
- visa_needed
- willing_to_relocate
- family_relocation_needs
- preferred_cities_or_countries
- housing_priority
- travel_flexibility

### Compensation and preferences
- expected_salary_min
- expected_salary_max
- preferred_healthcare_settings
- contract_preferences
- benefits_priorities

### Operations
- readiness_label
- internal_score
- admin_owner
- candidate_status
- last_contacted_at
- next_action_at
- notes

## 10) Role data model
- id
- hospital_name
- department
- title
- target_country
- city
- specialty_required
- grade_required
- years_experience_min
- healthcare_setting
- contract_type
- visa_support
- package_notes
- required_languages
- licensing_notes
- urgency
- target_start_date
- hiring_manager_name
- hiring_manager_email
- role_status

## 11) Matching logic
Implement rules-based matching first.

Hard filters:
- specialty fit
- grade fit
- minimum experience
- language threshold
- target country preference or openness
- licensing feasibility
- availability window

Soft ranking:
- documentation completeness
- relocation flexibility
- compensation alignment
- reference strength
- shortlist readiness

## 12) UX constraints
- mobile-first candidate forms
- autosave for long forms
- progress indicator on full profile
- simple admin dashboard
- clean bilingual structure
- role-based permissions
- country-specific labels where relevant

## 13) Content structure
Prepare all content for bilingual delivery from day one:
- public pages in EN and AR
- candidate forms in EN and AR
- status labels mapped in both languages
- email templates in EN and AR

## 14) Important product notes
- References can be optional in quick apply and required later in the process.
- Family-related questions should be optional and clearly framed as relocation-planning information.
- The app must allow country-by-country licensing notes because GCC processes differ.
- The platform should support manual recruiter workflows before any deep automation.
