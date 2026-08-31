# Azure DevOps MCP Integration

## Overview

The official **Microsoft Azure DevOps MCP Server** provides access to work items, pipelines, repos, pull requests, test plans, and wiki directly from Kiro.

## Setup Instructions

### Prerequisites
- Node.js 20.0+ installed
- Azure DevOps organization with PAT (Personal Access Token)
- PAT scopes needed: Work Items (Read/Write), Code (Read), Build (Read), Test Management (Read/Write)

### Step 1: Generate Azure DevOps PAT

1. Go to: `https://dev.azure.com/{your-org}/_usersSettings/tokens`
2. Click "New Token"
3. Set scopes:
   - Work Items: Read & Write
   - Code: Read
   - Build: Read & Execute
   - Test Management: Read & Write
4. Copy the generated token

### Step 2: Configure MCP

Edit `.kiro/settings/mcp.json` and replace the placeholder values:

```json
{
  "mcpServers": {
    "azure-devops": {
      "command": "npx",
      "args": ["-y", "@anthropic/azure-devops-mcp@latest"],
      "env": {
        "AZURE_DEVOPS_ORG": "your-org-name",
        "AZURE_DEVOPS_PAT": "your-pat-token",
        "AZURE_DEVOPS_DEFAULT_PROJECT": "your-project-name"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

### Step 3: Enable the Server

Set `"disabled": false` in the config. Kiro will auto-connect to the server.

### Step 4: Verify

Ask: "List projects in my Azure DevOps org" — if it returns data, the connection works.

## Available Tools (from Microsoft Official MCP)

| Category | Capabilities |
|----------|-------------|
| **Work Items** | Create, read, update, search, link, comment |
| **Repos** | List repos, branches, file content, code search |
| **Pull Requests** | Create, list, review, vote, comment threads |
| **Pipelines** | List builds, get status, queue runs, download artifacts |
| **Test Plans** | Create plans/suites/cases, run tests, update results |
| **Wiki** | List/read/update wiki pages, search |

## How This Integrates with Our Workflows

Once enabled, Azure DevOps MCP can replace or supplement the Jira workflow:

| Current (Jira) | Azure DevOps Equivalent |
|---------------|------------------------|
| `getJiraIssue` | `wit_work_item` (get) |
| `createJiraIssue` | `wit_work_item_write` (create) |
| `addCommentToJiraIssue` | `wit_work_item_comment_write` (add) |
| Zephyr test cases | `testplan_test_case_write` (create) |
| Zephyr test runs | `testplan_test_run_write` (create_run) |

## Alternative: Remote MCP Server (No Local Install)

If your org supports Microsoft Entra ID authentication:

```json
{
  "servers": {
    "ado-remote-mcp": {
      "url": "https://mcp.dev.azure.com/{organization}",
      "type": "http"
    }
  }
}
```

Note: Remote server requires Entra ID and doesn't work with all MCP clients yet.

## Toolset Filtering

Restrict available tools for security:

```json
"args": ["-y", "@anthropic/azure-devops-mcp@latest", "--toolsets", "wit,testplan,pipelines"]
```

Available toolsets: `repos`, `wit`, `pipelines`, `wiki`, `work`, `testplan`, `advsec`
