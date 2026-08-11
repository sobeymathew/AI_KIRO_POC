# ITSM Incident Module

## Module Overview

The Incident module is a core module of the Salesforce-based ITSM application. It allows end users to create, track, and manage IT service incidents.

**Application URL:** `https://milestoneitsm--fullcopy.sandbox.my.site.com/itsm/s/`

## Navigation

- From the main application, the Incident module is accessible via the top/side navigation
- Path: Home → Incident → Create Incident

## Incident Creation Form

### Mandatory Fields

| Field | Type | Notes |
|-------|------|-------|
| Requested By | User lookup | Person reporting the incident |
| Requested For | User lookup | Person affected by the incident |
| Urgency | Dropdown | Priority/urgency classification |
| Category | Dropdown | Primary categorization |
| Sub Category | Dropdown | Dependent on Category selection |
| Brief Description | Text input | Short summary of the issue |
| Detailed Description | Text area / Rich text | Full incident details |

### Optional Fields

| Field | Type | Notes |
|-------|------|-------|
| Attachment | File upload | Supporting documents/screenshots |

## Expected Behaviors

### Successful Creation
- Confirmation message is displayed after submission
- A unique Incident Number / Ticket ID is generated
- The incident appears in the Incident list/search results
- Incident details match what was submitted

### Validations
- All mandatory fields must be filled before submission
- Submitting with empty mandatory fields should show validation errors
- No application errors should occur during the workflow

### Post-Creation Verification
- The created incident is retrievable via search in the Incident list
- Incident details (all fields) match the originally submitted data

## Locator Strategy

When building Page Objects for this module, follow these conventions:
- Use `data-testid` attributes as primary locator strategy
- For Salesforce Lightning components, use `lightning-*` tag selectors or accessible roles
- Form fields may use Salesforce-specific attributes (`data-field`, `data-target-selection`)
- Dropdowns in Salesforce may require click → wait for listbox → select pattern

## Test Categorization for Incidents

| Scenario | Tag |
|----------|-----|
| Basic create + verify | `@smoke @p0` |
| Mandatory field validations | `@regression @p1` |
| Category/Sub-category dependency | `@regression @p1` |
| Attachment upload | `@regression @p2` |
| Full create → search → verify journey | `@e2e @p0` |
| Session/error handling during creation | `@e2e @p1` |

## Test Scenarios (from KD-7 Analysis)

| # | Scenario | Category | Priority |
|---|----------|----------|----------|
| 1 | Create incident with all mandatory fields — verify success message and Incident ID generation | Smoke | P0 |
| 2 | Verify created incident appears in Incident list/search | E2E | P0 |
| 3 | Verify incident details match submitted data | Regression | P1 |
| 4 | Mandatory field validation — submit with empty required fields | Regression | P1 |
| 5 | Category → Sub Category dependency validation | Regression | P1 |
| 6 | Attachment upload (optional field) | Regression | P2 |
| 7 | Full E2E journey: Login → Navigate → Create → Search → Verify → Logout | E2E | P0 |
| 8 | No application errors during the entire workflow | Smoke | P0 |

## Open Clarifications

- [ ] What are the valid dropdown options for Urgency, Category, and Sub Category? Static or environment-dependent?
- [ ] Are Requested By / Requested For free-text inputs, user lookups, or pre-populated?
- [ ] What specific validation error messages are shown for empty mandatory fields?
- [ ] Attachment constraints — file type restrictions? Max size?
- [ ] Is there duplicate incident detection?
- [ ] Incident list verification — separate page? Search by ID or title?

## Traceability

- Jira Ticket: **KD-7**
- Jira Comment: Requirement analysis posted (2026-08-06)
- Requirement ID: `REQ-XXXX` (to be assigned after clarifications resolved)
- Feature File: `src/test-case-management/features/istm/incident.feature`
- Skill: `.kiro/skills/incident-test-generation.md`

## Test Data Considerations

- Test user credentials: stored in `.env.{ENV}` files
- Category/Sub-Category values: may need to be fetched dynamically or stored in static test data
- User lookups (Requested By/For): use known test user accounts per environment
- Incident creation test data should be environment-aware (dev vs staging may have different dropdown options)

## Workflow Status

- [x] Jira ticket read and analyzed
- [x] Requirement analysis completed
- [x] Steering document created
- [x] Skill document created
- [x] Comment posted on KD-7 with analysis summary
- [ ] Clarifications resolved
- [ ] Gherkin feature file generated
- [ ] Page Object(s) created
- [ ] Playwright test specs written
- [ ] Traceability mapped (REQ ID assigned)
