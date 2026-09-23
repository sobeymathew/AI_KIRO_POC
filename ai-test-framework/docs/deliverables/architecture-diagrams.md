# Architecture Diagrams
## AI-Powered Test Automation Across the Full Lifecycle (Requirement to Result)

**Framework:** Kiro (AI) + Playwright
**Integrations:** Jira + Zephyr Scale · Azure DevOps
**Proven on:** Salesforce Experience Cloud

---

## 1. System Architecture (High-Level)

Four layers work together to turn a requirement into a verified, self-healing automated test.

```mermaid
flowchart TB
    subgraph SRC["1 - Source of Requirement"]
        JIRA["Jira User Story<br/>+ Zephyr Scale"]
        ADO["Azure DevOps<br/>Work Item"]
        DOC["Document / Chat<br/>User Story"]
    end

    subgraph KIRO["2 - Kiro AI Orchestration Layer"]
        STEER["Steering Rules<br/>(standards + workflow)"]
        ENGINE["AI Automation Engine<br/>(reads, plans, generates)"]
        HEALER["Playwright MCP Healer<br/>(live locator discovery)"]
    end

    subgraph AUTO["3 - Playwright Automation Layer"]
        FEAT["Gherkin Feature Files"]
        REPO["Object Repository<br/>(verified locators)"]
        POM["Page Objects (POM)"]
        SPEC["Test Specs"]
    end

    subgraph OUT["4 - Execution + Reporting"]
        RUN["Test Execution<br/>(Chromium / Firefox / WebKit)"]
        ALLURE["Allure + HTML Reports"]
        RESULT["Results published back<br/>to source system"]
    end

    APP["Target Web Application<br/>(e.g. Salesforce Experience Cloud)"]

    JIRA --> ENGINE
    ADO --> ENGINE
    DOC --> ENGINE
    STEER --> ENGINE
    ENGINE --> FEAT
    ENGINE --> HEALER
    HEALER <-->|inspect + verify| APP
    HEALER --> REPO
    REPO --> POM
    FEAT --> SPEC
    POM --> SPEC
    SPEC --> RUN
    RUN <-->|drive UI| APP
    RUN --> ALLURE
    RUN --> RESULT
    RESULT --> JIRA
    RESULT --> ADO
```

---

## 2. End-to-End Process (Requirement to Result)

The complete lifecycle the framework automates, from a requirement to a published result.

```mermaid
flowchart LR
    A["Requirement<br/>Jira / Azure DevOps / Doc"] --> B["Create Test Cases<br/>Zephyr or ADO Test Case"]
    B --> C["Generate Test Steps<br/>Gherkin feature file"]
    C --> D["Discover Elements Live<br/>AI inspects real app"]
    D --> E["Generate Playwright Code<br/>Page Object + Spec"]
    E --> F["Execute Tests<br/>verify real record created"]
    F --> G["Publish Results<br/>back to source system"]
    G --> H["Full Traceability<br/>Requirement to Result"]

    F -.->|locator broken| D
```

The dotted line shows **self-healing**: if a locator breaks during execution, the framework re-inspects the live application and repairs itself before continuing.

---

## 3. Self-Healing Locator Flow

The core innovation — locators are discovered and verified against the live application, not guessed.

```mermaid
flowchart TD
    START["Test needs a locator"] --> CHECK{"Locator works<br/>on live page?"}
    CHECK -->|Yes| USE["Use locator<br/>+ store in repository"]
    CHECK -->|No| NAV["Navigate to live page"]
    NAV --> INSPECT["Inspect DOM<br/>(pierce Shadow DOM)"]
    INSPECT --> TRY["Try locator strategies<br/>aria-label > href > name > data-value"]
    TRY --> VERIFY{"Interaction<br/>succeeds?"}
    VERIFY -->|Yes| UPDATE["Update Object Repository<br/>+ Page Object"]
    VERIFY -->|No| TRY
    UPDATE --> USE
    USE --> DONE["Continue test execution"]
```

---

## 4. Dual ALM Integration (Jira and Azure DevOps)

The same automation engine drives two platforms without changes to the core.

```mermaid
flowchart TB
    ENGINE["Kiro AI Automation Engine<br/>(shared core)"]

    subgraph JPATH["Jira Path"]
        J1["Read Jira User Story"]
        J2["Create Zephyr Test Cases"]
        J3["Post results + screenshots<br/>as Jira comment"]
    end

    subgraph APATH["Azure DevOps Path"]
        A1["Read ADO Work Item"]
        A2["Create linked Test Case<br/>work items (Child)"]
        A3["Post results + screenshots<br/>as work item comment"]
    end

    J1 --> ENGINE
    ENGINE --> J2 --> J3
    A1 --> ENGINE
    ENGINE --> A2 --> A3
```

---

## 5. Technology Stack (At a Glance)

```mermaid
flowchart LR
    subgraph L["Language + Runtime"]
        TS["TypeScript (strict)"]
        NODE["Node.js >= 18"]
    end
    subgraph T["Test + Discovery"]
        PW["Playwright ^1.45"]
        MCP["Playwright MCP Healer"]
        BDD["Gherkin (BDD)"]
    end
    subgraph R["Reporting"]
        AL["Allure"]
        HTML["Playwright HTML"]
        WIN["Winston Logging"]
    end
    subgraph O["Ops"]
        GH["GitHub Actions CI"]
        DOCK["Docker"]
    end

    L --> T --> R --> O
```

---

## Diagram Notes

- Diagrams use [Mermaid](https://mermaid.js.org/) and render in GitHub, VS Code (with a Mermaid extension), and most Markdown viewers.
- The **self-healing loop** (Diagram 2 dotted line, Diagram 3) is the key differentiator versus traditional automation.
- The **dual ALM integration** (Diagram 4) shows a single engine serving both Jira/Zephyr and Azure DevOps teams.
