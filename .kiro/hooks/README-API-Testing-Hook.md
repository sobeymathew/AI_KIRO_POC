# Unified API Testing Hook

**One hook. All features. Zero confusion.**

---

## 🎯 What It Does

**ONE hook** that automatically:
1. ✅ Detects when you want to test an API
2. ✅ Connects to your Postman account
3. ✅ Generates 23+ comprehensive test scenarios
4. ✅ Runs all tests
5. ✅ Updates your Postman collection
6. ✅ Shows detailed results
7. ✅ Saves a report

---

## 🚀 How to Use It

### Method 1: Just Talk Naturally

Say anything like:
```
"test the User API"
"test my Postman endpoint"
"validate the API"
"check the API response"
"run API tests"
```

**The hook automatically:**
- Figures out which API you mean
- Tests it comprehensively
- Shows you the results

### Method 2: Use Commands

**For testing:**
```
/test-api
/test-api User API
/test-api https://api.example.com/users
```

**For reports:**
```
/api-report
```

---

## 📊 What Gets Tested (Automatic)

Every API test includes **26+ scenarios** across **8 categories:**

| # | Category | Tests | Examples |
|---|----------|-------|----------|
| 1 | Happy Path | 3 | Status code, response time, content-type |
| 2 | Response Structure | 5 | Schema, data types, required fields, formats |
| 3 | Data Validation | 4 | Non-empty, unique IDs, value ranges |
| 4 | Performance | 3 | < 500ms, < 1000ms, < 2000ms |
| 5 | Security | 2 | HTTPS, no sensitive data exposure |
| 6 | Header Validation | 3 | Content-Type, CORS, Cache-Control |
| 7 | Edge Cases | 3 | Empty data, special chars, parsing |
| 8 | Negative Tests | 3 | 404, 405, 400 errors (optional) |

**Total: 26 comprehensive tests**

---

## 📝 Example Usage

### Example 1: Natural Language
```
You: "test the User API in my Postman collection"

Hook: ✅ Activates automatically
       ✅ Connects to Postman
       ✅ Finds "User API"
       ✅ Generates 23 tests
       ✅ Runs all tests
       ✅ Shows results: 20 passed, 3 failed (87.5%)
       ✅ Saves report to ai-test-framework/postman/
```

### Example 2: Command
```
You: "/test-api"

Kiro: "Which API would you like to test?"

You: "User API"

Hook: ✅ Executes full workflow
       ✅ Results displayed
```

### Example 3: Generate Report
```
You: "/api-report"

Hook: ✅ Generates comprehensive markdown report
       ✅ Saves to ai-test-framework/postman/
```

---

## 🎯 Keywords That Trigger the Hook

The hook activates when you say:

**Commands:**
- `/test-api`
- `/api-report`

**Natural Language:**
- "test API"
- "test endpoint"
- "validate API"
- "check API"
- "run API test"
- "test Postman"
- "API testing"

**Any combination like:**
- "test the XYZ API"
- "validate my endpoint"
- "run Postman tests"
- "check API response"

---

## 📊 What You Get Back

### 1. Execution Summary
```
✅ Tests Passed: 20/23 (87.5%)
❌ Tests Failed: 3/23
⏱️  Duration: 3.8s
🎯 API: User API (GET /users)
```

### 2. Coverage Matrix
```
| Category          | Tests | Passed | Failed | Coverage |
|-------------------|-------|--------|--------|----------|
| Happy Path        | 3     | 3      | 0      | 100%     |
| Response Structure| 5     | 5      | 0      | 100%     |
| Data Validation   | 4     | 4      | 0      | 100%     |
| Performance       | 3     | 1      | 2      | 33%      |
| Security          | 2     | 2      | 0      | 100%     |
| Headers           | 3     | 2      | 1      | 67%      |
| Edge Cases        | 3     | 3      | 0      | 100%     |
```

### 3. Failed Tests Details
- What failed
- Why it failed
- How to fix it

### 4. Recommendations
- Performance improvements
- Security concerns
- Missing coverage
- Integration opportunities

### 5. Markdown Report
**Saved to:** `ai-test-framework/postman/[API-Name]-Report.md`

---

## 🔧 Configuration

**Hook File:** `.kiro/hooks/unified-api-testing.json`

**Trigger:** UserPromptSubmit (on any message you send)

**Matcher (Keywords):**
```regex
(?i)(^/test-api|^/api-report|test.*(api|endpoint|postman)|api.*(test|validate|check)|run.*(api|postman)|validate.*api|check.*api|comprehensive.*api.*test)
```

**Activation:** Automatic on session start

---

## ✅ What Makes This Better Than 3 Hooks

| Before (3 hooks) | Now (1 hook) |
|------------------|--------------|
| Hook 1: Auto-trigger | ✅ Included |
| Hook 2: /test-api command | ✅ Included |
| Hook 3: /api-report command | ✅ Included |
| **Confusing** | **Simple** |
| **3 files to manage** | **1 file** |
| **Overlap and duplication** | **Clean and unified** |

---

## 🎓 Quick Reference

| To do this... | Say this... | Result |
|---------------|-------------|--------|
| Test any API | "test the [name] API" | Full testing workflow |
| Use command | `/test-api` | Prompts for API, then tests |
| Test direct URL | "test https://api.url" | Tests the URL |
| Generate report | `/api-report` | Creates markdown report |
| Test from Postman | "test User API in Postman" | Finds & tests from collection |

---

## 📚 Files

| File | Purpose |
|------|---------|
| `.kiro/hooks/unified-api-testing.json` | The one and only hook |
| `.kiro/hooks/README-API-Testing-Hook.md` | This documentation |
| `ai-test-framework/postman/*.md` | Generated test reports |

---

## 🚀 Get Started

1. **The hook is already created** ✅
2. **Restart your Kiro session** (or it auto-activates next session)
3. **Say:** "test the User API"
4. **Watch:** Automatic comprehensive testing!

---

## 💡 Tips

### DO:
✅ Use natural language - it just works  
✅ Say the API name clearly  
✅ Check the reports in `postman/` folder  
✅ Review failed tests for improvement areas  

### DON'T:
❌ Worry about exact keywords - the hook is smart  
❌ Manually write tests - the hook does it all  
❌ Skip the reports - they're valuable documentation  

---

## 🆘 Troubleshooting

**Hook not triggering?**
- Make sure you use one of the trigger keywords
- Try `/test-api` command instead
- Check if hook is enabled in `.kiro/hooks/` folder

**Tests failing?**
- Check Postman MCP connection (API key valid?)
- Verify API endpoint is accessible
- Review error details in the results

**Report not generating?**
- Run `/api-report` after tests complete
- Check `ai-test-framework/postman/` folder
- Verify folder exists and has write permissions

---

## 🎉 Summary

**ONE hook does it ALL:**
- Auto-detects API testing intent
- Supports natural language AND commands
- Generates comprehensive tests (23+)
- Runs tests and shows results
- Updates Postman collection
- Saves detailed reports
- Provides recommendations

**Just say "test API" and it handles the rest!**

---

**Created:** September 23, 2026  
**Version:** Unified v1.0  
**Status:** Active and ready to use
