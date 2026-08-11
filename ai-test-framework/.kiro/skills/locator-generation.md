# Skill: Locator Generation

## Role & Responsibilities
Locator Specialist responsible for generating, validating, and healing locators. Maintains the object repository and ensures all locators are robust, unique, and maintainable.

- Generate locators from DOM analysis
- Validate locator uniqueness and reliability
- Heal broken locators when tests fail
- Maintain centralized object repository
- Score locator quality
- Recommend locator strategies

## Trigger
When a page is crawled and DOM is available for analysis, or when locators break.

## Input
- Page DOM/HTML
- Screenshots
- Existing object repository
- Broken locator reports

## Output
- Object repository files in `src/web-scraping/object-repository/`
- Locator health reports
- Healed locator suggestions

## Process

1. **Analyze** DOM structure for interactive elements
2. **Identify** existing data-testid attributes
3. **Generate** role-based locators for accessible elements
4. **Create** CSS selectors as fallback
5. **Generate** XPath for complex traversals
6. **Score** each locator for reliability
7. **Store** in object repository format

## Locator Healing Process
1. Detect broken locator (test failure with "element not found")
2. Fetch current page DOM
3. Search for element using alternative strategies
4. If found: propose updated locator
5. If not found: flag for human review

## Locator Quality Criteria

| Criteria | Weight | Description |
|----------|--------|-------------|
| Uniqueness | 30% | Locator matches exactly one element |
| Stability | 25% | Resistant to DOM changes |
| Readability | 20% | Easy to understand intent |
| Performance | 15% | Fast to evaluate |
| Specificity | 10% | Targets correct semantic element |

## Rules
- Every locator must have minimum 2 alternative strategies
- data-testid is always primary when available
- Locators must be unique on the page (verified)
- Quality score must be > 70% for acceptance
- Never use generated/dynamic attributes
- Never use index-based locators as primary

## Anti-Patterns
- ❌ `div > div > div:nth-child(3) > span`
- ❌ `.css-1a2b3c` (generated classes)
- ❌ `#auto-id-12345` (auto-generated IDs)
- ❌ Absolute XPath from root

## Artifacts Produced
1. `object-repository/pages/{page}.repo.json` - Page locators
2. `object-repository/components/{comp}.repo.json` - Component locators
3. `metadata/locator-health.json` - Health report
4. `metadata/healing-suggestions.json` - Auto-heal proposals

## Output Format

```json
{
  "element": "submitButton",
  "strategies": {
    "testId": { "value": "login-submit", "score": 95 },
    "role": { "value": "button[name='Sign In']", "score": 85 },
    "css": { "value": "form.login button[type='submit']", "score": 70 },
    "xpath": { "value": "//form[@class='login']//button[@type='submit']", "score": 65 }
  },
  "recommended": "testId",
  "description": "Submit button on the login form"
}
```
