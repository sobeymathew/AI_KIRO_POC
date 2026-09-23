/**
 * Generates the business document as a formatted Word (.docx) file.
 * Run: node docs/deliverables/generate-docx.js
 */
const fs = require("fs");
const path = require("path");
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  ShadingType,
  ImageRun,
} = require("docx");

// Rendered diagram PNGs and their intrinsic pixel dimensions
const DIAGRAMS = [
  { file: "1-system-architecture.png", w: 2352, h: 2223, caption: "Figure 1 — System Architecture (four layers)" },
  { file: "2-end-to-end-process.png", w: 2352, h: 165, caption: "Figure 2 — End-to-End Process (Requirement to Result)" },
  { file: "3-self-healing.png", w: 1053, h: 3966, caption: "Figure 3 — Self-Healing Locator Flow" },
  { file: "4-dual-alm.png", w: 2352, h: 1239, caption: "Figure 4 — Dual ALM Integration (Jira and Azure DevOps)" },
  { file: "5-tech-stack.png", w: 2352, h: 144, caption: "Figure 5 — Technology Stack" },
];

// Fit an image within the page content box (in px), preserving aspect ratio.
const MAX_W = 600; // ~6.25in content width
const MAX_H = 760; // keep a diagram on a single page
function fitDimensions(w, h) {
  let scale = Math.min(MAX_W / w, MAX_H / h, 1);
  return { width: Math.round(w * scale), height: Math.round(h * scale) };
}

function diagramImage(d) {
  const dims = fitDimensions(d.w, d.h);
  const data = fs.readFileSync(path.join(__dirname, "diagrams", d.file));
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 40 },
    children: [
      new ImageRun({ type: "png", data, transformation: dims }),
    ],
  });
}

function caption(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [new TextRun({ text, italics: true, size: 18, color: "666666" })],
  });
}

const BRAND = "2E5F9E";
const HEADER_FILL = "2E5F9E";
const ROW_ALT = "F2F5FA";

function title(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 120 },
    children: [new TextRun({ text, bold: true, size: 40, color: BRAND })],
  });
}

function subtitle(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 240 },
    children: [new TextRun({ text, size: 26, color: "555555" })],
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 280, after: 120 },
    children: [new TextRun({ text, bold: true, size: 28, color: BRAND })],
  });
}

function para(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, size: 22, ...opts })],
  });
}

function bullet(text) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, size: 22 })],
  });
}

function cell(text, { header = false, fill } = {}) {
  return new TableCell({
    shading: fill ? { type: ShadingType.CLEAR, color: "auto", fill } : undefined,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text,
            bold: header,
            size: 20,
            color: header ? "FFFFFF" : "222222",
          }),
        ],
      }),
    ],
  });
}

function table(headers, rows) {
  const border = { style: BorderStyle.SINGLE, size: 2, color: "D0D7E2" };
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: border,
      bottom: border,
      left: border,
      right: border,
      insideHorizontal: border,
      insideVertical: border,
    },
    rows: [
      new TableRow({
        tableHeader: true,
        children: headers.map((h) => cell(h, { header: true, fill: HEADER_FILL })),
      }),
      ...rows.map(
        (r, i) =>
          new TableRow({
            children: r.map((c) => cell(c, { fill: i % 2 ? ROW_ALT : undefined })),
          })
      ),
    ],
  });
}

const children = [];

children.push(title("AI-Powered Test Automation Across the Full Lifecycle"));
children.push(subtitle("Requirement to Result — Proof of Concept Outcome"));
children.push(para("Prepared for: Management / Leadership", { bold: true }));
children.push(para("Prepared by: QA Automation Team"));
children.push(para("Date: September 2026"));
children.push(para("Status: PoC Complete — Validated"));

// 1
children.push(h1("1. Executive Summary"));
children.push(
  para(
    "We set out to answer one question: can AI meaningfully speed up and simplify web application testing? The Proof of Concept confirms it can."
  )
);
children.push(
  para(
    "We built a general-purpose automation framework using Kiro (AI) and Playwright that turns a requirement into a working, self-maintaining automated test in minutes instead of days. It covers the entire testing lifecycle — from reading the requirement, through test case creation, code generation, and execution, to publishing results back to the source system."
  )
);
children.push(
  para(
    "The framework integrates with both Jira + Zephyr Scale and Azure DevOps, so teams keep their existing tools with no change to the automation engine. To prove it works on a hard problem, we validated it on Salesforce Experience Cloud, one of the most complex platforms to automate."
  )
);
children.push(para("Result: a 100% pass rate and roughly a 95% reduction in automation effort.", { bold: true }));

// 2
children.push(h1("2. Business Value at a Glance"));
children.push(
  table(
    ["Outcome", "Detail"],
    [
      ["100% pass rate", "Every test confirmed by creating a real record in the application"],
      ["~95% less effort", "Automating a user story dropped from 1–2 days to about 6–10 minutes"],
      ["Self-healing", "The framework repairs broken locators automatically when the UI changes"],
      ["Dual ALM support", "Runs end-to-end from both Jira and Azure DevOps"],
      ["Application-agnostic", "Works on virtually any web application, proven on the hardest case"],
    ]
  )
);

// 3
children.push(h1("3. The Problem"));
children.push(para("Traditional test automation is slow and fragile, regardless of the application:"));
children.push(bullet("Manual test authoring takes 1–2 days per user story."));
children.push(bullet("Locators break with every UI change, and fixing them consumes most of the automation effort."));
children.push(bullet("Complex modern applications (single-page apps, Shadow DOM, iframes) defeat standard tooling."));
children.push(bullet("Getting from a requirement to a working test involves multiple manual handoffs across several tools."));
children.push(
  para(
    "These challenges apply to any modern web application — customer portals, banking and insurance platforms, e-commerce, and enterprise systems alike."
  )
);

