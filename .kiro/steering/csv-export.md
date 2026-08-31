---
inclusion: manual
---

# Test Case CSV Export Format

## When to Use

When asked to export or download test cases as CSV (e.g., "download test cases as CSV", "export to CSV", "generate CSV report").

## Output Format: Consolidated (One Row Per Test Case)

### Rules

1. **One row per Test Case ID** — never duplicate test case metadata across multiple rows.
2. **No "Step #" column** — step numbers are embedded within the Steps cell.
3. **Combine all steps** into a single "Steps" cell as a numbered list.
4. **Preserve step order** — sort by Step # before merging.
5. **Use line breaks (`\n`)** within cells for multi-line content.
6. **No steps lost** — every step from every test case must appear in the output.
7. **UTF-8 with BOM** encoding for Excel compatibility.
8. **Separate combined columns** for Steps, Test Data, and Expected Results (all numbered to maintain alignment).

### CSV Columns

| # | Column | Description |
|---|--------|-------------|
| 1 | Test Case ID | Unique identifier (e.g., TC-0006) |
| 2 | Name | Test case title |
| 3 | Objective | What is being validated |
| 4 | Precondition | Setup requirements before execution |
| 5 | Category | smoke / regression / e2e |
| 6 | Priority | P0 / P1 / P2 |
| 7 | Requirement ID | Parent requirement (e.g., REQ-0002) |
| 8 | User Story ID | Linked user story (e.g., US-0002) |
| 9 | Labels | Tags, semicolon-separated |
| 10 | Steps | All steps as numbered list (one per line within cell) |
| 11 | Test Data | All test data as numbered list (matching step numbers) |
| 12 | Expected Results | All expected results as numbered list (matching step numbers) |
| 13 | Feature File | Linked Gherkin feature file path |
| 14 | Automation Script | Planned/actual automation spec file |
| 15 | Automation Status | PENDING / AUTOMATED / MANUAL |

### Example Row (conceptual)

```
TC-0006,"Verify Agentforce icon is visible on home page after login","Validate that...","User has valid credentials...","smoke","P0","REQ-0002","US-0002","smoke; p0; agentforce; access","1. Navigate to the self-service portal login page
2. Enter valid credentials and click Log in
3. Verify the home page has loaded completely
4. Verify the Agentforce icon is displayed on the home page","1. URL: https://...
2. Valid portal username and password
3. -
4. -","1. Login page is displayed...
2. User is authenticated...
3. Home page is fully loaded...
4. The Agentforce icon is visible and clickable","features/smoke/agentforce-ai-assistant.feature","tests/smoke/agentforce-assistant.spec.ts","PENDING"
```

### Steps Cell Format

```
1. First step description
2. Second step description
3. Third step description
```

Use `-` for empty Test Data entries to maintain alignment with step numbers.

## Generation Process

1. Read all `TC-*.json` files from the target test-cases folder.
2. Sort files by numeric ID (extract number from `TC-XXXX`).
3. For each test case:
   - Sort steps by `step` field (numeric).
   - Build numbered lists for Steps, Test Data, and Expected Results.
   - Join with newline character (`\n`) within each cell.
4. Write CSV with proper quoting (fields containing commas, quotes, or newlines must be enclosed in double quotes; internal double quotes escaped as `""`).
5. Use UTF-8 with BOM encoding.
6. Save to the same folder as the test case JSONs with name: `{REQ-ID}-test-cases-consolidated.csv`.

## File Naming Convention

- `REQ-0002-test-cases-consolidated.csv` — consolidated format (default)
- `REQ-0002-test-cases.csv` — expanded format (one row per step, only if explicitly requested)

## Output Location

Save the CSV in the same folder as the source test case JSON files:
```
src/test-case-management/test-cases/{requirement-folder}/
```
