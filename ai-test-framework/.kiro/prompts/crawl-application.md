# Prompt: Crawl Application

## Usage
Use this prompt to initiate web scraping of a target application.

## Template

```
Crawl the following application and generate the object repository:

Application URL: {{BASE_URL}}
Authentication: {{AUTH_TYPE}} (none|form|token)
Scope: {{PAGES_TO_CRAWL}}

Tasks:
1. Discover all navigable pages within scope
2. Capture screenshots of each page
3. Extract interactive elements (inputs, buttons, links)
4. Generate locators for each element
5. Score locator quality
6. Create object repository entries
7. Generate page inventory

Configuration:
- Max depth: {{MAX_DEPTH}}
- Rate limit: 10 req/sec
- Viewport: 1920x1080
- Exclude: /api/*, /admin/*

Follow standards from:
- .kiro/steering/locator-management.md
- .kiro/steering/naming-conventions.md

Output to:
- src/web-scraping/metadata/
- src/web-scraping/screenshots/
- src/web-scraping/object-repository/pages/
```
