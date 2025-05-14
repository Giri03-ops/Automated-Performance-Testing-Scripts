# 🧪 JMeter Test Automation (Headless CLI Mode)

This repository contains a fully automated setup for running Apache JMeter performance tests using a `.bat` script, with support for:
- Running `.jmx` test plans in headless (non-GUI) mode
- Dynamic results folder creation with timestamps
- Custom CSV data injection via Groovy + JSR223
- Generating HTML dashboards
- Lightweight summary CSV output for reporting
- Easy future integration into CI/CD pipelines

## 📁 Project Structure

```
Jmeter-Automation-Scripts/
├── run_test.bat                # Main script to run test in CLI mode
├── .env                        # Environment config for test
├── PerformanceTesting.jmx      # JMeter test plan
├── Csv_Files/                  # Input test data
│   ├── reservePage.csv
│   ├── purchasePage.csv
│   └── confirmationPage.csv
└── Results/                    # Output folder (auto-generated per run)
    └── 2025-05-14_13-45-22/
        ├── html_report/
        ├── 2025-05-14_13-45-22_results.jtl
        └── 2025-05-14_13-45-22_summary.csv
```

## ⚙️ Configuration: `.env` File

```ini
TEST_PLAN_FILE=PerformanceTesting.jmx
DATA_DIR=C:\Jmeter-Automation-Scripts\Csv_Files
RESULTS_DIR=C:\Jmeter-Automation-Scripts\Results
```

Edit this file to point to your .jmx and CSV directories.

## 🚀 Running the Test

Requires JMeter 5.6.3 or later to be installed and added to system PATH.

From cmd or PowerShell:

```sh
cd C:\Jmeter-Automation-Scripts
run_test.bat
```

This will:
1. Load your .env configuration
2. Run the JMeter test in headless mode
3. Generate:
   - .jtl raw result log
   - HTML dashboard in html_report/
   - Summary CSV file (if Summary Report is configured)
4. Open the HTML dashboard in your browser

## 📊 Generating a Summary CSV Report

To generate a summary report per run:

1. Open your .jmx in JMeter GUI
2. Add ➝ Listener ➝ Summary Report
3. Enable "Write results to file"
4. Set filename to:
   ```
   ${__P(summaryReport)}
   ```
5. Save the test plan.

The batch script automatically sets the variable and saves the output to:
```
Results/<timestamp>/<timestamp>_summary.csv
```

## 🧠 Notes on Memory Usage

✅ It is safe to use Summary Report in headless mode with file output only.

❌ Do not use View Results Tree, Aggregate Report, or GUI listeners in non-GUI (-n) runs — they consume a lot of memory and may crash JMeter.

✅ Transaction Controller with "Generate parent sample" is recommended for clean .jtl logs and dashboard metrics.

## 🐳 Docker & CI/CD

This setup can be extended for DevOps pipelines using Docker:

```bash
docker run --rm -v %CD%:/test -w /test justb4/jmeter \
  -n -t PerformanceTesting.jmx \
  -l results/result.jtl \
  -JcsvDir=Csv_Files \
  -JsummaryReport=results/summary.csv \
  -e -o results/html_report
```

You can also integrate run_test.bat logic into:
- GitHub Actions
- Azure DevOps
- GitLab CI
- Jenkins Pipelines

## 📬 Output Files per Run

Every test execution creates:

| File | Purpose |
|------|---------|
| results.jtl | Raw request/response timing data |
| summary.csv | Lightweight report with metrics like Avg, Min, Max, Throughput |
| html_report/index.html | Human-readable dashboard |

## 👥 Maintainers

- Author: Giridhar Kumanan Chettiar
- Last Updated: 2025-05-14

## ✅ Recommendations

- Always run JMeter via CLI for performance testing
- Keep data files in a versioned Csv_Files/ folder
- Use timestamped folders to keep historical reports
- Monitor memory usage and use Docker for consistency