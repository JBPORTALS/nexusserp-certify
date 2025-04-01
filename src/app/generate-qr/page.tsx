"use client";

// import { notFound } from "next/navigation";

import { ChangeEventHandler, useState } from "react";
import QRCode from "qrcode";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

export default function Home() {
  const [regNumbers, setRegNumbers] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [excelFile, setExcelFile] = useState<File | null>(null);

  const handleFileUpload: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExcelFile(file);
    setStatus(`File selected: ${file.name}`);
  };

  const readExcelFile = async () => {
    if (!excelFile) {
      setStatus("Please select an Excel file first");
      return;
    }

    setLoading(true);
    setStatus("Reading Excel file...");

    try {
      const data = await excelFile.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: Record<any, any>[] = XLSX.utils.sheet_to_json(worksheet);

      // Try to find a column that might contain registration numbers
      // First look for columns with common names, then fall back to first column
      let regNoColumn = null;
      const possibleColumns = [
        "Register No",
        "regno",
        "registration number",
        "registrationnumber",
        "reg",
      ];

      // Check for columns with names like "regno", "registration", etc.
      const columns = Object.keys(jsonData[0] || {});
      for (const possible of possibleColumns) {
        const match = columns.find(
          (col) => col.toLowerCase().replace(/[^a-z0-9]/g, "") === possible
        );
        if (match) {
          regNoColumn = match;
          break;
        }
      }

      // If no matching column found, use the first column
      if (!regNoColumn && columns.length > 0) {
        regNoColumn = columns[0];
      }

      if (!regNoColumn) {
        setStatus(
          "Could not find a column with registration numbers in the Excel file"
        );
        setLoading(false);
        return;
      }

      console.log(jsonData, regNoColumn);

      // Extract registration numbers from the identified column
      const regNos = jsonData
        .map((row) => String(row["Register No"]))
        .filter(Boolean);

      if (regNos.length === 0) {
        setStatus("No registration numbers found in the Excel file");
        setLoading(false);
        return;
      }

      // Set the extracted registration numbers in the textarea
      setRegNumbers(regNos.join("\n"));
      setStatus(
        `Successfully extracted ${regNos.length} registration numbers from column "${regNoColumn}"`
      );
    } catch (error: any) {
      setStatus(`Error reading Excel file: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generateQRCodes = async () => {
    if (!regNumbers.trim()) {
      setStatus("Please enter registration numbers or import from Excel");
      return;
    }

    setLoading(true);
    setStatus("Generating QR codes...");

    try {
      // Parse registration numbers (accepts numbers separated by comma, space, or new line)
      const regNos = regNumbers
        .split(/[\n,\s]+/)
        .map((no) => no.trim())
        .filter((no) => no);

      if (regNos.length === 0) {
        setStatus("No valid registration numbers found");
        setLoading(false);
        return;
      }

      // Create a zip file to store all QR codes
      const zip = new JSZip();
      const folder = zip.folder("qrcodes");

      // Generate QR code for each registration number
      for (const regNo of regNos) {
        const url = `https://certify.beetopic.in/${regNo}`;

        // Generate QR code as data URL
        const qrDataUrl = await QRCode.toDataURL(url, {
          width: 300,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        });

        // Convert data URL to binary data
        const binaryData = atob(qrDataUrl.split(",")[1]);
        const array = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
          array[i] = binaryData.charCodeAt(i);
        }

        // Add to zip
        folder?.file(`${regNo}.png`, array, { binary: true });
      }

      // Generate and download the zip file
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "qrcodes.zip");

      setStatus(`Successfully generated ${regNos.length} QR codes`);
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">QR Code Generator</h1>

      <div className="mb-6 p-4 border rounded bg-gray-50">
        <h2 className="text-lg font-semibold mb-2">Import from Excel</h2>
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          <button
            onClick={readExcelFile}
            disabled={!excelFile || loading}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
          >
            Import
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Upload an Excel file with a column containing registration numbers
        </p>
      </div>

      <div className="mb-4">
        <label className="block mb-2">
          Enter registration numbers (one per line or comma-separated):
        </label>
        <textarea
          className="w-full p-2 border rounded h-48"
          value={regNumbers}
          onChange={(e) => setRegNumbers(e.target.value)}
          placeholder="e.g. REG001&#10;REG002&#10;REG003"
        />
      </div>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
        onClick={generateQRCodes}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate QR Codes"}
      </button>

      {status && <div className="mt-4 p-3 bg-gray-100 rounded">{status}</div>}
    </div>
  );
}

// export default function Page() {
//   notFound();
// }
