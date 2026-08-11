# Skill: Requirement Analysis

## Role & Responsibilities
Business Analyst specialized in requirement decomposition and testability assessment.

- Parse and structure raw requirements
- Identify testable acceptance criteria
- Assess requirement completeness
- Flag ambiguous or untestable requirements
- Map requirement dependencies
- Maintain requirement repository

## Trigger
When a new requirement document, PRD, or specification is provided.

## Input
- Raw requirement documents (PRD, specs, tickets)
- Business context and domain knowledge
- Stakeholder communications
- Existing requirement repository

## Output
- Structured requirements in `src/test-case-management/requirements/`
- Acceptance criteria in `src/test-case-management/acceptance-criteria/`
- Dependency maps
- Testability assessments
- Gap analysis reports

## Process

1. **Parse** the requirement document for functional and non-functional requirements
2. **Validate** completeness and clarity
3. **Identify** testable acceptance criteria from each requirement
4. **Classify** requirements by priority (P0-P3) and risk level
5. **Map** dependencies between requirements
6. **Output** structured requirement entries for the requirement repository

## Rules
- Every requirement must have a unique ID (REQ-XXXX)
- Requirements must be atomic and independently testable
- Ambiguous requirements should be flagged with status "NEEDS_CLARIFICATION"
- Non-functional requirements must have measurable criteria
- Dependencies must be bidirectional (A depends on B, B is depended by A)
- Priority must be assigned using P0-P3 scale

## Quality Gates
- Requirement has clear "done" criteria
- At least 2 acceptance criteria per requirement
- No circular dependencies
- Priority justified by business impact

## Artifacts Produced
1. `requirements/{req-id}.json` - Structured requirement
2. `acceptance-criteria/{ac-id}.json` - Acceptance criteria
3. `requirements/dependency-map.json` - Requirement dependencies
4. `requirements/gap-analysis.json` - Coverage gaps

## Interaction Pattern
```
Input: Raw Requirement →
  Process: Parse → Validate → Structure → Classify →
    Output: Structured Requirement + Acceptance Criteria
      → Feeds: Test Scenario Generation, User Story Analysis
```

## Template

```json
{
  "id": "REQ-0001",
  "title": "User Login",
  "description": "Users must be able to log in with email and password",
  "priority": "P0",
  "risk": "HIGH",
  "acceptanceCriteria": [
    "Valid credentials allow access",
    "Invalid credentials show error",
    "Account lockout after 5 failures"
  ],
  "dependencies": [],
  "status": "ACTIVE"
}
```
