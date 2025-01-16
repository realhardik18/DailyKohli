import puppeteer from "puppeteer";
import fs from "fs";
import { createObjectCsvWriter } from "csv-writer";

const OdiMatches = "https://stats.espncricinfo.com/ci/engine/player/253802.html?class=2;template=results;type=allround;view=match";
const TestMatches = "https://stats.espncricinfo.com/ci/engine/player/253802.html?class=1;template=results;type=allround;view=match";
const T20Matches = "https://stats.espncricinfo.com/ci/engine/player/253802.html?class=3;template=results;type=allround;view=match";
const matches = [OdiMatches, TestMatches, T20Matches];

// CSV writer setup
const csvWriter = createObjectCsvWriter({
  path: "match_data.csv", // File to write to
  header: [
    { id: "href", title: "Match Link" },
    { id: "Date", title: "Date" },
    { id: "MatchType", title: "Match Type" },
  ],
});

(async () => {
  let allData = []; // Store data from all matches

  for (let i = 0; i < matches.length; i++) {
    const matchType = i === 0 ? "ODI" : i === 1 ? "Test" : "T20";

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Navigate to the matches URL
    await page.goto(matches[i], {
      waitUntil: "domcontentloaded",
    });

    // Wait for the selector to appear on the page
    await page.waitForSelector(".data1");

    // Extract data: last link and dates
    const data = await page.evaluate(() => {
      const rows = document.querySelectorAll(".data1");
      return Array.from(rows).map(row => {
        // Get all links in the row
        const linkElements = row.querySelectorAll("a");
        const lastLink = linkElements[linkElements.length - 1]; // Get the last link
        const href = lastLink ? lastLink.href : null;

        // Get the last two columns (dates)
        const columns = row.querySelectorAll("td");
        const Date = columns[columns.length - 2]?.textContent.trim();

        return {
          href,
          Date,
        };
      });
    });

    // Append match type to each entry and add to allData
    const matchDataWithType = data.map(entry => ({ ...entry, MatchType: matchType }));
    allData.push(...matchDataWithType);

    await browser.close();
  }

  // Write the collected data to CSV
  await csvWriter.writeRecords(allData);

  console.log("Data successfully written to match_data.csv");
})();
