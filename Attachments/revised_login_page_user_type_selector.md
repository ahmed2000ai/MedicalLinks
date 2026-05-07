# MedicalLinks — Login Page Update: Applicant / Hospital Selector

## Refactor Instruction

This project already has an existing implementation built from the earlier recruiter-led roadmap and later revised toward a hospital-access talent platform.

Your task in this chunk is to **update and refactor the existing login page** so it matches the current product direction.

Do not build a parallel second login page.
Update the existing login flow cleanly and preserve the current auth system unless a small adjustment is truly required.

## Product Direction Update

MedicalLinks is now centered on these primary user roles:
- **Applicant**
- **Hospital**
- **Admin**

However, on the public login page, only these two user-facing options should be shown:
- **Applicant**
- **Hospital**

**Admin must not be shown as a visible login type on the main login page.**

Admins may still log in through the existing auth system if already supported, but the standard public-facing login UX should not advertise admin access.

## Objective

Modify the login page so that:

1. the user first selects a login type:
   - Applicant
   - Hospital
2. Admin is not displayed as an option
3. if **Applicant** is selected:
   - show the standard email/password login form
   - show a **new applicant registration option** below the password field
4. if **Hospital** is selected:
   - show the standard email/password login form
   - do **not** show the applicant registration option
5. the page should remain clean, professional, and aligned with the current MedicalLinks design system

## Scope of This Chunk

Implement:

1. login-type selector UI on the login page
2. Applicant / Hospital selection state
3. conditional rendering of login-page supporting actions
4. “new applicant registration” option below the password field when Applicant is selected
5. preserve existing login submission/auth behavior
6. preserve role-based post-login routing as currently implemented
7. keep Admin hidden from public login-page role selection

Do not implement:
- a new auth backend
- a new admin login system
- a full signup flow redesign unless needed for the applicant registration link target
- hospital registration flow unless already present
- unrelated onboarding changes

## Required Login Behavior

### 1. User Type Selection
At the top of the login form, provide a clear selector for:
- Applicant
- Hospital

Recommended UI options:
- segmented control
- tabs
- radio-card selector

It should feel:
- obvious
- modern
- professional
- simple

### 2. Applicant Selection
When **Applicant** is selected:
- show the login form
- below the password field, show a clear option for new applicant registration

Example direction:
- “New applicant? Create an account”
- or similar wording aligned with your product voice

This should be a visible link or CTA beneath the password field area.

### 3. Hospital Selection
When **Hospital** is selected:
- show the login form
- do not show the applicant registration link
- keep the form professional and simple

### 4. Admin Handling
Admin must not be shown as a selectable option on this page.

If admin login still needs to exist technically:
- keep backend/auth compatibility intact
- do not surface admin as a public option in the main login UX

## Registration Link Requirement

For the Applicant mode, the new registration option should:
- be visible below the password field
- clearly indicate that it is for new applicants only
- route to the correct applicant registration/onboarding entry point

If such a route does not yet exist clearly, create or use the safest existing applicant registration path.

Do not show this registration CTA in Hospital mode.

## UI / UX Directives

The updated login page must feel:
- clean
- trustworthy
- medical-grade
- role-aware
- modern
- low-friction

### Visual expectations
- user-type selector near the top of the form
- consistent spacing and typography
- clear hierarchy
- elegant applicant registration link placement below password field
- no clutter
- no admin-facing visual noise

### UX expectations
- a user should immediately understand whether they are logging in as an Applicant or Hospital
- the registration CTA should appear naturally only for Applicants
- the page should remain fast and easy to use
- existing login behavior should not feel broken or reinvented

Use the existing design system.

## Technical Requirements

- update the existing login page rather than creating a disconnected second version
- preserve existing auth/session logic unless a small adjustment is necessary
- keep role-based redirect behavior intact after successful login
- ensure the selected user type is reflected cleanly in the UI
- if needed, use the selected type only as UI guidance unless the auth system already supports or benefits from passing role context safely
- do not expose admin in the visible selector

If helpful, create or update components such as:
- `LoginRoleSelector`
- `LoginForm`
- `ApplicantRegistrationLink`

Use different naming if a cleaner fit exists.

## Important Constraints

- Do not break current login functionality
- Do not expose Admin as a visible option
- Do not show applicant registration when Hospital is selected
- Do not redesign the whole authentication system
- Keep the implementation focused on the login-page UX update

## Definition of Done

- [ ] Login page shows Applicant and Hospital as selectable user types
- [ ] Admin is not shown as a visible login type
- [ ] Applicant selection shows the login form plus a new applicant registration option below the password field
- [ ] Hospital selection shows the login form without the applicant registration option
- [ ] Existing login/auth flow still works
- [ ] Existing post-login routing still works
- [ ] The page feels clean and professional
- [ ] No unrelated auth redesign was introduced

## Output Format

When you finish:
1. summarize what was implemented
2. list files added or changed
3. explain how the Applicant / Hospital selection works
4. explain how the applicant registration option is conditionally shown
5. note any assumptions
6. note anything intentionally deferred
7. provide any commands needed to run or test locally