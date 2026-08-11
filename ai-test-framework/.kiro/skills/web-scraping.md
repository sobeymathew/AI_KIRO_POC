# Skill: Web Scraping

## Role & Responsibilities
Web Intelligence Specialist responsible for application discovery and metadata extraction. Operates independently to crawl applications, discover pages, and feed data to locator generation.

- Crawl target applications
- Discover pages and routes
- Extract page metadata
- Capture screenshots
- Analyze DOM structures
- Build page inventory
- Identify interactive elements
- Handle authentication flows

## Trigger
When a new application or page needs to be mapped for automation.

## Input
- Application base URL
- Authentication details (if needed)
- Crawl scope and depth configuration
- Existing page inventory (for updates)

## Output
- Page inventory in `src/web-scraping/metadata/`
- Screenshots in `src/web-scraping/screenshots/`
- DOM extracts for locator generation
- Site map

## Process

1. **Configure** crawl parameters (depth, rate, scope)
2. **Authenticate** if application requires login
3. **Crawl** application starting from base URL
4. **Discover** all navigable pages and routes
5. **Extract** page metadata (title, URL, forms, links)
6. **Analyze** DOM for interactive elements
7. **Capture** screenshots for visual reference
8. **Generate** page inventory and metadata
9. **Feed** results to locator generation

## Rules
- Respect rate limits (max 10 requests/second)
- Maximum crawl depth: 5 levels
- Skip external links
- Capture full-page screenshots at standard viewport
- Store metadata as structured JSON
- Identify and flag dynamic content
- Handle authentication flows

## Crawl Configuration

```json
{
  "baseUrl": "https://app.example.com",
  "maxDepth": 5,
  "maxPages": 100,
  "rateLimit": 10,
  "viewport": { "width": 1920, "height": 1080 },
  "authentication": {
    "type": "form",
    "loginUrl": "/login",
    "credentials": "ENV"
  },
  "exclude": ["/api/*", "/admin/*"],
  "include": ["/*"]
}
```

## Capabilities
- Multi-page crawling with link following
- Form discovery and input identification
- Navigation structure mapping
- Component reuse detection
- Responsive layout detection

## Artifacts Produced
1. `metadata/site-map.json` - Application site map
2. `metadata/page-inventory.json` - All discovered pages
3. `metadata/{page-name}.meta.json` - Individual page metadata
4. `screenshots/{page-name}.png` - Page screenshots
5. `crawlers/crawl-log.json` - Crawl execution log

## Interaction Pattern
```
Input: Application URL + Config →
  Process: Authenticate → Crawl → Extract → Store →
    Output: Page Metadata + Screenshots + DOM Data
      → Feeds: Locator Generation skill
```

## Output Format

```json
{
  "page": {
    "url": "/login",
    "title": "Sign In - Application",
    "screenshot": "screenshots/login-page.png",
    "elements": {
      "forms": 1,
      "inputs": 3,
      "buttons": 2,
      "links": 4
    },
    "interactiveElements": [
      { "type": "input", "name": "email", "testId": "login-email" },
      { "type": "input", "name": "password", "testId": "login-password" },
      { "type": "button", "text": "Sign In", "testId": "login-submit" }
    ]
  }
}
```
