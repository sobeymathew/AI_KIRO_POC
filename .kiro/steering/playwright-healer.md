# Playwright Healer — Locator Discovery & Self-Healing

## When to Use

1. **Discovering locators** — When automating a new page and you need to find working locators
2. **Healing failures** — When a test fails with `TimeoutError: waiting for ...`
3. **Verifying locators** — Before committing, confirm locators work on the live page

## Target Application

- **URL:** `https://milestoneitsm--fullcopy.sandbox.my.site.com/itsm/s/`
- **Platform:** Salesforce Experience Cloud (Lightning Web Components + Shadow DOM)
- **Credentials:** `src/config/.env.dev` → `APP_USERNAME` / `APP_PASSWORD`

---

## Locator Discovery Process

### Step 1: Login & Navigate

```
playwright_navigate → BASE_URL
playwright_fill → [placeholder='Username']
playwright_fill → [placeholder='Password']
playwright_click → button:has-text("Log in")
playwright_click → target navigation link
```

### Step 2: Inspect the Page

```
playwright_get_visible_text → See what's on page
playwright_screenshot → Capture visual state
playwright_evaluate → Deep query DOM (pierces Shadow DOM):
```

```javascript
var deepQuery = function(root, selector) {
  var results = Array.from(root.querySelectorAll(selector));
  root.querySelectorAll('*').forEach(function(el) {
    if (el.shadowRoot) {
      results = results.concat(deepQuery(el.shadowRoot, selector));
    }
  });
  return results;
};
```

### Step 3: Test Interactions

Actually fill/click/select each element to confirm it works:
```
playwright_fill → [aria-label="Field"] with value
playwright_click → [data-value="Option"]
playwright_select → select[name="Field"] with value
```

### Step 4: Store in Object Repository

Save verified locators: `src/playwright/object-repository/pages/{page}.repo.json`

### Step 5: Build Page Object

Create/update Page Object using only verified locators.

---

## Healing Process (When Tests Fail)

### Step 1: Read the Error

Extract from the failure:
- The failing locator
- The page URL
- The action that failed

### Step 2: Navigate & Inspect

Use Playwright MCP to:
1. Navigate to the failing page
2. Screenshot the current state
3. Get visible text/HTML
4. Search for the element with alternative strategies

### Step 3: Try Alternatives

```typescript
// If getByRole('button', { name: 'X' }) fails:
page.getByText('X')                    // Text match
page.getByRole('link', { name: 'X' })  // May be <a> not <button>
page.locator('a:has-text("X")')        // Direct anchor
page.locator('[aria-label="X"]')       // Aria label
page.locator('[data-value="X"]')       // Salesforce data attribute
```

### Step 4: Fix & Re-run

Update Page Object → Update Object Repository → Re-run test.

---

## Salesforce Locator Patterns (Verified)

### Navigation Links
```typescript
page.locator('a[href="/itsm/s/My-Incidents"]')      // Menu links use href
page.locator('a[href="/itsm/s/Incident-Form"]')
```

### Login Form
```typescript
page.getByPlaceholder('Username')
page.getByPlaceholder('Password')
page.locator('button:has-text("Log in")')
```

### Native Select Dropdowns
```typescript
page.locator('select[name="Urgency"]')
// Interaction: await dropdown.selectOption({ label: 'Value' })
```

### Custom Comboboxes (Category, Sub Category)
```typescript
// Click trigger (button with aria-label)
page.locator('[aria-label="Category"]').first()
// Select option by data-value (text is empty in Shadow DOM!)
page.locator('[data-value="Network & Connectivity"]')
```

### Lookup/Search Fields
```typescript
page.locator('[aria-label="Requested By"]')
page.locator('[aria-label="Requested For"]')
```

### Text Inputs
```typescript
page.locator('input[name="Briefly_describe_your_issue_or_request"]')
page.locator('textarea')
```

### Buttons
```typescript
page.locator('button:has-text("Submit")')
```

### Success Feedback
```typescript
page.getByText('Incident Created')    // Confirmation text
page.getByText(/INC-\d+/)             // Generated ID
```

---

## Locator Priority for Salesforce

1. `[aria-label="..."]` — Form fields
2. `a[href="..."]` — Navigation links
3. `select[name="..."]` — Native dropdowns
4. `input[name="..."]` — Named inputs
5. `[data-value="..."]` — Combobox options
6. `button:has-text("...")` — Buttons
7. `getByText(/regex/)` — Dynamic text
8. `getByPlaceholder("...")` — Placeholder inputs

---

## Common Failures & Fixes

| Failure | Cause | Fix |
|---------|-------|-----|
| `waiting for getByRole('button')` | Element is `<a>` tag | Use `a[href="..."]` or `getByText` |
| `waiting for getByLabel('Field')` | No label `for` connection | Use `[aria-label="..."]` |
| `networkidle timeout` | Salesforce background requests | Use `domcontentloaded` + waitForTimeout |
| `strict mode violation` | Multiple matches | Add `.first()` or narrow with `.filter()` |
| Combobox option text empty | Shadow DOM hides text | Use `[data-value="..."]` |
| Lookup dropdown not opening | Need to click before fill | Click field first, then type |

---

## Object Repository Format

`src/playwright/object-repository/pages/{page}.repo.json`

```json
{
  "page": "incident-create",
  "url": "/itsm/s/Incident-Form",
  "verifiedAt": "2026-08-10",
  "verifiedBy": "playwright-mcp-healer",
  "elements": {
    "elementName": {
      "locator": "actual CSS/attribute selector",
      "type": "native-select | combobox | input | textarea | button | link",
      "interaction": "selectOption | click+data-value | fill | click",
      "verified": true
    }
  }
}
```
