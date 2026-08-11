# Framework Architecture Standards

## Overview

This enterprise AI-driven test automation framework follows a modular architecture with four core modules orchestrated by Kiro AI through steering documents and skills.

## Architecture Principles

1. **Separation of Concerns** - Each module has a single responsibility
2. **Loose Coupling** - Modules communicate through well-defined interfaces
3. **High Cohesion** - Related functionality is grouped together
4. **DRY (Don't Repeat Yourself)** - Maximize reusability across modules
5. **AI-First Design** - Every module is designed for AI agent interaction

## Kiro Orchestration

The `.kiro/` directory contains:
- **Steering Documents** - Define standards, conventions, and constraints that Kiro always follows
- **Skills** - Detailed process guides for specific capabilities (each skill includes role, responsibilities, process, rules, and templates)
- **Prompts** - Reusable prompt templates for common AI-driven tasks

Each skill document acts as both the "what to do" and "who does it" — combining role responsibilities with step-by-step process guidance.

## Module Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    KIRO AI ORCHESTRATION                      │
│        (Steering Documents │ Skills │ Prompts)               │
└─────────────────────────┬───────────────────────────────────┘
                          │
    ┌─────────────────────┼─────────────────────┐
    │                     │                     │
    ▼                     ▼                     ▼
┌──────────┐    ┌──────────────┐    ┌──────────────┐
│Test Case │    │ Web Scraping │    │  Playwright  │
│Management│───▶│& Object Repo │───▶│  Automation  │
└────┬─────┘    └──────────────┘    └──────┬───────┘
     │                                      │
     └──────────────┐    ┌─────────────────┘
                    ▼    ▼
              ┌──────────────┐
              │  Reporting & │
              │  Analytics   │
              └──────────────┘
```

## Data Flow

1. Requirements enter via Test Case Management
2. Web Scraping discovers application structure
3. Playwright consumes test cases and locators
4. Reporting aggregates all execution data

## Skill Workflow

```
Requirement Analysis → User Story Analysis → Test Scenario Generation
    → Test Case Generation → Gherkin Feature Generation
        → Page Object Generation → Playwright Code Generation
            → Reporting → Failure Analysis
```

Supporting skills feed into this pipeline:
- Web Scraping → Locator Generation → Page Object Generation
- Test Data Generation → Playwright Code Generation

## Technology Stack

- **Language**: TypeScript 5.5+
- **Test Runner**: Playwright Test
- **Reporting**: Allure + Custom HTML
- **Web Scraping**: Cheerio + Playwright
- **CI/CD**: GitHub Actions, Azure DevOps, Jenkins
- **Containerization**: Docker

## File Organization Rules

- All source code lives under `src/`
- Each module has its own top-level directory
- Shared types go in `src/config/types/`
- Environment configs go in `src/config/`
- Generated artifacts go in respective `artifacts/` directories
- Kiro steering and skills live in `.kiro/`
