# Prompt: Analyze Requirement

## Usage
Use this prompt when you have a new requirement or user story to analyze and convert into test assets.

## Template

```
Analyze the following requirement and generate:
1. Structured requirement entry (REQ-XXXX format)
2. User stories with acceptance criteria
3. Test scenarios (positive, negative, edge cases)
4. Gherkin feature file
5. Traceability mapping

Requirement:
{{REQUIREMENT_TEXT}}

Context:
- Application: {{APP_NAME}}
- Module: {{MODULE_NAME}}
- Priority: {{PRIORITY}}

Follow the standards defined in:
- .kiro/steering/test-design-standards.md
- .kiro/steering/naming-conventions.md

Output files to:
- src/test-case-management/requirements/
- src/test-case-management/user-stories/
- src/test-case-management/features/{{CATEGORY}}/
- src/test-case-management/traceability/
```
