# Postman MCP Integration Demo

This folder contains sample Postman collections to demonstrate the integration between Postman and Kiro AI Test Framework via Model Context Protocol (MCP).

## Contents

| File | Purpose |
|------|---------|
| `Demo-API-Collection.postman_collection.json` | Comprehensive API test collection with 15+ requests |
| `Demo-Environment.postman_environment.json` | Environment variables for the demo collection |

---

## Collection Overview

### 📦 Demo API Collection - MCP Integration

The collection demonstrates various API testing scenarios:

1. **Public APIs - No Auth** (3 requests)
   - Get Random User (RandomUser API)
   - Get JSON Placeholder Post
   - Get All Posts

2. **CRUD Operations** (4 requests)
   - Create New Post (POST)
   - Update Post (PUT)
   - Patch Post (PATCH)
   - Delete Post (DELETE)

3. **Status Code Tests** (2 requests)
   - 200 OK Response
   - 404 Not Found

4. **Parametrized Requests** (2 requests)
   - Get User Posts (with query params)
   - Search Posts by Title

5. **Response Validation** (2 requests)
   - Validate JSON Schema
   - Performance Test (response time)

**All requests include:**
- ✅ Automated test scripts
- ✅ Response validation
- ✅ Performance checks
- ✅ Schema validation where applicable

---

## Setup Instructions

### 1. Import to Postman (Optional)

If you want to use these in the Postman desktop app:

```bash
# Open Postman Desktop App
# Click Import → Upload Files
# Select both:
#   - Demo-API-Collection.postman_collection.json
#   - Demo-Environment.postman_environment.json
```

### 2. Configure Postman MCP in Kiro

Ensure your `.kiro/settings/mcp.json` has the Postman server configured:

```json
"postman": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-postman"],
  "env": {
    "POSTMAN_API_KEY": "your-postman-api-key-here"
  },
  "disabled": false,
  "autoApprove": [
    "postman_list_collections",
    "postman_get_collection",
    "postman_send_request",
    "postman_run_collection"
  ]
}
```

### 3. Upload Collection to Postman Account

**Via Postman UI:**
1. Import the collection file into Postman Desktop
2. Click the collection → "Share"
3. Publish to your workspace
4. The collection is now accessible via Postman API

**Via Postman API (using Kiro):**
Ask Kiro to upload it:
```
"Upload the Demo-API-Collection.postman_collection.json to my Postman workspace"
```

---

## Demo Scenarios with Kiro

Once the Postman MCP is connected, you can ask Kiro to:

### Scenario 1: List Collections
```
"List all my Postman collections"
```
**Expected:** Shows all collections in your Postman account, including "Demo API Collection - MCP Integration"

### Scenario 2: Get Collection Details
```
"Get the details of the Demo API Collection"
```
**Expected:** Returns the full collection structure with all folders and requests

### Scenario 3: Run a Single Request
```
"Run the 'Get Random User' request from the Demo API Collection"
```
**Expected:** Executes the request and shows the response with test results

### Scenario 4: Run the Full Collection
```
"Run the entire Demo API Collection and show me the results"
```
**Expected:** Executes all 15+ requests in sequence and provides:
- Total requests executed
- Pass/fail count
- Failed test details (if any)
- Execution time

### Scenario 5: Run Specific Folder
```
"Run only the CRUD Operations folder from the Demo API Collection"
```
**Expected:** Executes only the 4 CRUD requests (POST, PUT, PATCH, DELETE)

### Scenario 6: Validate API Before UI Test
```
"Before running the Playwright test, check if the API is responding by running the '200 OK Response' request"
```
**Expected:** Validates API health, then proceeds with UI automation

---

## Integration with Test Framework

### Combined API + UI Testing

You can combine Postman API tests with Playwright UI tests:

**Example workflow:**
1. **Setup:** Use Postman API to create test data
2. **Execute:** Run Playwright UI test that uses the created data
3. **Validate:** Use Postman API to verify the data in the backend
4. **Cleanup:** Use Postman API to delete test data

**Sample Kiro command:**
```
"Create a test user via the API, then automate the login flow in Playwright using that user"
```

### Traceability

Link API tests to Azure DevOps work items:
```
"Run the Demo API Collection and post the results as a comment on work item 8"
```

---

## APIs Used in the Collection

| API | Purpose | Auth Required |
|-----|---------|---------------|
| [JSONPlaceholder](https://jsonplaceholder.typicode.com) | Fake REST API for testing | No |
| [RandomUser](https://randomuser.me) | Generate random user data | No |
| [HTTPStat.us](https://httpstat.us) | HTTP status code testing | No |

**Why these APIs?**
- ✅ No authentication needed (quick setup)
- ✅ Public and always available
- ✅ Realistic REST API patterns
- ✅ Perfect for demos and POCs

---

## Expected Results (Demo)

### When running the full collection:

```
✅ Public APIs - No Auth
   ✅ Get Random User (3/3 tests passed)
   ✅ Get JSON Placeholder Post (3/3 tests passed)
   ✅ Get All Posts (3/3 tests passed)

✅ CRUD Operations
   ✅ Create New Post (3/3 tests passed)
   ✅ Update Post (2/2 tests passed)
   ✅ Patch Post (2/2 tests passed)
   ✅ Delete Post (2/2 tests passed)

✅ Status Code Tests
   ✅ 200 OK Response (2/2 tests passed)
   ✅ 404 Not Found (2/2 tests passed)

✅ Parametrized Requests
   ✅ Get User Posts (2/2 tests passed)
   ✅ Search Posts by Title (2/2 tests passed)

✅ Response Validation
   ✅ Validate JSON Schema (2/2 tests passed)
   ✅ Performance Test (2/2 tests passed)

📊 Summary:
   Total Requests: 13
   Total Tests: 33
   Passed: 33 ✅
   Failed: 0 ❌
   Duration: ~3.5 seconds
```

---

## Troubleshooting

### Issue: "Collection not found"
**Solution:** Upload the collection to your Postman account first

### Issue: "Postman API Key invalid"
**Solution:** 
1. Generate a new API key at https://go.postman.co/settings/me/api-keys
2. Update `.kiro/settings/mcp.json` with the new key
3. Reconnect the Postman MCP server

### Issue: "Request timed out"
**Solution:** Check your internet connection; the demo uses public APIs

---

## Next Steps

1. ✅ Import this collection to Postman
2. ✅ Configure Postman MCP in Kiro
3. ✅ Ask Kiro to run the collection
4. ✅ Integrate API tests with your existing Playwright tests
5. ✅ Create custom collections for your actual application APIs

---

## Benefits of Postman MCP Integration

| Benefit | Description |
|---------|-------------|
| **Unified workflow** | API + UI testing in one conversation with Kiro |
| **Pre-flight checks** | Validate APIs before running UI automation |
| **Test data setup** | Use APIs to create/delete test data for UI tests |
| **Backend validation** | Verify database state after UI actions via API |
| **Faster feedback** | API tests run in milliseconds vs. UI tests in seconds |
| **Traceability** | Link API test results to Azure DevOps work items |
| **Reusability** | Existing Postman collections work with AI orchestration |

---

**Questions?** Ask Kiro:
- "How do I create a new Postman collection via Kiro?"
- "Can you combine API and UI tests in a single workflow?"
- "Show me how to use API data in a Playwright test"
