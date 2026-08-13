# User Story: Create Request Assessments

## Story
**As an** employee
**I want to** create and submit a Request Assessment through the Service Catalog
**So that** the security team can review and process my assessment request efficiently

## Source
- Type: Word Document (Request Assessments-user story.docx)
- Story ID: SR-EXP-001
- Date: 2026-08-11

## Acceptance Criteria
1. User is logged into the application
2. User can navigate to Service Request → Service Catalog
3. User can click "Request" under "Request Assessments"
4. The Request Assessments form is displayed
5. "Requested By" field is auto-populated with logged-in user's name (read-only)
6. User can enter a valid user in "Requested For" field (mandatory)
7. User can select a value from "Category" dropdown (mandatory)
8. User can upload a supported file (≤ 4MB)
9. User can click "Submit"
10. Request is created successfully with confirmation message
11. A unique request number (RQ-XXXXXXXXX) is generated

## Test Scenarios
| # | Scenario | Category | Priority |
|---|----------|----------|----------|
| 1 | Successful request assessment submission | Smoke | P0 |
| 2 | Mandatory field validation | Regression | P1 |

## Fields Identified
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Requested By | Text (read-only) | Auto | Pre-populated with logged-in user |
| Requested For | Lookup/Input | Yes | Valid user selection |
| Category | Dropdown | Yes | Select from options |
| File Upload | File input | No | Max 4MB, specific formats |

## Business Rules
- Requested By cannot be edited
- Requested For is mandatory
- Category is mandatory
- Max file size: 4 MB per file
- Supported formats: png, pdf, jpg, jpeg, doc, docx, xls, xlsx, pst, ost, txt, csv, eml, msg
