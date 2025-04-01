import puppeteer from "puppeteer-core";
import { NextRequest, NextResponse } from "next/server";
import chromium from "@sparticuz/chromium";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const regno = searchParams.get("regno");
  const pdfUrl = `https://api.nexusserp.com/api/certificates/generate_certificate.php?regno=${regno}`;

  const executablePath = await chromium.executablePath();

  // Launch the browser
  const browser = await puppeteer.launch({
    ...chromium,
    executablePath,
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
