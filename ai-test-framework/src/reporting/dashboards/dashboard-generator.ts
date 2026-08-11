import * as fs from 'fs';
import * as path from 'path';

/**
 * Dashboard Generator - Creates analytics dashboards from test execution data.
 * Run via: npm run generate:report
 */
interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  retries: number;
}

interface DashboardData {
  generatedAt: string;
  summary: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    passRate: number;
    failureRate: number;
    totalDuration: number;
    averageDuration: number;
  };
  failedTests: {
    name: string;
    error: string;
    duration: number;
  }[];
  flakyTests: {
    name: string;
    retryCount: number;
  }[];
  categoryBreakdown: {
    smoke: { total: number; passed: number };
    sanity: { total: number; passed: number };
    regression: { total: number; passed: number };
    e2e: { total: number; passed: number };
  };
  trends: {
    date: string;
    passRate: number;
    totalTests: number;
    duration: number;
  }[];
}

class DashboardGenerator {
  private resultsPath: string;
  private outputPath: string;

  constructor() {
    this.resultsPath = path.resolve(
      __dirname,
      '../artifacts/logs/test-results.json'
    );
    this.outputPath = path.resolve(__dirname, 'dashboard-data.json');
  }

  /** Generate dashboard data from test results */
  generate(): void {
    console.log('Generating dashboard...');

    const results = this.loadResults();
    if (!results || results.length === 0) {
      console.log('No test results found. Generating empty dashboard.');
      this.saveEmptyDashboard();
      return;
    }

    const dashboard = this.buildDashboard(results);
    this.save(dashboard);
    console.log(`Dashboard generated at: ${this.outputPath}`);
  }

  /** Load test results from JSON file */
  private loadResults(): TestResult[] {
    if (!fs.existsSync(this.resultsPath)) {
      return [];
    }

    const raw = JSON.parse(fs.readFileSync(this.resultsPath, 'utf-8'));
    // Playwright JSON reporter format
    if (raw.suites) {
      return this.parsePlaywrightResults(raw);
    }
    return [];
  }

  /** Parse Playwright JSON reporter output */
  private parsePlaywrightResults(raw: Record<string, unknown>): TestResult[] {
    const results: TestResult[] = [];

    const processSpecs = (suites: any[]) => {
      for (const suite of suites) {
        if (suite.specs) {
          for (const spec of suite.specs) {
            for (const test of spec.tests || []) {
              results.push({
                name: `${suite.title} > ${spec.title}`,
                status: test.status || 'skipped',
                duration: test.results?.[0]?.duration || 0,
                error: test.results?.[0]?.error?.message,
                retries: (test.results?.length || 1) - 1,
              });
            }
          }
        }
        if (suite.suites) {
          processSpecs(suite.suites);
        }
      }
    };

    processSpecs((raw as any).suites || []);
    return results;
  }

  /** Build dashboard data from results */
  private buildDashboard(results: TestResult[]): DashboardData {
    const total = results.length;
    const passed = results.filter((r) => r.status === 'passed').length;
    const failed = results.filter((r) => r.status === 'failed').length;
    const skipped = results.filter((r) => r.status === 'skipped').length;
    const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

    return {
      generatedAt: new Date().toISOString(),
      summary: {
        total,
        passed,
        failed,
        skipped,
        passRate: total > 0 ? Math.round((passed / total) * 100) : 0,
        failureRate: total > 0 ? Math.round((failed / total) * 100) : 0,
        totalDuration,
        averageDuration: total > 0 ? Math.round(totalDuration / total) : 0,
      },
      failedTests: results
        .filter((r) => r.status === 'failed')
        .map((r) => ({
          name: r.name,
          error: r.error || 'Unknown error',
          duration: r.duration,
        })),
      flakyTests: results
        .filter((r) => r.retries > 0)
        .map((r) => ({
          name: r.name,
          retryCount: r.retries,
        })),
      categoryBreakdown: this.getCategoryBreakdown(results),
      trends: this.loadHistoricalTrends(),
    };
  }

  /** Break down results by test category */
  private getCategoryBreakdown(results: TestResult[]) {
    const categorize = (keyword: string) => {
      const matching = results.filter((r) =>
        r.name.toLowerCase().includes(keyword)
      );
      return {
        total: matching.length,
        passed: matching.filter((r) => r.status === 'passed').length,
      };
    };

    return {
      smoke: categorize('smoke'),
      sanity: categorize('sanity'),
      regression: categorize('regression'),
      e2e: categorize('e2e'),
    };
  }

  /** Load historical trend data */
  private loadHistoricalTrends() {
    const trendsPath = path.resolve(__dirname, '../analytics/trends.json');
    if (fs.existsSync(trendsPath)) {
      return JSON.parse(fs.readFileSync(trendsPath, 'utf-8'));
    }
    return [];
  }

  /** Save dashboard data */
  private save(data: DashboardData): void {
    fs.writeFileSync(this.outputPath, JSON.stringify(data, null, 2));
  }

  /** Save empty dashboard when no results exist */
  private saveEmptyDashboard(): void {
    const empty: DashboardData = {
      generatedAt: new Date().toISOString(),
      summary: {
        total: 0, passed: 0, failed: 0, skipped: 0,
        passRate: 0, failureRate: 0, totalDuration: 0, averageDuration: 0,
      },
      failedTests: [],
      flakyTests: [],
      categoryBreakdown: {
        smoke: { total: 0, passed: 0 },
        sanity: { total: 0, passed: 0 },
        regression: { total: 0, passed: 0 },
        e2e: { total: 0, passed: 0 },
      },
      trends: [],
    };
    this.save(empty);
  }
}

// Execute
const generator = new DashboardGenerator();
generator.generate();
