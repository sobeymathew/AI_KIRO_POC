# User Story: Create Expense Request

## Story
**As an** employee
**I want to** create and submit an Expense Request through the Service Catalog
**So that** the Expense Team can review and process my expense-related request efficiently

## Source
- Type: Word Document (Expense-Request-User-Story.docx)
- Story ID: SR-EXP-001
- Date: 2026-08-11

## Acceptance Criteria
1. User is logged into the application
2. User can navigate to Service Request → Service Catalog
3. User can click "Request" under "Expense Request"
4. The Expense Request form is displayed
5. "Requested By" field is auto-populated with logged-in user's name (read-only)
6. User can enter a valid user in "Requested For" field (mandatory)
7. User can select a value from "Category" dropdown (mandatory)
8. User can upload a supported file (≤ 4MB, formats: png, pdf, jpg, jpeg, doc, docx, xls, xlsx, pst, ost, txt, csv, eml, msg)
9. User can click "Submit"
10. Request is created successfully with confirmation message
11. A unique request number (RQ-XXXXXXXXX) is generated
12. Request is routed to the Expense Team

## Test Scenarios
| # | Scenario | Category | Priority |
|---|----------|----------|----------|
| 1 | Successful expense request with all mandatory fields | Smoke | P0 |
| 2 | Mandatory field validation (submit with empty fields) | Regression | P1 |
| 3 | Verify Requested By is read-only and pre-populated | Regression | P1 |
| 4 | Full E2E journey: navigate → fill → submit → verify | E2E | P0 |

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