// 4
children.push(h1("4. The Solution — A Complete, AI-Driven Lifecycle"));
children.push(para("The framework acts as an AI automation engineer that runs the full process end to end:"));
children.push(bullet("Reads the requirement — from a Jira User Story, an Azure DevOps Work Item, or a document."));
children.push(bullet("Creates test cases — in Zephyr Scale (Jira) or as linked Test Case work items (Azure DevOps)."));
children.push(bullet("Generates detailed test steps — as business-readable Gherkin scenarios."));
children.push(bullet("Discovers elements on the live application — AI navigates the real app and verifies each element by interacting with it."));
children.push(bullet("Generates Playwright automation code — following the industry-standard Page Object Model."));
children.push(bullet("Executes the tests — verifying success by creating a real record in the application."));
children.push(bullet("Publishes results back — to Jira or Azure DevOps, including screenshots on failure."));
children.push(para("This delivers complete traceability from requirement to result with minimal manual effort.", { bold: true }));

// 5
children.push(h1("5. Key Innovation — Self-Healing Locators"));
children.push(
  para(
    "The breakthrough is that the framework does not guess how to find elements. It navigates the live application, inspects the real page (including Shadow DOM and iframes), and confirms each locator by actually using it."
  )
);
children.push(
  para(
    "When the UI changes and a locator breaks, the framework re-inspects the live page and repairs itself — dramatically reducing the maintenance burden that normally dominates automation work."
  )
);
children.push(
  table(
    ["Traditional Approach", "Our Approach"],
    [
      ["Guess locators from developer tools", "AI interacts with the live page"],
      ["Struggles with Shadow DOM and complex apps", "Handles Shadow DOM, iframes, dynamic content"],
      ["Breaks on UI changes", "Self-heals by re-inspecting"],
      ["Manual fixes needed", "Automatically finds working alternatives"],
    ]
  )
);

// 6
children.push(h1("6. Proof of Value — Salesforce Case Study"));
children.push(
  para(
    "We deliberately chose Salesforce Experience Cloud because it represents a worst-case difficulty for automation: deeply nested Shadow DOM, dynamic dependent form fields, custom dropdowns with no accessible text, and constant background network activity."
  )
);
children.push(para("Business workflows automated end-to-end:"));
children.push(
  table(
    ["Scenario", "Source", "Status"],
    [
      ["Certificate of Insurance Request", "Jira ticket", "Passing"],
      ["Expense Request", "Document", "Passing"],
      ["Request Assessments", "Document", "Passing"],
      ["Facilities Request", "Document", "Passing"],
      ["Security Exception Request", "Jira ticket", "Passing"],
    ]
  )
);
children.push(para("The takeaway: if the framework handles Salesforce, it can handle virtually any web application.", { bold: true }));

// 7
children.push(h1("7. Business Impact"));
children.push(
  table(
    ["Activity", "Traditional", "AI-Driven", "Improvement"],
    [
      ["Understand requirement", "30 min", "seconds", "~99%"],
      ["Create test cases", "2 hours", "seconds", "~99%"],
      ["Discover locators", "4 hours", "~3 min", "~98%"],
      ["Build automation", "4 hours", "~1 min", "~99%"],
      ["Heal a broken locator", "1–4 hours", "~2 min", "~97%"],
      ["Total per user story", "1–2 days", "6–10 min", "~95%"],
    ]
  )
);

// 8 - Architecture Overview (embedded diagrams)
children.push(h1("8. Architecture Overview"));
children.push(
  para(
    "The diagrams below illustrate how the framework turns a requirement into a verified, self-healing automated test across the full lifecycle, and how a single engine serves both Jira and Azure DevOps."
  )
);
for (const d of DIAGRAMS) {
  children.push(diagramImage(d));
  children.push(caption(d.caption));
}

// 9
children.push(h1("9. Demonstrations Delivered"));
children.push(para("The framework was presented in two sessions:"));
children.push(bullet("TechExchange — internal technical showcase."));
children.push(bullet("WestPoint — client demonstration."));
children.push(para("Both demonstrated the complete requirement-to-result flow on a live application."));

// 10
children.push(h1("10. Next Steps"));
children.push(para("The framework is ready to extend to additional applications and modules. Planned enhancements:"));
children.push(bullet("API test automation integration."));
children.push(bullet("SQL / database validation integration."));

// 11
children.push(h1("11. Conclusion"));
children.push(
  para(
    "This PoC demonstrates a reusable, general-purpose framework that automates the entire testing lifecycle for any web application. The Salesforce case study proves it handles even the most challenging environments. The efficiency gains — a 100% pass rate and roughly 95% less effort — translate directly into faster delivery, lower maintenance cost, and higher confidence in quality."
  )
);

const doc = new Document({
  creator: "QA Automation Team",
  title: "AI-Powered Test Automation Across the Full Lifecycle",
  description: "PoC Outcome — Requirement to Result",
  sections: [
    {
      properties: { page: { margin: { top: 1000, bottom: 1000, left: 1000, right: 1000 } } },
      children,
    },
  ],
});

const outPath = path.join(__dirname, "AI-Test-Automation-Business-Document.docx");
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outPath, buffer);
  console.log("Wrote " + outPath);
});
