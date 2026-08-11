# Jira Comment Workflow

## When to Use

When asked to add a comment on a Jira ticket (e.g., "add comment on KD-7"), follow this process.

## Atlassian Connection

- **Cloud ID:** `74bddaaa-afcf-407f-a20f-e93afc663c84`
- **Site:** `milestone-team-a63qhc1b.atlassian.net`
- **Project Key:** `KD` (Kiro-Dev)

## Process

1. **Read the ticket** — Use `getJiraIssue` with the cloud ID and issue key to fetch full ticket details (summary, description, acceptance criteria, status, priority).
2. **Analyze** — Extract key information relevant to the comment context (requirement analysis, test scenarios, status updates, etc.).
3. **Post the comment** — Use `addCommentToJiraIssue` with `contentFormat: "markdown"`.

## Comment Format

Use structured markdown in all Jira comments:

```markdown
## [Comment Title]

### Summary
Brief one-liner about what this comment covers.

---

### [Main Content Section]
- Use tables for structured data (scenarios, fields, etc.)
- Use bullet lists for action items
- Use checkboxes for open questions

---

### Next Steps
1. Numbered action items
2. What needs to happen next
```

## Rules

- Always use `contentFormat: "markdown"` when posting comments
- Structure comments with clear headers and sections
- Include tables for test scenarios or field mappings
- Flag open questions or clarifications needed
- Reference automation artifacts created (steering docs, skills, feature files)
- Keep comments professional and actionable
- Do not include sensitive data (passwords, tokens) in comments

## Comment Types

### Requirement Analysis Comment
Post after reading and analyzing a ticket:
- Test scenarios identified (table with category + priority)
- Clarifications needed (numbered list)
- Artifacts created in automation framework
- Next steps

### Status Update Comment
Post to report progress:
- What was completed
- What's in progress
- Blockers or dependencies

### Test Results Comment
Post after test execution:
- Pass/fail summary
- Failures with brief root cause
- Link to report artifacts
