import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const regno = searchParams.get("regno");
  const pdfUrl = `https://api.nexusserp.com/api/certificates/generate_certificate.php?regno=${regno}`;

  // Setup chromium
  const executablePath = await chromium.executablePath();
  console.log(executablePath);
  // Launch the browser
  const browser = await puppeteer.launch({
    args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
    defaultViewport: chromium.defaultViewport,
    executablePath,
    headless: true,
  });

  const page = await browser.newPage();

  // Open the PDF
  await page.goto(pdfUrl, { waitUntil: "networkidle0" });

  // Take a screenshot
  const screenshot = await page.screenshot({
    type: "png",
    captureBeyondViewport: true,
    clip: { x: 320, y: 60, height: 540, width: 480 },
    fromSurface: true,
    omitBackground: true,
  });

  await browser.close();

  return new NextResponse(screenshot, {
    headers: {
      "Content-Type": "image/png",
    },
  });
}
